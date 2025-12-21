/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/addressData.ts
// 地址数据懒加载工具（适配12位编码+二维数组JSON格式）
// 避免在应用启动时加载大型JSON文件，改为按需加载

export interface AddressItem {
  code: string; // 12位编码，如：110000000000
  name: string; // 名称，如：北京市
  parentCode: string; // 父级编码，如：0
  level: number; // 层级：1(省)、2(市)、3(区/县)、4(街道/乡镇)
}

export interface AddressTreeNode {
  value: string;
  label: string;
  children?: AddressTreeNode[];
  loading?: boolean; // 标记是否正在加载子节点
  isLeaf?: boolean; // 标记是否为叶子节点（level=4时为叶子）
}

// 1. 内存缓存：单层级数据缓存（父级编码 -> 子节点数据）
const singleLevelCache: Record<string, AddressItem[]> = {};
// 2. 本地存储缓存：持久化已加载数据（会话级）
const STORAGE_KEY_PREFIX = 'address_cache_';

/**
 * 从本地存储获取缓存数据
 */
const getLocalCache = (parentCode: string): AddressItem[] | null => {
  try {
    const cacheStr = sessionStorage.getItem(`${STORAGE_KEY_PREFIX}${parentCode}`);
    return cacheStr ? JSON.parse(cacheStr) : null;
  } catch (error) {
    console.error('读取本地缓存失败:', error);
    return null;
  }
};

/**
 * 写入本地存储缓存
 */
const setLocalCache = (parentCode: string, data: AddressItem[]): void => {
  try {
    sessionStorage.setItem(`${STORAGE_KEY_PREFIX}${parentCode}`, JSON.stringify(data));
  } catch (error) {
    console.error('写入本地缓存失败:', error);
  }
};

/**
 * 解析二维数组为AddressItem对象
 * 二维数组格式：[code(12位), name, parentCode, level]
 * @param arr 二维数组数据
 * @returns 解析后的AddressItem数组
 */
const parseArrayToAddressItem = (arr: any[][]): AddressItem[] => {
  return arr.map(item => ({
    code: item[0] as string, // 12位编码
    name: item[1] as string,
    parentCode: item[2] as string,
    level: Number(item[3]) || 0, // 1/2/3/4层级
  }));
};

/**
 * 动态加载单层级数据（按父级编码加载，仅加载当前层级，不加载全量）
 * 适配12位编码的二维数组JSON文件，文件名保持不变
 * @param parentCode 父级编码（如：0、110000000000）
 * @returns 该父级下的直接子节点数据（单层级）
 */
async function loadSingleLevelData(parentCode: string): Promise<AddressItem[]> {
  let rawData: any[][] = [];

  try {
    // 根据父级编码加载对应层级的JSON文件（核心：按parentCode过滤，而非编码长度）
    if (parentCode === '0') {
      // 父级为0：加载省级数据（level=1）
      const provinceData = await import('../assets/行政区划分/01省.json');
      rawData = provinceData.default as any[][];
    } else if (parentCode.length === 12) {
      // 父级为12位编码：判断加载市/区/街道数据
      // 先尝试加载市级数据（level=2）
      const cityData = await import('../assets/行政区划分/02市.json');
      const cityFiltered = (cityData.default as any[][]).filter(item => item[2] === parentCode);
      if (cityFiltered.length > 0) {
        rawData = cityFiltered;
      } else {
        // 再尝试加载区级数据（level=3）
        const areaData = await import('../assets/行政区划分/03区(县).json');
        const areaFiltered = (areaData.default as any[][]).filter(item => item[2] === parentCode);
        if (areaFiltered.length > 0) {
          rawData = areaFiltered;
        } else {
          // 最后加载街道数据（level=4）
          const streetData = await import('../assets/行政区划分/04乡镇(街道).json');
          rawData = (streetData.default as any[][]).filter(item => item[2] === parentCode);
        }
      }
    }

    // 解析二维数组为AddressItem对象
    return parseArrayToAddressItem(rawData);
  } catch (error) {
    console.error(`加载父级${parentCode}的子节点失败:`, error);
    return [];
  }
}

/**
 * 获取指定父级的直接子节点（单层级，带双重缓存）
 * @param parentCode 父级编码
 * @returns 该父级下的直接子节点数据
 */
export async function getChildrenByParentCode(parentCode: string): Promise<AddressItem[]> {
  // 优先级：内存缓存 > 本地存储 > 加载数据
  if (singleLevelCache[parentCode]) {
    return singleLevelCache[parentCode];
  }

  const localCacheData = getLocalCache(parentCode);
  if (localCacheData) {
    singleLevelCache[parentCode] = localCacheData;
    return localCacheData;
  }

  // 加载数据并缓存
  const data = await loadSingleLevelData(parentCode);
  singleLevelCache[parentCode] = data;
  setLocalCache(parentCode, data);

  return data;
}

/**
 * 构建指定父级的直接子节点树（单层级，非嵌套）
 * @param parentCode 父级编码
 * @returns 适配Cascader的节点树
 */
export async function buildSingleLevelTree(parentCode: string): Promise<AddressTreeNode[]> {
  const children = await getChildrenByParentCode(parentCode);

  // 转换为Cascader需要的结构，暂不递归构建子节点（交给懒加载）
  return children.map(item => {
    // 判断是否为叶子节点：level=4（街道/乡镇）时为叶子节点
    const isLeaf = item.level === 4;
    return {
      value: item.code,
      label: item.name,
      isLeaf,
    };
  });
}

/**
 * 初始化获取省级数据（第一级）
 * 兼容旧接口，使用时需要await
 */
export async function getAddressOptions(): Promise<AddressTreeNode[]> {
  return await buildSingleLevelTree('0');
}

/**
 * 预加载热门节点数据（提升用户体验）
 * 比如：预加载北京市、上海市的子节点数据
 */
export async function prefetchHotNodes(): Promise<void> {
  try {
    // 预加载北京市（110000000000）的子节点（市辖区）
    await getChildrenByParentCode('110000000000');
    // 预加载上海市（310000000000）的子节点（市辖区）
    await getChildrenByParentCode('310000000000');
  } catch (error) {
    // 静默失败，不影响主流程
    console.warn('预加载热门节点失败:', error);
  }
}

/**
 * 预加载地址数据（可选）
 * 可以在应用空闲时或用户可能使用地址选择器前调用
 */
export function prefetchAddressData(): void {
  // 先加载省级数据，再预加载热门节点
  getChildrenByParentCode('0').catch(() => {});
  prefetchHotNodes().catch(() => {});
}

// 向后兼容：同步导出（返回空数组，实际数据异步加载）
export const addressOptions: AddressTreeNode[] = [];

// 初始化时开始预加载
prefetchAddressData();