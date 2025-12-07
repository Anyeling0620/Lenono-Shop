import { useState, useMemo, useEffect } from "react";
import { Tabs, Card, Row, Col, Tag, Spin, Empty } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { axiosInstance, type ApiResponse } from "../../services/axiosService";
import globalErrorHandler from "../../utils/globalAxiosErrorHandler";
import toast from "react-hot-toast";
dayjs.extend(relativeTime);
dayjs.extend(duration);

// 定义优惠券类型接口
interface Voucher {
    id: number;  // 优惠券ID
    title: string;  // 优惠券标题
    amount: number;  // 优惠券金额
    remain: number;  // 剩余数量
    start: string | dayjs.Dayjs;  // 开始时间
    end: string | dayjs.Dayjs;  // 结束时间
    stackable: boolean;  // 是否可叠加
}

const Voucher = () => {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [activeTab, setActiveTab] = useState("active"); // 当前选中的tab
    const [sortBy, setSortBy] = useState<"expire" | "amount" | "stack" | null>(null); // 当前排序方式
    const [countdown, setCountdown] = useState<Record<number, string>>({}); // 优惠券倒计时
    const [loading, setLoading] = useState(true); // 加载状态

    const now = dayjs();

    useEffect(() => {
        const fetchVoucherData = async () => {
            try {
                // const res = await axiosInstance.get<ApiResponse<{vouchers: Voucher[]}>>('/user/voucher');
                // const vs = res.data.data.vouchers

                // 测试空数据：注释下面的数组，取消注释空数组即可
              //  const vs: Voucher[] = []; 
                const vs: Voucher[] = [
                    {
                        id: 1,
                        title: "新人满减券",
                        amount: 50,
                        remain: 20,
                        start: "2025-01-01",
                        end: "2025-12-31",
                        stackable: true,
                    },
                    {
                        id: 2,
                        title: "限时优惠券",
                        amount: 100,
                        remain: 100,
                        start: "2025-02-01",
                        end: dayjs().add(1, "day").toISOString(), // 即将过期
                        stackable: false,
                    },
                    {
                        id: 3,
                        title: "大额代金券",
                        amount: 20000,
                        remain: 10,
                        start: "2024-12-01",
                        end: "2025-01-10", // 已过期
                        stackable: true,
                    },
                    {
                        id: 4,
                        title: "节日礼券",
                        amount: 30,
                        remain: 30,
                        start: dayjs().subtract(2, "day"),
                        end: dayjs().add(20, "day"),
                        stackable: false,
                    },
                    {
                        id: 5,
                        title: "消费返还券",
                        amount: 80,
                        remain: 40,
                        start: dayjs().subtract(10, "day"),
                        end: dayjs().add(5, "day"),
                        stackable: true,
                    },
                    {
                        id: 6,
                        title: "节日礼券",
                        amount: 30,
                        remain: 30,
                        start: dayjs().subtract(2, "day"),
                        end: dayjs().add(20, "day"),
                        stackable: false,
                    },
                    {
                        id: 7,
                        title: "消费返还券",
                        amount: 80,
                        remain: 40,
                        start: dayjs().subtract(10, "day"),
                        end: dayjs().add(5, "day"),
                        stackable: true,
                    },
                    {
                        id: 8,
                        title: "节日礼券",
                        amount: 30,
                        remain: 30,
                        start: dayjs().subtract(2, "day"),
                        end: dayjs().add(20, "day"),
                        stackable: false,
                    },
                    {
                        id: 9,
                        title: "消费返还券",
                        amount: 80,
                        remain: 40,
                        start: dayjs().subtract(10, "day"),
                        end: dayjs().add(5, "day"),
                        stackable: true,
                    },
                    {
                        id: 10,
                        title: "节日礼券",
                        amount: 30,
                        remain: 30,
                        start: dayjs().subtract(2, "day"),
                        end: dayjs().add(20, "day"),
                        stackable: false,
                    },
                    {
                        id: 11,
                        title: "消费返还券",
                        amount: 80,
                        remain: 40,
                        start: dayjs().subtract(10, "day"),
                        end: dayjs().add(5, "day"),
                        stackable: true,
                    },
                ]
                setVouchers(vs);
            } catch (error) {
                globalErrorHandler.handle(error, toast.error)
            } finally {
                setLoading(false)
            }
        }
        setTimeout(fetchVoucherData,1000) 
    }, [])

    // 筛选未过期和已过期优惠券
    const activeVouchers = useMemo(() => {
        return vouchers.filter((v) => dayjs(v.end).isAfter(now));
    }, [vouchers, now]);

    const expiredVouchers = useMemo(() => {
        return vouchers.filter((v) => dayjs(v.end).isBefore(now));
    }, [vouchers, now]);

    // 排序逻辑
    const sortedActive = useMemo(() => {
        const arr = [...activeVouchers];

        switch (sortBy) {
            case "expire":
                arr.sort((a, b) => dayjs(a.end).valueOf() - dayjs(b.end).valueOf());
                break;
            case "amount":
                arr.sort((a, b) => b.amount - a.amount);
                break;
            case "stack":
                arr.sort((a, b) => Number(b.stackable) - Number(a.stackable));
                break;
            default:
                arr.sort((a, b) => dayjs(a.end).valueOf() - dayjs(b.end).valueOf());
        }

        return arr;
    }, [activeVouchers, sortBy]);

    // 倒计时更新逻辑
    useEffect(() => {
        const timer = setInterval(() => {
            const newCountdown: Record<number, string> = {};
            activeVouchers.forEach((v) => {
                const endTime = dayjs(v.end);
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

    // 卡片渲染
    const renderVoucher = (v: Voucher) => {
        const endTime = dayjs(v.end);
        const isExpired = endTime.isBefore(now);
        const diffDays = endTime.diff(now, "day");
        const isSoonExpire = !isExpired && diffDays <= 3;

        return (
            <Card
                key={v.id}
                hoverable
                className="relative shadow-md rounded-sm transition-all duration-200 "
            >
                <div className="flex flex-col gap-1">
                    {/* 金额 + 标题 */}
                    <div className="flex justify-between items-start">
                        <span className="text-2xl font-bold text-red-600 ">
                            ¥{v.remain} <span className="text-xs text-gray-500">(剩余)</span>
                        </span>
                        <span className="flex gap-1">
                            <Tag color={v.stackable ? "green" : "red"}>
                                {v.stackable ? "可叠加" : "不可叠加"}
                            </Tag>
                            {isSoonExpire && (
                                <Tag color="orange">即将过期</Tag>
                            )}
                        </span>
                    </div>

                    <div className="text-sm text-gray-600">{v.title}</div>

                    {/* 时间 */}
                    <div className="text-xs text-gray-500 mt-1">
                        <div>获取时间：{dayjs(v.start).format("YYYY-MM-DD")}</div>
                        <div>到期时间：{endTime.format("YYYY-MM-DD HH:mm")}</div>
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
                        ¥{v.amount}
                    </div>
                </div>
            </Card>
        );
    };

    // 已使用金额计算逻辑
    const usedAmount = useMemo(() => {
        return vouchers.reduce((sum, v) => {
            return sum + (v.amount - v.remain);
        }, 0);
    }, [vouchers]);

    // 可用总金额
    const availableAmount = useMemo(() => {
        return activeVouchers.reduce((sum, v) => sum + v.remain, 0);
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
            <div className="py-40 w-full flex items-center justify-center">
                <Spin  />
            </div>
        )
    }

    return (
        <div className="p-6 w-full mx-auto">
            {/* Header */}
            <div className="mb-6 py-4 pl-4 bg-white rounded-sm border-b-2 border-gray-100">
                <h1 className="text-[22px] pb-2 font-semibold text-gray-800 leading-tight">
                    代金券总览
                </h1>

                <span className="text-gray-500 text-sm ">
                    共可用金额：{" "}
                    <span className="font-semibold text-red-600">
                        ¥{availableAmount}
                    </span>
                </span>
                <span className="px-10 text-sm text-gray-500">
                    已使用：{" "}
                    <span className="font-semibold text-red-600">
                        ¥{usedAmount}
                    </span>
                </span>

            </div>

            <div className="flex items-center mb-3">
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key)}
                    style={{ flex: 1 }}
                    items={[
                        {
                            key: "active",
                            label: `未过期 (${activeVouchers.length})`,
                        },
                        {
                            key: "expired",
                            label: `已过期 (${expiredVouchers.length})`,
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
                        onClick={() => setSortBy("stack")}
                        className={`px-4 py-1 transition-colors duration-200
              ${sortBy === "stack" ? "bg-slate-400 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        可叠加否
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