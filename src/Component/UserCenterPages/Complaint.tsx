import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { getComplaints } from '../../services/afterSale';
import type {
  ComplaintDetail,
  ComplaintStatus,
  AfterSaleStatus,
  AfterSaleType,
  OrderStatus
} from '../../types/afterSale';

type StatusKey = ComplaintStatus | string;

const STATUS_CONFIG: Record<StatusKey, { label: string; className: string }> = {
  正常: { label: '正常', className: 'bg-blue-100 text-blue-800 border border-blue-200' },
  撤回: { label: '撤回', className: 'bg-gray-100 text-gray-800 border border-gray-200' },
  用户删除: { label: '用户删除', className: 'bg-red-100 text-red-800 border border-red-200' }
};

const getStatusDisplay = (status: StatusKey) =>
  STATUS_CONFIG[status] ?? {
    label: status || '未知状态',
    className: 'bg-gray-100 text-gray-800 border border-gray-200'
  };

const formatDateTime = (value?: Date | string) => {
  if (!value) return '--';
  return dayjs(value).format('YYYY-MM-DD HH:mm');
};

const formatCurrency = (value?: number | string) => {
  const amount = Number(value);
  if (Number.isFinite(amount)) {
    return `¥${amount.toFixed(2)}`;
  }
  return value ?? '--';
};

const MOCK_COMPLAINTS: ComplaintDetail[] = [
  {
    id: 'mock-1',
    userId: 'mock-user',
    afterSaleId: 'mock-after-1',
    content: '示例投诉：收到的键盘有按键失灵。',
    status: '正常' as ComplaintStatus,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [],
    afterSale: {
      id: 'after-1',
      afterSaleNo: 'AS202501010001',
      type: '退货' as AfterSaleType,
      status: '申请中' as AfterSaleStatus,
      reason: '质量问题',
      applyTime: new Date(),
      order: {
        id: 'order-1',
        orderNo: 'ORD123456',
        status: '已支付' as OrderStatus,
        actualPayAmount: 1999
      },
      orderItem: {
        id: 'orderItem-1',
        productName: '机械键盘',
        configName: '红轴 RGB',
        quantity: 1,
        price: 1999,
        productId: 'prod-1',
        configId: 'cfg-1'
      }
    }
  },
  {
    id: 'mock-2',
    userId: 'mock-user',
    afterSaleId: 'mock-after-2',
    content: '示例投诉：物流多日未更新，无法联系到客服。',
    status: '撤回' as ComplaintStatus,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      {
        id: 'img-1',
        image: 'https://placehold.co/96x96/e2e8f0/1e293b?text=Proof'
      }
    ],
    afterSale: {
      id: 'after-2',
      afterSaleNo: 'AS202501020002',
      type: '换货' as AfterSaleType,
      status: '已同意' as AfterSaleStatus,
      reason: '物流异常',
      applyTime: new Date(),
      order: {
        id: 'order-2',
        orderNo: 'ORD654321',
        status: '待发货' as OrderStatus,
        actualPayAmount: 899
      },
      orderItem: {
        id: 'orderItem-2',
        productName: '蓝牙耳机',
        configName: '曜石黑',
        quantity: 1,
        price: 899,
        productId: 'prod-2',
        configId: 'cfg-2'
      }
    }
  }
];

const Complaint: React.FC = () => {
  const [complaints, setComplaints] = useState<ComplaintDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getComplaints();
        if (data && data.length > 0) {
          setComplaints(data);
        } else {
          setError('暂无接口数据，已展示模拟数据');
          setComplaints(MOCK_COMPLAINTS);
        }
      } catch (error) {
        console.error('获取投诉列表失败', error);
        setError('获取投诉列表失败，已展示模拟数据');
        setComplaints(MOCK_COMPLAINTS);
        toast.error('获取投诉列表失败，已使用模拟数据');
      } finally {
        setLoading(false);
      }
    };

    void fetchComplaints();
  }, []);

  return (
    <div className="p-6 bg-[#f5f5f5] min-h-[calc(90vh-120px)]">
      <h3 className="text-2xl font-bold mb-6 text-[#333]">我的投诉</h3>

      <div className="max-w-4xl mx-auto space-y-4">
        {loading && (
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 text-gray-500">
            加载中...
          </div>
        )}

        {!loading && error && (
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && complaints.length === 0 && (
          <div className="bg-white shadow-sm rounded-lg p-10 border border-dashed border-gray-300 text-center text-gray-500">
            暂无投诉记录
          </div>
        )}

        {!loading &&
          complaints.length > 0 &&
          complaints.map((complaint) => {
            const badge = getStatusDisplay(complaint.status);
            const afterSale = complaint.afterSale;

            return (
              <details key={complaint.id} className="group">
                <summary className="cursor-pointer list-none p-0">
                  <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-[#333] mb-2 leading-tight">
                          售后单 {afterSale.afterSaleNo}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <span>订单 {afterSale.order.orderNo}</span>
                          <span>类型：{afterSale.type}</span>
                          <span>投诉时间：{formatDateTime(complaint.createdAt)}</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-md text-xs font-medium border ${badge.className}`}>
                        {badge.label}
                      </div>
                    </div>
                  </div>
                </summary>

                <div className="mt-0 pt-4 pb-6 px-6 bg-gray-50 border-t border-gray-200 space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">投诉内容</div>
                    <p className="text-base text-gray-700 leading-relaxed">{complaint.content}</p>
                  </div>

                  {complaint.images && complaint.images.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-500 mb-2">附图</div>
                      <div className="flex flex-wrap gap-3">
                        {complaint.images.map((img) => (
                          <img
                            key={img.id}
                            src={img.image}
                            alt="complaint"
                            className="w-24 h-24 object-cover rounded border border-gray-200"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-sm text-gray-500 mb-1">售后类型</div>
                      <div className="text-gray-900 font-medium">{afterSale.type}</div>
                      <div className="text-sm text-gray-500 mt-2">售后状态</div>
                      <div className="text-gray-900">{afterSale.status}</div>
                      <div className="text-sm text-gray-500 mt-2">申请时间</div>
                      <div className="text-gray-900">{formatDateTime(afterSale.applyTime)}</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-sm text-gray-500 mb-1">订单信息</div>
                      <div className="text-gray-900 font-medium">{formatCurrency(afterSale.order.actualPayAmount)}</div>
                      <div className="text-sm text-gray-500 mt-2">商品</div>
                      <div className="text-gray-900">{afterSale.orderItem.productName}</div>
                      <div className="text-sm text-gray-500 mt-1">{afterSale.orderItem.configName}</div>
                      <div className="text-sm text-gray-500 mt-1">数量：{afterSale.orderItem.quantity}</div>
                    </div>
                  </div>
                </div>
              </details>
            );
          })}
      </div>
    </div>
  );
};

export default Complaint;
