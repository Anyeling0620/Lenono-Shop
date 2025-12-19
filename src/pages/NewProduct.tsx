
import React, { createContext } from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Carousel from '../component/Carousel/Carousel';
import NewProductList from '../component/NewProductList/NewProductList';
import NewProductRelease from '../component/NewProductList/NewProductRelease';

import globalErrorHandler from '../utils/globalAxiosErrorHandler';
import { getNewProductGroups } from '../services/products';
import type { ProductCardNewResponse } from '../types/product';
import { Empty } from 'antd';
import { Loading } from '../component/LoadingFallback';



const NewProductContext = createContext<ProductCardNewResponse>({
    carouselItems:[],
    items: [],
});


const NewProduct: React.FC = () => {
    const [newProductGroups, setNewProductGroups] = useState<ProductCardNewResponse>(
        {carouselItems:[], items: [] }
    )
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const data = await getNewProductGroups()
                setNewProductGroups(data)
            } catch (error) {
                globalErrorHandler.handle(error, toast.error)
            }finally{
                setLoading(false)
            }
        }
        fetchData()
    }, [])

   if(loading){
    return <Loading/>
   }
    return (
        newProductGroups.items.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无商品数据" className='py-60'/>:
        <NewProductContext.Provider value={newProductGroups}>
            <div className="bg-[#f5f5f5] min-h-screen pb-20">
                <Carousel type={'new'} className='h-[340px]' />
                <NewProductRelease />
                <NewProductList className='w-[1200px] mx-auto py-[10px]' />
            </div>
        </NewProductContext.Provider>
    );
};

export { NewProductContext }
export default NewProduct;