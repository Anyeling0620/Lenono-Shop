import React, { useState, useEffect } from 'react';

interface ScrollToTopProps {
  normalImage: string;
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
  alt = "返回页面顶部"  // 图片的替代文本，默认值为"返回页面顶部"
}) => {
  const [isHovered, setIsHovered] = useState(false);  // 控制悬停状态
  const [isAtTop, setIsAtTop] = useState(true);       // 控制是否在页面顶部

  // 使用useEffect添加滚动监听器，检查滚动位置
  useEffect(() => {
    const checkScrollPosition = () => {
      setIsAtTop(window.scrollY === 0);  // 当滚动位置为0时，设置isAtTop为true
    };

    window.addEventListener('scroll', checkScrollPosition);
    checkScrollPosition(); // 初始检查

    // 清理函数，移除事件监听器
    return () => window.removeEventListener('scroll', checkScrollPosition);
  }, []);

  // 处理点击事件，平滑滚动到页面顶部
  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 根据悬停状态选择要显示的图片
  const currentImage = hoverImage && isHovered ? hoverImage : normalImage;

  // 如果在页面顶部，则不渲染任何内容
  if (isAtTop) {
    return null; // 在页面顶部时不显示
  }

  return (
    <li className='block relative list-none'>
      <div
        className='block cursor-pointer text-black no-underline outline-none transition-all duration-200 hover:bg-white/70'
        onMouseEnter={() => setIsHovered(true)}    // 鼠标悬停时设置isHovered为true
        onMouseLeave={() => setIsHovered(false)}   // 鼠标离开时设置isHovered为false
        onClick={handleClick}                      // 点击时触发滚动到顶部的函数
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
