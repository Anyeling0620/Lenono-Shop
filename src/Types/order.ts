// 文件路径: src/types/productItem.ts

/**
 * 定义单个产品卡片的数据结构
 */


export interface OrderState {
  productId: string;
  productName: string;
  productImage?: string;
  configId: string;
  configContent: Record<string, string>;
  configImage?: string;
  quantity: number;
  unitPrice: number;
  isSeckill: boolean;
  seckillId: string | null;
  seckillRoundId: string | null;
  brandId?: string;
  brandName?: string;
  stockCount: number;
  originalPrice: number;
}
