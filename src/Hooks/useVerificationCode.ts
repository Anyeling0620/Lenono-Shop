/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-21 16:21:14
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-21 17:32:52
 * @FilePath: \lenovo-shop\src\Hooks\useVerificationCode.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import { useState, useCallback, useEffect } from 'react';

/**
 * 验证码倒计时自定义Hook
 * 用于管理验证码发送状态和倒计时功能
 * @returns {Object} 包含发送状态、倒计时数值和倒计时控制函数
 */
const useVerificationCode = () => {
  // 是否正在发送验证码的状态
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const startCountdown = useCallback(() => {
    setIsSending(true);
    setCountdown(60);
  }, []);

  const stopCountdown = useCallback(() => {
    setIsSending(false);
    setCountdown(0);
  }, []);

  /**
   * 停止倒计时
   * 重置发送状态和倒计时数值
   */
  // 自动倒计时
   useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => {
          const newValue = prev - 1;
          if (newValue === 0) {
            setIsSending(false);
          }
          return newValue;
        });
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return {
    isSending,
    countdown,
    startCountdown,
    stopCountdown
  };
};

export default useVerificationCode;