
import React from 'react'
import Logo from './Logo'
import Navbar from './Navbar'
import AuthLinks from './AuthLinks'
import SearchBar from './SearchBar'
import { useLocation } from 'react-router-dom'
import {type HiddenPaths } from '../../types/hiddenPaths'
import type { NavItem } from '../../types/navItem'


const navItems: NavItem[] = [
    { name: "新品", path: "/new" },
    { name: "游戏本", path: "/game" },
    { name: "台式机", path: "/pc" },

]


const Header: React.FC = () => {
    const location = useLocation()
    const hiddenPaths: HiddenPaths = {
        paths: ["/login", "/register"]
    }
    const isHidden: boolean = hiddenPaths.paths.includes(location.pathname)


    return (
        <header className="bg-white top-0 left-0 min-w-[1200px]">
            <div className="w-[1200px] m-auto h-[60px] relative">
                <Logo />
                {!isHidden &&
                    <><Navbar items={navItems} />
                        <AuthLinks />
                        <SearchBar />
                    </>}
            </div>
        </header>
    )
}

export default Header
