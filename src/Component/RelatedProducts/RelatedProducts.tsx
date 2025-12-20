import React from "react";
import { Link } from "react-router-dom";
import type { MainProduct } from "../../types/mainProduct";
import { productCategories } from "../../assets/data/mockProducts";

interface RelatedProductsProps {
  currentProductId: string;
  category?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  category
}) => {
  // 获取同类别商品，排除当前商品
  const getRelatedProducts = (): MainProduct[] => {
    let relatedProducts: MainProduct[] = [];

    if (category) {
      // 如果有指定类别，从该类别获取商品
      const categoryData = productCategories.find(cat => cat.category === category);
      if (categoryData) {
        relatedProducts = categoryData.products.filter(p => p.id !== currentProductId);
      }
    } else {
      // 否则从所有商品中随机选择
      const allProducts = productCategories.flatMap(cat => cat.products);
      relatedProducts = allProducts.filter(p => p.id !== currentProductId);
    }

    // 随机选择最多6个商品
    const shuffled = relatedProducts.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  };

  const relatedProducts = getRelatedProducts();

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center" >
      <div className="mt-12 w-[1200px]  bg-white rounded-sm shadow-sm p-6">
        <h3 className="text-lg font-bold mb-6 text-[#333]">相关商品推荐</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {relatedProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group block"
            >
              <div className="bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium text-[#333] line-clamp-2 mb-2 group-hover:text-[#e1140a] transition-colors">
                    {product.name}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-[#e1140a] font-bold">
                      ¥{product.originalPrice - product.coupon}
                    </span>
                    {product.coupon > 0 && (
                      <span className="text-xs text-gray-500 line-through">
                        ¥{product.originalPrice}
                      </span>
                    )}
                  </div>
                  {product.features && product.features.length > 0 && (
                    <div className="mt-1">
                      <span className="text-xs px-1.5 py-0.5 bg-[#fff2ed] text-[#e1140a] rounded">
                        {product.features[0]}
                      </span>
                    </div>
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

export default RelatedProducts;