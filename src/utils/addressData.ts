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

/**
 * 动态加载地址数据
 * 使用动态导入避免在初始包中包含大型JSON文件
 */
async function loadAddressData(): Promise<AddressItem[]> {
  if (addressDataCache) {
    return addressDataCache;
  }

  try {
    // 动态导入JSON文件
    const [provinceData, cityData, areaData, streetData] = await Promise.all([
      import('../assets/行政区划分/01省.json'),
      import('../assets/行政区划分/02市.json'),
      import('../assets/行政区划分/03区(县).json'),
      import('../assets/行政区划分/04乡镇(街道).json'),
    ]);

    // 合并所有地址数据
    addressDataCache = [
      ...provinceData.default,
      ...cityData.default,
      ...areaData.default,
      ...streetData.default,
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
 * @returns 嵌套的层级数据（适配Cascader组件）
 */
export async function buildAddressTree(parentCode: string = '0'): Promise<AddressTreeNode[]> {
  if (addressTreeCache && parentCode === '0') {
    return addressTreeCache;
  }

  const allAddressData = await loadAddressData();
  
  // 筛选当前父级下的子节点
  const children = allAddressData.filter(item => item.parentCode === parentCode);
  
  // 递归构建子节点的层级结构
  const tree = children.map(item => {
    return {
      value: item.code,
      label: item.name,
      // 标记是否有子节点，但不立即构建
      hasChildren: allAddressData.some(child => child.parentCode === item.code),
    };
  });

  // 对于根节点，缓存整个树
  if (parentCode === '0') {
    // 异步构建完整的子树
    const buildFullTree = async (): Promise<AddressTreeNode[]> => {
      const fullTree = await Promise.all(
        tree.map(async (node) => {
          const childNodes = await buildAddressTree(node.value);
          return {
            value: node.value,
            label: node.label,
            ...(childNodes.length > 0 ? { children: childNodes } : {}),
          };
        })
      );
      addressTreeCache = fullTree;
      return fullTree;
    };

    // 立即开始构建完整树，但先返回基本结构
    buildFullTree().catch(console.error);
    
    // 先返回基本结构，让UI可以显示
    return tree.map(node => ({
      value: node.value,
      label: node.label,
      // 先不包含children，等异步构建完成后再更新
    }));
  }

  // 对于非根节点，递归构建子树
  const childTrees = await Promise.all(
    children.map(async (item) => {
      const childNodes = await buildAddressTree(item.code);
      return {
        value: item.code,
        label: item.name,
        ...(childNodes.length > 0 ? { children: childNodes } : {}),
      };
    })
  );

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
  // 在空闲时开始加载数据
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(() => {
      loadAddressData().catch(() => {
        // 静默失败，等真正需要时再加载
      });
    });
  } else {
    // 回退方案：延迟加载
    setTimeout(() => {
      loadAddressData().catch(() => {
        // 静默失败
      });
    }, 3000);
  }
}

// 向后兼容：同步导出（返回空数组，实际数据异步加载）
export const addressOptions: AddressTreeNode[] = [];

// 初始化时开始预加载
prefetchAddressData();