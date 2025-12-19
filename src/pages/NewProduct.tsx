
import React, { createContext } from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Carousel from '../component/Carousel/Carousel';
import type { CarouselItemType } from '../types/carouselItem';
import NewProductList from '../component/NewProductList/NewProductList';
import NewProductRelease from '../component/NewProductList/NewProductRelease';

import globalErrorHandler from '../utils/globalAxiosErrorHandler';


const carouselData: CarouselItemType[] = [
    { imageName: "1.jpg", linkUrl: "/new", alt: "暖冬福利季" },
    { imageName: "2.png", linkUrl: "/new", alt: "新品发布" },
    { imageName: "3.png", linkUrl: "/new", alt: "新年好礼" },
];


const NewProductContext = createContext<ProductsResponse[]>(
    [{
        title: '',
        productList: []
    }]
);


const NewProduct: React.FC = () => {
    const [newProductGroups, setNewProductGroups] = useState<ProductsResponse[]>(
        [{
            title: '',
            productList: []
        }]
    )

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getNewProductList()
                setNewProductGroups(data)
            } catch (error) {
                globalErrorHandler.handle(error, toast.error)
            }
        }
        fetchData()
    }, [])


    return (
        <NewProductContext.Provider value={newProductGroups}>
            <div className="bg-[#f5f5f5] min-h-screen pb-20">
                <Carousel data={carouselData} className='h-[340px]' />
                <NewProductRelease />
                <NewProductList className='w-[1200px] mx-auto py-[10px]' />
            </div>
        </NewProductContext.Provider>
    );
};

export { NewProductContext }
export default NewProduct;