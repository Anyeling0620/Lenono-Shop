import ProductCard from '../Search/ProductCard';
import type { Product } from '../../types/searchProduct';


const productGroups: { title: string; link: string; list: Product[] }[] = [
    {
        title: "笔记本",
        link: "/notebook",
        list: [
            {
                id: '101', // 修正：改为字符串 '101'
                name: "联想小新Pro14 酷睿版14英寸轻薄笔记本 深灰色",
                description: "英特尔酷睿Ultra5 / 32GB / 1T SSD / Windows 11 家庭版",
                image: "https://p4.lefile.cn/product/adminweb/2024/01/17/2LCC5B1F9W3D9H7J.jpg",
                link: "/product/1",
                isDiscount: false,
                currentPrice: 5999,
                originalPrice: 0,
                tags: { self: false, coupon: { money: 300 }, custom: true, tradeIn: true, installment: { month: 12 } }
            },
            {
                id: '102', // 修正：改为字符串 '102'
                name: "联想小新Pro14 GT AI 元启版14英寸轻薄笔记本 深灰色",
                description: "酷睿Ultra5 / 32GB / 1T SSD / RTX 显卡增强",
                image: "https://p2.lefile.cn/product/adminweb/2024/01/25/K7S9D3F2G5H1J4L.jpg",
                link: "/product/2",
                isDiscount: false,
                currentPrice: 6399,
                originalPrice: 0,
                tags: { self: false, coupon: { money: 320 }, custom: true, tradeIn: true, installment: { month: 12 } }
            },
            {
                id: '103', // 修正：改为字符串
                name: "联想Y9000X 2025 16英寸轻薄创意本",
                description: "酷睿Ultra9 / 32GB / RTX 4070 / WiFi 7",
                image: "https://p3.lefile.cn/product/adminweb/2024/02/01/M5N6B7V8C9X0Z.jpg",
                link: "/product/3",
                isDiscount: true,
                currentPrice: 10999,
                originalPrice: 11999,
                tags: { self: true, coupon: undefined, custom: true, tradeIn: true, installment: { month: 12 } }
            },
            {
                id: '104', // 修正：改为字符串
                name: "联想小新Air14 2025款 轻薄本",
                description: "Ryzen 7 / 16GB / 1T SSD / 集显",
                image: "https://p4.lefile.cn/product/adminweb/2024/01/17/2LCC5B1F9W3D9H7J.jpg",
                link: "/product/4",
                isDiscount: false,
                currentPrice: 4999,
                originalPrice: 0,
                tags: { self: false, coupon: undefined, custom: false, tradeIn: true, installment: { month: 12 } }
            }
        ]
    },
    {
        title: "台式机",
        link: "/desktop",
        list: [
            {
                id: '105',
                name: "联想拯救者刃9000K 2025旗舰游戏台式机",
                description: "酷睿i9 / RTX 4080 / 64GB / 2TB SSD",
                image: "https://p1.lefile.cn/product/adminweb/2023/05/10/A1S2D3F4G5H6.jpg",
                link: "/product/5",
                isDiscount: true,
                currentPrice: 18999,
                originalPrice: 19999,
                tags: { self: true, coupon: { money: 500 }, custom: true, tradeIn: true, installment: { month: 24 } }
            },
            {
                id: '106',
                name: "联想拯救者刃7000K 2025高性能电竞主机",
                description: "酷睿i7 / RTX 4070 / 32GB / 1TB SSD",
                image: "https://p1.lefile.cn/product/adminweb/2023/05/10/A1S2D3F4G5H6.jpg",
                link: "/product/6",
                isDiscount: false,
                currentPrice: 12999,
                originalPrice: 0,
                tags: { self: false, coupon: { money: 300 }, custom: true, tradeIn: true, installment: { month: 12 } }
            },
            {
                id: '107',
                name: "联想启天K6 商用办公台式机",
                description: "i5 / 16GB / 512GB SSD / Win11 专业版",
                image: "https://p1.lefile.cn/product/adminweb/2023/05/10/A1S2D3F4G5H6.jpg",
                link: "/product/7",
                isDiscount: false,
                currentPrice: 4999,
                originalPrice: 0,
                tags: { self: false, coupon: undefined, custom: false, tradeIn: true, installment: { month: 12 } }
            },
            {
                id: '108',
                name: "联想天逸510S 家用学习台式机",
                description: "i5 / 16GB / 512GB SSD / 集显",
                image: "https://p1.lefile.cn/product/adminweb/2023/05/10/A1S2D3F4G5H6.jpg",
                link: "/product/8",
                isDiscount: false,
                currentPrice: 3899,
                originalPrice: 0,
                tags: { self: false, coupon: { money: 200 }, custom: false, tradeIn: true, installment: { month: 12 } }
            }
        ]
    }
];


const NewProductList = ({className}:{className?:string}) => {
  return (
    <div className={`${className}`}>
        {productGroups.map((group) => (
                    <section key={group.title} className="mb-12">
                        <div className="flex items-center justify-center w-full h-[80px] select-none mb-4">
                            <h1 className="text-[34px] font-bold text-[#4c4c4c] relative before:content-[''] before:block before:w-8 before:h-[2px] before:bg-[#e2231a] before:absolute before:bottom-[-10px] before:left-1/2 before:-translate-x-1/2">
                                {group.title}
                            </h1>
                        </div>

                        <ul className="grid grid-cols-4 gap-3">
                            {group.list.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </ul>
                    </section>
                ))}
    </div>
  )
}

export default NewProductList