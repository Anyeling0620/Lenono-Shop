/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-24 23:02:09
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-30 15:15:34
 * @FilePath: \lenovo-shop\src\component\QuickAccess\QuickItem.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
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
            className={`quick-access-li w-[90px] h-[90px] aspect-square bg-white rounded-sm transition-all duration-300 ease-in-out ${hoveredIndex === index
                ? 'transform -translate-y-0.5 shadow-md'
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