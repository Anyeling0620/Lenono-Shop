import React, { useEffect, useState } from 'react';
import type { CommentDetail } from '../../types/afterSale';
import { getComments } from '../../services/afterSale';

const mockComments: CommentDetail[] = [
  {
    id: 'cmt-1',
    userId: 'user-1',
    orderId: 'order-1',
    orderItemId: 'order-item-1',
    content: '物流速度有点慢，希望改进一下。',
    status: '正常',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    images: [],
    order: {
      id: 'order-1',
      orderNo: '#123456',
      status: '待发货',
      actualPayAmount: 6999,
      createdAt: new Date(),
    },
    orderItem: {
      id: 'order-item-1',
      productName: '联想小新 Pro 14',
      configName: 'i5/16G/512G',
      quantity: 1,
      price: 6999,
      productId: 'prod-1',
      configId: 'cfg-1',
      product: null,
      config: null,
    },
  },
  {
    id: 'cmt-2',
    userId: 'user-1',
    orderId: 'order-2',
    orderItemId: 'order-item-2',
    content: '客服回复不及时，不过最后问题解决了。',
    status: '正常',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    images: [{ id: 'img-1', image: 'https://via.placeholder.com/150' }],
    order: {
      id: 'order-2',
      orderNo: '#123457',
      status: '已发货',
      actualPayAmount: 8999,
      createdAt: new Date(),
    },
    orderItem: {
      id: 'order-item-2',
      productName: 'ThinkPad X1 Carbon',
      configName: 'i7/16G/1T',
      quantity: 1,
      price: 8999,
      productId: 'prod-2',
      configId: 'cfg-2',
      product: null,
      config: null,
    },
  },
];

const statusStyleMap: Record<string, string> = {
  正常: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  撤回: 'bg-amber-100 text-amber-800 border border-amber-200',
  用户删除: 'bg-gray-100 text-gray-800 border border-gray-200',
};

const statusTextMap: Record<string, string> = {
  正常: '正常',
  撤回: '已撤回',
  用户删除: '已删除',
};

const getStatusStyle = (status: CommentDetail['status']) => {
  return statusStyleMap[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
};

const getStatusText = (status: CommentDetail['status']) => {
  return statusTextMap[status] || status || '未知';
};

const formatDate = (value: Date | string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '未知时间';
  return date.toLocaleString();
};

const Roast: React.FC = () => {
  const [comments, setComments] = useState<CommentDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getComments();
        setComments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败（已使用模拟数据）');
        setComments(mockComments);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-white min-h-[calc(90vh-120px)]">
      <h3 className="text-2xl font-bold mb-4 text-[#2b2b2b]">我的吐槽</h3>

      {loading && <div className="text-gray-600">加载中...</div>}
      {error && !loading && <div className="text-red-500">{error}</div>}
      {!loading && !error && comments.length === 0 && (
        <div className="text-gray-500">暂无吐槽记录</div>
      )}

      {!loading && comments.length > 0 && (
        <div className="space-y-3 max-w-4xl mx-auto">
          {comments.map((comment) => (
            <details key={comment.id} className="group">
              <summary className="cursor-pointer list-none p-0">
                <div className="bg-white shadow-sm rounded-lg p-5 border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-150">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-[#222] mb-1 leading-tight">
                        订单 {comment.order.orderNo} - {comment.orderItem.productName}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 mb-2 text-sm text-gray-500">
                        <span>下单：{formatDate(comment.order.createdAt)}</span>
                        <span>吐槽：{formatDate(comment.createdAt)}</span>
                      </div>
                      <span
                        className={`px-3 py-1.5 rounded-md text-xs font-medium border ${getStatusStyle(comment.status)}`}
                      >
                        {getStatusText(comment.status)}
                      </span>
                    </div>
                    <button className="ml-3 p-2 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors [&[open]]:rotate-180">
                      查看详情
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </summary>
              <div className="mt-0 pt-3 pb-4 px-5 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                <p className="text-base text-gray-700 leading-relaxed mb-4">
                  {comment.content}
                </p>
                {comment.images && comment.images.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {comment.images.map((image) => (
                      <img
                        key={image.id}
                        src={image.image}
                        alt="吐槽附件"
                        className="w-20 h-20 object-cover rounded border border-gray-200"
                      />
                    ))}
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
};

export default Roast;
