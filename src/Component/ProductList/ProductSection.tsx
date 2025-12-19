import React, { useEffect, useRef } from 'react';
import { Carousel, Empty } from 'antd';
import { Link } from 'react-router-dom';
import ProductListToPages from './ProductListToPages';
import type { ProductCardItem } from '../../types/product';


interface AutoScrollProductSectionProps {
  loading: boolean;
  title: string;
  productList: ProductCardItem[];
  carouselProducts: ProductCardItem[];
}

const ProductSection: React.FC<AutoScrollProductSectionProps> = ({
  loading,
  title,
  productList,
  carouselProducts
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const productListRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!carouselRef.current || !productListRef.current) return;

      const carouselRect = carouselRef.current.getBoundingClientRect();

      // 向下滚动
      if (e.deltaY > 0 && carouselRect.top >= 0 && carouselRect.bottom > 0) {
        e.preventDefault();
        productListRef.current.scrollIntoView({ behavior: 'smooth' });
      }

    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);


  if (loading) return (
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


  else return (
    
     productList.length === 0 ? < Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无商品数据" className='py-60'/> :
        <>
          <div className='bg-[#f5f5f5]'>

            <div ref={carouselRef}>
              <Carousel
                autoplay={{ dotDuration: true }}
                autoplaySpeed={2000}
                draggable
                arrows
                className='select-none'
              >
                {carouselProducts.map((value: ProductCardItem) => (
                  <div key={value.shelfProduct.id}>
                    <Link to={`/product/${value.shelfProduct.id}`} target={value.shelfProduct.id} >
                      <img
                        src={value.shelfProduct.carouselImage as string}
                        // className=' w-full object-cover'
                        className=' object-cover w-[1600px] h-[800px]'
                      />
                    </Link>
                  </div>
                ))}
              </Carousel>
            </div>
            <div ref={productListRef} id="products">
              <ProductListToPages title={title} productList={productList} />
            </div>
          </div>
        </>
  
  );
};

export default ProductSection;
