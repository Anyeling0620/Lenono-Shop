export type AfterSaleStatus = 'applying' | 'processing' | 'completed' | 'rejected';

export interface AfterSaleItem {
  id: number;
  orderId: string;
  productName: string;
  reason: string;
  status: AfterSaleStatus;
  time: string;
  details?: string;
}
