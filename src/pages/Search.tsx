/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-26 21:07:25
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-28 00:13:04
 * @FilePath: \lenovo-shop\src\pages\Search.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
// pages/Search.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ConfigProvider, Pagination } from 'antd';
import ProductList from '../component/Search/ProductList';
import type { Product } from '../types/searchProduct';
import type { SearchResult } from '../types/searchResult';
import type { SearchFiltersType, SearchParams } from '../types/searchFilter';
import SearchFilters from '../component/Search/SearchFilters';

// 模拟数据
const mockProducts: Product[] = [
  {
    id: '1',
    name: '【张凌赫同款】联想小新Pad Pro 12.7英寸 影音娱乐办公学习游戏平板电脑 小青新',
    description: '天玑8300/Android 操作系统/8G/256G/WIFI/小青新',
    image: 'https://p1.lefile.cn/fes/cms/2025/11/27/1t6a7tcpivupglokxqyodd3ms2k4cv895742.w520.png',
    currentPrice: 1489,
    isDiscount: true,
    originalPrice: 2499,
    tags: {
      self: true,
      coupon: { money: 150 },
      custom: true,
      tradeIn: true,
      installment: { month: 12 }
    },
    link: '/product/1'
  },
  {
    id: '2',
    name: '【张凌赫同款】联想小新Pad Pro 12.7英寸 影音娱乐办公学习游戏平板电脑 小青新',
    description: '天玑8300/Android 操作系统/8G/256G/WIFI/小青新',
    image: 'https://p1.lefile.cn/fes/cms/2025/11/27/1t6a7tcpivupglokxqyodd3ms2k4cv895742.w520.png',
    currentPrice: 1489,
    isDiscount: true,
    originalPrice: 2499,
    tags: {
      self: true,
      coupon: { money: 150 },
      custom: true,
      tradeIn: true,
      installment: { month: 12 }
    },
    link: '/product/1'
  },
  {
    id: '3',
    name: '【张凌赫同款】联想小新Pad Pro 12.7英寸 影音娱乐办公学习游戏平板电脑 小青新',
    description: '天玑8300/Android 操作系统/8G/256G/WIFI/小青新',
    image: 'https://p1.lefile.cn/fes/cms/2025/11/27/1t6a7tcpivupglokxqyodd3ms2k4cv895742.w520.png',
    currentPrice: 1489,
    isDiscount: true,
    originalPrice: 2499,
    tags: {
      self: true,
      coupon: { money: 150 },
      custom: true,
      tradeIn: true,
      installment: { month: 12 }
    },
    link: '/product/1'
  },{
    id: '4',
    name: '【张凌赫同款】联想小新Pad Pro 12.7英寸 影音娱乐办公学习游戏平板电脑 小青新',
    description: '天玑8300/Android 操作系统/8G/256G/WIFI/小青新',
    image: 'https://p1.lefile.cn/fes/cms/2025/11/27/1t6a7tcpivupglokxqyodd3ms2k4cv895742.w520.png',
    currentPrice: 1489,
    isDiscount: true,
    originalPrice: 2499,
    tags: {
      self: true,
      coupon: { money: 150 },
      custom: true,
      tradeIn: true,
      installment: { month: 12 }
    },
    link: '/product/1'
  }
  ,{
    id: '5',
    name: '【张凌赫同款】联想小新Pad Pro 12.7英寸 影音娱乐办公学习游戏平板电脑 小青新',
    description: '天玑8300/Android 操作系统/8G/256G/WIFI/小青新',
    image: 'https://p1.lefile.cn/fes/cms/2025/11/27/1t6a7tcpivupglokxqyodd3ms2k4cv895742.w520.png',
    currentPrice: 1489,
    isDiscount: true,
    originalPrice: 2499,
    tags: {
      self: true,
      coupon: { money: 150 },
      custom: true,
      tradeIn: true,
      installment: { month: 12 }
    },
    link: '/product/1'
  },{
    id: '6',
    name: '【张凌赫同款】联想小新Pad Pro 12.7英寸 影音娱乐办公学习游戏平板电脑 小青新',
    description: '天玑8300/Android 操作系统/8G/256G/WIFI/小青新',
    image: 'https://p1.lefile.cn/fes/cms/2025/11/27/1t6a7tcpivupglokxqyodd3ms2k4cv895742.w520.png',
    currentPrice: 1489,
    isDiscount: true,
    originalPrice: 2499,
    tags: {
      self: true,
      coupon: { money: 150 },
      custom: true,
      tradeIn: true,
      installment: { month: 12 }
    },
    link: '/product/1'
  }
  ,{
    id: '7',
    name: '【张凌赫同款】联想小新Pad Pro 12.7英寸 影音娱乐办公学习游戏平板电脑 小青新',
    description: '天玑8300/Android 操作系统/8G/256G/WIFI/小青新',
    image: 'https://p1.lefile.cn/fes/cms/2025/11/27/1t6a7tcpivupglokxqyodd3ms2k4cv895742.w520.png',
    currentPrice: 1489,
    isDiscount: true,
    originalPrice: 2499,
    tags: {
      self: true,
      coupon: { money: 150 },
      custom: true,
      tradeIn: true,
      installment: { month: 12 }
    },
    link: '/product/1'
  },{
    id: '8',
    name: '【张凌赫同款】联想小新Pad Pro 12.7英寸 影音娱乐办公学习游戏平板电脑 小青新',
    description: '天玑8300/Android 操作系统/8G/256G/WIFI/小青新',
    image: 'https://p1.lefile.cn/fes/cms/2025/11/27/1t6a7tcpivupglokxqyodd3ms2k4cv895742.w520.png',
    currentPrice: 1489,
    isDiscount: true,
    originalPrice: 2499,
    tags: {
      self: true,
      coupon: { money: 150 },
      custom: true,
      tradeIn: true,
      installment: { month: 12 }
    },
    link: '/product/1'
  },{
    id: '9',
    name: '【张凌赫同款】联想小新Pad Pro 12.7英寸 影音娱乐办公学习游戏平板电脑 小青新',
    description: '天玑8300/Android 操作系统/8G/256G/WIFI/小青新',
    image: 'https://p1.lefile.cn/fes/cms/2025/11/27/1t6a7tcpivupglokxqyodd3ms2k4cv895742.w520.png',
    currentPrice: 1489,
    isDiscount: true,
    originalPrice: 2499,
    tags: {
      self: true,
      coupon: { money: 150 },
      custom: true,
      tradeIn: true,
      installment: { month: 12 }
    },
    link: '/product/1'
  },{
    id: '10',
    name: '【张凌赫同款】联想小新Pad Pro 12.7英寸 影音娱乐办公学习游戏平板电脑 小青新',
    description: '天玑8300/Android 操作系统/8G/256G/WIFI/小青新',
    image: 'https://p1.lefile.cn/fes/cms/2025/11/27/1t6a7tcpivupglokxqyodd3ms2k4cv895742.w520.png',
    currentPrice: 1489,
    isDiscount: true,
    originalPrice: 2499,
    tags: {
      self: true,
      coupon: { money: 150 },
      custom: true,
      tradeIn: true,
      installment: { month: 12 }
    },
    link: '/product/1'
  },{
    id: '11',
    name: '【张凌赫同款】联想小新Pad Pro 12.7英寸 影音娱乐办公学习游戏平板电脑 小青新',
    description: '天玑8300/Android 操作系统/8G/256G/WIFI/小青新',
    image: 'https://p1.lefile.cn/fes/cms/2025/11/27/1t6a7tcpivupglokxqyodd3ms2k4cv895742.w520.png',
    currentPrice: 1489,
    isDiscount: true,
    originalPrice: 2499,
    tags: {
      self: true,
      coupon: { money: 150 },
      custom: true,
      tradeIn: true,
      installment: { month: 12 }
    },
    link: '/product/1'
  },{
    id: '12',
    name: '【张凌赫同款】联想小新Pad Pro 12.7英寸 影音娱乐办公学习游戏平板电脑 小青新',
    description: '天玑8300/Android 操作系统/8G/256G/WIFI/小青新',
    image: 'https://p1.lefile.cn/fes/cms/2025/11/27/1t6a7tcpivupglokxqyodd3ms2k4cv895742.w520.png',
    currentPrice: 1489,
    isDiscount: true,
    originalPrice: 2499,
    tags: {
      self: true,
      coupon: { money: 150 },
      custom: true,
      tradeIn: true,
      installment: { month: 12 }
    },
    link: '/product/1'
  },{
    id: '13',
    name: '【张凌赫同款】联想小新Pad Pro 12.7英寸 影音娱乐办公学习游戏平板电脑 小青新',
    description: '天玑8300/Android 操作系统/8G/256G/WIFI/小青新',
    image: 'https://p1.lefile.cn/fes/cms/2025/11/27/1t6a7tcpivupglokxqyodd3ms2k4cv895742.w520.png',
    currentPrice: 1489,
    isDiscount: true,
    originalPrice: 2499,
    tags: {
      self: true,
      coupon: { money: 150 },
      custom: true,
      tradeIn: true,
      installment: { month: 12 }
    },
    link: '/product/1'
  }
];

