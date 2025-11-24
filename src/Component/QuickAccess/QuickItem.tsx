import { useState, type FC } from 'react'
import { Link } from 'react-router-dom';
import type { QuickAccessItems } from '../../types/quickAccessItems';

interface QuickItemProps {
    index: number;
    item: QuickAccessItems;
}

const QuickItem: FC<QuickItemProps> = ({
    index,
    item,
}) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    return (
        <li
            key={index}
            className={`quick-access-li w-[90px] h-[90px] aspect-square bg-white rounded-sm transition-all duration-300 ease-in-out ${hoveredIndex === index
                ? 'transform -translate-y-1 shadow-md'
                : 'shadow-none'
                }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
        >
            <Link
                to={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-full flex flex-col items-center justify-center no-underline text-inherit"
            >
                <div className="text-lg transition-all duration-200">
                    {hoveredIndex === index ? item.hoverIcon : item.icon}
                </div>
                <span className={`text-[12px] mt-1 font-light transition-all duration-200 ${hoveredIndex === index ? 'text-red-500' : 'text-zinc-600'
                    }`}>
                    {item.label}
                </span>
            </Link>
        </li>
    )
}

export default QuickItem