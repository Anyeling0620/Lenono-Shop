/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-18 20:09:36
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-24 12:07:02
 * @FilePath: \lenovo-shop\src\pages\Index.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */

import React from 'react';
import QuickAccess from '../component/QuickAccess/QuickAccess';
import type { CarouselItemType } from '../types/carouselItem';
import Carousel from '../component/Carousel/Carousel';
import FlashSale from '../component/FlashSale/FlashSale';


const rollData: CarouselItemType[] = [
  {
    imageName: '1.png',
    alt: '图1',
    linkUrl: 'https://www.jxutcm.top'
  },
  {
    imageName: '2.png',
    alt: '图2',
    linkUrl: 'https://www.jxutcm.top'
  },
  {
    imageName: '3.png',
    alt: '图3',
    linkUrl: 'https://www.jxutcm.top'
  },
  {
    imageName: '4.png',
    alt: '图4',
    linkUrl: 'https://www.jxutcm.top'
  },
  {
    imageName: '5.png',
    alt: '图5',
    linkUrl: 'https://www.jxutcm.top'
  }
];


const Index: React.FC = () => {

  return (
    <div className='bg-[#efefef]'>
      <Carousel
        className='h-[400px]'
        data={rollData}
      />
      <QuickAccess/>
      <FlashSale />
    </div>

  );
};

export default Index;
