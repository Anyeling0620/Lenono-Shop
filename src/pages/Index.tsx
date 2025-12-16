

import React from 'react';
import QuickAccess from '../component/QuickAccess/QuickAccess';
import type { CarouselItemType } from '../types/carouselItem';
import Carousel from '../component/Carousel/Carousel';
import FlashSale from '../component/FlashSale/FlashSale';
import MainProduct from '../component/MainProduct/MainProduct';


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
    <div className='bg-[#f5f5f5]'>

  
      <Carousel
        className='h-[400px]'
        data={rollData}
      />
      <QuickAccess />
      <FlashSale />
      <MainProduct />
    </div>

  );
};

export default Index;
