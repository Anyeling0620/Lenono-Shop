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
        deviceCheck?: boolean;
        _retry?: boolean;
        // 新增：标记是否是刷新token的请求，避免循环拦截
        isRefreshRequest?: boolean;
    }
}

export const EVENT_NAMES = {
    MULTI_LOGIN_WARNING: 'multi-login-warning',
    TOKEN_REFRESHED: 'token-refreshed',
    AUTH_EXPIRED: 'auth-expired'
} as const;

export type DeviceType = 'web' | 'mobile_web';

export interface DeviceInfo {
    device_id: string;
    device_type: DeviceType;
    device_name?: string;
    login_time: string;
    ip_address?: string;
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}

interface AuthResponse {
    access_token: string;
    multi_login_warning?: boolean;
}

class AxiosService {
    private instance: AxiosInstance;
    // 无拦截器的实例：仅用于刷新token、登出（避免循环拦截）
    private refreshInstance: AxiosInstance;
    private isRefreshing = false;
    private failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

    private deviceId: string;
    private deviceType: DeviceType;

    private localStorageKey = 'access_token';

    constructor() {
        this.deviceId = this.initDeviceId();
        this.deviceType = this.initDeviceType();

        const baseURL = this.getBaseURL();
        // 原有实例（带拦截器：处理普通API的令牌注入和401刷新）
        this.instance = axios.create({
            baseURL,
            timeout: 10000,
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
        });

        // 刷新token的实例（无拦截器：纯请求，避免触发401逻辑）
        this.refreshInstance = axios.create({
            baseURL,
            timeout: 10000,
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
        });

        // 初始化时从 localStorage 读取 token
        const token = localStorage.getItem(this.localStorageKey);
        if (token) this.setAccessToken(token);

        this.setupInterceptors();
    }

    // ========== token 管理 ==========
    public getAccessToken(): string | null {
        return localStorage.getItem(this.localStorageKey);
    }

    private setAccessToken(token: string | null) {
        if (token) {
            localStorage.setItem(this.localStorageKey, token);
        } else {
            localStorage.removeItem(this.localStorageKey);
        }
    }

    // ========== 基础信息 ==========
    private getBaseURL(): string {
        const baseUrl = (import.meta as any).env?.VITE_SERVER_API_BASE_URL;
        const port = (import.meta as any).env?.VITE_SERVER_API_PORT;
        if (baseUrl && port) return `${baseUrl}:${port}/api`;
        if (baseUrl) return `${baseUrl}/api`;
        return '/api';
    }

    private initDeviceId(): string {
        try {
            let deviceId = localStorage.getItem('device_id') || Cookie.get('device_id');
            console.log('did:', deviceId);

            if (!deviceId) {
                this.removeSecureCookie('device_id');
                deviceId = uuidv4();
                localStorage.setItem('device_id', deviceId);
                this.setSecureCookie('device_id', deviceId, 365 * 24 * 60 * 60);
            }
            return deviceId;
        } catch (error) {
            console.warn('设备ID持久化失败，使用临时ID:', error);
            return `temp_${uuidv4()}`;
        }
    }

    private initDeviceType(): DeviceType {
        const ua = navigator.userAgent.toLowerCase();
        return /mobile|android|ios|iphone|ipad/.test(ua) ? 'mobile_web' : 'web';
    }

