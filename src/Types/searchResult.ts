import type { Product } from "./searchProduct";

/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-27 15:51:37
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-27 19:39:45
 * @FilePath: \lenovo-shop\src\types\searchResult.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
export interface SearchResult {  // 搜索结果
    products: Product[];  // 搜索到的商品列表
    totalCount: number;  // 搜索到的商品总数
    currentPage: number;  // 当前页码
    totalPages: number;   // 总页数
}