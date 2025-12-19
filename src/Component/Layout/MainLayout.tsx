

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
