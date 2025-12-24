import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import ShareButtons from "../component/ShareButtons/ShareButtons";
import ImageModal from "../component/ImageModal/ImageModal";
import { addToShoppingCartService, getSeckillProductDetail, getShelfProductDetail } from "../services/products";
import globalErrorHandler from "../utils/globalAxiosErrorHandler";
import toast from "react-hot-toast";
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import isBetween from 'dayjs/plugin/isBetween';
import type { SeckillConfigDetailVO, SeckillProductDetailResponse, ShelfProductDetailResponse } from "../types/productComment";
import type { ProductConfigVO } from "../types/flashSale";
import type { CouponItem } from "../types/product";
<<<<<<< HEAD
=======
import ProductDetailInfo from "../component/ProductInfo/ProductDetailInfo";
import ProductSpecs from "../component/ProductInfo/ProductSpecs";
import ProductComments from "../component/ProductInfo/ProductComments";
import { Loading } from "../component/LoadingFallback";
import type { OrderState } from "../types/order";
import useAuthStore from "../store/authStore";
>>>>>>> c387ec4c6540d9dc874bff6bf60cad7514aa81f7

dayjs.locale('zh-cn');
dayjs.extend(relativeTime);
dayjs.extend(isBetween);

const formatToLocalTime = (utcTime: string): string => {
  return dayjs(utcTime).format('YYYY-MM-DD HH:mm');
};

interface SpecOption {
  label: string;
  values: Array<{
    value: string;
    configIds: string[];
  }>;
  allValues: string[];
}

type SeckillStatus = 'wait' | 'ongoing' | 'ended';

export interface ProductTag {
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

  const [shelfProductData, setShelfProductData] = useState<ShelfProductDetailResponse | null>(null);
  const [seckillProductData, setSeckillProductData] = useState<SeckillProductDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeImage, setActiveImage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<string>("");
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"detail" | "specs" | "comments">("detail");
  const [couponExpanded, setCouponExpanded] = useState<number | null>(null);
<<<<<<< HEAD
  // 过滤后的规格选项（根据已选择的规格动态计算）
  const [filteredSpecOptions, setFilteredSpecOptions] = useState<SpecOption[]>([]);
=======
  const [hasShopCart, setHasShopCart] = useState<boolean>(false);
  const [seckillStatus, setSeckillStatus] = useState<SeckillStatus>('wait');
  const [countdown, setCountdown] = useState<string>("");
  const [specOptions, setSpecOptions] = useState<SpecOption[]>([]);
>>>>>>> c387ec4c6540d9dc874bff6bf60cad7514aa81f7

  const productData = seckill ? seckillProductData : shelfProductData;
  const product = productData?.product;
  const brand = productData?.brand;
  const banners = productData?.banners || [];
  const appearances = productData?.appearances || [];
  const tags = (productData?.tags || []) as ProductTag[];
  const seckillConfigs = useMemo(() => seckillProductData?.seckillConfigs || [], [seckillProductData]);
  const shelfConfigs = useMemo(() => shelfProductData?.configs || [], [shelfProductData]);
  const coupons = shelfProductData?.coupons || [];
  const shelfItems = shelfProductData?.shelfItems || [];
  const seckillRound = seckillProductData?.round;

  // 缓存配置
  const allConfigs = useMemo(() => {
    return seckill
      ? seckillConfigs.map(item => ({ ...item, id: item.configId, config: item.config }))
      : shelfConfigs.map(item => ({ ...item, id: item.id }));
  }, [seckill, seckillConfigs, shelfConfigs]);

  // 初始化 selectedConfigId，只依赖配置长度
  useEffect(() => {
    if (allConfigs.length > 0 && !selectedConfigId) {
      setSelectedConfigId(allConfigs[0].id);
    }
  }, [allConfigs, allConfigs.length, selectedConfigId]);

