/*
 * @Description: 单个商品卡片组件
 * @Responsibility: 
 * 1. 展示商品信息 (图、文、价)
 * 2. 逻辑判断: 根据 status 和 soldPercent 决定卡片状态
 * 3. 动态样式: 
 * - "未开始" -> 蓝色按钮 + 设置提醒
 * - "已抢光" -> 灰色按钮 + 禁用 + 遮罩
 * - "进行中" -> 红色按钮 + 进度条
 */
import React from 'react';
import { Link } from 'react-router-dom';
import type { Product, TimeStatus } from '../../types/flashSale';

interface Props {
  product: Product;
  status: TimeStatus; // 从父级接收的状态
}

const FlashProductCard: React.FC<Props> = ({ product, status }) => {
  const { name, image, currentPrice, originalPrice, discount, link, desc, soldCount = 0, totalCount = 100 } = product;
  
  const displayDesc = desc || '爆款特惠，限时抢购';
  
  // 计算百分比 (向下取整，避免出现 99.9% 让人以为还没抢完)
  const displayPercent = totalCount > 0 ? Math.floor((soldCount / totalCount) * 100) : 0;
  // 状态判断
  const isUpcoming = status === 'wait';
  const isSoldOut = !isUpcoming && soldCount >= totalCount; // 使用具体数量判断是否抢光

 
  let btnText = '立即抢购';
  let btnClass = 'bg-[#e11414] hover:bg-[#c40e0e] text-white'; 

  if (isUpcoming) {
    btnText = '设置提醒';
    btnClass = 'bg-[#60aef7] hover:bg-[#4d9ee6] text-white';
  } else if (isSoldOut) { 
    btnText = '已抢光';
    btnClass = 'bg-[#cccccc] text-white cursor-not-allowed';
  }

  return (
    <div className="bg-white w-[294px] h-[375px] px-[25px] pt-[20px] pb-[23px] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-transparent hover:border-gray-100 flex flex-col box-border">
      {/* 链接处理: 如果不可购买，禁用链接跳转 */}
      <Link 
        to={isSoldOut || isUpcoming ? '#' : link} 
        className={`block flex-1 flex-col h-full text-decoration-none ${isSoldOut ? 'cursor-default' : ''}`}
        onClick={(e) => (isSoldOut || isUpcoming) && e.preventDefault()}
      >
        <div className="w-[160px] h-[160px] mx-auto overflow-hidden flex items-center justify-center mb-4 relative">
          <img 
            src={image} 
            alt={name} 
            className={`max-w-full max-h-full transition-transform duration-300 ${!isSoldOut && !isUpcoming && 'group-hover:scale-105'} ${isSoldOut ? 'opacity-60' : ''}`} 
          />
        
          {isSoldOut && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">Sold Out</span>
             </div>
          )}
        </div>

        {/* 文本内容区域 */}
        <div className="flex-1 flex flex-col items-start text-left">
          <h3 className={`text-[15px] font-bold w-full truncate mb-1 ${isSoldOut ? 'text-[#999]' : 'text-[#333]'}`} title={name}>
            {name}
          </h3>
          <p className="text-[12px] text-[#999] w-full truncate mb-2">{displayDesc}</p>
          
          {/* 折扣标签 */}
          <div className="mb-2">
            <div className="inline-block bg-[#ffe7e4] h-[18px] leading-[18px] border border-[#ffe7e4] rounded px-1">
              <i className="inline-block w-[13px] h-[13px] bg-[url(https://p1.lefile.cn/product/adminweb/2020/02/24/eeae0241-a38e-4e5d-802c-4091175a1cbe.png)] bg-[length:13px_13px] align-middle mr-[2px] -mt-[2px]"></i>
              <span className="inline-block text-[12px] text-[#ff2f2f] align-middle transform scale-90 origin-left">{discount}折</span>
            </div>
          </div>

          {/* 价格展示 */}
          <div className="flex items-baseline gap-2 mt-auto mb-3">
            <div className={`${isSoldOut ? 'text-[#999]' : 'text-[#e11414]'}`}>
              <span className="text-[14px] font-bold">¥</span>
              <span className="text-[24px] font-bold leading-none">{currentPrice}</span>
            </div>
            <div className="text-[#999] line-through text-[12px]">¥{originalPrice}</div>
          </div>
        </div>

        {/* 底部操作区 (进度条 + 按钮) */}
        <div className="flex items-center justify-between w-full mt-auto">
          <div className="flex-1 mr-4">
            {/* 根据状态显示不同内容 */}
            {isUpcoming ? (
               // 状态A: 未开始 -> 显示提醒人数
               <div className="text-[12px] text-[#999]">已有0人设置提醒</div>
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