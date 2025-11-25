// components/FlashSale.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TimeDisplay from './TimeDisplay';
import ProductCard from './ProductCard';
import SessionTab from './SessionTab';
import type { Product, flashSaleMenu, TimeInfo } from '../../types/flashSale';

// Mock data - 在实际项目中应该从 API 获取
const mockSessions: flashSaleMenu[] = [
    {
        id: '1',
        time: '2025-11-26-12-00-00',
        duration: '6h',
        products: [
            {
                id: '1',
                name: '联想有线鼠标 M280',
                image: 'https://p3.lefile.cn/product/adminweb/2025/08/19/rUVzuGyeMITeoRCvxtdtW7CKe-8992.jpg',
                currentPrice: 9.9,
                originalPrice: 29.9,
                discount: 4.6,
                link: '/product/1'
            },
            {
                id: '2',
                name: '联想有线鼠标 M280',
                image: 'https://p3.lefile.cn/product/adminweb/2025/08/19/rUVzuGyeMITeoRCvxtdtW7CKe-8992.jpg',
                currentPrice: 9.9,
                originalPrice: 29.9,
                discount: 4.6,
                link: '/product/1'
            },
            {
                id: '3',
                name: '联想有线鼠标 M280',
                image: 'https://p3.lefile.cn/product/adminweb/2025/08/19/rUVzuGyeMITeoRCvxtdtW7CKe-8992.jpg',
                currentPrice: 9.9,
                originalPrice: 29.9,
                discount: 4.6,
                link: '/product/1'
            },
            {
                id: '4',
                name: '联想有线鼠标 M280',
                image: 'https://p3.lefile.cn/product/adminweb/2025/08/19/rUVzuGyeMITeoRCvxtdtW7CKe-8992.jpg',
                currentPrice: 9.9,
                originalPrice: 29.9,
                discount: 4.6,
                link: '/product/1'
            },
        ]
    },
    {
        id: '2',
        time: '2025-11-27-18-00-00',
        duration: '6h',
        products: [
            {
                id: '1',
                name: '啊哈哈',
                image: 'https://p3.lefile.cn/product/adminweb/2025/08/19/rUVzuGyeMITeoRCvxtdtW7CKe-8992.jpg',
                currentPrice: 19.9,
                originalPrice: 29.9,
                discount: 4.6,
                link: '/product/1'
            },
        ]
    },
    {
        id: '3',
        time: '2025-11-25-18-00-00',
        duration: '32h',
        products: [
            {
                id: '1',
                name: '啊哈哈',
                image: 'https://p3.lefile.cn/product/adminweb/2025/08/19/rUVzuGyeMITeoRCvxtdtW7CKe-8992.jpg',
                currentPrice: 19.9,
                originalPrice: 29.9,
                discount: 4.6,
                link: '/product/1'
            },
             {
                id: '2',
                name: '啊哈哈啊啊',
                image: 'https://p3.lefile.cn/product/adminweb/2025/08/19/rUVzuGyeMITeoRCvxtdtW7CKe-8992.jpg',
                currentPrice: 19.9,
                originalPrice: 29.9,
                discount: 4.6,
                link: '/product/1'
            },
             {
                id: '3',
                name: '啊哈a哈',
                image: 'https://p3.lefile.cn/product/adminweb/2025/08/19/rUVzuGyeMITeoRCvxtdtW7CKe-8992.jpg',
                currentPrice: 19.9,
                originalPrice: 29.9,
                discount: 4.6,
                link: '/product/1'
            },
        ]
    }
];

const FlashSale: React.FC = () => {
    const [activeSession, setActiveSession] = useState<flashSaleMenu>(mockSessions[0]);

    // Mock time data - 在实际项目中应该实时计算
    const mockTimeInfo: TimeInfo = {
        session: activeSession.time,
        duration: activeSession.duration,
        time: activeSession.time
    };
    if (activeSession.id === '') return null;

    return (
        <div className="w-full mx-auto my-0 relative">
            <div className="pt-[20px]">
                <div className="relative w-[1200px] h-[340px] mx-auto my-0">
                    {/* 左侧时间信息 */}
                    <SessionInfo timeInfo={mockTimeInfo} />

                    {/* 中间商品区域 */}
                    <div className="w-[918px] absolute left-[230px] right-[49px] overflow-hidden bg-white">
                        {/* 场次标签栏 */}
                        <SessionTabs
                            sessions={mockSessions}
                            activeSession={activeSession}
                            onSessionChange={setActiveSession}
                        />

                        {/* 商品列表 */}
                        <ProductList products={activeSession.products} />
                    </div>

                    {/* 右侧更多链接 */}
                    <MoreLink />
                </div>
            </div>
        </div>
    );
};

const SessionInfo: React.FC<{ timeInfo: TimeInfo }> = ({ timeInfo }) => (
    <Link to="/flash-sale">
        <div className="absolute left-0 w-[230px] h-[340px] bg-[url(https://p2.lefile.cn/product/adminweb/2019/11/26/2b4b9fee-84ee-4fb1-9891-3b3390fb5fd5.png)] bg-[length:230px_340px]">
            <div className="mt-[44px] text-center">
                <i className="inline-block w-[120px] h-[27px] bg-[url(https://p1.lefile.cn/product/adminweb/2019/11/26/72f84116-d80c-4fb3-a39e-ae16271f6c76.png)] bg-[length:120px_27px]"></i>
            </div>
            <div className="text-center">
                <i className="inline-block mt-[22px] w-[28px] h-[60px] bg-[url(https://p2.lefile.cn/product/adminweb/2019/12/11/eb749e1e-e9fa-48ba-95a9-b2041ad01154.png)] bg-[length:28px_60px]"></i>
            </div>
            <TimeDisplay timeInfo={timeInfo} className="mt-[14px]" />
        </div>
    </Link>
);

const SessionTabs: React.FC<{
    sessions: flashSaleMenu[];
    activeSession: flashSaleMenu;
    onSessionChange: (session: flashSaleMenu) => void;
}> = ({ sessions, activeSession, onSessionChange }) => (
    <div className="h-[66px] leading-[66px] bg-white border-b border-b-[#e8e8e8]">
        <ul className="overflow-hidden h-full ml-[22px] text-[0px] list-none">
            {sessions.map((session) => (
                <SessionTab
                    key={session.id}
                    session={session}
                    isActive={session.id === activeSession.id}
                    onClick={() => onSessionChange(session)}
                />
            ))}
        </ul>
    </div>
);

const ProductList: React.FC<{ products: Product[] }> = ({ products }) => (
    <div className="my-0 ml-[23px] mr-0">
        <div className="m-0">
            <ul className="w-full text-[0px] h-[273px] overflow-hidden list-none">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </ul>
        </div>
    </div>
);

const MoreLink: React.FC = () => (
    <Link to="/flash-sale" className=" no-underline">
        <div className="absolute right-0 w-[49px] h-[340px] bg-gradient-to-br from-[#ec1111] from-1% to-[#ff8200] to-99%">
            <div className="absolute inset-0 m-auto w-[18px] h-[106px] text-sm text-white text-center cursor-pointer">
                <span className="text-white">更多秒杀</span>
                <i className="inline-block w-[18px] h-[18px] bg-[url(https://p2.lefile.cn/product/adminweb/2019/11/26/3a702767-4b0a-4e74-a14e-8ddcf5b26609.png)] bg-[length:18px_18px] mt-[11px]"></i>
            </div>
        </div>
    </Link>
);

export default FlashSale;
