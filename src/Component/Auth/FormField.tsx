import React, { useState } from 'react';
import { errIcon } from '../../assets/icon';

interface FormFieldProps {
  name: string;
  type: 'email' | 'password' | 'text' | 'number';
  placeholder: string;
  value?: string;
  error?: string;
  onChange?: (value: string) => void;
}

/**
 * 表单字段组件
 * 用于渲染一个带有错误提示的表单输入框
 */
export const FormField: React.FC<FormFieldProps> = ({
  name,       // 输入框的名称
  type,       // 输入框的类型
  placeholder, // 占位符文本
  value,      // 输入框的值
  error,      // 错误信息
}) => {

  // 使用内部状态管理输入值，以便在值变化时进行控制
  const [internalValue, setInternalValue] = useState(value);
  // 处理输入值变化的函数
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
  }

  return (
    // 外层容器，设置高度、外边距和相对定位
    <div className="h-[56px] mt-[28px] relative w-[100%]">
      {/* 内层容器，用于包裹输入框，设置文本大小、高度和相对定位 */}
      <div className="inline-block text-[14px] h-[100%] relative w-[100%]">
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={internalValue}
          onChange={handleChange}
          className="rounded bg-[#f6f6f6] border border-[#eee] h-full indent-[18px] w-full transition-all duration-300 ease-[cubic-bezier(.645,.045,.355,1)] outline-none focus:border-[#e1140a] focus:bg-white"
        />

      </div>
      {error && (
        <div className="flex items-center text-[#e1140a] text-[12px] font-normal mt-[4px] absolute">
          <img src={errIcon} alt="错误" className="inline-block h-[11px] ml-1 mr-[3px] w-[11px]" />
          {error}
        </div>
      )}
    </div>
  );
};

export default FormField;