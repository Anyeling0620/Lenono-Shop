/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-20 20:39:28
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-12-02 17:27:31
 * @FilePath: \lenovo-shop\src\component\Header\AuthLinks.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AgreementModal from "../Auth/AgreementModal ";
import { Popover } from "antd";
import UserInfoCard from "../UserInfoCard/UserInfoCard";
import { axiosService } from "../../services/axiosService";
import { globalErrorHandler } from "../../utils/globalAxiosErrorHandler";
import toast from "react-hot-toast";

/**
 * AuthLinks 组件：用于显示注册和登录链接
 * 包含点击注册按钮时显示用户协议弹窗的功能
 */
const AuthLinks: React.FC = () => {
    // 使用 useNavigate hook 获取导航功能
    const navigate = useNavigate();
    // 控制用户协议弹窗的显示状态
    const [showAgreement, setShowAgreement] = useState(false);
    const handleRegisterClick = () => setShowAgreement(true);
    const handleClose = () => setShowAgreement(false);
    const handleConfirm = () => {
        setShowAgreement(false);
        navigate("/register");
    };
    const handleLodin = () => {
        navigate("/login");
    }
    const handleLogout = async () => {
        try { await axiosService.logoutDevice(axiosService.getCurrentDeviceInfo().deviceId)}
        catch (error) { globalErrorHandler.handle(error, toast.error) }
    }

    return (<>
        <div className="float-right relative">
            <div className=" relative text-[12.5px] flex items-center gap-2">
                {false && <>
                    <AuthLink onClick={handleRegisterClick}>
                        注册
                    </AuthLink>
                    <i className="border-l h-[11px] inline-block my-[-1px] mx-2"></i>
                    <AuthLink onClick={handleLodin}>
                        登陆
                    </AuthLink>
                </>}
                {
                    true &&
                    <>
                        {/* open={false} */}
                        <Popover arrow={false} zIndex={1000} placement={"bottomRight"} content={<UserInfoCard />}>
                            <></><User children="魔法少女小圆123456789" />
                        </Popover>
                        <i className="border-l h-[11px] inline-block mx-2 rounded-e-sm"></i>
                        <AuthLink onClick={handleLogout}>
                            登出
                        </AuthLink>
                    </>
                }
            </div>
        </div>
        <AgreementModal
            visible={showAgreement}
            onConfirm={handleConfirm}
            onClose={handleClose}
        />
    </>

    );
};

const User: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <span className="text-red-500 leading-[60px]  block cursor-pointer truncate max-w-[90px] overflow-hidden hover:underline decoration-4 underline-offset-[22px] transition-all duration-300">
            {children}
        </span>
    );
}


const AuthLink: React.FC<{ children: React.ReactNode; onClick: () => void }> = ({ children, onClick }) => {
    return (
        <span
            className="text-[#b5b5b5] leading-[60px]  hover:text-red-500 cursor-pointer transition-colors duration-200"
            onClick={onClick}
        >
            {children}
        </span>
    );
}

export default AuthLinks;
