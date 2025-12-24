
export interface CartItemConfigOptionVO {
  id: string;
  config1: string;
  config2: string;
  config3?: string;
  salePrice: number;
  originalPrice: number;
  configImage?: string | null;
}

export interface CartListItemVO {
  cartId: string;
  productId: string;
  configId: string;
  quantity: number;

  // product basics
  name: string;
  subTitle?: string;
  description?: string;
  image?: string | null; // prefer config image, fallback to product mainImage

  // current config snapshot
  config1: string;
  config2: string;
  config3?: string;

  salePrice: number;       // current config sale price
  originalPrice: number;   // current config original price

  availableConfigs: CartItemConfigOptionVO[];  // 用于重新许选择配置
}

export interface CartListResponse {
  items: CartListItemVO[];
}

