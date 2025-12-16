import React, { use, useMemo, useState } from 'react'
import {
    LaptopOutlined,
    DesktopOutlined,
    FundProjectionScreenOutlined,
    MobileOutlined,
    TabletOutlined,
    AppstoreOutlined,
    CustomerServiceOutlined,
} from '@ant-design/icons';
import { NewProductContext } from '../../pages/NewProduct';
import type { MainTab, ProductsResponse, ProductType, SubCategory } from '../../types/product';
import { Link } from 'react-router-dom';

// 一级分类
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
        { id: 'notebooks', name: '笔记本新品', icon: <LaptopOutlined style={{ fontSize: '22px' }} /> },
        { id: 'desktops', name: '台式机新品', icon: <DesktopOutlined style={{ fontSize: '22px' }} /> },
        { id: 'monitor', name: '显示器新品', icon: <FundProjectionScreenOutlined style={{ fontSize: '22px' }} /> },
    ],
    phone: [
        { id: 'phones', name: '手机新品', icon: <MobileOutlined style={{ fontSize: '22px' }} /> },
    ],
    tablet: [
        { id: 'tablets', name: '平板新品', icon: <TabletOutlined style={{ fontSize: '22px' }} /> },
    ],
    accessories: [
        { id: 'fittings', name: '选件新品', icon: <AppstoreOutlined style={{ fontSize: '22px' }} /> },
    ],
    service: [
        { id: 'services', name: '服务新品', icon: <CustomerServiceOutlined style={{ fontSize: '22px' }} /> },
    ]
};

// 关键：二级分类ID与新品列表标题的映射关系
const subTabToTitleMap: Record<ProductType, string> = {
    notebooks: '笔记本',
    desktops: '台式机',
    monitor: '显示器',
    phones: '手机',
    tablets: '平板',
    fittings: '配件',
    services: '服务',
};

const NewProductRelease = () => {
    // 从上下文获取新品数据
    const newProductGroups = use(NewProductContext);

    // 修正初始二级标签ID（原notebook是错误的，对应subCategoriesMap里的notebooks）
    const [activeMainTab, setActiveMainTab] = useState<string>('host');
    const [activeSubTab, setActiveSubTab] = useState<ProductType>('notebooks');

    // 切换一级标签时，重置二级标签为第一个
    const handleMainTabChange = (tabId: string) => {
        setActiveMainTab(tabId);
        const firstSub = subCategoriesMap[tabId]?.[0];
        setActiveSubTab(firstSub ? firstSub.id : 'notebooks');
    };

    // 根据当前二级标签筛选对应的产品列表
    const currentProducts: ProductsResponse = useMemo(() => {
        // 1. 获取当前二级标签对应的标题
        const targetTitle = subTabToTitleMap[activeSubTab];

        if (!targetTitle) return { title: '', productList: [] };

        // 2. 找到对应的产品分组
        const targetGroup = newProductGroups.find(group => group.title === targetTitle);
        if (!targetGroup) return { title: '', productList: [] };
        console.log(targetGroup);

        return targetGroup
    }, [activeSubTab, newProductGroups]);

    const currentSubCategories = subCategoriesMap[activeMainTab] || [];

    return (
        <div className="w-[1200px] mx-auto mt-8 bg-white shadow-sm min-h-[600px] mb-10 rounded-sm">
            {/* 1. 标题区域 */}
            <div className="text-center py-6">
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
                                flex-1 h-[50px] leading-[50px] text-center text-[16px] cursor-pointer transition-colors duration-200
                                ${activeMainTab === tab.id
                                    ? 'bg-[#fcfcfc] text-[#333] font-bold border-b-[3px] border-b-red-600'
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
            {currentSubCategories.length > 0 && (
                <div className="py-6 border-b border-dashed border-[#eee] px-8">
                    <div className="flex w-full justify-around items-center px-20">
                        {currentSubCategories.map((sub) => {
                            const isActive = activeSubTab === sub.id;
                            return (
                                <div
                                    key={sub.id}
                                    onClick={() => setActiveSubTab(sub.id)}
                                    className="flex flex-col items-center cursor-pointer group min-w-[80px]"
                                >
                                    <div className={`mb-2 transition-colors duration-300 ${isActive ? 'text-[#333]' : 'text-[#999] group-hover:text-[#666]'}`}>
                                        {sub.icon}
                                    </div>
                                    <span className={`text-[12px] ${isActive ? 'text-[#333] font-bold' : 'text-[#666]'}`}>
                                        {sub.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 4. 商品展示列表 (上半部分) */}
            <div className="px-8 h-[400px]">
                {currentProducts.productList.length > 0 ? (
                    <ul className="grid grid-cols-3 gap-2 py-4">
                        {currentProducts.productList.filter((_, index) => index < 3).map((product) => (
                            <li key={product.productId} className="bg-white p-4 transition-shadow hover:shadow-xl group cursor-pointer border border-transparent hover:border-[#eee]">
                                <Link
                                to={`/product/${product.productId}&default=${product.configId}`}
                                target={product.productId}
                                >

                                    <div className="w-full h-[220px] flex items-center justify-center overflow-hidden mb-4">
                                        <img
                                            src={product.mainImage!}
                                            alt={product.productName}
                                            className="w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="text-left px-2">
                                        <h3 className="text-[15px] text-[#333] font-normal mb-1 truncate" title={product.productName}>
                                            {product.productName}
                                        </h3>
                                        <p className="text-[12px] text-[#999] h-[36px] overflow-hidden leading-[18px] mb-3 line-clamp-2">
                                            {product.description}
                                        </p>
                                        <div className="text-[18px] text-red-500 font-bold">
                                            ¥ {product.minPrice.toFixed(2)}
                                        </div>

                                    </div>
                                </Link>

                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-[180px] text-gray-400">
                        该分类暂无新品上架
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewProductRelease;