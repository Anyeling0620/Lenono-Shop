import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import {
  Card,
  Tag,
  Image,
  Typography,
  Button,
  Spin,
  Empty,
  Tooltip,
  Popconfirm
} from 'antd';
import {
  DownOutlined,
  UpOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  CalendarOutlined,
  EyeOutlined,
  DeleteOutlined,
  RollbackOutlined
} from '@ant-design/icons';
import { deleteComplaint, getComplaints } from '../../services/afterSale';
import type {
  ComplaintDetail,
  ComplaintStatus,
} from '../../types/afterSale';
import globalErrorHandler from '../../utils/globalAxiosErrorHandler';

const { Paragraph } = Typography;




const AFTERSALE_TYPE_CONFIG: Record<string, { color: string; bgColor: string }> = {
  退货: { color: '#fa541c', bgColor: '#fff2e8' },
  换货: { color: '#1890ff', bgColor: '#e6f7ff' },
  维修: { color: '#722ed1', bgColor: '#f9f0ff' },
  退款: { color: '#13c2c2', bgColor: '#e6fffb' }
};



const getAfterSaleTypeStyle = (type: string) =>
  AFTERSALE_TYPE_CONFIG[type] ?? {
    color: '#8c8c8c',
    bgColor: '#fafafa'
  };

const formatDateTime = (value?: Date | string) => {
  if (!value) return '--';
  return dayjs(value).format('MM-DD HH:mm');
};

