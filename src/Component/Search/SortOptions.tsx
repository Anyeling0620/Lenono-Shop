/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-27 20:26:40
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-27 23:18:48
 * @FilePath: \lenovo-shop\src\component\Search\SortOptions.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */

import type { SearchFiltersType } from "../../types/searchFilter";



interface SortOptionsProps {
    options: Array<{ key: SearchFiltersType['sortBy']; label: string }>;
    currentSort: SearchFiltersType['sortBy'];
    priceOrder?: 'asc' | 'desc';
    commentOrder?: 'asc' | 'desc';
    onSortClick: (sortKey: SearchFiltersType['sortBy']) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({
    options,
    currentSort,
    priceOrder,
    commentOrder,
    onSortClick
}) => {
    const getSortDisplayText = (sortKey: SearchFiltersType['sortBy']) => {
        if (sortKey === 'price') {
            return `价格 ${priceOrder === 'asc' ? '↑' : '↓'}`;
        }
        if (sortKey === 'comment') {
            return `评论 ${commentOrder === 'asc' ? '↑' : '↓'}`;
        }
        return options.find(option => option.key === sortKey)?.label || sortKey;
    };

    return (
        <>
            {options.map((option) => (
                <li
                    key={option.key}
                    className={`float-left px-4 text-center border-r border-[#bebebe] cursor-pointer font-normal text-xs ${currentSort === option.key ? 'text-red-500' : 'text-gray-600'
                        }`}
                    onClick={() => onSortClick(option.key)}
                >
                    {getSortDisplayText(option.key)}
                </li>
            ))}
        </>
    );
};

export default SortOptions;