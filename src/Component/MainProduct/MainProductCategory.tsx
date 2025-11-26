import type { MainProduct } from "../../types/mainProduct";
import Card from "./MainProductCard";
import type { CarouselItemType } from "../../types/carouselItem";
import Indicators from "../Carousel/Indicators";
import { useEffect, useState } from "react";
import { useCallback, useRef } from "react";

interface CategoryProps {
  name: string;
  image: CarouselItemType[];
  products: MainProduct[];
}

const Category = ({ name, image, products }: CategoryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  // 自动轮播切换
  const handleNavigate = useCallback((direction: 'next' | 'prev') => {
    setTimeout(() => {
      setCurrentImageIndex((prev) => {
        if (direction === "next") {
          return (prev + 1) % image.length;
        }
        return (prev - 1 + image.length) % image.length;
      });
    }, 300); // 与 transition 时间匹配
  }, [image.length]);

  // 开始自动播放
  const startAutoPlay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (image.length <= 1) return;

    timerRef.current = window.setInterval(() => {
      handleNavigate("next");
    }, 7000);
  }, [image.length, handleNavigate]);

  // 停止自动播放
  const stopAutoPlay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // 初始化自动轮播
  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [startAutoPlay]);

  // 点击指示器处理
  const handleIndicatorClick = (index: number) => {
    stopAutoPlay();
    setTimeout(() => {
      setCurrentImageIndex(index);
      setTimeout(() => startAutoPlay(), 2000);
    }, 300);
  };


  return (
    <div className="pt-[20px] pb-[20px] w-[1200px]">
      {/* 头部部分 */}
      <div className="head mb-[16px]">
        <span className="text-shadow text-[24px] font-bold">{name}</span>
        {/* 右侧还需要添加小组件 */}
      </div>
      {/* 卡片部分 */}
      <div className="grid grid-cols-5 gap-3">
        {/* 左侧轮播图片区域 */}
        <div className="col-span-1 relative overflow-hidden">
          <div
            className={`flex transition-transform duration-500 ease-in-out h-full`}
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {image.map((img, index) => (
              <a
                key={index}
                href={img.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-full flex-shrink-0"
              >
                <img
                  src={img.imageName}
                  alt={img.alt || name}
                  className="w-full h-full object-cover"
                />
              </a>
            ))}
          </div>

          {/* 指示器 */}
          {image.length > 1 && (
            <Indicators
              count={image.length}
              currentIndex={currentImageIndex}
              onIndicatorClick={handleIndicatorClick}
            />
          )}
        </div>



        {/* 右侧卡片区域 */}
        <div className="col-span-4 grid grid-rows-2 gap-3">
          {/* 上半部分4个卡片 */}
          <div className="grid grid-cols-4 gap-3 ">
            {products.slice(0, 4).map((product) => (
              <Card key={product.id} product={product} />
            ))}
          </div>
          {/* 下半部分4个卡片 */}
          <div className="grid grid-cols-4 gap-3">
            {products.slice(4, 8).map((product) => (
              <Card key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
