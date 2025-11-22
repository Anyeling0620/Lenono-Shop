/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-14 19:42:20
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-22 12:32:21
 * @FilePath: \lenovo-shop\src\App.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
// import AgreementModal from "./Component/AgreementModal "
import { Routes, Route } from "react-router-dom"
import Login from "./pages/Auth/Login"
import Reg from "./pages/Auth/Register"
import Index from "./pages/Index"
import MainLayout from "./Component/Layout/MainLayout"
import NotFound from "./pages/404"

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/index" element={<Index />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Reg />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>


    </>
  )
}

export default App
