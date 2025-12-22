import React from 'react'
import { useLocation } from 'react-router-dom';
import type { ProductGroup } from '../types/product';
import ProductListToPages from '../component/ProductList/ProductListToPages';

const MoreProducts = () => {

    const [loading, setLoading] = React.useState(true)
    const location = useLocation();
    const groupData: ProductGroup = location.state;


    React.useEffect(() => {
        // 回到页面顶部
        window.scrollTo(0, 0)
        const Timer = setTimeout(() => {
            setLoading(false)
        }, 200)
        return () => {
            clearTimeout(Timer)
        }
    }, [])

    if (loading)
        return (
            <div className='bg-[#f5f5f5]'>
                <div className='w-[1200px] h-auto grid grid-cols-4 gap-3 mx-auto text-sm pt-3'>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className='w-[290px] h-[385px] bg-white animate-pulse'>
                            <div className='mx-auto w-[250px] py-6'>
                                <div className='w-[250px] h-[180px] bg-gray-100 rounded'></div>
                                <div className='w-[250px] h-[40px] bg-gray-100 rounded mt-3'></div>
                                <div className='w-[250px] h-[40px] bg-gray-100 rounded mt-3'></div>
                                <div className='w-[250px] h-[40px] bgf-gray-100 rounded mt-3'></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )

    return (
        <div className='bg-[#f5f5f5]'>
                    
             <ProductListToPages title={groupData.title} className='-mt-20' productList={groupData.items} />

        </div>
    )
}

export default MoreProducts