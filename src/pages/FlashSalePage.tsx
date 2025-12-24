// src/pages/FlashSalePage.tsx
import React, { useEffect } from 'react';
import FlashSaleDetail from '../component/FlashSaleDetail/FlashSaleDetail';
import { useLocation } from 'react-router-dom';
import type { UnfinishedSeckillRoundVO } from '../types/flashSale';

const FlashSalePage: React.FC = () => {
  const location = useLocation();
  const data = location.state as  UnfinishedSeckillRoundVO[];

  useEffect(() => {
    window.scrollTo(0, 0)
    if(!data || data?.length === 0){
      window.location.href = '/'
    }
  },[data])

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-[60px]">
      <FlashSaleDetail  scekillData={data}/>
    </div>
  );
};

export default FlashSalePage;