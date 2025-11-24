import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../component/Auth/AuthForm";
import AuthBackground from "./AuthBackground";

const Register: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuthBackground>
      <AuthForm
        type="register"
        onSwitchAuth={() => navigate("/login")}
      />
    </AuthBackground >
  );
};

export default Register;
