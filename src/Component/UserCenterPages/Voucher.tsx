import { useState, useMemo, useEffect } from "react";
import { Tabs, Card, Row, Col, Tag, Empty } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import globalErrorHandler from "../../utils/globalAxiosErrorHandler";
import toast from "react-hot-toast";
import { getVouchersService } from "../../services/coupon";
import type { UserVoucherItem } from "../../types/coupon";
import { Loading } from "../LoadingFallback";
dayjs.extend(relativeTime);
dayjs.extend(duration);

const Voucher = () => {
    const [vouchers, setVouchers] = useState<UserVoucherItem[]>([]);
    const [activeTab, setActiveTab] = useState("active"); // 当前选中的tab
    const [sortBy, setSortBy] = useState<"expire" | "amount" | "status" | null>(null); // 当前排序方式
    const [countdown, setCountdown] = useState<Record<string, string>>({}); // 优惠券倒计时
    const [loading, setLoading] = useState(true); // 加载状态

    const now = dayjs();

    useEffect(() => {
        const fetchVoucherData = async () => {
            try {
                const vouchersData = await getVouchersService();
                setVouchers(vouchersData.items);
            } catch (error) {
                globalErrorHandler.handle(error, toast.error);
            } finally {
                setLoading(false);
            }
        };
        setTimeout(fetchVoucherData, 200);
    }, []);

    // 筛选有效和已过期代金券 - 根据 UserVoucherItem 结构调整
    const activeVouchers = useMemo(() => {
        return vouchers.filter((v) => 
            v.status === true && dayjs(v.voucher.endTime).isAfter(now)
        );
    }, [vouchers, now]);

    const expiredVouchers = useMemo(() => {
        return vouchers.filter((v) => 
            v.status === false || dayjs(v.voucher.endTime).isBefore(now)
        );
    }, [vouchers, now]);

    // 排序逻辑 - 根据 UserVoucherItem 结构调整
    const sortedActive = useMemo(() => {
        const arr = [...activeVouchers];

        switch (sortBy) {
            case "expire":
                arr.sort((a, b) => 
                    dayjs(a.voucher.endTime).valueOf() - dayjs(b.voucher.endTime).valueOf()
                );
                break;
            case "amount":
                arr.sort((a, b) => b.remainAmount - a.remainAmount);
                break;
            case "status":
                // 按状态排序：有效的在前
                arr.sort((a, b) => Number(b.status) - Number(a.status));
                break;
            default:
                arr.sort((a, b) => 
                    dayjs(a.voucher.endTime).valueOf() - dayjs(b.voucher.endTime).valueOf()
                );
        }

        return arr;
    }, [activeVouchers, sortBy]);

    // 倒计时更新逻辑
    useEffect(() => {
        const timer = setInterval(() => {
            const newCountdown: Record<string, string> = {};
            activeVouchers.forEach((v) => {
                const endTime = dayjs(v.voucher.endTime);
                const diff = endTime.diff(dayjs());

                if (diff > 0) {
                    const durationObj = dayjs.duration(diff);
                    const days = Math.floor(durationObj.asDays());
                    const hours = durationObj.hours();
                    const minutes = durationObj.minutes();
                    const seconds = durationObj.seconds();

                    if (days > 0) {
                        newCountdown[v.id] = `${days}天${hours}小时${minutes}分${seconds}秒`;
                    } else if (hours > 0) {
                        newCountdown[v.id] = `${hours}小时${minutes}分${seconds}秒`;
                    } else if (minutes > 0) {
                        newCountdown[v.id] = `${minutes}分${seconds}秒`;
                    } else {
                        newCountdown[v.id] = `${seconds}秒`;
                    }
                }
            });
            setCountdown(newCountdown);
        }, 1000);

        return () => clearInterval(timer);
    }, [activeVouchers]);

    // 卡片渲染 - 根据 UserVoucherItem 结构调整
    const renderVoucher = (v: UserVoucherItem) => {
        const endTime = dayjs(v.voucher.endTime);
        const isExpired = endTime.isBefore(now);
        const diffDays = endTime.diff(now, "day");
        const isSoonExpire = !isExpired && diffDays <= 3;

        return (
            <Card
                key={v.id}
                hoverable
                className="relative shadow-md rounded-sm transition-all duration-200 select-none"
            >
                <div className="flex flex-col gap-1">
                    {/* 金额 + 标题 */}
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-2xl font-bold text-red-600 ">
                                ¥{v.remainAmount} <span className="text-xs text-gray-500">(剩余)</span>
                            </span>
                            <div className="text-sm text-gray-600 mt-1">{v.voucher.title}</div>
                        </div>
                        <span className="flex gap-1">
                            <Tag color={v.status ? "green" : "red"}>
                                {v.status ? "有效" : "失效"}
                            </Tag>
                            {isSoonExpire && (
                                <Tag color="orange">即将过期</Tag>
                            )}
                        </span>
                    </div>

                    {/* 描述信息 */}
                    {v.voucher.description && (
                        <div className="text-xs text-gray-500 mt-1">
                            {v.voucher.description}
                        </div>
                    )}

                    {/* 时间 */}
                    <div className="text-xs text-gray-500 mt-2">
                        <div>获取时间：{dayjs(v.getTime).format("YYYY-MM-DD HH:mm")}</div>
                        <div>有效期：{dayjs(v.voucher.startTime).format("YYYY-MM-DD")} 至 {endTime.format("YYYY-MM-DD HH:mm")}</div>
                        {v.useUpTime && (
                            <div>使用时间：{dayjs(v.useUpTime).format("YYYY-MM-DD HH:mm")}</div>
                        )}
                    </div>

                    {/* 状态和倒计时 */}
                    <div
                        className={`mt-1 text-xs ${isExpired ? "text-red-500" : isSoonExpire ? "text-red-500 font-medium" : "text-blue-500 font-medium"
                            }`}
                    >
                        {isExpired
                            ? "已过期"
                            : `剩余时间：${countdown[v.id] || now.to(endTime)}`}
                    </div>

                    {/* 原始金额显示在右下 */}
                    <div className="absolute right-4 bottom-4 text-4xl text-gray-400 opacity-70">
                        ¥{v.voucher.originalAmount}
                    </div>
                    
                    {/* 已使用金额显示 */}
                    {v.usedAmount > 0 && (
                        <div className="absolute left-4 bottom-4 text-xs text-gray-500">
                            已使用: ¥{v.usedAmount}
                        </div>
                    )}
                </div>
            </Card>
        );
    };

    // 已使用金额计算逻辑 - 根据 UserVoucherItem 结构调整
    const usedAmount = useMemo(() => {
        return vouchers.reduce((sum, v) => {
            return sum + v.usedAmount;
        }, 0);
    }, [vouchers]);

    // 可用总金额 - 根据 UserVoucherItem 结构调整
    const availableAmount = useMemo(() => {
        return activeVouchers.reduce((sum, v) => sum + v.remainAmount, 0);
    }, [activeVouchers]);

    // 空状态渲染组件
    const renderEmptyState = (type: 'active' | 'expired') => {
        const emptyText = type === 'active' 
            ? '暂无未过期的代金券，快去领取吧～' 
            : '暂无已过期的代金券';
        
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <span className="text-lg text-gray-500">{emptyText}</span>
                    }
                />
            </div>
        );
    };

    if (loading) {
        return (
            <Loading/>
        );
    }
    return (
        <div className="p-6 w-full mx-auto">
            {/* Header */}
            <div className="mb-6 py-4 pl-4 bg-white rounded-sm border-b-2 border-gray-100">
                <h1 className="text-[22px] pb-2 font-semibold text-gray-800 leading-tight">
                    代金券总览
                </h1>

                <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                    <span>
                        共可用金额：{" "}
                        <span className="font-semibold text-red-600">
                            ¥{availableAmount}
                        </span>
                    </span>
                    <span>
                        已使用金额：{" "}
                        <span className="font-semibold text-red-600">
                            ¥{usedAmount}
                        </span>
                    </span>
                    <span>
                        有效代金券：{" "}
                        <span className="font-semibold text-red-600">
                            {activeVouchers.length}
                        </span> 张
                    </span>
                    <span>
                        失效代金券：{" "}
                        <span className="font-semibold text-gray-500">
                            {expiredVouchers.length}
                        </span> 张
                    </span>
                </div>
            </div>

            <div className="flex items-center mb-3">
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key)}
                    style={{ flex: 1 }}
                    items={[
                        {
                            key: "active",
                            label: `有效 (${activeVouchers.length})`,
                        },
                        {
                            key: "expired",
                            label: `失效 (${expiredVouchers.length})`,
                        },
                    ]}
                />

                {/* 排序按钮 */}
                <div className="flex space-x-2 text-[13px] border-b-[1px] -mb-[1px]">
                    <button
                        onClick={() => setSortBy("expire")}
                        className={`px-4 py-1 transition-colors duration-200
              ${sortBy === "expire" ? "bg-slate-400 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        即将过期
                    </button>

                    <button
                        onClick={() => setSortBy("amount")}
                        className={`px-4 py-1 transition-colors duration-200
              ${sortBy === "amount" ? "bg-slate-400 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        金额排序
                    </button>

                    <button
                        onClick={() => setSortBy("status")}
                        className={`px-4 py-1 transition-colors duration-200
              ${sortBy === "status" ? "bg-slate-400 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        状态排序
                    </button>
                    <button
                        onClick={() => setSortBy(null)}
                        className={`px-4 py-1 transition-colors duration-200
    ${sortBy === null ? "bg-slate-400 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        重置排序
                    </button>
                </div>
            </div>

            {activeTab === "active" ? (
                <div className="h-[450px] overflow-y-auto pb-2 pr-[6px] 
    [&::-webkit-scrollbar]:w-1
    [&::-webkit-scrollbar-track]:rounded-xl
    [&::-webkit-scrollbar-track]:bg-gray-100
    [&::-webkit-scrollbar-thumb]:rounded-xl
    [&::-webkit-scrollbar-thumb]:bg-gray-300
    [&::-webkit-scrollbar-thumb:hover]:bg-gray-400
    [&::-webkit-scrollbar-button]:hidden
">
                    {sortedActive.length === 0 ? (
                        renderEmptyState('active')
                    ) : (
                        <Row className="gap-2">
                            {sortedActive.map((v) => (
                                <Col className="w-[410px] " key={`active-${v.id}`}>
                                    {renderVoucher(v)}
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>
            ) : (
                <div className="h-[450px] overflow-y-auto pr-[6px] 
    [&::-webkit-scrollbar]:w-1
    [&::-webkit-scrollbar-track]:rounded-xl
    [&::-webkit-scrollbar-track]:bg-gray-100
    [&::-webkit-scrollbar-thumb]:rounded-xl
    [&::-webkit-scrollbar-thumb]:bg-gray-300
    [&::-webkit-scrollbar-thumb:hover]:bg-gray-400
    [&::-webkit-scrollbar-button]:hidden
">
                    {expiredVouchers.length === 0 ? (
                        renderEmptyState('expired')
                    ) : (
                        <Row className="gap-2">
                            {expiredVouchers.map((v) => (
                                <Col className="w-[410px] " key={`expired-${v.id}`}>
                                    {renderVoucher(v)}
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>
            )}
        </div>
    );
}

export default Voucher;
