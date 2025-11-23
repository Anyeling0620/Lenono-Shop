import Carousel from '../Component/Carousel/Carousel'
import type { CarouselItemType } from '../types/carouselItem';

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
    return (<> <Carousel
        data={carouselData}
        interval={3000}
        duration={500}
        className='h-[470px]'
    />


    </>

    )
}


export default NewProduct

