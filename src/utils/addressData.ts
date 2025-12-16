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

/**
 * 构建层级地址数据（递归）
 * @param parentCode 父级编码（初始为 '0'，对应省级的 parentCode）
 * @returns 嵌套的层级数据（适配 Cascader 组件）
 */
export const buildAddressTree = (parentCode: string = '0'):AddressTreeNode[] => {
  // 筛选当前父级下的子节点
  const children = allAddressData.filter(item => item.parentCode === parentCode);
  
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

// 导出构建好的地址层级数据
export const addressOptions = buildAddressTree();