/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-14 19:42:20
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-21 17:31:37
 * @FilePath: \lenovo-shop\src\App.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
// import AgreementModal from "./Component/AgreementModal "
import Footer from "./Component/Footer/Footer"
import Header from "./Component/Header/Header"
import { Routes, Route, useLocation } from "react-router-dom"
import Login from "./pages/Auth/Login"
import Reg from "./pages/Auth/Register"
import RightNavBar from "./Component/RightNavBar/RightNavBar"
import Index from "./pages/Index"
import type { HiddenPaths } from "./Types/hiddenPaths"



function App() {
  const location = useLocation();

  // 使用接口类型管理需要隐藏组件的路径
  const hiddenPaths: HiddenPaths = {
    paths: ["/login", "/register"]
  };
  const isHidden: boolean = hiddenPaths.paths.includes(location.pathname);

  return (
    <>
      <Header />
      <RightNavBar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Reg />} />
      </Routes>
      {!isHidden
        &&
        <Footer />
      }
    </>
  )
}

export default App
