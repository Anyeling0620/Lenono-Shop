import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { productCategories } from "../assets/data/mockProducts";

const ShoppingCart: React.FC = () => {
  const { items, totalCount, totalPrice, updateCount, removeItem } = useCart();
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

  // 价格与优惠计算：原价总额、活动价总额（totalPrice）、额外领券优惠
  const originTotal = useMemo(
    () => items.reduce((sum, it) => sum + it.originalPrice * it.count, 0),
    [items]
  );
  const baseSaved = Math.max(originTotal - totalPrice, 0);

  const [couponUsed, setCouponUsed] = useState(false);
  const couponValue = 100;
  const extraCoupon = couponUsed ? couponValue : 0;

  const finalPay = Math.max(totalPrice - extraCoupon, 0);
  const savedAmount = baseSaved + extraCoupon;

  return (
    <div className="bg-[#f5f5f5] min-h-screen font-sans text-[#333]">
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
              <input type="checkbox" className="accent-[#e1140a]" />
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
                  className="px-6 py-4 flex items-center text-sm border-b border-[#ffe5d7] last:border-b-0"
                >
                  <div className="w-[80px] flex items-center gap-2">
                    <input type="checkbox" className="accent-[#e1140a]" />
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
                        <button className="px-2 py-0.5 border border-[#e1140a] text-[#e1140a] rounded-sm">
                          选择服务
                        </button>
                        <button className="px-2 py-0.5 border border-[#e1140a] text-[#e1140a] rounded-sm">
                          选择赠品
                        </button>
                        <button
                          className="px-2 py-0.5 border border-[#e1140a] text-[#e1140a] rounded-sm"
                          onClick={() => setCouponUsed(true)}
                        >
                          {couponUsed ? "已领券" : "领券"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 单价 */}
                  <div className="w-[140px] text-center text-sm">
                    <div className="text-gray-500 line-through text-xs">
                      ¥{item.originalPrice}
                    </div>
                    <div className="text-[#e1140a] font-semibold">
                      ¥{item.price}
                    </div>
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
                    ¥{item.price * item.count}
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
              <span className="mx-1 text-[#e1140a]">{totalCount}</span>
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
            <button className="text-xs text-[#e1140a] underline">
              优惠明细
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

