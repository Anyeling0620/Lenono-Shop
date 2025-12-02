/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, AxiosError } from "axios"; // 新增导入AxiosError
import axios from "axios";
import Cookie from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

declare module 'axios' { //  扩展 axios 模块的类型声明
    interface AxiosRequestConfig { //  扩展 AxiosRequestConfig 接口，添加自定义配置项
        skipDeviceCheck?: boolean; //  可选属性：是否跳过设备检查
        _retry?: boolean; //  可选属性：标记请求是否已经重试过
    }
}

export const EVENT_NAMES = { /** * 定义事件名称的常量对象，使用 as const 确保类型为只读 * 包含多登录相关的事件名称 */
    MULTI_LOGIN_WARNING: 'multi-login-warning', //  多登录警告事件名称
    MULTI_LOGIN_CONFLICT: 'multi-login-conflict' //  多登录冲突事件名称
} as const;

export const API_PATHS = { /** * API路径常量定义 * 该对象包含了所有与认证相关的API端点路径 * 使用as const断言确保所有属性为只读字面量类型 */
    REFRESH_TOKEN: '/auth/refresh', /**   * 刷新用户访问令牌的API路径   * 用于获取新的访问令牌，延长会话有效期   */
    LOGIN_DEVICES: '/auth/devices', /**   * 获取用户登录设备列表的API路径   * 用于查询当前用户的所有登录设备信息   */
    LOGOUT_DEVICE: '/auth/logout-device', /**   * 注销指定设备的API路径   * 用于从系统中移除指定的登录设备   */
    LOGOUT_OTHER_DEVICES: '/auth/logout-other-devices', /**   * 注销其他所有设备的API路径   * 用于保留当前设备，注销所有其他登录设备   */
    LOGIN_PATH: '/auth/login', /**   * 用户登录的API路径   * 用于用户登录并获取访问令牌   */
    REGISTER_PATH: '/auth/register' /**   * 用户注册的API路径   * 用于用户注册并获取访问令牌   */
} as const;

export type DeviceType = 'web' | 'mobile_web'; /** * 定义设备类型的联合类型 * 包括web端和移动网页端两种设备类型 */

export interface DeviceInfo { /** * 定义设备信息的接口结构 * 包含设备的各种相关信息 */
    device_id: string; //  设备唯一标识符
    device_type: DeviceType; //  设备类型，只能是web或mobile_web
    device_name?: string; //  设备名称，可选字段
    login_time: string; //  设备登录时间
    ip_address?: string; //  设备IP地址，可选字段
}

export type MultiLoginError = /** * 定义多登录错误类型的联合类型 * 用于处理多设备登录可能出现的错误情况 */
    | 'TOKEN_INVALID_BY_MULTI_LOGIN' // 访问令牌因多设备登录而失效
    | 'REFRESH_TOKEN_EXPIRED'  // 刷新令牌过期
    | 'DEVICE_NOT_AUTHORIZED';   // 设备未授权

interface ErrorResponse { /** * 定义错误响应接口 * 包含错误代码、错误信息以及可选的数据字段 */
    code: string; //  错误代码
    message: string; //  错误信息
    data?: { //  可选的数据字段
        redirect?: string; //  可选的重定向URL
        devices?: DeviceInfo[]; //  可选的设备信息数组
    };
}

interface AuthResponse { /** * 定义刷新令牌响应接口 * 包含访问令牌、刷新令牌、过期时间以及可选的字段 */
    access_token: string; //  新的访问令牌
    refresh_token: string; //  刷新令牌
    expires_in: number; //  令牌过期时间（秒）
    device_id?: string; //  可选的设备ID
    multi_login_warning?: boolean; //  可选的多登录警告标志
}

