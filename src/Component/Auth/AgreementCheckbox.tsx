import React from 'react';
import { agreeIcon,agreeOkIcon } from '../../assets/icon';

interface AgreementCheckboxProps {
  agreed: boolean;
  onToggle: () => void;
}

export const AgreementCheckbox: React.FC<AgreementCheckboxProps> = ({
  agreed,
  onToggle
}) => {
  return (
    <div className="mt-[70px] w-full flex">
      <div className="items-start">
        <div 
          className="flex items-center cursor-pointer"
          onClick={
            () =>{
              onToggle();
            }
          }
        >
          {/* 修正：agreed 为 true 时显示已选中图标，false 时显示未选中图标 */}
          <img 
            src={agreed ? agreeOkIcon : agreeIcon} 
            alt={agreed ? "已同意协议" : "未同意协议"} 
            className="h-[16px] mr-2 w-4 transition-opacity" 
          />
          <p className="leading-[16px] text-[#252525] text-[12px] font-normal tracking-[0] m-0 p-0">
            已阅读并同意
            <span className="text-[#252525] font-bold px-[5px]">
              <a 
                className="inline-block hover:text-[#e1140a] transition-colors" 
                href="https://www.lenovo.com.cn/statement/register_protocol.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                注册协议、
              </a>
              <a 
                className="inline-block hover:text-[#e1140a] transition-colors" 
                href="https://www.lenovo.com.cn/statement/privacy.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                隐私政策、
              </a>
              <a 
                className="inline-block hover:text-[#e1140a] transition-colors" 
                href="https://shop.lenovo.com.cn/statement/salesagreement.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                销售条款
              </a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgreementCheckbox;
