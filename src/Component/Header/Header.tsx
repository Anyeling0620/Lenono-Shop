/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-22 13:39:26
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-23 15:50:33
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
import { type HiddenPaths } from '../../types/hiddenPaths'
import type { NavItem } from '../../types/navItem'


const navItems: NavItem[] = [
    { name: "新品", path: "/new-product" },
    { name: "Lenovo电脑", path: "/lenovo-computer" },
    { name: "ThinkPad电脑", path: "/thinkpad-computer" },
    { name: "平板电脑", path: "/tablet" },
    { name: "手机", path: "/phone" },
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
