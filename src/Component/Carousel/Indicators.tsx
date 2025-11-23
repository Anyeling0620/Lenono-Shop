/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-23 13:34:50
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-23 15:38:23
 * @FilePath: \lenovo-shop\src\Component\Carousel\Indicators.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import React from 'react';

interface IndicatorsProps {
  count: number; //  指示器的总数量
  currentIndex: number;  //  当前激活的指示器索引
  onIndicatorClick: (index: number) => void; //  点击指示器时的回调函数，接收被点击的指示器索引作为参数
}

const Indicators: React.FC<IndicatorsProps> = ({ 
  count, 
  currentIndex, 
  onIndicatorClick 
}) => {
  return (
    <div className="w-full overflow-hidden text-center absolute bottom-6 z-[999] h-7 leading-7 text-[0px]">
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          className="inline-block my-0 mx-[7px] w-6 h-6 text-center align-middle leading-7 cursor-pointer"
          onClick={() => onIndicatorClick(index)}
          role="button"
          aria-label={`切换到第 ${index + 1} 张`}
        >
          <i
            className={`inline-block  align-middle ${
              index === currentIndex ? 'rounded-[20px] w-5 h-5 border-2 border-white  bg-transparent ' : ' w-0.5 h-2  bg-white'
            }`}
          />
        </span>
      ))}
    </div>
  );
};

export default Indicators;
