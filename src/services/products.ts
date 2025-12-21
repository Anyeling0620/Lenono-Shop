import type { ProductEvaluationListResponse } from "../types/evaluation";
import type { SeckillRoundListResponse } from "../types/flashSale";
import type { SingleProductCardResponse, ProductType, ProductCardNewResponse, ProductCardIndexResponse } from "../types/product";
import type { SeckillProductDetailResponse, ShelfProductDetailResponse } from "../types/productComment";
import type { CartListResponse } from "../types/shopCard";
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


export async function getSeckillProductGroups() {
  const res = await axiosInstance.get<ApiResponse<SeckillRoundListResponse>>(`${API_PATHS.GET_SECKILL_PRODUCT}`)
  return res.data.data
}

export async function getProductEvaluations(productId: string): Promise<ProductEvaluationListResponse> {
  const res = await axiosInstance.get<ApiResponse<ProductEvaluationListResponse>>(
    API_PATHS.GET_PRODUCT_EVALATIONS({ productId })
  );
  return res.data.data;
}

export async function getShelfProductDetail(id: string): Promise<ShelfProductDetailResponse> {
  const res = await axiosInstance.get<ApiResponse<ShelfProductDetailResponse>>(
    API_PATHS.GET_PRODUCT_DETAIL_BY_SHELF({ id })
  );
  return res.data.data;
}


export async function getSeckillProductDetail(id: string, seckillId: string): Promise<SeckillProductDetailResponse> {
  const res = await axiosInstance.get<ApiResponse<SeckillProductDetailResponse>>(
    API_PATHS.GET_PRODUCT_DETAIL_BY_SECKILL({ id, seckillId })
  );
  return res.data.data;
}


export async function addToShoppingCartService(configId: string) {
  return await axiosInstance.post<ApiResponse<null>>(API_PATHS.ADD_SHOPPING_CART, {
    configId
  });
}


export async function getShopCardsService(): Promise<CartListResponse> {
  return (await axiosInstance.get<ApiResponse<CartListResponse>>(API_PATHS.GET_SHOPPING_CART)).data.data
}