  // 更新规格选项
  useEffect(() => {
    if (allConfigs.length === 0) {
      setSpecOptions([]);
      return;
    }

    const specMap: Record<string, Record<string, string[]>> = { config1: {}, config2: {}, config3: {} };

    allConfigs.forEach(config => {
      const cfg = seckill ? (config as SeckillConfigDetailVO).config : (config as ProductConfigVO);
      if (cfg.config1) specMap.config1[cfg.config1] = [...(specMap.config1[cfg.config1] || []), config.id];
      if (cfg.config2) specMap.config2[cfg.config2] = [...(specMap.config2[cfg.config2] || []), config.id];
      if (cfg.config3) specMap.config3[cfg.config3] = [...(specMap.config3[cfg.config3] || []), config.id];
    });

    const specLabelMap: Record<string, string> = { config1: '参数1', config2: '参数2', config3: '参数3' };
    const newSpecOptions: SpecOption[] = Object.entries(specMap)
      .filter(([, v]) => Object.keys(v).length > 0)
      .map(([key, valueMap]) => ({
        label: specLabelMap[key],
        values: Object.entries(valueMap).map(([value, configIds]) => ({ value, configIds: Array.from(new Set(configIds)) })),
        allValues: Object.keys(valueMap),
      }));

    setSpecOptions(newSpecOptions);
  }, [allConfigs, allConfigs.length, seckill]);

