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
    private isRefreshing = false;
    private failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

    private deviceId: string;
    private deviceType: DeviceType;

    private localStorageKey = 'access_token';

    constructor() {
        this.deviceId = this.initDeviceId();
        this.deviceType = this.initDeviceType();

        const baseURL = this.getBaseURL();
        this.instance = axios.create({
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
            console.log('did:',deviceId);
            
            if (!deviceId) {
                this.removeSecureCookie('device_id')
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
                if (config.deviceCheck) {
                    config.headers['X-Device-Id'] = this.deviceId;
                    config.headers['X-Device-Type'] = this.deviceType;
                    const uaPrefix = navigator.userAgent.slice(0, 40);
                    config.headers['X-Device-Name'] = `${uaPrefix} (${this.deviceType})`;
                }

                const token = this.getAccessToken();
                if (token) config.headers.Authorization = `Bearer ${token}`;

                return config;
            },
            (error) => Promise.reject(error)
        );

        this.instance.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error: AxiosError) => {
                const originalRequest = (error.config || {}) as AxiosRequestConfig;
                if (error.response?.status === 401 && !originalRequest._retry) {

                    if (this.isRefreshing) {
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject });
                        }).then((token) => {
                            originalRequest.headers = originalRequest.headers || {};
                            (originalRequest.headers as any).Authorization = `Bearer ${token}`;
                            return this.instance(originalRequest);
                        }).catch((err) => Promise.reject(err));
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    try {
                        const newToken = await this.refreshToken();
                        this.onTokenRefreshed(newToken);

                        originalRequest.headers = originalRequest.headers || {};
                        (originalRequest.headers as any).Authorization = `Bearer ${newToken}`;
                        return this.instance(originalRequest);
                    } catch (refreshError) {
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

    // ========== token 刷新 ==========
    private async refreshToken(): Promise<string> {
        const response = await this.instance.post(API_PATHS.REFRESH_TOKEN);
        const { access_token, multi_login_warning } = response.data.data;
        if (!access_token) throw new Error('刷新接口未返回 access_token');

        this.setAccessToken(access_token);

        if (multi_login_warning) {
            toast('账号已在其他设备登录，请前往用户中心查看');
        }

        return access_token;
    }

    private onTokenRefreshed(token: string): void {
        this.failedQueue.forEach(p => p.resolve(token));
        this.failedQueue = [];
        this.isRefreshing = false;
        window.dispatchEvent(new CustomEvent(EVENT_NAMES.TOKEN_REFRESHED));
    }

    private onTokenRefreshFailed(): void {
        this.failedQueue.forEach(p => p.reject(new Error('Token refresh failed')));
        this.failedQueue = [];
        this.isRefreshing = false;

        this.setAccessToken(null);
        window.dispatchEvent(new CustomEvent(EVENT_NAMES.AUTH_EXPIRED));


        void this.instance.post(API_PATHS.LOGOUT_PATH, {}, { deviceCheck: false });

    }

    // ========== Cookie ==========
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
        console.log('123');

        const res = await this.instance.post<ApiResponse<{ device: DeviceInfo }>>(API_PATHS.LOGOUT_DEVICE, { device_id: deviceId });
        console.log('234');

        if (deviceId === this.deviceId) this.onTokenRefreshFailed();
        return res.data.data.device;
    }


    public async logoutOtherDevices(): Promise<DeviceInfo[]> {
        const res = await this.instance.post<ApiResponse<{ devices: DeviceInfo[] }>>(API_PATHS.LOGOUT_OTHER_DEVICES);
        await this.refreshToken();
        return res.data.data.devices;
    }

    public async forceLogout(): Promise<void> {
        await this.instance.post(API_PATHS.LOGOUT_PATH, {}, { deviceCheck: false });
        this.setAccessToken(null);
        window.dispatchEvent(new CustomEvent(EVENT_NAMES.AUTH_EXPIRED));
    }
}

export const axiosService = new AxiosService();
export const axiosInstance = axiosService.getInstance();
export default axiosService;
