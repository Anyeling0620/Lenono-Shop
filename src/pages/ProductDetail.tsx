import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import ShareButtons from "../component/ShareButtons/ShareButtons";
import RecentProducts from "../component/RecentProducts/RecentProducts";
import ImageModal from "../component/ImageModal/ImageModal";
import { getSeckillProductDetail, getShelfProductDetail } from "../services/products";
import globalErrorHandler from "../utils/globalAxiosErrorHandler";
import toast from "react-hot-toast";
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import isBetween from 'dayjs/plugin/isBetween'; // 导入isBetween插件
import type { SeckillConfigDetailVO, SeckillProductDetailResponse, ShelfItemVO, ShelfProductDetailResponse } from "../types/productComment";
import type { ProductConfigVO } from "../types/flashSale";
import type { CouponItem } from "../types/product";
import ProductDetailInfo from "../component/ProductInfo/ProductDetailInfo";
import ProductSpecs from "../component/ProductInfo/ProductSpecs";
import ProductComments from "../component/ProductInfo/ProductComments";

// 注册dayjs插件
dayjs.locale('zh-cn');
dayjs.extend(relativeTime);
dayjs.extend(isBetween); // 注册isBetween插件

const formatToLocalTime = (utcTime: string): string => {
  return dayjs(utcTime).format('YYYY-MM-DD HH:mm');
};

// 规格选项类型（包含配置ID关联）
interface SpecOption {
  label: string;
  values: Array<{
    value: string;
    configIds: string[]; // 关联的配置ID列表
  }>;
  allValues: string[]; // 所有规格值的去重列表
}

// 秒杀状态类型
type SeckillStatus = 'wait' | 'ongoing' | 'ended';

// 标签类型（与接口定义一致）
export interface ProductTag { // 改为export，供子组件使用
  id: string;
  name: string;
  priority: number;
}

