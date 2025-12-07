import { useEffect } from "react";
import useAuthStore from "../store/authStore";
import useUserInfoStore from "../store/userInfostore";
import { EVENT_NAMES } from "../services/axiosService";
import globalErrorHandler from "../utils/globalAxiosErrorHandler";
import toast from "react-hot-toast";
import { getUserInfo } from "../services/accountInfo";




const handleLoginUserInfo = async () => {
    try {
        const userInfo = await getUserInfo();
        useUserInfoStore.getState().setUserInfo(userInfo);
    } catch (error) {
        globalErrorHandler.handle(error, toast.error);
    }
}

const useAuthLifecycle = () => {
    useEffect(() => {

        const handleToken = () => {
            useAuthStore.getState().login();
            handleLoginUserInfo();
        }

        const handleExpired = () => {
            useAuthStore.getState().logout();
            useUserInfoStore.getState().clearUserInfo(); // 清空用户信息
        }
        window.addEventListener(EVENT_NAMES.AUTH_EXPIRED, handleExpired);
        window.addEventListener(EVENT_NAMES.TOKEN_REFRESHED, handleToken);
        return () => {
            window.removeEventListener(EVENT_NAMES.TOKEN_REFRESHED, handleToken);
            window.removeEventListener(EVENT_NAMES.AUTH_EXPIRED, handleExpired);
        }
    }, [])
}


export default useAuthLifecycle;