import Carousel from '../component/Carousel/Carousel'
import type { CarouselItemType } from '../types/carouselItem';
import ProductCard from '../component/Search/ProductCard';
import { Link } from "react-router-dom";

const NewProduct = () => {
    const carouselData: CarouselItemType[] = [
        {
            imageName: "1.jpg",
            linkUrl: "/new",
            alt: "新产品展示1"
        },
        {
            imageName: "2.png",
            linkUrl: "/new",
            alt: "新产品展示2"
        },
        {
            imageName: "3.png",
            linkUrl: "/new",
            alt: "新产品展示3"
        }
    ];

    const productGroups = [
        {
            title: "笔记本",
            link: "/notebook",
            list: [
                {
                    id: 1,
                    name: "联想小新Pro14 酷睿版14英寸轻薄笔记本 深灰色",
                    description: "英特尔酷睿Ultra5 / 32GB / 1T SSD / Windows 11 家庭版",
                    image: "/products/pro14.png",
                    link: "/product/1",
                    isDiscount: false,
                    currentPrice: 5999,
                    originalPrice: 0,
                    tags: {
                        self: false,
                        coupon: { money: 300 },
                        custom: true,
                        tradeIn: true,
                        installment: { month: 12 }
                    }
                },
                {
                    id: 2,
                    name: "联想小新Pro14 GT AI 元启版14英寸轻薄笔记本 深灰色",
                    description: "酷睿Ultra5 / 32GB / 1T SSD / RTX 显卡增强",
                    image: "/products/pro14gt.png",
                    link: "/product/2",
                    isDiscount: false,
                    currentPrice: 6399,
                    originalPrice: 0,
                    tags: {
                        self: false,
                        coupon: { money: 320 },
                        custom: true,
                        tradeIn: true,
                        installment: { month: 12 }
                    }
                },
                {
                    id: 3,
                    name: "联想Y9000X 2025 16英寸轻薄创意本",
                    description: "酷睿Ultra9 / 32GB / RTX 4070 / WiFi 7",
                    image: "/products/y9000x.png",
                    link: "/product/3",
                    isDiscount: true,
                    currentPrice: 10999,
                    originalPrice: 11999,
                    tags: {
                        self: true,
                        coupon: false,
                        custom: true,
                        tradeIn: true,
                        installment: { month: 12 }
                    }
                },
                {
                    id: 4,
                    name: "联想小新Air14 2025款 轻薄本",
                    description: "Ryzen 7 / 16GB / 1T SSD / 集显",
                    image: "/products/air14.png",
                    link: "/product/4",
                    isDiscount: false,
                    currentPrice: 4999,
                    originalPrice: 0,
                    tags: {
                        self: false,
                        coupon: false,
                        custom: false,
                        tradeIn: true,
                        installment: { month: 12 }
                    }
                }
            ]
        },
        {
            title: "台式机",
            link: "/desktop",
            list: [
                {
                    id: 5,
                    name: "联想拯救者刃9000K 2025旗舰游戏台式机",
                    description: "酷睿i9 / RTX 4080 / 64GB / 2TB SSD",
                    image: "/products/9000k.png",
                    link: "/product/5",
                    isDiscount: true,
                    currentPrice: 18999,
                    originalPrice: 19999,
                    tags: {
                        self: true,
                        coupon: { money: 500 },
                        custom: true,
                        tradeIn: true,
                        installment: { month: 24 }
                    }
                },
                {
                    id: 6,
                    name: "联想拯救者刃7000K 2025高性能电竞主机",
                    description: "酷睿i7 / RTX 4070 / 32GB / 1TB SSD",
                    image: "/products/7000k.png",
                    link: "/product/6",
                    isDiscount: false,
                    currentPrice: 12999,
                    originalPrice: 0,
                    tags: {
                        self: false,
                        coupon: { money: 300 },
                        custom: true,
                        tradeIn: true,
                        installment: { month: 12 }
                    }
                },
                {
                    id: 7,
                    name: "联想启天K6 商用办公台式机",
                    description: "i5 / 16GB / 512GB SSD / Win11 专业版",
                    image: "/products/qitian.png",
                    link: "/product/7",
                    isDiscount: false,
                    currentPrice: 4999,
                    originalPrice: 0,
                    tags: {
                        self: false,
                        coupon: false,
                        custom: false,
                        tradeIn: true,
                        installment: { month: 12 }
                    }
                },
                {
                    id: 8,
                    name: "联想天逸510S 家用学习台式机",
                    description: "i5 / 16GB / 512GB SSD / 集显",
                    image: "/products/tianyi510s.png",
                    link: "/product/8",
                    isDiscount: false,
                    currentPrice: 3899,
                    originalPrice: 0,
                    tags: {
                        self: false,
                        coupon: { money: 200 },
                        custom: false,
                        tradeIn: true,
                        installment: { month: 12 }
                    }
                }
            ]
        }
    ];

    return (
    <> 
    <Carousel
        data={carouselData}
        interval={3000}
        duration={500}
        className='h-[470px]'
    />

    <div className="max-w-[1200px] mx-auto mt-12 space-y-12">
                {productGroups.map((group, idx) => (
                    <section key={idx}>
                        {/* 标题 & 查看全部 */}
                        <div className="flex items-center justify-between px-2 mb-4">
                            <h2 className="text-[26px] font-semibold text-[#333]">{group.title}</h2>
                            <Link
                                to={group.link}
                                className="text-[14px] text-[#666] hover:text-[#ca151e]">
                                查看全部 ＞
                            </Link>
                        </div>

                        {/* 四个商品横排 */}
                        <ul className="grid grid-cols-4 gap-5">
                            {group.list.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </ul>
                    </section>
                ))}
    </div>
    </>

    )
}


export default NewProduct

