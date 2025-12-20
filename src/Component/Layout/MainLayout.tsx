

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
      <div className="pt-[60px] min-h-screen"> 
        <Outlet />
      </div>
      {!hideFooter
        && <Footer />
      }
    </>
  );
}
