
import React from 'react'
import { Link } from 'react-router-dom';
import type { CarouseProduct } from '../../types/product';
import { getImageUrl } from '../../utils/imageConfig';

interface CarouselItemProps {
    item: CarouseProduct;
    className?: string;
}

const CarouselItem: React.FC<CarouselItemProps> = ({
    item,
    className
}) => {

    return (
        <div className="w-full flex-shrink-0 bg-white">
            <Link to={`/product/${item.product.product.id}` } target={item.product.product.id} className="block w-full">
                <img
                    src={getImageUrl(item.image)}
                    alt={item.product.product.name }
                    className={`w-full  object-cover ${className}`}
                />
            </Link>
        </div>
    )
}

export default CarouselItem