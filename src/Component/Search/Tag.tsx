
import React from "react";

interface TagProps {
  type: 'self' | 'coupon' | 'custom' | 'tradeIn' | 'installment';
  money?: number;
  month?: number;
}

const Tag: React.FC<TagProps> = ({ type, money, month }) => {
  const baseClasses = 'h-4 ml-[5px] mt-[10px] not-italic text-xs rounded-[1px] leading-[13px] text-center';

  const renderContent = () => {
    switch (type) {
      case 'self':
        return (
          <i className={`${baseClasses} w-8 float-right border border-[#E1140A] text-white bg-[#E1140A] tracking-[1px]`}>
            自营
          </i>
        );
      case 'coupon':
        return (
          <i className={`${baseClasses} min-w-[44px] relative border border-[#FF2F2F]`}>
            <span className='text-[#E1140A] text-left inline-block relative box-border pl-[3px] pr-[18px] leading-[14px]'>
              {money}元
            </span>
            <span className='absolute -right-[1px] leading-[15px] -top-[1px] bg-[#E1140A] text-white inline-block w-4 h-4 rounded-br-[1px] rounded-tr-[1px]'>
              券
            </span>
          </i>
        );
      case 'custom':
        return (
          <i className={`${baseClasses} inline-block text-[#5F00FF] border border-[#5F00FF] w-[56px] tracking-[1px]`}>
            外观定制
          </i>
        );
      case 'tradeIn':
        return (
          <i className={`${baseClasses} inline-block text-[#FF8200] border border-[#FF8200] w-[56px] tracking-[1px]`}>
            以旧换新
          </i>
        );
      case 'installment':
        return (
          <i className={`${baseClasses} w-auto relative border border-[#FF2F2F]`}>
            <span className='text-[#E1140A] text-left inline-block relative box-border pl-[1px] pr-[18px] leading-[14px]'>
              {month}期
            </span>
            <span className='absolute -right-[16px] -top-[1px] bg-[#E1140A] text-white inline-block leading-[15px] w-8 h-4 rounded-br-[1px] rounded-tr-[1px]'>
              免息
            </span>
          </i>
        );
      default:
        return null;
    }
  };

  return renderContent();
};


export default Tag;