const mockSearchProducts = async (params: SearchParams): Promise<SearchResult> => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 500));

  // 这里应该是实际的API调用
  return {
    products: mockProducts, // 实际的产品数据
    totalCount: mockProducts.length,
    currentPage: params.page,
    totalPages: Math.ceil(mockProducts.length / params.pageSize)
  };
};

const pageSizeConst = 12 

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // 用于分页查询
  const [loading, setLoading] = useState(false);
  const keyword = searchParams.get('q');  // 用于初次加载页面获取数据
  const [filters, setFilters] = useState<SearchFiltersType>({  // 用于筛选数据查询
    sortBy: 'recommend',
    priceOrder: 'desc',
    commentOrder: 'desc',
    inStock: false,
    priceRange: {},
    tabFilters: {
      self: false,
      discountCoupon: false,
      custom: false,
      installment: false,
      tradeIn: false
    },
    keyword: keyword || undefined,
  });

 // 执行搜索
  const performSearch = useCallback(async () => {
  setLoading(true);
  try {
    const searchParams: SearchParams = {
      ...filters,
      page: currentPage,
      pageSize: pageSizeConst
    };

    const result = await mockSearchProducts(searchParams);
    setSearchResult(result);
  } catch (error) {
    console.error('搜索失败:', error);
  } finally {
    setLoading(false);
  }
}, [filters]); // 添加依赖项

