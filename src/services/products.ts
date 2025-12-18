import type { ProductsResponse, ProductType } from "../types/product";
import { API_PATHS } from "./apiPaths";
import { type ApiResponse, axiosInstance } from "./AxiosService";

export async function getProductList(type: ProductType) {
    const res = await axiosInstance.get<ApiResponse<ProductsResponse>>(`${API_PATHS.GET_PRODUCT}/${type}`)
    return res.data.data
}

export async function getNewProductList() {
    const res = await axiosInstance.get<ApiResponse<ProductsResponse[]>>(`${API_PATHS.GET_NEW_PRODUCT}`)
    return res.data.data
}

export async function getIndexProductList() {
    const res = await axiosInstance.get<ApiResponse<ProductsResponse[]>>(`${API_PATHS.GET_INDEX_PRODUCT}`)
    return res.data.data
}

