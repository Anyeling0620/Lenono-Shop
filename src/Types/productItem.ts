// 文件路径: src/types/productItem.ts

/**
 * 定义单个产品卡片的数据结构
 */
export interface ProductItem {
    id: string;               // 产品唯一ID (gcode)
    name: string;             // 产品名称 (如 联想拯救者Y9000P 2025)
    description: string;      // 产品简述 (如 英特尔® 酷睿™ Ultra 9/Windows 11...)
    price: number;            // 产品价格 (如 21999)
    imageUrl: string;         // 产品图片的 URL
    linkUrl: string;          // 产品详情页链接
}