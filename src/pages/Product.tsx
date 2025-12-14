// pages/DesktopComputer.tsx
import React, { useCallback, useEffect, useState } from 'react';
import ProductSection from '../component/ProductList/ProductSection';
import type { ProductItem, ProductsResponse, ProductType } from '../types/product';
import globalErrorHandler from '../utils/globalAxiosErrorHandler';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import NotFound from './404';
import { getProductList } from '../services/products';

const isValidProductType = (type: string): type is ProductType => {
    return ['notebooks', 'tablets', 'desktops', 'monitor', 'phones', 'fittings'].includes(type);
};

const Product: React.FC = () => {
    const [productList, setProductList] = useState<ProductsResponse>({
        title: '',
        productList: [],
    });
    const [carouselProducts, setCarouselProducts] = useState<ProductItem[]>([]);
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
            const carouselList = list.productList.filter((item: ProductItem) => item.isCarousel);
            setCarouselProducts(carouselList);
        } catch (error) {
            globalErrorHandler.handle(error, toast.error);
            setProductList({ title: '', productList: [] });
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
