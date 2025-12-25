
export type AfterSaleStatus = "申请中" | "已退款" | "已同意" | "已拒绝" | "已寄回" | "已寄出" | "已完成"
export type AfterSaleType = "退货" | "换货" | "维修"
export type ComplaintStatus = "撤回" | "正常" | "用户删除"
type CommentStatus = "撤回" | "正常" | "用户删除"
type EvaluationStatus = "撤回" | "正常" | "用户删除"
export type OrderStatus = "待支付" | "已支付" | "待发货" | "已发货" | "待收货" | "已收货" | "已取消"
export interface CreateAfterSaleDto {
  orderId: string;
  orderItemId: string;
  type: AfterSaleType;
  reason: string;
  remark?: string;
  images?: string[];
}

export interface UpdateAfterSaleDto {
  status?: AfterSaleStatus;
  rejectReason?: string;
  userLogisticsNo?: string;
  merchantLogisticsNo?: string;
}

export interface CreateComplaintDto {
  afterSaleId: string;
  content: string;
  images?: string[];
}

export interface CreateEvaluationDto {
  productId: string;
  configId: string;
  star: number;
  content?: string;
  images?: string[];
}

export interface CreateCommentDto {
  orderId: string;
  orderItemId: string;
  content: string;
  images?: string[];
}

export interface ListQueryDto {
  status?: AfterSaleStatus | string;
  orderId?: string;
  productId?: string;
}

export interface ProductInfo {
  id: string;
  name: string;
  mainImage: string | null;
  brand?: {
    id: string;
    name: string;
  } | null;
  category?: {
    id: string;
    name: string;
  } | null;
}

export interface ConfigInfo {
  id: string;
  config1: string | null;
  config2: string | null;
  config3: string | null;
  salePrice: number;
  originalPrice: number;
  configImage: string | null;
}

export interface OrderItemInfo {
  id: string;
  productName: string;
  configName: string;
  quantity: number;
  price: number;
  productId: string;
  configId: string;
  product?: ProductInfo;
  config?: ConfigInfo;
}

export interface OrderInfo {
  id: string;
  orderNo: string;
  status: OrderStatus;
  actualPayAmount: number;
  createdAt: string;
  payTime?: string | null;
  receiver: string;
  phone: string;
  address: string;
}

export interface ImageInfo {
  id: string;
  image: string;
}

export interface EvaluationDetail {
  id: string;
  userId: string;
  productId: string;
  configId: string;
  star: number;
  content: string;
  status: EvaluationStatus;
  createdAt: string;
  updatedAt: string;
  images: ImageInfo[];
  product: ProductInfo;
  config: ConfigInfo;
}

export interface CommentDetail {
  id: string;
  userId: string;
  orderId: string;
  orderItemId: string;
  content: string;
  status: CommentStatus;
  createdAt: string;
  updatedAt: string;
  images: ImageInfo[];
  order: {
    id: string;
    orderNo: string;
    status: OrderStatus;
    actualPayAmount: number;
    createdAt: string;
  };
  orderItem: OrderItemInfo;
}

export interface AfterSaleDetail {
  id: string;
  orderId: string;
  orderItemId: string;
  afterSaleNo: string;
  type: AfterSaleType;
  reason: string;
  remark: string | null;
  status: AfterSaleStatus;
  rejectReason: string | null;
  receiverProvince: string;
  receiverCity: string;
  receiverArea: string;
  receiverStreet: string;
  receiverAddress: string;
  receiverRemark: string | null;
  receiverName: string;
  receiverPhone: string;
  applyTime: string;
  completeTime: string | null;
  createdAt: string;
  images: ImageInfo[];
  order: OrderInfo;
  orderItem: OrderItemInfo;
  complaints?: ComplaintDetail[];
  merchantLogisticsNo: string|null;
}

export interface ComplaintDetail {
  id: string;
  userId: string;
  afterSaleId: string;
  content: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  images: ImageInfo[];
  afterSale: {
    id: string;
    afterSaleNo: string;
    type: AfterSaleType;
    status: AfterSaleStatus;
    reason: string;
    applyTime: string;
    order: {
      id: string;
      orderNo: string;
      status: OrderStatus;
      actualPayAmount: number;
    };
    orderItem: OrderItemInfo;
  };
}

// 基础记录：售后（创建、取消返回）
export interface AfterSaleRecord {
  id: string;
  orderId: string;
  orderItemId: string;
  afterSaleNo: string;
  type: AfterSaleType;
  reason: string;
  remark: string | null;
  status: AfterSaleStatus;
  rejectReason: string | null;
  receiverProvince: string;
  receiverCity: string;
  receiverArea: string;
  receiverStreet: string;
  receiverAddress: string;
  receiverRemark: string | null;
  receiverName: string;
  receiverPhone: string;
  applyTime: string;
  completeTime: string | null;
  images: ImageInfo[];
}

// 列表项：售后
export interface AfterSaleListItem {
  id: string;
  orderId: string;
  orderItemId: string;
  afterSaleNo: string;
  type: AfterSaleType;
  reason: string;
  remark: string | null;
  status: AfterSaleStatus;
  rejectReason: string | null;
  applyTime: string;
  completeTime: string | null;
  order: OrderInfo;
  orderItem: OrderItemInfo;
}

// 基础记录：评价
export interface EvaluationBasic {
  id: string;
  userId: string;
  productId: string;
  configId: string;
  star: number;
  content: string | null;
  status: EvaluationStatus;
  createdAt: string;
  updatedAt: string;
  images: ImageInfo[];
}

// 基础记录：吐槽
export interface CommentBasic {
  id: string;
  userId: string;
  orderId: string;
  orderItemId: string;
  content: string;
  status: CommentStatus;
  createdAt: string;
  updatedAt: string;
  images: ImageInfo[];
}

// 基础记录：投诉
export interface ComplaintBasic {
  id: string;
  userId: string;
  afterSaleId: string;
  content: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  images: ImageInfo[];
}

// 前端请求/响应类型
export type CreateAfterSaleResponse = AfterSaleRecord;
export type CancelAfterSaleResponse = AfterSaleRecord;
export type CreateComplaintResponse = ComplaintBasic;
export type CreateEvaluationResponse = EvaluationBasic;
export type CreateCommentResponse = CommentBasic;
export type GetEvaluationsResponse = EvaluationDetail[];
export type GetCommentsResponse = CommentDetail[];
export type GetAfterSalesResponse = AfterSaleListItem[];
export type GetComplaintsResponse = ComplaintDetail[];
export type GetAfterSaleDetailResponse = AfterSaleDetail;







// types/navigation.ts
export interface EvaluationPageState {
  productId: string;
  configId: string;
  productName: string;
  configName: string;
  image: string;
  orderId: string;
}

export interface AfterSaleApplyState {
  orderId: string;
  orderItemId: string;
}

export interface ComplaintPageState {
  afterSaleId: string;
}

export interface ReapplyState {
  orderId: string;
  orderItemId: string;
}

export interface AfterSaleQueryParams {
  status?: string;
  orderId?: string;
  startDate?: string;
  endDate?: string;
}


