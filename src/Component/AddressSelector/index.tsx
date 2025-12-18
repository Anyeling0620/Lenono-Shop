import React, { useState, useEffect, useMemo } from 'react';
import { Cascader, type CascaderProps, Typography, Spin } from 'antd';
import { getAddressOptions, type AddressTreeNode, prefetchAddressData } from '../../utils/addressData';


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

    // 加载地址数据
    useEffect(() => {
        let mounted = true;
        
        const loadOptions = async () => {
            if (options.length > 0) return; // 已加载
            
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

        // 如果预加载，使用 requestIdleCallback 或 setTimeout 延迟加载以避免阻塞主线程
        if (prefetch) {
            const scheduleLoad = () => {
                if (typeof requestIdleCallback !== 'undefined') {
                    requestIdleCallback(() => {
                        if (mounted) loadOptions();
                    });
                } else {
                    setTimeout(() => {
                        if (mounted) loadOptions();
                    }, 0);
                }
            };
            scheduleLoad();
        }

        // 组件卸载时取消
        return () => {
            mounted = false;
        };
    }, [options.length, prefetch]);

    // 延迟加载地址选项，只在组件首次渲染时构建一次
    const addressOptions = useMemo(() => getAddressOptions(), []);

    // 处理级联选择变化
    const handleChange: CascaderProps['onChange'] = (value, selectedOptions) => {
        // 提取选中的标签
        const labels = selectedOptions
            .map(item => item.label)
            .filter((label): label is string => label != null);
        setSelectedLabels(labels);

        onChange?.(value as string[], selectedOptions as AddressTreeNode[]);
    };

    const displayRender = (labels: string[]) => {
        return labels.join(' / ');
    };

    // 如果正在加载，显示加载状态
    if (loading) {
        return (
            <div style={{ width: '100%', maxWidth: 500 }} className="address-selector-container">
                <Spin size="small" />
                <Text type="secondary" style={{ marginLeft: 8 }}>加载地址数据中...</Text>
            </div>
        );
    }

    // 如果加载失败，显示错误
    if (error) {
        return (
            <div style={{ width: '100%', maxWidth: 500 }} className="address-selector-container">
                <Text type="danger">{error}</Text>
                <button 
                    onClick={() => {
                        setOptions([]); // 重置选项以触发重新加载
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
        // 外层容器使用 Tailwind 样式，内嵌全局样式处理滚动条和 Antd 样式覆盖
        <div style={{ width: '100%', maxWidth: 500 }} className="address-selector-container">

            {value && value.length === 0 && (
                <div className="mb-2">
                    <Text type="secondary">请选择地址：</Text>
                </div>
            )}
            {/* 可选：显示选中的地址信息（使用 Tailwind 样式） */}
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
                displayRender={displayRender}
                placeholder={placeholder}
                disabled={disabled || options.length === 0}
                className='w-full  address-cascader'
                popupClassName='address-cascader-popup'
                changeOnSelect={false}
                allowClear
                notFoundContent={options.length === 0 ? '地址数据加载中...' : '无数据'}
            />

        </div>

    );
};

// 创建组件并添加静态属性
const AddressSelector = Object.assign(AddressSelectorComponent, {
    prefetch: prefetchAddressData
});

export default AddressSelector;