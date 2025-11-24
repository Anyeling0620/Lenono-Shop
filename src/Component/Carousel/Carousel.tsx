/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-23 13:37:33
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-24 16:24:32
 * @FilePath: \lenovo-shop\src\component\Carousel\Carousel.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import CarouselTrack from './CarouselTrack';
import NavigationButtons from './NavigationButtons';
import Indicators from './Indicators';
import type { CarouselItemType } from '../../types/carouselItem';

interface CarouselProps {
    data: CarouselItemType[];
    interval?: number;
    duration?: number;
    className?: string;
}

type NavigationDirection = 'prev' | 'next';

const Carousel: React.FC<CarouselProps> = ({
    data,
    interval = 3000,
    duration = 500,
    className = '',
}) => {
    const [currentIndex, setCurrentIndex] = useState(0); //  当前展示项的索引状态管理

    const timerRef = useRef<number | null>(null); //  定时器引用，用于存储和清除定时器

    const handleNavigate = useCallback((direction: NavigationDirection) => { //  处理导航操作的回调函数，支持前进和后退
        setCurrentIndex((prev) => {
            if (direction === "next") {
                return (prev + 1) % data.length; //  计算下一项索引，使用取模运算实现循环
            }
            if (direction === "prev") {
                return (prev - 1 + data.length) % data.length; //  计算上一项索引，使用取模运算实现循环
            }
            return prev;
        });
    }, [data.length]);

    const startAutoPlay = useCallback(() => { //  开始自动播放的函数
        if (timerRef.current) clearInterval(timerRef.current); //  如果已有定时器，先清除
        timerRef.current = window.setInterval(() => { //  设置新的定时器，每隔指定时间触发一次前进操作
            handleNavigate("next");
        }, interval); //  设置定时器，按照指定间隔执行
    }, [interval, handleNavigate]); //  依赖项包括interval和handleNavigate函数

    const stopAutoPlay = () => {
        if (timerRef.current) { //  如果定时器存在
            clearInterval(timerRef.current); //  清除定时器
            timerRef.current = null; //  将定时器引用置为null
        }
    };

    useEffect(() => {
        startAutoPlay(); //  启动自动轮播
        return stopAutoPlay; //  返回清理函数，组件卸载时停止自动轮播
    }, [startAutoPlay]); //  依赖项为startAutoPlay函数


    const handleIndicatorClick = (index: number) => {
        stopAutoPlay(); //  点击指示器时停止自动轮播
        setCurrentIndex(index); //  设置当前轮播项索引
        setTimeout(() => startAutoPlay(), 2000); //  2秒后重新启动自动轮播
    };
    const handleManualNavigate = (direction: NavigationDirection) => {
        stopAutoPlay();         // 暂停自动轮播
        handleNavigate(direction); // 执行切换
        setTimeout(() => startAutoPlay(), 2000); // 2秒后重新启动
    };


    // 如果没有数据，显示空状态
    if (!data || data.length === 0) {
        return <></>;
    }

    return (
        <div className={`bg-white/0 relative -top-1 z-0 ${className} z-10`}>
            <CarouselTrack
                data={data}
                currentIndex={currentIndex}
                duration={duration}
                className={className}
            />

            <NavigationButtons onNavigate={handleManualNavigate} />

            <Indicators
                count={data.length}
                currentIndex={currentIndex}
                onIndicatorClick={handleIndicatorClick}
            />
        </div>
    );
};

export default Carousel;
