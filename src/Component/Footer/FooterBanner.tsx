
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
