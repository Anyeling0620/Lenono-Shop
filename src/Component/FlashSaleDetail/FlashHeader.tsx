/*
 * @Description: 秒杀专场页头部 Banner 组件 (FlashHeader)
 * @Responsibility: 纯视觉展示组件 (Dumb Component)
 * @Features:
 * 1. 展示红色品牌背景
 * 2. 包含 CSS 绘制的几何背景装饰
 * 3. 展示 "联想秒杀" 图片标题和副标题
 */
import React from 'react';
import { getImageUrl } from '../../utils/imageConfig';

const FlashHeader: React.FC = () => {
  const TITLE_IMG = "https://p3.lefile.cn/product/adminweb/2020/02/26/99f3bccf-14fe-4a4b-a710-9a1c9c35eefd.png";

  return (
    <div className="w-full bg-[#e11414] h-[240px] flex flex-col justify-center items-center text-white select-none relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50">
         <div className="absolute -top-[50px] -left-[50px] w-[200px] h-[200px] bg-[#f03a3a] rotate-45 opacity-30"></div>
         <div className="absolute -bottom-[50px] -right-[50px] w-[250px] h-[250px] bg-[#f03a3a] rotate-45 opacity-20"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <img 
          src={getImageUrl(TITLE_IMG)} 
          alt="联想秒杀" 
          className="h-[48px] object-contain mb-6"
        />
        
        <div className="flex items-center gap-4 opacity-90">
          <span className="w-12 h-[1px] bg-white/60"></span>
          <span className="text-[20px] tracking-[0.4em] font-light">
            爆品 新品 限时开抢
          </span>
          <span className="w-12 h-[1px] bg-white/60"></span>
        </div>
      </div>
    </div>
  );
};

export default FlashHeader;