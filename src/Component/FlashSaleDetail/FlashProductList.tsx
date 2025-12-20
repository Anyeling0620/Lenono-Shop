import React from 'react';
import FlashProductCard from './FlashProductCard';
import type { SeckillProductVO, TimeStatus } from '../../types/flashSale';
import { getLowestPriceConfig } from '../../utils/timeCalculator';

interface Props {
  products: SeckillProductVO[]; // 替换为新的秒杀商品类型
  status: TimeStatus;            // 当前场次状态 (透传给 Card 用于判断样式)
}

const FlashProductList: React.FC<Props> = ({ products, status }) => {
  // 过滤有效商品（有有效配置项的商品）
  const validProducts = products.filter(product =>
    product.configs.some(config =>
      config.seckillPrice > 0 &&
      config.status === '正常' &&
      config.config.status === '正常'
    )
  );

  // 空状态处理
  if (!validProducts || validProducts.length === 0) {
    return (
      <div className="h-[400px] bg-white flex items-center justify-center text-gray-400 text-lg rounded shadow-sm">
        <p>该场次暂无商品...</p>
      </div>
    );
  }

  // Grid 布局实现
  return (
    <div className="grid grid-cols-4 gap-y-[14px] gap-x-[8px]">
      {validProducts.map((prod) => (
        <FlashProductCard 
          key={`${prod.id}-${getLowestPriceConfig(prod).id}`} // 唯一key：商品ID+配置项ID
          product={prod} 
          status={status} 
        />
      ))}
    </div>
  );
};

export default FlashProductList;