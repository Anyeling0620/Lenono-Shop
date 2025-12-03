// 文件路径: src/pages/NewProduct.tsx

import React, { useState, useMemo } from 'react';

// 导入类型定义
import type { NewProductTab, SubProductTab } from '../../types/newProductTab'; 
import type { ProductItem } from '../../types/productItem'; 

// --- 静态数据模拟 (实际应来自 API 或配置文件) ---

// 1. 一级 Tab (主分类): 对应截图中的 "主机, 手机, 平板, 配件, 服务"
const mainTabs: NewProductTab[] = [
    { name: "主机", key: "host" },
    { name: "手机", key: "phone" },
    { name: "平板", key: "tablet" },
    { name: "配件", key: "accessories" },
    { name: "服务", key: "service" },
];

// 2. 二级 Tab (子分类): 仅 '主机' 下的子分类，仿照截图中的 "笔记本新品, 台式新品, 显示器新品"
const hostSubTabs: SubProductTab[] = [
    { name: "笔记本新品", key: "notebook", iconClass: "icon-laptop" },
    { name: "台式新品", key: "desktop", iconClass: "icon-desktop" },
    { name: "显示器新品", key: "display", iconClass: "icon-monitor" },
];

// 3. 产品数据 (以 'notebook' 为例)
const mockProducts: Record<string, ProductItem[]> = {
    notebook: [
        {
            id: '1044632',
            name: '联想拯救者Y9000P 2025',
            description: '英特尔® 酷睿™ Ultra 9/Windows 11 家庭中文版...',
            price: 21999,
            imageUrl: 'path/to/image1.jpg',
            linkUrl: '/product/1044632',
        },
        {
            id: '1042860',
            name: '联想小新Pro14GT AI元启版',
            description: '英特尔酷睿 Ultra 5/Windows 11 家庭中文版/32GB/1T SSD...',
            price: 6399,
            imageUrl: 'path/to/image2.jpg',
            linkUrl: '/product/1042860',
        },
        {
            id: '1043468',
            name: 'ThinkBook 14+ 2025',
            description: '英特尔Evo平台认证酷睿Ultra 5/Windows 11/32GB...',
            price: 6299,
            imageUrl: 'path/to/image3.jpg',
            linkUrl: '/product/1043468',
        },
    ],
    desktop: [], // 占位
    display: [], // 占位
};


/**
 * 新品发布页面主组件
 */
