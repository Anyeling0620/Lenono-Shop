import React, { useEffect, useState } from 'react';

// 直接接收源数据的开始/结束时间
interface TimeDisplayProps {
  startTime: string;
  endTime: string;
  className?: string;
}

// 时间单位类型
interface TimeUnit {
  hours: string;
  minutes: string;
  seconds: string;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ startTime, endTime, className = '' }) => {
  const [remainingTime, setRemainingTime] = useState<TimeUnit>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  });
  const [statusText, setStatusText] = useState('');
  const [displayTime, setDisplayTime] = useState('');

  // 优化：防抖处理，避免频繁更新（可选，根据性能需求）
  useEffect(() => {
    const updateTimer = () => {
      try {
        const now = new Date().getTime();
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();

        // 计算剩余时间
        let remaining = 0;
        if (now < start) {
          remaining = start - now;
          setStatusText('即将开始');
        } else if (now >= start && now < end) {
          remaining = end - now;
          setStatusText('正在进行');
        } else {
          remaining = 0;
          setStatusText('已结束');
        }

        // 格式化剩余时间（补零）
        const formatUnit = (num: number) => num.toString().padStart(2, '0');
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

        setRemainingTime({
          hours: formatUnit(hours),
          minutes: formatUnit(minutes),
          seconds: formatUnit(seconds)
        });

        // 格式化显示时间：HH:mm（处理时间格式异常）
        const startDate = new Date(startTime);
        setDisplayTime(`${formatUnit(startDate.getHours())}:${formatUnit(startDate.getMinutes())}`);
      } catch (error) {
        console.error('时间计算错误：', error);
      }
    };

    // 立即更新
    updateTimer();
    // 每秒更新（使用requestAnimationFrame优化性能）
    const timer = setInterval(() => {
      requestAnimationFrame(updateTimer);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  return (
    <div className={`text-center ${className}`}>
      <span className="text-[20px] text-white font-semibold">{displayTime}</span>
      <span className="text-[20px] text-white font-semibold"> 场</span>
      <div className="text-[16px] text-white font-semibold">{statusText}</div>
      <div className="mt-[18px] text-center">
        <TimeUnit value={remainingTime.hours} />
        <span className='text-white'>:</span>
        <TimeUnit value={remainingTime.minutes} />
        <span className='text-white'>:</span>
        <TimeUnit value={remainingTime.seconds} />
      </div>
    </div>
  );
};

const TimeUnit: React.FC<{ value: string }> = ({ value }) => (
  <span className="text-[16px] inline-block w-[30px] h-[30px] leading-[30px] bg-[#242424] rounded text-white mx-1">
    {value}
  </span>
);

export default TimeDisplay;