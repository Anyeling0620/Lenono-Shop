// pages/DesktopComputer.tsx
import React, { useCallback, useEffect, useState } from 'react';
import ProductSection from '../component/ProductList/ProductSection';
import globalErrorHandler from '../utils/globalAxiosErrorHandler';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import NotFound from './404';
import { getProductList } from '../services/products';
import type { ProductCardItem, ProductType, SingleProductCardResponse } from '../types/product';

const isValidProductType = (type: string): type is ProductType => {
    return ['LAPTOP', 'TABLET', 'DESKTOP', 'MONITOR', 'PHONE', 'PART' ,'SERVICE'].includes(type);
};
const getChineseProductType = (type: string): string => {
    const typeMap: Record<string, string> = {
        'LAPTOP': '笔记本',
        'TABLET': '平板',
        'DESKTOP': '台式机',
        'MONITOR': '显示器',
        'PHONE': '手机',
        'PART' : '配件',
        'SERVICE': '服务'
    };
    return typeMap[type] || type; // 如果找不到对应翻译，返回原值
};

const Product: React.FC = () => {
    const [productList, setProductList] = useState<SingleProductCardResponse>({
        items: [],
    });
    const [carouselProducts, setCarouselProducts] = useState<ProductCardItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { type } = useParams();
    // 若不存在参数或参数不是paramsType类型
    if (!type || !isValidProductType(type)) {
        return <NotFound />;
    }


    // eslint-disable-next-line react-hooks/rules-of-hooks
    const fetchDesktopProducts = useCallback(async () => {
        setLoading(true);
        try {
            const list = await getProductList(type);
            setProductList(list);
            const carouselList = list.items.filter((item: ProductCardItem) => item.shelfProduct?.isCarousel);
            setCarouselProducts(carouselList);
        } catch (error) {
            globalErrorHandler.handle(error, toast.error);
            setProductList({ items: [] });
            setCarouselProducts([]);
        } finally {
            setLoading(false);
        }
    }, [type])

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchDesktopProducts();
        }, 1000)
        return () => clearTimeout(timer);
    }, [fetchDesktopProducts]);

    return (
        <ProductSection
            loading={loading}
            title={getChineseProductType(type)}
            productList={productList.items}
            carouselProducts={carouselProducts}
        />
    );
};

export default Product;
