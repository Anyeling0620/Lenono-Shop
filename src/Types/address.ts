// 行政区划信息接口
export interface RegionInfo {
    code: string;
    name: string;
}

// 收货地址列表项接口
export interface UserAddressItem {
    id: string;
    userId: string;
    address: string;           // 详细地址
    receiver: string;          // 收货人
    phone: string;             // 联系电话
    isDefault: boolean;        // 是否默认地址
    createdAt: Date;
    updatedAt: Date;
    province: RegionInfo;      // 省份信息
    city: RegionInfo;          // 城市信息
    area: RegionInfo;          // 区县信息
    street: RegionInfo;        // 街道信息
}

// 服务函数返回类型
export interface UserAddressListResponse {
    list: UserAddressItem[];
}

export interface AddressPayload {
    provinceCode: string;
    cityCode: string;
    areaCode: string;
    streetCode: string;
    address: string;
    receiver: string;
    phone: string;
    isDefault?: boolean;
};
export interface AddAddressResponse {
    id: string;
}