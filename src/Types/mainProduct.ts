import type { CarouselItemType } from "./carouselItem";

export interface MainProduct {
  id: string;
  name: string;
  features: string[];
  image: string;
  originalPrice: number;
  coupon: number;
  customerize: boolean;
  tradeIn: boolean;
  link: string;
  // 以下为详情页扩展字段（设置为可选 ?）
  subTitle?: string;
  gallery?: string[];
  currentPrice?: number;
  specOptions?: {
    label: string;
    values: string[];
  }[];
  serviceTags?: string[];
  detailImages?: string[];
}

export interface MainProductCategory {
  category: string;
  image: CarouselItemType[];
  products: MainProduct[];
}
