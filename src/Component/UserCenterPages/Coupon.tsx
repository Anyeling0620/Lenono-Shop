import { useState, useMemo, useEffect } from "react";
import { Tabs,  Row, Col,  Button } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import globalErrorHandler from "../../utils/globalAxiosErrorHandler";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { getUserCouponsService } from "../../services/coupon";
import type { UserCouponItem } from "../../types/coupon";
import { Loading } from "../LoadingFallback";
import { CalendarOutlined, CheckCircleFilled, ClockCircleOutlined, FireFilled, GiftFilled, RocketOutlined } from "@ant-design/icons";
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
                return discount % 1 === 0 ? `${discount * 100}折` : `${discount * 100}折`;
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

        // 根据状态确定卡片背景色
        const getCardBgColor = () => {
            if (isExpired || c.status === "已使用" || c.status === "已过期") {
                return "bg-gradient-to-br from-gray-100 to-gray-200";
            }
            if (isSoonExpire) {
                return "bg-gradient-to-br from-amber-50 to-red-50";
            }
            return "bg-gradient-to-br from-red-50 to-amber-50";
        };

        // 根据状态确定主色调
        const getMainColor = () => {
            if (isExpired || c.status === "已使用" || c.status === "已过期") {
                return "text-gray-400";
            }
            if (isSoonExpire) {
                return "text-amber-600";
            }
            return "text-red-600";
        };

        // 获取装饰图标
        const getDecorationIcon = () => {
            if (isExpired || c.status === "已过期") {
                return <ClockCircleOutlined className="text-gray-400" />;
            }
            if (c.status === "已使用") {
                return <CheckCircleFilled className="text-green-500" />;
            }
            if (isSoonExpire) {
                return <FireFilled className="text-amber-500" />;
            }
            return <GiftFilled className="text-red-500" />;
        };

        return (
            <div
                key={c.id}
                className={`relative rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 
                ${getCardBgColor()} 
                ${isExpired || c.status === "已使用" || c.status === "已过期" ? "opacity-80" : ""}
                border border-gray-200/50 overflow-hidden`}
            >
                {/* 优惠券顶部装饰 */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-red-500"></div>

                {/* 左侧打孔装饰 */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-12 bg-white rounded-r-full border-r border-dashed border-gray-300"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-12 bg-white rounded-l-full border-l border-dashed border-gray-300"></div>

                {/* 优惠券内容 */}
                <div className="p-4 relative z-10">
                    {/* 状态角标 */}
                    <div className="absolute top-3 right-3">
                        {getDecorationIcon()}
                    </div>

                    {/* 优惠券头部：面值 + 标题 */}
                    <div className="flex items-start gap-4 mb-2">
                        {/* 面值区域 - 喜庆大字体 */}
                        <div className={`text-4xl font-bold ${getMainColor()} leading-none`}>
                            {getCouponValueText()}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold text-gray-800">{c.coupon.name}</h3>
                                {/* 状态标签 */}
                                <div className="flex gap-1">
                                    {c.status === "未使用" && !isExpired && (
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                                            未使用
                                        </span>
                                    )}
                                    {c.status === "已使用" && (
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                                            已使用
                                        </span>
                                    )}
                                    {(isExpired || c.status === "已过期") && (
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full border border-gray-200">
                                            已过期
                                        </span>
                                    )}
                                    {isSoonExpire && (
                                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full border border-amber-200 animate-pulse">
                                            即将过期
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* 价值描述 */}
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">{getDiscountValueDesc()}</span>
                            </div>
                        </div>
                    </div>

                    {/* 使用条件 */}
                    <div className="mb-2 px-3 py-2 bg-white/50 rounded-lg border border-gray-200/50">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">使用条件：</span>
                            <span className={`font-semibold ${getMainColor()}`}>
                                {getConditionText()}
                            </span>
                        </div>
                    </div>

                    {/* 详细信息 */}
                    <div className="space-y-1 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">适用范围：</span>
                            <span className="font-medium">{c.coupon.scope || "全品类通用"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">使用条件：</span>
                            <span>{c.coupon.condition || "无特殊限制"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">叠加规则：</span>
                            <span className={c.coupon.isStackable ? "text-green-600 font-medium" : "text-gray-500"}>
                                {c.coupon.isStackable ? "✓ 可与其他优惠叠加" : "✗ 不可与其他优惠叠加"}
                            </span>
                        </div>
                    </div>

                    {/* 时间信息和操作按钮 */}
                    <div className="flex justify-between items-center pt-2 pb-2 border-t border-gray-200/50">
                        <div className="text-xs text-gray-500">
                            <div className="mb-1">
                                <CalendarOutlined className="mr-1" />
                                有效期：{dayjs(c.coupon.startTime).format("YYYY.MM.DD")} - {endTime.format("YYYY.MM.DD")}
                            </div>
                            <div className={`font-medium ${isExpired ? "text-red-500" : isSoonExpire ? "text-amber-500" : "text-green-500"}`}>
                                {isExpired
                                    ? "⏰已过期"
                                    : c.status === "已使用"
                                        ? "✅已使用"
                                        : `⏳剩余时间：${countdown[c.id] || now.to(endTime)}`}
                            </div>
                        </div>

                        {/* 操作按钮 */}
                        <div>
                            {c.status === "未使用" && !isExpired ? (
                                <Link to={'/index'}>
                                    <Button
                                        type="primary"
                                        className="rounded-lg bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 border-0 shadow-md hover:shadow-lg transition-all duration-300 font-semibold h-9 px-6"
                                        icon={<RocketOutlined />}
                                    >
                                        立即使用
                                    </Button>
                                </Link>
                            ) : (
                                <div className={`text-2xl font-bold ${getMainColor()} opacity-50`}>
                                    {getCouponValueText()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 底部装饰花纹 */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-red-200/50 to-transparent"></div>

                {/* 优惠券编号（小字） */}
                <div className="absolute bottom-2 left-4 text-[10px] text-gray-400 opacity-50">
                    NO.{c.id.slice(0, 8)}
                </div>
            </div>
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
        return (<Loading />)
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
