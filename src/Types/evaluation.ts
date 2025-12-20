
export interface EvaluationUserBrief {
  id: string;
  nickname: string | null;
  avatar: string | null;
}

export interface EvaluationItem {
  id: string;
  productName:string;
  configs:string[];
  userId: string;
  star: number; // 1.0 ~ 5.0 (0.5 step)
  content?: string | null;
  createdAt: string; // YYYY-MM-DD HH:mm:ss
  images: string[]; // 图片地址数组
  user: EvaluationUserBrief; // 评价用户信息
  likeNum: number; // 点赞数

}

export interface ProductEvaluationListResponse {
  items: EvaluationItem[];
}

