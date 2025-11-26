/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-14 20:43:40
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-21 17:28:51
 * @FilePath: \lenovo-shop\src\Component\Auth\AgreementModal .tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import React from "react";
import { agreementContent } from "../../assets/agreementContent";

interface AgreementModalProps {
  visible: boolean;          // 是否显示弹窗
  onConfirm: () => void;     // 点击“同意并继续”
  onClose: () => void;       // 点击关闭按钮
}

const AgreementModal: React.FC<AgreementModalProps> = ({ visible, onConfirm, onClose }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/30 flex items-center justify-center">
      <div className="relative w-[801px] h-[550px] p-[40px_36px_40px_40px] bg-white box-border">
        {/* 关闭按钮 */}
        <button
          className="absolute right-[15px] top-[15px] w-[16px] h-[16px] bg-[url(https://p1.lefile.cn/fes/cms/2021/10/18/9fnorr6ss2soyg1bwy4w6m93wgenyl346578.png)] bg-contain bg-no-repeat cursor-pointer"
          onClick={onClose}
        />

        <h3 className="text-[20px] font-bold text-center mb-5 text-[#252525]">联想账号用户注册协议</h3>

        <p className="text-[13px] text-[#252525] leading-[22px] mb-2">
          请您仔细阅读以下条款及援引的相关条款，其中包含对您使用联想账号有重要影响的条款，您同意后方可使用联想账号及相关功能。
          详细内容请查看
          <a href="#" className="text-red-600 no-underline">用户注册协议</a>
        </p>

        {/* 协议滚动区域 */}
        <div className="h-[303px] overflow-y-scroll mb-4 p-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded">
          <div className="space-y-4">
              {agreementContent}
          </div>
        </div>

        {/* 确认按钮 */}
        <button
          className="w-[300px] h-[48px] bg-[#e1140a] text-white text-[17px] mx-auto block cursor-pointer"
          onClick={onConfirm}
        >
          同意并继续
        </button>
      </div>
    </div>
  );
};

export default AgreementModal;
