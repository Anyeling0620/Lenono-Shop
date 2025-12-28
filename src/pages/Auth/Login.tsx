
import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../component/Auth/AuthForm";
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
