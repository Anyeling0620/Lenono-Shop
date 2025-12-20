import type {  TimeStatus, SeckillProductVO, SeckillProductConfigVO } from '../types/flashSale';

/**
 * 计算剩余时间（替换原有 calculateRemainingTime，基于 startTime/endTime）
 * @param startTime 开始时间（YYYY-MM-DD HH:mm:ss）
 * @param endTime 结束时间（YYYY-MM-DD HH:mm:ss）
 * @returns 剩余时间（小时、分钟、秒）
 */
export const calculateRemainingTime = (startTime: string, endTime: string) => {
  const now = new Date().getTime();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  let remaining = 0;
  if (now < start) {
    // 未开始：距离开始的时间
    remaining = start - now;
  } else if (now >= start && now < end) {
    // 进行中：距离结束的时间
    remaining = end - now;
  } else {
    // 已结束：剩余时间为0
    remaining = 0;
  }

  const hours = Math.floor(remaining / (1000 * 60 * 60))
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
    .toString()
    .padStart(2, '0');

  return { hours, minutes, seconds };
};

/**
 * 获取场次显示时间（HH:mm，替换原有 getSessionDisplayTime）
 * @param startTime 开始时间（YYYY-MM-DD HH:mm:ss）
 * @returns 格式化后的时间（如 10:00）
 */
export const getSessionDisplayTime = (startTime: string): string => {
  try {
    return startTime.split(' ')[1].slice(0, 5);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return '00:00';
  }
};

/**
 * 获取场次状态（替换原有 getSessionStatus，基于 startTime/endTime）
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @returns 状态标识
 */
export const getSessionStatus = (startTime: string, endTime: string): TimeStatus => {
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
};

/**
 * 辅助函数：获取商品秒杀价格最低的配置项
 * @param product 秒杀商品
 * @returns 最低价格配置项
 */
export const getLowestPriceConfig = (product: SeckillProductVO): SeckillProductConfigVO => {
  const validConfigs = product.configs.filter(config =>
    config.seckillPrice > 0 &&
    config.status === '正常' &&
    config.config.status === '正常'
  );

  if (validConfigs.length === 0) {
    // 兜底配置项
    return {
      id: '',
      seckillProductId: product.id,
      configId: '',
      shelfNum: 0,
      remainNum: 0,
      lockNum: 0,
      seckillPrice: 0,
      createdAt: '',
      updatedAt: '',
      status: '售罄',
      config: {
        id: '',
        productId: product.productId,
        config1: '',
        config2: '',
        salePrice: 0,
        originalPrice: 0,
        createdAt: '',
        updatedAt: '',
        status: '下架'
      }
    };
  }

  // 找到最低价格配置项
  return validConfigs.reduce((prev, current) =>
    prev.seckillPrice < current.seckillPrice ? prev : current
  );
};

/**
 * 辅助函数：计算商品已售百分比
 * @param product 秒杀商品
 * @returns 已售百分比
 */
export const calculateSoldPercent = (product: SeckillProductVO): number => {
  const mainConfig = getLowestPriceConfig(product);
  const total = mainConfig.shelfNum;
  const sold = total - mainConfig.remainNum - mainConfig.lockNum;

  if (total <= 0) return 0;
  return Math.floor((sold / total) * 100);
};