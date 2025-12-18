import { useState, useMemo, useEffect } from "react";
import { Tabs, Card, Row, Col, Tag, Descriptions, Divider, Button, Spin } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { axiosInstance, type ApiResponse } from "../../services/AxiosService";
import globalErrorHandler from "../../utils/globalAxiosErrorHandler";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
dayjs.extend(relativeTime);
dayjs.extend(duration);

// 扩展优惠券接口，增加使用限制相关字段
interface Coupon {
    id: number;                  // 优惠券ID
    title: string;               // 优惠券标题
    type: "discount" | "cash";   // 优惠券类型：折扣券/现金券
    value: number;               // 优惠券面值（折扣券为折数，如8.8代表8.8折；现金券为金额）
    condition: number;           // 使用条件（满X元可用）
    start: string | dayjs.Dayjs; // 开始时间
    end: string | dayjs.Dayjs;   // 结束时间
    stackable: boolean;          // 是否可叠加
    applicableScope: string[];   // 适用范围（如：["全品类", "电子产品", "服装"]）
    usageRestrictions: string[]; // 使用限制（如：["仅限APP使用", "不与其他活动同享"]）
    status: "active" | "used" | "expired"; // 优惠券状态
}

const Coupon = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [activeTab, setActiveTab] = useState("active"); // active/used/expired
    const [sortBy, setSortBy] = useState<"expire" | "value" | "condition" | null>(null);
    const [countdown, setCountdown] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(true);
    
    const now = dayjs();

    // 模拟获取优惠券数据
    useEffect(() => {
        const fetchCouponData = async () => {
            try {
                // 实际项目中替换为真实接口请求
                // const res = await axiosInstance.get<ApiResponse<{coupons: Coupon[]}>>('/user/coupons');
                // const cs = res.data.data.coupons;

                // 优化：折扣券value直接存储折数（如8代表8折，9.5代表9.5折），更符合直觉
                const cs: Coupon[] = [
                    {
                        id: 1,
                        title: "新人专享满减券",
                        type: "cash",
                        value: 50,
                        condition: 200,
                        start: "2025-01-01",
                        end: "2025-12-31",
                        stackable: true,
                        applicableScope: ["全品类", "线上线下通用"],
                        usageRestrictions: ["单笔订单限用1张", "最低消费200元"],
                        status: "active"
                    },
                    {
                        id: 2,
                        title: "限时8折折扣券",
                        type: "discount",
                        value: 8, // 直接存储8代表8折
                        condition: 100,
                        start: "2025-02-01",
                        end: dayjs().add(1, "day").toISOString(),
                        stackable: false,
                        applicableScope: ["电子产品", "数码配件"],
                        usageRestrictions: ["仅限APP使用", "不与满减券叠加"],
                        status: "active"
                    },
                    {
                        id: 3,
                        title: "大额现金券",
                        type: "cash",
                        value: 200,
                        condition: 1000,
                        start: "2024-12-01",
                        end: "2025-01-10",
                        stackable: true,
                        applicableScope: ["家电", "家具"],
                        usageRestrictions: ["仅限线下门店使用"],
                        status: "used"
                    },
                    {
                        id: 4,
                        title: "节日通用券",
                        type: "cash",
                        value: 30,
                        condition: 150,
                        start: dayjs().subtract(2, "day"),
                        end: dayjs().add(20, "day"),
                        stackable: false,
                        applicableScope: ["食品", "日用品"],
                        usageRestrictions: ["每日限用1张"],
                        status: "active"
                    },
                    {
                        id: 5,
                        title: "消费返现券",
                        type: "cash",
                        value: 80,
                        condition: 500,
                        start: dayjs().subtract(10, "day"),
                        end: dayjs().add(5, "day"),
                        stackable: true,
                        applicableScope: ["全品类"],
                        usageRestrictions: ["返现有效期7天"],
                        status: "used"
                    },
                    {
                        id: 6,
                        title: "会员专享9折券",
                        type: "discount",
                        value: 9, // 9代表9折
                        condition: 0, // 无使用门槛
                        start: "2024-11-01",
                        end: "2024-12-31",
                        stackable: false,
                        applicableScope: ["会员专区"],
                        usageRestrictions: ["仅限VIP会员使用"],
                        status: "expired"
                    },
                    {
                        id: 7,
                        title: "无门槛现金券",
                        type: "cash",
                        value: 10,
                        condition: 0,
                        start: dayjs().subtract(5, "day"),
                        end: dayjs().add(10, "day"),
                        stackable: true,
                        applicableScope: ["全品类"],
                        usageRestrictions: ["新老用户均可使用"],
                        status: "active"
                    },
                    {
                        id: 8,
                        title: "8.5折特惠券",
                        type: "discount",
                        value: 8.5, // 8.5代表8.5折
                        condition: 200,
                        start: dayjs().subtract(1, "day"),
                        end: dayjs().add(7, "day"),
                        stackable: true,
                        applicableScope: ["美妆", "个护"],
                        usageRestrictions: ["节日特惠"],
                        status: "active"
                    }
                ];
                setCoupons(cs);
            } catch (error) {
                globalErrorHandler.handle(error, toast.error);
            } finally {
                setLoading(false);
            }
        };
        setTimeout(fetchCouponData, 1000)
    }, []);

    // 分类筛选优惠券
    const activeCoupons = useMemo(() => {
        return coupons.filter(c =>
            c.status === "active" && dayjs(c.end).isAfter(now)
        );
    }, [coupons, now]);

    const usedCoupons = useMemo(() => {
        return coupons.filter(c => c.status === "used");
    }, [coupons]);

    const expiredCoupons = useMemo(() => {
        return coupons.filter(c =>
            c.status === "expired" || (c.status === "active" && dayjs(c.end).isBefore(now))
        );
    }, [coupons, now]);

    // 排序逻辑优化：区分折扣券和现金券的排序
    const sortedCoupons = useMemo(() => {
        let arr: Coupon[] = [];

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
                arr.sort((a, b) => dayjs(a.end).valueOf() - dayjs(b.end).valueOf());
                break;
            case "value":
                // 优化：面值排序区分类型（折扣券按折扣力度排序，现金券按金额排序）
                arr.sort((a, b) => {
                    if (a.type === "discount" && b.type === "discount") {
                        // 折扣券：数值越小折扣力度越大，排前面（8折 > 8.5折 > 9折）
                        return a.value - b.value;
                    } else if (a.type === "cash" && b.type === "cash") {
                        // 现金券：金额大的排前面
                        return b.value - a.value;
                    } else {
                        // 混合类型：现金券优先，按金额/折扣力度排序
                        return a.type === "cash" ? -1 : 1;
                    }
                });
                break;
            case "condition":
                // 按使用门槛升序（无门槛在前）
                arr.sort((a, b) => a.condition - b.condition);
                break;
            default:
                // 默认按过期时间排序
                arr.sort((a, b) => dayjs(a.end).valueOf() - dayjs(b.end).valueOf());
        }

        return arr;
    }, [activeTab, activeCoupons, usedCoupons, expiredCoupons, sortBy]);

    // 倒计时更新
    useEffect(() => {
        const timer = setInterval(() => {
            const newCountdown: Record<number, string> = {};
            activeCoupons.forEach((c) => {
                const endTime = dayjs(c.end);
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

    // 渲染优惠券卡片
    const renderCoupon = (c: Coupon) => {
        const endTime = dayjs(c.end);
        const isExpired = endTime.isBefore(now);
        const diffDays = endTime.diff(now, "day");
        const isSoonExpire = !isExpired && diffDays <= 3;

        // 优化：折扣券显示逻辑（增加边界值处理）
        const getCouponValueText = () => {
            // 边界值处理
            if (c.type === "discount") {
                const discount = Math.max(0.1, Math.min(9.9, c.value)); // 限制折扣范围0.1-9.9折
                return discount % 1 === 0 ? `${discount}折` : `${discount}折`; // 整数折显示X折，小数折显示X.X折
            } else {
                return `¥${c.value}`;
            }
        };

        // 优化：折扣券价值描述（用于排序/统计）
        const getDiscountValueDesc = () => {
            if (c.type === "discount") {
                const discount = Math.max(0.1, Math.min(9.9, c.value));
                return `享${discount}折优惠`;
            } else {
                return `立减¥${c.value}`;
            }
        };

        const getConditionText = () => {
            return c.condition > 0 ? `满¥${c.condition}可用` : "无使用门槛";
        };

        return (
            <Card
                key={c.id}
                hoverable
                className={`relative shadow-md rounded-sm transition-all duration-200 bg-white
                    ${isExpired || c.status === "used" ? "opacity-70" : ""}`}
            >
                <div className="flex flex-col gap-2">
                    {/* 优惠券头部：面值 + 标题 + 状态标签 */}
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-2xl font-bold text-red-600">
                                {getCouponValueText()}
                            </span>
                            <span className="ml-2 text-base font-medium text-gray-700">
                                {c.title}
                            </span>
                        </div>
                        <div className="flex gap-1 flex-wrap">
                            {/* 状态标签 */}
                            {c.status === "active" && !isExpired && (
                                <Tag color="green">未使用</Tag>
                            )}
                            {c.status === "used" && (
                                <Tag color="blue">已使用</Tag>
                            )}
                            {isExpired || c.status === "expired" && (
                                <Tag color="gray">已过期</Tag>
                            )}
                            {/* 即将过期标签 */}
                            {isSoonExpire && (
                                <Tag color="orange">即将过期</Tag>
                            )}
                            {/* 可叠加标签 */}
                            <Tag color={c.stackable ? "purple" : "gray"}>
                                {c.stackable ? "可叠加" : "不可叠加"}
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
                            {c.applicableScope.join("、") || "无限制"}
                        </Descriptions.Item>
                        <Descriptions.Item label="使用限制">
                            {c.usageRestrictions.join("、")}
                        </Descriptions.Item>
                    </Descriptions>

                    {/* 时间信息 */}
                    <div className="text-xs text-gray-500 mt-1">
                        <div>有效期：{dayjs(c.start).format("YYYY-MM-DD")} 至 {endTime.format("YYYY-MM-DD HH:mm")}</div>
                        <div
                            className={`mt-1 ${isExpired ? "text-red-500" : isSoonExpire ? "text-red-500 font-medium" : "text-blue-500 font-medium"}`}
                        >
                            {isExpired
                                ? "已过期"
                                : c.status === "used"
                                    ? "已使用"
                                    : `剩余时间：${countdown[c.id] || now.to(endTime)}`}
                        </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="absolute right-6 bottom-4 flex gap-2">
                        {c.status === "active" && !isExpired ? (
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

    // 统计信息优化：区分折扣券和现金券
    const [totalActiveCash, totalActiveDiscount] = useMemo(() => {
        let cash = 0;
        let discount = 0;
        activeCoupons.forEach(c => {
            if (c.type === "cash") {
                cash += c.value;
            } else {
                discount += 10 - c.value; // 计算折扣力度（8折=2，9折=1，数值越大优惠越大）
            }
        });
        return [cash, discount];
    }, [activeCoupons]);

    const totalUsedCash = useMemo(() => {
        return usedCoupons.reduce((sum, c) => {
            return sum + (c.type === "cash" ? c.value : 0);
        }, 0);
    }, [usedCoupons]);


    if (loading) {
        return (<div className="py-40 w-full flex items-center justify-center">
            <Spin />
        </div>)
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
                        <span className="font-semibold text-red-600">{activeCoupons.filter(c => c.type === "discount").length}</span> 张
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