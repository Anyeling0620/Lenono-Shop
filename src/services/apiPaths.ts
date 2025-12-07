export const API_PATHS = {
    REFRESH_TOKEN: '/auth/refresh',
    LOGIN_DEVICES: '/auth/devices',
    LOGOUT_DEVICE: '/auth/logout-device',
    LOGOUT_OTHER_DEVICES: '/auth/logout-other-devices',
    LOGIN_PATH: '/auth/login',
    REGISTER_PATH: '/auth/register',
    LOGOUT_PATH: '/auth/logout' ,

    USER_ACCOUNT_INFO: '/user/account-info',
    USER_UPDATE_INFO: '/user/update-info',
    USER_UPLOAD_AVATAR: '/user/upload-avatar',
    USER_LOGIN_INFO: '/user/login-user-info'
} as const;

