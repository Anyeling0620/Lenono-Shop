// utils/GlobalAxiosErrorHandler.ts
import type { AxiosError, AxiosResponse } from 'axios';

type GlobalErrorType = 
  | 'network_error'    // 网络错误（无网络/跨域）
  | 'timeout_error'    // 请求超时
  | 'cancel_error'     // 请求取消
  | 'http_status_error'// HTTP 状态码错误（4xx/5xx）
  | 'business_error'   // 后端业务码错误（有响应但业务失败）
  | 'unknown_error';   // 未知错误

/**
 * 标准化错误结构（全局通用）
 */
interface GlobalErrorInfo {
  type: GlobalErrorType;        // 错误类型
  message: string;              // 友好提示文案
  originalError: unknown;       // 原始错误对象（调试用）
  status: number | null;        // HTTP 状态码（无则null）
  businessCode: string | null;  // 后端自定义业务码（无则null）
  response: AxiosResponse | null;// 完整响应对象（有则返回）
}

/**
 * 全局通用 Axios 错误处理类
 * 适配所有业务场景：登录、表单、列表、详情、验证码等
 */
/**
 * 全局 Axios 错误处理器类
 * 用于统一处理 Axios 请求中的各种错误情况，包括网络错误、超时、取消请求、HTTP 状态码错误和业务码错误等。
 * 提供错误解析、友好提示生成和错误处理等功能，支持自定义错误提示配置。
 * 
 * 核心功能：
 * - 错误解析：将原始错误转换为标准化的错误信息结构
 * - 友好提示：提供用户友好的错误提示信息
 * - 错误处理：支持自定义提示方式处理错误
 * - 错误类型判断：提供多种错误类型的判断方法
 * 
 * 示例：
 * 
 * 构造函数参数：
 * @param customConfig 可选的自定义配置对象，包含：
 *   - networkErrorMsg: 网络错误提示
 *   - timeoutErrorMsg: 超时错误提示
 *   - cancelErrorMsg: 取消请求提示
 *   - unknownErrorMsg: 未知错误提示
 *   - httpStatusMsgMap: HTTP状态码对应的提示映射
 *   - businessCodeMsgMap: 业务码对应的提示映射
 * 
 * 使用限制：
 * - 主要用于处理 Axios 请求错误
 * - 自定义配置会与默认配置进行合并，不会完全覆盖
 * - 错误日志默认会在控制台输出，生产环境可根据需要关闭
 */
class GlobalAxiosErrorHandler {
  // 默认提示配置（可全局覆盖，也可单例自定义）
  private defaultConfig = {
    // 基础错误提示
    networkErrorMsg: '网络连接异常，请检查网络设置',
    timeoutErrorMsg: '请求超时，请稍后重试',
    cancelErrorMsg: '请求已取消',
    unknownErrorMsg: '操作失败，请稍后重试',
    // HTTP 状态码默认提示（可按业务扩展）
    httpStatusMsgMap: {
      400: '请求参数错误，请检查输入内容',
      401: '登录状态已失效，请重新登录',
      403: '暂无权限访问该资源',
      404: '请求的资源不存在',
      405: '请求方法不允许',
      429: '请求过于频繁，请稍后重试',
      500: '服务器内部错误，请稍后重试',
      502: '网关错误，请稍后重试',
      503: '服务暂不可用，请稍后重试',
      504: '网关超时，请稍后重试'
    } as Record<number, string>,
    // 后端业务码默认提示（可按业务扩展，比如TOKEN_INVALID/PARAM_ERROR等）
    businessCodeMsgMap: {} as Record<string, string>
  };

  /**
   * 构造函数（支持实例化时自定义配置，适配不同业务）
   * @param customConfig 自定义提示配置
   */
  constructor(customConfig?: Partial<typeof GlobalAxiosErrorHandler.prototype.defaultConfig>) {
    if (customConfig) {
      // 合并默认配置和自定义配置
      this.defaultConfig = {
        ...this.defaultConfig,
        httpStatusMsgMap: {
          ...this.defaultConfig.httpStatusMsgMap,
          ...customConfig.httpStatusMsgMap
        },
        businessCodeMsgMap: {
          ...this.defaultConfig.businessCodeMsgMap,
          ...customConfig.businessCodeMsgMap
        },
        ...(customConfig as Omit<typeof customConfig, 'httpStatusMsgMap' | 'businessCodeMsgMap'>)
      };
    }
  }

