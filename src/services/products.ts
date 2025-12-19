import type { SingleProductCardResponse, ProductType, ProductCardNewResponse, ProductCardIndexResponse } from "../types/product";
import { API_PATHS } from "./apiPaths";
import { type ApiResponse, axiosInstance } from "./AxiosService";

export async function getProductList(type: ProductType) {
    const res = await axiosInstance.get<ApiResponse<SingleProductCardResponse>>(`${API_PATHS.GET_PRODUCT}/${type}`)
    return res.data.data
}


export async function getNewProductGroups() {
    const res = await axiosInstance.get<ApiResponse<ProductCardNewResponse>>(`${API_PATHS.GET_NEW_PRODUCT_GROUPS}`)
    return res.data.data
}

export async function getIndexProductGroups() {
    const res = await axiosInstance.get<ApiResponse<ProductCardIndexResponse>>(`${API_PATHS.GET_INDEX_PRODUCT}`)
    return res.data.data
}
