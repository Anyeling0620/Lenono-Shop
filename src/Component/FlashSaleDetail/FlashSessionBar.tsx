/*
 * @Description: 秒杀场次切换栏组件 (FlashSessionBar)
 * @Features:
 * 1. 吸顶悬浮 (Sticky Header) - 滚动时固定在顶部
 * 2. 状态展示 - 显示 "正在抢购", "即将开始" 等文案
 * 3. 倒计时集成 - 选中且有效场次显示倒计时组件
 */
import React from 'react';
import type { flashSaleMenu } from '../../types/flashSale';
import { getSessionDisplayTime, getSessionStatus } from '../../utils/timeCalculator';
import CountdownDisplay from './CountdownDisplay';

interface Props {
  sessions: flashSaleMenu[];          // 所有场次列表
  activeSession: flashSaleMenu;       // 当前选中的场次
  onTabChange: (session: flashSaleMenu) => void; // 切换回调函数
}

const FlashSessionBar: React.FC<Props> = ({ sessions, activeSession, onTabChange }) => {
  return (
    <div className="w-[1200px] mx-auto sticky top-[60px]  z-[50] shadow-md bg-white flex justify-start -mt-[40px]">
      {sessions.map((session, index) => {
        // 判断当前 Item 是否被选中
        const isActive = session.id === activeSession.id;
        // 判断是否显示右侧分割线 (非选中且非最后一项且下一项未选中时显示)
        const showBorder = !isActive && index !== sessions.length - 1 && sessions[index + 1].id !== activeSession.id;

        return (
          <SessionItem 
            key={session.id}
            session={session}
            isActive={isActive}
            showBorder={showBorder}
            onClick={() => onTabChange(session)}
          />
        );
      })}
    </div>
  );
};

/**
 * 子组件: 单个场次 Item
 * 负责渲染单个时间块的 UI 和状态逻辑
 */
const SessionItem: React.FC<{
  session: flashSaleMenu;
  isActive: boolean;
  showBorder: boolean;
  onClick: () => void;
}> = ({ session, isActive, showBorder, onClick }) => {
  // 格式化时间 (例如 "12:00")
  const timeLabel = getSessionDisplayTime(session.time);
  // 获取当前场次的时间状态
  const status = getSessionStatus(session.time, session.duration);
  
  // 1. 配置主状态文案 (第一行)
  let statusText = '即将开始';
  if (status === 'start') statusText = '正在抢购';
  if (status === 'end') statusText = '已结束';

  // 2. 配置副标题文案 (第二行，非激活状态下显示)
  let subStatusText = '即将开始';
  if (status === 'start') subStatusText = '抢购进行中';
  if (status === 'end') subStatusText = '本场已结束';

  return (
    <div
      onClick={onClick}
      // 样式控制: 激活时显示红底白字，非激活显示白底黑字
      className={`
        w-[240px] shrink-0 h-[80px] cursor-pointer flex flex-col justify-center items-center transition-colors duration-300 relative
        ${isActive ? 'bg-[#d60b0b] text-white' : 'bg-white text-[#333] hover:bg-gray-50'}
      `}
    >
      {/* 第一行：时间 + 状态 */}
      <div className="flex items-baseline gap-2 mb-[2px]">
        <span className="text-[22px] font-bold leading-none">{timeLabel}</span>
        <span className={`text-[14px] leading-none ${isActive ? 'font-bold' : 'font-normal'}`}>
          {statusText}
        </span>
      </div>

      {/* 第二行：条件渲染 */}
      {/* 如果是激活状态 且 (正在进行 或 即将开始)，显示倒计时组件 */}
      {isActive && (status === 'start' || status === 'wait') ? (
        <CountdownDisplay 
          time={session.time} 
          duration={session.duration} 
          status={status} 
        />
      ) : (
        // 否则显示静态副标题
        <div className={`text-[12px] mt-1 ${isActive ? 'opacity-90' : 'text-[#999]'}`}>
          {subStatusText}
        </div>
      )}

      {/* 右侧分割线 (视觉装饰) */}
      {showBorder && <div className="absolute right-0 top-[30%] h-[40%] w-[1px] bg-[#e0e0e0]"></div>}
    </div>
  );
};

export default FlashSessionBar;