import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { getCouponCenterService, receiveCouponService } from "../services/coupon";
import type { CouponItem } from "../types/coupon";
import { Loading } from "../component/LoadingFallback";
import toast from "react-hot-toast";
import globalErrorHandler from "../utils/globalAxiosErrorHandler";


function formatSeconds(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function pad(n: number) {
    return n.toString().padStart(2, "0");
}

function useCouponCountdowns(items: CouponItem[]) {
    const [now, setNow] = useState(dayjs());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(dayjs());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return useMemo(() => {
        return items.map(item => {
            const start = dayjs(item.startTime);
            const end = dayjs(item.endTime);

            if (now.isBefore(start)) {
                return {
                    id: item.id,
                    status: "notStarted" as const,
                    text: `距开始 ${formatSeconds(start.diff(now, "second"))}`
                };
            }

            if (now.isBefore(end)) {
                return {
                    id: item.id,
                    status: "ongoing" as const,
                    text: `距结束 ${formatSeconds(end.diff(now, "second"))}`
                };
            }

            return {
                id: item.id,
                status: "ended" as const,
                text: "已结束"
            };
        });
    }, [items, now]);
}


type FilterType = "all" | "full" | "discount" | "stackable";

const CouponCenter: React.FC = () => {
    const [list, setList] = useState<CouponItem[]>([]);
    const [filter, setFilter] = useState<FilterType>("all");
    const [loading, setLoading] = useState(false);
    const [receivingId, setReceivingId] = useState<string | null>(null);


    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const res = await getCouponCenterService();
            setList(res.items || []);
        } finally {
            setLoading(false);
        }
    };


    async function handleReceiveCoupon(couponId: string) {
        if (receivingId) return;

        setReceivingId(couponId);
        try {
            await receiveCouponService(couponId);

            toast.success("领取成功");

            // 立即更新当前券为已领取
            setList((prev) =>
                prev.map((item) =>
                    item.couponId === couponId
                        ? { ...item, received: true }
                        : item
                )
            );
        } catch (e) {
            globalErrorHandler.handle(e, toast.error);
        } finally {
            setReceivingId(null);
        }
    }




    const filteredList = useMemo(() => {
        return list.filter((item) => {
            if (filter === "full") return item.coupon.type === "满减";
            if (filter === "discount") return item.coupon.type === "折扣";
            if (filter === "stackable") return item.coupon.isStackable;
            return true;
        });
    }, [list, filter]);

    const countdownData = useCouponCountdowns(list);

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="mx-auto w-[1200px]">
                {/* 标题 */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-semibold text-gray-800">
                        领券中心
                    </h1>

                    {/* 筛选按钮（右侧） */}
                    <div className="flex items-center gap-3">
                        {[
                            { key: "all", label: "全部" },
                            { key: "full", label: "满减" },
                            { key: "discount", label: "折扣" },
                            { key: "stackable", label: "可叠加" }
                        ].map((item) => (
                            <button
                                key={item.key}
                                onClick={() => setFilter(item.key as FilterType)}
                                className={`rounded-sm border px-4 py-1.5 text-sm transition
          ${filter === item.key
                                        ? "border-red-500 bg-red-50 text-red-600"
                                        : "border-gray-200 text-gray-600 hover:border-red-300"
                                    }
        `}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>




                {loading ? (
                    <Loading />
                ) : (
                    <div className="grid grid-cols-2 gap-6">
                        {filteredList.map((item) => {
                            const countdown = countdownData.find(c => c.id === item.id);
                            return (
                                <div
                                    key={item.id}
                                    className="relative flex overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
                                >
                                    {/* 左侧金额 */}
                                    <div className="flex w-48 flex-col items-center justify-center bg-gradient-to-br from-red-500 to-red-600 text-white">
                                        <span className="text-4xl font-bold">
                                            {item.coupon.type === "满减"
                                                ? `¥${item.coupon.amount}`
                                                : `${item.coupon.discount}折`}
                                        </span>
                                        <p className="mt-1 text-sm">{item.coupon.type}</p>
                                        <p className="mt-1 text-xs opacity-90">
                                            满 {item.coupon.threshold} 可用
                                        </p>
                                    </div>

                                    {/* 右侧内容 */}
                                    <div className="flex flex-1 flex-col justify-between px-5 py-2">
                                        <div>
                                            {/* 倒计时 */}
                                            <span
                                                className={`inline-block rounded px-2 py-0.5 text-xs font-medium
                          ${countdown?.status === "ongoing"
                                                        ? "bg-red-50 text-red-600"
                                                        : countdown?.status === "notStarted"
                                                            ? "bg-gray-100 text-gray-500"
                                                            : "bg-gray-200 text-gray-400"
                                                    }
                        `}
                                            >
                                                {countdown?.text}
                                            </span>

                                            <h3 className="mt-2 text-lg font-medium text-gray-800">
                                                {item.coupon.name}
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {item.coupon.condition}
                                            </p>

                                            <div className="mt-3 space-y-1 text-xs text-gray-500">
                                                <p>
                                                    使用范围：
                                                    <span className="ml-1 text-gray-700">
                                                        {item.coupon.scope}
                                                    </span>
                                                </p>
                                                <p>
                                                    可领取：
                                                    <span className="ml-1 text-gray-700">
                                                        {dayjs(item.startTime).format(
                                                            "YYYY-MM-DD HH:mm:ss"
                                                        )}{" "}
                                                        ~{" "}
                                                        {dayjs(item.endTime).format(
                                                            "YYYY-MM-DD HH:mm:ss"
                                                        )}
                                                    </span>
                                                </p>
                                                <p>
                                                    使用有效期：
                                                    <span className="ml-1 text-gray-700">
                                                        {dayjs(item.coupon.startTime).format(
                                                            "YYYY-MM-DD HH:mm:ss"
                                                        )}{" "}
                                                        ~{" "}
                                                        {dayjs(item.coupon.expireTime).format(
                                                            "YYYY-MM-DD HH:mm:ss"
                                                        )}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* 操作区 */}
                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-xs text-gray-400">
                                                剩余 {item.totalNum} 张 · 每人限领{" "}
                                                {item.limitNum} 张
                                            </span>

                                            <button
                                                disabled={
                                                    item.received ||
                                                    countdown?.status !== "ongoing" ||
                                                    receivingId === item.couponId
                                                }
                                                onClick={() => handleReceiveCoupon(item.couponId)}
                                                className={`h-9 w-24 rounded-full text-sm font-medium transition
    ${item.received || countdown?.status !== "ongoing"
                                                        ? "cursor-not-allowed bg-gray-200 text-gray-400"
                                                        : receivingId === item.couponId
                                                            ? "bg-red-300 text-white cursor-wait"
                                                            : "bg-red-500 text-white hover:bg-red-600"
                                                    }
  `}
                                            >
                                                {item.received
                                                    ? "已领取"
                                                    : receivingId === item.couponId
                                                        ? "领取中..."
                                                        : "立即领取"}
                                            </button>

                                        </div>
                                    </div>

                                    {/* 角标 */}
                                    {countdown?.status === "ongoing" && (
                                        <span className="absolute right-0 top-0 rounded-bl-lg bg-red-500 px-2 py-1 text-xs text-white">
                                            限时
                                        </span>
                                    )}

                                    {item.totalNum > 1000 && (
                                        <span className="absolute left-0 top-0 rounded-br-lg bg-orange-500 px-2 py-1 text-xs text-white">
                                            热门
                                        </span>
                                    )}

                                    {item.coupon.isStackable && (
                                        <span className="absolute right-0 bottom-0 rounded-tl-lg bg-yellow-400 px-2 py-1 text-xs text-white">
                                            可叠加
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CouponCenter;
