import {type FC} from 'react'
import type { CarouselItemType } from '../../types/carouselItem'
import CarouselItem from './CarouselItem';

interface CarouselTrackProps {
  data:CarouselItemType[];
  currentIndex:number;
  duration:number;
  className?:string;

}


const CarouselTrack:FC<CarouselTrackProps> = ({
  data,
  currentIndex,
  duration,
  className
}) => {
  return (
    <div className="w-full mx-auto overflow-hidden">
      <div 
        className="flex transition-transform ease-in-out "
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transitionDuration: `${duration}ms`
        }}
      >
        {data.map((item,index) => (
          <CarouselItem
            key={index}
            item={item}
            className={className}
          />
        ))}
      </div>
    </div>
  )
}

export default CarouselTrack