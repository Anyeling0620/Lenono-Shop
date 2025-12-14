/*
 * @Author: 不见霞
 * @FilePath: \lenovo-shop\src\component\Auth\AuthForm.tsx
 * @Description: 登录/注册表单（基于react-hook-form + zod重构）
 */
import { useState, useRef } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AgreementCheckbox from "./AgreementCheckbox";
import FormField from "./FormField";
import LoginModeTabs from "./LoginModeTabs";
import SubmitButton from "./SubmitButton";
import VerificationCodeField from "./VerificationCodeField";
import useVerificationCode from "../../hooks/useVerificationCode";
import { axiosInstance, axiosService } from "../../services/axiosService";
import toast from "react-hot-toast";
import globalErrorHandler from "../../utils/globalAxiosErrorHandler";
import { API_PATHS } from "../../services/apiPaths";

// 组件属性类型
interface AuthFormProps {
  type: 'login' | 'register';
  onSwitchAuth: () => void;
}

// 登录模式类型
type Mode = 'quick' | 'password';

// ========== Zod 验证 Schema（适配v4） ==========
// 快捷登录Schema
const loginQuickSchema = z.object({
  email: z.string()
    .nonempty('邮箱不能为空')
    .email('请输入有效的邮箱地址'),
  verificationCode: z.string()
    .nonempty('验证码不能为空')
    .regex(/^\d{6}$/, '验证码必须是6位数字'),
});

// 密码登录Schema
const loginPasswordSchema = z.object({
  email: z.string()
    .nonempty('邮箱不能为空')
    .email('请输入有效的邮箱地址'),
  password: z.string()
    .nonempty('密码不能为空')
    .min(6, '密码至少需要6位字符')
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字'),
});

// 注册Schema
const registerSchema = z.object({
  email: z.string()
    .nonempty('邮箱不能为空')
    .email('请输入有效的邮箱地址'),
  verificationCode: z.string()
    .nonempty('验证码不能为空')
    .regex(/^\d{6}$/, '验证码必须是6位数字'),
  registerPassword: z.string()
    .nonempty('密码不能为空')
    .min(6, '密码至少需要6位字符')
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字'),
  registerPasswordConfirm: z.string().nonempty('确认密码不能为空'),
}).refine(data => data.registerPassword === data.registerPasswordConfirm, {
  message: '两次输入的密码不一致',
  path: ['registerPasswordConfirm'],
});

// ========== 推导表单值类型 ==========
type LoginQuickValues = z.infer<typeof loginQuickSchema>;
type LoginPasswordValues = z.infer<typeof loginPasswordSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

// ========== 推导错误类型（替代inferFormErrors） ==========
type LoginQuickErrors = FieldErrors<LoginQuickValues>;
type LoginPasswordErrors = FieldErrors<LoginPasswordValues>;

// ========== 条件类型：根据mode限定允许的字段 ==========
type LoginFieldKeys<T extends Mode> = T extends 'quick' 
  ? keyof LoginQuickValues 
  : keyof LoginPasswordValues;


/**
 * 认证表单组件
 * @component
 * @param {Object} props - 组件属性
 * @param {'login' | 'register'} props.type - 表单类型：登录或注册
 * @param {Function} props.onSwitchAuth - 切换登录/注册模式的回调函数
 * @returns {JSX.Element} 认证表单组件
 */