const NewProduct: React.FC = () => {
    // 状态管理：当前激活的一级 Tab (主机/手机/平板...)
    const [activeMainTabKey, setActiveMainTabKey] = useState(mainTabs[0].key);
    // 状态管理：当前激活的二级 Tab (笔记本新品/台式新品...)
    const [activeSubTabKey, setActiveSubTabKey] = useState(hostSubTabs[0].key);

    const CONTENT_WIDTH_CLASS = "w-[1200px] m-auto";
    const PRIMARY_COLOR_CLASS = "text-red-500";
    const PRIMARY_BG_COLOR_CLASS = "bg-red-500";

    // 假设：只有在主 Tab 为 'host' 时，才显示二级 Tab
    const currentSubTabs = activeMainTabKey === 'host' ? hostSubTabs : [];
    
    // 渲染当前子 Tab 下的产品列表
    const products = useMemo(() => {
        return mockProducts[activeSubTabKey] || [];
    }, [activeSubTabKey]);

    // 渲染产品卡片组件
    const ProductCard: React.FC<{ item: ProductItem }> = ({ item }) => (
        <li className="w-1/3 p-4 bg-white hover:shadow-lg transition-shadow duration-300">
            <a href={item.linkUrl} className="block text-center no-underline text-gray-800">
                {/* 产品图片区域 */}
                <div className="h-48 flex items-center justify-center overflow-hidden">
                    {/* 实际项目中应使用 <img src={imageConfig(item.imageUrl)} /> */}
                    <img src={item.imageUrl} alt={item.name} className="max-h-full max-w-full" />
                </div>
                {/* 产品信息 */}
                <div className="mt-4 text-left">
                    <p className="text-sm truncate font-semibold">{item.name}</p>
                    <p className="text-xs text-gray-500 h-8 overflow-hidden mb-2">{item.description}</p>
                    <p className={`text-xl font-bold ${PRIMARY_COLOR_CLASS}`}>
                        ￥ {item.price}
                    </p>
                </div>
            </a>
        </li>
    );


    return (
        <div className="bg-gray-100 min-h-screen pt-10">
            <div className={CONTENT_WIDTH_CLASS}>
                
                {/* 顶部标题：仿照截图中的 NEW 新品发布 */}
                <h1 className="text-2xl font-normal text-center mb-6 text-[#333]">
                    <span className="text-sm border border-red-500 text-red-500 py-0.5 px-2 mr-2 rounded">NEW</span>
                    新品发布
                </h1>
                
                {/* 1. 一级 Tab 栏 (主分类: 主机/手机/平板/配件/服务) */}
                <div className="bg-gray-200 shadow-md">
                    <ul className="flex m-0 p-0 list-none h-[60px]">
                        {mainTabs.map((tab) => (
                            <li
                                key={tab.key}
                                className={`
                                    flex-1 text-center cursor-pointer relative transition-colors duration-200
                                    ${activeMainTabKey === tab.key 
                                        ? 'bg-white font-semibold' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }
                                `}
                                style={{ width: `${100 / mainTabs.length}%`, lineHeight: '60px' }}
                                onClick={() => setActiveMainTabKey(tab.key)}
                            >
                                {tab.name}
                                {/* 激活时的下划线/边框 */}
                                {activeMainTabKey === tab.key && (
                                    <div className={`absolute bottom-0 left-0 right-0 h-[3px] ${PRIMARY_BG_COLOR_CLASS}`}></div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 2. 内容区域：包含二级 Tab 和产品列表 */}
                <div className="bg-white pt-8 px-8 shadow-md min-h-[500px]">
                    
                    {/* 2A. 二级 Tab 区域 (子分类: 笔记本新品/台式新品/显示器新品) */}
                    {activeMainTabKey === 'host' && (
                        <div className="flex justify-start border-b border-gray-200 mb-8 pb-4">
                            {currentSubTabs.map((subTab) => (
                                <div
                                    key={subTab.key}
                                    className={`
                                        flex flex-col items-center justify-center p-4 min-w-[150px]
                                        cursor-pointer transition-colors duration-200
                                        ${activeSubTabKey === subTab.key 
                                            ? PRIMARY_COLOR_CLASS + ' font-semibold' 
                                            : 'text-gray-600 hover:text-red-500'
                                        }
                                    `}
                                    onClick={() => setActiveSubTabKey(subTab.key)}
                                >
                                    {/* 占位图标 - 实际应替换为图标组件或图片 */}
                                    <div className="h-6 w-6 mb-1 border rounded-full flex items-center justify-center text-xs bg-gray-100">
                                        {/* 假设使用简单的文字/符号代替图标 */}
                                        {subTab.iconClass.substring(5, 6).toUpperCase()}
                                    </div>
                                    <span className="text-sm">{subTab.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* 2B. 产品列表区域 (good_1_3 结构) */}
                    <div className="w-full">
                        <ul className="flex justify-between m-0 p-0 list-none -mx-4">
                            {products.length > 0 ? (
                                products.map((item) => <ProductCard key={item.id} item={item} />)
                            ) : (
                                <p className="text-center w-full py-12 text-gray-500">
                                    {currentSubTabs.find(t => t.key === activeSubTabKey)?.name || activeMainTabKey} 暂无新品。
                                </p>
                            )}
                        </ul>
                    </div>

                    {/* 2C. 广告/大图区域 (截图下方的大图，这里用占位符) */}
                    {activeSubTabKey === 'notebook' && (
                        <div className="mt-8">
                            <p className="text-sm text-gray-400 mb-2">--- 广告/大图占位区 (520px 高度) ---</p>
                            <div className="h-[200px] bg-gray-50 border border-dashed flex items-center justify-center">
                                笔记本新品广告横幅区域
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default NewProduct;