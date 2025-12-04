import React, { useMemo, useState } from 'react'
import type { MainTab, ProductItem, SubCategory } from '../../types/newProductTab';
import {
    LaptopOutlined,
    DesktopOutlined,
    FundProjectionScreenOutlined,
    MobileOutlined,
    TabletOutlined,
    AppstoreOutlined,
    CustomerServiceOutlined
} from '@ant-design/icons';


const mainTabs: MainTab[] = [
    { id: 'host', name: '主机' },
    { id: 'phone', name: '手机' },
    { id: 'tablet', name: '平板' },
    { id: 'accessories', name: '选件' },
    { id: 'service', name: '服务' },
];

// 二级分类配置 (图标栏)
const subCategoriesMap: Record<string, SubCategory[]> = {
    host: [
        { id: 'notebook', name: '笔记本新品', icon: <LaptopOutlined style={{ fontSize: '40px' }} /> },
        { id: 'desktop', name: '台式机新品', icon: <DesktopOutlined style={{ fontSize: '40px' }} /> },
        { id: 'monitor', name: '显示器新品', icon: <FundProjectionScreenOutlined style={{ fontSize: '40px' }} /> },
    ],
    phone: [
        { id: 'newPhone', name: '手机新品', icon: <MobileOutlined style={{ fontSize: '40px' }} /> },
    ],
    tablet: [
        { id: 'newPad', name: '平板新品', icon: <TabletOutlined style={{ fontSize: '40px' }} /> },
    ],
    accessories: [
        { id: 'newAcc', name: '选件新品', icon: <AppstoreOutlined style={{ fontSize: '40px' }} /> },
    ],
    service: [
        { id: 'newService', name: '服务新品', icon: <CustomerServiceOutlined style={{ fontSize: '40px' }} /> },
    ]
};

// 您的商品数据 (上半部分)
const productsMap: Record<string, ProductItem[]> = {
    notebook: [
        {
            id: '1',
            name: '联想拯救者Y9000P 2025',
            description: '英特尔® 酷睿™ Ultra 9 / RTX4060 / 240Hz高刷屏',
            price: 10999,
            imageUrl: 'https://p4.lefile.cn/product/adminweb/2024/01/17/2LCC5B1F9W3D9H7J.jpg',
            linkUrl: '#'
        },
        {
            id: '2',
            name: 'ThinkBook 14+ 2025',
            description: '英特尔Evo认证 / Ultra 5 / 3K屏 / 1.5kg轻薄',
            price: 5299,
            imageUrl: 'https://p2.lefile.cn/product/adminweb/2024/01/25/K7S9D3F2G5H1J4L.jpg',
            linkUrl: '#'
        },
        {
            id: '3',
            name: '联想小新Pro16 2025',
            description: 'Ultra 7 / 32G / 1T / 2.5K 120Hz / 75Wh大电池',
            price: 6499,
            imageUrl: 'https://p3.lefile.cn/product/adminweb/2024/02/01/M5N6B7V8C9X0Z.jpg',
            linkUrl: '#'
        }
    ],
    desktop: [
        {
            id: '4',
            name: '联想天逸510S',
            description: '13代酷睿i5 / 16G / 1T+512G / 23英寸显示器',
            price: 4199,
            imageUrl: 'https://p1.lefile.cn/product/adminweb/2023/05/10/A1S2D3F4G5H6.jpg',
            linkUrl: '#'
        }
    ],
    newPhone: [
        { id: 'p1', name: 'moto razr 50 Ultra', description: '骁龙8s Gen3 / 120Hz内屏', price: 5699, imageUrl: 'https://p2.lefile.cn/product/adminweb/2024/06/25/U1I8O9P0L.jpg', linkUrl: '#' }
    ],
    newPad: [
        { id: 'pad1', name: '联想小新Pad Pro 12.7', description: '天玑8300 / 2.9K屏幕', price: 1899, imageUrl: 'https://p4.lefile.cn/product/adminweb/2023/07/20/PadPro127.jpg', linkUrl: '#' }
    ],
    newAcc: [
        { id: 'acc1', name: '联想异能者鼠标 M300', description: '人体工学设计 / 1600DPI', price: 59, imageUrl: 'https://p1.lefile.cn/product/adminweb/2023/01/10/MouseM300.jpg', linkUrl: '#' }
    ],
    newService: [
        { id: 'srv1', name: '笔记本意外保修服务', description: '1年意外保护 / 进液跌落均保修', price: 199, imageUrl: 'https://p2.lefile.cn/product/adminweb/2022/05/15/ServiceCard.jpg', linkUrl: '#' }
    ]
};


