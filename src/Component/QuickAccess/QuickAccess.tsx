
import { use, useMemo } from 'react';
import QuickItem from './QuickItem';
import { IndexProductContext } from '../../pages/Index';

export interface QuickAccessItems {
  label: string;
  id: string;
  icon: string;
  hoverIcon: string;
}

const QuickAccess = () => {
  const data = use(IndexProductContext).items;
  const navItemsData = useMemo(() => {  // 为什么使用useMemo：为了防止在每次渲染时都重新计算navItemsData，从而提高性能。
    return data?.map(value => ({
      label: value.title,
      id: value.title,
      icon: '⚡',
      hoverIcon: '🎯'
    })) || [];
  }, [data]);

  const navItemsToRender = navItemsData;

  return (
    <div className='w-full h-[90px] z-0'>
      <ul className="flex justify-center bg-white items-center  list-none">
        {navItemsToRender.map((item, index) => (
          <QuickItem
            key={item.label}
            item={item}
            index={index}
          />
        ))}
      </ul>
    </div>
  );
};

export default QuickAccess;
