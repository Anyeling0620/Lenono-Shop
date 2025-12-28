
import React from 'react';
import type { UnfinishedSeckillRoundVO } from '../../types/flashSale';

interface SessionTabProps {
  session: UnfinishedSeckillRoundVO;
  isActive?: boolean;
  onClick?: () => void;
}

// 优化：抽离工具函数，处理时间格式异常
const getSessionStatus = (startTime: string, endTime: string): 'start' | 'end' | 'wait' => {
  try {
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    if (now < start) {
      return 'wait';
    } else if (now >= start && now < end) {
      return 'start';
    } else {
      return 'end';
    }
  } catch (error) {
    console.error('场次状态计算错误：', error);
    return 'end';
  }
};

const getSessionDisplayTime = (time: string): string => {
  try {
    const date = new Date(time);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  } catch (error) {
    console.error('时间格式化错误：', error);
    return '00:00';
  }
};

const SessionTab: React.FC<SessionTabProps> = ({ 
  session, 
  isActive = false, 
  onClick 
}) => {
  const status = getSessionStatus(session.startTime, session.endTime);
  const time = getSessionDisplayTime(session.startTime);
  
  const statusTextMap = {
    start: '进行中',
    end: '已结束',
    wait: '即将开始'
  };
  const statusText = statusTextMap[status];
  
  return (
    <li 
      className={`rounded-[13px] inline-block w-[164px] h-[26px] leading-[26px] mr-[10px] align-middle text-[14px] font-semibold cursor-pointer transition-all duration-200 ${
        isActive 
          ? 'bg-gradient-to-r from-[#ec1111] to-[#ff8200] text-white ring-2 ring-white ring-opacity-50'
          : 'bg-white text-[#ec1111] border border-[#ec1111] hover:bg-[#fff5f5]'
      }`}
      onClick={onClick}
    >
      <div className="text-center">
        <span>{time}</span>
        <i>场</i>-
        <span>{statusText}</span>
      </div>
    </li>
  );
};

export default SessionTab;