/**
 * AxiosService 是一个基于 Axios 的 HTTP 请求服务类，提供了统一的请求处理、认证管理和设备信息管理功能。
 * 
 * 主要功能：
 * - 统一的 HTTP 请求处理和响应拦截
 * - 自动 Token 刷新机制
 * - 设备信息管理和多端登录控制
 * - 安全的 Cookie 操作
 * 
 * 使用示例：
 * 
 * 构造函数参数：
 * 无需传入参数，构造函数会自动初始化设备信息和 Axios 实例。
 * 
 * 特殊说明：
 * - 类会自动处理 Token 过期和刷新逻辑
 * - 支持多端登录冲突检测和处理
 * - 设备信息会自动持久化到 localStorage 和 Cookie
 * - 在生产环境下会自动启用安全 Cookie 设置
 */
class AxiosService {
    private instance: AxiosInstance;
    private isRefreshing = false;
    private failedQueue: Array<{
        resolve: (value?: unknown) => void;
        reject: (reason?: any) => void;
    }> = [];
    private deviceId: string;
    private deviceType: DeviceType;

    /**
     * 构造函数
     * 初始化HTTP客户端实例，包括设备信息、请求配置和拦截器设置
     */
    constructor() {
        // 初始化设备信息
        this.deviceId = this.initDeviceId();
        this.deviceType = this.initDeviceType();

        // 创建axios实例（环境变量容错）
        const baseURL = this.getBaseURL();
        this.instance = axios.create({
            baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            }
        });

