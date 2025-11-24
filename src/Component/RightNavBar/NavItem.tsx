/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-21 17:48:42
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-22 10:41:53
 * @FilePath: \lenovo-shop\src\Component\RightNavBar\NavItem.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface NavItemProps {
    normalImage: string;
    hoverImage?: string;
    href?: string;
    alt: string;
    onClick?: () => void;
    hasPopup?: boolean;
    children?: React.ReactNode;
}

/**
 * 导航项组件
 * 用于显示导航栏中的单个导航项，支持图片切换、悬停效果和弹出内容
 */
const NavItem: React.FC<NavItemProps> = ({
    normalImage,    // 普通状态下的图片
    hoverImage,     // 悬停状态下的图片
    href,           // 导航链接地址
    alt,            // 图片替代文本
    onClick,        // 点击事件处理函数
    hasPopup = false, // 是否显示弹出内容，默认为false
    children   // 弹出内容
}) => {
    // 状态管理：跟踪悬停状态和弹出内容的显示状态
    const [isHovered, setIsHovered] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    // 处理鼠标进入事件
    const handleMouseEnter = () => {
        setIsHovered(true);
        if (hasPopup) {
            setShowPopup(true);
        }
    };

    // 处理鼠标离开事件
    const handleMouseLeave = () => {
        setIsHovered(false);
        if (hasPopup) {
            setShowPopup(false);
        }
    };

    // 处理点击事件
    const handleClick = (e: React.MouseEvent) => {
        if (onClick) {
            e.preventDefault();
            onClick();
        }
    };

    // 根据悬停状态选择要显示的图片
    const currentImage = hoverImage && isHovered ? hoverImage : normalImage;
    return (
        <>
            <li className='block relative list-none'>
                <Link
                    to={href || '#'}
                    className={`block cursor-pointer text-black no-underline outline-none transition-all duration-200 ${isHovered ? 'bg-white/70' : ''
                        }`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleClick}
                >
                    <img
                        src={currentImage}
                        className='w-[70px] border-none inline-block align-middle transition-all duration-200'
                        alt={alt}
                        loading="lazy"
                    />
                </Link>
            
                 {hasPopup && showPopup && (
                <ul
                    className=" w-[210px] bg-white p-4 z-[11113] border-spacing-0  shadow-lg  top-0 absolute"
                      style={{
                        right: 'calc(72px)'
                    }}
                >
                    <li className="inline relative">
                            {children}
                    </li>
                </ul>
            )}
            </li>
        </>
    );

};

export default NavItem;
