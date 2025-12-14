import { use } from 'react';
import { NewProductContext } from '../../pages/NewProduct';
import ProductCard from '../Search/ProductCard';




const NewProductList = ({ className }:
    {
        className?: string
    }) => {


    const newProductGroups = use(NewProductContext)

    return (
        <div className={`${className}`}>
            {newProductGroups.map((group) => (
                <section key={group.title} className="mb-12">
                    <div className="flex items-center justify-center w-full h-[80px] select-none mb-4">
                        <h1 className="text-[34px] font-bold text-[#4c4c4c] relative before:content-[''] before:block before:w-8 before:h-[2px] before:bg-[#e2231a] before:absolute before:bottom-[-10px] before:left-1/2 before:-translate-x-1/2">
                            {group.title}
                        </h1>
                    </div>

                    <ul className="grid grid-cols-4 gap-3">
                        {group.productList.map(product => (
                            <ProductCard key={product.productId} product={product} />
                        ))}
                    </ul>
                </section>
            ))}
        </div>
    )
}

export default NewProductList