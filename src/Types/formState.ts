/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-21 14:37:06
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-21 14:37:16
 * @FilePath: \lenovo-shop\src\Types\formState.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
export interface FormState {
  data: {
    email: string;
    password: string;
    verificationCode: string;
  };
  errors: {
    email?: string;
    password?: string;
    verificationCode?: string;
  };
  message?: string;
}