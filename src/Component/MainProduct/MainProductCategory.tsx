import type { ProductItem } from "../../types/product";
import Card from "./MainProductCard";
import type { CarouselItemType } from "../../types/carouselItem";
import Indicators from "../Carousel/Indicators";
import { useEffect, useState } from "react";
import { useCallback, useRef } from "react";

interface CategoryProps {
  group: {
    title: string;
    productList: ProductItem[];
  };
}

const Category = ({ group }: CategoryProps) => {
  const name = group.title;
  const products = group.productList;
  const image: CarouselItemType[] = [{imageName: "https://p4.lefile.cn/fes/cms/2025/12/12/paw2mkso142v1kafd6y4jawfkrdqra866049.jpg", linkUrl: "https://p4.lefile.cn/fes/cms/2025/12/12/paw2mkso142v1kafd6y4jawfkrdqra866049.jpg", alt: "Image 1"},{imageName: "https://p1.lefile.cn/fes/cms/2025/11/26/migz3rsh5epkt5928ti5kvp2khyq7k298631.jpg", linkUrl: "https://p1.lefile.cn/fes/cms/2025/11/26/migz3rsh5epkt5928ti5kvp2khyq7k298631.jpg", alt: "Image 2"}]; 

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  const handleNavigate = useCallback(
    (direction: "next" | "prev") => {
      setTimeout(() => {
        setCurrentImageIndex((prev) => {
          if (direction === "next") {
            return (prev + 1) % image.length;
          }
          return (prev - 1 + image.length) % image.length;
        });
      }, 300);
    },
    [image.length]
  );

  const startAutoPlay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (image.length <= 1) return;

    timerRef.current = window.setInterval(() => {
      handleNavigate("next");
    }, 7000);
  }, [image.length, handleNavigate]);

  const stopAutoPlay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [startAutoPlay]);

  const handleIndicatorClick = (index: number) => {
    stopAutoPlay();
    setCurrentImageIndex(index);
    setTimeout(() => startAutoPlay(), 2000);
  };

  const hasImage = image.length > 0;

  return (
    <div className="pt-[20px] pb-[20px] w-[1200px]">
      <div className="head mb-[16px]">
        <span className="text-shadow text-[24px] font-bold">{name}</span>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {hasImage ? (
          <div className="col-span-1 relative overflow-hidden">
            <div
              className={`flex transition-transform duration-500 ease-in-out h-full`}
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {image.map((img, index) => (
                <a
                  key={index}
                  href={img.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-full flex-shrink-0"
                >
                  <img
                    src={img.imageName}
                    alt={img.alt || name}
                    className="w-full h-full object-cover"
                  />
                </a>
              ))}
            </div>
            {image.length > 1 && (
              <Indicators
                count={image.length}
                currentIndex={currentImageIndex}
                onIndicatorClick={handleIndicatorClick}
              />
            )}
          </div>
        ) : (
          <div className="col-span-1" />
        )}
        <div className="col-span-4 grid grid-rows-2 gap-3">
          <div className="grid grid-cols-4 gap-3">
            {products.slice(0, 4).map((product) => (
              <Card key={product.productId} product={product} />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {products.slice(4, 8).map((product) => (
              <Card key={product.productId} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
