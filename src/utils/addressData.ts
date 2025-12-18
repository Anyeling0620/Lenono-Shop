// 地址数据懒加载工具
// 避免在应用启动时加载大型JSON文件，改为按需加载

export interface AddressItem {
  code: string;
  name: string;
  parentCode: string;
  level: number;
}

export interface AddressTreeNode {
  value: string;
  label: string;
  children?: AddressTreeNode[];
}

// 缓存已加载的数据
let addressDataCache: AddressItem[] | null = null;
let addressTreeCache: AddressTreeNode[] | null = null;
// 缓存子树，避免重复构建
const subTreeCache: Record<string, AddressTreeNode[]> = {};

/**
 * 动态加载地址数据
 * 使用动态导入避免在初始包中包含大型JSON文件
 */
async function loadAddressData(): Promise<AddressItem[]> {
  if (addressDataCache) {
    return addressDataCache;
  }

  try {
    // 动态导入JSON文件，只加载省、市、区三级，忽略街道以减少数据量
    const [provinceData, cityData, areaData] = await Promise.all([
      import('../assets/行政区划分/01省.json'),
      import('../assets/行政区划分/02市.json'),
      import('../assets/行政区划分/03区(县).json'),
    ]);

    // 合并地址数据（不包含街道）
    addressDataCache = [
      ...provinceData.default,
      ...cityData.default,
      ...areaData.default,
    ];

    return addressDataCache;
  } catch (error) {
    console.error('加载地址数据失败:', error);
    throw error;
  }
}

/**
 * 构建层级地址数据（递归）
 * @param parentCode 父级编码（初始为 '0'，对应省级的parentCode）
 * @param depth 当前递归深度，用于防止无限递归（最大为4）
 * @returns 嵌套的层级数据（适配Cascader组件）
 */
export async function buildAddressTree(parentCode: string = '0', depth: number = 0): Promise<AddressTreeNode[]> {
  // 安全防护：最大深度为4（省、市、区、街道）
  if (depth > 4) {
    console.warn('地址树递归深度超过限制，终止递归');
    return [];
  }

  // 检查缓存
  if (parentCode === '0' && addressTreeCache) {
    return addressTreeCache;
  }
  if (subTreeCache[parentCode]) {
    return subTreeCache[parentCode];
  }

  const allAddressData = await loadAddressData();
  
  // 筛选当前父级下的子节点
  const children = allAddressData.filter(item => item.parentCode === parentCode);
  
  // 递归构建子节点的层级结构
  const childTrees = await Promise.all(
    children.map(async (item) => {
      const childNodes = await buildAddressTree(item.code, depth + 1);
      return {
        value: item.code,
        label: item.name,
        ...(childNodes.length > 0 ? { children: childNodes } : {}),
      };
    })
  );

  // 缓存结果
  if (parentCode === '0') {
    addressTreeCache = childTrees;
  } else {
    subTreeCache[parentCode] = childTrees;
  }

  return childTrees;
}

/**
 * 获取地址选项（兼容旧接口）
 * 注意：这是一个异步函数，使用时需要await
 */
export async function getAddressOptions(): Promise<AddressTreeNode[]> {
  return await buildAddressTree();
}

/**
 * 预加载地址数据（可选）
 * 可以在应用空闲时或用户可能使用地址选择器前调用
 */
export function prefetchAddressData(): void {
  // 立即开始加载数据，不等待空闲时间
  loadAddressData().catch(() => {
    // 静默失败，等真正需要时再加载
  });
}

// 向后兼容：同步导出（返回空数组，实际数据异步加载）
export const addressOptions: AddressTreeNode[] = [];

// 初始化时开始预加载
prefetchAddressData();