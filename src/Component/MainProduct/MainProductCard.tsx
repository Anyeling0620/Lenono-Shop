// src/component/MainProduct/MainProductCard.tsx
import type { MainProduct } from "../../types/mainProduct";
import { Link } from "react-router-dom"; // 1. 引入 Link 组件

interface CardProps {
  product: MainProduct;
}

const Card = ({ product }: CardProps) => {
  const featuresText = product.features.join(" | ");
  const tags = [];
  if (product.coupon > 0) {
    tags.push({
      type: "coupon",
      text: `${product.coupon}元券`,
      value: product.coupon,
    });
  }
  if (product.customerize) {
    tags.push({ type: "normal", text: "外观定制" });
  }
  if (product.tradeIn) {
    tags.push({ type: "normal", text: "以旧换新" });
  }

  const finalPrice = product.originalPrice - product.coupon;

  return (
    <div className="bg-white hover:shadow-2xl transition-shadow duration-300 text-center">
      {/* 2. 关键修改：将 a 标签改为 Link，to 属性指向详情页路由 */}
      {/* 这里的 product.id 对应 App.tsx 中的 :id */}
      <Link to={`/product/${product.id}`} className="block" target="_blank">
        {/* 图片居中 */}
        <div className="flex justify-center mb-3 hover:opacity-90 transition-opacity duration-300">
          <img
            src={product.image}
            alt={product.name}
            className="h-[160px] object-contain"
          />
        </div>

        {/* 商品名称 */}
        <div className="text-[15px] text-[#242424] font-semibold mb-2 overflow-hidden text-ellipsis whitespace-nowrap px-4">
          {product.name}
        </div>

        {/* 特点 */}
        <div className="text-xs text-[#858585] h-[14px] leading-[14px] overflow-hidden break-all px-2">
          {featuresText}
        </div>

        {/* 标签 (代码保持不变) */}
        <div className="h-[18px] overflow-hidden flex justify-center gap-1 mt-2">
          {tags.map((tag, index) =>
            tag.type === "coupon" ? (
              <div
                key={tag.text}
                className={`flex rounded-[2px] overflow-hidden text-xs h-[18px] ${
                  index === 0
                    ? "border-[.5px] border-[#ef1e0b]"
                    : "border-[.5px] border-[#000000]"
                }`}
              >
                <span
                  className={`bg-white ${
                    index === 0 ? "text-[#ef1e0b]" : "text-[#000000]"
                  } px-1 flex items-center border-r-[#ef1e0b] border-[.5px]`}
                >
                  {tag.value}元
                </span>
                <span
                  className={`px-1 flex items-center bg-white ${
                    index === 0 ? "text-[#ef1e0b]" : "text-[#000000]"
                  }`}
                >
                  券
                </span>
              </div>
            ) : (
              <span
                key={tag.text}
                className={`border-[.5px] rounded-[2px] text-xs px-1 py-0.5 h-[18px] flex items-center ${
                  index === 0
                    ? "border-[#ef1e0b] text-[#ef1e0b]"
                    : "border-[#000000] text-[#000000]"
                }`}
              >
                {tag.text}
              </span>
            )
          )}
        </div>

        {/* 价格 */}
        <div className="mt-[7px] block text-[#e2231a] tracking-[-0.1px] text-center font-semibold text-[0] font-microsoft-yahei pb-4">
          {product.coupon > 0 ? (
            <div className="flex items-baseline justify-center gap-1 mt-3">
              <span className="text-[#e2231a] text-base font-bold leading-none">
                到手价￥{finalPrice}
              </span>
              <span className="text-xs text-gray-500 line-through leading-none">
                ￥{product.originalPrice}
              </span>
            </div>
          ) : (
            <span className="text-base font-semibold text-[#e2231a] block mt-3">
              ￥{product.originalPrice}元
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default Card;
