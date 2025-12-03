/*
 * @Description: 商品列表容器组件
 * @Responsibility: 
 * 1. 负责 Grid 网格布局 (4列)
 * 2. 处理空状态 (无商品时的展示)
 * 3. 将状态透传给子组件 (Card)
 */
import React from 'react';
import FlashProductCard from './FlashProductCard';
import type { Product, TimeStatus } from '../../types/flashSale';

interface Props {
  products: Product[]; // 商品数据数组
  status: TimeStatus;  // 当前场次状态 (透传给 Card 用于判断样式)
}

const FlashProductList: React.FC<Props> = ({ products, status }) => {
  // 空状态处理
  if (!products || products.length === 0) {
    return (
      <div className="h-[400px] bg-white flex items-center justify-center text-gray-400 text-lg rounded shadow-sm">
        <p>该场次暂无商品...</p>
      </div>
    );
  }

  // Grid 布局实现
  return (
    <div className="grid grid-cols-4 gap-y-[14px] gap-x-[8px]">
      {products.map((prod, idx) => (
        <FlashProductCard 
          // 使用组合 key 避免 id 重复 (仅在 Mock 数据场景下需要)
          key={`${prod.id}-${idx}`} 
          product={prod} 
          status={status} 
        />
      ))}
    </div>
  );
};

export default FlashProductList;