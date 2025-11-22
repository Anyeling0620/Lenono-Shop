import { useActionState, useState } from "react";
import AgreementCheckbox from "./AgreementCheckbox";
import FormField from "./FormField";
import LoginModeTabs from "./LoginModeTabs";
import SubmitButton from "./SubmitButton";
import VerificationCodeField from "./VerificationCodeField";
import type { FormState } from "../../types/formState";
import useVerificationCode from "../../Hooks/useVerificationCode";


interface AuthFormProps {
  type: 'login' | 'register';
  onSwitchAuth: () => void;
}

type Mode = 'quick' | 'password'


async function formAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  // 从 FormData 中提取数据
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const verificationCode = formData.get('verificationCode') as string;

  // 初始化错误对象
  const errors: FormState['errors'] = {};

  // 邮箱验证
  if (!email) {
    errors.email = '邮箱不能为空';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = '请输入有效的邮箱地址';
  }

  // 密码验证
  if (!password) {
    errors.password = '密码不能为空';
  } else if (password.length < 6) {
    errors.password = '密码至少需要6位字符';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    errors.password = '密码必须包含大小写字母和数字';
  }

  // 验证码验证
  if (!verificationCode) {
    errors.verificationCode = '验证码不能为空';
  } else if (!/^\d{6}$/.test(verificationCode)) {
    errors.verificationCode = '验证码必须是6位数字';
  }

  // 如果有错误，返回错误信息
  if (Object.keys(errors).length > 0) {
    return {
      data: { email, password, verificationCode },
      errors,
      message: '请检查表单错误'
    };
  }

  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 这里可以添加实际的注册/登录逻辑
    // const response = await fetch('/api/auth', {
    //   method: 'POST',
    //   body: JSON.stringify({ email, password, verificationCode })
    // });
    
    // if (!response.ok) {
    //   throw new Error('注册失败');
    // }

    // 成功返回
    return {
      data: { email: '', password: '', verificationCode: '' }, // 清空表单
      errors: {},
      message: '注册成功！'
    };
  } catch (error) {
    // 处理服务器错误
    return {
      data: { email, password, verificationCode },
      errors: {},
      message: error instanceof Error ? error.message : '注册失败，请重试'
    };
  }
}

/**
 * 认证表单组件
 * 用于处理用户登录和注册的表单界面
 * @param props 组件属性，包含类型和切换认证方式的回调函数
 */
const AuthForm: React.FC<AuthFormProps> = ({ type, onSwitchAuth }) => {
  // 表单模式状态，用于区分快速登录和密码登录
  const [mode, setMode] = useState<Mode>('quick');
  // 用户协议同意状态
  const [agreed, setAgreed] = useState(false);
  // 验证码相关状态和操作
  const {
    isSending,    // 是否正在发送验证码
    countdown,    // 验证码倒计时
    startCountdown, // 开始倒计时函数
  } = useVerificationCode();

  // 表单状态管理，包括数据、错误信息和提示消息
  const [state, submitAction, isPending] = useActionState<FormState,FormData>(formAction, {
    data: {
      email: '',           // 邮箱
      password: '',        // 密码
      verificationCode: '' // 验证码
    },
    errors: {
      email: '',           // 邮箱错误信息
      password: '',        // 密码错误信息
      verificationCode: '' // 验证码错误信息
    },
    message:''           // 表单提交提示信息
  });

  // 根据认证类型设置标题、切换文本和按钮文本
  const title = type === 'login' ? '联想会员登录' : '注册联想账号';
  const switchText = type === 'login' ? '注册账号' : '登录账号';
  const buttonText = type === 'login' ? '登录' : '注册';


  /**
   * 处理发送验证码的逻辑
   * 点击发送验证码按钮时触发
   */
  const handleSendCode = async () => {

    // 这里处理发送验证码逻辑

    startCountdown(); // 开始倒计时

  }

  return (
    <div className="bg-white/95 rounded float-right h-auto mb-[80px] min-h-[586px] relative right-[30px] w-[460px]">
      <div className=" block">
        {/* 标题区域 */}
        <div className="text-[#252525] text-[30px] font-bold tracking-normal m-[58px_54px_35px_50px]">
          {title}
        </div>

        {/* 表单区域 */}
        <div className="box-border px-[45px] py-0 w-[100%]">
          {/* 登录模式下显示快速登录/密码登录切换标签 */}
          {type === 'login' && (
            <LoginModeTabs
              mode={mode}
              onModeChange={setMode}
            />
          )}

          {/* 表单主体 */}
          <form action={submitAction}>
            {/* 邮箱输入框 */}
            <FormField
              name="email"
              type="email"
              placeholder="请输入邮箱号"
              value={state.data.email}
              error={state.errors.email}
            />

            {/* 快速登录模式或注册模式下的验证码输入框 */}
            {(mode === 'quick' || type === 'register') && (
              <VerificationCodeField
                name="verificationCode"
                placeholder="请输入验证码"
                value={state.data.verificationCode}
                error={state.errors.verificationCode}
                verificationSent={isSending}
                countdown={countdown}
                onSendCode={handleSendCode}
              />
            )}

            {/* 密码登录模式下的密码输入框 */}
            {mode === 'password' && type === 'login' && (
              <FormField
                name="password"
                type="password"
                placeholder="请输入密码"
                value={state.data.password}
                error={state.errors.password}
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
              loading={isPending}
              disabled={!agreed}
            />

            {/* 切换登录/注册的链接 */}
            <div className="flex items-center text-[#252525] text-[13px] font-normal justify-end tracking-[0] mt-4">
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