const NewProductRelease = () => {
    const [activeMainTab, setActiveMainTab] = useState<string>('host');
    const [activeSubTab, setActiveSubTab] = useState<string>('notebook');

    const handleMainTabChange = (tabId: string) => {
        setActiveMainTab(tabId);
        const firstSub = subCategoriesMap[tabId]?.[0];
        setActiveSubTab(firstSub ? firstSub.id : '');
    };

    const currentProducts = useMemo(() => {
        return productsMap[activeSubTab] || [];
    }, [activeSubTab]);

    const currentSubCategories = subCategoriesMap[activeMainTab] || [];
  return (
   
    <div className="w-[1200px] mx-auto mt-8 bg-white shadow-sm min-h-[600px] mb-10 rounded-sm">

                {/* 1. 标题区域 */}
                <div className="text-center py-8">
                    <h2 className="text-[28px] font-normal text-[#333] flex items-center justify-center gap-3">
                        <span className="inline-block w-9 h-9 leading-9 rounded-full border border-[#666] text-[#666] text-xs font-bold">
                            NEW
                        </span>
                        新品发布
                    </h2>
                </div>

                {/* 2. 一级导航 (Main Tabs) */}
                <div className="bg-[#f9f9f9] border-b border-[#eee]">
                    <ul className="flex w-full m-0 p-0 list-none">
                        {mainTabs.map((tab) => (
                            <li
                                key={tab.id}
                                onClick={() => handleMainTabChange(tab.id)}
                                className={`
                                    flex-1 h-[60px] leading-[60px] text-center text-[16px] cursor-pointer transition-colors duration-200
                                    ${activeMainTab === tab.id
                                        ? 'bg-white text-[#333] font-bold border-t-[3px] border-t-red-600'
                                        : 'text-[#666] hover:bg-[#f0f0f0]'
                                    }
                                `}
                            >
                                {tab.name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 3. 二级导航 (图标栏) */}
                {/* 样式修正：justify-around 实现均匀分布 */}
                {currentSubCategories.length > 0 && (
                    <div className="py-10 border-b border-dashed border-[#eee] mx-8">
                        <div className="flex w-full justify-around items-center px-20">
                            {currentSubCategories.map((sub) => {
                                const isActive = activeSubTab === sub.id;
                                return (
                                    <div
                                        key={sub.id}
                                        onClick={() => setActiveSubTab(sub.id)}
                                        className="flex flex-col items-center cursor-pointer group min-w-[80px]"
                                    >
                                        <div className={`mb-3 transition-colors duration-300 ${isActive ? 'text-[#333]' : 'text-[#999] group-hover:text-[#666]'}`}>
                                            {/* 图标 */}
                                            {sub.icon}
                                        </div>
                                        <span className={`text-[14px] ${isActive ? 'text-[#333] font-bold' : 'text-[#666]'}`}>
                                            {sub.name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 4. 商品展示列表 (上半部分) */}
                <div className="p-8">
                    {currentProducts.length > 0 ? (
                        <ul className="grid grid-cols-3 gap-6">
                            {currentProducts.map((product) => (
                                <li key={product.id} className="bg-white p-4 transition-shadow hover:shadow-xl group cursor-pointer border border-transparent hover:border-[#eee]">
                                    <div className="w-full h-[220px] flex items-center justify-center overflow-hidden mb-4">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="text-left px-2">
                                        <h3 className="text-[15px] text-[#333] font-normal mb-1 truncate" title={product.name}>
                                            {product.name}
                                        </h3>
                                        <p className="text-[12px] text-[#999] h-[36px] overflow-hidden leading-[18px] mb-3 line-clamp-2">
                                            {product.description}
                                        </p>
                                        <div className="text-[18px] text-[#333] font-medium">
                                            ¥ {product.price}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-20 text-gray-400">
                            该分类暂无新品上架
                        </div>
                    )}
                </div>
            </div>


  )
}

export default NewProductRelease