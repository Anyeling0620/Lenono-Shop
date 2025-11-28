import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import Cookie from 'js-cookie';

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;  // 是否重试
}

interface RefreshTokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;    // token 过期时间
}

class AxiosService {
    private instance: AxiosInstance;
    private isRefreshing = false;  // 是否正在刷新 token
    private failedQueue: Array<{
        resolve: (value?: unknown) => void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        reject: (reason?: any) => void;
    }> = [];  // 存储失败的请求

    constructor() {
        this.instance = axios.create({
            baseURL: `${import.meta.env.VITE_SERVER_API_BASE_URL}:${import.meta.env.VITE_SERVER_API_PORT}/api`,
            timeout: 10000, // 请求超时时间
            headers: {     // 默认请求头
                'Content-Type': 'application/json',
            }
        })
        this.setupInterceptors();
    }
    private setupInterceptors() {
        // 请求拦截器
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {  // 
                const token = Cookie.get('access_token')  // 获取 token
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`  // 设置请求头
                }
                return config;
            },
            (error) => {
                return Promise.reject(error)  // 请求错误时抛出错误
            }
        )
        // 响应拦截器
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => {
                return response  // 响应成功时返回数据
            },
            async (error) => {
                const originalRequest = error.config as CustomAxiosRequestConfig  // 获取原始请求配置
                if (error.response.status === 401 && !originalRequest._retry) {  // token 过期且未重试
                    if (this.isRefreshing) {  // 如果正在刷新 token，则将请求加入队列
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject })
                        })
                            .then((token) => {
                                originalRequest.headers = originalRequest.headers || {}  // 确保 headers 存在
                                originalRequest.headers.Authorization = `Bearer ${token}`
                                return this.instance(originalRequest)
                            })
                            .catch((error) => {
                                return Promise.reject(error)
                            })
                    }
                    originalRequest._retry = true;  // 设置已重试
                    this.isRefreshing = true;  // 设置正在刷新 token

                    try {
                        const newToken = await this.refreshToken()
                        this.onTokenRefreshed(newToken);

                        originalRequest.headers = originalRequest.headers || {}  // 确保 headers 存在
                        originalRequest.headers.Authorization = `Bearer ${newToken}`
                        return this.instance(originalRequest);
                    } catch (refreshError) {
                        this.onTokenRefreshFailed();
                        return Promise.reject(refreshError)
                    }
                }
                return Promise.reject(error)  // 响应错误时抛出错误
            }
        )
    }

    private async refreshToken(): Promise<string> {
        const refreshToken = Cookie.get('refresh_token')
        if (!refreshToken) {
            throw new Error('No refresh token found')
        }
        const response = await axios.post<RefreshTokenResponse>(
            `${import.meta.env.VITE_SERVER_API_BASE_URL}:${import.meta.env.VITE_SERVER_API_PORT}/api/auth/refresh}`, {
            refresh_token: refreshToken
        })

        const { access_token, refresh_token, expires_in } = response.data

        this.setSecureCookie('access_token', access_token,expires_in)
        this.setSecureCookie('refresh_token', refresh_token,30*24*60*60) // refresh_token 有效期 30 天

        return access_token
    }
    private setSecureCookie(name:string,value:string,maxAgeInSeconds:number) {
        const isProduction = import.meta.env.PROD  // 判断是否为生产环境
        Cookie.set(name, value, {
            expires: new Date(Date.now() + maxAgeInSeconds * 1000),
            secure: isProduction, // 仅在 HTTPS 连接上发送 cookie
            sameSite: 'strict', // 防止 CSRF 攻击
            httpOnly: true   // 仅服务器端可访问 cookie
        })
    }

    private onTokenRefreshed(token: string) {
        this.failedQueue.forEach((promise) => promise.resolve(token))
        this.failedQueue = []
        this.isRefreshing = false
    }

    private onTokenRefreshFailed() {
        this.failedQueue.forEach((promise) => promise.reject(new Error('Token refresh failed')))
        this.failedQueue = []
        this.isRefreshing = false

        this.removeSecureCookie('access_token')
        this.removeSecureCookie('refresh_token')
        window.location.href = '/login'
    }
    private removeSecureCookie(name:string) {
        Cookie.remove(name,{
            path: '/',  
            secure: import.meta.env.PROD, // 仅在 HTTPS 连接上发送 cookie
            sameSite: 'strict', // 防止 CSRF 攻击
        })
    }

    public getInstance(): AxiosInstance {
        return this.instance;
    }
}

export const axiosService = new AxiosService();
export const axiosInstance = axiosService.getInstance();