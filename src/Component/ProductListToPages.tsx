import React from 'react'
import type { Product } from '../types/searchProduct'
import ProductCard from './Search/ProductCard'

const ProductListToPages = (props: { type: string }) => {

  const [productList, setProductList] = React.useState<Product[]>([
    {
      id: '1041', // 修正：改为字符串 '101'
      name: "联想小新Pro14 酷睿版14英寸轻薄笔记本 深灰色",
      description: "英特尔酷睿Ultra5 / 32GB / 1T SSD / Windows 11 家庭版",
      image: 'https://p1.lefile.cn/fes/cms/2025/11/27/1t6a7tcpivupglokxqyodd3ms2k4cv895742.w520.png',
      link: "/product/1",
      isDiscount: false,
      currentPrice: 5999,
      originalPrice: 0,
      tags: { self: false, coupon: { money: 300 }, custom: true, tradeIn: true, installment: { month: 12 } }
    },
     {
      id: '1031', // 修正：改为字符串 '101'
      name: "联想小新Pro14 酷睿版14英寸轻薄笔记本 深灰色",
      description: "英特尔酷睿Ultra5 / 32GB / 1T SSD / Windows 11 家庭版",
      image: 'https://p1.lefile.cn/fes/cms/2025/11/27/1t6a7tcpivupglokxqyodd3ms2k4cv895742.w520.png',
      link: "/product/1",
      isDiscount: false,
      currentPrice: 5999,
      originalPrice: 0,
      tags: { self: false, coupon: { money: 300 }, custom: true, tradeIn: true, installment: { month: 12 } }
    },
     {
      id: '1021', // 修正：改为字符串 '101'
      name: "联想小新Pro14 酷睿版14英寸轻薄笔记本 深灰色",
      description: "英特尔酷睿Ultra5 / 32GB / 1T SSD / Windows 11 家庭版",
      image: 'https://p1.lefile.cn/fes/cms/2025/11/27/1t6a7tcpivupglokxqyodd3ms2k4cv895742.w520.png',
      link: "/product/1",
      isDiscount: false,
      currentPrice: 5999,
      originalPrice: 0,
      tags: { self: false, coupon: { money: 300 }, custom: true, tradeIn: true, installment: { month: 12 } }
    },
     {
      id: '1011', // 修正：改为字符串 '101'
      name: "联想小新Pro14 酷睿版14英寸轻薄笔记本 深灰色",
      description: "英特尔酷睿Ultra5 / 32GB / 1T SSD / Windows 11 家庭版",
      image: 'https://p1.lefile.cn/fes/cms/2025/11/27/1t6a7tcpivupglokxqyodd3ms2k4cv895742.w520.png',
      link: "/product/1",
      isDiscount: false,
      currentPrice: 5999,
      originalPrice: 0,
      tags: { self: false, coupon: { money: 300 }, custom: true, tradeIn: true, installment: { month: 12 } }
    },
  ])




  return (
    <div className='mx-auto w-[1200px] py-20'>
      <div className="flex items-center justify-center w-full h-[80px] select-none mb-4">
        <h1 className="text-[34px] font-bold text-[#4c4c4c] relative before:content-[''] before:block before:w-8 before:h-[2px] before:bg-[#e2231a] before:absolute before:bottom-[-10px] before:left-1/2 before:-translate-x-1/2">
          {props.type}
        </h1>
      </div>
      <ul className='grid grid-cols-4 gap-3'>
        {productList.map(product => (
          <ProductCard key={product.id}
            product={product}
          />
        ))}
      </ul>


    </div>
  )
}

export default ProductListToPages