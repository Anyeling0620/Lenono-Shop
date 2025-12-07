/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
    AxiosError
} from "axios";
import axios from "axios";
import Cookie from 'js-cookie';
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';
import { API_PATHS } from "./apiPaths";

declare module 'axios' {
    interface AxiosRequestConfig {
        deviceCheck?: boolean; // check device in header
        _retry?: boolean;
    }
}

export const EVENT_NAMES = {
    MULTI_LOGIN_WARNING: 'multi-login-warning',   // 多设备登陆警告
    TOKEN_REFRESHED: 'token-refreshed',           // 令牌刷新事件名称
    AUTH_EXPIRED: 'auth-expired'                    // 令牌过期事件名称
} as const;


export type DeviceType = 'web' | 'mobile_web';

export interface DeviceInfo {
    device_id: string;
    device_type: DeviceType;
    device_name?: string;
    login_time: string;
    ip_address?: string;
}

export type MultiLoginError =
    | 'REFRESH_TOKEN_EXPIRED'
    | 'DEVICE_NOT_AUTHORIZED';


export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}

interface AuthResponse {
    access_token: string;
    multi_login_warning?: boolean;
}

/**
 * AxiosService - access_token in memory, refresh_token as HttpOnly cookie
 *
 * IMPORTANT:
 * - Server must set refresh_token via Set-Cookie with HttpOnly flag.
 * - All requests that should carry refresh_token cookie must use withCredentials = true.
 */
class AxiosService {
    private instance: AxiosInstance;
    private isRefreshing = false;
    private failedQueue: Array<{
        resolve: (value?: unknown) => void;
        reject: (reason?: any) => void;
    }> = [];
    private accessToken: string | null = null; // access_token stored in memory only
    private deviceId: string;
    private deviceType: DeviceType;

    constructor() {
        this.deviceId = this.initDeviceId();
        this.deviceType = this.initDeviceType();

        const baseURL = this.getBaseURL();

        this.instance = axios.create({
            baseURL,
            timeout: 10000,
            withCredentials: true, // 必须：让浏览器自动携带 HttpOnly refresh_token Cookie
            headers: {
                'Content-Type': 'application/json',
            }
        });

        this.setupInterceptors();
    }

    private getBaseURL(): string {
        const baseUrl = (import.meta as any).env?.VITE_SERVER_API_BASE_URL;
        const port = (import.meta as any).env?.VITE_SERVER_API_PORT;
        // 容错：如果没有 port 就不拼冒号
        if (baseUrl && port) {
            return `${baseUrl}:${port}/api`;
        }
        if (baseUrl) return `${baseUrl}/api`;
        return '/api';
    }

    private initDeviceId(): string {
        try {
            let deviceId = localStorage.getItem('device_id') || Cookie.get('device_id');
            if (!deviceId) {
                deviceId = uuidv4();
                localStorage.setItem('device_id', deviceId);
                // device_id 可以用可读 Cookie 存储（方便后端或跨子域读取）
                this.setSecureCookie('device_id', deviceId, 365 * 24 * 60 * 60);
            }
            return deviceId;
        } catch (error) {
            console.warn('设备ID持久化失败，使用临时ID:', error);
            return `temp_${uuidv4()}`;
        }
    }

    private initDeviceType(): DeviceType {
        const userAgent = navigator.userAgent.toLowerCase();
        return /mobile|android|ios|iphone|ipad/.test(userAgent) ? 'mobile_web' : 'web';
    }

