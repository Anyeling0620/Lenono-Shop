export type TimeStatus = 'start' | 'end' | 'wait';

/**
 * 商品原始配置项响应接口（ProductConfig 表）
 */
export interface ProductConfigVO {
  /** 商品配置ID */
  id: string;
  /** 所属商品ID */
  productId: string;
  /** 配置1（如颜色、型号等） */
  config1: string;
  /** 配置2（如内存、容量等） */
  config2: string;
  /** 配置3（如尺寸、版本等，可选） */
  config3?: string;
  /** 配置售价 */
  salePrice: number;
  /** 配置原价 */
  originalPrice: number;
  /** 配置图片（可选） */
  configImage?: string;
  /** 配置创建时间 */
  createdAt: string;
  /** 配置更新时间 */
  updatedAt: string;
  /** 配置状态 */
  status:  "正常" | "下架";
}

/**
 * 商品品类响应接口（Category 表）
 */
export interface CategoryVO {
  /** 品类ID */
  id: string;
  /** 品类名称 */
  name: string;
  /** 品类编码（唯一） */
  code: string;
  /** 父级品类ID（可选，顶级品类为null） */
  parentId?: string;
  /** 品类状态 */
  status: "启用" | "禁用";
  /** 品类创建时间 */
  createdAt: string;
  /** 品类创建者ID（管理员ID） */
  creatorId: string;
}

/**
 * 商品基础信息响应接口（Product 表）
 */
export interface ProductVO {
  /** 商品ID */
  id: string;
  /** 商品品牌ID */
  brandId: string;
  /** 商品品类ID */
  categoryId: string;
  /** 商品名称 */
  name: string;
  /** 商品副标题（可选） */
  subTitle?: string;
  /** 商品描述（可选） */
  description?: string;
  /** 商品主图（可选） */
  mainImage?: string;
  /** 商品创建时间 */
  createdAt: string;
  /** 商品创建者ID（管理员ID） */
  creatorId: string;
  /** 商品更新时间 */
  updatedAt: string;
  /** 商品状态 */
  status:  "正常" | "下架" | "删除";
  /** 商品所属品类信息（关联品类表） */
  category: CategoryVO;
}

/**
 * 秒杀商品配置项响应接口（SeckillProductConfig 表）
 */
export interface SeckillProductConfigVO {
  /** 秒杀配置项ID */
  id: string;
  /** 所属秒杀商品ID */
  seckillProductId: string;
  /** 商品配置ID（关联商品配置表） */
  configId: string;
  /** 上架数量 */
  shelfNum: number;
  /** 剩余数量 */
  remainNum: number;
  /** 锁定数量（下单未支付的数量） */
  lockNum: number;
  /** 秒杀价格（商品原价-优惠金额 或 原价*折扣） */
  seckillPrice: number;
  /** 配置项创建时间 */
  createdAt: string;
  /** 配置项更新时间 */
  updatedAt: string;
  /** 配置项状态 */
  status: "售罄" | "正常";
  /** 关联的商品原始配置信息 */
  config: ProductConfigVO;
}

/**
 * 秒杀商品响应接口（SeckillProduct 表）
 */
export interface SeckillProductVO {
  /** 秒杀商品ID */
  id: string;
  /** 所属秒杀轮次ID */
  roundId: string;
  /** 商品ID（关联商品表） */
  productId: string;
  /** 优惠类型（直减/折扣） */
   type: "立减" | "打折";
  /** 优惠金额（直减时使用） */
  reduceAmount: number;
  /** 优惠折扣（折扣时使用，1为原价） */
  discount: number;
  /** 该秒杀商品的配置项数组（关联秒杀商品配置表） */
  configs: SeckillProductConfigVO[];
  /** 关联的商品基础信息 */
  product: ProductVO;
}

/**
 * 未结束秒杀轮次响应接口（SeckillRound 表）
 */
export interface UnfinishedSeckillRoundVO {
  /** 秒杀轮次ID */
  id: string;
  /** 秒杀轮次标题 */
  title: string;
  /** 秒杀开始时间（格式：YYYY-MM-DD HH:mm:ss） */
  startTime: string;
  /** 秒杀结束时间（格式：YYYY-MM-DD HH:mm:ss） */
  endTime: string;
  /** 秒杀轮次状态 */
  status: "启用" | "禁用" | "已结束";
  /** 轮次创建时间 */
  createdAt: string;
  /** 创建者ID（管理员ID） */
  creatorId: string;
  /** 轮次备注信息（可选） */
  remark?: string;
  /** 该轮次下的秒杀商品数组 */
  products: SeckillProductVO[];
}

/**
 * 未结束秒杀轮次列表响应接口（带分页）
 */
export interface SeckillRoundListResponse {
  /** 未结束的秒杀轮次列表 */
  list: UnfinishedSeckillRoundVO[];

}