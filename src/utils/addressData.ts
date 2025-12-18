// 导入本地 JSON 数据（注意：需确保 JSON 文件被正确解析，若使用 Vite/React CRA，需配置支持 JSON 导入）
import provinceData from '../assets/行政区划分/01省.json';
import cityData from '../assets/行政区划分/02市.json';
import areaData from '../assets/行政区划分/03区(县).json';
import streetData from '../assets/行政区划分/04乡镇(街道).json';

// 定义地址数据类型
export interface AddressItem {
  code: string;
  name: string;
  parentCode: string;
  level: number;
}

// 合并所有地址数据
const allAddressData: AddressItem[] = [
  ...provinceData,
  ...cityData,
  ...areaData,
  ...streetData,
];

export interface AddressTreeNode {
  value: string;
  label: string;
  children?: AddressTreeNode[];
}

// 使用 Map 建立 parentCode -> children[] 的索引，大幅提升性能
let addressIndexMap: Map<string, AddressItem[]> | null = null;

/**
 * 构建地址索引 Map（只构建一次）
 */
const buildAddressIndex = (): Map<string, AddressItem[]> => {
  if (addressIndexMap) {
    return addressIndexMap;
  }
  
  const indexMap = new Map<string, AddressItem[]>();
  for (const item of allAddressData) {
    const children = indexMap.get(item.parentCode) || [];
    children.push(item);
    indexMap.set(item.parentCode, children);
  }
  
  addressIndexMap = indexMap;
  return indexMap;
};

/**
 * 构建层级地址数据（递归，使用索引优化性能）
 * @param parentCode 父级编码（初始为 '0'，对应省级的 parentCode）
 * @returns 嵌套的层级数据（适配 Cascader 组件）
 */
const buildAddressTree = (parentCode: string = '0'): AddressTreeNode[] => {
  const indexMap = buildAddressIndex();
  // 使用索引查找子节点，O(1) 时间复杂度
  const children = indexMap.get(parentCode) || [];
  
  // 递归构建子节点的层级结构
  return children.map(item => {
    const childNodes = buildAddressTree(item.code);
    return {
      value: item.code, // Cascader 的值（存储编码）
      label: item.name, // Cascader 的显示名称
      // 若有子节点则递归，否则不显示 children
      ...(childNodes.length > 0 ? { children: childNodes } : {}),
    };
  });
};

// 延迟构建地址树，只在首次访问时构建
let cachedAddressOptions: AddressTreeNode[] | null = null;

/**
 * 获取地址选项（延迟构建，提升初始加载性能）
 * 只在首次调用时构建地址树，后续调用直接返回缓存
 */
export const getAddressOptions = (): AddressTreeNode[] => {
  if (!cachedAddressOptions) {
    cachedAddressOptions = buildAddressTree();
  }
  return cachedAddressOptions;
};