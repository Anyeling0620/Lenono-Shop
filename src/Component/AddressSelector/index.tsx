// src/components/AddressSelector/index.tsx
import React, { useState, useEffect } from 'react';
import { Cascader, type CascaderProps, Typography, Spin } from 'antd';
import {
  getAddressOptions,
  type AddressTreeNode,
  prefetchAddressData,
  buildSingleLevelTree,
} from '../../utils/addressData';

const { Text } = Typography;

// 定义组件属性
interface AddressSelectorProps {
  /** 选中的地址编码数组（如：['110000000000', '110100000000', '110101000000', '110101001000']） */
  value?: string[];
  /** 选择变化时的回调 */
  onChange?: (value: string[], selectedOptions: AddressTreeNode[]) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 占位符 */
  placeholder?: string;
  /** 是否预加载数据（组件挂载时开始加载） */
  prefetch?: boolean;
}

const AddressSelectorComponent: React.FC<AddressSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = '请选择省/市/区/街道',
  prefetch = true,
}) => {
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [options, setOptions] = useState<AddressTreeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载初始省级数据
  useEffect(() => {
    let mounted = true;

    const loadInitialOptions = async () => {
      if (options.length > 0) return;

      setLoading(true);
      setError(null);

      try {
        const addressOptions = await getAddressOptions();
        if (mounted) {
          setOptions(addressOptions);
          setLoading(false);
        }
      } catch (err) {
        console.error('加载地址数据失败:', err);
        if (mounted) {
          setError('加载地址数据失败，请重试');
          setLoading(false);
        }
      }
    };

    // 预加载逻辑：使用requestIdleCallback避免阻塞主线程
    if (prefetch) {
      const scheduleLoad = () => {
        if (typeof requestIdleCallback !== 'undefined') {
          requestIdleCallback(() => mounted && loadInitialOptions());
        } else {
          setTimeout(() => mounted && loadInitialOptions(), 0);
        }
      };
      scheduleLoad();
    }

    return () => {
      mounted = false;
    };
  }, [options.length, prefetch]);

  // 处理级联选择变化
  const handleChange: CascaderProps['onChange'] = (value, selectedOptions) => {
    // 提取选中的标签
    const labels = selectedOptions
      .map(item => item.label)
      .filter((label): label is string => label != null);
    setSelectedLabels(labels);

    onChange?.(value as string[], selectedOptions as AddressTreeNode[]);
  };

  // 懒加载子节点的核心函数
  const loadData: CascaderProps['loadData'] = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1] as AddressTreeNode;

    // 防止重复加载
    if (targetOption.loading || targetOption.children || targetOption.isLeaf) {
      return;
    }

    // 标记为加载中
    targetOption.loading = true;

    try {
      // 加载当前节点的直接子节点
      const childNodes = await buildSingleLevelTree(targetOption.value);
      // 更新节点状态
      targetOption.loading = false;
      targetOption.children = childNodes;
      // 触发组件重新渲染
      setOptions([...options]);
    } catch (err) {
      console.error('加载子节点失败:', err);
      targetOption.loading = false;
    }
  };

  const displayRender = (labels: string[]) => {
    return labels.join(' / ');
  };

  // 加载中状态
  if (loading) {
    return (
      <div style={{ width: '100%', maxWidth: 500 }} className="address-selector-container">
        <Spin size="small" />
        <Text type="secondary" style={{ marginLeft: 8 }}>加载地址数据中...</Text>
      </div>
    );
  }

  // 加载失败状态
  if (error) {
    return (
      <div style={{ width: '100%', maxWidth: 500 }} className="address-selector-container">
        <Text type="danger">{error}</Text>
        <button
          onClick={() => {
            setOptions([]);
            setError(null);
          }}
          style={{ marginLeft: 8, padding: '2px 8px' }}
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: 500 }} className="address-selector-container">
      {value && value.length === 0 && (
        <div className="mb-2">
          <Text type="secondary">请选择地址：</Text>
        </div>
      )}

      {value && value.length > 0 && (
        <div className="mb-2">
          <Text type="secondary">已选地址：</Text>
          <Text>{selectedLabels.join(' / ')}</Text>
        </div>
      )}

      <Cascader
        options={options}
        value={value}
        onChange={handleChange}
        loadData={loadData} // 启用懒加载
        displayRender={displayRender}
        placeholder={placeholder}
        disabled={disabled || options.length === 0}
        className="w-full address-cascader"
        popupClassName="address-cascader-popup"
        changeOnSelect={false}
        allowClear
        expandTrigger="click" // 点击展开（懒加载推荐）
        notFoundContent={options.length === 0 ? '地址数据加载中...' : '无数据'}
      />
    </div>
  );
};

// 创建组件并添加静态属性
const AddressSelector = Object.assign(AddressSelectorComponent, {
  prefetch: prefetchAddressData,
});

export default AddressSelector;