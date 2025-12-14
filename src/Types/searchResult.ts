import type { Product } from "./product";


export interface SearchResult {  // 搜索结果
    products: Product[];  // 搜索到的商品列表
    totalCount: number;  // 搜索到的商品总数
    currentPage: number;  // 当前页码
    totalPages: number;   // 总页数
}