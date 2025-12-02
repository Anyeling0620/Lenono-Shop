import React, { useState } from 'react';
import { errIcon } from '../../assets/icon';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface VerificationCodeFieldBaseProps {
  placeholder: string;
  error?: string;
  verificationSent: boolean;
  countdown: number;
  onSendCode: () => void;
  onVerify?: (value: boolean) => void;
}

// 合并基础属性和 react-hook-form 注册字段属性
type VerificationCodeFieldProps = VerificationCodeFieldBaseProps & UseFormRegisterReturn;

export const VerificationCodeField: React.FC<VerificationCodeFieldProps> = ({
  placeholder,
  error,
  verificationSent,
  countdown,
  onSendCode,
  onVerify,
  // 直接解构 react-hook-form 的 onChange（关键修复）
  onChange: rhfOnChange,
  ...rest
}) => {
  const [loading, setLoading] = useState(false);
  // 增强验证：输入6位数字后触发回调
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    rhfOnChange?.(e); // 调用 react-hook-form 的 onChange
    onVerify?.(value.length === 6 && /^\d{6}$/.test(value));
  };
  const handleClick = async () => {
    setLoading(true);
    await onSendCode();
    setLoading(false);
  }

  return (
    <div className="h-[56px] mt-[28px] relative w-[100%] flex">
      <div className="items-center flex w-[100%]">
        <div className="inline-block text-[14px] h-[100%] relative w-[100%]">
          <input
            type="text"
            placeholder={placeholder}
            maxLength={6}
            className="h-[56px] bg-[#f6f6f6] rounded border border-[#eee] indent-[18px] w-full transition-all duration-300 ease-[cubic-bezier(.645,.045,.355,1)] outline-none focus:border-[#e1140a] focus:bg-white"
            onChange={handleChange} // 覆盖为自定义增强逻辑
            {...rest} // 扩散其他 react-hook-form 属性（onBlur/ref 等）
          />
        </div>
        <button
          type="button"
          onClick={handleClick}
          disabled={verificationSent}
          className="bg-[#fff1f1] border border-[#fadfdf] rounded-[4px] text-[#e1140a] cursor-pointer text-[14px] font-normal h-[56px] tracking-[0] ml-[5px] text-center whitespace-nowrap w-[122px] flex items-center justify-center px-[22px] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-[#ffe8e8]"
        >
          {loading ? '正在发送中' : verificationSent ? `${countdown}秒后重发` : '获取验证码'}
        </button>
      </div>
      {error && (
        <div className="bottom-[-20px] items-center text-[#e1140a] text-[12px] font-normal mt-[4px] absolute">
          <img src={errIcon} alt="错误" className="inline-block h-[11px] ml-1 mr-[3px] w-[11px]" />
          {error}
        </div>
      )}
    </div>
  );
};

export default VerificationCodeField;