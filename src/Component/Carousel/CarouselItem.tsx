
import React from 'react'
import type { CarouselItemType } from '../../types/carouselItem'
import { Link } from 'react-router-dom';
import { getImageUrl, IMAGE_CONFIG } from '../../utils/imageConfig';

interface CarouselItemProps {
    item: CarouselItemType;
    className?: string;
}

const CarouselItem: React.FC<CarouselItemProps> = ({
    item,
    className
}) => {

    return (
        <div className="w-full flex-shrink-0 bg-white">
            <Link to={item.linkUrl} className="block w-full">
                <img
                    src={getImageUrl(item.imageName,IMAGE_CONFIG.FOLDERS.ROLL)}
                    alt={item.alt || '轮播图'}
                    className={`w-full  object-cover ${className}`}
                />
            </Link>
        </div>
    )
}

export default CarouselItem