useEffect(() => {
  performSearch();
  return () => {
    setSearchResult(null);
  }
}, [keyword, filters, performSearch]); // 添加 performSearch 到依赖数组

  const handleFiltersChange = (newFilters: SearchFiltersType) => {  // 筛选条件变化时重新搜索
    setFilters(newFilters);
    setCurrentPage(1); // 重置到第一页
  };

  const handlePageChange = (page: number) => { // 分页查询
    setCurrentPage(page);
  };


  return (
    <div className='bg-[#efefef] '>
      <div className='h-1'></div>

      {/* 搜索筛选栏 */}
      <SearchFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalCount={ searchResult?.totalCount || 0}
      />

      {/* 商品列表 */}
      <ProductList
        products={searchResult?.products || []}
        loading={loading}
        currentPage={currentPage}
        pageSize={pageSizeConst}
      />

      {/* 分页 */}
      <ConfigProvider
        theme={{
          components: {
            Pagination: {
              itemActiveColor: "#e30000",
              itemActiveColorHover: "#dd6e6e",
              colorPrimary: "#e30000",
              colorPrimaryHover: "#dd6e6e",
            },
          },
        }}
      >
        <Pagination
          align='center'
          pageSize={pageSizeConst}
          current={currentPage}
          hideOnSinglePage={false} // 当总页数小于等于1时隐藏分页器
          className='py-10'
          onChange={handlePageChange}
          total={searchResult?.totalCount || 0}
          showSizeChanger={false} // 隐藏每页显示数量选择器
        />
      </ConfigProvider>
    </div>
  );
};

export default Search;