    private setupInterceptors() {
        // 请求拦截器：将内存 access token 插入 Authorization
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                if (config.deviceCheck) {  // 如果需要检查设备，则加入设备信息
                    config.headers['X-Device-Id'] = this.deviceId;
                    config.headers['X-Device-Type'] = this.deviceType;
                    const uaPrefix = navigator.userAgent.slice(0, 40);
                    config.headers['X-Device-Name'] = `${uaPrefix} (${this.deviceType})`;
                }

                if (this.accessToken) {
                    config.headers.Authorization = `Bearer ${this.accessToken}`;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        // 响应拦截器：处理 401、刷新 token、队列等
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error: AxiosError) => {
                const originalRequest = (error.config || {}) as AxiosRequestConfig;
                // 处理401且未重试
                if (error.response?.status === 401 && !originalRequest._retry) {


                    if (this.isRefreshing) {
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject });
                        }).then((token) => {
                            // retry original request with new token
                            originalRequest.headers = originalRequest.headers || {};
                            (originalRequest.headers as any).Authorization = `Bearer ${token}`;
                            return this.instance(originalRequest);
                        }).catch((err) => Promise.reject(err));
                    }

                    // 尝试刷新 token
                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    try {
                        const newToken = await this.refreshToken();
                        this.onTokenRefreshed(newToken);

                        originalRequest.headers = originalRequest.headers || {};
                        (originalRequest.headers as any).Authorization = `Bearer ${newToken}`;
                        return this.instance(originalRequest);
                    } catch (refreshError) {
                        // refresh 失败：根据后端返回判断原因
                        //const axiosError = refreshError as AxiosError<ApiResponse<null>>;
                        //const refreshErrData = axiosError?.response?.data as ApiResponse<null> | undefined;


                        this.onTokenRefreshFailed();


                        const wrapError = refreshError instanceof Error
                            ? refreshError
                            : new Error('Token刷新失败', { cause: refreshError });
                        (wrapError as any).original = error;
                        return Promise.reject(wrapError);
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    /**
     * 刷新 access_token
     * 说明：不从前端读取 refresh_token（HttpOnly），直接请求后端 refresh 接口，后端从 Cookie 中读取 refresh_token。
     */
    private async refreshToken(): Promise<string> {
        // 向后端发起刷新请求 - 后端需从 HttpOnly cookie 中读取 refresh_token
        const response = await this.instance.post(
            API_PATHS.REFRESH_TOKEN,
        );

        const { access_token, multi_login_warning } = response.data.data;

        if (!access_token) {
            throw new Error('刷新接口未返回 access_token');
        }

        // 将 access_token 仅保存到内存
        this.accessToken = access_token;


        if (multi_login_warning) {
            toast('账号已在其他设备登录，请前往用户中心查看');
        }

        return access_token;
    }



    private onTokenRefreshed(token: string): void {
        this.failedQueue.forEach((promise) => promise.resolve(token));
        this.failedQueue = [];
        this.isRefreshing = false;

        console.log("[AxiosService] Token refreshed, notifying listeners");
        window.dispatchEvent(new CustomEvent(EVENT_NAMES.TOKEN_REFRESHED)); // 通知其他组件 token 已刷新
    }

    /**
     * 处理token刷新失败的方法
     * 当token刷新失败时，会执行清理工作并重定向到登录页面
     */
    private onTokenRefreshFailed(): void {
        // 遍历失败队列，对所有等待的promise执行reject操作，并传入错误信息
        this.failedQueue.forEach((promise) => promise.reject(new Error('Token refresh failed')));
        this.failedQueue = [];
        this.isRefreshing = false;

        // 清除内存token
        this.accessToken = null;
        window.dispatchEvent(new CustomEvent(EVENT_NAMES.AUTH_EXPIRED))

        // 推荐让后端清理 HttpOnly refresh_token cookie（调用 /auth/logout）
        try {
            // 发起一次告知后端清除 refresh cookie 的请求（不一定成功）
            void this.instance.post(API_PATHS.LOGOUT_PATH, {}, { deviceCheck: false });
        } catch (e) {
            // ignore
            console.log(e);
        }

        // 重定向到登录
        //window.location.href = '/login';
    }

    // ========== Cookie Helpers ==========
    private setSecureCookie(name: string, value: string, maxAgeInSeconds: number): void {
        const isProduction = (import.meta as any).env?.PROD;
        Cookie.set(name, value, {
            expires: new Date(Date.now() + maxAgeInSeconds * 1000),
            secure: Boolean(isProduction),
            sameSite: 'strict',
            path: '/'
        });
    }

    private removeSecureCookie(name: string): void {
        Cookie.remove(name, {
            path: '/',
            secure: Boolean((import.meta as any).env?.PROD),
            sameSite: 'strict'
        });

        if (name === 'device_id') {
            try {
                localStorage.removeItem('device_id');
            } catch (error) {
                console.warn('移除设备ID失败:', error);
            }
        }
    }

    // ========== 公共 API 方法 ==========

    public async getLoginDevices(): Promise<DeviceInfo[]> {
        try {
            const response = await this.instance.get<ApiResponse<{ devices: DeviceInfo[] }>>(API_PATHS.LOGIN_DEVICES, {});
            console.log(response.data);
            const { devices } = response.data.data;
            return devices;
        } catch (error) {
            const errMsg = (error as AxiosError<ApiResponse<null>>)?.response?.data?.message || '获取登录设备列表失败，请检查网络状态';
            console.error('获取登录设备列表失败:', error);
            throw new Error(errMsg);
        }
    }


    public async logoutDevice(deviceId: string): Promise<DeviceInfo> {
        try {
            const response = await this.instance.post<ApiResponse<{ device: DeviceInfo }>>(API_PATHS.LOGOUT_DEVICE, {
                device_id: deviceId,  // 目标设备ID
            });
            if (deviceId === this.deviceId) {
                // 当前设备被登出：清理 front-end 状态
                this.onTokenRefreshFailed();
                window.dispatchEvent(new CustomEvent(EVENT_NAMES.AUTH_EXPIRED));
            }
            const { device } = response.data.data;
            return device;
        } catch (error) {
            const errMsg = (error as AxiosError<ApiResponse<null>>)?.response?.data?.message || '登出指定设备失败，请检查网络状态';
            console.error('登出指定设备失败:', errMsg, error);
            throw new Error(errMsg);
        }
    }

    public async logoutOtherDevices(): Promise<DeviceInfo[]> {
        try {
            const response = await this.instance.post<ApiResponse<{ devices: DeviceInfo[] }>>(
                API_PATHS.LOGOUT_OTHER_DEVICES,
            );
            try {
                await this.refreshToken();
            } catch (e) {
                // refresh 失败时按失败处理
                console.warn('刷新 token 失败（登出其他设备后）:', e);
            }
            const { devices } = response.data.data;
            return devices;
        } catch (error) {
            const errMsg = (error as AxiosError<ApiResponse<null>>)?.response?.data?.message || '登出其他设备失败，请检查网络状态';
            console.error('登出其他设备失败:', errMsg, error);
            throw new Error(errMsg);
        }
    }

    /**
     * 登录：后端应在 Set-Cookie 中设置 HttpOnly refresh_token
     * 前端仅接收并把 access_token 放入内存
     */
    public async login(loginInfo: {
        email: string;
        mode: string;
        password?: string;
        verificationCode?: string;
    }): Promise<boolean> {
        if (!loginInfo.email) throw new Error('邮箱不能为空');
        if (loginInfo.mode === 'quick' && !loginInfo.verificationCode) throw new Error('验证码不能为空');
        if (loginInfo.mode === 'password' && !loginInfo.password) throw new Error('密码不能为空');

        try {
            const response = await this.instance.post<ApiResponse<AuthResponse>>(
                API_PATHS.LOGIN_PATH,
                {
                    email: loginInfo.email,
                    mode: loginInfo.mode,
                    password: loginInfo.password,
                    verification_code: loginInfo.verificationCode,
                }, {
                deviceCheck: true,
            }
            );
            console.log(response.data);
            const { access_token } = response.data.data;
            if (!access_token) {
                throw new Error('登录成功，但未收到 access_token');
            }
            this.accessToken = access_token;
            window.dispatchEvent(new CustomEvent(EVENT_NAMES.TOKEN_REFRESHED))
            return true;
        } catch (error) {
            const errMsg = (error as AxiosError<ApiResponse<null>>)?.response?.data?.message || '登录失败，请检查账号信息或网络状态';
            console.error('登录失败:', errMsg, error);
            throw new Error(errMsg);
        }
    }

    /**
     * 注册：后端同样应在 Set-Cookie 中设置 HttpOnly refresh_token
     */
    public async register(registerInfo: {
        email: string;
        verificationCode: string;
        registerPassword: string;
        registerPasswordConfirm: string;
    }): Promise<boolean> {
        if (!registerInfo.email) throw new Error('注册邮箱不能为空');
        if (!registerInfo.verificationCode) throw new Error('验证码不能为空');
        if (!registerInfo.registerPassword) throw new Error('密码不能为空');
        if (registerInfo.registerPassword.length < 6) throw new Error('密码长度不能少于6位');
        if (registerInfo.registerPassword !== registerInfo.registerPasswordConfirm) throw new Error('两次输入的密码不一致，请重新输入');

        try {
            const response = await this.instance.post<ApiResponse<AuthResponse>>(
                API_PATHS.REGISTER_PATH,
                {
                    email: registerInfo.email,
                    verify_code: registerInfo.verificationCode,
                    password: registerInfo.registerPassword,
                    password_confirm: registerInfo.registerPasswordConfirm,
                },
                {
                    deviceCheck: true,
                }
            );
            console.log(response.data);
            const { access_token } = response.data.data;

            if (!access_token) {
                throw new Error('注册成功，但未返回 access_token');
            }

            this.accessToken = access_token;
            window.dispatchEvent(new CustomEvent(EVENT_NAMES.TOKEN_REFRESHED))

            return true
        } catch (error) {
            const errMsg = (error as AxiosError<ApiResponse<null>>)?.response?.data?.message || '注册失败，请检查信息或稍后重试';
            console.error('注册失败:', errMsg, error);
            throw new Error(errMsg);
        }
    }

    public getCurrentDeviceInfo(): { deviceId: string; deviceType: DeviceType } {
        return {
            deviceId: this.deviceId,
            deviceType: this.deviceType
        };
    }

    public getInstance(): AxiosInstance {
        return this.instance;
    }

    /**
     * 获取访问令牌(accessToken)的方法
     * @returns 返回当前存储的访问令牌，如果不存在则返回null
     */
    public getAccessToken(): string | null {
        return this.accessToken; // 返回类中存储的accessToken属性值
    }

    /**
     * 强制登出：调用后端 logout 接口，后端负责清除 HttpOnly refresh_token cookie
     * 前端清理内存的 access_token、device_id（可选）
     */
    public async forceLogout(): Promise<void> {
        try {
            await this.instance.post(API_PATHS.LOGOUT_PATH, {}, { deviceCheck: false });
            window.dispatchEvent(new CustomEvent(EVENT_NAMES.AUTH_EXPIRED));
        } catch (e) {
            // 忽略错误，仍继续前端清理
            console.warn('调用登出接口失败:', e);
            const errMsg = (e as AxiosError<ApiResponse<null>>)?.response?.data?.message;
            if (errMsg) {
                throw new Error(errMsg);
            } else throw e;
        } finally {
            this.accessToken = null;
            this.removeSecureCookie('device_id')
            window.dispatchEvent(new CustomEvent(EVENT_NAMES.AUTH_EXPIRED));
            //window.location.href = '/login';
        }
    }
}

export const axiosService = new AxiosService();
export const axiosInstance = axiosService.getInstance();
export default axiosService;
