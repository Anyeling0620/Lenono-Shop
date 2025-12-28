import React, { useEffect, useState } from "react";
import { getProductEvaluations } from "../../services/products";
import toast from "react-hot-toast";
import globalErrorHandler from "../../utils/globalAxiosErrorHandler";
import type { EvaluationItem, ProductEvaluationListResponse } from "../../types/evaluation";
import { type ApiResponse, axiosInstance } from "../../services/AxiosService";
import { API_PATHS } from "../../services/apiPaths";
import { getImageUrl, getUserAvatarUrl } from "../../utils/imageConfig";


interface ProductCommentsProps {
  productId: string;
}


const ProductComments: React.FC<ProductCommentsProps> = ({ productId }) => {
  const [sortBy, setSortBy] = useState<"newest" | "helpful">("newest");
  const [showAll, setShowAll] = useState(false);
  const [evaluations, setEvaluations] = useState<EvaluationItem[]>([]);
  const [evaluationLoading, setEvaluationLoading] = useState<boolean>(false);
  const [likedCommentIds, setLikedCommentIds] = useState<Set<string>>(new Set());

  // 计算评价统计数据
  const commentStats = {
    totalCount: evaluations.length,
    averageRating: evaluations.length > 0
      ? parseFloat((evaluations.reduce((sum, item) => sum + item.star, 0) / evaluations.length).toFixed(1))
      : 0,
    ratingDistribution: {
      5: evaluations.filter(item => item.star >= 4.5).length,
      4: evaluations.filter(item => item.star >= 3.5 && item.star < 4.5).length,
      3: evaluations.filter(item => item.star >= 2.5 && item.star < 3.5).length,
      2: evaluations.filter(item => item.star >= 1.5 && item.star < 2.5).length,
      1: evaluations.filter(item => item.star < 1.5).length,
    }
  };

  const fetchEvaluations = async (productId: string) => {
    setEvaluationLoading(true);
    try {
      // 实际项目启用真实接口
      const res: ProductEvaluationListResponse = await getProductEvaluations(productId);
      setEvaluations(res.items);
    } catch (error) {
      globalErrorHandler.handle(error, toast.error);
    } finally {
      setEvaluationLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluations(productId);
  }, [productId]);

  // 排序评论
  const sortedComments = [...evaluations].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return (b.likeNum || 0) - (a.likeNum || 0);
    }
  });

  const displayComments = showAll ? sortedComments : sortedComments.slice(0, 3);

  // 渲染星级
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="text-sm text-yellow-400">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="text-sm text-yellow-400">★½</span>);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-sm text-gray-300">★</span>);
    }

    return stars;
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // 格式化配置
  const formatConfigs = (configs: string[]) => {
    return configs.join(" | ");
  };

  // ========== 核心修复：点赞函数（新增全量调试日志） ==========
  const handleLike = async (id: string) => {
    // 第一步：确认函数被调用（关键调试）
    console.log("点赞函数触发，评论ID：", id); // 重点：如果这行不打印，说明事件未绑定

    // 检查是否已点赞
    if (likedCommentIds.has(id)) {
      return;
    }

    try {
      console.log("发起点赞接口请求：", API_PATHS.EVALUATION_LIKE(id));
      await axiosInstance.get<ApiResponse<null>>(API_PATHS.EVALUATION_LIKE(id));

      setEvaluations(prev =>
        prev.map(item =>
          item.id === id ? { ...item, likeNum: (item.likeNum || 0) + 1 } : item
        )
      );

      setLikedCommentIds(prev => new Set(prev).add(id));

    } catch (e) {
      globalErrorHandler.handle(e, toast.error);
    }
  };

  // 加载中状态
  if (evaluationLoading) {
    return (
      <div className="p-20 text-center text-gray-500 bg-gray-50">
        评价数据加载中...
      </div>
    );
  }

  // 无评价数据
  if (evaluations.length === 0) {
    return (
      <div className="p-20 text-center text-gray-500 bg-gray-50">
        暂无评价数据
      </div>
    );
  }

  return (
    <div className="p-6" style={{ pointerEvents: "auto" }}> {/* 确保父元素可点击 */}
      {/* 评论统计 */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">商品评价</h3>
          <div className="flex items-center space-x-4 text-sm">
            <span>累计评价 {commentStats.totalCount}</span>
            <span>
              好评率{" "}
              {commentStats.totalCount > 0
                ? Math.round(
                  ((commentStats.ratingDistribution[5] + commentStats.ratingDistribution[4]) /
                    commentStats.totalCount) *
                  100
                )
                : 0}
              %
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#e1140a] mb-1">
              {commentStats.averageRating || 0}
            </div>
            <div className="flex justify-center mb-1">
              {renderStars(commentStats.averageRating || 0)}
            </div>
            <div className="text-sm text-gray-500">{commentStats.totalCount}人评价</div>
          </div>

          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center text-sm mb-1">
                <span className="w-8">{star}星</span>
                <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#e1140a] h-2 rounded-full"
                    style={{
                      width: `${commentStats.totalCount > 0
                        ? (commentStats.ratingDistribution[star as keyof typeof commentStats.ratingDistribution] /
                          commentStats.totalCount) *
                        100
                        : 0
                        }%`
                    }}
                  ></div>
                </div>
                <span className="w-8 text-right">
                  {commentStats.ratingDistribution[star as keyof typeof commentStats.ratingDistribution]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 排序选项 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setSortBy("newest")}
            className={`px-4 py-2 text-sm rounded ${sortBy === "newest"
              ? "bg-[#e1140a] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            最新评价
          </button>
          <button
            onClick={() => setSortBy("helpful")}
            className={`px-4 py-2 text-sm rounded ${sortBy === "helpful"
              ? "bg-[#e1140a] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            最有帮助
          </button>
        </div>
      </div>

      {/* 评论列表 */}
      <div className="space-y-6" style={{ pointerEvents: "auto" }}> {/* 确保列表可点击 */}
        {displayComments.map((comment) => {
          const isLiked = likedCommentIds.has(comment.id);
          console.log("渲染评论：", comment.id, "已点赞：", isLiked); // 调试日志
          return (
            <div
              key={comment.id}
              className="border-b border-gray-200 pb-6"
              style={{ pointerEvents: "auto" }} // 确保每个评论项可点击
            >
              <div className="flex items-start space-x-4">
                {/* 用户头像 */}
                <div className="flex-shrink-0">
                  <img
                    src={getUserAvatarUrl(comment.user.avatar)}
                    alt={comment.user.nickname || "用户"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>

                {/* 评论内容 */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium">{comment.user.nickname || "匿名用户"}</span>
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    {renderStars(comment.star)}
                    <span className="text-sm text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    <span>商品：{comment.productName}</span>
                    <span className="ml-2">规格：{formatConfigs(comment.configs)}</span>
                  </div>

                  <div className="text-gray-700 mb-3 leading-relaxed">
                    {comment.content || "用户未填写评价内容"}
                  </div>

                  {/* 评论图片 */}
                  {comment.images && comment.images.length > 0 && (
                    <div className="flex space-x-2 mb-3">
                      {comment.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={getImageUrl(img)}
                          alt={`评论图片${idx + 1}`}
                          className="w-16 h-16 object-cover rounded border cursor-pointer hover:opacity-80"
                        />
                      ))}
                    </div>
                  )}

                  {/* ========== 核心修复：点赞按钮（新增原生事件绑定兜底） ========== */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {/* 方案1：React 事件（主方案） */}
                    <button
                      onClick={() => {
                        console.log("按钮点击触发（React事件）：", comment.id); // 调试日志
                        handleLike(comment.id);
                      }}

                      className={`${isLiked ? "text-[#e1140a]" : "hover:text-[#e1140a]"} transition-colors`}
                    >
                      <span>👍</span>
                      <span>有帮助 ({comment.likeNum || 0})</span>
                    </button>

                    {/* <button
                      className="hover:text-[#e1140a] transition-colors"
                      style={{ cursor: "pointer", border: "none", background: "none", padding: 0 }}
                    >
                      回复
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 加载更多 */}
      {evaluations.length > 3 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            {showAll ? "收起评价" : `查看全部评价 (${evaluations.length})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductComments;