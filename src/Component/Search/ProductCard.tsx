import React from 'react';
import { Link } from 'react-router-dom';
import Tag from '../Search/Tag';
import type { ProductCardItem } from '../../types/product';

// 辅助函数：将价格转换为数字（处理后端返回的字符串/数字类型）
const toNumber = (value: number | string): number => {
  if (typeof value === 'number') return value;
  return parseFloat(value) || 0;
};

interface ProductCardProps {
  product: ProductCardItem;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // 1. 获取商品最低配置的售价（转换为数字）
  const productPrice = toNumber(product.minPriceConfig.salePrice);
  // 2. 筛选可用优惠券：满足门槛的优惠券
  const availableCoupons = product.coupons.filter((item) => {
    const threshold = toNumber(item.coupon.threshold);
    // 门槛为0 或 商品价格≥门槛，视为可用
    return threshold === 0 || productPrice >= threshold;
  });

  // 3. 区分满减和折扣类型优惠券
  const cashCoupons = availableCoupons.filter(item => item.coupon.type === '满减');
  const discountCoupons = availableCoupons.filter(item => item.coupon.type !== '满减');

  // 4. 筛选最高额优惠券：优先满减（取金额最高），无则取折扣（仅当无满减时）
  let highestCoupon = null;
  if (cashCoupons.length > 0) {
    // 满减类型：取优惠金额最高的
    highestCoupon = cashCoupons.reduce((prev, current) => {
      const prevAmount = toNumber(prev.coupon.amount);
      const currentAmount = toNumber(current.coupon.amount);
      return prevAmount > currentAmount ? prev : current;
    });
  } else if (discountCoupons.length > 0) {
    // 无满减：取第一个折扣优惠券（若有多个可根据需求取折扣最大的）
    highestCoupon = discountCoupons[0];
  }

  return (
    <li className='w-[290px] h-[385px] bg-white hover:shadow-lg transition-all duration-300'>
      <div className='px-4 py-4'>
        <Link to={`/product/${product.product.id}`} className='cursor-pointer' target={product.product.id}>
          <div className='overflow-hidden w-[250px] h-[180px] mx-auto border-b-[1px] border-[#e0e0e0] flex items-center justify-center'>
            <img
              className='w-[160px] h-[160px] object-contain'
              src={product.product.mainImage as string}
            />
          </div>

          {/* 商品名称 */}
          <div className='leading-4 px-1 h-[36px] mt-[10px] text-left text-[#424242]'>
            <span className='text-[13px] line-clamp-2'>
              {product.product.name}
            </span>
          </div>

          {/* 商品描述 */}
          <div className='h-9 px-1 leading-4 overflow-hidden mt-1.5 text-left text-[#cfcfcf] text-[12px] line-clamp-2'>
            {product.product.description}
          </div>

          {/* 价格信息 */}
          <div className='flex items-center mt-1 px-1'>
            <div className='font-bold h-[30px] flex text-[14px] text-red-500 items-center'>
              <span>{highestCoupon && "到手价"}￥{product.minPriceConfig.salePrice}</span>
            </div>
            {highestCoupon && (
              <div className='text-[12px] text-[#979797] mt-0.5 ml-[3px] line-through'>
                <span>￥{product.minPriceConfig.originalPrice}</span>
              </div>
            )}
          </div>

          {/* 标签区域 */}
          <div className='min-h-[30px] leading-[30px] overflow-hidden flex items-center flex-wrap'>
            {product.shelfProduct.isSelfOperated && <Tag type="self" />}
            {/* 只渲染筛选后的最高额优惠券标签 */}
            {highestCoupon && (
              <Tag
                type="coupon"
                money={
                  highestCoupon.coupon.type === '满减'
                    ? toNumber(highestCoupon.coupon.amount)
                    : toNumber(highestCoupon.coupon.amount) * toNumber(product.minPriceConfig.salePrice)
                }
              />
            )}
            {product.shelfProduct.isCustomizable && <Tag type="custom" />}
            {product.shelfProduct.isSelfOperated && <Tag type="tradeIn" />}
            {product.shelfProduct.installment > 0 && <Tag type="installment" month={product.shelfProduct.installment} />}
          </div>
        </Link>
      </div>
    </li>
  );
};

export default ProductCard;