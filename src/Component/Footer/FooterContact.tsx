/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-21 17:12:27
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-21 17:24:41
 * @FilePath: \lenovo-shop\src\Component\Footer\FooterContact.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import React from 'react';
import { Link } from 'react-router-dom';

interface FooterContactProps {
  phone: string;
  serviceHours: string;
  qrCodeImageUrl?: string;
  className?: string;
}

const FooterContact: React.FC<FooterContactProps> = ({ 
  phone, 
  serviceHours, 
  qrCodeImageUrl,
  className = "" ,
}) => {
  return (
    <li className={`w-[223px] border-l border-gray-300 pl-[58px] ml-[5px] box-content float-left list-none ${className}`}>
      <div className='box-content'>
        <h3 className='text-[20px] tracking-normal text-left text-[#e1140a] font-semibold'>
          {phone}
        </h3>
        <span className='text-[12px] text-[#757575] tracking-normal text-left leading-[25px] block mt-1'>
          {serviceHours}
        </span>
        {qrCodeImageUrl && (
          <Link 
            to="/"
            className='inline-block w-[139px] h-[36px] mt-3'
            style={{ 
              backgroundImage: `url(${qrCodeImageUrl})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat'
            }}
          />
        )}
      </div>
    </li>
  );
};

export default FooterContact;
