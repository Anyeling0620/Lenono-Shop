import type { MainProductCategory } from "../../Types/mainProduct";
import Category from "./MainProductCategory";

const productCategories: MainProductCategory[] = [
    {
        category: 'Lenovo 电脑',
        image: [
            'https://p3.lefile.cn/fes/cms/2025/10/16/ccza4ukwot93lu3s7sk7m907u9dy3y659378.jpg',
            'https://p3.lefile.cn/fes/cms/2025/10/17/ojzwwu9c6wz98virazao148hy5tbmb183711.jpg'
        ] ,
        products: [
            {
                id: '1', name: '小新14 酷睿版', features: ['50W性能释放', '双内存拓展'],
                image: 'https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg',
                originalPrice: 1299.99, coupon: 100, customerize: true, tradeIn: true, link: 'https://item.lenovo.com.cn/product/1044702.html'
            }, {
                id: '2', name: '小新16 酷睿版', features: ['52W性能释放', '双内存拓展'],
                image: 'https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg',
                originalPrice: 1099.99, coupon: 100, customerize: true, tradeIn: true, link: 'https://item.lenovo.com.cn/product/1044582.html'
            }, {
                id: '3', name: '小新14 酷睿版', features: ['50W性能释放', '双内存拓展'],
                image: 'https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg',
                originalPrice: 1299.99, coupon: 100, customerize: true, tradeIn: true, link: 'https://item.lenovo.com.cn/product/1044702.html'
            }, {
                id: '4', name: '小新16 酷睿版', features: ['52W性能释放', '双内存拓展'],
                image: 'https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg',
                originalPrice: 1099.99, coupon: 100, customerize: true, tradeIn: true, link: 'https://item.lenovo.com.cn/product/1044582.html'
            }, {
                id: '5', name: '小新14 酷睿版', features: ['50W性能释放', '双内存拓展'],
                image: 'https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg',
                originalPrice: 1299.99, coupon: 100, customerize: true, tradeIn: true, link: 'https://item.lenovo.com.cn/product/1044702.html'
            }, {
                id: '6', name: '小新16 酷睿版', features: ['52W性能释放', '双内存拓展'],
                image: 'https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg',
                originalPrice: 1099.99, coupon: 100, customerize: true, tradeIn: true, link: 'https://item.lenovo.com.cn/product/1044582.html'
            }, {
                id: '7', name: '小新14 酷睿版', features: ['50W性能释放', '双内存拓展'],
                image: 'https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg',
                originalPrice: 1299.99, coupon: 100, customerize: true, tradeIn: true, link: 'https://item.lenovo.com.cn/product/1044702.html'
            }, {
                id: '8', name: '小新16 酷睿版', features: ['52W性能释放', '双内存拓展'],
                image: 'https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg',
                originalPrice: 1099.99, coupon: 100, customerize: true, tradeIn: true, link: 'https://item.lenovo.com.cn/product/1044582.html'
            }
        ]   
    }, 
    {
        category: 'Lenovo 台式机',
        image: [
            'https://p3.lefile.cn/fes/cms/2025/10/16/ccza4ukwot93lu3s7sk7m907u9dy3y659378.jpg',
            'https://p3.lefile.cn/fes/cms/2025/10/17/ojzwwu9c6wz98virazao148hy5tbmb183711.jpg'
        ] ,
        products: [
            {
                id: '1', name: '小新14 酷睿版', features: ['50W性能释放', '双内存拓展'],
                image: 'https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg',
                originalPrice: 1299.99, coupon: 100, customerize: true, tradeIn: true, link: 'https://item.lenovo.com.cn/product/1044702.html'
            }, {
                id: '2', name: '小新16 酷睿版', features: ['52W性能释放', '双内存拓展'],
                image: 'https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg',
                originalPrice: 1099.99, coupon: 100, customerize: true, tradeIn: true, link: 'https://item.lenovo.com.cn/product/1044582.html'
            }, {
                id: '3', name: '小新14 酷睿版', features: ['50W性能释放', '双内存拓展'],
                image: 'https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg',
                originalPrice: 1299.99, coupon: 100, customerize: true, tradeIn: true, link: 'https://item.lenovo.com.cn/product/1044702.html'
            }, {
                id: '4', name: '小新16 酷睿版', features: ['52W性能释放', '双内存拓展'],
                image: 'https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg',
                originalPrice: 1099.99, coupon: 100, customerize: true, tradeIn: true, link: 'https://item.lenovo.com.cn/product/1044582.html'
            }, {
                id: '5', name: '小新14 酷睿版', features: ['50W性能释放', '双内存拓展'],
                image: 'https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg',
                originalPrice: 1299.99, coupon: 100, customerize: true, tradeIn: true, link: 'https://item.lenovo.com.cn/product/1044702.html'
            }, {
                id: '6', name: '小新16 酷睿版', features: ['52W性能释放', '双内存拓展'],
                image: 'https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg',
                originalPrice: 1099.99, coupon: 100, customerize: true, tradeIn: true, link: 'https://item.lenovo.com.cn/product/1044582.html'
            }, {
                id: '7', name: '小新14 酷睿版', features: ['50W性能释放', '双内存拓展'],
                image: 'https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg',
                originalPrice: 1299.99, coupon: 100, customerize: true, tradeIn: true, link: 'https://item.lenovo.com.cn/product/1044702.html'
            }, {
                id: '8', name: '小新16 酷睿版', features: ['52W性能释放', '双内存拓展'],
                image: 'https://p2.lefile.cn/fes/cms/2025/11/14/p2ismtudegewk5p5vhlher27p7rur2101724.jpg',
                originalPrice: 1099.99, coupon: 100, customerize: true, tradeIn: true, link: 'https://item.lenovo.com.cn/product/1044582.html'
            }
        ]   
    }
]

/**
 * MainProduct 组件
 * 这是一个主产品展示组件，用于展示主要内容区域
 * @returns {JSX.Element} 返回一个具有特定样式的React组件
 */
const MainProduct = () => {
  return (
    <div className="relative w-[1200px] mx-auto my-0">
        {/* 内部容器，设置上下内边距，为内容提供空间 */}
        {productCategories.map((category) => (
            <Category key={category.category} name={category.category} image={category.image} products={category.products}/>
        ))}
    </div>
  );
}

export default MainProduct;