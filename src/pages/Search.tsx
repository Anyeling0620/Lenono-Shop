
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ConfigProvider, Pagination } from 'antd';
import ProductList from '../component/Search/ProductList';
import type { SearchFiltersType } from '../types/searchFilter';
import SearchFilters from '../component/Search/SearchFilters';
import { useRequest } from 'ahooks';
import type { SingleProductCardResponse } from '../types/product';
import { type ApiResponse, axiosInstance } from '../services/AxiosService';
import { API_PATHS } from '../services/apiPaths';



const getSearchProductCards = async (params: SearchFiltersType): Promise<SingleProductCardResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // 添加await
  console.log(params);
  
  const response = await axiosInstance.get<ApiResponse<SingleProductCardResponse>>(API_PATHS.GET_SEARCH_PRODUCT, { params: params });
  return response.data.data
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
  const time = searchParams.get('t');
  
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
      return await getSearchProductCards(searchFilters);
    },
    {
      manual: true,
      debounceWait: 500,
      debounceLeading: true,
    }
  );
  

   const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * 初始搜索和关键词变化时的副作用
   */
  useEffect(() => {
    if (keyword) {
      const newFilters = { ...filters, keyword:keyword };
      performSearch(newFilters);
      scrollToTop();
    }
  }, [filters, keyword, performSearch,time]);

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
    scrollToTop();
  };

 
  /**
   * 处理分页变化的函数
   * @param {number} page - 新的页码
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToTop();
  };

  return (
    <div className='bg-[#efefef] '>

      {/* 搜索筛选栏 */}
      <SearchFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalCount={ searchResult?.items.length || 0}
      />

      {/* 商品列表 */}
      <ProductList
        products={searchResult?.items || []}
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
          total={searchResult?.items.length}
          showSizeChanger={false}
        />
      </ConfigProvider>
    </div>
  );
};

export default Search;
