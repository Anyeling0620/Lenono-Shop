import type { MainProduct } from "../../Types/mainProduct";
import Card from "./MainProductCard";

interface CategoryProps {
  name: string;
  image: string[];
  products: MainProduct[];
}

const Category = ({ name, image, products }: CategoryProps) => {
    return (
        <div className="pt-[20px] pb-[20px] w-[1200px]">
            {/* 头部部分 */}
            <div className="head mb-[16px]">
                <span className="text-shadow text-[24px] font-bold">{name}</span>
                {/* 右侧还需要添加小组件 */}
            </div>
            {/* 卡片部分 */}
            <div className="grid grid-cols-5 gap-3">
                {/* 左侧图片区域 */}
                <img src={image[0]} alt={name} className=""/>
                {/* 右侧卡片区域 */}
                <div className="col-span-4 grid grid-rows-2 gap-3">
                    {/* 上半部分4个卡片 */}
                    <div className="grid grid-cols-4 gap-3 ">
                        {products.slice(0, 4).map((product) => (
                            <Card key={product.id} product={product}/>
                        ))}
                    </div>
                    {/* 下半部分4个卡片 */}
                    <div className="grid grid-cols-4 gap-3">
                        {products.slice(4, 8).map((product) => (
                            <Card key={product.id} product={product}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Category;