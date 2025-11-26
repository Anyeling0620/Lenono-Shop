/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-25 22:01:42
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-25 23:21:36
 * @FilePath: \lenovo-shop\src\component\FlashSale\TimeDisplay.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
// components/TimeDisplay.tsx
import React, { useEffect, useState } from 'react';
import type { TimeInfo, TimeUnit } from '../../types/flashSale';
import {
    calculateRemainingTime,
    getSessionDisplayTime,
    getStatusText
} from '../../utils/timeCalculator';

interface TimeDisplayProps {
    timeInfo: TimeInfo;
    className?: string;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeInfo, className = '' }) => {
    const { duration, time } = timeInfo;

    const [remainingTime, setRemainingTime] = useState<TimeUnit>({
        hours: '00',
        minutes: '00',
        seconds: '00'
    });
    const [statusText, setStatusText] = useState('');
    useEffect(() => {
        const updateTimer = () => {
            const newRemainingTime = calculateRemainingTime(time, duration);
            const newStatusText = getStatusText(time, duration);

            setRemainingTime(newRemainingTime);
            setStatusText(newStatusText);
        };

        // 立即更新一次
        updateTimer();

        // 每秒更新一次
        const timer = setInterval(updateTimer, 1000);

        return () => clearInterval(timer);
    }, [time, duration]);
    const displayTime = getSessionDisplayTime(time);

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
