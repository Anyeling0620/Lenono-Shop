/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-21 17:48:57
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-24 22:56:57
 * @FilePath: \lenovo-shop\src\component\RightNavBar\UserNavItem.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface UserNavItemProps {
  normalImage: string;
  hoverImage?: string;
  href: string;
  alt?: string;
}

const UserNavItem: React.FC<UserNavItemProps> = ({
  normalImage,
  hoverImage,
  href,
  alt
}) => {
      const [isHovered, setIsHovered] = useState(false);
         
      const currentImage = hoverImage && isHovered ? hoverImage : normalImage;

  return (
    <li className='list-none'>
      <Link
        to={href}
        className='w-[70px] h-[65px] block rounded-t-lg bg-white text-[#413f3f] hover:text-[#fff] transition-all duration-200 hover:bg-red-500 text-center'
        rel="noopener noreferrer"
        onMouseLeave={()=>setIsHovered(false)}
        onMouseEnter={()=>setIsHovered(true)}
      >
        <img 
          src={currentImage} 
          className='w-[45%] border-none inline-block align-middle mt-2.5' 
          alt={alt} 
          loading="lazy"
        />
        <div className='w-full text-[11px] mt-[2px]'>
          用户中心
        </div>
      </Link>
    </li>
  );
};

export default UserNavItem;
