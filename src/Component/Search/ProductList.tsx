/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-27 16:00:29
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-27 19:53:11
 * @FilePath: \lenovo-shop\src\component\Search\ProductList.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
// components/Search/ProductList.tsx
import React from 'react';
import ProductCard from './ProductCard';
import type { Product } from '../../types/product';
import { Empty } from 'antd';


interface ProductListProps {
  products: Product[];
  loading: boolean;
  pageSize: number;
  currentPage: number;
}

const ProductList: React.FC<ProductListProps> = ({ products, loading, pageSize, currentPage }) => {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  if (loading) {
    return (
      <div className='w-[1200px] h-auto grid grid-cols-4 gap-3 mx-auto text-sm pt-3'>
        {Array.from({ length: pageSize }).map((_, index) => (
          <div key={index} className='w-[290px] h-[385px] bg-white animate-pulse'>
            <div className='mx-auto w-[250px] py-6'>
              <div className='w-[250px] h-[180px] bg-gray-100 rounded'></div>
              <div className='w-[250px] h-[40px] bg-gray-100 rounded mt-3'></div>
              <div className='w-[250px] h-[40px] bg-gray-100 rounded mt-3'></div>
              <div className='w-[250px] h-[40px] bg-gray-100 rounded mt-3'></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0 || !products) {
    return (<Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      className='h-[65vh] pt-[250px] align-middle mx-auto'
      description='暂无商品'
    />)
  };

  return (
    <ul className='w-[1200px] h-auto grid grid-cols-4 gap-3 mx-auto text-sm pt-3'>
      {products.slice(startIndex, endIndex).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ul>
  );
};

export default ProductList;
