// src/component/MainProduct/MainProductCard.tsx
import { Link } from "react-router-dom";
import type { ProductCardItem } from "../../types/product";

interface CardProps {
  product: ProductCardItem;
}

const MainProductCard = ({ product }: CardProps) => {
  const name = product.product.name;
  const image = product.product.mainImage;
  const featuresText = product.product.description;  
  const hasCoupon = product.coupons.length > 0;
  const couponInfo = product.coupons[0];
  const customerize = product.shelfProduct.isCustomizable;
  const tradeIn = product.shelfProduct.isSelfOperated;
  const originalPrice = product.minPriceConfig?.originalPrice || product?.minPriceConfig.salePrice;
  const id = product.shelfProduct.id;

  let finalPrice = product.minPriceConfig.salePrice;
  const tags = [];

  if (hasCoupon && couponInfo) {
    if (couponInfo.coupon.type ==='满减') {
      finalPrice = Number(originalPrice) - Number(couponInfo.coupon.amount);
      tags.push({
        type: "coupon",
        text: `${couponInfo.coupon.amount}元券`,
        value: couponInfo.coupon.amount,
      });
    } else if (couponInfo.coupon.type === '折扣') {
      finalPrice = Number(originalPrice) * Number(couponInfo.coupon.discount);
      tags.push({
        type: "discount",
        text: `${(Number(couponInfo.coupon.discount)* 10).toFixed(1)}折`,
        value: Number(couponInfo.coupon.discount) * 10,
      });
    }
  }

  if (customerize) {
    tags.push({ type: "normal", text: "外观定制" });
  }
  if (tradeIn) {
    tags.push({ type: "normal", text: "以旧换新" });
  }

  return (
    <div className="bg-white hover:shadow-2xl transition-shadow duration-300 text-center">
      <Link to={`/product/${id}`} className="block">
        <div className="flex justify-center mb-3 hover:opacity-90 transition-opacity duration-300">
          <img
            src={image}
            alt={name}
            className="h-[160px] object-contain"
          />
        </div>

        <div className="text-[15px] text-[#242424] font-semibold mb-2 overflow-hidden text-ellipsis whitespace-nowrap px-4">
          {name}
        </div>

        <div className="text-xs text-[#858585] h-[14px] leading-[14px] overflow-hidden break-all px-2">
          {featuresText}
        </div>

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
            ) : tag.type === "discount" ? (
              <span
                key={tag.text}
                className="border-[.5px] rounded-[2px] text-xs px-1 py-0.5 h-[18px] flex items-center border-[#ef1e0b] text-[#ef1e0b]"
              >
                {tag.text}
              </span>
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

        <div className="mt-[7px] block text-[#e2231a] tracking-[-0.1px] text-center font-semibold text-[0] font-microsoft-yahei pb-4">
          {hasCoupon ? (
            <div className="flex items-baseline justify-center gap-1 mt-3">
              <span className="text-[#e2231a] text-base font-bold leading-none">
                到手价￥{Number(finalPrice).toFixed(0)}
              </span>
              <span className="text-xs text-gray-500 line-through leading-none">
                ￥{Number(originalPrice).toFixed(0)}
              </span>
            </div>
          ) : (
            <span className="text-base font-semibold text-[#e2231a] block mt-3">
              ￥{Number(originalPrice).toFixed(0)}元
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default MainProductCard;
