
import { API_PATHS } from "./apiPaths";
import { axiosInstance, type ApiResponse } from "./axiosService";

/**
 * 账户信息接口
 */
interface AccountInfoFromApi {
    account: string;
    memberType: string;
    nickName?: string;
    birthday?: string | null;                 // ISO 日期字符串
    sex?: "man" | "woman" | "secret";
    email: string;
    avatarUrl?: string | null;
}

/**
 * 获取用户账户信息
 * 该函数异步请求并返回用户的账户详细信息
 * @returns {Promise<AccountInfoFromApi>} 返回一个Promise，解析为账户信息对象
 */
export async function getAccountInfo(): Promise<AccountInfoFromApi> {
    // 发起GET请求获取账户信息

    const res = await axiosInstance.get<ApiResponse<{ accountInfo: AccountInfoFromApi }>>(API_PATHS.USER_ACCOUNT_INFO);
    return res.data.data.accountInfo; // 从响应数据中提取并返回账户信息部分

}

/**
 * 更新用户信息
 * @param payload 包含用户信息的对象
 * @returns 返回API响应数据
 */
export async function updateAccountInfo(payload: {
    nickName: string;    // 用户昵称
    sex: "man" | "woman" | "secret";  // 用户性别，只能是'man'、'woman'或'secret'中的一个
    birthday: string; // ISO date string (YYYY-MM-DD)
}) {
    const res = await axiosInstance.post<ApiResponse<null>>(API_PATHS.USER_UPDATE_INFO, {
        nickname: payload.nickName,
        sex: payload.sex,
        birthday: payload.birthday,
    });
    return res.data;
}

/**
 * 
 * @param file 上传头像
 * @returns 返回头像url
 */
export async function uploadAvatar(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await axiosInstance.post<ApiResponse<{ url: string }>>(
        API_PATHS.USER_UPLOAD_AVATAR,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data.data.url;
}



interface UserInfo {
    userId: string;
    avatar: string;
    nikeName: string;
    memberType: string;
}
/**
 * 获取用户信息的异步函数
 * @returns {Promise<UserInfo>} 返回一个Promise，解析为用户信息对象
 */
export async function getUserInfo(): Promise<UserInfo> {
    // 发送GET请求获取登录用户信息
    const response = await axiosInstance.get<ApiResponse<{ userInfo: UserInfo }>>(API_PATHS.USER_LOGIN_INFO)
    // 从响应数据中提取并返回用户信息
    return response.data.data.userInfo;
}