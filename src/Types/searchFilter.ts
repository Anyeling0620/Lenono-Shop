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