const AuthForm: React.FC<AuthFormProps> = ({ type, onSwitchAuth }) => {
  /**
   * 基础UI状态
   */
  const [mode, setMode] = useState<Mode>('quick');
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  /**
   * 邮箱输入框ref，用于聚焦
   */
  const emailInputRef = useRef<HTMLInputElement>(null);

  /**
   * 验证码Hook
   */
  const { isSending, countdown, startCountdown } = useVerificationCode();

  /**
   * 登录表单初始化
   * 包含表单注册、提交处理、错误状态和重置功能
   */
  const {
    register: loginRegister,
    handleSubmit: loginHandleSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
    reset: resetLogin,
    watch: watchLogin,
    setError: setLoginError,
  } = useForm<LoginQuickValues | LoginPasswordValues>({
    resolver: zodResolver(mode === 'quick' ? loginQuickSchema : loginPasswordSchema),
    defaultValues: mode === 'quick' 
      ? { email: '', verificationCode: '' } 
      : { email: '', password: '' },
  });

  /**
   * 注册表单初始化
   * 包含表单注册、提交处理、错误状态和重置功能
   */
  const {
    register: registerRegister,
    handleSubmit: registerHandleSubmit,
    formState: { errors: registerErrors, isSubmitting: isRegisterSubmitting },
    reset: resetRegister,
    watch: watchRegister,
    setError: setRegisterError,
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      verificationCode: '',
      registerPassword: '',
      registerPasswordConfirm: '',
    },
  });

  /**
   * 泛型类型守卫：精准获取登录错误
   * @template T - 登录模式类型
   * @param {T} currentMode - 当前登录模式
   * @param {LoginFieldKeys<T>} field - 要获取错误的字段名
   * @returns {FieldError | undefined} 表单字段错误
   */
  const getLoginError = <T extends Mode>(currentMode: T, field: LoginFieldKeys<T>) => {
    if (currentMode === 'quick') {
      return (loginErrors as LoginQuickErrors)[field as keyof LoginQuickValues];
    }
    return (loginErrors as LoginPasswordErrors)[field as keyof LoginPasswordValues];
  };

  /**
   * 监听邮箱值（用于发送验证码）
   */
  const email = type === 'login' ? watchLogin('email', '') : watchRegister('email', '');

  /**
   * 发送验证码逻辑
   * 包含邮箱格式验证和API调用
   */
  const handleSendCode = async () => {
    const emailResult = z.string().min(1, '邮箱不能为空').email( '请输入有效的邮箱地址').safeParse(email);
    if (!emailResult.success) {
      const errorMessage = emailResult.error.issues[0].message;
      if (type === 'login') {
        setLoginError('email', { message: errorMessage });
      } else {
        setRegisterError('email', { message: errorMessage });
      }
      emailInputRef.current?.focus();
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.SEND_VERIFICATION_CODE, { email:email });
      startCountdown();
    } catch (error) {
      globalErrorHandler.handle(error, toast.error);
    }
  };

  /**
   * 登录提交逻辑
   * @param {LoginQuickValues | LoginPasswordValues} data - 表单数据
   */
  const onLoginSubmit = async (data: LoginQuickValues | LoginPasswordValues) => {
    try {
      const payload = mode === 'quick' 
        ? { ...data, mode: 'quick' } 
        : { ...data, mode: 'password' };
      await axiosService.login(payload);
      toast.success('登录成功！');
      resetLogin();
      setAgreed(false);
    } catch (error) {
      globalErrorHandler.handle(error, toast.error);
    }
  };

  /**
   * 注册提交逻辑
   * @param {RegisterValues} data - 表单数据
   */
  const onRegisterSubmit = async (data: RegisterValues) => {
    try {
      await axiosService.register(data);
      toast.success('注册成功！');
      resetRegister();
      setAgreed(false);
      setShowPassword(false);
    } catch (error) {
      globalErrorHandler.handle(error, toast.error);
    }
  };

  /**
   * UI文本配置
   */
  const title = type === 'login' ? '联想会员登录' : '注册联想账号';
  const switchText = type === 'login' ? '注册账号' : '登录账号';
  const buttonText = type === 'login' ? '登录' : '注册';
  const isSubmitting = type === 'login' ? isLoginSubmitting : isRegisterSubmitting;
  const handleSubmit = type === 'login' ? loginHandleSubmit(onLoginSubmit) : registerHandleSubmit(onRegisterSubmit);

  return (
    <div className="bg-white/95 rounded float-right h-auto mb-[80px] min-h-[586px] relative right-[30px] w-[460px]">
      <div className="block">
        {/* 标题区域 */}
        <div className="text-[#252525] text-[30px] font-bold tracking-normal m-[58px_54px_35px_50px]">
          {title}
        </div>

        {/* 表单区域 */}
        <div className="box-border px-[45px] py-0 w-[100%]">
          {/* 登录模式切换标签 */}
          {type === 'login' && (
            <LoginModeTabs
              mode={mode}
              onModeChange={(newMode) => {
                setMode(newMode);
                resetLogin(newMode === 'quick' ? { email, verificationCode: '' } : { email, password: '' });
              }}
            />
          )}

          {/* 表单主体 */}
          <form onSubmit={handleSubmit}>
            {/* 邮箱输入框 */}
            <FormField
              type="email"
              placeholder="请输入邮箱号"
              {...(type === 'login' ? loginRegister('email') : registerRegister('email'))}
              error={type === 'login' ? getLoginError(mode, 'email')?.message : registerErrors.email?.message}
              ref={(el) => {
                emailInputRef.current = el;
                const registerRef = type === 'login' 
                  ? loginRegister('email').ref 
                  : registerRegister('email').ref;
                if (typeof registerRef === 'function') {
                  registerRef(el);
                }
              }}
            />

            {/* 验证码输入框（快捷登录/注册显示） */}
            {(mode === 'quick' || type === 'register') && (
              <VerificationCodeField
                placeholder="请输入验证码"
                {...(type === 'login' ? loginRegister('verificationCode') : registerRegister('verificationCode'))}
                error={type === 'login' ? getLoginError('quick', 'verificationCode')?.message : registerErrors.verificationCode?.message}
                onVerify={setShowPassword}
                verificationSent={isSending}
                countdown={countdown}
                onSendCode={handleSendCode}
              />
            )}

            {/* 密码登录-密码输入框 */}
            {mode === 'password' && type === 'login' && (
              <FormField
                type="password"
                placeholder="请输入密码"
                {...loginRegister('password')}
                error={getLoginError('password', 'password')?.message}
              />
            )}

            {/* 注册-密码输入框 */}
            {showPassword && type === 'register' && (
              <FormField
                type="password"
                placeholder="请设置密码"
                {...registerRegister('registerPassword')}
                error={registerErrors.registerPassword?.message}
              />
            )}

            {/* 注册-确认密码输入框 */}
            {showPassword && type === 'register' && (
              <FormField
                type="password"
                placeholder="请确认密码"
                {...registerRegister('registerPasswordConfirm')}
                error={registerErrors.registerPasswordConfirm?.message}
              />
            )}

            {/* 用户协议复选框 */}
            <AgreementCheckbox
              agreed={agreed}
              onToggle={() => setAgreed(!agreed)}
            />

            {/* 提交按钮 */}
            <SubmitButton
              label={buttonText}
              loading={isSubmitting}
              disabled={!agreed}
              className="w-[370px] mt-1"
            />

            {/* 切换登录/注册链接 */}
            <div className="flex items-center text-[#252525] text-[13px] font-normal justify-end tracking-[0] mt-4 pb-8">
              <span
                className="cursor-pointer hover:text-[#e1140a] transition-colors"
                onClick={onSwitchAuth}
              >
                {switchText}
              </span>
              <span className="cursor-pointer ml-[3px] relative after:content-['\003E'] hover:after:text-[#e1140a] transition-colors" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;