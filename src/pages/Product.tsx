// pages/DesktopComputer.tsx
import React, { useCallback, useEffect, useState } from 'react';
import ProductSection from '../component/ProductSection';
import type { ProductItem, ProductsResponse, ProductType } from '../types/searchProduct';
import globalErrorHandler from '../utils/globalAxiosErrorHandler';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import NotFound from './404';
import { getProductList } from '../services/products';

const reverseTranslation: {
    [key: string]: string;
} = {
    "new-products": "新品",
    "notebooks": "笔记本",
    "tablets": "平板",
    "desktops": "台式机",
    "monitor": "显示器",
    "phones": "手机",
    "fittings": "配件"
};

const Product: React.FC = () => {
    const [productList, setProductList] = useState<ProductsResponse>({
        title: '',
        productList: [],
    });
    const [carouselProducts, setCarouselProducts] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { type } = useParams();
    if (!type || !Object.keys(reverseTranslation).includes(type)) {
        return <NotFound />
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const fetchDesktopProducts = useCallback(async () => {
        setLoading(true);
        try {
            const list = await getProductList(reverseTranslation[type] as ProductType);
            setProductList(list);
            const carouselList = list.productList.filter((item: ProductItem) => item.isCarousel);
            setCarouselProducts(carouselList);
        } catch (error) {
            globalErrorHandler.handle(error, toast.error);
            setProductList({ title: '台式机', productList: [] });
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
            title={productList.title}
            productList={productList.productList}
            carouselProducts={carouselProducts}
        />
    );
};

export default Product;
