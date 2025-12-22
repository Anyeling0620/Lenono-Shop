import type { CouponCenterListResponse, UserCouponListResponse, UserVoucherListResponse } from "../types/coupon";
import { API_PATHS } from "./apiPaths";
import { axiosInstance, type ApiResponse } from "./AxiosService";

export async function getCouponCenterService(): Promise<CouponCenterListResponse> {
    return (await axiosInstance.get<ApiResponse<CouponCenterListResponse>>(API_PATHS.GET_COUPONS)).data.data
}

export async function receiveCouponService(couponId: string): Promise<void> {
    await axiosInstance.post<ApiResponse<null>>(API_PATHS.RECEIVE_COUPON, { couponId })
    return
}

export async function getUserCouponsService(): Promise<UserCouponListResponse> {
    return (await axiosInstance.get<ApiResponse<UserCouponListResponse>>(API_PATHS.GET_USER_COUPONS)).data.data
}

export async function getVouchersService(): Promise<UserVoucherListResponse> {
    return (await axiosInstance.get<ApiResponse<UserVoucherListResponse>>(API_PATHS.GET_USER_VOUCHERS)).data.data
}

export async function getCouponsByProductService(productId:string):Promise<UserCouponListResponse> {
    return (await axiosInstance.get<ApiResponse<UserCouponListResponse>>(`${API_PATHS.GET_USER_COUPONS_BY_PRODUCTID}${productId}`)).data.data
}