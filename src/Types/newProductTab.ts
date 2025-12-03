// 文件路径: src/types/newProductTab.ts

/**
 * 定义新品页面导航（Tab）的通用数据结构
 * 适用于一级主Tab (主机, 手机...) 和二级子Tab (笔记本新品, 台式机新品...)
 */
export interface NewProductTab {
    name: string;      // Tab显示的名称
    key: string;       // Tab的唯一标识符，用于状态管理
}

/**
 * 定义二级子Tab的扩展结构，包含图标信息
 */
export interface SubProductTab extends NewProductTab {
    iconClass: string; // 用于显示图标的 Tailwind CSS 类名（例如，'icon-laptop'）
}