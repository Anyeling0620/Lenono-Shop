import { Carousel } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import ProductListToPages from '../component/ProductListToPages'

const Tablet = () => {
    const images = [
        'https://picsum.photos/800/400?random=1',
        'https://picsum.photos/800/400?random=2',
        'https://picsum.photos/800/400?random=3',
        'https://picsum.photos/800/400?random=4'
    ]

    return (
        <div className='bg-[#f5f5f5]'>
            <Carousel
                autoplay={{ dotDuration: true }}

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
            <ProductListToPages type={'tablet'} />
        </div>
    )
}

export default Tablet