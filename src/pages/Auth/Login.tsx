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
import AuthBackground from "./AuthBackground";

const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuthBackground >
      <AuthForm
        type="login"
        onSwitchAuth={() => navigate("/register")}
      />
    </AuthBackground>


  );
};

export default Login;
