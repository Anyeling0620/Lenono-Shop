/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-20 20:38:53
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-24 23:04:43
 * @FilePath: \lenovo-shop\src\component\Header\Navbar.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useTransition } from "react";
import { Link, useLocation } from "react-router-dom";
import type { NavItem } from "../../types/navItem";


interface NavbarProps {
  items: NavItem[];
}

/**
 * Navbar组件，用于显示导航栏
 * @param items - 导航栏项目数组，每个项目包含path和name属性
 */
const Navbar: React.FC<NavbarProps> = ({ items }) => {
  // 获取当前路由路径
  const location = useLocation();   
  // 状态管理：当前激活的导航项路径
  const [active, setActive] = useState(location.pathname); 
  // 使用React 18的Transition API，优化状态更新时的渲染性能
  const [, startTransition] = useTransition(); 

  /**
   * 处理导航项点击事件
   * @param path - 点击的导航项对应路径
   */
  const handleClick = (path: string) => {
    // 使用startTransition将状态更新标记为非紧急状态，避免阻塞UI
    startTransition(() => {
      setActive(path);
    });
  };

  return (
    <ul className="float-left h-[60px] ml-[62px] m-0 list-none">
      {items.map((item) => (
        <li
          key={item.path}
          className="
            group float-left mr-[26px] mt-1 h-[56px]
            leading-[56px] transition-all duration-200 cursor-pointer
            border-b-4 border-transparent hover:border-red-500
          "
          onClick={() =>{ handleClick(item.path)}}
        >
          <Link
            to={item.path}
            className={`
              text-[16px] font-normal no-underline transition-colors duration-200
              ${active === item.path ? "text-red-500" : "text-[#252525]"}
            `}
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Navbar;
