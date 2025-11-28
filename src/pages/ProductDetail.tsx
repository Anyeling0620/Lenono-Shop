import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { findProductById, type DetailedProduct } from '../assets/data/mockProducts';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<DetailedProduct | null>(null);
  
  // 交互状态
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedSpecs, setSelectedSpecs] = useState<{[key: string]: string}>({});
  const [activeTab, setActiveTab] = useState('detail');

  useEffect(() => {
    if (id) {
      const found = findProductById(id);
      if (found) {
        setProduct(found as DetailedProduct);
        setActiveImage(found.image); // 默认显示主图
        // 默认选中第一个规格
        const defaultSpecs: any = {};
        found.specOptions?.forEach(spec => {
            defaultSpecs[spec.label] = spec.values[0];
        });
        setSelectedSpecs(defaultSpecs);
      }
    }
  }, [id]);

  if (!product) return <div className="h-[600px] flex justify-center items-center">商品加载中...</div>;

  const finalPrice = product.originalPrice - product.coupon;

  return (
    <div className="bg-white pb-20 font-sans text-[#333]">


      {/* 2. 主体内容区 */}
      <div className="w-[1200px] mx-auto mt-8 flex">
        {/* 左侧：图片画廊 */}
        <div className="w-[450px] mr-[60px]">
            {/* 主图展示 */}
            <div className="relative w-[450px] h-[450px] border border-gray-100 flex items-center justify-center mb-4">
                <img src={activeImage} alt={product.name} className="max-w-full max-h-full" />
            </div>
            {/* 缩略图列表 */}
            <div className="flex gap-4 overflow-x-auto">
                <div 
                    className={`w-[80px] h-[80px] border cursor-pointer p-1 ${activeImage === product.image ? 'border-red-600' : 'border-transparent hover:border-gray-300'}`}
                    onMouseEnter={() => setActiveImage(product.image)}
                >
                    <img src={product.image} className="w-full h-full object-contain" />
                </div>
                {product.gallery?.map((img, idx) => (
                    <div 
                        key={idx}
                        className={`w-[80px] h-[80px] border cursor-pointer p-1 ${activeImage === img ? 'border-red-600' : 'border-transparent hover:border-gray-300'}`}
                        onMouseEnter={() => setActiveImage(img)}
                    >
                        <img src={img} className="w-full h-full object-contain" />
                    </div>
                ))}
            </div>
            {/* 序列号/收藏/分享 */}
            <div className="flex items-center mt-6 text-xs text-gray-500">
                <span className="mr-6">商品编号：{product.id.padStart(8, '0')}</span>
                <span className="cursor-pointer hover:text-red-600 flex items-center mr-4">
                    <i className="mr-1">♥</i> 收藏
                </span>
                <span className="cursor-pointer hover:text-red-600">分享</span>
            </div>
        </div>

        {/* 右侧：商品信息 */}
        <div className="flex-1">
            <h1 className="text-[20px] font-bold text-[#333] leading-7 mb-2">{product.name}</h1>
            <p className="text-sm text-[#e1140a] mb-4">{product.subTitle || "爆款直降，限时抢购！"}</p>

            {/* 价格面板 */}
            <div className="bg-[#f3f5f7] p-4 rounded-sm mb-6 relative">
                <div className="flex items-baseline">
                    <span className="text-xs text-gray-500 mr-2">商城价</span>
                    <span className="text-[#e1140a] text-[24px] font-bold mr-1">¥{finalPrice}</span>
                    {product.coupon > 0 && (
                        <span className="text-xs bg-[#e1140a] text-white px-1 py-0.5 rounded-sm">
                            优惠 {product.coupon} 元
                        </span>
                    )}
                </div>
                <div className="flex items-center mt-2 text-xs">
                    <span className="text-gray-500 mr-2">原&emsp;价</span>
                    <span className="line-through text-gray-400">¥{product.originalPrice}</span>
                </div>
            </div>

            {/* 配送信息 (静态模拟) */}
            <div className="mb-6 text-sm flex items-center">
                <span className="text-gray-500 w-[60px]">配送至</span>
                <div className="border border-gray-300 px-2 py-1 cursor-pointer mr-2">北京 北京市 海淀区</div>
                <span className="font-bold">有货</span>
            </div>

            <div className="w-full h-[1px] bg-gray-200 my-4"></div>

            {/* 规格选择区 */}
            <div className="space-y-4 mb-8">
                {product.specOptions?.map((spec) => (
                    <div key={spec.label} className="flex">
                        <span className="text-sm text-gray-500 w-[60px] leading-[34px]">{spec.label}</span>
                        <div className="flex flex-wrap gap-3 flex-1">
                            {spec.values.map((val) => (
                                <button
                                    key={val}
                                    onClick={() => setSelectedSpecs({...selectedSpecs, [spec.label]: val})}
                                    className={`
                                        px-4 py-1.5 text-sm border 
                                        ${selectedSpecs[spec.label] === val 
                                            ? 'border-[#e1140a] text-[#e1140a] relative' 
                                            : 'border-gray-300 text-[#333] hover:border-[#e1140a]'}
                                    `}
                                >
                                    {val}
                                    {selectedSpecs[spec.label] === val && (
                                        // 模拟选中右下角小三角
                                        <i className="absolute right-0 bottom-0 w-0 h-0 border-b-[10px] border-b-[#e1140a] border-l-[10px] border-l-transparent"></i>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* 购买数量 */}
            <div className="flex items-center mb-8">
                <span className="text-sm text-gray-500 w-[60px]">购买数量</span>
                <div className="flex border border-gray-300">
                    <button 
                        className="w-[30px] h-[30px] bg-[#f8f8f8] text-gray-500"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >-</button>
                    <input 
                        type="text" 
                        value={quantity} 
                        readOnly 
                        className="w-[46px] h-[30px] text-center border-l border-r border-gray-300 text-sm"
                    />
                    <button 
                        className="w-[30px] h-[30px] bg-[#f8f8f8] text-gray-500"
                        onClick={() => setQuantity(quantity + 1)}
                    >+</button>
                </div>
            </div>

            {/* 按钮组 */}
            <div className="flex gap-4">
                <button className="w-[160px] h-[50px] bg-[#e1140a] text-white text-[18px] font-bold rounded-sm hover:bg-[#c91008] transition-colors">
                    立即购买
                </button>
                <button className="w-[160px] h-[50px] bg-[#ffeded] border border-[#e1140a] text-[#e1140a] text-[18px] font-bold rounded-sm hover:bg-[#ffdcdc] transition-colors">
                    加入购物车
                </button>
            </div>

            {/* 服务保障 */}
            <div className="mt-6 flex text-sm text-gray-500 gap-6">
                {product.serviceTags?.map((tag, idx) => (
                    <span key={idx} className="flex items-center">
                        <span className="w-4 h-4 rounded-full border border-[#e1140a] text-[#e1140a] flex items-center justify-center text-xs mr-1">√</span>
                        {tag}
                    </span>
                ))}
            </div>
        </div>
      </div>

      {/* 3. 底部详情Tab页 */}
      <div className="mt-16">
        
        {/* Tab Header (修改点：背景铺满全屏) */}
        {/* 1. 外层 div: 负责吸顶 (sticky)、全屏宽度 (w-full)、背景色 (bg-[#f3f3f3]) */}
        <div className="sticky top-[60px] z-40 w-full bg-[#f3f3f3] shadow-">
            
            {/* 2. 内层 div: 负责内容居中 (w-[1200px] mx-auto)，确保文字和 Logo 对齐 */}
            <div className="w-[1200px] mx-auto h-[50px] flex items-center">
                {['商品详情', '配置参数', '商品评价'].map((tab) => {
                    const key = tab === '商品详情' ? 'detail' : (tab === '配置参数' ? 'specs' : 'comments');
                    return (
                        <div 
                            key={tab}
                            onClick={() => setActiveTab(key)}
                            className={`
                                px-8 h-[50px] leading-[50px] cursor-pointer text-[14px] font-bold transition-colors
                                ${activeTab === key 
                                    ? 'bg-[#e1140a] text-white'  // 选中状态
                                    : 'text-[#333] hover:text-[#e1140a]' // 未选中状态
                                }
                            `}
                        >
                            {tab}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Tab Content (内容区域保持 1200px 居中) */}
        <div className="w-[1200px] mx-auto mt-8 border-none">
            {activeTab === 'detail' && (
                <div className="text-center">
                    {/* 模拟长图文 */}
                    {product.detailImages?.length > 0 ? (
                        product.detailImages.map((img, idx) => (
                            <img key={idx} src={img} alt="详情" className="mx-auto block w-full max-w-[1200px]" />
                        ))
                    ) : (
                        <div className="p-20 text-gray-400 bg-gray-50">
                            <p className="mb-4">此处展示商品详情长图</p>
                            <img src={product.image} alt="示例" className="mx-auto w-[500px]"/>
                        </div>
                    )}
                </div>
            )}
            
            {activeTab === 'specs' && (
                <div className="p-10">
                    <h3 className="font-bold mb-4 text-lg">规格参数</h3>
                    <table className="w-full text-sm border-collapse">
                        <tbody>
                            <tr className="border-b"><td className="py-2 text-gray-500 w-[200px]">商品名称</td><td className="py-2">{product.name}</td></tr>
                            <tr className="border-b"><td className="py-2 text-gray-500">商品编号</td><td className="py-2">{product.id}</td></tr>
                            <tr className="border-b"><td className="py-2 text-gray-500">店铺</td><td className="py-2 text-[#e1140a]">联想官方旗舰店</td></tr>
                            {/* 更多模拟参数 */}
                            <tr className="border-b"><td className="py-2 text-gray-500">操作系统</td><td className="py-2">Windows 11 家庭中文版</td></tr>
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'comments' && (
                <div className="p-20 text-center text-gray-500 bg-gray-50">
                    暂无评价数据
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;