import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import ProductComments from "../component/ProductComments/ProductComments";
import ShareButtons from "../component/ShareButtons/ShareButtons";
import RecentProducts from "../component/RecentProducts/RecentProducts";
import ImageModal from "../component/ImageModal/ImageModal";
import { getSeckillProductDetail, getShelfProductDetail } from "../services/products";
import globalErrorHandler from "../utils/globalAxiosErrorHandler";
import toast from "react-hot-toast";
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { SeckillConfigDetailVO, SeckillProductDetailResponse, ShelfItemVO, ShelfProductDetailResponse } from "../types/productComment";
import type { ProductConfigVO } from "../types/flashSale";
import type { CouponItem } from "../types/product";

// 统一导入类型（解决类型重复定义问题，建议将所有类型抽离到单独的 types 目录）


dayjs.locale('zh-cn');
dayjs.extend(relativeTime);

const formatToLocalTime = (utcTime: string): string => {
  return dayjs(utcTime).format('YYYY-MM-DD HH:mm');
};

// 规格选项类型
interface SpecOption {
  label: string;
  values: string[];
}

// 选中规格类型
type SelectedSpecs = Record<string, string>;

const ProductDetail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const seckillParam = searchParams.get('seckill');
  const seckill: boolean = seckillParam === 'true';
  const { id } = useParams<{ id: string }>();

  // 状态管理
  const [shelfProductData, setShelfProductData] = useState<ShelfProductDetailResponse | null>(null);
  const [seckillProductData, setSeckillProductData] = useState<SeckillProductDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeImage, setActiveImage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<string>("");
  const [selectedSpecs, setSelectedSpecs] = useState<SelectedSpecs>({});
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"detail" | "specs" | "comments">("detail");
  const [couponExpanded, setCouponExpanded] = useState<number | null>(null);

  // 统一数据获取
  const productData = seckill ? seckillProductData : shelfProductData;
  const product = productData?.product;
  const brand = productData?.brand;
  const banners = productData?.banners || [];
  const appearances = productData?.appearances || [];
  // 区分秒杀和货架的配置数据
  const seckillConfigs = seckillProductData?.seckillConfigs || [];
  const shelfConfigs = shelfProductData?.configs || [];
  // 优惠券：仅货架商品有
  const coupons = shelfProductData?.coupons || [];
  // 货架商品的库存项
  const shelfItems = shelfProductData?.shelfItems || [];

  // 处理规格数据
  const specOptions: SpecOption[] = [];
  const allConfigValues = new Map<string, Set<string>>();

  // 提取所有配置的规格项（区分秒杀/货架）
  const extractConfigValues = () => {
    if (seckill) {
      seckillConfigs.forEach((item: SeckillConfigDetailVO) => {
        const config = item.config;
        if (config?.config1) {
          if (!allConfigValues.has('config1')) allConfigValues.set('config1', new Set());
          allConfigValues.get('config1')!.add(config.config1);
        }
        if (config?.config2) {
          if (!allConfigValues.has('config2')) allConfigValues.set('config2', new Set());
          allConfigValues.get('config2')!.add(config.config2);
        }
        if (config?.config3) {
          if (!allConfigValues.has('config3')) allConfigValues.set('config3', new Set());
          allConfigValues.get('config3')!.add(config.config3);
        }
      });
    } else {
      shelfConfigs.forEach((config: ProductConfigVO) => {
        if (config?.config1) {
          if (!allConfigValues.has('config1')) allConfigValues.set('config1', new Set());
          allConfigValues.get('config1')!.add(config.config1);
        }
        if (config?.config2) {
          if (!allConfigValues.has('config2')) allConfigValues.set('config2', new Set());
          allConfigValues.get('config2')!.add(config.config2);
        }
        if (config?.config3) {
          if (!allConfigValues.has('config3')) allConfigValues.set('config3', new Set());
          allConfigValues.get('config3')!.add(config.config3);
        }
      });
    }
  };

  // 构建规格选项
  const buildSpecOptions = () => {
    if (allConfigValues.has('config1')) {
      specOptions.push({
        label: '颜色', // 实际项目中可从后端获取标签
        values: Array.from(allConfigValues.get('config1')!)
      });
    }
    if (allConfigValues.has('config2')) {
      specOptions.push({
        label: '内存',
        values: Array.from(allConfigValues.get('config2')!)
      });
    }
    if (allConfigValues.has('config3')) {
      specOptions.push({
        label: '尺寸',
        values: Array.from(allConfigValues.get('config3')!)
      });
    }
  };

  // 执行规格提取和构建
  extractConfigValues();
  buildSpecOptions();

  // 初始化数据加载
  useEffect(() => {
    async function fetchData(id: string | null | undefined, seckill: boolean) {
      if (!id) {
        toast.error('缺少商品ID参数');
        setLoading(false);
        return;
      }
      try {
        if (seckill) {
          const data = await getSeckillProductDetail(id);
          setSeckillProductData(data);
          // 初始化缩略图
          if (data.appearances.length > 0) {
            setActiveImage(data.appearances[0].image);
          }
        } else {
          const data = await getShelfProductDetail(id);
          setShelfProductData(data);
          // 初始化缩略图
          if (data.appearances.length > 0) {
            setActiveImage(data.appearances[0].image);
          }
        }
      } catch (error) {
        globalErrorHandler.handle(error, toast.error);
      } finally {
        setLoading(false);
      }
    }

    fetchData(id, seckill);
  }, [id, seckill]);

  // 根据选中规格获取对应配置（区分秒杀/货架）
  const getSelectedConfig = (): SeckillConfigDetailVO | ProductConfigVO | null => {
    // 秒杀商品配置
    if (seckill) {
      if (seckillConfigs.length === 0) return null;
      // 未选择规格，返回第一个
      if (Object.keys(selectedSpecs).length === 0) {
        return seckillConfigs[0];
      }
      // 匹配选中规格
      return seckillConfigs.find((item: SeckillConfigDetailVO) => {
        const config = item.config;
        const config1Match = selectedSpecs['颜色'] ? config.config1 === selectedSpecs['颜色'] : true;
        const config2Match = selectedSpecs['内存'] ? config.config2 === selectedSpecs['内存'] : true;
        const config3Match = selectedSpecs['尺寸'] ? config.config3 === selectedSpecs['尺寸'] : true;
        return config1Match && config2Match && config3Match;
      }) || seckillConfigs[0];
    } else {
      // 货架商品配置
      if (shelfConfigs.length === 0) return null;
      // 未选择规格，返回第一个
      if (Object.keys(selectedSpecs).length === 0) {
        return shelfConfigs[0];
      }
      // 匹配选中规格
      return shelfConfigs.find((config: ProductConfigVO) => {
        const config1Match = selectedSpecs['颜色'] ? config.config1 === selectedSpecs['颜色'] : true;
        const config2Match = selectedSpecs['内存'] ? config.config2 === selectedSpecs['内存'] : true;
        const config3Match = selectedSpecs['尺寸'] ? config.config3 === selectedSpecs['尺寸'] : true;
        return config1Match && config2Match && config3Match;
      }) || shelfConfigs[0];
    }
  };

  // 获取选中配置的价格（区分秒杀/货架）
  const getSelectedPrice = (): number => {
    const selectedConfig = getSelectedConfig();
    if (!selectedConfig) return 0;

    if (seckill) {
      return (selectedConfig as SeckillConfigDetailVO).seckillPrice;
    } else {
      return Number((selectedConfig as ProductConfigVO).salePrice);
    }
  };

  // 获取库存数量（区分秒杀/货架）
  const getStockCount = (): number => {
    const selectedConfig = getSelectedConfig();
    if (!selectedConfig) return 0;

    if (seckill) {
      // 秒杀商品库存：选中配置的剩余数量
      return (selectedConfig as SeckillConfigDetailVO).remainNum;
    } else {
      // 货架商品库存：shelfItems 中的可用数量（总库存-锁定库存）
      if (shelfItems.length === 0) return 0;
      // 若配置与shelfItem关联，需根据configId匹配，此处简化为第一个shelfItem
      const shelfItem = shelfItems.find((item: ShelfItemVO) => item.configId === selectedConfig.id) || shelfItems[0];
      return shelfItem.shelfNum - shelfItem.lockNum;
    }
  };

  // 获取选中配置的原价
  const getOriginalPrice = (): number => {
    const selectedConfig = getSelectedConfig();
    if (!selectedConfig) return 0;

    if (seckill) {
      return Number((selectedConfig as SeckillConfigDetailVO).config.originalPrice);
    } else {
      return Number((selectedConfig as ProductConfigVO).originalPrice);
    }
  };

  // 计算最终价格、原价、库存
  const finalPrice = getSelectedPrice();
  const originalPrice = getOriginalPrice();
  const stockCount = getStockCount();
  const hasStock = stockCount > 0;
  const selectedConfig = getSelectedConfig();

  // 加入购物车处理
  const handleAddToCart = async () => {
    if (!product || !selectedConfig) return;
    toast.success('加入购物车成功');
    navigate("/shopping-cart");
  };

  // 立即购买处理
  const handleBuyNow = () => {
    if (!product || !selectedConfig) return;
    navigate("/checkout");
  };

  // 加载中状态
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-600">商品数据加载中...</div>
      </div>
    );
  }

  // 数据为空时的兜底
  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-red-600">商品数据加载失败</div>
      </div>
    );
  }

  return (
    <div className="bg-white pb-20 font-sans text-[#333]">
      {/* 主体内容区 */}
      <div className="w-[1200px] mx-auto mt-4 flex bg-white rounded-sm shadow-sm min-h-[90vh]">
        {/* 左侧：图片画廊 */}
        <div className="w-[450px] mr-[80px] pt-16  pb-8 flex-shrink-0">
          {/* 主图展示 */}
          <div className="relative overflow-hidden w-[450px] h-[450px] border border-gray-100 flex items-center justify-center mb-4 bg-black cursor-pointer group">
            <img
              src={activeImage}
              alt={`${product.name} - 主图`}
              className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-110"
              onClick={() => {
                setModalImage(activeImage);
                setIsModalOpen(true);
              }}
            />
          </div>

          {/* 缩略图列表 */}
          <div className="flex gap-4 items-center justify-center overflow-x-auto pb-2">
            {appearances.map((appearance, idx) => (
              <div
                key={`appearance-${idx}`}
                className={`w-[80px] h-[80px] border cursor-pointer p-1 ${activeImage === appearance.image
                  ? "border-red-600"
                  : "border-transparent hover:border-gray-300"
                }`}
                onClick={() => {
                  setActiveImage(appearance.image);
                }}
              >
                <img
                  src={appearance.image}
                  className="w-full h-full object-contain"
                  alt={`外观图${idx + 1}`}
                />
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
              productImage={activeImage}
            />
          </div>
        </div>

        {/* 右侧：商品信息 */}
        <div className="flex-1 pt-6 pb-8 pl-12">
          <h1 className="text-[20px] font-bold text-[#333] leading-7 mb-2">
            {product.name}
          </h1>
          <p className="text-sm text-[#7e7e7e] mb-3">
            {product.subTitle || "爆款直降，限时抢购！"}
          </p>

          {/* 商品标签 / 特性 */}
          <div className="flex items-center flex-wrap gap-2 mb-4 text-xs">
            {!seckill && productData?.shelf?.isSelfOperated && (
              <span className="px-2 py-0.5 bg-[#f5f9ff] text-[#3677ff] rounded-sm border border-[#d0e0ff]">
                自营商品
              </span>
            )}
            {!seckill && productData?.shelf?.isCustomizable && (
              <span className="px-2 py-0.5 bg-[#f5fff4] text-[#18a600] rounded-sm border border-[#c8f0c2]">
                支持定制
              </span>
            )}
            {seckill && (
              <span className="px-2 py-0.5 bg-[#fff2ed] text-[#e1140a] rounded-sm border border-[#ffd4c2]">
                秒杀商品
              </span>
            )}
            {!seckill && productData?.shelf?.installment > 0 && (
              <span className="px-2 py-0.5 bg-[#fff7e6] text-[#ff8800] rounded-sm border border-[#ffe1b8]">
                支持{productData.shelf.installment}期分期
              </span>
            )}
          </div>

          {/* 价格面板 */}
          <div className="bg-[#f3f5f7] p-4 rounded-sm mb-4">
            <div className="flex items-baseline">
              <span className="text-[15px] text-gray-500 mr-2">
                {seckill ? "秒杀价" : "商城价"}
              </span>
              <span className="text-[#e1140a] text-[28px] font-bold mr-1">
                ¥{finalPrice}
              </span>
              {originalPrice > finalPrice && (
                <span className="text-xs line-through text-gray-400 ml-2">
                  原价：¥{originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* 优惠信息 / 优惠券展开（仅货架商品显示） */}
          {!seckill && (
            <div className="mb-4 text-xs">
              <div className="flex items-start mb-3 ">
                <span className="w-[60px] text-gray-500">优惠</span>
                <div className="flex -mt-2 flex-col flex-1 gap-2">
                  {coupons.length > 0 ? (
                    coupons.map((coupon: CouponItem, idx: number) => (
                      <div key={coupon.id} className="w-full">
                        {/* 优惠券头部 */}
                        <div
                          className="flex items-center justify-between px-2 py-1.5 bg-[#fff2ed] text-[#e1140a] rounded-sm border border-[#ffd4c2] cursor-pointer"
                          onClick={() => setCouponExpanded(couponExpanded === idx ? null : idx)}
                        >
                          <div className="flex items-center">
                            <span className="mr-2">
                              {coupon.coupon.type === "满减"
                                ? `满${coupon.coupon.threshold}减${coupon.coupon.amount}`
                                : `${Number(coupon.coupon.discount)*100}折`
                              }
                            </span>
                            <span className="text-xs text-gray-500">
                              {coupon.coupon.name}
                            </span>
                          </div>
                          <span className="text-sm">
                            {couponExpanded === idx ? "v" : ">"}
                          </span>
                        </div>
                        {/* 优惠券详情（展开时显示） */}
                        {couponExpanded === idx && (
                          <div className="mt-1 px-3 py-2 bg-white border border-[#ffd4c2] rounded-sm text-gray-600">
                            <div className="flex justify-between mb-1">
                              <span>使用门槛：</span>
                              <span>
                                {Number(coupon.coupon.threshold) > 0
                                  ? `满¥${coupon.coupon.threshold}可用`
                                  : "无门槛"
                              }
                              </span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span>有效期：</span>
                              <span>
                                {formatToLocalTime(coupon.startTime)} 至 {formatToLocalTime(coupon.endTime) || formatToLocalTime(coupon.coupon.expireTime)}
                              </span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span>可叠加：</span>
                              <span>{coupon.coupon.isStackable ? "是" : "否"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>剩余数量：</span>
                              <span>{coupon.limitNum > 0 ? coupon.limitNum : "充足"}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-sm border border-gray-200">
                      暂无可用优惠券
                    </span>
                  )}
                </div>
              </div>

              <div className="flex  items-start">
                <span className="w-[60px] text-gray-500">服务</span>
                <div className="flex flex-wrap gap-3 flex-1 text-gray-700">
                  <span>全国联保</span>
                  <span>7天无理由退货</span>
                  <span>30天价保</span>
                  <span>保修升级 / 延保服务</span>
                </div>
              </div>
            </div>
          )}

          <div className="w-full h-[1px] bg-gray-200 my-4"></div>

          {/* 规格选择 */}
          {specOptions.length > 0 && (
            <div className="space-y-4 mb-8">
              {specOptions.map((spec, specIdx) => (
                <div key={`spec-${specIdx}`} className="flex">
                  <span className="text-sm text-gray-500 w-[60px] leading-[34px]">
                    {spec.label}
                  </span>
                  <div className="flex flex-wrap gap-3 flex-1">
                    {spec.values.map((value, valIdx) => (
                      <button
                        key={`spec-${specIdx}-val-${valIdx}`}
                        onClick={() =>
                          setSelectedSpecs({
                            ...selectedSpecs,
                            [spec.label]: value,
                          })
                        }
                        className={`
                          px-4 py-1.5 text-sm border 
                          ${selectedSpecs[spec.label] === value
                            ? "border-[#e1140a] text-[#e1140a] relative"
                            : "border-gray-300 text-[#333] hover:border-[#e1140a]"
                          }
                        `}
                      >
                        {value}
                        {selectedSpecs[spec.label] === value && (
                          <i className="absolute right-0 bottom-0 w-0 h-0 border-b-[10px] border-b-[#e1140a] border-l-[10px] border-l-transparent"></i>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

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
                disabled={!hasStock || quantity >= stockCount}
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
            <span className="text-xs text-gray-500 ml-2">
              库存：{stockCount}件
            </span>
          </div>

          {/* 按钮组 */}
          <div className="flex gap-4">
            <button
              className={`w-[160px] h-[50px] text-white text-[18px] font-bold rounded-sm transition-colors ${hasStock ? "bg-[#e1140a] hover:bg-[#c91008]" : "bg-gray-400 cursor-not-allowed"
                }`}
              disabled={!hasStock || !selectedConfig}
              onClick={handleBuyNow}
            >
              {hasStock ? seckill ? "立即抢购" : "立即购买" : "缺货"}
            </button>
            {!seckill && (
              <button
                className={`w-[160px] h-[50px] text-[18px] font-bold rounded-sm transition-colors ${hasStock
                  ? "bg-[#ffeded] border border-[#e1140a] text-[#e1140a] hover:bg-[#ffdcdc]"
                  : "bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed"
                }`}
                disabled={!hasStock || !selectedConfig}
                onClick={handleAddToCart}
              >
                加入购物车
              </button>
            )}
          </div>

          {/* 服务保障 */}
          <div className="mt-6 flex text-sm text-gray-500 gap-6">
            {["正品保障", "正规发票", "极速物流", "售后无忧"].map((tag, idx) => (
              <span key={idx} className="flex items-center">
                <span className="w-4 h-4 rounded-full border border-[#e1140a] text-[#e1140a] flex items-center justify-center text-xs mr-1">
                  √
                </span>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 最近浏览（右侧侧边栏） */}
        <RecentProducts currentProductId={product.id} />
      </div>

      {/* 底部详情Tab页 */}
      <div className="mt-8">
        {/* Tab Header（吸顶+全屏宽度） */}
        <div className="sticky top-[60px] z-40 w-full bg-[#f3f3f3] shadow-sm">
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
                    ${activeTab === key
                      ? "bg-[#e1140a] text-white"
                      : "text-[#333] hover:text-[#e1140a]"
                    }
                  `}
                >
                  {tab}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="w-[1200px] mx-auto mt-8 border-none">
          {/* 商品详情Tab */}
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
                        <span className="text-[#e1140a]">{brand?.name || "未知品牌"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">品类：</span>
                        <span className="text-[#333]">{product.category?.name || "未知品类"}</span>
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
          )}

          {/* 配置参数Tab */}
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
                      <td className="py-3 px-4 text-[#e1140a] font-medium">{brand?.name || "未知品牌"}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">品类</td>
                      <td className="py-3 px-4 text-[#333]">{product.category?.name || "未知品类"}</td>
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
                            {(selectedConfig as SeckillConfigDetailVO).config.config1 && (
                              <tr className="border-b border-gray-200">
                                <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">颜色</td>
                                <td className="py-3 px-4 text-[#333]">{(selectedConfig as SeckillConfigDetailVO).config.config1}</td>
                              </tr>
                            )}
                            {(selectedConfig as SeckillConfigDetailVO).config.config2 && (
                              <tr className="border-b border-gray-200">
                                <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">内存</td>
                                <td className="py-3 px-4 text-[#333]">{(selectedConfig as SeckillConfigDetailVO).config.config2}</td>
                              </tr>
                            )}
                            {(selectedConfig as SeckillConfigDetailVO).config.config3 && (
                              <tr className="border-b border-gray-200">
                                <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">尺寸</td>
                                <td className="py-3 px-4 text-[#333]">{(selectedConfig as SeckillConfigDetailVO).config.config3}</td>
                              </tr>
                            )}
                          </>
                        ) : (
                          <>
                            {(selectedConfig as ProductConfigVO).config1 && (
                              <tr className="border-b border-gray-200">
                                <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">颜色</td>
                                <td className="py-3 px-4 text-[#333]">{(selectedConfig as ProductConfigVO).config1}</td>
                              </tr>
                            )}
                            {(selectedConfig as ProductConfigVO).config2 && (
                              <tr className="border-b border-gray-200">
                                <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">内存</td>
                                <td className="py-3 px-4 text-[#333]">{(selectedConfig as ProductConfigVO).config2}</td>
                              </tr>
                            )}
                            {(selectedConfig as ProductConfigVO).config3 && (
                              <tr className="border-b border-gray-200">
                                <td className="py-3 px-4 text-gray-600 bg-gray-50 font-medium">尺寸</td>
                                <td className="py-3 px-4 text-[#333]">{(selectedConfig as ProductConfigVO).config3}</td>
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
                        <td className="py-3 px-4 text-[#333]">{(selectedConfig as SeckillConfigDetailVO).remainNum}件</td>
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
          )}

          {/* 商品评价Tab */}
          {activeTab === "comments" && (
            <div className="bg-white p-6">
              <ProductComments productId={product.id} />
            </div>
          )}
        </div>
      </div>

      {/* 图片预览弹窗 */}
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