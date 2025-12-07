import React, { useState } from "react";
import { getProductComments, getCommentStats } from "../../assets/data/mockComments";

interface ProductCommentsProps {
  productId: string;
}

const ProductComments: React.FC<ProductCommentsProps> = ({ productId }) => {
  const [sortBy, setSortBy] = useState<"newest" | "helpful">("newest");
  const [showAll, setShowAll] = useState(false);

  const comments = getProductComments(productId);
  const stats = getCommentStats(productId);

  // 排序评论
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return b.helpful - a.helpful;
    }
  });

  const displayComments = showAll ? sortedComments : sortedComments.slice(0, 3);

  // 渲染星级
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
      >
        ★
      </span>
    ));
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (comments.length === 0) {
    return (
      <div className="p-20 text-center text-gray-500 bg-gray-50">
        暂无评价数据
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 评论统计 */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">商品评价</h3>
          <div className="flex items-center space-x-4 text-sm">
            <span>累计评价 {stats.totalCount}</span>
            <span>好评率 {Math.round((stats.ratingDistribution[4] + stats.ratingDistribution[5]) / stats.totalCount * 100)}%</span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#e1140a] mb-1">
              {stats.averageRating}
            </div>
            <div className="flex justify-center mb-1">
              {renderStars(Math.round(stats.averageRating))}
            </div>
            <div className="text-sm text-gray-500">{stats.totalCount}人评价</div>
          </div>

          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center text-sm mb-1">
                <span className="w-8">{star}星</span>
                <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#e1140a] h-2 rounded-full"
                    style={{ width: `${(stats.ratingDistribution[star as keyof typeof stats.ratingDistribution] / stats.totalCount) * 100}%` }}
                  ></div>
                </div>
                <span className="w-8 text-right">{stats.ratingDistribution[star as keyof typeof stats.ratingDistribution]}</span>
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
            className={`px-4 py-2 text-sm rounded ${
              sortBy === "newest"
                ? "bg-[#e1140a] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            最新评价
          </button>
          <button
            onClick={() => setSortBy("helpful")}
            className={`px-4 py-2 text-sm rounded ${
              sortBy === "helpful"
                ? "bg-[#e1140a] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            最有帮助
          </button>
        </div>
      </div>

      {/* 评论列表 */}
      <div className="space-y-6">
        {displayComments.map((comment) => (
          <div key={comment.id} className="border-b border-gray-200 pb-6">
            <div className="flex items-start space-x-4">
              {/* 用户头像 */}
              <div className="flex-shrink-0">
                <img
                  src={comment.userAvatar || "https://via.placeholder.com/40x40?text=用户"}
                  alt={comment.userName}
                  className="w-10 h-10 rounded-full"
                />
              </div>

              {/* 评论内容 */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium">{comment.userName}</span>
                  {comment.verified && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                      真实购买用户
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  {renderStars(comment.rating)}
                  <span className="text-sm text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>

                {comment.specText && (
                  <div className="text-sm text-gray-600 mb-2">
                    购买规格：{comment.specText}
                  </div>
                )}

                <div className="text-gray-700 mb-3 leading-relaxed">
                  {comment.content}
                </div>

                {/* 评论图片 */}
                {comment.images && comment.images.length > 0 && (
                  <div className="flex space-x-2 mb-3">
                    {comment.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`评论图片${idx + 1}`}
                        className="w-16 h-16 object-cover rounded border cursor-pointer hover:opacity-80"
                      />
                    ))}
                  </div>
                )}

                {/* 点赞按钮 */}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <button className="flex items-center space-x-1 hover:text-[#e1140a]">
                    <span>👍</span>
                    <span>有帮助 ({comment.helpful})</span>
                  </button>
                  <button className="hover:text-[#e1140a]">回复</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 加载更多 */}
      {comments.length > 3 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            {showAll ? "收起评价" : `查看全部评价 (${comments.length})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductComments;