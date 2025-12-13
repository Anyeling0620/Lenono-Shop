import type { ProductsResponse, ProductType } from "../types/searchProduct";
import { API_PATHS } from "./apiPaths";
import { type ApiResponse, axiosInstance } from "./axiosService";

export async function getProductList(type: ProductType) {
    const res = await axiosInstance.get<ApiResponse<ProductsResponse>>(`${API_PATHS.GET_PRODUCT}/${type}`)
    return res.data.data
}