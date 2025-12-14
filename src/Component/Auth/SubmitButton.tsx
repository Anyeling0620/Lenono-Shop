import React from 'react';

interface SubmitButtonProps {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string; // 自定义样式类名
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  label,
  loading = false,
  disabled = false,
  type = 'submit',
  onClick,
  className='',
}) => {
 
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${className} tracking-[10px] my-[8px_auto_10px] bg-gradient-to-r ${disabled ? 'from-[#ff988d] to-[#ff5d5d]':'from-[#f22d18] to-[#e53939]'}  border-0 rounded-[4px] shadow-[0_4px_10px_0_hsla(3,45%,67%,.49)] text-white cursor-pointer text-[16px] font-normal h-[56px] text-centerdisabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_6px_15px_0_hsla(3,45%,67%,.6)] transition-all duration-300 `}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          处理中...
        </div>
      ) : (
        label
      )}
    </button>
  );
};

export default SubmitButton;