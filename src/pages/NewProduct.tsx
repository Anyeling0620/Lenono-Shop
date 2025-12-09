
import React from 'react';

import Carousel from '../component/Carousel/Carousel';
import type { CarouselItemType } from '../types/carouselItem';
import NewProductList from '../component/NewProductList/NewProductList';
import NewProductRelease from '../component/NewProductList/NewProductRelease';

// --- 1. 静态数据配置 ---

const carouselData: CarouselItemType[] = [
    { imageName: "1.jpg", linkUrl: "/new", alt: "暖冬福利季" },
    { imageName: "2.png", linkUrl: "/new", alt: "新品发布" },
    { imageName: "3.png", linkUrl: "/new", alt: "新年好礼" },
];

// --- 2. 页面组件 ---

const NewProduct: React.FC = () => {
    

    return (
        <div className="bg-[#f5f5f5] min-h-screen pb-20">
            <Carousel data={carouselData} className='h-[340px]' />
            <NewProductRelease />
            <NewProductList className='w-[1200px] mx-auto py-[10px]' />
        </div>
    );
};

export default NewProduct;