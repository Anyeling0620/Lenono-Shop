import { useState, useMemo, useEffect } from "react";
import { Tabs,  Row, Col,  Empty } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import globalErrorHandler from "../../utils/globalAxiosErrorHandler";
import toast from "react-hot-toast";
import { getVouchersService } from "../../services/coupon";
import type { UserVoucherItem } from "../../types/coupon";
import { Loading } from "../LoadingFallback";
import { CalendarOutlined, CheckCircleFilled, CheckCircleOutlined, ClockCircleOutlined, CloseCircleFilled, FireFilled, InfoCircleOutlined } from "@ant-design/icons";
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
// 卡片渲染 - 根据 UserVoucherItem 结构调整
const renderVoucher = (v: UserVoucherItem) => {
    const endTime = dayjs(v.voucher.endTime);
    const isExpired = endTime.isBefore(now);
    const diffDays = endTime.diff(now, "day");
    const isSoonExpire = !isExpired && diffDays <= 3;
    
    // 计算使用进度
    const usedPercentage = (v.usedAmount / v.voucher.originalAmount) * 100;

    // 根据状态确定卡片样式
    const getCardStyle = () => {
        if (isExpired || !v.status) {
            return {
                bg: "bg-gradient-to-br from-gray-100 to-gray-200",
                border: "border-gray-300/50",
                text: "text-gray-500",
                accent: "text-gray-400"
            };
        }
        if (isSoonExpire) {
            return {
                bg: "bg-gradient-to-br from-amber-50 to-red-50",
                border: "border-amber-200",
                text: "text-amber-700",
                accent: "text-amber-500"
            };
        }
        return {
            bg: "bg-gradient-to-br from-green-50 to-emerald-50",
            border: "border-green-200",
            text: "text-green-700",
            accent: "text-green-500"
        };
    };

    const style = getCardStyle();

    return (
        <div
            key={v.id}
            className={`relative rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 
                ${style.bg} border ${style.border} overflow-hidden
                ${isExpired || !v.status ? "opacity-80" : ""}`}
        >
            {/* 顶部装饰条 */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 via-emerald-400 to-green-400"></div>
            
            {/* 左侧打孔装饰 */}
            <div className="absolute left-0 top-[52%] -translate-y-1/2 w-6 h-16 bg-white rounded-r-full border-r-2 border-dashed border-gray-300"></div>
            <div className="absolute right-0 top-[52%] -translate-y-1/2 w-6 h-16 bg-white rounded-l-full border-l-2 border-dashed border-gray-300"></div>

            {/* 代金券内容 */}
            <div className="p-4 relative z-10">
                {/* 状态角标 */}
                <div className="absolute top-3 right-3">
                    {isExpired || !v.status ? (
                        <CloseCircleFilled className="text-gray-400 text-lg" />
                    ) : isSoonExpire ? (
                        <FireFilled className="text-amber-500 text-lg animate-pulse" />
                    ) : (
                        <CheckCircleFilled className="text-green-500 text-lg" />
                    )}
                </div>

                {/* 金额和标题区域 */}
                <div className="flex items-start justify-between mb-2">
                    <div>
                        {/* 剩余金额 - 突出显示 */}
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-4xl font-bold text-red-600 leading-none">
                                ¥{v.remainAmount}
                            </span>
                            <span className="text-sm text-gray-500 font-medium">
                                (剩余金额)
                            </span>
                        </div>
                        
                        {/* 代金券标题 */}
                        <h3 className="text-lg font-bold text-gray-800">
                            {v.voucher.title}
                        </h3>
                    </div>

                    {/* 状态标签 */}
                    <div className="flex flex-col items-end gap-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${v.status ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`}>
                            {v.status ? "有效" : "失效"}
                        </span>
                        {isSoonExpire && (
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full border border-amber-200 animate-pulse">
                                即将过期
                            </span>
                        )}
                    </div>
                </div>

                {/* 使用进度条 */}
                <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>已使用: ¥{v.usedAmount}</span>
                        <span>剩余: ¥{v.remainAmount}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${usedPercentage}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0%</span>
                        <span>{Math.round(usedPercentage)}%</span>
                        <span>100%</span>
                    </div>
                </div>

                {/* 描述信息 */}
                {v.voucher.description && (
                    <div className="mb-2 p-3 bg-white/50 rounded-lg border border-gray-200/50">
                        <div className="text-sm text-gray-600">
                            <InfoCircleOutlined className="mr-2 text-blue-400" />
                            {v.voucher.description}
                        </div>
                    </div>
                )}

                {/* 时间信息 */}
                <div className="space-y-1 text-sm mb-2">
                    <div className="flex items-center gap-2 text-gray-600">
                        <CalendarOutlined className="text-gray-400" />
                        <span>获取时间：{dayjs(v.getTime).format("YYYY.MM.DD HH:mm")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <ClockCircleOutlined className="text-gray-400" />
                        <span>有效期：{dayjs(v.voucher.startTime).format("YYYY.MM.DD")} - {endTime.format("YYYY.MM.DD")}</span>
                    </div>
                    {v.useUpTime && (
                        <div className="flex items-center gap-2 text-gray-600">
                            <CheckCircleOutlined className="text-green-400" />
                            <span>使用时间：{dayjs(v.useUpTime).format("YYYY.MM.DD HH:mm")}</span>
                        </div>
                    )}
                </div>

                {/* 倒计时和操作区域 */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-200/50">
                    <div className="text-xs">
                        <div className={`font-medium ${isExpired ? "text-red-500" : isSoonExpire ? "text-amber-500" : "text-green-500"}`}>
                            {isExpired
                                ? "⏰ 已过期"
                                : `⏳ 剩余时间：${countdown[v.id] || now.to(endTime)}`}
                        </div>
                    </div>

                    {/* 原始金额显示 */}
                    <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">原始金额</div>
                        <div className="text-2xl font-bold text-gray-400 line-through">
                            ¥{v.voucher.originalAmount}
                        </div>
                    </div>
                </div>
            </div>

            {/* 底部装饰 */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-200/50 to-transparent"></div>
            
            {/* 代金券编号 */}
            <div className="absolute bottom-2 left-4 text-[10px] text-gray-400 opacity-50">
                VOUCHER-{v.id.slice(0, 8).toUpperCase()}
            </div>
            
            {/* 使用状态徽章 */}
            {v.usedAmount > 0 && (
                <div className="absolute top-2 left-2">
                    <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                        已使用 ¥{v.usedAmount}
                    </div>
                </div>
            )}
        </div>
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
