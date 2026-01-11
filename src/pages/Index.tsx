
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
  // 保持初始状态为对象，防止首屏崩溃
  const [indexProductGroups, setIndexProductGroups] = useState<ProductCardIndexResponse>({ 
    carouselItems: [], 
    items: [] 
  });
  const [loading, setLoading] = useState<boolean>(true); // 建议初始设为 true，减少 Empty 的闪烁

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getIndexProductGroups();
        
        // 【关键防御】检查 API 返回的数据是否符合预期格式
        if (data && Array.isArray(data.items)) {
          setIndexProductGroups(data);
        } else {
          console.error("API 返回数据格式不正确:", data);
          // 如果数据不对，保持初始的空数组状态，或者抛出错误
        }
      } catch (error) {
        globalErrorHandler.handle(error, toast.error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;

  // 【核心修复】使用可选链 ?. 确保 indexProductGroups 为空时不崩溃
  const hasData = indexProductGroups?.items && indexProductGroups.items.length > 0;

  return (
    !hasData ? (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无商品数据" className='py-60' />
    ) : (
      <IndexProductContext.Provider value={indexProductGroups}>
        <div className='bg-[#f5f5f5]'>
          <Carousel type={'index'} className='h-[400px]' />
          <QuickAccess />
          <FlashSale />
          <MainProduct />
        </div>
      </IndexProductContext.Provider>
    )
  );
};

export { IndexProductContext };
export default Index;
