/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-25 22:04:18
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-25 23:50:55
 * @FilePath: \lenovo-shop\src\component\FlashSale\SessionTab.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
// components/SessionTab.tsx
import React from 'react';
import type { flashSaleMenu } from '../../types/flashSale';
import { getSessionDisplayTime, getSessionStatus } from '../../utils/timeCalculator';

interface SessionTabProps {
  session: flashSaleMenu;
  isActive?: boolean;
  onClick?: () => void;
}

const SessionTab: React.FC<SessionTabProps> = ({ 
  session, 
  isActive = false, 
  onClick 
}) => {
  const status = getSessionStatus(session.time,session.duration);
  const time = getSessionDisplayTime(session.time)
  
  const statusTextMap = {
    start: '进行中',
    end: '已结束',
    wait:'即将开始'
  };
   const statusText = statusTextMap[status];
  
  return (
    <li 
      className={`bg-gradient-to-r from-[#ec1111] to-[#ff8200] rounded-[13px] text-white inline-block w-[164px] h-[26px] leading-[26px] mr-[10px] align-middle text-[14px] font-semibold cursor-pointer ${
        isActive ? 'ring-2 ring-white ring-opacity-50' : ''
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
