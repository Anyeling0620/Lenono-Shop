import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import type { MainProduct } from "../../types/mainProduct";
import { findProductById } from "../../assets/data/mockProducts";

interface RecentProductsProps {
  currentProductId: string;
  maxItems?: number;
}

const RecentProducts: React.FC<RecentProductsProps> = ({
  currentProductId,
  maxItems = 5
}) => {
  // 使用useMemo计算最近浏览的商品，避免在useEffect中调用setState
  const recentProducts = React.useMemo(() => {
    // 从localStorage获取最近浏览的商品ID列表
    const recentIds = JSON.parse(localStorage.getItem('recentProducts') || '[]');

    // 过滤掉当前商品，并限制数量
    const filteredIds = recentIds
      .filter((id: string) => id !== currentProductId)
      .slice(0, maxItems);

    // 获取商品详情
    const products = filteredIds
      .map((id: string) => findProductById(id))
      .filter((product: MainProduct | null): product is MainProduct => product !== null);

    return products;
  }, [currentProductId, maxItems]);

  // 添加到最近浏览
  useEffect(() => {
    const recentIds = JSON.parse(localStorage.getItem('recentProducts') || '[]');

    // 移除当前商品（如果已存在），然后添加到开头
    const filteredIds = recentIds.filter((id: string) => id !== currentProductId);
    filteredIds.unshift(currentProductId);

    // 限制数量
    const limitedIds = filteredIds.slice(0, 10);

    localStorage.setItem('recentProducts', JSON.stringify(limitedIds));
  }, [currentProductId]);

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <div className="w-[240px] ml-1 flex-shrink-0">
      <div className="mt-8 bg-white rounded-sm shadow-sm p-6">
        <h3 className="text-lg font-bold mb-6 text-[#333]">最近浏览</h3>
        <div className="space-y-4">
          {recentProducts.map((product: MainProduct) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              target={product.id}
              className="flex items-center space-x-4 group hover:bg-gray-50 p-2 rounded transition-colors"
            >
              <div className="flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded border"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-[#333] line-clamp-2 group-hover:text-[#e1140a] transition-colors">
                  {product.name}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-[#e1140a] font-bold">
                    ¥{product.originalPrice - product.coupon}
                  </span>
                  {product.coupon > 0 && (
                    <span className="text-xs text-gray-500 line-through">
                      ¥{product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentProducts;