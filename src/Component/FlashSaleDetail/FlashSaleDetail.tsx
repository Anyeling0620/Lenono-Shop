import React, { useState } from 'react';
import FlashHeader from './FlashHeader';
import FlashSessionBar from './FlashSessionBar';
import FlashProductList from './FlashProductList';
import type { UnfinishedSeckillRoundVO } from '../../types/flashSale';
import { getSessionStatus } from '../../utils/timeCalculator';

// 移除 MOCK_SESSIONS，直接使用传入的 scekillData
const FlashSaleDetail: React.FC<{ scekillData: UnfinishedSeckillRoundVO[] }> = ({ scekillData }) => {
  // 初始化选中第一个可用场次（启用状态）
  const initialSession = scekillData.find(round => round.status === '启用') || scekillData[0];
  const [activeSession, setActiveSession] = useState<UnfinishedSeckillRoundVO>(initialSession);

  /**
   * 处理场次切换事件
   * @param session 被点击的场次对象
   */
  const handleTabChange = (session: UnfinishedSeckillRoundVO) => {
    setActiveSession(session);
  };

  // 实时计算当前选中场次的状态 (start | end | wait)
  const currentStatus = getSessionStatus(activeSession.startTime, activeSession.endTime);

  return (
    <>
      {/* 顶部红色 Banner 区域 */}
      <FlashHeader />
      
      {/* 场次切换栏 (吸顶悬浮 + 倒计时) */}
      <FlashSessionBar 
        sessions={scekillData} 
        activeSession={activeSession} 
        onTabChange={handleTabChange} 
      />
      
      {/* 商品列表区域 */}
      <div className="w-[1200px] mx-auto mt-[30px]">
        {/* 将当前场次的商品列表和计算出的状态传递给列表组件 */}
        <FlashProductList 
          products={activeSession.products} 
          status={currentStatus} 
        />
      </div>
    </>
  );
};

export default FlashSaleDetail;