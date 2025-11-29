import React from 'react';
import { errIcon } from '../../assets/icon';
import type { UseFormRegisterReturn } from 'react-hook-form';

// 直接继承 react-hook-form 注册字段的属性，无需单独定义 register
interface FormFieldProps {
  type: 'email' | 'password' | 'text' | 'number';
  placeholder: string;
  error?: string;
}

// 合并 FormFieldProps 和 UseFormRegisterReturn 的属性
type Props = FormFieldProps & UseFormRegisterReturn;

export const FormField: React.FC<Props> = ({
  type,
  placeholder,
  error,
  // 直接接收 react-hook-form 的核心属性（onChange/onBlur/ref 等）
  onChange,
  onBlur,
  ref,
  ...rest
}) => {
  return (
    <div className="h-[56px] mt-[28px] relative w-[100%]">
      <div className="inline-block text-[14px] h-[100%] relative w-[100%]">
        <input
          type={type}
          placeholder={placeholder}
          onChange={onChange} // 直接使用 react-hook-form 的 onChange
          onBlur={onBlur}     // 直接使用 react-hook-form 的 onBlur
          ref={ref}           // 直接使用 react-hook-form 的 ref
          className="rounded bg-[#f6f6f6] border border-[#eee] h-full indent-[18px] w-full transition-all duration-300 ease-[cubic-bezier(.645,.045,.355,1)] outline-none focus:border-[#e1140a] focus:bg-white"
          {...rest}
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