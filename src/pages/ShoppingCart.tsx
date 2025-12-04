import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { productCategories } from "../assets/data/mockProducts";

const ShoppingCart: React.FC = () => {
  const { items, totalCount, updateCount, removeItem } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate("/checkout");
  };

  // 使用商品数据生成“为你推荐”（使用真实商品图）
  const recommendList = useMemo(() => {
    const allProducts =
      productCategories.flatMap((c) => c.products).slice(0, 12) || [];
    return allProducts.map((p) => ({
      id: p.id,
      name: p.name,
      image: p.image,
      price: p.currentPrice || p.originalPrice - p.coupon,
      link: `/product/${p.id}`,
    }));
  }, []);

  const [recommendStart, setRecommendStart] = useState(0);
  const visibleCount = 4;
  const totalRecommend = recommendList.length;

  const handleRecommendNav = (direction: "prev" | "next") => {
    if (totalRecommend <= visibleCount) return;
    setRecommendStart((prev) => {
      if (direction === "next") {
        return (prev + visibleCount) % totalRecommend;
      }
      // prev
      return (prev - visibleCount + totalRecommend) % totalRecommend;
    });
  };

  // 选中状态：默认全选，删除/新增时自动同步
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedIds((prev) => {
      const currentIds = items.map((it) => it.id);
      const kept = prev.filter((id) => currentIds.includes(id));
      const added = currentIds.filter((id) => !kept.includes(id));
      return [...kept, ...added]; // 新增的商品默认选中
    });
  }, [items]);

  const selectedItems = useMemo(
    () => items.filter((it) => selectedIds.includes(it.id)),
    [items, selectedIds]
  );

  const selectedCount = useMemo(
    () => selectedItems.reduce((sum, it) => sum + it.count, 0),
    [selectedItems]
  );

  const allSelected =
    items.length > 0 && selectedIds.length === items.length;

  const handleToggleItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleToggleAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((it) => it.id));
    }
  };



  // 每个商品的附加费用（如服务）或优惠（如专属券）
  const [itemOptions, setItemOptions] = useState<
    Record<
      string,
      {
        servicePrice?: number;
        serviceKey?: "2year" | "1year" | "none";
        selectedGifts?: string[]; // 选中的赠品列表
        couponClaimed?: boolean; // 是否已领券
      }
    >
  >({});

  // 赠品价格映射
  const giftPrices = {
    gift1: 100,  // 联想原装笔记本电脑包
    gift2: 30,   // 无线鼠标套装
    gift3: 0     // Office 试用版激活卡
  };

  // 服务总费用
  const serviceTotal = useMemo(
    () =>
      selectedItems.reduce((sum, it) => {
        const opt = itemOptions[it.id];
        const extra = opt?.servicePrice ?? 0;
        return sum + extra * it.count;
      }, 0),
    [selectedItems, itemOptions]
  );

  // 赠品总费用
  const giftTotal = useMemo(
    () =>
      selectedItems.reduce((sum, it) => {
        const opt = itemOptions[it.id];
        const selectedGifts = opt?.selectedGifts || [];
        const giftSum = selectedGifts.reduce((giftSum, giftId) => {
          return giftSum + (giftPrices[giftId as keyof typeof giftPrices] || 0);
        }, 0);
        return sum + giftSum * it.count;
      }, 0),
    [selectedItems, itemOptions]
  );

  // 节省金额：计算优惠券带来的节省
  const savedAmount = useMemo(
    () => {
      // 没有选中商品时，节省金额为0
      if (selectedItems.length === 0) return 0;
      
      // 优惠券带来的节省
      return selectedItems.reduce((sum, it) => {
        const opt = itemOptions[it.id];
        if (opt?.couponClaimed) {
          return sum + (it.originalPrice - it.price) * it.count;
        }
        return sum;
      }, 0);
    },
    [selectedItems, itemOptions]
  );

  // 调整后的订单总价
  const baseTotal = useMemo(
    () =>
      selectedItems.reduce((sum, it) => {
        const opt = itemOptions[it.id];
        // 如果已领券，使用优惠价；否则使用原价
        const unitPrice = opt?.couponClaimed ? it.price : it.originalPrice;
        return sum + unitPrice * it.count;
      }, 0),
    [selectedItems, itemOptions]
  );

  const adjustedTotal = baseTotal + serviceTotal + giftTotal;
  const finalPay = adjustedTotal;

  // 优惠详细模块显示状态
  const [showDiscountDetail, setShowDiscountDetail] = useState(false);

  // 每个商品行的下拉栏展开状态（服务/赠品/领券）
  // 单个下拉层的展开状态（同时只展开一个：id + 类型）
  const [openPanel, setOpenPanel] = useState<{
    id: string;
    type: "service" | "gift" | "coupon";
  } | null>(null);

  const toggleRowPanel = (
    id: string,
    key: "service" | "gift" | "coupon"
  ): void => {
    setOpenPanel((prev) =>
      prev && prev.id === id && prev.type === key ? null : { id, type: key }
    );
  };

  return (
    <div
      className="bg-[#f5f5f5] min-h-screen font-sans text-[#333]"
      onClick={() => setOpenPanel(null)}
    >
      <div className="w-[1200px] mx-auto pt-6 pb-12">
        {/* 顶部标题 */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-[#333]">
            全部商品
            <span className="ml-1 text-[#e1140a]">{totalCount}</span>
          </div>
        </div>

        {/* 购物车主体区域 */}
        <div className="bg-white rounded-sm shadow-sm">
          {/* 表头 */}
          <div className="px-6 py-3 text-xs text-gray-500 flex items-center border-b border-gray-100">
            <div className="w-[80px] flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-[#e1140a]"
                checked={allSelected}
                onChange={handleToggleAll}
                onClick={(e) => e.stopPropagation()}
              />
              <span>全选</span>
            </div>
            <div className="w-[400px]">商品</div>
            <div className="w-[140px] text-center">单价</div>
            <div className="w-[140px] text-center">数量</div>
            <div className="w-[140px] text-center">小计</div>
            <div className="flex-1 text-center">操作</div>
          </div>

          {/* 商品行区域 */}
          {items.length === 0 ? (
            <div className="px-6 py-16 text-center text-sm text-gray-500">
              购物车还是空的，去
              <Link to="/" className="text-[#e1140a] mx-1">
                首页
              </Link>
              逛逛吧~
            </div>
          ) : (
            <div className="bg-[#fff7f2]">
              {items.map((item) => (
                <div
                  key={item.id + item.specText}
                  className="relative px-6 py-4 flex items-center text-sm border-b border-[#ffe5d7] last:border-b-0"
                >
                  <div className="w-[80px] flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-[#e1140a]"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleToggleItem(item.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* 商品信息 */}
                  <div className="w-[400px] flex">
                    <Link to={`/product/${item.id}`} className="flex">
                      <div className="w-[80px] h-[80px] border border-gray-100 flex items-center justify-center mr-3 bg-white">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </Link>
                    <div className="flex-1">
                      <Link
                        to={`/product/${item.id}`}
                        className="text-[13px] text-[#333] hover:text-[#e1140a] line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <div className="text-xs text-gray-500 mt-1">
                        规格：{item.specText}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                        <button
                          className="px-2 py-0.5 border border-[#e1140a] text-[#e1140a] rounded-sm bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRowPanel(item.id, "service");
                          }}
                        >
                          选择服务
                        </button>
                        <button
                          className="px-2 py-0.5 border border-[#e1140a] text-[#e1140a] rounded-sm bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRowPanel(item.id, "gift");
                          }}
                        >
                          选择赠品
                        </button>
                        <button
                          className="px-2 py-0.5 border border-[#e1140a] text-[#e1140a] rounded-sm bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRowPanel(item.id, "coupon");
                          }}
                        >
                          领券
                        </button>
                      </div>

                      {/* 下拉栏：服务/赠品/领券（悬浮层，不撑高行高） */}
                      {openPanel &&
                        openPanel.id === item.id &&
                        openPanel.type === "service" && (
                          <div
                            className="absolute left-[160px] top-[90px] z-20 w-[340px] p-3 border border-[#ffd0bf] bg-white rounded-sm text-xs text-gray-700 shadow-lg space-y-1 transform origin-top transition-all duration-150 ease-out scale-y-100 opacity-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                          <div className="font-semibold text-[#e1140a] mb-1">
                            可选服务
                          </div>
                            {(() => {
                              const current = itemOptions[item.id] || {};
                              const key = current.serviceKey || "none"; // 默认不需要服务
                              const renderOption = (
                                label: string,
                                price: number,
                                optionKey: "2year" | "1year" | "none"
                              ) => {
                                const checked = key === optionKey;
                                return (
                                  <button
                                    key={optionKey}
                                    className="w-full flex items-center justify-between hover:bg-[#fff5f0] px-1 py-0.5 rounded"
                                    onClick={() =>
                                      setItemOptions((prev) => {
                                        const nextKey = optionKey;
                                        const nextPrice = nextKey === "2year" ? 100 : nextKey === "1year" ? 30 : 0;
                                        return {
                                          ...prev,
                                          [item.id]: {
                                            ...prev[item.id],
                                            serviceKey: nextKey,
                                            servicePrice: nextPrice,
                                          },
                                        };
                                      })
                                    }
                                  >
                                    <div className="flex items-center">
                                      <span
                                    className={`w-5 h-5 mr-2 border-2 rounded flex items-center justify-center transition-all duration-200 ${checked ? "border-[#e1140a] bg-[#e1140a] text-white scale-110" : "border-gray-400 bg-white hover:border-[#e1140a]"}`}
                                  >
                                        {checked && (
                                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                          </svg>
                                        )}
                                      </span>
                                      <span>{label}</span>
                                    </div>
                                    <span className="text-[#e1140a]">
                                      {price > 0 ? `¥${price}` : "免费"}
                                    </span>
                                  </button>
                                );
                              };

                              return (
                                <>
                                  {renderOption("联想原装笔记本电脑包套餐", 100, "2year")}
                                  {renderOption("无线鼠标套餐", 30, "1year")}
                                  {renderOption("不需要增值服务", 0, "none")}
                                </>
                              );
                            })()}
                          </div>
                        )}

                      {openPanel &&
                        openPanel.id === item.id &&
                        openPanel.type === "gift" && (
                          <div
                            className="absolute left-[160px] top-[90px] z-20 w-[340px] p-3 border border-[#ffd0bf] bg-white rounded-sm text-xs text-gray-700 shadow-lg space-y-1 transform origin-top transition-all duration-150 ease-out scale-y-100 opacity-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                          <div className="font-semibold text-[#e1140a] mb-1">
                            可选赠品
                          </div>
                          {(() => {
                            const gifts = [
                              { id: "gift1", name: "联想原装笔记本电脑包", price: 100 },
                              { id: "gift2", name: "无线鼠标套装", price: 30 },
                              { id: "gift3", name: "Office 试用版激活卡", price: 0 }
                            ];
                            const selectedGifts = itemOptions[item.id]?.selectedGifts || [];

                            return gifts.map((gift) => {
                              const isChecked = selectedGifts.includes(gift.id);
                              return (
                                <button
                                    key={gift.id}
                                    className="w-full flex items-center hover:bg-[#fff5f0] px-1 py-0.5 rounded"
                                    onClick={() => {
                                      setItemOptions((prev) => {
                                        const currentGifts = prev[item.id]?.selectedGifts || [];
                                        const newGifts = isChecked
                                          ? currentGifts.filter((g) => g !== gift.id)
                                          : [...currentGifts, gift.id];
                                        return {
                                          ...prev,
                                          [item.id]: {
                                            ...prev[item.id],
                                            selectedGifts: newGifts
                                          }
                                        };
                                      });
                                    }}
                                  >
                                  <span
                                    className={`w-5 h-5 mr-2 border-2 rounded flex items-center justify-center transition-all duration-200 ${isChecked ? "border-[#e1140a] bg-[#e1140a] text-white scale-110" : "border-gray-400 bg-white hover:border-[#e1140a]"}`}
                                  >
                                    {isChecked && (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        className="w-4 h-4 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                    )}
                                  </span>
                                  <span className="flex-1 text-left">{gift.name}</span>
                                  <span className="text-[#e1140a]">
                                    {gift.price > 0 ? `+¥${gift.price}` : "免费"}
                                  </span>
                                </button>
                              );
                            });
                          })()}
                          </div>
                        )}

                      {openPanel &&
                        openPanel.id === item.id &&
                        openPanel.type === "coupon" && (
                          <div
                            className="absolute left-[160px] top-[90px] z-20 w-[340px] p-3 border border-[#ffd0bf] bg-white rounded-sm text-xs text-gray-700 shadow-lg space-y-1 transform origin-top transition-all duration-150 ease-out scale-y-100 opacity-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                          <div className="font-semibold text-[#e1140a] mb-1">
                            可用优惠券
                          </div>
                          <button
                            className="w-full flex items-center justify-between hover:bg-[#fff5f0] px-1 py-0.5 rounded"
                            onClick={() => {
                              setItemOptions((prev) => {
                                const current = prev[item.id] || {};
                                return {
                                  ...prev,
                                  [item.id]: {
                                    ...current,
                                    couponClaimed: !current.couponClaimed
                                  }
                                };
                              });
                            }}
                          >
                            <div className="flex items-center">
                              <span
                                className={`w-5 h-5 mr-2 border-2 rounded flex items-center justify-center transition-all duration-200 ${(itemOptions[item.id]?.couponClaimed ? "border-[#e1140a] bg-[#e1140a] text-white scale-110" : "border-gray-400 bg-white hover:border-[#e1140a]")}`}
                              >
                                {(itemOptions[item.id]?.couponClaimed) && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="w-4 h-4 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                              </span>
                              <span>{item.coupon}元券</span>
                            </div>
                            <span className="text-[#e1140a]">-¥{item.coupon}</span>
                          </button>
                          <div className="flex justify-between px-1 py-0.5 rounded text-gray-500">
                            <span>满5000减200（暂不可叠加）</span>
                            <span>限指定机型</span>
                          </div>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* 单价 */}
                  <div className="w-[140px] text-center text-sm">
                    {itemOptions[item.id]?.couponClaimed ? (
                      <>
                        <div className="text-gray-500 line-through text-xs">
                          ¥{item.originalPrice}
                        </div>
                        <div className="text-[#e1140a] font-semibold">
                          ¥{item.price}
                        </div>
                      </>
                    ) : (
                      <div className="text-[#333] font-semibold">
                        ¥{item.originalPrice}
                      </div>
                    )}
                    {(() => {
                      const servicePrice = itemOptions[item.id]?.servicePrice;
                      return servicePrice && servicePrice > 0 ? (
                        <div className="text-[#e1140a] text-xs">
                          +¥{servicePrice}/服务
                        </div>
                      ) : null;
                    })()}
                  </div>

                  {/* 数量 */}
                  <div className="w-[140px] flex justify-center">
                    <div className="flex border border-gray-300 w-[110px] h-[30px] bg-white">
                      <button
                        className="w-[32px] text-gray-500"
                        onClick={() => updateCount(item.id, item.count - 1)}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={item.count}
                        readOnly
                        className="w-[46px] text-center border-l border-r border-gray-300 text-xs"
                      />
                      <button
                        className="w-[32px] text-gray-500"
                        onClick={() => updateCount(item.id, item.count + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* 小计 */}
                  <div className="w-[140px] text-center text-[#e1140a] font-semibold">
                    ¥{((itemOptions[item.id]?.couponClaimed ? item.price : item.originalPrice) + (itemOptions[item.id]?.servicePrice || 0) + (itemOptions[item.id]?.selectedGifts?.reduce((sum, giftId) => sum + (giftPrices[giftId as keyof typeof giftPrices] || 0), 0) || 0)) * item.count}
                  </div>

                  {/* 操作 */}
                  <div className="flex-1 text-center text-xs text-gray-500 space-y-1">
                    <div className="cursor-pointer hover:text-[#e1140a]">
                      移入收藏夹
                    </div>
                    <div
                      className="cursor-pointer hover:text-[#e1140a]"
                      onClick={() => removeItem(item.id)}
                    >
                      删除
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部操作栏 */}
        <div className="mt-2 bg-white h-[60px] flex items-center px-6 rounded-sm shadow-sm text-sm">
          <div className="flex items-center gap-4 flex-1 text-gray-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-[#e1140a]" />
              <span>全选</span>
            </label>
            <button className="hover:text-[#e1140a]">删除</button>
            <button className="hover:text-[#e1140a]">清空失效商品</button>
            <button className="hover:text-[#e1140a]">移入收藏夹</button>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">
              已选择
              <span className="mx-1 text-[#e1140a]">{selectedCount}</span>
              件
            </span>
            <span className="text-gray-600">
              实付金额：
              <span className="text-[#e1140a] text-xl font-bold">
                ¥{finalPay}
              </span>
            </span>
            <span className="text-gray-600 text-xs">
              节省：<span className="text-[#e1140a]">¥{savedAmount}</span>
            </span>
            <button 
              className="text-xs text-[#e1140a] underline hover:no-underline"
              onClick={() => setShowDiscountDetail(!showDiscountDetail)}
            >
              优惠明细 {showDiscountDetail ? '▲' : '▼'}
            </button>
            <button
              className={`w-[160px] h-[46px] text-lg font-bold ml-2 ${
                items.length === 0
                  ? "bg-gray-300 text-white cursor-not-allowed"
                  : "bg-[#e1140a] text-white hover:bg-[#c91008] transition-colors"
              }`}
              disabled={items.length === 0}
              onClick={handleCheckout}
            >
              去结算
            </button>
          </div>
        </div>

        {/* 优惠详细模块 */}
        {showDiscountDetail && (
          <div className="mt-2 bg-white rounded-sm shadow-sm p-6">
            <h3 className="text-lg font-semibold text-[#333] mb-4">优惠详情</h3>
            <div className="space-y-3">
              {/* 优惠券优惠 */}
              {selectedItems.map((item) => {
                const opt = itemOptions[item.id];
                if (opt?.couponClaimed) {
                  return (
                    <div key={`coupon-${item.id}`} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name} - 优惠券</span>
                      <span className="text-[#e1140a]">-¥{(item.originalPrice - item.price) * item.count}</span>
                    </div>
                  );
                }
                return null;
              })}
              
              {/* 服务费用 */}
              {serviceTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">服务费用</span>
                  <span className="text-[#e1140a]">+¥{serviceTotal}</span>
                </div>
              )}
              
              {/* 赠品费用 */}
              {giftTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">赠品费用</span>
                  <span className="text-[#e1140a]">+¥{giftTotal}</span>
                </div>
              )}
              
              {/* 原价合计 */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">商品原价合计</span>
                <span className="text-gray-600">¥{selectedItems.reduce((sum, it) => sum + it.originalPrice * it.count, 0)}</span>
              </div>
              
              {/* 服务原价合计 */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">服务原价合计</span>
                <span className="text-gray-600">¥{serviceTotal}</span>
              </div>
              
              {/* 赠品原价合计 */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">赠品原价合计</span>
                <span className="text-gray-600">¥{giftTotal}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-gray-600">总优惠金额</span>
                  <span className="text-[#e1140a]">¥{savedAmount}</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-2">
                  <span className="text-gray-600">实付金额</span>
                  <span className="text-[#e1140a]">¥{finalPay}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 为你推荐区域（带左右切换） */}
        <div className="mt-8 bg-white rounded-sm shadow-sm relative">
          <div className="px-6 py-3 border-b border-gray-100 flex items-center">
            <h2 className="text-lg font-semibold text-[#333]">为你推荐</h2>
          </div>

          <div className="px-10 py-6 relative">
            {/* 左右切换按钮：圆形灰色按钮，深灰色箭头，不超出白色块 */}
            {totalRecommend > visibleCount && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition-colors shadow-sm"
                  onClick={() => handleRecommendNav("prev")}
                  aria-label="上一组"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition-colors shadow-sm"
                  onClick={() => handleRecommendNav("next")}
                  aria-label="下一组"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </button>
              </>
            )}

            <div className="grid grid-cols-4 gap-6">
              {recommendList
                .slice(recommendStart, recommendStart + visibleCount)
                .concat(
                  recommendStart + visibleCount > totalRecommend
                    ? recommendList.slice(
                        0,
                        (recommendStart + visibleCount) % totalRecommend
                      )
                    : []
                )
                .slice(0, visibleCount)
                .map((item) => (
                  <Link
                    to={item.link}
                    key={item.id + item.name}
                    className="flex flex-col items-center text-center text-sm hover:shadow-md transition-shadow duration-200 border border-transparent hover:border-[#ffe0d5] pb-4"
                  >
                    <div className="w-[180px] h-[180px] flex items-center justify-center mb-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="px-2 text-[13px] text-[#333] line-clamp-2 mb-1">
                      {item.name}
                    </div>
                    <div className="text-[#e1140a] font-bold mt-1">
                      ¥{item.price}
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;

