
import React from 'react';
import { Link } from 'react-router-dom';
import Tag from '../Search/Tag';
import type { ProductItem } from '../../types/product';



interface ProductCardProps {
    product: ProductItem;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <li className='w-[290px] h-[385px] bg-white hover:shadow-lg transition-all duration-300'>
            <div className='px-4 py-4'>
                <Link to={`/product/${product.productId}&default=${product.configId}`} className='cursor-pointer' target={product.productId}>
                        <div className='overflow-hidden w-[250px] h-[180px] mx-auto border-b-[1px] border-[#e0e0e0] flex items-center justify-center'>
                            <img
                                className='w-[160px] h-[160px] object-contain'
                                src={product.mainImage as string}
                            />
                        </div>

                        {/* 商品名称 */}
                        <div className='leading-4 px-1 h-[36px] mt-[10px] text-left text-[#424242]'>
                            <span className='text-[13px] line-clamp-2'>
                                {product.productName}
                            </span>
                        </div>

                        {/* 商品描述 */}
                        <div className='h-9 px-1 leading-4 overflow-hidden mt-1.5 text-left text-[#cfcfcf] text-[12px] line-clamp-2'>
                            {product.description}
                        </div>

                        {/* 价格信息 */}
                        <div className='flex items-center mt-1 px-1'>
                            <div className='font-bold h-[30px] flex text-[14px] text-red-500 items-center'>
                                <span>{product.hasCoupon && "到手价"}￥{product.minPrice}</span>
                            </div>
                            {product.hasCoupon && <div className='text-[12px] text-[#979797] mt-0.5 ml-[3px] line-through'>
                                <span>￥{product.originalPrice}</span>
                            </div>}
                        </div>

                        {/* 标签区域 */}
                        <div className='min-h-[30px] leading-[30px] overflow-hidden flex items-center flex-wrap'>
                            {product.isSelfOperated && <Tag type="self" />}
                            {product.hasCoupon && <Tag type="coupon" money={product.couponInfo?.type ==='CASH'? product.couponInfo.value : (1-product.couponInfo!.value)*product.originalPrice!} />}
                            {product.isCustomizable && <Tag type="custom" />}
                            {product.supportInstallment && <Tag type="tradeIn" />}
                            {product.supportInstallment && <Tag type="installment" month={product.installmentNum!} />}
                        </div>
                    </Link>
            </div>
        </li>
    );
};

export default ProductCard;
