import React from 'react';

interface ProductDetailInfoProps {
  product: any; // 可替换为实际的Product类型
  brand: any; // 可替换为实际的Brand类型
  banners: Array<{ image: string }>;
  finalPrice: number;
  originalPrice: number;
  seckill: boolean;
  productData: any; // 可替换为实际的产品数据类型
  tags: any[];
  activeImage: string;
}

const ProductDetailInfo: React.FC<ProductDetailInfoProps> = ({
  product,
  brand,
  banners,
  finalPrice,
  originalPrice,
  seckill,
  productData,
  tags,
  activeImage,
}) => {
  return (
    <div className="bg-white">
      {/* 详细参数说明 */}
      <div className="p-8 border-b border-gray-200">
        <h3 className="text-xl font-bold mb-6 text-[#333]">详细参数</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold mb-4 text-[#333]">基本信息</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">商品名称：</span>
                <span className="text-[#333]">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">商品编号：</span>
                <span className="text-[#333]">{product.id.padStart(8, "0")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">品牌：</span>
                <span className="text-[#e1140a]">{brand?.name || "未知品牌"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">品类：</span>
                <span className="text-[#333]">{product.category?.name || "未知品类"}</span>
              </div>
              {/* 商品标签展示 */}
              <div className="flex justify-between">
                <span className="text-gray-600">商品标签：</span>
                <span className="text-[#333]">
                  {tags.map(tag => tag.name).join('、') || '无'}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-[#333]">价格信息</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">销售价格：</span>
                <span className="text-[#333]">¥{finalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">原价：</span>
                <span className="text-[#333]">¥{originalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">优惠类型：</span>
                <span className="text-[#333]">{seckill ? "秒杀优惠" : "常规优惠"}</span>
              </div>
              {!seckill && (
                <div className="flex justify-between">
                  <span className="text-gray-600">分期支持：</span>
                  <span className="text-[#333]">
                    {productData?.shelf?.installment > 0
                      ? `${productData.shelf.installment}期分期`
                      : "不支持分期"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 产品图片展示 */}
      <div className="py-8">
        <h3 className="text-xl font-bold mb-6 text-[#333]">产品展示</h3>
        {banners.length > 0 ? (
          <div className="space-y-1">
            {banners.map((banner, idx) => (
              <div key={`detail-banner-${idx}`} className="relative">
                <img
                  src={banner.image}
                  alt={`产品详情宣传图${idx + 1}`}
                  className="mx-auto block w-full shadow-lg "
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-20 bg-gray-50 rounded-lg">
            <img
              src={activeImage}
              alt="产品展示"
              className="mx-auto w-[600px] shadow-lg rounded-lg mb-4"
            />
            <p className="text-gray-500">更多产品细节图即将上线</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailInfo;