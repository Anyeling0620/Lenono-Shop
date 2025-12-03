/*
 * @Description: 倒计时显示组件 (Dumb Component)
 * @Responsibility: 
 * 1. 接收目标时间和状态，计算剩余时间
 * 2. 每秒刷新 UI
 * 3. 根据状态显示不同前缀 ("距开始" 或 "距结束")
 */
import React, { useEffect, useState } from 'react';
import { calculateRemainingTime } from '../../utils/timeCalculator';

interface Props {
  time: string;     // 场次开始时间字符串
  duration: string; // 持续时间 (例如 "12h")
  status: 'start' | 'wait' | 'end'; // 当前场次状态
  showLabel?: boolean; // 是否显示前缀文本
}

const CountdownDisplay: React.FC<Props> = ({ time, duration, status, showLabel = true }) => {
  // 初始化倒计时状态
  const [timer, setTimer] = useState(calculateRemainingTime(time, duration));

  // 倒计时副作用
  useEffect(() => {
    // 如果已结束，无需启动定时器
    if (status === 'end') return;

    // 立即更新一次，避免 UI 闪烁
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimer(calculateRemainingTime(time, duration));

    // 设置定时器，每秒更新
    const intervalId = setInterval(() => {
      setTimer(calculateRemainingTime(time, duration));
    }, 1000);

    // 清理函数：组件卸载时清除定时器
    return () => clearInterval(intervalId);
  }, [time, duration, status]);

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