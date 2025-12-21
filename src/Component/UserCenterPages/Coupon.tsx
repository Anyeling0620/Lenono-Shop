import { useState, useMemo, useEffect } from "react";
import { Tabs, Card, Row, Col, Tag, Descriptions, Divider, Button } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import globalErrorHandler from "../../utils/globalAxiosErrorHandler";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { getUserCouponsService } from "../../services/coupon";
import type { UserCouponItem } from "../../types/coupon";
import { Loading } from "../LoadingFallback";
dayjs.extend(relativeTime);
dayjs.extend(duration);

const Coupon = () => {
    const [coupons, setCoupons] = useState<UserCouponItem[]>([]);
    const [activeTab, setActiveTab] = useState("active"); // active/used/expired
    const [sortBy, setSortBy] = useState<"expire" | "value" | "condition" | null>(null);
    const [countdown, setCountdown] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    
    const now = dayjs();

    // 获取优惠券数据
    useEffect(() => {
        const fetchCouponData = async () => {
            try {
                const userCoupons = await getUserCouponsService();
                setCoupons(userCoupons.items);
            } catch (error) {
                globalErrorHandler.handle(error, toast.error);
            } finally {
                setLoading(false);
            }
        };
        setTimeout(fetchCouponData, 200);
    }, []);

    // 分类筛选优惠券 - 根据 UserCouponItem 的 status 字段
    const activeCoupons = useMemo(() => {
        return coupons.filter(c => 
            c.status === "未使用" && dayjs(c.coupon.expireTime).isAfter(now)
        );
    }, [coupons, now]);

    const usedCoupons = useMemo(() => {
        return coupons.filter(c => c.status === "已使用");
    }, [coupons]);

    const expiredCoupons = useMemo(() => {
        return coupons.filter(c => 
            c.status === "已过期" || (c.status === "未使用" && dayjs(c.coupon.expireTime).isBefore(now))
        );
    }, [coupons, now]);

    // 排序逻辑优化：根据 UserCouponItem 结构调整
    const sortedCoupons = useMemo(() => {
        let arr: UserCouponItem[] = [];

        switch (activeTab) {
            case "active":
                arr = [...activeCoupons];
                break;
            case "used":
                arr = [...usedCoupons];
                break;
            case "expired":
                arr = [...expiredCoupons];
                break;
            default:
                arr = [...activeCoupons];
        }

        switch (sortBy) {
            case "expire":
                // 按过期时间升序（快过期的在前）
                arr.sort((a, b) => 
                    dayjs(a.coupon.expireTime).valueOf() - dayjs(b.coupon.expireTime).valueOf()
                );
                break;
            case "value":
                // 优化：面值排序区分类型（折扣券按折扣力度排序，现金券按金额排序）
                arr.sort((a, b) => {
                    if (a.coupon.type === "折扣" && b.coupon.type === "折扣") {
                        // 折扣券：数值越小折扣力度越大，排前面（8折 > 8.5折 > 9折）
                        return a.coupon.discount - b.coupon.discount;
                    } else if (a.coupon.type === "满减" && b.coupon.type === "满减") {
                        // 现金券：金额大的排前面
                        return b.coupon.amount - a.coupon.amount;
                    } else {
                        // 混合类型：现金券优先，按金额/折扣力度排序
                        return a.coupon.type === "满减" ? -1 : 1;
                    }
                });
                break;
            case "condition":
                // 按使用门槛升序（无门槛在前）
                arr.sort((a, b) => a.coupon.threshold - b.coupon.threshold);
                break;
            default:
                // 默认按过期时间排序
                arr.sort((a, b) => 
                    dayjs(a.coupon.expireTime).valueOf() - dayjs(b.coupon.expireTime).valueOf()
                );
        }

        return arr;
    }, [activeTab, activeCoupons, usedCoupons, expiredCoupons, sortBy]);

    // 倒计时更新
    useEffect(() => {
        const timer = setInterval(() => {
            const newCountdown: Record<string, string> = {};
            activeCoupons.forEach((c) => {
                const endTime = dayjs(c.coupon.expireTime);
                const diff = endTime.diff(dayjs());

                if (diff > 0) {
                    const durationObj = dayjs.duration(diff);
                    const days = Math.floor(durationObj.asDays());
                    const hours = durationObj.hours();
                    const minutes = durationObj.minutes();
                    const seconds = durationObj.seconds();

                    if (days > 0) {
                        newCountdown[c.id] = `${days}天${hours}小时${minutes}分${seconds}秒`;
                    } else if (hours > 0) {
                        newCountdown[c.id] = `${hours}小时${minutes}分${seconds}秒`;
                    } else if (minutes > 0) {
                        newCountdown[c.id] = `${minutes}分${seconds}秒`;
                    } else {
                        newCountdown[c.id] = `${seconds}秒`;
                    }
                }
            });
            setCountdown(newCountdown);
        }, 1000);

        return () => clearInterval(timer);
    }, [activeCoupons]);

    // 渲染优惠券卡片 - 根据 UserCouponItem 结构调整
    const renderCoupon = (c: UserCouponItem) => {
        const endTime = dayjs(c.coupon.expireTime);
        const isExpired = endTime.isBefore(now);
        const diffDays = endTime.diff(now, "day");
        const isSoonExpire = !isExpired && diffDays <= 3;

        // 优化：折扣券显示逻辑
        const getCouponValueText = () => {
            if (c.coupon.type === "折扣") {
                const discount = Math.max(0.1, Math.min(9.9, c.coupon.discount));
                return discount % 1 === 0 ? `${discount*100}折` : `${discount*100}折`;
            } else {
                return `¥${c.coupon.amount}`;
            }
        };

        // 优化：折扣券价值描述
        const getDiscountValueDesc = () => {
            if (c.coupon.type === "折扣") {
                const discount = Math.max(0.1, Math.min(9.9, c.coupon.discount));
                return `享${discount}折优惠`;
            } else {
                return `立减¥${c.coupon.amount}`;
            }
        };

        const getConditionText = () => {
            return c.coupon.threshold > 0 ? `满¥${c.coupon.threshold}可用` : "无使用门槛";
        };

        return (
            <Card
                key={c.id}
                hoverable
                className={`relative shadow-md rounded-sm transition-all duration-200 bg-white
                    ${isExpired || c.status === "已使用" ? "opacity-70" : ""}`}
            >
                <div className="flex flex-col gap-2">
                    {/* 优惠券头部：面值 + 标题 + 状态标签 */}
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-2xl font-bold text-red-600">
                                {getCouponValueText()}
                            </span>
                            <span className="ml-2 text-base font-medium text-gray-700">
                                {c.coupon.name}
                            </span>
                        </div>
                        <div className="flex gap-1 flex-wrap">
                            {/* 状态标签 */}
                            {c.status === "未使用" && !isExpired && (
                                <Tag color="green">未使用</Tag>
                            )}
                            {c.status === "已使用" && (
                                <Tag color="blue">已使用</Tag>
                            )}
                            {(isExpired || c.status === "已过期") && (
                                <Tag color="gray">已过期</Tag>
                            )}
                            {/* 即将过期标签 */}
                            {isSoonExpire && (
                                <Tag color="orange">即将过期</Tag>
                            )}
                            {/* 可叠加标签 */}
                            <Tag color={c.coupon.isStackable ? "purple" : "gray"}>
                                {c.coupon.isStackable ? "可叠加" : "不可叠加"}
                            </Tag>
                        </div>
                    </div>

                    <Divider className="my-1" />

                    {/* 使用条件和价值描述 */}
                    <div className="text-sm text-gray-600">
                        <div>{getConditionText()} · {getDiscountValueDesc()}</div>
                    </div>

                    {/* 使用限制详情 */}
                    <Descriptions
                        column={1}
                        size="small"
                        className="text-xs"
                        labelStyle={{ fontWeight: 600, color: "#666", width: "80px" }}
                        contentStyle={{ color: "#888" }}
                    >
                        <Descriptions.Item label="适用范围">
                            {c.coupon.scope || "无限制"}
                        </Descriptions.Item>
                        <Descriptions.Item label="使用条件">
                            {c.coupon.condition || "无特殊条件"}
                        </Descriptions.Item>
                    </Descriptions>

                    {/* 时间信息 */}
                    <div className="text-xs text-gray-500 mt-1">
                        <div>有效期：{dayjs(c.coupon.startTime).format("YYYY-MM-DD")} 至 {endTime.format("YYYY-MM-DD HH:mm")}</div>
                        <div
                            className={`mt-1 ${isExpired ? "text-red-500" : isSoonExpire ? "text-red-500 font-medium" : "text-blue-500 font-medium"}`}
                        >
                            {isExpired
                                ? "已过期"
                                : c.status === "已使用"
                                    ? "已使用"
                                    : `剩余时间：${countdown[c.id] || now.to(endTime)}`}
                        </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="absolute right-6 bottom-4 flex gap-2">
                        {c.status === "未使用" && !isExpired ? (
                            <Link to={'/index'}>
                                <Button
                                    size="small"
                                    type="primary"
                                    className="bg-blue-400 hover:bg-blue-500"
                                >
                                    立即使用
                                </Button>
                            </Link>
                        ) : (
                            <span className="text-3xl text-gray-300 opacity-70">
                                {getCouponValueText()}
                            </span>
                        )}
                    </div>
                </div>
            </Card>
        );
    };

    // 统计信息优化：根据 UserCouponItem 结构调整
    const [totalActiveCash] = useMemo(() => {
        let cash = 0;
        let discount = 0;
        activeCoupons.forEach(c => {
            if (c.coupon.type === "满减") {
                cash += c.coupon.amount;
            } else {
                discount += 10 - c.coupon.discount; // 计算折扣力度（8折=2，9折=1，数值越大优惠越大）
            }
        });
        return [cash, discount];
    }, [activeCoupons]);

    const totalUsedCash = useMemo(() => {
        return usedCoupons.reduce((sum, c) => {
            return sum + (c.coupon.type === "满减" ? c.coupon.amount : 0);
        }, 0);
    }, [usedCoupons]);

    const totalActiveDiscountCount = useMemo(() => {
        return activeCoupons.filter(c => c.coupon.type === "折扣").length;
    }, [activeCoupons]);

    if (loading) {
        return (<Loading/>)
    }

    return (
        <div className="p-6 w-full mx-auto ">
            {/* 页面头部 */}
            <div className="mb-6 py-4 pl-4 bg-white rounded-sm border-b-2 border-gray-100 ">
                <h1 className="text-[22px] pb-3 font-semibold text-gray-800 leading-tight">
                    我的优惠券
                </h1>

                <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                    <span>
                        未使用优惠券：{" "}
                        <span className="font-semibold text-red-600">{activeCoupons.length}</span> 张
                    </span>
                    <span>
                        未使用现金券：{" "}
                        <span className="font-semibold text-red-600">¥{totalActiveCash}</span>
                    </span>
                    <span>
                        未使用折扣券：{" "}
                        <span className="font-semibold text-red-600">{totalActiveDiscountCount}</span> 张
                    </span>
                    <span>
                        已使用金额：{" "}
                        <span className="font-semibold text-red-600">¥{totalUsedCash}</span>
                    </span>
                    <span>
                        过期优惠券：{" "}
                        <span className="font-semibold text-gray-500">{expiredCoupons.length}</span> 张
                    </span>
                </div>
            </div>

            {/* 标签页 + 排序按钮 */}
            <div className="flex flex-wrap items-center mb-3 gap-3">
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key)}
                    style={{ flex: 1 }}
                    items={[
                        {
                            key: "active",
                            label: `未使用 (${activeCoupons.length})`,
                        },
                        {
                            key: "used",
                            label: `已使用 (${usedCoupons.length})`,
                        },
                        {
                            key: "expired",
                            label: `已过期 (${expiredCoupons.length})`,
                        },
                    ]}
                />

                {/* 排序按钮组 */}
                <div className="flex space-x-2 text-[13px] border-b-[1px] -mb-[1px]">
                    <button
                        onClick={() => setSortBy("expire")}
                        className={`px-4 py-1 transition-colors duration-200
                            ${sortBy === "expire" ? "bg-slate-400 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        即将过期
                    </button>
                    <button
                        onClick={() => setSortBy("value")}
                        className={`px-4 py-1 transition-colors duration-200
                            ${sortBy === "value" ? "bg-slate-400 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        优惠力度
                    </button>
                    <button
                        onClick={() => setSortBy("condition")}
                        className={`px-4 py-1 transition-colors duration-200
                            ${sortBy === "condition" ? "bg-slate-400 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        门槛排序
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

            {/* 优惠券列表 */}
            <div className={`h-[450px] overflow-y-auto pr-[6px] pb-2
                [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar-track]:rounded-xl
                [&::-webkit-scrollbar-track]:bg-gray-100
                [&::-webkit-scrollbar-thumb]:rounded-xl
                [&::-webkit-scrollbar-thumb]:bg-gray-300
                [&::-webkit-scrollbar-thumb:hover]:bg-gray-400
                [&::-webkit-scrollbar-button]:hidden
            `}>
                {sortedCoupons.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <div className="text-4xl mb-2">🎫</div>
                        <div className="text-lg">暂无{
                            activeTab === "active" ? "未使用" :
                                activeTab === "used" ? "已使用" : "已过期"
                        }优惠券</div>
                        <div className="text-sm mt-2">快去领取更多优惠券吧～</div>
                    </div>
                ) : (
                    <Row className="gap-2">
                        {sortedCoupons.map((c) => (
                            <Col className="w-[410px]" key={`${activeTab}-${c.id}`}>
                                {renderCoupon(c)}
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </div>
    );
};

export default Coupon;
