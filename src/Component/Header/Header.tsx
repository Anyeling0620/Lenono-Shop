import React from 'react'
import Logo from './Logo'
import Navbar from './Navbar'
import AuthLinks from './AuthLinks'
import SearchBar from './SearchBar'
import { useLocation } from 'react-router-dom'
import type { NavItem } from '../../types/navItem'
import type { HiddenPaths } from '../../types/hiddenPaths'


const navItems: NavItem[] = [
    { name: "新品", path: "/new-product" },
    { name: "笔记本", path: "notebooks" },
    { name: "平板", path: "tablets" },
    { name: "台式机", path: "desktops" },
    { name: "显示器", path: "monitor" },
    { name: "手机", path: "phones" },
    { name: "配件", path:"fittings"},
]

const Header: React.FC = () => {
    const location = useLocation()
    const hiddenPaths: HiddenPaths = {
        paths: ["/login", "/register"]
    }
    const isHidden: boolean = hiddenPaths.paths.includes(location.pathname)

    return (
        <header className="bg-white fixed top-0 left-0 min-w-[1200px] w-full z-50 shadow-md h-[60px]">
            <div className="w-[1200px] m-auto h-[60px] relative">
                <Logo />
                {!isHidden &&
                    <>
                        <Navbar items={navItems} />
                        <AuthLinks />
                        <SearchBar />
                    </>
                }
            </div>
        </header>
    )
}

export default Header
