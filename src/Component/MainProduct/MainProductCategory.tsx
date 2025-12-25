import type { ProductGroup } from "../../types/product";
import MainProductCard from "./MainProductCard";
import type { CarouselItemType } from "../../types/carouselItem";
import Indicators from "../Carousel/Indicators";
import { useEffect, useState } from "react";
import { useCallback, useRef } from "react";
import { Link } from "react-router-dom";


const MainProductCategory = ({ group }: { group: ProductGroup }) => {
  const products = group.items;
  const image: CarouselItemType[] = [{
    imageName: "https://p4.lefile.cn/fes/cms/2025/12/12/paw2mkso142v1kafd6y4jawfkrdqra866049.jpg",
    linkUrl: "",
    alt: "Image 1"
  },
  {
    imageName: "https://p1.lefile.cn/fes/cms/2025/11/26/migz3rsh5epkt5928ti5kvp2khyq7k298631.jpg",
    linkUrl: "",
    alt: "Image 2"
  }];

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
    <div   className="pt-[20px] pb-[20px] w-[1200px] ">
      <div className=" mb-3  relative">
        <span className="text-shadow text-[24px] font-bold"  id={group.title}>{group.title}</span>
       {group.items.length > 8 && <Link to={`/more-products`} state={group}>
          <span className=" absolute text-[12px]  right-3 bottom-0">查看更多</span>
        </Link>}
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
                    alt={group.title}
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
              <MainProductCard key={product.product?.id} product={product} />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {products.slice(4, 8).map((product) => (
              <MainProductCard key={product.product?.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainProductCategory;
