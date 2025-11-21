/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-21 17:12:12
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-21 17:12:21
 * @FilePath: \lenovo-shop\src\Component\Footer\FooterLinkColumn.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import React from 'react';
import { Link } from 'react-router-dom';

interface LinkItem {
  text: string;
  url: string;
}

interface FooterLinkColumnProps {
  title: string;
  links: LinkItem[];
  className?: string;
}

const FooterLinkColumn: React.FC<FooterLinkColumnProps> = ({ 
  title, 
  links, 
}) => {
  return (
    <li className={`w-[152px] box-content float-left list-none`}>
      <p className='block text-[16px] leading-4 mb-[18px] font-semibold text-[#424242] box-content'>
        {title}
      </p>
      {links.map((link, index) => (
        <Link 
          key={index}
          to={link.url} 
          className='block text-[13px] leading-[13px] mb-3 text-[#757575] box-content hover:text-[#e1140a] transition-colors'
        >
          {link.text}
        </Link>
      ))}
    </li>
  );
};

export default FooterLinkColumn;
