import React from 'react';

interface ProductSpecsProps {
  product: any; // 可替换为实际的Product类型
  brand: any; // 可替换为实际的Brand类型
  finalPrice: number;
  originalPrice: number;
  seckill: boolean;
  selectedConfig: any; // 可替换为实际的配置类型
  stockCount: number;
  tags: any[];
}

const ProductSpecs: React.FC<ProductSpecsProps> = ({
  product,
  brand,
  finalPrice,
  originalPrice,
  seckill,
  selectedConfig,
  stockCount,
  tags,
}) => {
  return (
    <div className="bg-white">
      {/* 页面标题 */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-[#333]">配置参数</h3>
        <p className="text-sm text-gray-600 mt-1">以下是该商品的详细技术规格参数</p>
      </div>

      {/* 规格参数表格 */}
      <div className="p-6">
        <table className="w-full text-sm border-collapse border border-gray-200">
          <tbody>
            {/* 基本信息 */}
            <tr className="bg-gray-50">
              <td colSpan={2} className="py-3 px-4 font-bold text-[#333] border-b border-gray-200">
                基本信息
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 px-4 text-gray-600 w-[200px] bg-gray-50 font-medium">商品名称</td>
              <td className="py-3 px-4 text-[#333]">{product.name}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">商品编号</td>
              <td className="py-3 px-4 text-[#333]">{product.id.padStart(8, "0")}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">品牌</td>
              <td className="py-3 px-4 text-[#e1140a] font-medium">{brand?.name || "未知品牌"}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">品类</td>
              <td className="py-3 px-4 text-[#333]">{product.category?.name || "未知品类"}</td>
            </tr>
            {/* 商品标签 */}
            <tr className="border-b border-gray-200">
              <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">商品标签</td>
              <td className="py-3 px-4 text-[#333]">
                {tags.map(tag => tag.name).join('、') || '无'}
              </td>
            </tr>

            {/* 价格信息 */}
            <tr className="bg-gray-50">
              <td colSpan={2} className="py-3 px-4 font-bold text-[#333] border-b border-gray-200">
                价格信息
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">销售价格</td>
              <td className="py-3 px-4 text-[#333]">¥{finalPrice.toFixed(2)}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">原价</td>
              <td className="py-3 px-4 text-[#333]">¥{originalPrice.toFixed(2)}</td>
            </tr>
            {seckill && (
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">秒杀价格</td>
                <td className="py-3 px-4 text-[#e1140a]">¥{finalPrice.toFixed(2)}</td>
              </tr>
            )}

            {/* 规格配置 */}
            {selectedConfig && (
              <>
                <tr className="bg-gray-50">
                  <td colSpan={2} className="py-3 px-4 font-bold text-[#333] border-b border-gray-200">
                    规格配置
                  </td>
                </tr>
                {seckill ? (
                  <>
                    {selectedConfig.config.config1 && (
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">颜色</td>
                        <td className="py-3 px-4 text-[#333]">{selectedConfig.config.config1}</td>
                      </tr>
                    )}
                    {selectedConfig.config.config2 && (
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">内存</td>
                        <td className="py-3 px-4 text-[#333]">{selectedConfig.config.config2}</td>
                      </tr>
                    )}
                    {selectedConfig.config.config3 && (
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">尺寸</td>
                        <td className="py-3 px-4 text-[#333]">{selectedConfig.config.config3}</td>
                      </tr>
                    )}
                  </>
                ) : (
                  <>
                    {selectedConfig.config1 && (
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">颜色</td>
                        <td className="py-3 px-4 text-[#333]">{selectedConfig.config1}</td>
                      </tr>
                    )}
                    {selectedConfig.config2 && (
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">内存</td>
                        <td className="py-3 px-4 text-[#333]">{selectedConfig.config2}</td>
                      </tr>
                    )}
                    {selectedConfig.config3 && (
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">尺寸</td>
                        <td className="py-3 px-4 text-[#333]">{selectedConfig.config3}</td>
                      </tr>
                    )}
                  </>
                )}
              </>
            )}

            {/* 库存信息 */}
            <tr className="bg-gray-50">
              <td colSpan={2} className="py-3 px-4 font-bold text-[#333] border-b border-gray-200">
                库存信息
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">可用库存</td>
              <td className="py-3 px-4 text-[#333]">{stockCount}件</td>
            </tr>
            {seckill && selectedConfig && (
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">秒杀剩余</td>
                <td className="py-3 px-4 text-[#333]">{selectedConfig.remainNum}件</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 参数说明 */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <h4 className="font-bold mb-3 text-[#333]">参数说明</h4>
        <div className="text-sm text-gray-600 space-y-2">
          <p>• 以上参数信息仅供参考，实际配置以商品到货为准。</p>
          <p>• 产品外观及规格参数可能因批次不同略有差异，请以实物为准。</p>
          <p>• 如有疑问，请联系客服咨询</p>
        </div>
      </div>
    </div>
  );
};

export default ProductSpecs;