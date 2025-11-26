import type { MainProduct } from "../../Types/mainProduct";

interface CardProps {
  product: MainProduct;
}

const Card = ({product}: CardProps) => {
    return (
        <div className="bg-white hover:shadow-lg">
            <div className="pd-2 h-full">
                <a className="flex item-center" href={product.link} target="_blank" >
                    <img src={product.image} alt={product.name} className="h-[16px]"/>
                </a>
            </div>
        </div>
        
    )
}

export default Card