  /**
   * 核心方法：解析任意错误为标准化结构（全局通用）
   * @param error Catch 捕获的原始错误
   * @returns 标准化错误信息
   */
  public parse(error: unknown): GlobalErrorInfo {
    const errorInfo: GlobalErrorInfo = {
      type: 'unknown_error',
      message: this.defaultConfig.unknownErrorMsg,
      originalError: error,
      status: null,
      businessCode: null,
      response: null
    };

    // 1. 判断是否为 Axios 错误
    if (error instanceof Error && (error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError<{
        code?: string;    // 后端业务码
        message?: string; // 后端提示文案
      }>;

      // 1.1 无响应：网络/超时/取消
      if (!axiosError.response) {
        if (axiosError.code === 'ERR_NETWORK') {
          errorInfo.type = 'network_error';
          errorInfo.message = this.defaultConfig.networkErrorMsg;
        } else if (axiosError.code === 'ERR_TIMEOUT') {
          errorInfo.type = 'timeout_error';
          errorInfo.message = this.defaultConfig.timeoutErrorMsg;
        } else if (axiosError.code === 'ERR_CANCELED') {
          errorInfo.type = 'cancel_error';
          errorInfo.message = this.defaultConfig.cancelErrorMsg;
        }
        return errorInfo;
      }

      // 1.2 有响应：HTTP 状态码错误 + 后端业务码错误
      errorInfo.status = axiosError.response.status;
      errorInfo.response = axiosError.response;
      errorInfo.type = 'http_status_error';

      // 1.2.1 优先解析后端业务码
      const responseData = axiosError.response.data;
      if (responseData?.code) {
        errorInfo.type = 'business_error';
        errorInfo.businessCode = responseData.code;
        // 优先用后端提示 → 业务码配置提示 → HTTP 状态码提示 → 默认提示
        errorInfo.message = responseData.message 
          || this.defaultConfig.businessCodeMsgMap[responseData.code]
          || this.defaultConfig.httpStatusMsgMap[axiosError.response.status]
          || this.defaultConfig.unknownErrorMsg;
      } else {
        // 1.2.2 无业务码：用 HTTP 状态码提示
        errorInfo.message = this.defaultConfig.httpStatusMsgMap[axiosError.response.status] 
          || this.defaultConfig.unknownErrorMsg;
      }
    }
    return errorInfo;
  }

  /**
   * 快捷方法：仅获取友好提示文案（全局通用）
   * @param error 原始错误
   * @returns 友好提示字符串
   */
  public getFriendlyMessage(error: unknown): string {
    return this.parse(error).message;
  }

  /**
   * 快捷方法：处理错误并输出提示（适配任意提示方式，如 Toast/Modal）
   * @param error 原始错误
   * @param notify 提示方法（如 toast.error、Modal.error 等）
   * @param customMsg 自定义默认提示（覆盖全局配置）
   */
  public handle(
    error: unknown,
    notify: (msg: string) => void,
    customMsg?: string
  ): void {
    const errorInfo = this.parse(error);
    // 优先用自定义提示，无则用解析后的友好提示
    const finalMsg = customMsg || errorInfo.message;
    notify(finalMsg);
    // 保留错误日志，方便调试（生产环境可关闭）
    //console.error('[全局错误处理]', errorInfo);
  }

  // ===== 辅助方法：判断错误类型（全局通用，按需使用）=====
  /** 判断是否是网络错误 */
  public isNetworkError(error: unknown): boolean {
    return this.parse(error).type === 'network_error';
  }

  /** 判断是否是超时错误 */
  public isTimeoutError(error: unknown): boolean {
    return this.parse(error).type === 'timeout_error';
  }

  /** 判断是否是 401 未授权 */
  public isUnauthorizedError(error: unknown): boolean {
    return this.parse(error).status === 401;
  }

  /** 判断是否是后端业务码错误 */
  public isBusinessError(error: unknown, businessCode?: string): boolean {
    const errorInfo = this.parse(error);
    return errorInfo.type === 'business_error' 
      && (businessCode ? errorInfo.businessCode === businessCode : true);
  }
}


// ========== 全局单例（项目中直接复用，无需重复实例化） ==========
// 可在项目入口（如 main.tsx）自定义全局配置，适配所有业务
export const globalErrorHandler = new GlobalAxiosErrorHandler({
  // 自定义全局基础提示
  unknownErrorMsg: '操作失败，请稍后重试',
  // 自定义 HTTP 状态码提示
  httpStatusMsgMap: {
    401: '登录过期，请重新登录', // 覆盖默认的401提示
    403: '您暂无权限执行该操作'  // 覆盖默认的403提示
  },
  // 自定义后端业务码提示（比如多端登录/参数错误等）
  businessCodeMsgMap: {
    TOKEN_INVALID_BY_MULTI_LOGIN: '账号已在其他设备登录',
    PARAM_ERROR: '参数错误，请检查输入'
  }
});