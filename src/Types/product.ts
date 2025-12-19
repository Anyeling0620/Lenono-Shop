/**
 * 通用枚举类型（与后端保持一致，前端可按需扩展）
 * 注：如果前端使用枚举，可单独抽离到枚举文件中
 */
// 商品配置状态
export type ProductConfigStatus = '正常' | '下架';
// 货架商品状态
export type ShelfProductStatus = '在售' | '下架' | '售罄';
// 优惠券类型
export type CouponType = '满减' | '折扣';
// 关联状态
export type RelationStatus = '生效' | '失效';

/**
 * 品牌信息（前端简化版，只保留展示所需字段）
 */
export interface Brand {
  id: string;
  name: string;
  code: string;
  logo?: string;
}

/**
 * 商品品类信息（前端简化版）
 */
export interface Category {
  id: string;
  name: string;
  code: string;
}

/**
 * 商品基本信息（对应后端 Product 表）
 */
export interface Product {
  id: string;
  brandId: string;
  categoryId: string;
  name: string;
  subTitle?: string;
  description?: string;
  mainImage?: string;
  createdAt: string; // 后端 Date 类型在前端为字符串（ISO格式）
  updatedAt: string;
  status: string; // 商品状态，可替换为具体枚举类型
  brand?: Brand;
  category?: Category;
}

/**
 * 商品配置信息（对应后端 ProductConfig 表）
 */
export interface ProductConfig {
  id: string;
  productId: string;
  config1: string; // 颜色等
  config2: string; // 内存等
  config3?: string; // 尺寸等
  salePrice: number | string; // 后端 Decimal 类型：前端可接收为数字（推荐）或字符串（高精度）
  originalPrice: number | string;
  configImage?: string;
  createdAt: string;
  updatedAt: string;
  status: ProductConfigStatus;
}

/**
 * 货架商品信息（对应后端 ShelfProduct 表）
 */
export interface ShelfProduct {
  id: string;
  categoryId: string;
  productId: string;
  isCarousel: boolean;  // 是否轮播
  carouselImage?: string;  // 轮播图
  isSelfOperated: boolean;  // 是否自营
  isCustomizable: boolean; // 是否可定制
  installment: number; // 分期数（0/6/12/24）
  shelfTime: string;  // 上架时间
  updatedAt: string;  // 更新时间
  offShelfTime?: string;  // 下架时间
  status: ShelfProductStatus;
  // 关联的商品信息（后端联表返回时定义）
  product?: Product;
}

/**
 * 优惠券信息（对应后端 Coupon 表）
 */
export interface Coupon {
  id: string;
  name: string;
  type: CouponType;
  amount: number | string; // 优惠金额（Decimal → 数字/字符串）
  discount: number | string; // 优惠折扣（如 0.8 表示8折）
  threshold: number | string; // 门槛金额
  condition?: string;
  scope?: string;
  startTime: string;
  expireTime: string;
  isStackable: boolean;
}

/**
 * 领券中心信息（对应后端 CouponCenter 表）
 */
export interface CouponCenter {
  id: string;
  couponId: string;
  startTime: string;
  totalNum: number;
  endTime: string;
  limitNum: number; // 每人限领数量
  createdAt: string;
}

/**
 * 商品关联的可用优惠券信息（组合 CouponCenter + Coupon）
 */
export interface CouponItem extends CouponCenter {
  coupon: Coupon;
}

/**
 * 商品卡片核心信息（前端展示的核心结构）
 */
export interface ProductCardItem {
  shelfProduct: ShelfProduct; // 货架商品信息
  product: Product; // 商品基本信息
  minPriceConfig: ProductConfig; // 最低售价配置
  coupons: CouponItem[]; // 关联的可用优惠券
}

/**
 * 单品类商品卡片返回结果（对应后端 SingleProductCardResponse）
 */
export interface SingleProductCardResponse {
  items: ProductCardItem[]; // 该品类的所有商品卡片
}

/**
 * 商品卡片查询参数（前端请求后端时的参数类型）
 */
export interface ProductCardQuery {
  categoryCode: string; // 品类编码（如 "LAPTOP" "PHONE"，可替换为枚举类型）
}

/**
 * 产品类型枚举（前端枚举，与后端 ProductType 保持一致）
 * 推荐使用枚举来约束品类编码，避免硬编码错误
 */
export type ProductType =
  | 'LAPTOP'
  | 'DESKTOP'
  | 'MONITOR'
  | 'TABLET'
  | 'PHONE'
  | 'SERVICE'
  | 'PART'


