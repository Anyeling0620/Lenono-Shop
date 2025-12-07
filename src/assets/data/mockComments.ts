import type { ProductComment, CommentStats } from "../../types/productComment";

// Mock评论数据
export const mockComments: Record<string, ProductComment[]> = {
  "1": [
    {
      id: "c1",
      userId: "u1",
      userName: "联想用户123",
      userAvatar: "https://via.placeholder.com/40x40?text=U1",
      rating: 5,
      content: "这款小新14真的很不错，外观设计时尚，性能稳定，续航也很好。屏幕显示效果清晰，键盘手感舒适。性价比很高，推荐购买！",
      images: [
        "https://via.placeholder.com/100x100?text=产品图1",
        "https://via.placeholder.com/100x100?text=产品图2"
      ],
      createdAt: "2024-12-01T10:30:00Z",
      helpful: 25,
      specText: "颜色:官方标配 / 配置:标准版",
      verified: true
    },
    {
      id: "c2",
      userId: "u2",
      userName: "科技爱好者",
      rating: 4,
      content: "整体使用体验良好，运行流畅，没有出现卡顿现象。散热效果不错，打游戏时温度控制得很好。",
      createdAt: "2024-11-28T14:20:00Z",
      helpful: 18,
      specText: "颜色:官方标配 / 配置:定制版",
      verified: true
    },
    {
      id: "c3",
      userId: "u3",
      userName: "学生党",
      rating: 5,
      content: "作为学生使用，主要用来学习和娱乐，完全满足需求。电池续航时间很长，一天使用下来还有剩余电量。",
      createdAt: "2024-11-25T09:15:00Z",
      helpful: 12,
      verified: true
    }
  ],
  "2": [
    {
      id: "c4",
      userId: "u4",
      userName: "办公用户",
      rating: 4,
      content: "小新16屏幕更大，办公效率更高。接口丰富，外接显示器很方便。唯一的缺点是稍微重了一些。",
      createdAt: "2024-12-02T16:45:00Z",
      helpful: 8,
      specText: "颜色:官方标配 / 配置:标准版",
      verified: true
    }
  ],
  "3": [
    {
      id: "c5",
      userId: "u5",
      userName: "游戏玩家",
      rating: 5,
      content: "Pro14GT AI元启版性能强大，运行大型游戏毫无压力。AI功能很实用，屏幕色彩还原度很高。",
      images: ["https://via.placeholder.com/100x100?text=游戏截图"],
      createdAt: "2024-11-30T11:20:00Z",
      helpful: 32,
      specText: "颜色:官方标配 / 配置:定制版",
      verified: true
    }
  ]
};

// 获取商品评论
export const getProductComments = (productId: string): ProductComment[] => {
  return mockComments[productId] || [];
};

// 获取评论统计
export const getCommentStats = (productId: string): CommentStats => {
  const comments = getProductComments(productId);
  const totalCount = comments.length;

  if (totalCount === 0) {
    return {
      totalCount: 0,
      averageRating: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }

  const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
  const averageRating = totalRating / totalCount;

  const ratingDistribution = comments.reduce((dist, comment) => {
    dist[comment.rating as keyof typeof dist]++;
    return dist;
  }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

  return {
    totalCount,
    averageRating: Math.round(averageRating * 10) / 10,
    ratingDistribution
  };
};