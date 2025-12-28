
import React from 'react';

type NavigationDirection = 'prev' | 'next';
interface NavigationButtonsProps {
    onNavigate: (direction: NavigationDirection) => void;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ onNavigate }) => {
    return (
        <div className="top-[45%] absolute w-full z-[999] m-0 p-0 block">
            <div
                className="absolute w-[30px] h-[52px] bg-[url(https://p2.lefile.cn/product/adminweb/2018/11/11/2a7f8349-14f0-42e1-afe8-7ae8afd54e1e.png)] bg-no-repeat left-8 opacity-100 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onNavigate('prev')}
                role="button"
                aria-label="上一张"
            />
            <div
                className="absolute w-[30px] h-[52px] bg-[url(https://p2.lefile.cn/product/adminweb/2018/11/11/cae7b801-0fe6-4691-ba99-239ba9d11576.png)] bg-no-repeat right-8 opacity-100 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onNavigate('next')}
                role="button"
                aria-label="下一张"
            />
        </div>
    );
};

export default NavigationButtons;
