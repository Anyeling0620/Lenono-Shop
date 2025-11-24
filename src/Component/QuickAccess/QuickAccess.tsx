/*
 * @Author: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @Date: 2025-11-22 13:38:47
 * @LastEditors: 不见霞 15550238+yvi-ksm@user.noreply.gitee.com
 * @LastEditTime: 2025-11-23 16:16:58
 * @FilePath: \lenovo-shop\src\Component\QuickAccess\QuickAccess.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import type { QuickAccessItems } from '../../types/quickAccessItems';
import QuickItem from './QuickItem';



const QuickAccess = () => {

  const navItems :QuickAccessItems[] = [
    { label: '氪金通道1', link: 'https://www.jxutcm.top', icon: '👤', hoverIcon: '⚙️' },
    { label: '氪金通道2', link: 'https://www.jxutcm.top', icon: '👤', hoverIcon: '⚙️' },
    { label: '氪金通道3', link: 'https://www.jxutcm.top', icon: '👤', hoverIcon: '⚙️' },
    { label: '氪金通道4', link: 'https://www.jxutcm.top', icon: '👤', hoverIcon: '⚙️' },
    { label: '氪金通道5', link: 'https://www.jxutcm.top', icon: '👤', hoverIcon: '⚙️' },
    { label: '氪金通道6', link: 'https://www.jxutcm.top', icon: '👤', hoverIcon: '⚙️' },
    { label: '氪金通道7', link: 'https://www.jxutcm.top', icon: '👤', hoverIcon: '⚙️' },
    { label: '氪金通道8', link: 'https://www.jxutcm.top', icon: '👤', hoverIcon: '⚙️' },
    { label: '氪金通道5', link: 'https://www.jxutcm.top', icon: '👤', hoverIcon: '⚙️' },
    { label: '氪金通道6', link: 'https://www.jxutcm.top', icon: '👤', hoverIcon: '⚙️' },
    { label: '氪金通道7', link: 'https://www.jxutcm.top', icon: '👤', hoverIcon: '⚙️' },
    { label: '氪金通道8', link: 'https://www.jxutcm.top', icon: '👤', hoverIcon: '⚙️' },
  ];

  return (
    <div className='w-full h-[90px] z-0'>
      <ul className="flex justify-center bg-white items-center pb-1 list-none">
        {navItems.map((item, index) => (
         <QuickItem 
            item={item}
            index = {index}
            />
        ))}
      </ul>
    </div>

  );
};

export default QuickAccess;
