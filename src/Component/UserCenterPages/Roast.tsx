import React, { useEffect, useState } from 'react';
import type { CommentDetail } from '../../types/afterSale';
import { getComments } from '../../services/afterSale';
import {
  MessageOutlined,
  ClockCircleOutlined,
  ShoppingOutlined,
  DownOutlined,
  UpOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Card, Image, Button, Divider, Empty, Skeleton } from 'antd';
import globalErrorHandler from '../../utils/globalAxiosErrorHandler';
import toast from 'react-hot-toast';

const mockComments: CommentDetail[] = [
  {
    id: 'cmt-1',
    userId: 'user-1',
    orderId: 'order-1',
    orderItemId: 'order-item-1',
    content: '物流速度有点慢，从下单到收货用了整整5天时间，希望改进一下配送效率。另外包装也有点简陋，电脑盒子边角都磕碰了。',
    status: '正常',
    createdAt: new Date('2024-12-10T14:30:00').toISOString(),
    updatedAt: new Date('2024-12-10T14:30:00').toISOString(),
    images: [],
    order: {
      id: 'order-1',
      orderNo: 'ORD202412100001',
      status: '已收货',
      actualPayAmount: 6999,
      createdAt: new Date('2024-12-05T10:15:00'),
    },
    orderItem: {
      id: 'order-item-1',
      productName: '联想小新 Pro 14 2024款',
      configName: 'i5-13500H/16GB/512GB/2.8K 120Hz',
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
    content: '客服回复不及时，等了2个小时才有人回复。不过最后问题解决了，售后工程师态度很好，专业水平也不错。',
    status: '正常',
    createdAt: new Date('2024-12-08T09:45:00').toISOString(),
    updatedAt: new Date('2024-12-08T09:45:00').toISOString(),
    images: [
      {
        id: 'img-1',
        image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop'
      },
      {
        id: 'img-2',
        image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w-400&h=300&fit=crop'
      }
    ],
    order: {
      id: 'order-2',
      orderNo: 'ORD202412080002',
      status: '已收货',
      actualPayAmount: 8999,
      createdAt: new Date('2024-12-03T15:20:00'),
    },
    orderItem: {
      id: 'order-item-2',
      productName: 'ThinkPad X1 Carbon Gen 11',
      configName: 'i7-1365U/16GB/1TB/2.8K OLED',
      quantity: 1,
      price: 8999,
      productId: 'prod-2',
      configId: 'cfg-2',
      product: null,
      config: null,
    },
  },
  {
    id: 'cmt-3',
    userId: 'user-1',
    orderId: 'order-3',
    orderItemId: 'order-item-3',
    content: '产品本身没问题，但赠品少发了鼠标垫，联系客服后补发了，处理速度还可以。',
    status: '已撤回',
    createdAt: new Date('2024-12-05T16:20:00').toISOString(),
    updatedAt: new Date('2024-12-06T10:30:00').toISOString(),
    images: [
      {
        id: 'img-3',
        image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop'
      }
    ],
    order: {
      id: 'order-3',
      orderNo: 'ORD202412050003',
      status: '已收货',
      actualPayAmount: 12999,
      createdAt: new Date('2024-12-01T11:45:00'),
    },
    orderItem: {
      id: 'order-item-3',
      productName: '联想拯救者 Y9000P 2024',
      configName: 'i9-14900HX/32GB/2TB/RTX 4070',
      quantity: 1,
      price: 12999,
      productId: 'prod-3',
      configId: 'cfg-3',
      product: null,
      config: null,
    },
  },
];


const formatDate = (value: Date | string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '未知时间';

  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return '今天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else {
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  }
};