const formatDate = (value?: Date | string) => {
  if (!value) return '--';
  const date = dayjs(value);
  const now = dayjs();
  const diffDays = now.diff(date, 'day');

  if (diffDays === 0) {
    return '今天 ' + date.format('HH:mm');
  } else if (diffDays === 1) {
    return '昨天 ' + date.format('HH:mm');
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else {
    return date.format('MM-DD');
  }
};

const formatCurrency = (value?: number | string) => {
  const amount = Number(value);
  if (Number.isFinite(amount)) {
    return `¥${amount.toFixed(2)}`;
  }
  return value ?? '--';
};



const Complaint: React.FC = () => {
  const [complaints, setComplaints] = useState<ComplaintDetail[]>([]);
  const [loading, setLoading] = useState(false);

  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const data = await getComplaints();
        setComplaints(data);
      } catch (error) {
        globalErrorHandler.handle(error, toast.error)
        toast.error('获取投诉列表失败，已使用模拟数据');
      } finally {
        setLoading(false);
      }
    };

    void fetchComplaints();
  }, []);

  const onExpand = (id: string) => {
    setExpandedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteComplaint(id);
      toast.success('删除成功');
      setComplaints(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('删除投诉失败', error);
      toast.error('删除失败，请重试');
    }
  };

  const handleWithdraw = async (id: string) => {
    try {
      // await withdrawComplaint(id);
      toast.success('撤回成功');
      // 更新投诉状态为"撤回"
      setComplaints(prev => prev.map(item =>
        item.id === id ? { ...item, status: '撤回' as ComplaintStatus } : item
      ));
    } catch (error) {
      console.error('撤回投诉失败', error);
      toast.error('撤回失败，请重试');
    }
  };



  if (loading) {
    return (
      <div className=" bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-40">
            <Spin size="large" tip="加载中..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 紧凑标题 */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-red-100 rounded-lg">
                <ExclamationCircleOutlined className="text-lg text-red-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">我的投诉</h1>
              <span className="text-sm text-gray-500 ml-2">({complaints.length})</span>
            </div>
          </div>
        </div>

        {/* 投诉列表 */}
        {complaints.length === 0 ? (
          <Card className="shadow-sm border border-gray-200 rounded-lg">
            <Empty
              className="py-12"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="text-center">
                  <p className="text-gray-600 mb-2 text-sm">暂无投诉记录</p>
                  <p className="text-gray-400 text-xs mb-4">您还没有提交过任何投诉</p>
                 
                </div>
              }
            />
          </Card>
        ) : (
          <div className={`h-[650px] overflow-y-auto pr-[6px] pb-2
                [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar-track]:rounded-xl
                [&::-webkit-scrollbar-track]:bg-gray-100
                [&::-webkit-scrollbar-thumb]:rounded-xl
                [&::-webkit-scrollbar-thumb]:bg-gray-300
                [&::-webkit-scrollbar-thumb:hover]:bg-gray-400
                [&::-webkit-scrollbar-button]:hidden
            `}>
            <div className="space-y-3">
              {complaints.map((complaint) => {
                const id = complaint.id;
                const isExpanded = expandedKeys.has(id);
                const afterSale = complaint.afterSale;
                const typeStyle = getAfterSaleTypeStyle(afterSale.type);

                if (complaint.status !== '正常') return

                return (
                  <Card
                    key={id}
                    className={`shadow-sm border border-gray-200 rounded-lg transition-all duration-200 hover:shadow ${isExpanded ? 'border-red-200' : ''
                      }`}
                    bodyStyle={{ padding: 0 }}
                    size="small"
                  >
                    {/* 紧凑头部 */}
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-3">
                        {/* 左侧信息 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Tag
                              style={{
                                color: typeStyle.color,
                                backgroundColor: typeStyle.bgColor,
                                borderColor: typeStyle.color,
                                fontSize: '11px',
                                height: '20px',
                                lineHeight: '18px'
                              }}
                            >
                              {afterSale.type}
                            </Tag>
                            <span className="text-xs text-gray-500">售后单号: {afterSale.afterSaleNo}</span>
                          </div>

                          <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                            {afterSale.orderItem.productName}
                          </h3>

                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                            <span className="flex items-center gap-1">
                              <ShoppingOutlined className="text-xs" />
                              订单: {afterSale.order.orderNo}
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarOutlined className="text-xs" />
                              {formatDate(complaint.createdAt)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-red-600">
                              {formatCurrency(afterSale.order.actualPayAmount)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {afterSale.orderItem.quantity}件
                            </span>
                          </div>
                        </div>

                        {/* 右侧状态和操作 */}
                        <div className="flex flex-col items-end gap-2">

                          <div className="flex items-center gap-1">
                            <Tooltip title={isExpanded ? "收起详情" : "查看详情"}>
                              <Button
                                type="text"
                                size="small"
                                icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
                                onClick={() => onExpand(id)}
                                className="text-gray-500 hover:text-red-600 h-6 w-6 p-0"
                              />
                            </Tooltip>

                            <Popconfirm
                              title="确认撤回"
                              description="确定要撤回这条投诉吗？撤回后投诉将不再有效"
                              onConfirm={() => handleWithdraw(complaint.id)}
                              onCancel={() => { }}
                              okText="确定"
                              cancelText="取消"
                              okButtonProps={{ type: 'primary' }}
                            >
                              <Tooltip title="撤回投诉">
                                <Button
                                  type="text"
                                  size="small"
                                  icon={<RollbackOutlined />}
                                  className="text-gray-500 hover:text-orange-600 h-6 w-6 p-0"
                                />
                              </Tooltip>
                            </Popconfirm>

                            <Popconfirm
                              title="确认删除"
                              description="确定要删除这条投诉吗？删除后不可恢复"
                              onConfirm={() => handleDelete(complaint.id)}
                              onCancel={() => { }}
                              okText="确定"
                              cancelText="取消"
                              okButtonProps={{ danger: true }}
                            >
                              <Tooltip title="删除投诉">
                                <Button
                                  type="text"
                                  size="small"
                                  icon={<DeleteOutlined />}
                                  className="text-gray-500 hover:text-red-600 h-6 w-6 p-0"
                                />
                              </Tooltip>
                            </Popconfirm>

                          </div>
                        </div>
                      </div>

                      {/* 投诉内容预览 */}
                      <div className="mt-2">
                        <div className="flex items-start gap-1">
                          <FileTextOutlined className="text-gray-400 text-xs mt-0.5" />
                          <Paragraph
                            className="text-gray-600 text-xs leading-relaxed m-0 line-clamp-2"
                          >
                            {complaint.content}
                          </Paragraph>
                        </div>
                      </div>
                    </div>

                    {/* 紧凑详情区域 */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-gray-50 animate-fadeIn">
                        <div className="p-3">
                          {/* 投诉详情 */}
                          <div className="mb-3">
                            <div className="flex items-center gap-1 mb-2">
                              <ExclamationCircleOutlined className="text-red-500 text-xs" />
                              <span className="text-xs font-medium text-gray-700">投诉详情</span>
                            </div>
                            <div className="bg-white rounded p-3 border border-gray-200">
                              <Paragraph className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap m-0">
                                {complaint.content}
                              </Paragraph>
                            </div>
                          </div>

                          {/* 投诉图片 */}
                          {complaint.images && complaint.images.length > 0 && (
                            <div className="mb-3">
                              <div className="flex items-center gap-1 mb-2">
                                <EyeOutlined className="text-blue-500 text-xs" />
                                <span className="text-xs font-medium text-gray-700">
                                  投诉图片 ({complaint.images.length}张)
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                {complaint.images.map((imgInfo, index) => (
                                  <div
                                    key={imgInfo.id}
                                    className="relative aspect-square rounded overflow-hidden border border-gray-200 bg-gray-100"
                                  >
                                    <Image
                                      src={imgInfo.image}
                                      alt={`投诉图片 ${index + 1}`}
                                      width="100%"
                                      height="100%"
                                      className="object-cover"
                                      preview={{
                                        mask: <EyeOutlined className="text-white text-xs" />
                                      }}
                                    />
                                    <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1 rounded">
                                      {index + 1}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 售后信息 */}
                          <div className="mb-3">
                            <div className="flex items-center gap-1 mb-2">
                              <ShoppingOutlined className="text-green-500 text-xs" />
                              <span className="text-xs font-medium text-gray-700">售后信息</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-white rounded p-2 border border-gray-200">
                                <div className="text-xs text-gray-500 mb-1">售后状态</div>
                                <div className="text-sm text-gray-900 font-medium">{afterSale.status}</div>
                              </div>
                              <div className="bg-white rounded p-2 border border-gray-200">
                                <div className="text-xs text-gray-500 mb-1">申请时间</div>
                                <div className="text-sm text-gray-900">{formatDateTime(afterSale.applyTime)}</div>
                              </div>
                            </div>
                          </div>

                          {/* 商品信息 */}
                          <div className="mb-3">
                            <div className="flex items-center gap-1 mb-2">
                              <ShoppingOutlined className="text-purple-500 text-xs" />
                              <span className="text-xs font-medium text-gray-700">商品信息</span>
                            </div>
                            <div className="bg-white rounded p-3 border border-gray-200">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="text-sm text-gray-900 font-medium mb-1">
                                    {afterSale.orderItem.productName}
                                  </div>
                                  <div className="text-xs text-gray-500 mb-1">
                                    配置: {afterSale.orderItem.configName}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    数量: {afterSale.orderItem.quantity}件
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-base font-bold text-red-600">
                                    {formatCurrency(afterSale.orderItem.price)}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    小计: {formatCurrency(afterSale.orderItem.price * afterSale.orderItem.quantity)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 订单信息 */}
                          <div>
                            <div className="flex items-center gap-1 mb-2">
                              <CalendarOutlined className="text-orange-500 text-xs" />
                              <span className="text-xs font-medium text-gray-700">订单信息</span>
                            </div>
                            <div className="bg-white rounded p-3 border border-gray-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-sm text-gray-900 font-medium mb-1">
                                    订单号: {afterSale.order.orderNo}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    订单状态: {afterSale.order.status}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-base font-bold text-gray-900">
                                    实付: {formatCurrency(afterSale.order.actualPayAmount)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
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

export default Complaint;
