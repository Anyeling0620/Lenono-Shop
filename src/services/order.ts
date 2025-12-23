import type { CancelOrderInput, CreateOrderInput, OrderDetailResponse, OrderListQuery, OrderListResponse, OrderResponse, OrderStats, PaymentInput, SimpleOrderItem } from "../types/order";
import { type ApiResponse, axiosInstance } from "./AxiosService";

/**
 * 创建订单
 */
export async function createOrder(params:CreateOrderInput): Promise<OrderResponse> {
  return (await axiosInstance.post<ApiResponse<OrderResponse>>("/order/create", params)).data.data;
}

/**
 * 取消订单
 */
export async function cancelOrder(params: CancelOrderInput): Promise<void> {
  return (await axiosInstance.post<ApiResponse<void>>("/order/cancel", params)).data.data;
}

/**
 * 使用代金券支付
 */
export async function payWithVoucher(params: PaymentInput): Promise<{
  success: boolean;
  paidAmount: number;
  remainAmount: number;
}> {
  return (await axiosInstance.post<ApiResponse<{
    success: boolean;
    paidAmount: number;
    remainAmount: number;
  }>>("/order/pay/voucher", params)).data.data;
}

/**
 * 获取订单支付状态
 */
export async function getPaymentStatus(orderId: string):Promise<{
    orderId: string;
    orderNo: string;
    status: string;
    payAmount: number;
    actualPayAmount: number;
    payTime?: Date;
    payType?: string;
    payLimitTime: Date;
  }>{
  return (await axiosInstance.get<ApiResponse<{
    orderId: string;
    orderNo: string;
    status: string;
    payAmount: number;
    actualPayAmount: number;
    payTime?: Date;
    payType?: string;
    payLimitTime: Date;
  }>>("/order/payment/status", {
    params: { orderId }
  })).data.data;
}

/**
 * 获取订单列表
 */
export async function getOrderList(params: OrderListQuery): Promise<OrderListResponse> {
  return (await axiosInstance.get<ApiResponse<OrderListResponse>>("/order/list", {
    params
  })).data.data;
}

/**
 * 获取订单详情
 */
export async function getOrderDetail(id: string): Promise<OrderDetailResponse> {
  return (await axiosInstance.get<ApiResponse<OrderDetailResponse>>(`/order/order-detail/${id}`)).data.data;
}

/**
 * 获取订单统计信息
 */
export async function getOrderStats(): Promise<OrderStats> {
  return (await axiosInstance.get<ApiResponse<OrderStats>>("/order/stats")).data.data;
}

/**
 * 获取简单订单列表
 */
export async function getSimpleOrders(): Promise<{ orders: SimpleOrderItem[] }> {
  return (await axiosInstance.get<ApiResponse<{ orders: SimpleOrderItem[] }>>("/order/list")).data.data;
}