import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/flashSale';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { name, image, currentPrice, originalPrice, discount, link } = product;

  return (
    <li className="w-[195px] inline-block mr-[23px] mt-[17px] border-r border-[#e8e8e8] pr-[10px] list-none">
      <Link to={link} className="inline-block no-underline">
        <div className="w-[160px] h-[160px] leading-[160px] text-center mx-auto">
          <img 
            src={image} 
            alt={name}
            className="inline-block align-middle max-w-[160px] border-0" 
          />
        </div>
        <div className="mt-[9px]">
          <span className="inline-block w-[192px] overflow-hidden text-ellipsis whitespace-nowrap text-[15px] text-[#242424] font-semibold">
            {name}
          </span>
        </div>
        <DiscountBadge discount={discount} />
        <PriceDisplay 
          currentPrice={currentPrice} 
          originalPrice={originalPrice} 
        />
      </Link>
    </li>
  );
};

const DiscountBadge: React.FC<{ discount: number }> = ({ discount }) => (
  <div className="mt-1 h-[18px] relative">
    <div className="block absolute bg-[#ffe7e4] w-auto h-4 leading-4 border border-[#ffe7e4] rounded">
      <i className="inline-block w-[13px] h-[13px] bg-[url(https://p1.lefile.cn/product/adminweb/2020/02/24/eeae0241-a38e-4e5d-802c-4091175a1cbe.png)] bg-[length:13px_13px] mt-[1.5px] ml-[2px]"></i>
      <span className="inline-block text-xs text-[#ff2f2f] left-[17px] align-top mx-[3px]">
        {discount}折
      </span>
    </div>
  </div>
);

const PriceDisplay: React.FC<{ currentPrice: number; originalPrice: number }> = ({
  currentPrice,
  originalPrice
}) => (
  <div className="mt-[7px]">
    <div className="inline-block mr-[11px]">
      <span className="text-base text-[#e72d21] font-bold">¥</span>
      <span className="text-base text-[#e2231a] font-semibold">{currentPrice}</span>
    </div>
    <div className="inline-block text-[0px] text-[#858585]">
      <span className="text-sm text-[#858585] font-bold">¥</span>
      <span className="text-sm text-[#858585] line-through">{originalPrice}</span>
    </div>
  </div>
);

export default ProductCard;