const formatPrice = (price: number) => {
  return `¥${price.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const Roast: React.FC = () => {
  const [comments, setComments] = useState<CommentDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getComments();
        setComments(data)

      } catch (err) {
        globalErrorHandler.handle(err,toast.error)
        setComments(mockComments);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };


  const handleDelete = (id: string) => {
    toast('功能待开发');
    // 这里可以调用删除 API
  };

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-b from-gray-50 to-white ">
        <div className=" mx-auto">
          <Skeleton active paragraph={{ rows: 4 }} />
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-2 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto">
        {/* 页面标题 */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <MessageOutlined className="text-xl text-red-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">我的吐槽</h1>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card className="shadow-sm border-0 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">总吐槽数</p>
                <p className="text-2xl font-bold text-gray-900">{comments.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <MessageOutlined className="text-xl text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="shadow-sm border-0 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">待处理</p>
                <p className="text-2xl font-bold text-orange-600">0</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <ClockCircleOutlined className="text-xl text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="shadow-sm border-0 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">已解决</p>
                <p className="text-2xl font-bold text-green-600">
                  {comments.filter(c => c.status === '正常').length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircleOutlined className="text-xl text-green-600" />
              </div>
            </div>
          </Card>
        </div>


        {!loading && comments.length === 0 ? (
          <Card className="shadow-sm border-0 rounded-xl">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="text-center">
                  <p className="text-gray-600 mb-2">暂无吐槽记录</p>
                  <p className="text-gray-400 text-sm">您还没有发表过任何吐槽</p>
                </div>
              }
            />
          </Card>
        ) : (
          <div className="h-[450px] overflow-y-auto pr-[6px] 
    [&::-webkit-scrollbar]:w-1
    [&::-webkit-scrollbar-track]:rounded-xl
    [&::-webkit-scrollbar-track]:bg-gray-100
    [&::-webkit-scrollbar-thumb]:rounded-xl
    [&::-webkit-scrollbar-thumb]:bg-gray-300
    [&::-webkit-scrollbar-thumb:hover]:bg-gray-400
    [&::-webkit-scrollbar-button]:hidden
">
          <div className="space-y-4">
            {comments.map((comment) => {
              const isExpanded = expandedId === comment.id;

              return (
                <Card
                  key={comment.id}
                  className={`shadow-sm border-0 rounded-xl transition-all duration-300 hover:shadow-md ${isExpanded ? 'border-l-4 border-l-red-500' : ''
                    }`}
                  bodyStyle={{ padding: '24px' }}
                >
                  {/* 头部信息 */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                       
                        <span className="text-sm text-gray-500">
                          <ClockCircleOutlined className="mr-1" />
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {comment.orderItem.productName}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <ShoppingOutlined />
                          <span>订单号: {comment.order.orderNo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>规格: {comment.orderItem.configName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>实付: <span className="font-bold text-red-600">{formatPrice(comment.order.actualPayAmount)}</span></span>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="text"
                      icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
                      onClick={() => toggleExpand(comment.id)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      {isExpanded ? '收起详情' : '查看详情'}
                    </Button>
                  </div>

               

                  {/* 展开的详情 */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-gray-100 animate-fadeIn">
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500 mb-3">吐槽内容</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        </div>
                      </div>

                      {comment.images && comment.images.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-500 mb-3">相关图片</h4>
                          <div className="flex flex-wrap gap-3">
                            {comment.images.map((image) => (
                              <div
                                key={image.id}
                                className="relative group cursor-pointer"
                              >
                                <Image
                                  src={image.image}
                                  alt="吐槽附件"
                                  width={120}
                                  height={120}
                                  className="rounded-lg object-cover border border-gray-200 group-hover:border-red-300 transition-colors"
                                  preview={{
                                    mask: (
                                      <div className="flex items-center justify-center text-white">
                                        查看大图
                                      </div>
                                    )
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 操作按钮 */}
                      <Divider className="my-6" />
                      <div className="flex justify-end gap-3">
                        <Button
                          danger
                          onClick={() => handleDelete(comment.id)}
                          disabled={comment.status === '用户删除'}
                        >
                          删除吐槽
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Roast;
