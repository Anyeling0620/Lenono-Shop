import React from 'react';
import SpecialNavItem from './SpecialNavItem';
import NavItem from './NavItem';
import ScrollToTop from './ScrollToTop';

interface NavItemConfig {
    id: string;
    type: 'special' | 'normal' | 'scroll-top';
    normalImage: string;
    hoverImage?: string;
    href?: string;
    alt: string;
    hasPopup?: boolean;
    popupContent?: React.ReactNode;
}

const RightNavBar: React.FC = () => {

    // 导航项配置数据
    const navItemsConfig: NavItemConfig[] = [
        {
            id: 'lenovo-enjoy',
            type: 'special',
            normalImage: 'https://p1.lefile.cn/mobile/lc/app/component/237831153a444378ba6196713e06a0c0.jpg',
            href: '/lenovo-enjoy',
            alt: '联想乐享'
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
                    <div>400-990-8888</div>
                    <div className="text-xs text-gray-500 mt-1">周一至周日 9:00-18:00</div>
                </div>
            )
        },
        {
            id: 'manual-consultation',
            type: 'normal',
            normalImage: 'https://p1.lefile.cn/fes/cms/2025/10/20/50z28vxv0m8xogl4uy0kjpnz1pfe3c035989.jpg',
            hoverImage: 'https://p3.lefile.cn/fes/cms/2025/10/20/4h4gnqksch94pehlf5dtxu6ey6glp4447791.jpg',
            href: '/manual-consultation',
            alt: '人工咨询'
        },
        {
            id: 'app-exclusive',
            type: 'normal',
            normalImage: 'https://p1.lefile.cn/fes/cms/2021/11/18/gk8hllzfjk049hrmhzennvh9sh03ib438425.png',
            hoverImage: 'https://p2.lefile.cn/fes/cms/2021/11/18/hg07yka73z8h2md1k5k1yp3vx84r6n953658.png',
            alt: 'APP专享',
            hasPopup: true,
            popupContent: (
                <div className="text-sm text-gray-700">
                    <div className="font-semibold mb-1">APP专享福利</div>
                    <div className="text-xs">
                        <div>• 新人专享大礼包</div>
                        <div>• 会员专属优惠</div>
                        <div>• 积分兑换好礼</div>
                    </div>
                </div>
            )
        },
        {
            id: 'feedback',
            type: 'normal',
            normalImage: 'https://p2.lefile.cn/fes/cms/2022/04/01/uwvmvtszm9zabuoajqf49jwpztu605300884.png',
            hoverImage: 'https://p3.lefile.cn/fes/cms/2022/04/01/m3gvd1j97ejneroqxlczlrz0sqj5ri536853.png',
            href: '/feedback',
            alt: '吐槽反馈'
        },
        {
            id: 'survey',
            type: 'normal',
            normalImage: 'https://p1.lefile.cn/fes/cms/2022/04/01/8umvhtyukxemz1p2vq1yo5c3sopu85703492.png',
            hoverImage: 'https://p3.lefile.cn/fes/cms/2022/04/01/7ww5fagz71s7noo47by6szu4n1y6az548184.png',
            href: '/survey',
            alt: '有奖调研'
        },
        {
            id: 'scroll-to-top',
            type: 'scroll-top',
            normalImage: 'https://p4.lefile.cn/fes/cms/2024/07/02/v8siswctj3g5bkdgpkv0c899soq6ri693857.png',
            alt: '返回页面顶部'
        }
    ];



    // 渲染导航项
    const renderNavItem = (item: NavItemConfig) => {
        switch (item.type) {
            case 'special':
                return (
                    <SpecialNavItem
                        key={item.id}
                        image={item.normalImage}
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
                    />
                );

            case 'normal':
            default:
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
        }
    };

    return (
        <div className='top-[20%] block w-[70px] h-auto z-[11112] fixed right-5 bg-white/50 shadow-md backdrop-blur-md rounded-lg overflow-hidden transition-all duration-300'>
            {navItemsConfig.map(renderNavItem)}
        </div>
    );
};

export default RightNavBar;
