import Header from "../Header/Header";
import { Outlet } from "react-router-dom";

export default function UserLayout() {

  return (
    <>
      <Header />
      <div className="pt-[60px] min-h-screen"> 
        <Outlet />
      </div>
    </>
  );
}
