import React from 'react';
import { Link } from 'react-router-dom';
import type { SeckillProductVO, SeckillProductConfigVO } from '../../types/flashSale';
import { getImageUrl } from '../../utils/imageConfig';

interface ProductCardProps {
  product: SeckillProductVO;
}

// 辅助函数：获取商品秒杀价格最低的配置项（过滤有效配置项）
const getLowestPriceConfig = (product: SeckillProductVO): SeckillProductConfigVO => {
  // 严格过滤：秒杀配置正常 + 商品配置正常 + 秒杀价格>0 + 商品配置售价>0
  const validConfigs = product.configs.filter(config => 
    config.seckillPrice > 0 && 
    config.status === '正常' && 
    config.config.status === '正常' &&
    config.config.salePrice > 0
  );

  if (validConfigs.length === 0) {
    // 返回默认空配置项（兜底）
    return {
      id: '',
      seckillProductId: product.id,
      configId: '',
      shelfNum: 0,
      remainNum: 0,
      lockNum: 0,
      seckillPrice: 0,
      createdAt: '',
      updatedAt: '',
      status: '售罄',
      config: {
        id: '',
        productId: product.productId,
        config1: '',
        config2: '',
        salePrice: 0,
        originalPrice: 0,
        createdAt: '',
        updatedAt: '',
        status: '下架'
      }
    };
  }

  // 找到秒杀价格最低的配置项
  return validConfigs.reduce((prev, current) => {
    return prev.seckillPrice < current.seckillPrice ? prev : current;
  });
};

// 辅助函数：验证并计算优惠后的价格（兜底逻辑，防止接口数据不一致）
const calculateSeckillPrice = (
  basePrice: number,
  type: "立减" | "打折",
  reduceAmount: number,
  discount: number
): number => {
  if (type === "立减") {
    // 立减：基础价 - 立减金额（最低为0）
    return Math.max(0, basePrice - reduceAmount);
  } else {
    // 打折：基础价 × 折扣（折扣范围0-1，最低为0）
    const validDiscount = Math.max(0, Math.min(1, discount));
    return Math.round(basePrice * validDiscount * 100) / 100; // 保留两位小数
  }
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const mainConfig = getLowestPriceConfig(product);
  const productBase = product.product;
  const config = mainConfig.config;

  // 1. 基础价格：商品配置的售价（salePrice）作为优惠基准（业务中也可改用originalPrice，根据需求调整）
  const basePrice = config.salePrice;
  // 2. 接口返回的秒杀价
  const apiSeckillPrice = mainConfig.seckillPrice;
  // 3. 兜底计算的秒杀价（防止接口数据不一致）
  const calculatedSeckillPrice = calculateSeckillPrice(
    basePrice,
    product.type,
    product.reduceAmount,
    product.discount
  );
  // 最终秒杀价：优先用接口返回的，若不一致则用计算后的（可根据业务选择是否提示）
  const seckillPrice = apiSeckillPrice > 0 ? apiSeckillPrice : calculatedSeckillPrice;

  // 4. 原价：商品配置的原价（originalPrice），无则用售价（salePrice）
  const originalPrice = config.originalPrice || basePrice;

  // 5. 实际优惠金额/折扣（用于展示，确保和价格对应）
  let actualReduceAmount = 0;
  let actualDiscount = 0;
  if (product.type === "立减") {
    actualReduceAmount = originalPrice - seckillPrice; // 实际立减金额
  } else {
    actualDiscount = Math.round((seckillPrice / originalPrice) * 10) ; // 实际折扣（保留1位小数，如0.8=8折）
  }

  // 商品图片：配置图 > 商品主图 > 占位图
  const productImage = config.configImage || productBase.mainImage || `https://via.placeholder.com/160?text=Seckill-${product.id}`;
  // 商品名称：直接从商品基础信息获取
  const productName = productBase.name;

  return (
    <li className="w-[195px] inline-block mr-[23px] mt-[17px] border-r border-[#e8e8e8] pr-[10px] list-none">
      <Link to={`/product/${productBase.id}?seckillId=${product.roundId}`} target={product.product.id} className="inline-block no-underline">
        {/* 商品图片 */}
        <div className="w-[160px] h-[160px] leading-[160px] text-center mx-auto">
          <img 
            src={getImageUrl(productImage)} 
            alt={productName}
            className="inline-block align-middle max-w-[160px] border-0 object-contain" 
          />
        </div>
        {/* 商品名称 */}
        <div className="mt-[9px]">
          <span className="inline-block w-[192px] overflow-hidden text-ellipsis whitespace-nowrap text-[15px] text-[#242424] font-semibold">
            {productName}
          </span>
        </div>
        {/* 优惠标签（立减/打折，使用实际计算的优惠值） */}
        <DiscountBadge 
          type={product.type} 
          discount={actualDiscount || product.discount} 
          reduceAmount={actualReduceAmount || product.reduceAmount} 
        />
        {/* 价格展示（秒杀价+原价） */}
        <PriceDisplay 
          currentPrice={seckillPrice} 
          originalPrice={originalPrice} 
        />
      </Link>
    </li>
  );
};

// 折扣/立减标签组件 - 适配源数据优惠类型
const DiscountBadge: React.FC<{
  type: "立减" | "打折";
  discount: number;
  reduceAmount: number;
}> = ({ type, discount, reduceAmount }) => (
  <div className="mt-1 h-[18px] relative">
    <div className="block absolute bg-[#ffe7e4] w-auto h-4 leading-4 border border-[#ffe7e4] rounded">
      <i className="inline-block w-[13px] h-[13px] bg-[url(https://p1.lefile.cn/product/adminweb/2020/02/24/eeae0241-a38e-4e5d-802c-4091175a1cbe.png)] bg-[length:13px_13px] mt-[1.5px] ml-[2px]"></i>
      <span className="inline-block text-xs text-[#ff2f2f] left-[17px] align-top mx-[3px]">
        {type === '打折' 
          ? `${discount}折` // 如：0.8折 → 8折（若接口是0.8，需调整：`(discount*10).toFixed(0)`）
          : `立减${reduceAmount}元`}
      </span>
    </div>
  </div>
);

// 价格展示组件（处理小数位数）
const PriceDisplay: React.FC<{ currentPrice: number; originalPrice: number }> = ({
  currentPrice,
  originalPrice
}) => {
  // 格式化价格：保留两位小数
  const formatPrice = (price: number) => price.toFixed(2);

  return (
    <div className="mt-[7px]">
      <div className="inline-block mr-[11px]">
        <span className="text-base text-[#e72d21] font-bold">¥</span>
        <span className="text-base text-[#e2231a] font-semibold">{formatPrice(currentPrice)}</span>
      </div>
      <div className="inline-block text-[0px] text-[#858585]">
        <span className="text-sm text-[#858585] font-bold">¥</span>
        <span className="text-sm text-[#858585] line-through">{formatPrice(originalPrice)}</span>
      </div>
    </div>
  );
};

export default ProductCard;