import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { findProductById } from "../assets/data/mockProducts";
import type { MainProduct } from "../types/mainProduct";
import { useCart } from "../context/CartContext";
import ProductComments from "../component/ProductComments/ProductComments";
import { getCommentStats } from "../assets/data/mockComments";
import RelatedProducts from "../component/RelatedProducts/RelatedProducts";
import ShareButtons from "../component/ShareButtons/ShareButtons";
import RecentProducts from "../component/RecentProducts/RecentProducts";
import ImageModal from "../component/ImageModal/ImageModal";
import DeliverySelector from "../component/DeliverySelector/DeliverySelector";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<MainProduct | null>(null);
  const { addToCart, replaceWithSingle } = useCart();
  const navigate = useNavigate();

  // 交互状态
  const [activeImage, setActiveImage] = useState<string>("");
  const [activeMedia, setActiveMedia] = useState<"image" | "video">("image");
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string>("");
  const [selectedSpecs, setSelectedSpecs] = useState<{ [key: string]: string }>(
    {}
  );
  const [activeTab, setActiveTab] = useState("detail");

  useEffect(() => {
    if (id) {
      const found = findProductById(id);
      if (found) {
        setProduct(found);
        setActiveImage(found.image); // 默认显示主图
        // 默认选中第一个规格
        const defaultSpecs: any = {};
        found.specOptions?.forEach((spec: { label: string; values: string[] }) => {
          defaultSpecs[spec.label] = spec.values[0];
        });
        setSelectedSpecs(defaultSpecs);
      }
    }
  }, [id]);

  if (!product)
    return (
      <div className="h-[600px] flex justify-center items-center">
        商品加载中...
      </div>
    );

  const finalPrice = product.originalPrice - product.coupon;
  const commentStats = getCommentStats(product.id);

  const currentSpecText =
    Object.keys(selectedSpecs).length > 0
      ? Object.entries(selectedSpecs)
          .map(([k, v]) => `${k}:${v}`)
          .join(" / ")
      : "默认配置";

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, currentSpecText);
    // 模拟联想商城：加入购物车后跳转购物车页
    navigate("/shopping-cart");
  };

  const handleBuyNow = () => {
    if (!product) return;
    // 立即购买：只保留当前这一件商品，数量和规格以当前选择为准
    replaceWithSingle(product, quantity, currentSpecText);
    navigate("/shopping-cart");
  };

  return (
    <div className="bg-white pb-20 font-sans text-[#333]">
      {/* 2. 主体内容区 */}
      <div className="w-[1200px] mx-auto mt-4 flex bg-white rounded-sm shadow-sm">
        {/* 左侧：图片画廊 */}
        <div className="w-[450px] mr-[80px] pt-6 pb-8 pl-6 flex-shrink-0">
          {/* 主图展示 */}
          <div className="relative w-[450px] h-[450px] border border-gray-100 flex items-center justify-center mb-4 bg-black cursor-pointer group">
            {activeMedia === "video" && product.videoUrl ? (
              <video
                src={product.videoUrl}
                controls
                className="max-w-full max-h-full"
                poster={product.image}
              >
                您的浏览器不支持视频播放。
              </video>
            ) : (
              <>
                <img
                  src={activeImage}
                  alt={product.name}
                  className="max-w-full max-h-full"
                  onClick={() => {
                    setModalImage(activeImage);
                    setIsModalOpen(true);
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-40 transition-opacity duration-300">
                    <span className="text-white text-3xl drop-shadow-lg">🔍</span>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* 缩略图列表 */}
          <div className="flex gap-4 overflow-x-auto">
            {/* 视频缩略图 */}
            {product.videoUrl && (
              <div
                className={`w-[80px] h-[80px] border cursor-pointer p-1 relative ${
                  activeMedia === "video"
                    ? "border-red-600"
                    : "border-transparent hover:border-gray-300"
                }`}
                onClick={() => {
                  setActiveMedia("video");
                  setActiveImage(product.image); // 设置poster
                }}
              >
                <img
                  src={product.image}
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">▶</span>
                  </div>
                </div>
              </div>
            )}
            {/* 图片缩略图 */}
            <div
              className={`w-[80px] h-[80px] border cursor-pointer p-1 ${
                activeMedia === "image" && activeImage === product.image
                  ? "border-red-600"
                  : "border-transparent hover:border-gray-300"
              }`}
              onClick={() => {
                setActiveMedia("image");
                setActiveImage(product.image);
              }}
            >
              <img
                src={product.image}
                className="w-full h-full object-contain"
              />
            </div>
            {product.gallery?.map((img: string, idx: number) => (
              <div
                key={idx}
                className={`w-[80px] h-[80px] border cursor-pointer p-1 ${
                  activeMedia === "image" && activeImage === img
                    ? "border-red-600"
                    : "border-transparent hover:border-gray-300"
                }`}
                onClick={() => {
                  setActiveMedia("image");
                  setActiveImage(img);
                }}
              >
                <img src={img} className="w-full h-full object-contain" />
              </div>
            ))}
          </div>
          {/* 序列号/收藏/分享 */}
          <div className="flex items-center mt-6 text-xs text-gray-500">
            <span className="mr-6">
              商品编号：{product.id.padStart(8, "0")}
            </span>
            <span className="cursor-pointer hover:text-red-600 flex items-center mr-4">
              <i className="mr-1">♥</i> 收藏
            </span>
            <ShareButtons
              productName={product.name}
              productUrl={`/product/${product.id}`}
              productImage={product.image}
            />
          </div>
        </div>

        {/* 右侧：商品信息 */}
        <div className="flex-1 pr-8 pt-6 pb-8 pl-12">
          <h1 className="text-[20px] font-bold text-[#333] leading-7 mb-2">
            {product.name}
          </h1>
          <p className="text-sm text-[#e1140a] mb-3">
            {product.subTitle || "爆款直降，限时抢购！"}
          </p>

          {/* 商品标签 / 特性 */}
          <div className="flex items-center flex-wrap gap-2 mb-4 text-xs">
            {product.features && product.features.length > 0 && (
              <>
                {product.features.slice(0, 4).map((feat: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-[#fff2ed] text-[#e1140a] rounded-sm border border-[#ffd4c2]"
                  >
                    {feat}
                  </span>
                ))}
              </>
            )}
            {product.customerize && (
              <span className="px-2 py-0.5 bg-[#f5f9ff] text-[#3677ff] rounded-sm border border-[#d0e0ff]">
                支持定制
              </span>
            )}
            {product.tradeIn && (
              <span className="px-2 py-0.5 bg-[#f5fff4] text-[#18a600] rounded-sm border border-[#c8f0c2]">
                以旧换新
              </span>
            )}
          </div>

          {/* 价格面板 */}
          <div className="bg-[#f3f5f7] p-4 rounded-sm mb-4 relative">
            <div className="flex items-baseline">
              <span className="text-xs text-gray-500 mr-2">联想商城价</span>
              <span className="text-[#e1140a] text-[28px] font-bold mr-1">
                ¥{finalPrice}
              </span>
              {product.coupon > 0 && (
                <span className="text-xs bg-[#e1140a] text-white px-1.5 py-0.5 rounded-sm mr-2">
                  立减 {product.coupon} 元
                </span>
              )}
            </div>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <span className="mr-2">参考价</span>
              <span className="line-through text-gray-400 mr-4">
                ¥{product.originalPrice}
              </span>
              <span className="mr-2">分期</span>
              <span className="text-[#e1140a]">
                低至 ¥{Math.round(finalPrice / 12)} × 12期（含手续费）
              </span>
            </div>
            <div className="flex items-center mt-3 text-xs text-gray-600">
              <span className="mr-4">
                累计评价
                <span className="text-[#e1140a] ml-1">{commentStats.totalCount || 9999}+</span>
              </span>
              <span className="mr-4">
                好评率
                <span className="text-[#e1140a] ml-1">
                  {commentStats.totalCount > 0
                    ? Math.round((commentStats.ratingDistribution[4] + commentStats.ratingDistribution[5]) / commentStats.totalCount * 100)
                    : 99}%
                </span>
              </span>
              <span className="mr-4">
                评分
                <span className="text-[#e1140a] ml-1">
                  {commentStats.averageRating || 4.8}分
                </span>
              </span>
              <span>
                累计销量
                <span className="text-[#e1140a] ml-1">5万+</span>
              </span>
            </div>
    
            {/* 右侧侧边栏：最近浏览 */}
            <div className="w-[280px] ml-8 flex-shrink-0">
              <RecentProducts currentProductId={product.id} />
            </div>
          </div>

          {/* 优惠信息 / 活动栏 */}
          <div className="mb-4 text-xs">
            <div className="flex items-start mb-2">
              <span className="w-[60px] text-gray-500">优惠</span>
              <div className="flex flex-wrap gap-2 flex-1">
                <span className="px-2 py-0.5 bg-[#fff2ed] text-[#e1140a] rounded-sm border border-[#ffd4c2]">
                  满减优惠
                </span>
                <span className="px-2 py-0.5 bg-[#fff7e6] text-[#ff8800] rounded-sm border border-[#ffe1b8]">
                  下单立减 {product.coupon || 100} 元
                </span>
                <span className="px-2 py-0.5 bg-[#edf7ff] text-[#2b6bff] rounded-sm border border-[#c3ddff]">
                  新人券可叠加使用
                </span>
              </div>
            </div>
            <div className="flex items-start">
              <span className="w-[60px] text-gray-500">服务</span>
              <div className="flex flex-wrap gap-3 flex-1 text-gray-700">
                <span>全国联保</span>
                <span>7天无理由退货</span>
                <span>30天价保</span>
                <span>保修升级 / 延保服务</span>
              </div>
            </div>
          </div>

          {/* 配送信息 */}
          <div className="mb-4 text-sm">
            <div className="flex items-center mb-2">
              <span className="text-gray-500 w-[60px]">配送至</span>
              <DeliverySelector />
              <span className={`font-bold ml-3 ${product.stock && product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.stock && product.stock > 0 ? `有货 (${product.stock}件)` : "缺货"}
              </span>
            </div>
            <div className="flex items-center text-xs text-gray-600 ml-[60px]">
              <span className="mr-4">运费：包邮</span>
              <span className="mr-4">预计送达：1-3个工作日</span>
              <span>由联想物流发货</span>
            </div>
          </div>

          <div className="w-full h-[1px] bg-gray-200 my-4"></div>

          {/* 规格选择区 */}
          <div className="space-y-4 mb-8">
            {product.specOptions?.map((spec: { label: string; values: string[] }) => (
              <div key={spec.label} className="flex">
                <span className="text-sm text-gray-500 w-[60px] leading-[34px]">
                  {spec.label}
                </span>
                <div className="flex flex-wrap gap-3 flex-1">
                  {spec.values.map((val: string) => (
                    <button
                      key={val}
                      onClick={() =>
                        setSelectedSpecs({
                          ...selectedSpecs,
                          [spec.label]: val,
                        })
                      }
                      className={`
                                        px-4 py-1.5 text-sm border 
                                        ${
                                          selectedSpecs[spec.label] === val
                                            ? "border-[#e1140a] text-[#e1140a] relative"
                                            : "border-gray-300 text-[#333] hover:border-[#e1140a]"
                                        }
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
                className="w-[30px] h-[30px] bg-[#f8f8f8] text-gray-500 disabled:opacity-50"
                disabled={quantity <= 1}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <input
                type="text"
                value={quantity}
                readOnly
                className="w-[46px] h-[30px] text-center border-l border-r border-gray-300 text-sm"
              />
              <button
                className="w-[30px] h-[30px] bg-[#f8f8f8] text-gray-500 disabled:opacity-50"
                disabled={product.stock ? quantity >= product.stock : false}
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
            {product.stock && (
              <span className="text-xs text-gray-500 ml-2">
                库存：{product.stock}件
              </span>
            )}
          </div>

          {/* 按钮组 */}
          <div className="flex gap-4">
            <button
              className={`w-[160px] h-[50px] text-white text-[18px] font-bold rounded-sm transition-colors ${
                product.stock && product.stock > 0
                  ? "bg-[#e1140a] hover:bg-[#c91008]"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!(product.stock && product.stock > 0)}
              onClick={handleBuyNow}
            >
              {product.stock && product.stock > 0 ? "立即购买" : "缺货"}
            </button>
            <button
              className={`w-[160px] h-[50px] text-[18px] font-bold rounded-sm transition-colors ${
                product.stock && product.stock > 0
                  ? "bg-[#ffeded] border border-[#e1140a] text-[#e1140a] hover:bg-[#ffdcdc]"
                  : "bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed"
              }`}
              disabled={!(product.stock && product.stock > 0)}
              onClick={handleAddToCart}
            >
              加入购物车
            </button>
            <button className="px-4 h-[50px] border border-gray-300 text-sm text-gray-700 rounded-sm hover:border-[#e1140a] hover:text-[#e1140a] transition-colors">
              收藏
            </button>
          </div>

          {/* 服务保障 */}
          <div className="mt-6 flex text-sm text-gray-500 gap-6">
            {product.serviceTags?.map((tag: string, idx: number) => (
              <span key={idx} className="flex items-center">
                <span className="w-4 h-4 rounded-full border border-[#e1140a] text-[#e1140a] flex items-center justify-center text-xs mr-1">
                  √
                </span>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 底部详情Tab页 */}
      <div className="mt-8">
        {/* Tab Header (修改点：背景铺满全屏) */}
        {/* 1. 外层 div: 负责吸顶 (sticky)、全屏宽度 (w-full)、背景色 (bg-[#f3f3f3]) */}
        <div className="sticky top-[60px] z-40 w-full bg-[#f3f3f3] shadow-">
          {/* 2. 内层 div: 负责内容居中 (w-[1200px] mx-auto)，确保文字和 Logo 对齐 */}
          <div className="w-[1200px] mx-auto h-[50px] flex items-center">
            {["商品详情", "配置参数", "商品评价"].map((tab) => {
              const key =
                tab === "商品详情"
                  ? "detail"
                  : tab === "配置参数"
                  ? "specs"
                  : "comments";
              return (
                <div
                  key={tab}
                  onClick={() => setActiveTab(key)}
                  className={`
                                px-8 h-[50px] leading-[50px] cursor-pointer text-[14px] font-bold transition-colors
                                ${
                                  activeTab === key
                                    ? "bg-[#e1140a] text-white" // 选中状态
                                    : "text-[#333] hover:text-[#e1140a]" // 未选中状态
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
          {activeTab === "detail" && (
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
                        <span className="text-[#e1140a]">联想（Lenovo）</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">系列：</span>
                        <span className="text-[#333]">小新系列</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-4 text-[#333]">技术规格</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">处理器：</span>
                        <span className="text-[#333]">Intel 酷睿 i5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">内存：</span>
                        <span className="text-[#333]">16GB DDR4</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">存储：</span>
                        <span className="text-[#333]">512GB SSD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">屏幕：</span>
                        <span className="text-[#333]">14英寸 2.8K OLED</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 产品图片展示 */}
              <div className="p-8">
                <h3 className="text-xl font-bold mb-6 text-[#333]">产品展示</h3>
                {product.detailImages && product.detailImages.length > 0 ? (
                  <div className="space-y-8">
                    {product.detailImages.map((img: string, idx: number) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`产品详情图${idx + 1}`}
                        className="mx-auto block w-full max-w-[1000px] shadow-lg rounded-lg"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-20 bg-gray-50 rounded-lg">
                    <img
                      src={product.image}
                      alt="产品展示"
                      className="mx-auto w-[600px] shadow-lg rounded-lg mb-4"
                    />
                    <p className="text-gray-500">更多产品细节图即将上线</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "specs" && (
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
                      <td className="py-3 px-4 text-[#e1140a] font-medium">联想（Lenovo）</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">系列</td>
                      <td className="py-3 px-4 text-[#333]">小新系列</td>
                    </tr>

                    {/* 处理器信息 */}
                    <tr className="bg-gray-50">
                      <td colSpan={2} className="py-3 px-4 font-bold text-[#333] border-b border-gray-200">
                        处理器
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">处理器型号</td>
                      <td className="py-3 px-4 text-[#333]">Intel 酷睿 i5-12450H</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">处理器主频</td>
                      <td className="py-3 px-4 text-[#333]">2.0GHz（睿频至4.4GHz）</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">核心/线程</td>
                      <td className="py-3 px-4 text-[#333]">8核心/12线程</td>
                    </tr>

                    {/* 内存信息 */}
                    <tr className="bg-gray-50">
                      <td colSpan={2} className="py-3 px-4 font-bold text-[#333] border-b border-gray-200">
                        内存
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">内存容量</td>
                      <td className="py-3 px-4 text-[#333]">16GB DDR4 3200MHz</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">内存类型</td>
                      <td className="py-3 px-4 text-[#333]">双通道 DDR4</td>
                    </tr>

                    {/* 存储信息 */}
                    <tr className="bg-gray-50">
                      <td colSpan={2} className="py-3 px-4 font-bold text-[#333] border-b border-gray-200">
                        存储
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">硬盘容量</td>
                      <td className="py-3 px-4 text-[#333]">512GB PCIe 4.0 SSD</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">硬盘类型</td>
                      <td className="py-3 px-4 text-[#333]">NVMe PCIe 4.0 固态硬盘</td>
                    </tr>

                    {/* 显示信息 */}
                    <tr className="bg-gray-50">
                      <td colSpan={2} className="py-3 px-4 font-bold text-[#333] border-b border-gray-200">
                        显示
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">屏幕尺寸</td>
                      <td className="py-3 px-4 text-[#333]">14英寸</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">屏幕分辨率</td>
                      <td className="py-3 px-4 text-[#333]">2880×1800（2.8K）</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">屏幕类型</td>
                      <td className="py-3 px-4 text-[#333]">OLED 屏</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">刷新率</td>
                      <td className="py-3 px-4 text-[#333]">90Hz</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">色域</td>
                      <td className="py-3 px-4 text-[#333]">100% DCI-P3 广色域</td>
                    </tr>

                    {/* 其他规格 */}
                    <tr className="bg-gray-50">
                      <td colSpan={2} className="py-3 px-4 font-bold text-[#333] border-b border-gray-200">
                        其他规格
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">操作系统</td>
                      <td className="py-3 px-4 text-[#333]">Windows 11 家庭中文版</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">重量</td>
                      <td className="py-3 px-4 text-[#333]">约 1.35kg</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">电池容量</td>
                      <td className="py-3 px-4 text-[#333]">56Wh</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">续航时间</td>
                      <td className="py-3 px-4 text-[#333]">约 8-10 小时</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">接口</td>
                      <td className="py-3 px-4 text-[#333]">2×USB-C, 1×USB-A, 1×HDMI, 1×耳机孔</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">网络</td>
                      <td className="py-3 px-4 text-[#333]">Wi-Fi 6E + 蓝牙 5.2</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">保修</td>
                      <td className="py-3 px-4 text-[#333]">三年整机保修</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 参数说明 */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <h4 className="font-bold mb-3 text-[#333]">参数说明</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• 以上参数信息仅供参考，实际配置以商品到货为准。</p>
                  <p>• 产品外观及规格参数可能因批次不同略有差异，请以实物为准。</p>
                  <p>• 如有疑问，请联系联想客服咨询：400-990-8888</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "comments" && (
            <ProductComments productId={product.id} />
          )}
        </div>
      </div>

      {/* 相关商品推荐 */}
      <RelatedProducts currentProductId={product.id} />

      {/* 图片放大模态框 */}
      <ImageModal
        isOpen={isModalOpen}
        imageSrc={modalImage}
        altText={product.name}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ProductDetail;
