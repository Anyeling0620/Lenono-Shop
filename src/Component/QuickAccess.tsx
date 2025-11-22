import React, { useState } from 'react';

const QuickAccess = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const navItems = [
    { id: 1, label: '氪金通道1', link: 'https://www.jxutcm.top', icon: '👤', hoverIcon: '⚙️' },
    { id: 2, label: '氪金通道2', link: 'https://www.jxutcm.top', icon: '👤', hoverIcon: '⚙️' },
    { id: 3, label: '氪金通道3', link: 'https://www.jxutcm.top', icon: '👤', hoverIcon: '⚙️' },
    { id: 4, label: '氪金通道4', link: 'https://www.jxutcm.top', icon: '👤', hoverIcon: '⚙️' },
    { id: 5, label: '氪金通道5', link: 'https://www.jxutcm.top', icon: '👤', hoverIcon: '⚙️' },
    { id: 6, label: '氪金通道6', link: 'https://www.jxutcm.top', icon: '👤', hoverIcon: '⚙️' },
    { id: 7, label: '氪金通道7', link: 'https://www.jxutcm.top', icon: '👤', hoverIcon: '⚙️' },
    { id: 8, label: '氪金通道8', link: 'https://www.jxutcm.top', icon: '👤', hoverIcon: '⚙️' },
  ];

  return (
    <ul className="flex justify-center items-center bg-white py-1 list-none">
      {navItems.map((item, index) => (
        <li 
          key={item.id}
          className={`quick-access-li w-[8%] aspect-square bg-white rounded-lg transition-all duration-300 ease-in-out ${
            hoveredIndex === index 
              ? 'transform -translate-y-1 shadow-md' 
              : 'shadow-none'
          }`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <a 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full h-full flex flex-col items-center justify-center no-underline text-inherit"
          >
            <div className="text-lg transition-all duration-200">
              {hoveredIndex === index ? item.hoverIcon : item.icon}
            </div>
            <span className={`text-sm mt-1 font-light transition-all duration-200 ${
              hoveredIndex === index ? 'text-red-500' : 'text-black'
            }`}>
              {item.label}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default QuickAccess;
