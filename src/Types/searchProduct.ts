


// 优惠券信息类型
export interface ProductCoupon {
  type: 'CASH' | 'DISCOUNT'; // 优惠类型：现金减免/折扣
  value: number;         // 优惠值：现金金额/折扣比例(如0.85表示85折)
}

// 产品列表项类型
export interface ProductItem {
  productId: string; // 产品id
  productName: string; // 产品名
  description: string | null; // 产品描述
  mainImage: string | null; // 主图
  isCarousel: boolean; // 是否轮播
  carouselImage: string | null; // 轮播图
  minPrice: number; // 最低配置当前价格
  originalPrice: number | null; // 原价
  configId: string; // 最低价格对应的配置id
  isSelfOperated: boolean; // 是否自营
  hasCoupon: boolean; // 是否有优惠券
  couponInfo: ProductCoupon | null; // 优惠券信息(有则返回)
  isCustomizable: boolean; // 是否可定制
  supportInstallment: boolean; // 是否支持分期付款
  installmentNum: number | null; // 分期数
    //新增：是否支持以旧换新
  supportTradeIn: boolean;
  // 新增：是否有库存（所有配置都无库存则为false）
  hasStock: boolean;
}

// 接口返回值类型
export interface ProductsResponse {
  title: string; // 产品品类
  productList: ProductItem[]; // 产品列表
}

export
  type ProductType =
  '笔记本' | '台式机' | '显示器' | '平板' | '手机' | '配件'