    // ========== 拦截器 ==========
    private setupInterceptors() {
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                // 1. 设备信息注入（按需）
                if (config.deviceCheck) {
                    config.headers['X-Device-Id'] = this.deviceId;
                    config.headers['X-Device-Type'] = this.deviceType;
                    const uaPrefix = navigator.userAgent.slice(0, 40);
                    config.headers['X-Device-Name'] = `${uaPrefix} (${this.deviceType})`;
                }

                // 2. 令牌注入：无论是否是刷新请求，只要有令牌就携带（排除手动标记的刷新请求）
                if (!config.isRefreshRequest) {
                    const token = this.getAccessToken();
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        this.instance.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error: AxiosError) => {
                const originalRequest = (error.config || {}) as AxiosRequestConfig;

                // 核心逻辑：仅处理 普通API的401（排除刷新请求、已重试的请求）
                const is401 = error.response?.status === 401;
                const isRefreshReq = originalRequest.isRefreshRequest;
                const hasRetried = originalRequest._retry;

                if (is401 && !isRefreshReq && !hasRetried) {
                    // 场景1：普通API触发401，需要刷新token
                    if (this.isRefreshing) {
                        // 已有刷新请求在处理，加入队列等待
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject });
                        }).then((token) => {
                            // 队列执行：注入新token，重新请求
                            originalRequest.headers = originalRequest.headers || {};
                            (originalRequest.headers as any).Authorization = `Bearer ${token}`;
                            return this.instance(originalRequest);
                        }).catch((err) => Promise.reject(err));
                    }

                    // 标记为已重试，防止循环
                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    try {
                        console.log("普通API触发401，进入token刷新流程");
                        // 调用刷新token方法（使用无拦截器的实例）
                        const newToken = await this.refreshToken();
                        console.log("刷新token成功，新token：", newToken);

                        // 通知队列中的请求执行
                        this.onTokenRefreshed(newToken);

                        // 重新请求原接口：注入新token
                        originalRequest.headers = originalRequest.headers || {};
                        (originalRequest.headers as any).Authorization = `Bearer ${newToken}`;
                        return this.instance(originalRequest);
                    } catch (refreshError) {
                        console.log("刷新token失败，触发登出逻辑");
                        // 刷新失败：清空令牌、通知前端、拒绝队列请求
                        this.onTokenRefreshFailed();
                        const wrapError = refreshError instanceof Error
                            ? refreshError
                            : new Error('Token刷新失败', { cause: refreshError });
                        (wrapError as any).original = error;
                        return Promise.reject(wrapError);
                    }
                }

                // 场景2：非401/刷新请求/已重试的请求，直接拒绝
                return Promise.reject(error);
            }
        );
    }

    // ========== token 刷新（核心：使用无拦截器的实例） ==========
    private async refreshToken(): Promise<string> {
        try {
            // 发送刷新请求：标记为isRefreshRequest（避免拦截器处理），携带设备信息（如果后端需要）
            const response = await this.refreshInstance.post<ApiResponse<AuthResponse>>(
                API_PATHS.REFRESH_TOKEN,
                {},
                {
                    headers: {
                        'X-Device-Id': this.deviceId,
                        'X-Device-Type': this.deviceType,
                        // 手动标记：这是刷新请求，避免普通拦截器处理
                        'X-Is-Refresh-Request': 'true'
                    },
                    // 标记config：配合拦截器的isRefreshReq判断
                    isRefreshRequest: true
                }
            );

            const { access_token, multi_login_warning } = response.data.data;
            if (!access_token) {
                throw new Error('刷新接口未返回 access_token');
            }

            // 保存新token
            this.setAccessToken(access_token);

            // 多端登录提醒
            if (multi_login_warning) {
                toast('账号已在其他设备登录，请前往用户中心查看');
            }

            return access_token;
        } catch (error) {
            // 捕获刷新请求的所有错误（包括401/网络错误）
            const axiosError = error as AxiosError;
            let errorMsg = '刷新token失败';
            if (axiosError.response?.status === 401) {
                errorMsg = '登录状态已过期，请重新登录';
            } else if (axiosError.message) {
                errorMsg = `刷新token失败：${axiosError.message}`;
            }
            throw new Error(errorMsg, { cause: error });
        }
    }

    // ========== 刷新成功/失败的回调 ==========
    private onTokenRefreshed(token: string): void {
        // 执行队列中的所有请求，传入新token
        this.failedQueue.forEach(p => p.resolve(token));
        // 清空队列、重置状态
        this.failedQueue = [];
        this.isRefreshing = false;
        // 通知前端token已刷新
        window.dispatchEvent(new CustomEvent(EVENT_NAMES.TOKEN_REFRESHED));
    }

    private onTokenRefreshFailed(): void {
        // 拒绝队列中的所有请求
        this.failedQueue.forEach(p => p.reject(new Error('Token refresh failed')));
        // 清空队列、重置状态
        this.failedQueue = [];
        this.isRefreshing = false;

        // 清空本地令牌
        this.setAccessToken(null);
        // 通知前端登录过期
        window.dispatchEvent(new CustomEvent(EVENT_NAMES.AUTH_EXPIRED));

        // 登出请求：使用无拦截器的实例，避免触发401逻辑
        void this.refreshInstance.post(API_PATHS.LOGOUT_PATH, {}, {
            deviceCheck: false,
            isRefreshRequest: true
        });
    }

    // ========== Cookie 工具 ==========
    private setSecureCookie(name: string, value: string, maxAgeInSeconds: number): void {
        const isProd = (import.meta as any).env?.PROD;
        Cookie.set(name, value, {
            expires: new Date(Date.now() + maxAgeInSeconds * 1000),
            secure: Boolean(isProd),
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
            localStorage.removeItem('device_id');
        }
    }

    // ========== 公共方法 ==========
    public getInstance(): AxiosInstance {
        return this.instance;
    }

    public getCurrentDeviceInfo(): { deviceId: string; deviceType: DeviceType } {
        return { deviceId: this.deviceId, deviceType: this.deviceType };
    }

    public async login(loginInfo: { email: string; mode: string; password?: string; verificationCode?: string }): Promise<boolean> {
        if (!loginInfo.email) throw new Error('邮箱不能为空');
        if (loginInfo.mode === 'quick' && !loginInfo.verificationCode) throw new Error('验证码不能为空');
        if (loginInfo.mode === 'password' && !loginInfo.password) throw new Error('密码不能为空');

        const response = await this.instance.post<ApiResponse<AuthResponse>>(API_PATHS.LOGIN_PATH, {
            email: loginInfo.email,
            mode: loginInfo.mode,
            password: loginInfo.password,
            verification_code: loginInfo.verificationCode,
        }, { deviceCheck: true });

        const { access_token } = response.data.data;
        if (!access_token) throw new Error('登录成功，但未收到 access_token');

        this.setAccessToken(access_token);
        window.dispatchEvent(new CustomEvent(EVENT_NAMES.TOKEN_REFRESHED));
        return true;
    }

    public async register(registerInfo: { email: string; verificationCode: string; registerPassword: string; registerPasswordConfirm: string }): Promise<boolean> {
        const response = await this.instance.post<ApiResponse<AuthResponse>>(API_PATHS.REGISTER_PATH, {
            email: registerInfo.email,
            verify_code: registerInfo.verificationCode,
            password: registerInfo.registerPassword,
            password_confirm: registerInfo.registerPasswordConfirm,
        }, { deviceCheck: true });

        const { access_token } = response.data.data;
        if (!access_token) throw new Error('注册成功，但未返回 access_token');

        this.setAccessToken(access_token);
        window.dispatchEvent(new CustomEvent(EVENT_NAMES.TOKEN_REFRESHED));
        return true;
    }

    public async getLoginDevices(): Promise<DeviceInfo[]> {
        const res = await this.instance.get<ApiResponse<{ devices: DeviceInfo[] }>>(API_PATHS.LOGIN_DEVICES);
        return res.data.data.devices;
    }

    public async logoutDevice(deviceId: string): Promise<DeviceInfo> {
        console.log('开始登出指定设备：', deviceId);
        const res = await this.instance.post<ApiResponse<{ device: DeviceInfo }>>(API_PATHS.LOGOUT_DEVICE, { device_id: deviceId });
        console.log('登出指定设备成功');

        if (deviceId === this.deviceId) {
            this.onTokenRefreshFailed();
        }
        return res.data.data.device;
    }

    public async logoutOtherDevices(): Promise<DeviceInfo[]> {
        const res = await this.instance.post<ApiResponse<{ devices: DeviceInfo[] }>>(API_PATHS.LOGOUT_OTHER_DEVICES);
        // 刷新token（确保当前设备的token有效）
        await this.refreshToken();
        return res.data.data.devices;
    }

    public async forceLogout(): Promise<void> {
        // 强制登出：使用无拦截器的实例
        try {
            await this.refreshInstance.post(API_PATHS.LOGOUT_PATH, {}, {
                deviceCheck: false,
                isRefreshRequest: true
            });
        } finally {
            this.setAccessToken(null);
            window.dispatchEvent(new CustomEvent(EVENT_NAMES.AUTH_EXPIRED));
        }
    }
}

export const axiosService = new AxiosService();
export const axiosInstance = axiosService.getInstance();
export default axiosService;