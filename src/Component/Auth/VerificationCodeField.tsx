import React, { useState } from 'react';
import { errIcon } from '../../assets/icon';

interface VerificationCodeFieldProps {
  name: string;
  placeholder: string;
  value?: string;
  error?: string;
  verificationSent: boolean;
  countdown: number;
  onSendCode: () => void;
  onVerify?: (value: boolean) => void;
  onChange?: (value: string) => void;
}

/**
 * 验证码输入框组件
 * 用于用户输入验证码并提供获取验证码的功能按钮
 */
export const VerificationCodeField: React.FC<VerificationCodeFieldProps> = ({
  name,           // 输入框的名称属性
  placeholder,    // 输入框的占位符文本
  value,          // 输入框的值
  error,          // 错误信息
  verificationSent, // 验证码是否已发送
  countdown,      // 重发验证码倒计时
  onVerify,       // 验证码是否输入正确格式的回调函数
  onSendCode,     // 发送验证码的回调函数
}) => {
  // 内部状态管理，用于处理输入框的值
  const [internalValue, setInternalValue] = useState(value);
  // 处理输入框值变化的函数
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    if (newValue?.length === 6) {
        onVerify?.(true);
    } else {
        onVerify?.(false);
    }
}

  return (
    // 主容器，设置高度、外边距和相对定位
    <div className="h-[56px] mt-[28px] relative w-[100%] flex">
      {/* 内容容器，使用flex布局 */}
      <div className="items-center flex w-[100%]">
        {/* 输入框容器 */}
        <div className="inline-block text-[14px] h-[100%] relative w-[100%]">
          {/* 验证码输入框 */}
          <input
            name={name}              // 输入框名称
            type="text"              // 输入类型为文本
            placeholder={placeholder} // 占位符文本
            value={internalValue}    // 输入框的值
            onChange={handleChange} // 值变化处理函数
            maxLength={6}            // 最大长度限制为6位
            className="h-[56px] bg-[#f6f6f6] rounded border border-[#eee] indent-[18px] w-full transition-all duration-300 ease-[cubic-bezier(.645,.045,.355,1)] outline-none focus:border-[#e1140a] focus:bg-white"
          />
        </div>
        {/* 获取验证码按钮 */}
        <button
          type="button"
          onClick={onSendCode}
          disabled={verificationSent}
          className="bg-[#fff1f1] border border-[#fadfdf] rounded-[4px] text-[#e1140a] cursor-pointer text-[14px] font-normal h-[56px] tracking-[0] ml-[5px] text-center whitespace-nowrap w-[122px] flex items-center justify-center px-[22px] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-[#ffe8e8]"
        >
          {verificationSent ? `${countdown}秒后重发` : '获取验证码'}
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