import React from 'react';
import { Link } from 'react-router-dom';
import type { SeckillProductVO, TimeStatus } from '../../types/flashSale';
import { getLowestPriceConfig, calculateSoldPercent } from '../../utils/timeCalculator';

interface Props {
  product: SeckillProductVO;
  status: TimeStatus; // 从父级接收的状态
}

const FlashProductCard: React.FC<Props> = ({ product, status }) => {
  // 获取最低价格的有效配置项
  const mainConfig = getLowestPriceConfig(product);
  // 商品基础信息
  const productBase = product.product;
  // 配置项基础信息
  const configBase = mainConfig.config;

  // 核心数据获取
  const name = productBase.name;
  const image = configBase.configImage || productBase.mainImage || `https://via.placeholder.com/160?text=Seckill-${product.id}`;
  const currentPrice = mainConfig.seckillPrice; // 秒杀价
  const originalPrice = configBase.originalPrice || configBase.salePrice; // 原价
  const link = `/product/${productBase.id}?seckill=true`; // 商品链接
  const desc = productBase.subTitle || '爆款特惠，限时抢购'; // 商品副标题

  // 已售/总数量计算
  const totalCount = mainConfig.shelfNum; // 总上架数量
  const soldCount = totalCount - mainConfig.remainNum - mainConfig.lockNum; // 已售数量
  const displayPercent = calculateSoldPercent(product); // 已售百分比

  // 状态判断
  const isUpcoming = status === 'wait';
  const isSoldOut = !isUpcoming && soldCount >= totalCount; // 是否售罄

  // 按钮样式和文案 - 核心修改：未开始状态改为“等待开始”+灰色按钮
  let btnText = '立即抢购';
  let btnClass = 'bg-[#e11414] hover:bg-[#c40e0e] text-white';

  if (isUpcoming) {
    btnText = '等待开始'; // 替换：设置提醒 → 等待开始
    btnClass = 'bg-[#cccccc] text-white cursor-not-allowed'; // 替换：蓝色按钮 → 灰色禁用按钮（和已抢光样式一致）
    // 也可以自定义浅灰色样式：bg-[#f0f0f0] text-[#999] cursor-not-allowed
  } else if (isSoldOut) {
    btnText = '已抢光';
    btnClass = 'bg-[#cccccc] text-white cursor-not-allowed';
  }

  // 折扣计算（秒杀价 / 原价，保留1位小数）
  const discount = Math.round((currentPrice / originalPrice) * 10);

  return (
    <div className="bg-white w-[294px] h-[375px] px-[25px] pt-[20px] pb-[23px] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-transparent hover:border-gray-100 flex flex-col box-border">
      {/* 链接处理: 如果不可购买，禁用链接跳转 */}
      <Link
        to={ link}
        target={productBase.id}
        className={`block flex-1 flex-col h-full text-decoration-none ${isSoldOut || isUpcoming ? 'cursor-default' : ''}`}
       //  onClick={(e) => (isSoldOut || isUpcoming) && e.preventDefault()}
      >
        <div className="w-[160px] h-[160px] mx-auto overflow-hidden flex items-center justify-center mb-4 relative">
          <img
            src={image}
            alt={name}
            className={`max-w-full max-h-full transition-transform duration-300 ${!isSoldOut && !isUpcoming && 'group-hover:scale-105'} ${isSoldOut || isUpcoming ? 'opacity-60' : ''}`}
            // 新增：未开始状态也添加透明度
          />

          {isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">Sold Out</span>
            </div>
          )}
          {/* 可选：未开始状态添加“即将开始”遮罩 */}
          {isUpcoming && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">Coming Soon</span>
            </div>
          )}
        </div>

        {/* 文本内容区域 */}
        <div className="flex-1 flex flex-col items-start text-left">
          <h3 className={`text-[15px] font-bold w-full truncate mb-1 ${isSoldOut || isUpcoming ? 'text-[#999]' : 'text-[#333]'}`} title={name}>
            {name}
          </h3>
          <p className="text-[12px] text-[#999] w-full truncate mb-2">{desc}</p>

          {/* 折扣标签 */}
          <div className="mb-2">
            <div className="inline-block bg-[#ffe7e4] h-[18px] leading-[18px] border border-[#ffe7e4] rounded px-1">
              <i className="inline-block w-[13px] h-[13px] bg-[url(https://p1.lefile.cn/product/adminweb/2020/02/24/eeae0241-a38e-4e5d-802c-4091175a1cbe.png)] bg-[length:13px_13px] align-middle mr-[2px] -mt-[2px]"></i>
              <span className="inline-block text-[12px] mb-1 text-[#ff2f2f] align-middle transform scale-90 origin-left">{discount}折</span>
            </div>
          </div>

          {/* 价格展示 */}
          <div className="flex items-baseline gap-2 mt-auto mb-3">
            <div className={`${isSoldOut || isUpcoming ? 'text-[#999]' : 'text-[#e11414]'}`}>
              <span className="text-[14px] font-bold">¥</span>
              <span className="text-[24px] font-bold leading-none">{currentPrice.toFixed(2)}</span>
            </div>
            <div className="text-[#999] line-through text-[12px]">¥{originalPrice.toFixed(2)}</div>
          </div>
        </div>

        {/* 底部操作区 (进度条 + 按钮) - 核心修改：未开始状态显示“等待开始” */}
        <div className="flex items-center justify-between w-full mt-auto">
          <div className="flex-1 mr-4">
            {/* 根据状态显示不同内容 */}
            {isUpcoming ? (
              // 替换：移除“已有0人设置提醒”，改为显示“等待开始”
              <div className="text-[12px] text-[#999]">等待开始</div>
            ) : (
              // 状态B: 进行中/已抢光 -> 显示进度条
              <>
                <div className="w-full h-[6px] bg-[#ffdede] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isSoldOut ? 'bg-[#999]' : 'bg-[#e11414]'}`}
                    style={{ width: `${displayPercent}%` }}
                  />
                </div>
                <div className="text-[12px] text-[#858585] mt-1">
                  {isSoldOut ? '已抢100%' : `已抢${displayPercent}%`}
                </div>
              </>
            )}
          </div>

          <button className={`${btnClass} text-[14px] font-bold px-4 py-2 rounded-[2px] whitespace-nowrap border-none cursor-pointer transition-colors`}>
            {btnText}
          </button>
        </div>
      </Link>
    </div>
  );
};

export default FlashProductCard;