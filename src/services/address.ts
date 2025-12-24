import type { AddAddressResponse, AddressPayload, UserAddressListResponse } from "../types/address";
import { API_PATHS } from "./apiPaths";
import { type ApiResponse, axiosInstance } from "./AxiosService";



export async function getUserAddressList():Promise<UserAddressListResponse> {
    return (await axiosInstance.get<ApiResponse<UserAddressListResponse>>(API_PATHS.GET_ADDRESS_LIST)).data.data
}

// 添加地址
export async function addAddress(payload: AddressPayload): Promise<string> {
  const response = await axiosInstance.post<ApiResponse<AddAddressResponse>>(
    API_PATHS.ADD_ADDRESS,
    payload
  );
  return response.data.data.id;
}

// 更新地址
export async function updateAddress(addressId: string, payload: AddressPayload): Promise<void> {
  await axiosInstance.put<ApiResponse<null>>(
    API_PATHS.UPDATE_ADDRESS(addressId),
    payload
  );
}

// 删除地址
export async function removeAddress(addressId: string): Promise<void> {
  await axiosInstance.delete<ApiResponse<null>>(
    API_PATHS.REMOVE_ADDRESS(addressId)
  );
}

// 设置默认地址
export async function setDefaultAddress(addressId: string): Promise<void> {
  await axiosInstance.patch<ApiResponse<null>>(
    API_PATHS.SET_DEFAULT_ADDRESS(addressId)
  );
}




