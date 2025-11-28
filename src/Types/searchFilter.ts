/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-27 20:26:40
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-28 23:23:25
 * @FilePath: \lenovo-shop\src\types\searchFilter.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
export interface TabFilters {
  self: boolean,
  discountCoupon: boolean,
  custom: boolean,
  installment: boolean,
  tradeIn: boolean
}

export interface SearchFiltersType {
    // 排序相关
    sortBy: 'recommend' | 'new' | 'comment' | 'price';
    priceOrder?: 'asc' | 'desc',
    commentOrder?: 'asc' | 'desc',
    // 筛选相关
    inStock: boolean; // 是否只显示有库存的商品
    priceRange: PriceRange; // 价格范围
    tabFilters: TabFilters; // 筛选标签
    keyword: string | undefined; // 搜索关键词
}

export interface PriceRange {  // 价格范围
    min?: number;
    max?: number;
}

export interface SearchParams extends SearchFiltersType {
    page?: number;   // 当前页码
    pageSize?: number;  // 每页显示数量
}
