import React, { useEffect, useState } from 'react';
import type { TimeStatus } from '../../types/flashSale';
import { calculateRemainingTime } from '../../utils/timeCalculator';

interface Props {
  startTime: string;    // 场次开始时间（替换原有 time）
  endTime: string;      // 场次结束时间（替换原有 duration）
  status: TimeStatus;   // 当前场次状态
  showLabel?: boolean;  // 是否显示前缀文本
}

const CountdownDisplay: React.FC<Props> = ({ startTime, endTime, status, showLabel = true }) => {
  // 初始化倒计时状态
  const [timer, setTimer] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  // 倒计时副作用
  useEffect(() => {
    // 如果已结束，无需启动定时器
    if (status === 'end') return;

    // 立即更新一次
    const updateTimer = () => {
      setTimer(calculateRemainingTime(startTime, endTime));
    };

    updateTimer();

    // 设置定时器，每秒更新
    const intervalId = setInterval(updateTimer, 1000);

    // 清理函数：组件卸载时清除定时器
    return () => clearInterval(intervalId);
  }, [startTime, endTime, status]);

  // 根据状态确定前缀文案
  let label = '';
  if (showLabel) {
    if (status === 'start') label = '距结束还剩: ';
    if (status === 'wait') label = '距开始还剩: ';
  }

  // 已结束状态不渲染任何内容
  if (status === 'end') return null;

  return (
    <div className="text-[12px] opacity-90 font-medium mt-1 flex items-center gap-1">
      {/* 闹钟小图标 */}
      <span className="w-[14px] h-[14px] border border-white/60 rounded-full flex items-center justify-center text-[9px]">⏰</span>
      {/* 时间显示区域 */}
      <span className="font-mono tracking-wide">
        {label}{timer.hours}:{timer.minutes}:{timer.seconds}
      </span>
    </div>
  );
};

export default CountdownDisplay;