        this.setupInterceptors();
    }
    /**
     * 获取服务器API的基础URL
     * 
     * @returns {string} 返回格式为 `${baseUrl}:${port}/api` 的完整API基础URL
     * 
     * @description
     * 该方法从环境变量中读取API服务器的基础URL和端口号，并组合成完整的API基础URL。
     * - baseUrl: 从 VITE_SERVER_API_BASE_URL 环境变量获取
     * - port: 从 VITE_SERVER_API_PORT 环境变量获取
     * - 返回的URL格式: `${baseUrl}:${port}/api`
     * 
     * @example
     * // 如果环境变量设置为：
     * // VITE_SERVER_API_BASE_URL = "http://localhost"
     * // VITE_SERVER_API_PORT = "8080"
     * // 则返回 "http://localhost:8080/api"
     */
    private getBaseURL(): string {
        const baseUrl = import.meta.env.VITE_SERVER_API_BASE_URL;
        const port = import.meta.env.VITE_SERVER_API_PORT;
        return `${baseUrl}:${port}/api`;
    }
    /**
     * 初始化设备ID
     * 
     * 从localStorage或Cookie中获取已存储的设备ID。
     * 如果不存在，则生成一个新的UUID作为设备ID，并存储到localStorage和Cookie中。
     * 如果存储过程中发生错误，则生成一个临时ID并返回。
     * 
     * @returns {string} 返回设备ID字符串，可能是持久化的ID或临时ID
     * 
     * @example
     */
    private initDeviceId(): string {
        try {
            let deviceId = localStorage.getItem('device_id') || Cookie.get('device_id');
            if (!deviceId) {
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
    /**
     * 初始化设备类型
     * 根据用户代理字符串判断当前设备类型
     * @returns {DeviceType} 返回设备类型，如果是移动设备返回'mobile_web'，否则返回'web'
     */
    private initDeviceType(): DeviceType {
        const userAgent = navigator.userAgent.toLowerCase();
        return /mobile|android|ios|iphone|ipad/.test(userAgent) ? 'mobile_web' : 'web';
    }
    /**
     * 设置请求和响应拦截器
     * 
     * 该方法配置了axios实例的请求和响应拦截器，用于处理：
     * 1. 请求拦截：
     *    - 添加设备信息到请求头（X-Device-Id, X-Device-Type, X-Device-Name）
     *    - 添加认证token到请求头
     * 
     * 2. 响应拦截：
     *    - 处理401未授权错误
     *    - 处理token刷新逻辑
     *    - 处理多端登录冲突
     *    - 管理请求队列
     * 
     * @private
     * @returns {void}
     */
    private setupInterceptors() {
        // 请求拦截器
        /**
         * 请求拦截器配置
         * 
         * @param {InternalAxiosRequestConfig} config - axios请求配置对象
         * @returns {InternalAxiosRequestConfig} 处理后的请求配置
         */
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                // 无需类型断言，因为已扩展 AxiosRequestConfig
                if (!config.skipDeviceCheck) {
                    config.headers['X-Device-Id'] = this.deviceId;
                    config.headers['X-Device-Type'] = this.deviceType;
                    const uaPrefix = navigator.userAgent.split(')')[0] || 'Unknown';
                    config.headers['X-Device-Name'] = `${uaPrefix} (${this.deviceType})`;
                }

                // 添加Token
                const token = Cookie.get('access_token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        // 响应拦截器
        /**
         * 响应拦截器配置
         * 
         * @param {AxiosResponse} response - axios响应对象
         * @returns {AxiosResponse} 处理后的响应对象
         * 
         * @param {AxiosError} error - 错误对象
         * @returns {Promise} 处理后的Promise对象
         */
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error) => {
                const originalRequest = error.config as AxiosRequestConfig;
                const errorResponse = error.response?.data as ErrorResponse;

                // 处理401错误
                if (error.response?.status === 401 && !originalRequest._retry) {
                    // 多端登录冲突：修复Object.assign类型问题
                    if (errorResponse?.code === 'TOKEN_INVALID_BY_MULTI_LOGIN') {
                        this.onMultiLoginConflict(errorResponse);
                        // 1. 先创建Error实例，再扩展属性（确保是object类型）
                        const conflictError = new Error('账号已在其他设备登录');
                        (conflictError as any).original = error;
                        return Promise.reject(conflictError);
                    }

                    // 正在刷新token，加入队列
                    if (this.isRefreshing) {
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject });
                        })
                            .then((token) => {
                                originalRequest.headers = originalRequest.headers || {};
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                                return this.instance(originalRequest);
                            })
                            .catch((err) => Promise.reject(err));
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    try {
                        const newToken = await this.refreshToken();
                        this.onTokenRefreshed(newToken);

                        originalRequest.headers = originalRequest.headers || {};
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return this.instance(originalRequest);
                    } catch (refreshError) {
                        // ========== 核心修复：正确处理AxiosError类型 ==========
                        // 1. 断言为AxiosError（有response属性），并添加类型守卫
                        const axiosError = refreshError as AxiosError<ErrorResponse>;
                        // 2. 安全访问response.data（先判断response是否存在）
                        const refreshErrData = axiosError.response?.data as ErrorResponse | undefined;

                        // 刷新token过期：触发多端登录冲突
                        if (refreshErrData?.code === 'REFRESH_TOKEN_EXPIRED') {
                            this.onMultiLoginConflict(refreshErrData);
                        } else {
                            this.onTokenRefreshFailed();
                        }

                        // 包装错误并保留原始信息
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
     * 刷新访问令牌
     * 
     * @description
     * 使用存储的刷新令牌获取新的访问令牌。如果检测到多端登录风险，会触发警告事件。
     * 
     * @returns {Promise<string>} 返回新的访问令牌
     * 
     * @throws {Error} 当找不到刷新令牌时抛出错误
     * 
     * @example
     */
    private async refreshToken(): Promise<string> {
        const refreshToken = Cookie.get('refresh_token');
        if (!refreshToken) {
            throw new Error('No refresh token found');
        }

        const response = await this.instance.post<AuthResponse>(
            API_PATHS.REFRESH_TOKEN,
            { refresh_token: refreshToken, device_id: this.deviceId },
            { skipDeviceCheck: true }    //  跳过设备检查
        );

        const { access_token, refresh_token: newRefreshToken, expires_in, multi_login_warning } = response.data;

        if (multi_login_warning) {
            console.warn('当前账号存在多端登录风险');
            window.dispatchEvent(new CustomEvent(EVENT_NAMES.MULTI_LOGIN_WARNING, {
                detail: { deviceId: this.deviceId }
            }));
        }

        this.setSecureCookie('access_token', access_token, expires_in);
        this.setSecureCookie('refresh_token', newRefreshToken, 30 * 24 * 60 * 60);

        return access_token;
    }
    /**
     * 处理多端登录冲突的情况
     * @param errorData 错误响应数据，包含冲突信息
     * @returns void
     */
    private onMultiLoginConflict(errorData: ErrorResponse): void {
        // 修复队列中的错误类型
        this.failedQueue.forEach((promise) => {
            const conflictError = new Error('账号已在其他设备登录');
            (conflictError as any).data = errorData;
            promise.reject(conflictError);
        });
        this.failedQueue = [];
        this.isRefreshing = false;

        // 清除认证信息
        this.removeSecureCookie('access_token');
        this.removeSecureCookie('refresh_token');

        // 触发自定义事件，供业务层监听
        window.dispatchEvent(new CustomEvent(EVENT_NAMES.MULTI_LOGIN_CONFLICT, {
            detail: {
                message: errorData.message,
                devices: errorData.data?.devices || [],
                redirect: errorData.data?.redirect || '/login'
            }
        }));

        // 重定向到登录页
        window.location.href = errorData.data?.redirect || '/login';
    }
    /**
     * 当token刷新成功后的回调处理函数
     * @param token - 新刷新的访问令牌
     * @returns void
     * 
     * 该函数会执行以下操作：
     * 1. 解析所有等待中的失败请求队列，将新token传递给每个请求
     * 2. 清空失败请求队列
     * 3. 重置token刷新状态标志
     */
    private onTokenRefreshed(token: string): void {
        this.failedQueue.forEach((promise) => promise.resolve(token));
        this.failedQueue = [];
        this.isRefreshing = false;
    }
    /**
     * 处理token刷新失败的情况
     * 
     * 执行以下操作：
     * 1. 拒绝所有等待中的请求
     * 2. 清空失败队列
     * 3. 重置刷新状态
     * 4. 删除存储的token
     * 5. 重定向到登录页面
     */
    private onTokenRefreshFailed(): void {
        this.failedQueue.forEach((promise) => promise.reject(new Error('Token refresh failed')));
        this.failedQueue = [];
        this.isRefreshing = false;

        this.removeSecureCookie('access_token');
        this.removeSecureCookie('refresh_token');
        window.location.href = '/login';
    }
    /**
     * 设置一个安全的Cookie
     * @param name - Cookie的名称
     * @param value - Cookie的值
     * @param maxAgeInSeconds - Cookie的过期时间（秒）
     * @returns void
     * @description 
     * 此方法用于设置一个具有安全属性的Cookie，包括：
     * - 在生产环境下仅通过HTTPS传输
     * - 设置SameSite为strict以防止CSRF攻击
     * - 设置path为'/'使Cookie在整个网站中有效
     * - 使用expires设置具体的过期时间
     */
    private setSecureCookie(name: string, value: string, maxAgeInSeconds: number): void {
        const isProduction = import.meta.env.PROD;
        Cookie.set(name, value, {
            expires: new Date(Date.now() + maxAgeInSeconds * 1000),
            secure: isProduction, // 生产环境仅HTTPS传输
            sameSite: 'strict',   // 防CSRF
            path: '/'             // 全站有效
        });
    }
    /**
     * 删除安全Cookie，并在特定情况下同步删除localStorage中的数据
     * 
     * @param {string} name - 要删除的Cookie名称
     * @returns {void}
     * 
     * @description
     * 此方法用于删除指定的安全Cookie，具有以下特性：
     * - Cookie路径设置为根目录'/'
     * - 在生产环境中启用secure标志
     * - 设置sameSite为'strict'以增强安全性
     * 
     * 当删除的Cookie是'device_id'时，会同时从localStorage中移除对应数据
     * 如果localStorage操作失败，会在控制台输出警告信息
     * 
     * @example
     */
    private removeSecureCookie(name: string): void {
        Cookie.remove(name, {
            path: '/',
            secure: import.meta.env.PROD,
            sameSite: 'strict'
        });

        // 设备ID同步从localStorage移除
        if (name === 'device_id') {
            try {
                localStorage.removeItem('device_id');
            } catch (error) {
                console.warn('移除设备ID失败:', error);
            }
        }
    }
    // ========== 公共方法（多端登录管理） ==========
    /**
     * 获取当前用户的所有登录设备列表
     * @returns {Promise<DeviceInfo[]>} 返回一个Promise，解析为设备信息数组
     * @throws {Error} 当获取设备列表失败时抛出错误
     */
    public async getLoginDevices(): Promise<DeviceInfo[]> {
        try {
            const response = await this.instance.get<{ devices: DeviceInfo[] }>(API_PATHS.LOGIN_DEVICES, {
                headers: { 'X-Device-Id': this.deviceId }
            });
            return response.data.devices;
        } catch (error) {
            console.error('获取登录设备列表失败:', error);
            throw error;
        }
    }
    /**
     * 登出指定设备
     * @description 通过设备ID登出指定设备，如果是当前设备则触发Token刷新失败处理
     * @param deviceId 要登出的设备ID
     * @returns Promise<boolean> 返回true表示登出成功
     * @throws {Error} 当登出失败时抛出错误
     */
    public async logoutDevice(deviceId: string): Promise<boolean> {
        try {
            await this.instance.post(API_PATHS.LOGOUT_DEVICE, {
                device_id: deviceId,
                current_device_id: this.deviceId
            });
            // 登出当前设备则跳转登录
            if (deviceId === this.deviceId) {
                this.onTokenRefreshFailed();
            }
            return true;
        } catch (error) {
            console.error('登出指定设备失败:', error);
            throw error;
        }
    }
    /**
     * 登出当前用户的其他设备
     * @description 该方法会向服务器发送请求，使除当前设备外的所有已登录设备失效，
     *              并刷新当前设备的Token以确保其保持有效状态
     * @returns {Promise<DeviceInfo[]>} 返回被成功登出的设备信息列表
     * @throws {Error} 当登出操作失败时抛出错误
     */
    public async logoutOtherDevices(): Promise<DeviceInfo[]> {
        try {
            const response = await this.instance.post<{ devices: DeviceInfo[] }>(
                API_PATHS.LOGOUT_OTHER_DEVICES,
                { current_device_id: this.deviceId }
            );
            // 刷新当前设备Token（服务端会重置其他设备Token）
            await this.refreshToken();
            return response.data.devices;
        } catch (error) {
            console.error('登出其他设备失败:', error);
            throw error;
        }
    }



    /**
     * 用户登录方法
     * @param {Object} loginInfo - 登录信息对象
     * @param {string} loginInfo.email - 用户邮箱
     * @param {string} loginInfo.mode - 登录模式，可选值：'quick'（验证码登录）或 'password'（密码登录）
     * @param {string} [loginInfo.password] - 密码，当mode为'password'时必需
     * @param {string} [loginInfo.verificationCode] - 验证码，当mode为'quick'时必需
     * @returns {Promise<string>} 返回设备ID
     * @throws {Error} 当邮箱为空时抛出错误
     * @throws {Error} 当mode为'quick'且验证码为空时抛出错误
     * @throws {Error} 当mode为'password'且密码为空时抛出错误
     * @throws {Error} 当登录失败时抛出错误信息
     */
    public async login(loginInfo: {
        email: string;
        mode: string;
        password?: string;
        verificationCode?: string;
    }): Promise<string> {

        // 保留原有参数校验逻辑
        if (!loginInfo.email) {
            throw new Error('邮箱不能为空');
        }
        if (loginInfo.mode === 'quick' && !loginInfo.verificationCode) {
            throw new Error('验证码不能为空');
        }
        if (loginInfo.mode === 'password' && !loginInfo.password) {
            throw new Error('密码不能为空');
        }

        try {
            const response = await this.instance.post<AuthResponse>(
                API_PATHS.LOGIN_PATH,
                {
                    email: loginInfo.email,
                    mode: loginInfo.mode,
                    password: loginInfo.password,
                    verification_code: loginInfo.verificationCode,
                    device_id: this.deviceId,
                    device_type: this.deviceType,
                },
                { skipDeviceCheck: false }
            );

            const { access_token, refresh_token, expires_in, device_id } = response.data;

            // 仅存储Token，不处理用户信息
            this.setSecureCookie('access_token', access_token, expires_in);
            this.setSecureCookie('refresh_token', refresh_token, 30 * 24 * 60 * 60);

            // 若后端返回了device_id，才更新（否则沿用前端生成的）
            if (device_id) {
                this.deviceId = device_id;
                localStorage.setItem('device_id', device_id);
                this.setSecureCookie('device_id', device_id, 365 * 24 * 60 * 60);
            }

            // 仅返回设备ID（无用户信息）
            return this.deviceId;
        } catch (error) {
            const errMsg = (error as AxiosError<ErrorResponse>)?.response?.data?.message || '登录失败，请检查账号信息或网络状态';
            console.error('登录失败:', errMsg, error);
            throw new Error(errMsg);
        }
    }


    /**
     * 用户注册方法
     * @param registerInfo 注册信息对象
     * @param registerInfo.email 注册邮箱
     * @param registerInfo.verifyCode 邮箱验证码
     * @param registerInfo.password 用户密码
     * @param registerInfo.passwordConfirm 确认密码
     * @returns Promise<string> 返回设备ID
     * @throws {Error} 当参数校验失败或注册请求失败时抛出错误
     */
    public async register(registerInfo: {
        email: string;
        verificationCode: string;
        registerPassword: string;
        registerPasswordConfirm: string;
    }): Promise<string> {
        // 保留原有参数校验逻辑
        if (!registerInfo.email) {
            throw new Error('注册邮箱不能为空');
        }
        if (!registerInfo.verificationCode) {
            throw new Error('验证码不能为空');
        }
        if (!registerInfo.registerPassword) {
            throw new Error('密码不能为空');
        }
        if (registerInfo.registerPassword.length < 6) {
            throw new Error('密码长度不能少于6位');
        }
        if (registerInfo.registerPassword !== registerInfo.registerPasswordConfirm) {
            throw new Error('两次输入的密码不一致，请重新输入');
        }
        
        try {
            const response = await this.instance.post<AuthResponse>(
                API_PATHS.REGISTER_PATH,
                {
                    email: registerInfo.email,
                    verify_code: registerInfo.verificationCode,
                    password: registerInfo.registerPassword,
                    password_confirm: registerInfo.registerPasswordConfirm,
                    device_id: this.deviceId, 
                    device_type: this.deviceType,
                },
                { skipDeviceCheck: false }
            );

            const { access_token, refresh_token, expires_in, device_id } = response.data;

            // 仅存储Token，不处理用户信息
            this.setSecureCookie('access_token', access_token, expires_in);
            this.setSecureCookie('refresh_token', refresh_token, 30 * 24 * 60 * 60);

            // 若后端返回了device_id，才更新（否则沿用前端生成的）
            if (device_id) {
                this.deviceId = device_id;
                localStorage.setItem('device_id', device_id);
                this.setSecureCookie('device_id', device_id, 365 * 24 * 60 * 60);
            }

            // 仅返回设备ID（无用户信息）
            return this.deviceId;
        } catch (error) {
            const errMsg = (error as AxiosError<ErrorResponse>)?.response?.data?.message || '注册失败，请检查信息或稍后重试';
            console.error('注册失败:', errMsg, error);
            throw new Error(errMsg);
        }
    }


    /**
     * 获取当前设备信息
     * @returns 返回包含设备ID和设备类型的对象
     * @returns {string} returns.deviceId - 设备的唯一标识符
     * @returns {DeviceType} returns.deviceType - 设备类型
     */
    public getCurrentDeviceInfo(): { deviceId: string; deviceType: DeviceType } {
        return {
            deviceId: this.deviceId,
            deviceType: this.deviceType
        };
    }
    /**
     * 获取 Axios 实例
     * @returns {AxiosInstance} 返回当前 Axios 实例
     */
    public getInstance(): AxiosInstance {
        return this.instance;
    }
}
export const axiosService = new AxiosService();
export const axiosInstance = axiosService.getInstance();