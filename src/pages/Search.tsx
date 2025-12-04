/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-26 21:07:25
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-28 23:58:50
 * @FilePath: \lenovo-shop\src\pages\Search.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
// pages/Search.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ConfigProvider, Pagination } from 'antd';
import ProductList from '../component/Search/ProductList';
import type { Product } from '../types/searchProduct';
import type { SearchResult } from '../types/searchResult';
import type { SearchFiltersType, SearchParams } from '../types/searchFilter';
import SearchFilters from '../component/Search/SearchFilters';
import { useRequest } from 'ahooks';

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
    currentPage: params.page as number,
     totalPages: Math.ceil(mockProducts.length / (params.pageSize as number)),
  };
};

const pageSizeConst = 12 

/**
 * 搜索组件
 * 用于展示搜索页面，包含搜索筛选栏、商品列表和分页功能
 */
/**
 * 搜索页面组件
 * @component
 * @returns {JSX.Element} 搜索页面
 */
const Search: React.FC = () => {
  /**
   * 使用URLSearchParams获取URL中的搜索参数
   * @type {URLSearchParams}
   */
  const [searchParams] = useSearchParams();
  
  /**
   * 当前页码状态，用于分页查询
   * @type {number}
   */
  const [currentPage, setCurrentPage] = useState(1);
  
  /**
   * 从URL参数中获取的搜索关键词
   * @type {string | null}
   */
  const keyword = searchParams.get('q');
  
  /**
   * 搜索筛选条件状态
   * @type {SearchFiltersType}
   */
  const [filters, setFilters] = useState<SearchFiltersType>({
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

  /**
   * 使用useRequest管理搜索请求
   * @type {Object}
   * @property {Object} data - 搜索结果数据
   * @property {boolean} loading - 加载状态
   * @property {Function} run - 触发搜索的函数
   */
  const {
    data: searchResult,
    loading, 
    run: performSearch,
  } = useRequest(
    async (searchFilters: SearchFiltersType) => {
      const searchParams: SearchParams = {
        ...searchFilters,
        pageSize: pageSizeConst
      };
      return await mockSearchProducts(searchParams);
    },
    {
      manual: true,
      debounceWait: 300,
      debounceLeading: true,
    }
  );
  
  /**
   * 初始搜索和关键词变化时的副作用
   */
  useEffect(() => {
    if (keyword) {
      const newFilters = { ...filters, keyword:keyword };
      performSearch(newFilters);
    }
  }, [filters, keyword, performSearch]);

  /**
   * 筛选条件变化时的副作用
   */
  useEffect(() => {
    performSearch(filters);
  }, [filters, performSearch]);

  /**
   * 处理筛选条件变化的函数
   * @param {SearchFiltersType} newFilters - 新的筛选条件
   */
  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  /**
   * 处理分页变化的函数
   * @param {number} page - 新的页码
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className='bg-[#efefef] '>

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
          hideOnSinglePage={false}
          className='py-10'
          onChange={handlePageChange}
          total={searchResult?.totalCount || 0}
          showSizeChanger={false}
        />
      </ConfigProvider>
    </div>
  );
};

export default Search;
