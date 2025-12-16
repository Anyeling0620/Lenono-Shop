import React, { useState } from 'react';
import { Cascader, type CascaderProps, Typography } from 'antd';
import { addressOptions, type AddressTreeNode } from '../../utils/addressData';

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
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
    value,
    onChange,
    disabled = false,
    placeholder = '请选择省/市/区/街道',
}) => {
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

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
                options={addressOptions}
                value={value}
                onChange={handleChange}
                displayRender={displayRender}
                placeholder={placeholder}
                disabled={disabled}
                className='w-full  address-cascader'
                popupClassName='address-cascader-popup'
                changeOnSelect={false}
                allowClear
            />



        </div>

    );
};

export default AddressSelector;