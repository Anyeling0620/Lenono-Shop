import React, { useState, useEffect, useRef} from 'react';
import { getImageUrl , IMAGE_CONFIG} from '../utils/imageConfig';

interface RollItem {
  id: number;
  imageUrl: string;
  alt?: string;
  link?: string;
}

const Rolling: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const hideTimeoutRef = useRef<number | null>(null);

  const rollData: RollItem[] = [
    {
      id: 1,
      imageUrl: '1.png',
      alt: '图1',
      link: 'https://www.jxutcm.top'
    },
    {
      id: 2,
      imageUrl: '2.png',
      alt: '图2',
      link: 'https://www.jxutcm.top'
    },
    {
      id: 3,
      imageUrl: '3.png',
      alt: '图3',
      link: 'https://www.jxutcm.top'
    },
    {
      id: 4,
      imageUrl: '4.png',
      alt: '图4',
      link: 'https://www.jxutcm.top'
    },
    {
      id: 5,
      imageUrl: '5.png',
      alt: '图5',
      link: 'https://www.jxutcm.top'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === rollData.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(timer);
  }, [rollData.length]);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    // 清除之前的隐藏定时器
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setShowArrows(true);
  };

  const handleMouseLeave = () => {
    // 设置1秒后隐藏箭头
    hideTimeoutRef.current = setTimeout(() => {
      setShowArrows(false);
    }, 1000);
  };



  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? rollData.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === rollData.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div className="relative h-[500px] overflow-hidden"
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    >
    {/* 轮播图片 */}
    <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
    >
        {rollData.map((item) => (
        <div key={item.id} className="w-full h-full flex-shrink-0">
            <a href={item.link} className="block w-full h-full" target="_blank">
            <img
                src={getImageUrl(item.imageUrl,IMAGE_CONFIG.FOLDERS.ROLL)}
                alt={item.alt}
                className="w-full h-full object-cover object-top"
            />
            </a>
        </div>
        ))}
    </div>

    {/* 导航箭头 - 使用 SVG */}
    {showArrows && (
    <>
    <button
    onClick={goToPrevious}
    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all"
    >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
    </button>
    <button
    onClick={goToNext}
    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all"
    >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
    </button>
    </>
    )}


    {/* 改进的分页指示器 */}
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 bg-black bg-opacity-30 px-2 py-1 rounded-full">
        {rollData.map((_, index) => (
        <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
            index === currentIndex ? 'bg-white' : 'bg-gray-400'
            }`}
        />
        ))}
    </div>
    </div>

  );
};

export default Rolling;
