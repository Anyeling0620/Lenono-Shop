
import React, { createContext, useEffect, useState } from 'react';
import QuickAccess from '../component/QuickAccess/QuickAccess';
import Carousel from '../component/Carousel/Carousel';
import FlashSale from '../component/FlashSale/FlashSale';
import MainProduct from '../component/MainProduct/MainProduct';
import { getIndexProductGroups } from '../services/products';
import type { ProductCardIndexResponse } from '../types/product';
import globalErrorHandler from '../utils/globalAxiosErrorHandler';
import toast from 'react-hot-toast';
import { Empty } from 'antd';
import { Loading } from '../component/LoadingFallback';



const IndexProductContext = createContext<ProductCardIndexResponse>({
  carouselItems: [],
  items: [],
});


const Index: React.FC = () => {

  const [indexProductGroups, setIndexProductGroups] = useState<ProductCardIndexResponse>(
    { carouselItems: [], items: [] }
  )
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getIndexProductGroups()
        setIndexProductGroups(data)
      } catch (error) {
        globalErrorHandler.handle(error, toast.error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <Loading/>

  return (

    indexProductGroups.items.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无商品数据" className='py-60' /> :
      <IndexProductContext.Provider value={indexProductGroups}>
        <div className='bg-[#f5f5f5]'>
          <Carousel type={'index'} className='h-[400px]' />
          <QuickAccess />
          <FlashSale />
          <MainProduct />
        </div>
      </IndexProductContext.Provider>



  );
};

export { IndexProductContext };
export default Index;
