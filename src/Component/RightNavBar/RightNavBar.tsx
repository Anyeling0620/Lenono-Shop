import React, { useEffect, useState } from 'react';
import NavItem from './NavItem';
import ScrollToTop from './ScrollToTop';
import { userIcon, userHoverIcon, qrcodeIcon, coupon, couponHover } from '../../assets/icon';
import UserNavItem from './UserNavItem';
import useAuthStore from '../../store/authStore';

interface NavItemConfig {
    id: string;
    type: 'user' | 'normal' | 'scroll-top';
    normalImage: string;
    hoverImage?: string;
    href?: string;
    alt: string;
    hasPopup?: boolean;
    popupContent?: React.ReactNode;
}    // 导航项配置数据
    const navItemsData: NavItemConfig[] = [
        {
            id: 'user-center',
            type: 'user',
            normalImage: userIcon,
            hoverImage: userHoverIcon,
            href: 'user-center',
            alt: '用户中心'
        },
         {
            id: 'coupon-center',
            type: 'user',
            normalImage: coupon,
            hoverImage: couponHover,
            href: 'coupon-center',
            alt: '领券中心'
        },
        {
            id: 'hotline',
            type: 'normal',
            normalImage: 'https://p1.lefile.cn/fes/cms/2021/11/18/rpgk29e55p0cjid9ez4cuz8ewznrxn514984.png',
            hoverImage: 'https://p3.lefile.cn/fes/cms/2021/11/18/6noe5m3wannox2apbgegy7iwppyz48701133.png',
            alt: '服务热线',
            hasPopup: true,
            popupContent: (
                <div className="text-sm text-gray-700">
                    <div className="font-semibold text-red-600 mb-1">服务热线</div>
                    <div>114-514-6666</div>
                    <div className="text-xs text-gray-500 mt-1">周一至周日 9:00-21:00</div>
                </div>
            )
        },
        {
            id: 'manual-consultation',
            type: 'normal',
            normalImage: 'https://p1.lefile.cn/fes/cms/2025/10/20/50z28vxv0m8xogl4uy0kjpnz1pfe3c035989.jpg',
            hoverImage: 'https://p3.lefile.cn/fes/cms/2025/10/20/4h4gnqksch94pehlf5dtxu6ey6glp4447791.jpg',
            href: 'manual-consultation',
            alt: '人工咨询',
            hasPopup: true,
            popupContent: (
                <div className="text-sm text-gray-700">
                    <div className="font-semibold text-red-600 mb-1">售前咨询</div>
                    <div className="text-xs text-gray-500 mt-1">周一至周日 9:00-22:00</div>
                </div>
            )
        },
        {
            id: 'app-exclusive',
            type: 'normal',
            normalImage: 'https://p1.lefile.cn/fes/cms/2021/11/18/gk8hllzfjk049hrmhzennvh9sh03ib438425.png',
            hoverImage: 'https://p2.lefile.cn/fes/cms/2021/11/18/hg07yka73z8h2md1k5k1yp3vx84r6n953658.png',
            alt: 'APP专享',
            hasPopup: true,
            popupContent: (
                <div className="text-sm text-gray-700 flex">
                    <div className='mr-auto'>
                        <div className="font-semibold text-red-600 mb-1">联想APP</div>
                        <div className="text-xs text-gray-500 mt-1">新人扫码下载</div>
                        <div className="text-xs text-gray-500 mt-1">享受多重福利</div>
                    </div>
                    <div className='ml-auto'>
                        <img src={qrcodeIcon} alt="联想APP" className='w-[70px]' />
                    </div>

                </div>
            )
        },
        {
            id: 'feedback',
            type: 'normal',
            normalImage: 'https://p2.lefile.cn/fes/cms/2022/04/01/uwvmvtszm9zabuoajqf49jwpztu605300884.png',
            hoverImage: 'https://p3.lefile.cn/fes/cms/2022/04/01/m3gvd1j97ejneroqxlczlrz0sqj5ri536853.png',
            href: 'feedback',
            alt: '吐槽反馈'
        },
        {
            id: 'survey',
            type: 'normal',
            normalImage: 'https://p1.lefile.cn/fes/cms/2022/04/01/8umvhtyukxemz1p2vq1yo5c3sopu85703492.png',
            hoverImage: 'https://p3.lefile.cn/fes/cms/2022/04/01/7ww5fagz71s7noo47by6szu4n1y6az548184.png',
            href: 'survey',
            alt: '有奖调研'
        },
       
        {
            id: 'scroll-to-top',
            type: 'scroll-top',
            normalImage: 'https://p4.lefile.cn/fes/cms/2024/07/02/v8siswctj3g5bkdgpkv0c899soq6ri693857.png',
            alt: '返回页面顶部'
        }
    ];

const RightNavBar: React.FC = () => {

        const isLogin = useAuthStore(state => state.isAuthenticated);


    const [isAtTop, setIsAtTop] = useState(true);       // 控制是否在页面顶部

    // 使用useEffect添加滚动监听器，检查滚动位置
    useEffect(() => {
        const checkScrollPosition = () => {
            setIsAtTop(window.scrollY === 0);
        };

        window.addEventListener('scroll', checkScrollPosition);
        checkScrollPosition(); // 初始检查

        // 清理函数，移除事件监听器
        return () => window.removeEventListener('scroll', checkScrollPosition);
    }, []);

    // 处理点击事件，平滑滚动到页面顶部
    const handleClick = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // 如果在页面顶部，则不渲染任何内容
    if (isAtTop) {
        return null; // 在页面顶部时不显示
    }

    // 渲染导航项
    const renderNavItem = (item: NavItemConfig) => {
        switch (item.type) {
            case 'user':
                return (
                    <UserNavItem
                        key={item.id}
                        normalImage={item.normalImage}
                        hoverImage={item.hoverImage}
                        href={item.href || '#'}
                        alt={item.alt}
                    />
                );

            case 'scroll-top':
                return (
                    <ScrollToTop
                        key={item.id}
                        normalImage={item.normalImage}
                        hoverImage={item.hoverImage}
                        alt={item.alt}
                        handleScrollToTop={handleClick}
                    />
                );

            case 'normal':
                return (
                    <NavItem
                        key={item.id}
                        normalImage={item.normalImage}
                        hoverImage={item.hoverImage}
                        href={item.href}
                        alt={item.alt}
                        hasPopup={item.hasPopup}
                    >
                        {item.popupContent}
                    </ NavItem>
                );
            default:
                break;
        }
    };

    return (
        <div className='top-[20%] block w-[70px] h-auto z-[11112] fixed right-5 bg-white/50 shadow-md backdrop-blur-md rounded-lg overflow-visible transition-all duration-300'>
            <ul>
                {navItemsData.filter(item=>{
                    if( !isLogin&&(item.id === 'user-center' )){
                        return false;
                    }
                    return true;
                }).map(renderNavItem)}
            </ul>
        </div>
    );
};

export default RightNavBar;
