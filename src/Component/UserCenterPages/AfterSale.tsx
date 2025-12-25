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
    </div>
  );
};

export default AfterSale;
