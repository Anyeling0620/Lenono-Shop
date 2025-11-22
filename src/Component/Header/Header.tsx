
/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-14 20:13:36
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-20 21:26:31
 * @FilePath: \lenovo-shop\src\Component\Header\Header.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import React from 'react'
import Logo from './Logo'
import Navbar from './Navbar'
import AuthLinks from './AuthLinks'
import SearchBar from './SearchBar'
import { useLocation } from 'react-router-dom'
import {type HiddenPaths } from '../../Types/hiddenPaths'
import type { NavItem } from '../../Types/navItem'


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
