import React from 'react'
import ProductListToPages from '../component/ProductListToPages'
import { Link } from 'react-router-dom'
import { Carousel } from 'antd'

const DesktopComputer = () => {
  const images = [
        'https://picsum.photos/800/400?random=1',
        'https://picsum.photos/800/400?random=2',
        'https://picsum.photos/800/400?random=3',
        'https://picsum.photos/800/400?random=4'
    ]

    return (
        <div className='bg-[#f5f5f5]'>
            <Carousel
                autoplay
                autoplaySpeed={2000}
                draggable
                arrows
                className='select-none'
            >
                {images.map((src, index) => (
                    <div key={index}>
                        <Link to={''}>
                            <img
                                src={src}
                                alt={`Slide ${index + 1}`}
                                className='w-full  object-cover'
                            />
                        </Link>

                    </div>
                ))}
            </Carousel>
            <ProductListToPages type={'desktop'}/>
        </div>
    )
}

export default DesktopComputer