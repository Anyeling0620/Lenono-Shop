/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-22 10:58:21
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-22 10:58:35
 * @FilePath: \lenovo-shop\src\Component\Layout\MainLayout.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import RightNavBar from "../RightNavBar/RightNavBar";
import { Outlet, useLocation } from "react-router-dom";

export default function MainLayout() {
  const location = useLocation();
  const hiddenFooterPaths = ["/login", "/register"];
  const hideFooter = hiddenFooterPaths.includes(location.pathname);

  return (
    <>
      <Header />
      <RightNavBar />
      {/* 修改这里：添加一个 div 包裹 Outlet，并设置 pt-[60px] */}
      {/* 这样内容就会往下移 60px，刚好露出 Header */}
      <div className="pt-[60px] min-h-screen"> 
        <Outlet />
      </div>
      {!hideFooter
        && <Footer />
      }
    </>
  );
}
