

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
  cartId?: string;
}



export interface OrderItemInput {
  productId: string;
  configId: string;
  quantity: number;
  seckillRoundId?: string;
}

export interface CreateOrderInput {
  seckill: boolean;
  addressId: string;
  items: OrderItemInput[];
  couponIds: string[];
}

export interface OrderResponse {
  orderId: string;
  orderNo: string;
  payAmount: number;
  actualPayAmount: number;
  status: string;
  items: OrderItemDetail[];
  createdAt: Date;
  payLimitTime: Date;
}

export interface OrderItemDetail {
  productId: string;
  productName: string;
  config1: string;
  config2: string;
  config3?: string;
  quantity: number;
  price: number;
  discount: number;
  payAmount: number;
}

export interface CancelOrderInput {
  orderId: string;
}

export interface PaymentInput {
  orderId: string;
  voucherId: string;
}



// 新增订单列表相关类型
export interface OrderListItem {
  id: string;
  orderNo: string;
  status: OrderStatus;
  payAmount: number;
  actualPayAmount: number;
  createdAt: Date;
  payTime?: Date;
  items: OrderItemSummary[];
}

export interface OrderItemSummary {
  id: string;
  productId: string;
  productName: string;
  config1: string;
  config2: string;
  config3?: string;
  quantity: number;
  priceSnapshot: number;
  payAmountSnapshot: number;
  imageSnapshot?: string;
  seckill: boolean;
}

export interface SimpleOrderItem {
  id: string;
  orderNo: string;
  status: OrderStatus;
  payAmount: number;
  actualPayAmount: number;
  payType?: string;
  payTime?: Date;
  createdAt: Date;
  items: OrderItemSummary[];
}

export interface OrderListQuery {
  page?: number;
  pageSize?: number;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  keyword?: string;
}

export interface OrderListResponse {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: OrderListItem[];
}

// 更新OrderStatus枚举
export type OrderStatus =
  | '待支付'
  | '已支付'
  | '待发货'
  | '已发货'
  | '待收货'
  | '已收货'
  | '已取消';


// 新增订单详情响应类型
export interface OrderDetailResponse {
  id: string;
  orderNo: string;
  status: string;
  payAmount: number;
  actualPayAmount: number;
  payType?: string;
  payTime?: Date;
  createdAt: Date;
  payLimitTime: Date;
  cancelTime?: Date;
  shipTime?: Date;
  receiveTime?: Date;
  completeTime?: Date;
  remark?: string;
  logisticsNo?: string;

  address: {
    province: string;
    city: string;
    area: string;
    street: string;
    detail: string;
    receiver: string;
    phone: string;
  };

  items: OrderItemSummary[];

  coupons: {
    id: string;
    name: string;
    type: string;
    amount: number;
    discount: number;
  }[];

  vouchers: {
    id: string;
    title: string;
    usedAmount: number;
    useTime: Date;
  }[];
}

export interface OrderStats {
  totalCount: number;
  pendingPaymentCount: number;
  pendingShipmentCount: number;
  pendingReceiptCount: number;
  completedCount: number;
  cancelledCount: number;
  totalAmount: number;
}
