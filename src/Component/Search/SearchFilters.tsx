// components/Search/SearchFilters.tsx
import React, { useState } from 'react';
import SortOptions from './SortOptions';
import type { PriceRange, TabFilters,SearchFiltersType } from '../../types/searchFilter';



interface SortOption {
    key: SearchFiltersType['sortBy'];
    label: string;
}
const sortOptions:SortOption[] = [
    { key: 'recommend' as const, label: '推荐' },
    { key: 'new' as const, label: '新品' },
    { key: 'comment' as const, label: '评论' },
    { key: 'price' as const, label: '价格' }
];
interface FilterItem {
    key: keyof TabFilters;
    label: string;
}
const filterItems:FilterItem[] = [
    { key: 'self' as keyof TabFilters, label: '自营' },
    { key: 'discountCoupon' as keyof TabFilters, label: '优惠券' },
    { key: 'custom' as keyof TabFilters, label: '外观定制' },
    { key: 'installment' as keyof TabFilters, label: '分期免息' },
    { key: 'tradeIn' as keyof TabFilters, label: '以旧换新' }
];


interface SearchFiltersProps {  //  搜索过滤组件的props
    filters: SearchFiltersType;  // 当前搜索过滤条件
    onFiltersChange: (filters: SearchFiltersType) => void;  // 过滤条件变化时的回调函数
    totalCount: number ;    // 搜索结果的总数
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
    filters,   // 当前搜索过滤条件
    onFiltersChange,  // 过滤条件变化时的回调函数
    totalCount  // 搜索结果的总数
}) => {
    const [priceInput, setPriceInput] = useState({  // 价格输入框的状态
        min: filters.priceRange.min?.toString() || '',
        max: filters.priceRange.max?.toString() || ''
    });

    // 处理排序点击
    const handleSortClick = (sortKey: SearchFiltersType['sortBy']) => {
        let newcommentOrder = filters.commentOrder;
        let newPriceOrder = filters.priceOrder;

        // 如果是价格排序，切换升降序
        if (sortKey === 'price') {
            newPriceOrder = filters.priceOrder === 'asc' ? 'desc' : 'asc';
        } else if (sortKey === 'comment') {
            newcommentOrder = filters.commentOrder === 'asc' ? 'desc' : 'asc';
        } else {
            newcommentOrder = newPriceOrder = 'desc'; // 其他排序默认降序
        }

        onFiltersChange({
            ...filters,
            sortBy: sortKey,
            priceOrder: newPriceOrder,
            commentOrder: newcommentOrder
        });
    };

    // 处理库存筛选
    const handleStockChange = (inStock: boolean) => {
        onFiltersChange({
            ...filters,
            inStock
        });
    };

    // 处理价格范围输入
    const handlePriceInputChange = (field: 'min' | 'max', value: string) => {
        setPriceInput(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // 应用价格筛选
    const applyPriceAndKeywordSFilter = () => {
        const priceRange: PriceRange = {};

        if (priceInput.min) {
            const min = parseFloat(priceInput.min);
            if (!isNaN(min)) {
                priceRange.min = min;
            }
        }

        if (priceInput.max) {
            const max = parseFloat(priceInput.max);
            if (!isNaN(max)) {
                priceRange.max = max;
            }
        }

        onFiltersChange({
            ...filters,
            priceRange,
        });
    };

    // 处理标签筛选
    const handleTabFilterChange = (key: keyof TabFilters) => {
        const newTabFilters = {
            ...filters.tabFilters,
            [key]: !filters.tabFilters[key]
        };

        onFiltersChange({
            ...filters,
            tabFilters: newTabFilters
        });
    };

    return (
        <div className='bg-[#ffffff] w-full sticky shadow-sm top-[60px] z-50 h-[40px] py-2 border-t-[1px] border-[#e6e6e6]'>
            <div className='w-[1200px] mx-auto'>
                <ul className='flex mt-1 select-none'>
                    {/* 排序选项 */}
                    <SortOptions
                        options={sortOptions}
                        currentSort={filters.sortBy}
                        priceOrder={filters.priceOrder}
                        commentOrder={filters.commentOrder}
                        onSortClick={handleSortClick}
                    />

                    {/* 库存筛选 */}
                    <StockFilter
                        checked={filters.inStock}
                        onChange={handleStockChange}
                    />

                    {/* 价格范围和搜索 */}
                    <PriceSearch
                        priceInput={priceInput}
                        onPriceChange={handlePriceInputChange}
                        onApply={applyPriceAndKeywordSFilter}
                    />

                    {/* 标签筛选 */}
                    <FilterTags
                        items={filterItems}
                        filters={filters.tabFilters}
                        onChange={handleTabFilterChange}
                    />

                    {/* 商品总数 */}
                    <TotalCount totalCount={totalCount} />
                </ul>
            </div>
        </div>
    );
};


const FilterTags = ({
    items,
    filters,
    onChange }: {
        items: {
            key: keyof TabFilters;
            label: string;
        }[],
        filters: TabFilters,
        onChange: (key: keyof TabFilters) => void
    }) => (
    <li className='float-right right-0 ml-auto -mr-10 h-[18px] cursor-pointer w-[35%] -mt-1.5'>
        {items.map((item) => (
            <span
                key={item.key}
                onClick={() => onChange(item.key)}
                className={`text-[12px] bg-no-repeat bg-left h-[20px] w-auto inline-block pl-[22px] cursor-pointer text-center font-normal ml-[6px] ${filters[item.key]
                    ? 'bg-[url(https://m2.lefile.cn/lenovo_common_search/lenovo_pc/img/checked.jpg)]'
                    : 'bg-[url(https://m2.lefile.cn/lenovo_common_search/lenovo_pc/img/check.jpg)]'
                    }`}
            >
                {item.label}
            </span>
        ))}
    </li>
)

const TotalCount = ({ totalCount }: { totalCount: number }) => (<li className='font-normal text-[12px]'>
    <span>
        共
        <span className='text-red-600 text-sm mx-1 inline-block w-[20px] text-center'>{totalCount}</span>
        件
    </span>
</li>)



const PriceSearch = ({
    priceInput,
    onPriceChange,
    onApply
}: {
    priceInput: { min: string; max: string };
    onPriceChange: (field: 'min' | 'max', value: string) => void;
    onApply: () => void;
}) => {
    return (
        <li className='px-4 float-left text-xs font-normal w-[33%] h-auto -mt-0.5'>
            <input
                type="text"
                placeholder='￥'
                value={priceInput.min}
                onChange={(e) => onPriceChange('min', e.target.value)}
                className='w-[63px] mx-2 h-[22px] leading-6 align-middle px-[5px] py-0 rounded-sm font-normal border-[1px] border-[#dadada] outline-none'
            />
            -
            <input
                type="text"
                placeholder='￥'
                value={priceInput.max}
                onChange={(e) => onPriceChange('max', e.target.value)}
                className='w-[63px] mx-2 h-[22px] leading-6 align-middle px-[5px] py-0 rounded-sm font-normal border-[1px] border-[#dadada] outline-none'
            />
            <input
                type='button'
                value='确定'
                onClick={onApply}
                className='hover:bg-[#dadada] align-middle w-[60px] h-[22px] mx-2 leading-[20px] font-normal border-[#dadada] border-[1px] rounded-sm outline-none text-center cursor-pointer'
            />
        </li>
    );
};



const StockFilter = ({ checked, onChange }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
}
) => {
    return (
        <li className='float-left px-4 text-center border-r border-[#bebebe] cursor-pointer font-normal text-xs'>
            <label className='cursor-pointer'>
                <input
                    type="checkbox"
                    className='mr-1 align-middle'
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                有库存
            </label>
        </li>
    );
};




export default SearchFilters;
