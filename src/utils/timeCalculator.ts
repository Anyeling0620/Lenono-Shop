import { type TimeStatus, type TimeUnit } from "../types/flashSale";

export const parseDuration = (duration: string): number => {
  const match = duration.match(/^(\d+)h$/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 1; // 默认1小时
};


export const parseDateTime = (dateTimeStr: string): Date => {
  const [year, month, day, hours, minutes, seconds] = dateTimeStr.split('-').map(Number);
  return new Date(year, month - 1, day, hours, minutes, seconds);
};

export const formatDateTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
};



export const calculateRemainingTime = (dateTimeStr: string, durationStr: string): TimeUnit => {
  const now = new Date();
  const startTime = parseDateTime(dateTimeStr);
  const durationHours = parseDuration(durationStr);
  
  // 计算结束时间
  const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);
  
  // 如果当前时间在开始时间之前，计算距离开始的时间
  if (now < startTime) {
    const diff = startTime.getTime() - now.getTime();
    return calculateTimeUnits(diff);
  }
  
  // 如果当前时间在活动进行中，计算距离结束的时间
  if (now >= startTime && now <= endTime) {
    const diff = endTime.getTime() - now.getTime();
    return calculateTimeUnits(diff);
  }
  
  // 如果活动已结束，返回全零
  return { hours: '00', minutes: '00', seconds: '00' };
};

/**
 * 将毫秒差转换为时分秒
 */
const calculateTimeUnits = (diff: number): TimeUnit => {
  if (diff <= 0) {
    return { hours: '00', minutes: '00', seconds: '00' };
  }
  
  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0')
  };
};


export const getSessionStatus = (dateTimeStr: string, durationStr: string): TimeStatus => {
  const now = new Date();
  const startTime = parseDateTime(dateTimeStr);
  const durationHours = parseDuration(durationStr);
  
  const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);
  
  if (now >= startTime && now <= endTime) {
    return 'start'; // 正在进行中，显示"距结束还剩"
  }else if( now > endTime) {
    return 'end'; // 已结束，显示"已结束"
  }
  
  return 'wait'; // 未开始，显示"明日开始"或其他开始提示
};

/**
 * 获取场次显示时间（HH:mm）
 */
export const getSessionDisplayTime = (dateTimeStr: string): string => {
  const date = parseDateTime(dateTimeStr);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * 判断是否是明天的场次
 */
export const isTomorrowSession = (dateTimeStr: string): boolean => {
  const now = new Date();
  const sessionDate = parseDateTime(dateTimeStr);
  
  // 判断是否是明天（忽略时间部分）
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return sessionDate.getDate() === tomorrow.getDate() &&
         sessionDate.getMonth() === tomorrow.getMonth() &&
         sessionDate.getFullYear() === tomorrow.getFullYear();
};

/**
 * 获取状态文本
 */
export const getStatusText = (dateTimeStr: string, durationStr: string): string => {
  const now = new Date();
  const startTime = parseDateTime(dateTimeStr);
  const durationHours = parseDuration(durationStr);
  const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);
  
  if (now < startTime) {
    if (isTomorrowSession(dateTimeStr)) {
      return '开始倒计时';
    } else {
      return '即将开始';
    }
  } else if (now >= startTime && now <= endTime) {
    return '距结束还剩';
  } else {
    return '已结束';
  }
};