export interface ProductComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5星
  content: string;
  images?: string[];
  createdAt: string;
  helpful: number; // 点赞数
  specText?: string; // 购买规格
  verified: boolean; // 是否为真实购买用户
}

export interface CommentStats {
  totalCount: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}