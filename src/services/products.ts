import type { SingleProductCardResponse, ProductType } from "../types/product";
import { API_PATHS } from "./apiPaths";
import { type ApiResponse, axiosInstance } from "./AxiosService";

export async function getProductList(type: ProductType) {
    const res = await axiosInstance.get<ApiResponse<SingleProductCardResponse>>(`${API_PATHS.GET_PRODUCT}/${type}`)
    return res.data.data
}

