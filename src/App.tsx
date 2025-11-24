/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-14 19:42:20
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-24 22:52:52
 * @FilePath: \lenovo-shop\src\App.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
// import AgreementModal from "./Component/AgreementModal "
import { Routes, Route } from "react-router-dom"
import Login from "./pages/Auth/Login"
import Reg from "./pages/Auth/Register"
import MainLayout from "./component/Layout/MainLayout"
import NotFound from "./pages/404"
import NewProduct from "./pages/NewProduct"
import Index from "./pages/Index"
import { Toaster } from "react-hot-toast"

/**
 * App组件：应用程序的主要组件，负责路由配置和布局
 * 包含了页面路由和Toaster提示组件的配置
 */
function App() {
  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />  
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/index" element={<Index />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Reg />} />
          <Route path='/new-product' element={<NewProduct />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
