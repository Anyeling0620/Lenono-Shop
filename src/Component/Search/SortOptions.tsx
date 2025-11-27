import type { SearchFilters } from "./SearchFilters";



interface SortOptionsProps {
    options: Array<{ key: SearchFilters['sortBy']; label: string }>;
    currentSort: SearchFilters['sortBy'];
    priceOrder?: 'asc' | 'desc';
    commentOrder?: 'asc' | 'desc';
    onSortClick: (sortKey: SearchFilters['sortBy']) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({
    options,
    currentSort,
    priceOrder,
    commentOrder,
    onSortClick
}) => {
    const getSortDisplayText = (sortKey: SearchFilters['sortBy']) => {
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