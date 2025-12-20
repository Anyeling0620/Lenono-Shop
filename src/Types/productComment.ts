import type { CategoryVO, ProductConfigVO, ProductVO } from "./flashSale";
import type { CouponItem, ShelfProductStatus } from "./product";

export interface ProductComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5星
  content: string;
  images?: string[];
  createdAt: string;
  helpful: number; // 点赞数
  specText?: string; // 购买规格
  verified: boolean; // 是否为真实购买用户
}

export interface CommentStats {  // 评论统计
  totalCount: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface BrandVO {
  id: string;
  name: string;
  code: string;
  logo?: string | null;
}

export interface BannerImageVO {
  image: string;
  sort: number;
  createdAt: string; // YYYY-MM-DD HH:mm:ss
}

export interface AppearanceImageVO {
  image: string;
  createdAt: string; // YYYY-MM-DD HH:mm:ss
}

export interface ShelfItemVO {
  configId: string;
  shelfNum: number;
  lockNum: number;
  updatedAt: string; // YYYY-MM-DD HH:mm:ss
}

export interface ShelfProductBriefVO {
  id: string;
  categoryId: string;
  isSelfOperated: boolean;
  isCustomizable: boolean;
  installment: number; // 分期（月数，0/6/12/24）
  shelfTime: string; // YYYY-MM-DD HH:mm:ss
  updatedAt: string; // YYYY-MM-DD HH:mm:ss
  offShelfTime?: string | null; // YYYY-MM-DD HH:mm:ss
  status: ShelfProductStatus;
  category: CategoryVO;
}

export interface ShelfProductDetailResponse {
  shelf: ShelfProductBriefVO;
  product: ProductVO;
  brand: BrandVO;
  banners: BannerImageVO[];
  appearances: AppearanceImageVO[];
  configs: ProductConfigVO[]; // 上架配置（来自上架项关联的配置）
  shelfItems: ShelfItemVO[]; // 每个配置的上架数量/锁定数量
  coupons: CouponItem[]; // 可用优惠券
}

export interface SeckillRoundBriefVO {
  id: string;
  title: string;
  startTime: string; // YYYY-MM-DD HH:mm:ss
  endTime: string;   // YYYY-MM-DD HH:mm:ss
  status: "启用" | "禁用" | "已结束";
}

export interface SeckillConfigDetailVO {
  id: string;
  configId: string;
  shelfNum: number;
  remainNum: number;
  lockNum: number;
  seckillPrice: number;
  status:  "售罄" | "正常";
  createdAt: string; // YYYY-MM-DD HH:mm:ss
  updatedAt: string; // YYYY-MM-DD HH:mm:ss
  config: ProductConfigVO; // 对应的商品原始配置
}

export interface SeckillProductDetailResponse {
  seckill: {
    id: string;
    productId: string;
    type:  "立减" | "打折";
    reduceAmount: number;
    discount: number;
  };
  round: SeckillRoundBriefVO;
  product: ProductVO;
  brand: BrandVO;
  banners: BannerImageVO[];
  appearances: AppearanceImageVO[];
  seckillConfigs: SeckillConfigDetailVO[]; // 秒杀配置
}
