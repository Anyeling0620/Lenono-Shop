/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-21 17:11:40
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-21 17:11:50
 * @FilePath: \lenovo-shop\src\Component\Footer\FooterBanner.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import React from 'react';

interface FooterBannerProps {
  imageUrl: string;
  altText?: string;
}

const FooterBanner: React.FC<FooterBannerProps> = ({ 
  imageUrl, 
  altText = "Footer Banner" 
}) => {
  return (
    <div className='bg-white h-[199px] w-full'>
      <div className='w-[1200px] h-[199px] relative m-auto'>
        <img
          className='w-full h-full object-cover border-none'
          src={imageUrl}
          alt={altText}
        />
      </div>
    </div>
  );
};

export default FooterBanner;
