/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-17 16:34:10
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-21 13:53:52
 * @FilePath: \lenovo-shop\src\pages\Auth\Login.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../Component/Auth/AuthForm";

const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="text-[12px] m-0 p-0">
      <div className="h-[100%] w-[100%] block">
        <div className="bg-[url(https://p1.lefile.cn/lenovo_auth/login_adbg.jpg)] bg-no-repeat bg-center bg-[length:1920px_800px] h-[800px] relative w-[100%]">
          <div className="box-border h-[100%] mx-auto pt-16 w-[1200px]">
            <AuthForm 
              type="login"
              onSwitchAuth={() => navigate("/register")}   
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
