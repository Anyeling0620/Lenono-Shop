import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Checkout: React.FC = () => {
  const { items, totalCount, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const handleSubmitOrder = () => {
    if (items.length === 0) return;
    // 简单模拟提交订单：清空购物车并跳转到首页
    clearCart();
    navigate("/");
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen font-sans text-[#333]">
      <div className="w-[1200px] mx-auto pt-6 pb-12">
        {/* 面包屑 */}
        <div className="text-xs text-gray-500 flex items-center gap-1 mb-4">
          <Link to="/" className="hover:text-[#e1140a]">
            首页
          </Link>
          <span>{">"}</span>
          <Link to="/shopping-cart" className="hover:text-[#e1140a]">
            购物车
          </Link>
          <span>{">"}</span>
          <span className="text-gray-700">填写订单</span>
        </div>

        <div className="flex gap-6">
          {/* 左侧：收货信息 + 商品清单 */}
          <div className="flex-1 space-y-4">
            {/* 收货信息（静态表单区域） */}
            <div className="bg-white rounded-sm shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">收货信息</h2>
                <span className="text-xs text-[#e1140a] cursor-pointer">
                  管理收货地址
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <span className="mr-2 font-medium">收货人：</span>
                  张三
                </div>
                <div>
                  <span className="mr-2 font-medium">联系方式：</span>
                  138****8888
                </div>
                <div>
                  <span className="mr-2 font-medium">收货地址：</span>
                  北京市 海淀区 上地信息产业基地 XX号 XX楼
                </div>
              </div>
            </div>

            {/* 支付方式（静态） */}
            <div className="bg-white rounded-sm shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-3">支付方式</h2>
              <div className="flex gap-3 text-sm">
                <button className="px-3 py-1.5 border border-[#e1140a] text-[#e1140a] rounded-sm">
                  在线支付
                </button>
                <button className="px-3 py-1.5 border border-gray-300 text-gray-600 rounded-sm">
                  花呗分期
                </button>
                <button className="px-3 py-1.5 border border-gray-300 text-gray-600 rounded-sm">
                  银行卡快捷
                </button>
              </div>
            </div>

            {/* 商品清单 */}
            <div className="bg-white rounded-sm shadow-sm">
              <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold">商品清单</h2>
                <span className="text-xs text-gray-500">
                  共 {totalCount} 件商品
                </span>
              </div>
              {items.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-gray-500">
                  当前没有待结算的商品，
                  <Link to="/" className="text-[#e1140a] mx-1">
                    去首页看看
                  </Link>
                </div>
              ) : (
                <div className="px-4 py-3">
                  {items.map((item) => (
                    <div
                      key={item.id + item.specText}
                      className="flex items-center py-3 border-b border-gray-100 last:border-b-0 text-sm"
                    >
                      <div className="w-[80px] h-[80px] border border-gray-100 flex items-center justify-center mr-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-[13px] text-[#333] mb-1">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500 mb-1">
                          规格：{item.specText}
                        </div>
                        <div className="text-xs text-gray-400">
                          配送：预计 1-3 个工作日送达
                        </div>
                      </div>
                      <div className="w-[100px] text-right text-sm text-[#e1140a]">
                        ¥{item.price}
                      </div>
                      <div className="w-[60px] text-center text-xs text-gray-600">
                        x{item.count}
                      </div>
                      <div className="w-[100px] text-right text-sm text-[#e1140a] font-semibold">
                        ¥{item.price * item.count}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 右侧：结算信息汇总 */}
          <div className="w-[280px]">
            <div className="bg-white rounded-sm shadow-sm p-4 text-sm space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>商品金额：</span>
                <span>¥{totalPrice}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>运费：</span>
                <span className="text-[#18a600]">¥0.00</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>优惠：</span>
                <span className="text-[#e1140a]">- ¥0.00</span>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-3 mt-1 flex justify-between items-center">
                <span className="text-xs text-gray-600">应付总额：</span>
                <span className="text-[#e1140a] text-xl font-bold">
                  ¥{totalPrice}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                寄送至：北京市 海淀区 上地信息产业基地
              </div>
              <button
                className={`w-full h-[40px] mt-3 text-base font-bold rounded-sm ${
                  items.length === 0
                    ? "bg-gray-300 text-white cursor-not-allowed"
                    : "bg-[#e1140a] text-white hover:bg-[#c91008] transition-colors"
                }`}
                disabled={items.length === 0}
                onClick={handleSubmitOrder}
              >
                提交订单
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;


