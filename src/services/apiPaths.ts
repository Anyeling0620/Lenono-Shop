export const API_PATHS = {
    REFRESH_TOKEN: '/auth/refresh',
    LOGIN_DEVICES: '/auth/devices',
    LOGOUT_DEVICE: '/auth/logout-device',
    LOGOUT_OTHER_DEVICES: '/auth/logout-other-devices',
    LOGIN_PATH: '/auth/login',
    REGISTER_PATH: '/auth/register',
    LOGOUT_PATH: '/auth/logout',
    SEND_VERIFICATION_CODE: '/send-verification-code',

    USER_ACCOUNT_INFO: '/user/account-info',
    USER_UPDATE_INFO: '/user/update-info',
    USER_UPLOAD_AVATAR: '/user/upload-avatar',
    USER_LOGIN_INFO: '/user/login-user-info',
    USER_CHANGE_EMAIL: '/user/change-email',
    USER_CHANGE_PASSWORD: '/user/change-password',

    GET_PRODUCT: '/products/product-cards',
    GET_NEW_PRODUCT_GROUPS: '/products/new-product-cards',
    GET_INDEX_PRODUCT: '/products/index-product-cards',
    GET_SECKILL_PRODUCT: '/products/seckill-product-cards',
    GET_SEARCH_PRODUCT: '/products/search-product-cards',

    GET_PRODUCT_EVALATIONS: (params: { productId: string }) => `/products/${params.productId}/evaluations`,
    GET_PRODUCT_DETAIL_BY_SHELF: (params: { id: string }) => `/products/shelf-products/${params.id}/detail`,
    GET_PRODUCT_DETAIL_BY_SECKILL: (params: { id: string; seckillId: string }) => `/products/seckill-products/${params.seckillId}/${params.id}/detail`,
    EVALUATION_LIKE: (id: string) => `/products/evaluations/${id}/like`,

    ADD_SHOPPING_CART: '/user/add-shopping-card',
    GET_SHOPPING_CART: '/user/shopping-cards',

    GET_COUPONS: '/products/coupon-center/coupons',
    RECEIVE_COUPON:'/user/coupon-center/claim',
    GET_USER_COUPONS:'/user/coupons',
    GET_USER_VOUCHERS:'/user/vouchers',


    // 地址管理相关路由
    ADD_ADDRESS: '/user/add-address',
    UPDATE_ADDRESS: (addressId: string) => `/user/update-address/${addressId}`,
    REMOVE_ADDRESS: (addressId: string) => `/user/remove-address/${addressId}`,
    GET_ADDRESS_LIST: '/user/address-list',
    SET_DEFAULT_ADDRESS: (addressId: string) => `/user/set-default/${addressId}`,
} as const;