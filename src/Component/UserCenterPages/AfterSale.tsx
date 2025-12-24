<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import type { CommentDetail } from '../../types/afterSale';
import { getComments } from '../../services/afterSale';

const mockComments: CommentDetail[] = [
  {
    id: 'cmt-1',
    userId: 'user-1',
    orderId: 'order-1',
    orderItemId: 'order-item-1',
    content: '发货速度有点慢，希望改进一下物流服务。',
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
      configName: 'i5/16G/512G 银色',
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
    content: '客服回复有点慢，不过问题解决了，赞一个。',
    status: '正常',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    images: [
      {
        id: 'img-1',
        image: 'https://via.placeholder.com/150',
      },
    ],
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
      configName: 'i7/16G/1T 黑色',
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
=======
import React, { useState } from 'react';
import {
  Button,
  Tag,
  Empty,
  Popconfirm,
  message,
  Steps,
  Card,
  Descriptions,
} from 'antd';
import type { StepsProps } from 'antd'; 
import {
  DeleteOutlined,
  LeftOutlined,
  SolutionOutlined,
  ShopOutlined,
  CarOutlined,
  CheckCircleOutlined,
  PayCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

/* ================= 1. 类型定义（真实商城级） ================= */

export const AfterSaleType = {
  RETURN: 'RETURN',
  EXCHANGE: 'EXCHANGE',
  REFUND: 'REFUND',
} as const;

export type AfterSaleType =
  typeof AfterSaleType[keyof typeof AfterSaleType];

export type AfterSaleStatus =
  | 'APPLIED'
  | 'REJECTED'
  | 'WAIT_SEND'
  | 'WAIT_RECEIVE'
  | 'WAIT_REFUND'
  | 'REFUNDED'
  | 'WAIT_RESHIP'
  | 'FINISHED';

interface AfterSaleItem {
  id: string;
  orderId: string;
  productName: string;
  productImage: string;
  price: number;
  type: AfterSaleType;
  status: AfterSaleStatus;
  reason: string;
  applyTime: string;
  refund?: {
    applyAmount: number;
    approvedAmount?: number;
    refundedAmount?: number;
  };
  rejectReason?: string;
}

/* ================= 2. 模拟数据 ================= */

const MOCK_DATA: AfterSaleItem[] = [
  {
    id: 'AS_2025010101',
    orderId: 'ORDER_1001',
    productName: '联想小新 Air 14 2025款',
    productImage:
      'https://p2.lefile.cn/product/adminweb/2024/11/08/0e129323-0862-42da-9190-217277685652.png',
    price: 4599,
    type: AfterSaleType.RETURN,
    status: 'WAIT_RECEIVE',
    reason: '屏幕显示异常',
    applyTime: '2025-01-01 10:00',
    refund: {
      applyAmount: 4599,
    },
  },
  {
    id: 'AS_2025010102',
    orderId: 'ORDER_1002',
    productName: 'ThinkPad X1 Carbon',
    productImage:
      'https://p1.lefile.cn/product/adminweb/2024/04/19/22026859-6799-4d6f-997e-131753782413.jpg',
    price: 12999,
    type: AfterSaleType.EXCHANGE,
    status: 'FINISHED',
    reason: '键盘手感问题',
    applyTime: '2024-12-25 14:00',
  },
  {
    id: 'AS_2025010103',
    orderId: 'ORDER_1003',
    productName: '拯救者 Y9000P',
    productImage:
      'https://p4.lefile.cn/product/adminweb/2024/01/17/57530691-0985-484d-862d-965d10526056.jpg',
    price: 9999,
    type: AfterSaleType.RETURN,
    status: 'REJECTED',
    reason: '人为损坏',
    applyTime: '2024-12-30 09:00',
    rejectReason:
      '经检测，屏幕破裂为外力撞击导致，不符合三包政策。',
  },
];

/* ================= 3. 状态 & Step 映射 ================= */

const STATUS_TAG_MAP: Record<
  AfterSaleStatus,
  { color: string; text: string }
> = {
  APPLIED: { color: 'orange', text: '申请中' },
  WAIT_SEND: { color: 'blue', text: '待寄回' },
  WAIT_RECEIVE: { color: 'cyan', text: '待收货' },
  WAIT_REFUND: { color: 'purple', text: '退款处理中' },
  REFUNDED: { color: 'green', text: '已退款' },
  WAIT_RESHIP: { color: 'blue', text: '待发货' },
  FINISHED: { color: 'green', text: '已完成' },
  REJECTED: { color: 'red', text: '已拒绝' },
};

const STEP_CONFIG: Record<
  AfterSaleType,
  StepsProps['items']
> = {

  RETURN: [
    { title: '提交申请', icon: <SolutionOutlined /> },
    { title: '商家审核', icon: <ShopOutlined /> },
    { title: '寄回商品', icon: <CarOutlined /> },
    { title: '商家收货', icon: <CheckCircleOutlined /> },
    { title: '退款成功', icon: <PayCircleOutlined /> },
  ],
  EXCHANGE: [
    { title: '提交申请', icon: <SolutionOutlined /> },
    { title: '商家审核', icon: <ShopOutlined /> },
    { title: '寄回商品', icon: <CarOutlined /> },
    { title: '商家发货', icon: <CarOutlined /> },
    { title: '换货完成', icon: <CheckCircleOutlined /> },
  ],
  REFUND: [
    { title: '提交申请', icon: <SolutionOutlined /> },
    { title: '商家审核', icon: <ShopOutlined /> },
    { title: '退款成功', icon: <PayCircleOutlined /> },
  ],
>>>>>>> 216700b795fd1a029588d05c0920cc00111fa4c6
};

const STEP_INDEX_MAP: Record<
  AfterSaleType,
  Partial<Record<AfterSaleStatus, number>>
> = {
  RETURN: {
    APPLIED: 0,
    WAIT_SEND: 2,
    WAIT_RECEIVE: 3,
    REFUNDED: 4,
    REJECTED: 1,
  },
  EXCHANGE: {
    APPLIED: 0,
    WAIT_SEND: 2,
    WAIT_RESHIP: 3,
    FINISHED: 4,
    REJECTED: 1,
  },
  REFUND: {
    APPLIED: 0,
    WAIT_REFUND: 1,
    REFUNDED: 2,
    REJECTED: 1,
  },
};

/* ================= 4. 组件主体 ================= */

const AfterSale: React.FC = () => {
<<<<<<< HEAD
  const [comments, setComments] = useState<CommentDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
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

    fetchComments();
  }, []);

  return (
    <div className="p-6 bg-[#f5f5f5] min-h-[calc(90vh-120px)]">
      <h3 className="text-2xl font-bold mb-6 text-[#333]">我的吐槽</h3>

      {loading && <div className="text-gray-600">加载中...</div>}
      {error && !loading && <div className="text-red-500">加载失败：{error}</div>}
      {!loading && !error && comments.length === 0 && (
        <div className="text-gray-500">暂无吐槽记录</div>
      )}

      {!loading && !error && comments.length > 0 && (
        <div className="space-y-4 max-w-4xl mx-auto">
          {comments.map((comment) => (
            <details key={comment.id} className="group">
              <summary className="cursor-pointer list-none p-0">
                <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-[#333] mb-2 leading-tight">
                        订单 {comment.order.orderNo} - {comment.orderItem.productName}
                      </h4>
                      <div className="flex items-center gap-4 mb-2 text-sm text-gray-500">
                        <span>下单时间：{formatDate(comment.order.createdAt)}</span>
                        <span>吐槽时间：{formatDate(comment.createdAt)}</span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-md text-xs font-medium border ${getStatusStyle(comment.status)}`}
                      >
                        {getStatusText(comment.status)}
                      </span>
                    </div>
                    <button className="ml-4 p-2 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors [&[open]]:rotate-180">
                      查看详情
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </summary>
              <div className="mt-0 pt-4 pb-6 px-6 bg-gray-50 border-t border-gray-200">
                <p className="text-base text-gray-700 leading-relaxed mb-6">
                  {comment.content}
                </p>
                {comment.images && comment.images.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {comment.images.map((image) => (
                      <img
                        key={image.id}
                        src={image.image}
                        alt="吐槽附件"
                        className="w-24 h-24 object-cover rounded border border-gray-200"
                      />
                    ))}
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      )}
=======
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [list, setList] = useState<AfterSaleItem[]>(MOCK_DATA);

  const currentItem = list.find((i) => i.id === currentId);

  const handleCancel = (id: string) => {
    setList((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: 'REJECTED' } : i
      )
    );
    message.success('已撤销售后申请');
  };

  /* ================= 列表视图 ================= */

  const renderListView = () => {
    if (!list.length)
      return <Empty description="暂无售后记录" className="mt-20" />;

    return (
      <div className="space-y-4">
        {list.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-lg shadow-sm border"
          >
            <div className="flex justify-between mb-3">
              <span className="text-xs text-gray-500">
                服务单号：{item.id}
              </span>
              <Tag color={STATUS_TAG_MAP[item.status].color}>
                {STATUS_TAG_MAP[item.status].text}
              </Tag>
            </div>

            <div
              className="flex gap-4 cursor-pointer"
              onClick={() => {
                setCurrentId(item.id);
                setViewMode('detail');
                window.scrollTo(0, 0);
              }}
            >
              <img
                src={item.productImage}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-bold">{item.productName}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  {item.reason}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  申请时间：{item.applyTime}
                </p>
              </div>
            </div>

            {item.status === 'APPLIED' && (
              <div className="flex justify-end mt-4">
                <Popconfirm
                  title="确认撤销售后？"
                  onConfirm={() => handleCancel(item.id)}
                >
                  <Button danger icon={<DeleteOutlined />}>
                    撤销售后
                  </Button>
                </Popconfirm>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  /* ================= 详情视图 ================= */

  const renderDetailView = () => {
    if (!currentItem) return null;

    const steps = STEP_CONFIG[currentItem.type];
    const current =
      STEP_INDEX_MAP[currentItem.type][currentItem.status] ?? 0;

    const stepStatus =
      currentItem.status === 'REJECTED' ? 'error' : 'process';

    return (
      <>
        <Button
          icon={<LeftOutlined />}
          onClick={() => setViewMode('list')}
          className="mb-4"
        >
          返回列表
        </Button>

        <Card className="mb-4">
          <Steps
            items={steps}
            current={current}
            status={stepStatus}
          />

          <div
            className={`mt-4 p-4 rounded flex gap-3 ${
              currentItem.status === 'REJECTED'
                ? 'bg-red-50 text-red-600'
                : 'bg-blue-50 text-blue-600'
            }`}
          >
            {currentItem.status === 'REJECTED' ? (
              <CloseCircleOutlined />
            ) : (
              <SolutionOutlined />
            )}
            <div>
              <h4 className="font-bold">
                {STATUS_TAG_MAP[currentItem.status].text}
              </h4>
              {currentItem.rejectReason && (
                <p className="text-sm mt-1">
                  拒绝原因：{currentItem.rejectReason}
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card title="服务单信息">
          <Descriptions column={1} bordered>
            <Descriptions.Item label="服务单号">
              {currentItem.id}
            </Descriptions.Item>
            <Descriptions.Item label="申请时间">
              {currentItem.applyTime}
            </Descriptions.Item>
            <Descriptions.Item label="服务类型">
              {currentItem.type}
            </Descriptions.Item>
            <Descriptions.Item label="申请原因">
              {currentItem.reason}
            </Descriptions.Item>
            {currentItem.refund && (
              <Descriptions.Item label="申请退款金额">
                ¥{currentItem.refund.applyAmount}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>
      </>
    );
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h3 className="text-xl font-bold mb-4">我的售后</h3>
      {viewMode === 'list' ? renderListView() : renderDetailView()}
>>>>>>> 216700b795fd1a029588d05c0920cc00111fa4c6
    </div>
  );
};

export default AfterSale;
