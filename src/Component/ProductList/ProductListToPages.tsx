import React from 'react'
import type { ProductCardItem } from '../../types/product'
import ProductCard from '../Search/ProductCard'



interface Props {
  title: string;
  productList: ProductCardItem[];
  className?: string;
}

const ProductListToPages: React.FC<Props> = (props) => {
  return (
    <div className={`${props.className} mx-auto w-[1200px] py-20 `}>
      {props.title && <div className="flex items-center justify-center w-full h-[80px] select-none mb-4">
        <h1 className="text-[34px] font-bold text-[#4c4c4c] relative before:content-[''] before:block before:w-8 before:h-[2px] before:bg-[#e2231a] before:absolute before:bottom-[-10px] before:left-1/2 before:-translate-x-1/2">
          {props.title}
        </h1>
      </div>}
      <ul className='grid grid-cols-4 gap-3'>
        {props.productList.map(product => (
          <ProductCard key={product.shelfProduct.id}
            product={product}
          />
        ))}
      </ul>
    </div>
  )
}

export default ProductListToPages