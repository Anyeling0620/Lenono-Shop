// services/after-sale.service.ts
import { type ApiResponse, axiosInstance } from "./AxiosService";
import type{
  CreateAfterSaleDto,
  CreateCommentDto,
  CreateComplaintDto,
  CreateEvaluationDto,
  ListQueryDto,
  CreateAfterSaleResponse,
  CancelAfterSaleResponse,
  CreateComplaintResponse,
  CreateEvaluationResponse,
  CreateCommentResponse,
  GetEvaluationsResponse,
  GetCommentsResponse,
  GetAfterSalesResponse,
  GetComplaintsResponse,
  GetAfterSaleDetailResponse
} from "../types/afterSale";

// ==================== 售后相关 ====================

/**
 * 申请售后（支持文件上传）
 * @param params 售后申请参数（包含文本字段和可选的文件）
 * @returns 创建的售后记录
 */
export async function createAfterSale(
  params: Omit<CreateAfterSaleDto, 'images'> & { imageFiles?: File[] }
): Promise<CreateAfterSaleResponse> {
  const formData = new FormData();
  
  // 添加文本字段
  formData.append('orderId', params.orderId);
  formData.append('orderItemId', params.orderItemId);
  formData.append('type', params.type);
  formData.append('reason', params.reason);
  if (params.remark) {
    formData.append('remark', params.remark);
  }
  
  // 添加图片文件
  if (params.imageFiles && params.imageFiles.length > 0) {
    params.imageFiles.forEach((file) => {
      formData.append('images', file);
    });
  }
  
  return (await axiosInstance.post<ApiResponse<CreateAfterSaleResponse>>(
    "/after-sale/apply", 
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )).data.data;
}

/**
 * 取消售后
 * @param id 售后记录ID
 * @returns 更新后的售后记录
 */
export async function cancelAfterSale(id: string): Promise<CancelAfterSaleResponse> {
  return (await axiosInstance.put<ApiResponse<CancelAfterSaleResponse>>(`/after-sale/cancel/${id}`)).data.data;
}

// ==================== 投诉相关 ====================

/**
 * 对完成的售后投诉（支持文件上传）
 * @param params 投诉参数（包含文本字段和可选的文件）
 * @returns 创建的投诉记录
 */
export async function createComplaint(
  params: Omit<CreateComplaintDto, 'images'> & { imageFiles?: File[] }
): Promise<CreateComplaintResponse> {
  const formData = new FormData();
  
  // 添加文本字段
  formData.append('afterSaleId', params.afterSaleId);
  formData.append('content', params.content);
  
  // 添加图片文件
  if (params.imageFiles && params.imageFiles.length > 0) {
    params.imageFiles.forEach((file) => {
      formData.append('images', file);
    });
  }
  
  return (await axiosInstance.post<ApiResponse<CreateComplaintResponse>>(
    "/after-sale/complaint", 
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )).data.data;
}

/**
 * 用户删除投诉
 * @param id 投诉记录ID
 * @returns void
 */
export async function deleteComplaint(id: string): Promise<void> {
  return (await axiosInstance.delete<ApiResponse<void>>(`/after-sale/complaint/${id}`)).data.data;
}

// ==================== 评价相关 ====================

/**
 * 评价已完成订单里的商品（支持文件上传）
 * @param params 评价参数（包含文本字段和可选的文件）
 * @returns 创建的评价记录
 */
export async function createEvaluation(
  params: Omit<CreateEvaluationDto, 'images'> & { imageFiles?: File[] }
): Promise<CreateEvaluationResponse> {
  const formData = new FormData();
  
  // 添加文本字段
  formData.append('productId', params.productId);
  formData.append('configId', params.configId);
  formData.append('star', params.star.toString());
  if (params.content) {
    formData.append('content', params.content);
  }
  
  // 添加图片文件
  if (params.imageFiles && params.imageFiles.length > 0) {
    params.imageFiles.forEach((file) => {
      formData.append('images', file);
    });
  }
  
  return (await axiosInstance.post<ApiResponse<CreateEvaluationResponse>>(
    "/after-sale/evaluation", 
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )).data.data;
}

/**
 * 用户删除评价
 * @param id 评价记录ID
 * @returns void
 */
export async function deleteEvaluation(id: string): Promise<void> {
  return (await axiosInstance.delete<ApiResponse<void>>(`/after-sale/evaluation/${id}`)).data.data;
}

// ==================== 吐槽相关 ====================

/**
 * 对订单吐槽（支持文件上传）
 * @param params 吐槽参数（包含文本字段和可选的文件）
 * @returns 创建的吐槽记录
 */
export async function createComment(
  params: Omit<CreateCommentDto, 'images'> & { imageFiles?: File[] }
): Promise<CreateCommentResponse> {
  const formData = new FormData();
  
  // 添加文本字段
  formData.append('orderId', params.orderId);
  formData.append('orderItemId', params.orderItemId);
  formData.append('content', params.content);
  
  // 添加图片文件
  if (params.imageFiles && params.imageFiles.length > 0) {
    params.imageFiles.forEach((file) => {
      formData.append('images', file);
    });
  }
  
  return (await axiosInstance.post<ApiResponse<CreateCommentResponse>>(
    "/after-sale/comment", 
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )).data.data;
}

// ==================== 查询相关 ====================

/**
 * 获取评价列表
 * @param query 查询参数（可选）
 * @returns 评价列表
 */
export async function getEvaluations(query?: ListQueryDto): Promise<GetEvaluationsResponse> {
  return (await axiosInstance.get<ApiResponse<GetEvaluationsResponse>>("/after-sale/evaluations", { params: query })).data.data;
}

/**
 * 获取吐槽列表
 * @param query 查询参数（可选）
 * @returns 吐槽列表
 */
export async function getComments(query?: ListQueryDto): Promise<GetCommentsResponse> {
  return (await axiosInstance.get<ApiResponse<GetCommentsResponse>>("/after-sale/comments", { params: query })).data.data;
}

/**
 * 获取售后列表
 * @param query 查询参数（可选）
 * @returns 售后列表
 */
export async function getAfterSales(query?: ListQueryDto): Promise<GetAfterSalesResponse> {
  return (await axiosInstance.get<ApiResponse<GetAfterSalesResponse>>("/after-sale/after-sales", { params: query })).data.data;
}

/**
 * 获取投诉列表
 * @param query 查询参数（可选）
 * @returns 投诉列表
 */
export async function getComplaints(query?: ListQueryDto): Promise<GetComplaintsResponse> {
  return (await axiosInstance.get<ApiResponse<GetComplaintsResponse>>("/after-sale/complaints", { params: query })).data.data;
}

/**
 * 获取售后详情
 * @param id 售后记录ID
 * @returns 售后详情
 */
export async function getAfterSaleDetail(id: string): Promise<GetAfterSaleDetailResponse> {
  return (await axiosInstance.get<ApiResponse<GetAfterSaleDetailResponse>>(`/after-sale/after-sales/${id}`)).data.data;
}

// ==================== 服务对象导出 ====================

/**
 * 售后服务对象，包含所有相关API函数
 */
export const afterSaleService = {
  // 创建相关
  createAfterSale,
  createComplaint,
  createEvaluation,
  createComment,
  
  // 删除相关
  deleteEvaluation,
  deleteComplaint,
  
  // 更新相关
  cancelAfterSale,
  
  // 查询相关
  getEvaluations,
  getComments,
  getAfterSales,
  getComplaints,
  getAfterSaleDetail
};
