
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