  const calculateSeckillStatus = useCallback(() => {
    if (!seckill || !seckillRound) return;
    const now = dayjs();
    const startTime = dayjs(seckillRound.startTime);
    const endTime = dayjs(seckillRound.endTime);

    if (now.isBefore(startTime)) {
      setSeckillStatus('wait');
      const diff = startTime.diff(now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${days > 0 ? `${days}天` : ''}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    } else if (now.isBetween(startTime, endTime)) {
      setSeckillStatus('ongoing');
      setCountdown('');
    } else {
      setSeckillStatus('ended');
      setCountdown('');
    }
  }, [seckill, seckillRound]);

<<<<<<< HEAD
  // 构建规格选项
  const buildSpecOptions = () => {
    if (allConfigValues.has('config1')) {
      specOptions.push({
        label: '颜色', 
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

  // 计算过滤后的规格选项
  const calculateFilteredSpecOptions = (): SpecOption[] => {
    const configs = seckill ? seckillConfigs.map(item => item.config) : shelfConfigs;
    const specLabels = ['颜色', '内存', '尺寸'];
    
    return specOptions.map(spec => {
      // 如果这个规格已经被选中，直接返回所有值（因为用户可能需要取消选择）
      if (selectedSpecs[spec.label]) {
        return spec;
      }
      
      // 计算在当前已选择规格的条件下，这个规格有哪些可选值
      const availableValues = new Set<string>();
      
      configs.forEach((config: ProductConfigVO) => {
        // 检查这个配置是否匹配所有已选择的规格
        let matchesAllSelected = true;
        
        specLabels.forEach(label => {
          if (selectedSpecs[label]) {
            const configValue = label === '颜色' ? config.config1 :
                               label === '内存' ? config.config2 :
                               config.config3;
            if (configValue !== selectedSpecs[label]) {
              matchesAllSelected = false;
            }
          }
        });
        
        // 如果配置匹配所有已选择的规格，则这个配置的当前规格值是可选的
        if (matchesAllSelected) {
          const value = spec.label === '颜色' ? config.config1 :
                       spec.label === '内存' ? config.config2 :
                       config.config3;
          if (value) {
            availableValues.add(value);
          }
        }
      });
      
      return {
        label: spec.label,
        values: Array.from(availableValues)
      };
    });
  };

  // 更新过滤后的规格选项
  useEffect(() => {
    if (specOptions.length > 0) {
      setFilteredSpecOptions(calculateFilteredSpecOptions());
    }
  }, [selectedSpecs, specOptions, seckillConfigs, shelfConfigs]);

  // 初始化数据加载
=======
  useEffect(() => {
    if (!seckill || !seckillRound) return;
    calculateSeckillStatus();
    const timer = setInterval(calculateSeckillStatus, 1000);
    return () => clearInterval(timer);
  }, [seckill, seckillRound, calculateSeckillStatus]);

>>>>>>> c387ec4c6540d9dc874bff6bf60cad7514aa81f7
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
          if (data?.appearances.length > 0) setActiveImage(data.appearances[0].image);
        } else {
          const data = await getShelfProductDetail(id);
          setShelfProductData(data);
          setHasShopCart(data.hasShopCart)
          if (data?.appearances.length > 0) setActiveImage(data.appearances[0].image);
        }
      } catch (error) {
        globalErrorHandler.handle(error, toast.error);
      } finally {
        setLoading(false);
      }
    }
    fetchData(id, seckill);
  }, [id, seckill, seckillId]);

<<<<<<< HEAD
  // 根据选中规格获取对应配置（区分秒杀/货架）
  const getSelectedConfig = (): SeckillConfigDetailVO | ProductConfigVO | null => {
    // 秒杀商品配置
    if (seckill) {
      if (seckillConfigs.length === 0) return null;
      // 未选择规格，返回第一个
      if (Object.keys(selectedSpecs).length === 0) {
        return seckillConfigs[0];
      }
      // 匹配选中规格 - 必须完全匹配所有已选择的规格
      const matchedConfig = seckillConfigs.find((item: SeckillConfigDetailVO) => {
        const config = item.config;
        const config1Match = selectedSpecs['颜色'] ? config.config1 === selectedSpecs['颜色'] : true;
        const config2Match = selectedSpecs['内存'] ? config.config2 === selectedSpecs['内存'] : true;
        const config3Match = selectedSpecs['尺寸'] ? config.config3 === selectedSpecs['尺寸'] : true;
        return config1Match && config2Match && config3Match;
      });
      
      // 检查是否所有已选择的规格都匹配（不能有未匹配的规格）
      if (matchedConfig) {
        const config = matchedConfig.config;
        // 验证是否所有已选择的规格都完全匹配
        const allSpecsMatched =
          (!selectedSpecs['颜色'] || config.config1 === selectedSpecs['颜色']) &&
          (!selectedSpecs['内存'] || config.config2 === selectedSpecs['内存']) &&
          (!selectedSpecs['尺寸'] || config.config3 === selectedSpecs['尺寸']);
        
        if (allSpecsMatched) {
          return matchedConfig;
        }
      }
      return null; // 没有完全匹配的配置
    } else {
      // 货架商品配置
      if (shelfConfigs.length === 0) return null;
      // 未选择规格，返回第一个
      if (Object.keys(selectedSpecs).length === 0) {
        return shelfConfigs[0];
      }
      // 匹配选中规格 - 必须完全匹配所有已选择的规格
      const matchedConfig = shelfConfigs.find((config: ProductConfigVO) => {
        const config1Match = selectedSpecs['颜色'] ? config.config1 === selectedSpecs['颜色'] : true;
        const config2Match = selectedSpecs['内存'] ? config.config2 === selectedSpecs['内存'] : true;
        const config3Match = selectedSpecs['尺寸'] ? config.config3 === selectedSpecs['尺寸'] : true;
        return config1Match && config2Match && config3Match;
      });
      
      // 检查是否所有已选择的规格都匹配
      if (matchedConfig) {
        const allSpecsMatched =
          (!selectedSpecs['颜色'] || matchedConfig.config1 === selectedSpecs['颜色']) &&
          (!selectedSpecs['内存'] || matchedConfig.config2 === selectedSpecs['内存']) &&
          (!selectedSpecs['尺寸'] || matchedConfig.config3 === selectedSpecs['尺寸']);
        
        if (allSpecsMatched) {
          return matchedConfig;
        }
      }
      return null; // 没有完全匹配的配置
    }
=======
  const getConfigById = (): SeckillConfigDetailVO | ProductConfigVO | null => {
    if (!selectedConfigId) return null;
    if (seckill) return seckillConfigs.find(item => item.configId === selectedConfigId) || null;
    return shelfConfigs.find(item => item.id === selectedConfigId) || null;
>>>>>>> c387ec4c6540d9dc874bff6bf60cad7514aa81f7
  };

  const getSelectedPrice = (): number => {
    const config = getConfigById();
    if (!config) return 0;
    return seckill ? (config as SeckillConfigDetailVO).seckillPrice : Number((config as ProductConfigVO).salePrice);
  };

  const getStockCount = (): number => {
    const config = getConfigById();
    if (!config) return 0;
    if (seckill) return (config as SeckillConfigDetailVO).remainNum;
    if (shelfItems.length === 0) return 0;
    const shelfItem = shelfItems.find(item => item.configId === selectedConfigId);
    return shelfItem ? (shelfItem.shelfNum - shelfItem.lockNum) : 0;
  };

  const getOriginalPrice = (): number => {
    const config = getConfigById();
    if (!config) return 0;
    return seckill ? Number((config as SeckillConfigDetailVO).config.originalPrice) : Number((config as ProductConfigVO).originalPrice);
  };

  const getSelectedSpecValues = (): Record<string, string> => {
    const config = getConfigById();
    if (!config) return {};
    const cfg = seckill ? (config as SeckillConfigDetailVO).config : (config as ProductConfigVO);
    const specValues: Record<string, string> = {};
    if (cfg.config1) specValues['参数1'] = cfg.config1;
    if (cfg.config2) specValues['参数2'] = cfg.config2;
    if (cfg.config3) specValues['参数3'] = cfg.config3;
    return specValues;
  };

  const finalPrice = getSelectedPrice();
  const originalPrice = getOriginalPrice();
  const stockCount = getStockCount();
  const hasStock = stockCount > 0;
  const selectedConfig = getConfigById();
  const selectedSpecValues = getSelectedSpecValues();

<<<<<<< HEAD
  // 处理规格选择
  const handleSpecSelect = (specLabel: string, value: string) => {
    // 如果点击已选中的规格，则取消选择
    if (selectedSpecs[specLabel] === value) {
      const newSelectedSpecs = { ...selectedSpecs };
      delete newSelectedSpecs[specLabel];
      setSelectedSpecs(newSelectedSpecs);
    } else {
      // 选择新的规格
      setSelectedSpecs({
        ...selectedSpecs,
        [specLabel]: value,
      });
    }
  };

  // 检查当前选择的规格组合是否存在
  const isConfigValid = !!selectedConfig;

  // 加入购物车处理
=======
  const handleSpecSelect = (specLabel: string, value: string) => {
    const specKeyMap: Record<string, 'config1' | 'config2' | 'config3'> = { 参数1: 'config1', 参数2: 'config2', 参数3: 'config3' };
    const specKey = specKeyMap[specLabel];
    if (!specKey) return;

    const matchedConfigs = allConfigs.filter(config => {
      const cfg = seckill ? (config as SeckillConfigDetailVO).config : (config as ProductConfigVO);
      return cfg[specKey] === value;
    });

    if (matchedConfigs.length === 0) {
      toast('当前规格暂无可选配置');
      return;
    }

    const targetConfig = matchedConfigs.find(cfg => cfg.id === selectedConfigId) || matchedConfigs[0];
    setSelectedConfigId(targetConfig.id);
  };

  const isLogin = useAuthStore(state => state.isAuthenticated)
>>>>>>> c387ec4c6540d9dc874bff6bf60cad7514aa81f7
  const handleAddToCart = async () => {

    if (!isLogin) {
      const currentPath = window.location.pathname + window.location.search;
      navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return
    }
    if (!product || !selectedConfig || !selectedConfigId) return;
    try {
      await addToShoppingCartService(selectedConfigId);
      setHasShopCart(true);
    } catch (err) {
      globalErrorHandler.handle(err, toast.error);
    }
  };

  const handleBuyNow = () => {
    if (!isLogin) {
      const currentPath = window.location.pathname + window.location.search;
      navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return
    }
    if (!product || !selectedConfig) return;
    if (seckill && seckillStatus === 'wait') { toast('秒杀尚未开始，请等待'); return; }
    if (seckill && seckillStatus === 'ended') { toast('秒杀已结束，无法购买'); return; }

    const orderState: OrderState[] = [{
      brandId: brand?.id,
      brandName: brand?.name,

      productId: product.id,
      productName: product.name,
      productImage: product.mainImage,
      configId: selectedConfigId!,
      configContent: getSelectedSpecValues(),

      quantity: quantity, // 购买数量
      unitPrice: finalPrice,
      originalPrice: originalPrice,

      isSeckill: seckill,
      seckillId: seckill ? seckillId : null,
      seckillRoundId: seckill ? seckillRound!.id : null,

      stockCount: stockCount,
    }]
    navigate("/checkout", { state: orderState });
  };

  if (loading) return <Loading />
  if (!product) return <div className="flex items-center justify-center min-h-screen bg-gray-100"><div className="text-xl text-red-600">商品数据加载失败</div></div>;


  return (
    <div className="bg-white pb-20 font-sans text-[#333]">
      {/* 主体内容区 */}
      <div className="w-[1200px] mx-auto mt-4 flex bg-white rounded-sm shadow-sm min-h-[90vh]">
        {/* 左侧：图片画廊 */}
        <div className="w-[450px] mr-[80px] pt-16  pb-8 flex-shrink-0">
          {/* 主图展示 */}
          <div className="relative overflow-hidden w-[450px] h-[450px] border border-gray-100 flex items-center justify-center mb-4 bg-black cursor-pointer group">
            <img
              src={activeImage || product.mainImage}
              alt={`${product.name} - 主图`}
              className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-110"
              onClick={() => {
                setModalImage(activeImage || product.mainImage!);
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
              productImage={product.mainImage!}
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
<<<<<<< HEAD
            {!seckill && (productData as ShelfProductDetailResponse)?.shelf?.isSelfOperated && (
=======
            {/* 产品标签（按priority排序展示） */}
            {tags.sort((a, b) => b.priority - a.priority).map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-0.5 bg-[#f0f8ff] text-[#4299e1] rounded-sm border border-[#dbeafe]"
              >
                {tag.name}
              </span>
            ))}

            {!seckill && (productData as ShelfProductDetailResponse).shelf?.isSelfOperated && (
>>>>>>> c387ec4c6540d9dc874bff6bf60cad7514aa81f7
              <span className="px-2 py-0.5 bg-[#f5f9ff] text-[#3677ff] rounded-sm border border-[#d0e0ff]">
                自营商品
              </span>
            )}
            {!seckill && (productData as ShelfProductDetailResponse)?.shelf?.isCustomizable && (
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
            {!seckill && (productData as ShelfProductDetailResponse)?.shelf?.installment > 0 && (
              <span className="px-2 py-0.5 bg-[#fff7e6] text-[#ff8800] rounded-sm border border-[#ffe1b8]">
                支持{(productData as ShelfProductDetailResponse).shelf.installment}期分期
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
                  {seckillStatus === 'ongoing' ? '结束时间' : '开始时间'}：{formatToLocalTime(seckillStatus === 'ongoing' ? seckillRound!.endTime : seckillRound?.startTime || '')}
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
                    coupons.map((coupon: CouponItem, idx: number) => {
                      if (Number(coupon.coupon.threshold) <= finalPrice) return (
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
                                  : `${Number(coupon.coupon.discount) * 100}折`
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
                      )
                    })
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

<<<<<<< HEAD
          {/* 规格选择 */}
          {filteredSpecOptions.length > 0 && (
=======
          {/* 规格选择（修复后：响应式状态渲染） */}
          {specOptions.length > 0 && (
>>>>>>> c387ec4c6540d9dc874bff6bf60cad7514aa81f7
            <div className="space-y-4 mb-8">
              {filteredSpecOptions.map((spec, specIdx) => (
                <div key={`spec-${specIdx}`} className="flex">
                  <span className="text-sm text-gray-500 w-[60px] leading-[34px]">
                    {spec.label}
                  </span>
                  <div className="flex flex-wrap gap-3 flex-1">
<<<<<<< HEAD
                    {spec.values.map((value, valIdx) => {
                      // 检查这个值是否可用（在过滤后的列表中）
                      const isAvailable = spec.values.includes(value);
                      const isSelected = selectedSpecs[spec.label] === value;
                      
                      return (
                        <button
                          key={`spec-${specIdx}-val-${valIdx}`}
                          onClick={() => isAvailable && handleSpecSelect(spec.label, value)}
                          disabled={!isAvailable}
                          className={`
                            px-4 py-1.5 text-sm border
                            ${isSelected
                              ? "border-[#e1140a] text-[#e1140a] relative"
                              : isAvailable
                                ? "border-gray-300 text-[#333] hover:border-[#e1140a]"
                                : "border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                            }
                          `}
                        >
                          {value}
                          {isSelected && (
                            <i className="absolute right-0 bottom-0 w-0 h-0 border-b-[10px] border-b-[#e1140a] border-l-[10px] border-l-transparent"></i>
                          )}
                          {!isAvailable && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-gray-400 rounded-full"></span>
                          )}
                        </button>
                      );
                    })}
=======
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
>>>>>>> c387ec4c6540d9dc874bff6bf60cad7514aa81f7
                  </div>
                </div>
              ))}
              
              {/* 配置有效性提示 */}
              {Object.keys(selectedSpecs).length > 0 && !isConfigValid && (
                <div className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠</span>
                  当前选择的规格组合暂无库存，请选择其他组合
                </div>
              )}
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
                onClick={() => seckill ? setQuantity(1) : setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
            <span className="text-xs text-gray-500 ml-2">
              {seckill && "限购1件"}
            </span>
            <span className="text-xs text-gray-500 ml-2">
              库存：{stockCount}件
            </span>
          </div>

          {/* 按钮组 */}
          <div className="flex gap-4">
            <button
<<<<<<< HEAD
              className={`w-[160px] h-[50px] text-white text-[18px] font-bold rounded-sm transition-colors ${hasStock && isConfigValid ? "bg-[#e1140a] hover:bg-[#c91008]" : "bg-gray-400 cursor-not-allowed"
                }`}
              disabled={!hasStock || !isConfigValid}
              onClick={handleBuyNow}
            >
              {!isConfigValid ? "请选择完整规格" : hasStock ? seckill ? "立即抢购" : "立即购买" : "缺货"}
=======
              className={`w-[160px] h-[50px] text-white text-[18px] font-bold rounded-sm transition-colors 
                ${hasStock && (seckill ? seckillStatus === 'ongoing' : true)
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
>>>>>>> c387ec4c6540d9dc874bff6bf60cad7514aa81f7
            </button>


            {hasShopCart &&
              <>
                <Link to={`/shopping-cart`} target="shopping-cart">
                  <button className={`w-[160px] h-[50px] text-[18px] font-bold rounded-sm transition-colors 
                  ${hasStock ? "bg-[#ffeded] border border-[#e1140a] text-[#e1140a] hover:bg-[#ffdcdc]" : "bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed"}`}
                  >
                    已加入购物车
                  </button>
                </Link>
              </>}

            {!hasShopCart && !seckill && (
              <button
<<<<<<< HEAD
                className={`w-[160px] h-[50px] text-[18px] font-bold rounded-sm transition-colors ${hasStock && isConfigValid
                  ? "bg-[#ffeded] border border-[#e1140a] text-[#e1140a] hover:bg-[#ffdcdc]"
                  : "bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed"
                }`}
                disabled={!hasStock || !isConfigValid}
=======
                className={`w-[160px] h-[50px] text-[18px] font-bold rounded-sm transition-colors 
                  ${hasStock ? "bg-[#ffeded] border border-[#e1140a] text-[#e1140a] hover:bg-[#ffdcdc]" : "bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed"}`}
                disabled={!hasStock || !selectedConfig}
>>>>>>> c387ec4c6540d9dc874bff6bf60cad7514aa81f7
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
<<<<<<< HEAD
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
                            {(productData as ShelfProductDetailResponse)?.shelf?.installment > 0
                              ? `${(productData as ShelfProductDetailResponse).shelf.installment}期分期`
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
=======
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
>>>>>>> c387ec4c6540d9dc874bff6bf60cad7514aa81f7
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