/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-14 19:42:20
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-12-02 13:57:20
 * @FilePath: \lenovo-shop\vite.config.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
})
