import { useEffect } from "react";
import useAuthStore from "../store/authStore";
import useUserInfoStore from "../store/userInfostore";
import { EVENT_NAMES } from "../services/AxiosService";
import globalErrorHandler from "../utils/globalAxiosErrorHandler";
import toast from "react-hot-toast";
import { getUserInfo } from "../services/accountInfo";
import { useNavigate } from "react-router-dom";



const handleLoginUserInfo = async () => {
    try {
        const userInfo = await getUserInfo();
        useUserInfoStore.getState().setUserInfo(userInfo);
        
    } catch (error) {
        globalErrorHandler.handle(error, toast.error);
    }
}

const useAuthLifecycle = () => {
    const nav = useNavigate();
    useEffect(() => {

        const handleToken = () => {
            useAuthStore.getState().login();
            // 延迟执行用户信息获取，避免阻塞UI
            setTimeout(() => {
                handleLoginUserInfo();
            }, 100);
        }

        const handleExpired = () => {
            useAuthStore.getState().logout();
            useUserInfoStore.getState().clearUserInfo(); // 清空用户信息
            // 延迟导航，避免立即跳转
            setTimeout(() => {
                nav('/')
            }, 50);
        }
        
        // 添加性能监控
        const startTime = performance.now();
        
        window.addEventListener(EVENT_NAMES.AUTH_EXPIRED, handleExpired);
        window.addEventListener(EVENT_NAMES.TOKEN_REFRESHED, handleToken);
        
        const endTime = performance.now();
        console.log(`[性能监控] useAuthLifecycle 初始化耗时: ${endTime - startTime}ms`);
        
        return () => {
            window.removeEventListener(EVENT_NAMES.TOKEN_REFRESHED, handleToken);
            window.removeEventListener(EVENT_NAMES.AUTH_EXPIRED, handleExpired);
        }
    }, [])
}


export default useAuthLifecycle;