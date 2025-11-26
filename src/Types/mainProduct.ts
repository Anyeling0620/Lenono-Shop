export interface MainProduct {
  id: string;           // 产品唯一标识符
  name: string;         // 产品名称
  features: string[];   // 产品特点列表
  image: string;        // 产品图片链接
  originalPrice: number;// 原始价格
  coupon: number;       // 优惠券金额
  customerize: boolean; // 是否可外观定制
  tradeIn: boolean;     // 是否支持以旧换新
  link: string;         // 产品链接
}

export interface MainProductCategory {
  category: string;         // 产品类别名称  
  image: string[];          // 类别图片
  products: MainProduct[];  // 产品列表
}