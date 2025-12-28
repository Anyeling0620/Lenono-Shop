
import React, { useState} from 'react';

interface ScrollToTopProps {
  normalImage: string;
  handleScrollToTop: () => void;
  hoverImage?: string;
  alt?: string;
}

/**
 * 滚动到顶部的组件
 * 接收正常状态和悬停状态的图片，以及图片的替代文本
 */
const ScrollToTop: React.FC<ScrollToTopProps> = ({
  normalImage,      // 正常状态显示的图片
  hoverImage,        // 悬停状态显示的图片
  handleScrollToTop,
  alt = "返回页面顶部"  // 图片的替代文本，默认值为"返回页面顶部"
}) => {
  const [isHovered, setIsHovered] = useState(false);  // 控制悬停状态

  

  // 根据悬停状态选择要显示的图片
  const currentImage = hoverImage && isHovered ? hoverImage : normalImage;

  return (
    <li className='block relative list-none'>
      <div
        className='block cursor-pointer text-black no-underline outline-none transition-all duration-200 hover:bg-white/70'
        onMouseEnter={() => setIsHovered(true)}    // 鼠标悬停时设置isHovered为true
        onMouseLeave={() => setIsHovered(false)}   // 鼠标离开时设置isHovered为false
        onClick={handleScrollToTop}                      // 点击时触发滚动到顶部的函数
      >
        <img
          src={currentImage}
          className='w-[70px] border-none inline-block align-middle'
          alt={alt}
          loading="lazy"
        />
      </div>
    </li>
  );
};

export default ScrollToTop;