const ProductDetail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const seckillId = searchParams.get('seckillId');
  const seckill: boolean = seckillId !== null;
  const { id } = useParams<{ id: string }>();

  // 状态管理
  const [shelfProductData, setShelfProductData] = useState<ShelfProductDetailResponse | null>(null);
  const [seckillProductData, setSeckillProductData] = useState<SeckillProductDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeImage, setActiveImage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<string>("");
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null); // 选中的配置ID（核心）
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({}); // 选中的规格值（辅助）
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"detail" | "specs" | "comments">("detail");
  const [couponExpanded, setCouponExpanded] = useState<number | null>(null);
  // 秒杀相关状态
  const [seckillStatus, setSeckillStatus] = useState<SeckillStatus>('wait');
  const [countdown, setCountdown] = useState<string>(""); // 秒杀倒计时
  // 修复：规格选项改为响应式状态
  const [specOptions, setSpecOptions] = useState<SpecOption[]>([]);

  // 统一数据获取
  const productData = seckill ? seckillProductData : shelfProductData;
  const product = productData?.product;
  const brand = productData?.brand;
  const banners = productData?.banners || [];
  const appearances = productData?.appearances || [];
  // 处理标签数据
  const tags = (productData?.tags || []) as ProductTag[];
  // 区分秒杀和货架的配置数据
  const seckillConfigs = seckillProductData?.seckillConfigs || [];
  const shelfConfigs = shelfProductData?.configs || [];
  // 优惠券：仅货架商品有
  const coupons = shelfProductData?.coupons || [];
  // 货架商品的库存项
  const shelfItems = shelfProductData?.shelfItems || [];
  // 秒杀轮次信息
  const seckillRound = seckillProductData?.round;

  // ========== 核心：重构配置和规格逻辑 ==========
  // 整合所有配置项（秒杀/货架）
  const allConfigs = seckill 
    ? seckillConfigs.map(item => ({ ...item, id: item.configId, config: item.config })) 
    : shelfConfigs.map(item => ({ ...item, id: item.id }));

  // 提取规格选项（关联配置ID）
  useEffect(() => {
    if (allConfigs.length === 0) {
      setSpecOptions([]); // 无配置时清空规格选项
      return;
    }

    // 1. 收集所有规格键（config1/config2/config3）和对应的值及配置ID
    const specMap: Record<string, Record<string, string[]>> = {
      config1: {},
      config2: {},
      config3: {},
    };

    allConfigs.forEach(config => {
      const cfg = seckill ? (config as SeckillConfigDetailVO).config : (config as ProductConfigVO);
      // 处理config1
      if (cfg.config1) {
        if (!specMap.config1[cfg.config1]) {
          specMap.config1[cfg.config1] = [];
        }
        specMap.config1[cfg.config1].push(config.id);
      }
      // 处理config2
      if (cfg.config2) {
        if (!specMap.config2[cfg.config2]) {
          specMap.config2[cfg.config2] = [];
        }
        specMap.config2[cfg.config2].push(config.id);
      }
      // 处理config3
      if (cfg.config3) {
        if (!specMap.config3[cfg.config3]) {
          specMap.config3[cfg.config3] = [];
        }
        specMap.config3[cfg.config3].push(config.id);
      }
    });

    // 2. 构建规格选项（映射为友好标签：颜色/内存/尺寸）
    const specLabelMap: Record<string, string> = {
      config1: '颜色',
      config2: '内存',
      config3: '尺寸',
    };

    const newSpecOptions: SpecOption[] = [];
    Object.entries(specMap).forEach(([key, valueMap]) => {
      if (Object.keys(valueMap).length === 0) return;

      const values = Object.entries(valueMap).map(([value, configIds]) => ({
        value,
        configIds: Array.from(new Set(configIds)), // 去重配置ID
      }));

      newSpecOptions.push({
        label: specLabelMap[key],
        values,
        allValues: Object.keys(valueMap),
      });
    });

    // 3. 更新响应式的规格选项
    setSpecOptions(newSpecOptions);

    // 4. 初始化选中第一个配置（默认选中）
    if (allConfigs.length > 0 && !selectedConfigId) {
      setSelectedConfigId(allConfigs[0].id);
      // 初始化选中的规格值
      const firstConfig = allConfigs[0];
      const cfg = seckill ? (firstConfig as SeckillConfigDetailVO).config : (firstConfig as ProductConfigVO);
      const initSpecs: Record<string, string> = {};
      if (cfg.config1) initSpecs[specLabelMap.config1] = cfg.config1;
      if (cfg.config2) initSpecs[specLabelMap.config2] = cfg.config2;
      if (cfg.config3) initSpecs[specLabelMap.config3] = cfg.config3;
      setSelectedSpecs(initSpecs);
    }
  }, [allConfigs, selectedConfigId, seckill]);

  // ========== 秒杀时间处理 ==========
  const calculateSeckillStatus = useCallback(() => {
    if (!seckill || !seckillRound) return;

    const now = dayjs();
    const startTime = dayjs(seckillRound.startTime);
    const endTime = dayjs(seckillRound.endTime);

    if (now.isBefore(startTime)) {
      // 未开始：计算倒计时
      setSeckillStatus('wait');
      const diff = startTime.diff(now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${days > 0 ? `${days}天` : ''}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    } else if (now.isBetween(startTime, endTime)) { // 现在使用已注册的isBetween方法
      // 进行中
      setSeckillStatus('ongoing');
      setCountdown('');
    } else {
      // 已结束
      setSeckillStatus('ended');
      setCountdown('');
    }
  }, [seckill, seckillRound]);

  // 秒杀倒计时定时器
  useEffect(() => {
    if (!seckill || !seckillRound) return;

    calculateSeckillStatus();
    const timer = setInterval(calculateSeckillStatus, 1000);

    return () => clearInterval(timer);
  }, [seckill, seckillRound, calculateSeckillStatus]);

  // ========== 数据获取逻辑 ==========
  useEffect(() => {
    async function fetchData(id: string | null | undefined, seckill: boolean) {
      if (!id) {
        toast.error('缺少商品ID参数');
        setLoading(false);
        return;
      }
      try {
        if (seckill) {
          const data = await getSeckillProductDetail(id, seckillId!);
          setSeckillProductData(data);
          // 初始化缩略图
          if (data?.appearances.length > 0) {
            setActiveImage(data.appearances[0].image);
          }
        } else {
          const data = await getShelfProductDetail(id);
          setShelfProductData(data);
          // 初始化缩略图
          if (data?.appearances.length > 0) {
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
  }, [id, seckill, seckillId]);

  // ========== 辅助函数：根据配置ID获取对应配置 ==========
  const getConfigById = (): SeckillConfigDetailVO | ProductConfigVO | null => {
    if (!selectedConfigId) return null;

    if (seckill) {
      return seckillConfigs.find(item => item.configId === selectedConfigId) || null;
    } else {
      return shelfConfigs.find(item => item.id === selectedConfigId) || null;
    }
  };

  // ========== 价格、库存计算 ==========
  // 获取选中配置的价格（区分秒杀/货架）
  const getSelectedPrice = (): number => {
    const config = getConfigById();
    if (!config) return 0;

    if (seckill) {
      return (config as SeckillConfigDetailVO).seckillPrice;
    } else {
      return Number((config as ProductConfigVO).salePrice);
    }
  };

  // 获取库存数量（区分秒杀/货架）
  const getStockCount = (): number => {
    const config = getConfigById();
    if (!config) return 0;

    if (seckill) {
      // 秒杀商品库存：选中配置的剩余数量
      return (config as SeckillConfigDetailVO).remainNum;
    } else {
      // 货架商品库存：shelfItems 中的可用数量（总库存-锁定库存）
      if (shelfItems.length === 0) return 0;
      const shelfItem = shelfItems.find((item: ShelfItemVO) => item.configId === selectedConfigId);
      return shelfItem ? (shelfItem.shelfNum - shelfItem.lockNum) : 0;
    }
  };

  // 获取选中配置的原价
  const getOriginalPrice = (): number => {
    const config = getConfigById();
    if (!config) return 0;

    if (seckill) {
      return Number((config as SeckillConfigDetailVO).config.originalPrice);
    } else {
      return Number((config as ProductConfigVO).originalPrice);
    }
  };

  // 获取选中配置的规格值
  const getSelectedSpecValues = (): Record<string, string> => {
    const config = getConfigById();
    if (!config) return {};

    const cfg = seckill ? (config as SeckillConfigDetailVO).config : (config as ProductConfigVO);
    const specValues: Record<string, string> = {};
    if (cfg.config1) specValues['颜色'] = cfg.config1;
    if (cfg.config2) specValues['内存'] = cfg.config2;
    if (cfg.config3) specValues['尺寸'] = cfg.config3;
    return specValues;
  };

  // 计算最终价格、原价、库存
  const finalPrice = getSelectedPrice();
  const originalPrice = getOriginalPrice();
  const stockCount = getStockCount();
  const hasStock = stockCount > 0;
  const selectedConfig = getConfigById();
  const selectedSpecValues = getSelectedSpecValues();

  // ========== 规格选择事件处理 ==========
  // 处理规格值选择（更新选中的规格和配置ID）
  const handleSpecSelect = (specLabel: string, value: string) => {
    // 1. 更新选中的规格值
    const newSelectedSpecs = {
      ...selectedSpecs,
      [specLabel]: value,
    };

    // 2. 筛选符合所有已选规格的配置ID
    let matchedConfigIds: string[] = allConfigs.map(config => config.id);

    // 遍历所有已选规格，过滤配置ID
    Object.entries(newSelectedSpecs).forEach(([label, val]) => {
      // 找到对应的规格键（颜色→config1，内存→config2，尺寸→config3）
      const specKey = Object.entries({
        '颜色': 'config1',
        '内存': 'config2',
        '尺寸': 'config3',
      }).find(([_, key]) => label === _)?.[1];

      if (!specKey) return;

      // 过滤出包含该规格值的配置ID
      const filteredIds = allConfigs.filter(config => {
        const cfg = seckill ? (config as SeckillConfigDetailVO).config : (config as ProductConfigVO);
        return cfg[specKey as 'config1' | 'config2' | 'config3'] === val;
      }).map(config => config.id);

      // 交集：保留同时符合所有规格的配置ID
      matchedConfigIds = matchedConfigIds.filter(id => filteredIds.includes(id));
    });

    // 3. 更新选中的配置ID（取第一个匹配的）
    if (matchedConfigIds.length > 0) {
      setSelectedConfigId(matchedConfigIds[0]);
      setSelectedSpecs(newSelectedSpecs);
    } else {
      // 无匹配配置时，提示用户
      toast.warning('当前规格组合暂无配置，请更换选择');
    }
  };

  // ========== 购买逻辑处理 ==========
  // 加入购物车处理
  const handleAddToCart = async () => {
    if (!product || !selectedConfig) return;
    toast.success('加入购物车成功');
    navigate("/shopping-cart");
  };

  // 立即购买/抢购处理
  const handleBuyNow = () => {
    if (!product || !selectedConfig) return;
    // 秒杀未开始时，提示用户
    if (seckill && seckillStatus === 'wait') {
      toast.warning('秒杀尚未开始，请等待');
      return;
    }
    // 秒杀已结束时，提示用户
    if (seckill && seckillStatus === 'ended') {
      toast.warning('秒杀已结束，无法购买');
      return;
    }
    navigate("/checkout");
  };

  // ========== 加载中和空数据处理 ==========
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-600">商品数据加载中...</div>
      </div>
    );
  }

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

          {/* 商品标签 / 特性 + 秒杀状态标签 + 产品标签 */}
          <div className="flex items-center flex-wrap gap-2 mb-4 text-xs">
            {/* 产品标签（按priority排序展示） */}
            {tags.sort((a, b) => b.priority - a.priority).map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-0.5 bg-[#f0f8ff] text-[#4299e1] rounded-sm border border-[#dbeafe]"
              >
                {tag.name}
              </span>
            ))}

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
              <>
                {seckillStatus === 'wait' && (
                  <span className="px-2 py-0.5 bg-[#fff7e6] text-[#ff8800] rounded-sm border border-[#ffe1b8]">
                    秒杀未开始
                  </span>
                )}
                {seckillStatus === 'ongoing' && (
                  <span className="px-2 py-0.5 bg-[#fff2ed] text-[#e1140a] rounded-sm border border-[#ffd4c2]">
                    秒杀进行中
                  </span>
                )}
                {seckillStatus === 'ended' && (
                  <span className="px-2 py-0.5 bg-[#f5f5f5] text-[#999] rounded-sm border border-[#e5e5e5]">
                    秒杀已结束
                  </span>
                )}
              </>
            )}
            {!seckill && productData?.shelf?.installment > 0 && (
              <span className="px-2 py-0.5 bg-[#fff7e6] text-[#ff8800] rounded-sm border border-[#ffe1b8]">
                支持{productData.shelf.installment}期分期
              </span>
            )}
          </div>

          {/* 秒杀倒计时（仅秒杀商品显示） */}
          {seckill && seckillStatus === 'wait' && (
            <div className="mb-4 p-3 bg-[#fff7e6] border border-[#ffe1b8] rounded-sm">
              <div className="flex items-center text-[#ff8800]">
                <span className="font-bold mr-2">秒杀开始倒计时：</span>
                <span className="font-mono text-lg">{countdown}</span>
                <span className="ml-2 text-xs">
                  开始时间：{formatToLocalTime(seckillRound?.startTime || '')}
                </span>
              </div>
            </div>
          )}

          {/* 秒杀轮次信息（进行中/已结束） */}
          {seckill && (seckillStatus === 'ongoing' || seckillStatus === 'ended') && (
            <div className="mb-4 p-3 bg-[#f8f8f8] border border-[#e5e5e5] rounded-sm text-xs text-gray-600">
              <div className="flex justify-between">
                <span>秒杀轮次：{seckillRound?.title || '未知轮次'}</span>
                <span>
                  {seckillStatus === 'ongoing' ? '结束时间' : '开始时间'}：{formatToLocalTime(seckillStatus === 'ongoing' ? seckillRound?.endTime : seckillRound?.startTime || '')}
                </span>
              </div>
            </div>
          )}

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

          {/* 规格选择（修复后：响应式状态渲染） */}
          {specOptions.length > 0 && (
            <div className="space-y-4 mb-8">
              {specOptions.map((spec, specIdx) => (
                <div key={`spec-${specIdx}`} className="flex">
                  <span className="text-sm text-gray-500 w-[60px] leading-[34px]">
                    {spec.label}
                  </span>
                  <div className="flex flex-wrap gap-3 flex-1">
                    {spec.allValues.map((value, valIdx) => (
                      <button
                        key={`spec-${specIdx}-val-${valIdx}`}
                        onClick={() => handleSpecSelect(spec.label, value)}
                        className={`
                          px-4 py-1.5 text-sm border 
                          ${selectedSpecValues[spec.label] === value
                            ? "border-[#e1140a] text-[#e1140a] relative"
                            : "border-gray-300 text-[#333] hover:border-[#e1140a]"
                          }
                        `}
                      >
                        {value}
                        {selectedSpecValues[spec.label] === value && (
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
                disabled={!hasStock || quantity >= stockCount || (seckill && seckillStatus !== 'ongoing')}
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
              className={`w-[160px] h-[50px] text-white text-[18px] font-bold rounded-sm transition-colors 
                ${
                  hasStock && (seckill ? seckillStatus === 'ongoing' : true)
                    ? "bg-[#e1140a] hover:bg-[#c91008]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              disabled={!hasStock || !selectedConfig || (seckill && seckillStatus !== 'ongoing')}
              onClick={handleBuyNow}
            >
              {seckill ? (
                seckillStatus === 'ongoing' ? (hasStock ? "立即抢购" : "缺货") : (seckillStatus === 'wait' ? "等待秒杀" : "秒杀结束")
              ) : (
                hasStock ? "立即购买" : "缺货"
              )}
            </button>
            {!seckill && (
              <button
                className={`w-[160px] h-[50px] text-[18px] font-bold rounded-sm transition-colors 
                  ${hasStock ? "bg-[#ffeded] border border-[#e1140a] text-[#e1140a] hover:bg-[#ffdcdc]" : "bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed"}`}
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
          {/* 商品详情Tab：使用封装的组件 */}
          {activeTab === "detail" && (
            <ProductDetailInfo
              product={product}
              brand={brand}
              banners={banners}
              finalPrice={finalPrice}
              originalPrice={originalPrice}
              seckill={seckill}
              productData={productData}
              tags={tags}
              activeImage={activeImage}
            />
          )}

          {/* 配置参数Tab：使用封装的组件 */}
          {activeTab === "specs" && (
            <ProductSpecs
              product={product}
              brand={brand}
              finalPrice={finalPrice}
              originalPrice={originalPrice}
              seckill={seckill}
              selectedConfig={selectedConfig}
              stockCount={stockCount}
              tags={tags}
            />
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