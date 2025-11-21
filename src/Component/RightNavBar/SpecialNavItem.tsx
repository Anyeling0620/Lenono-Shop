/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-21 17:48:57
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-21 17:49:09
 * @FilePath: \lenovo-shop\src\Component\RightNavBa\SpecialNavItem.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import React from 'react';
import { Link } from 'react-router-dom';

interface SpecialNavItemProps {
  image: string;
  href: string;
  alt?: string;
}

const SpecialNavItem: React.FC<SpecialNavItemProps> = ({
  image,
  href,
  alt = "联想乐享"
}) => {
  return (
    <li className='list-none'>
      <Link 
        to={href} 
        className='w-[70px] block text-[#000] transition-all duration-200 hover:bg-white/70'
        target="_blank"
        rel="noopener noreferrer"
      >
        <img 
          src={image} 
          className='w-full border-none inline-block align-middle' 
          alt={alt} 
          loading="lazy"
        />
      </Link>
    </li>
  );
};

export default SpecialNavItem;
