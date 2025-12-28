import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Timeline,
  Image,
  message,
  Spin,
  Modal,
  Divider,
  Badge,
  List,
  Avatar
} from 'antd';
import {
  ExclamationCircleOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  TruckOutlined,
  RedoOutlined,
  MessageOutlined
} from '@ant-design/icons';
import type { AfterSaleDetail, ComplaintDetail } from '../types/afterSale';

import dayjs from 'dayjs';
import { afterSaleService } from '../services/afterSale';
import globalErrorHandler from '../utils/globalAxiosErrorHandler';
import toast from 'react-hot-toast';
import { getImageUrl } from '../utils/imageConfig';

const AfterSaleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<AfterSaleDetail | null>(null);
  const [cancelling, setCancelling] = useState(false);

  // 状态配置 - 联想红色主题
  const statusConfig: Record<string, { color: string; bgColor: string; icon: React.ReactNode }> = {
    '申请中': { color: '#ff6b35', bgColor: '#fff7e6', icon: <ClockCircleOutlined /> },
    '已同意': { color: '#52c41a', bgColor: '#f6ffed', icon: <CheckCircleOutlined /> },
    '已拒绝': { color: '#ff4d4f', bgColor: '#fff1f0', icon: <CloseCircleOutlined /> },
    '已寄出': { color: '#1890ff', bgColor: '#e6f7ff', icon: <TruckOutlined /> },
    '已寄回': { color: '#722ed1', bgColor: '#f9f0ff', icon: <SyncOutlined /> },
    '已退款': { color: '#13c2c2', bgColor: '#e6fffb', icon: <CheckCircleOutlined /> },
    '已完成': { color: '#fa8c16', bgColor: '#fff7e6', icon: <CheckCircleOutlined /> }
  };

  // 类型配置
  const typeConfig: Record<string, { color: string; text: string }> = {
    '退货': { color: '#ff4d4f', text: '退货' },
    '换货': { color: '#1890ff', text: '换货' },
    '维修': { color: '#52c41a', text: '维修' }
  };

  // 获取售后详情
  const fetchDetail = async () => {
    if (!id) {
      message.error('售后单号不存在');
      navigate('/after-sale');
      return;
    }

    try {
      setLoading(true);
      const data = await afterSaleService.getAfterSaleDetail(id);
      setDetail(data);
    } catch (error) {
      message.error('获取售后详情失败');
      console.error('获取售后详情失败:', error);
      navigate('/after-sale');
    } finally {
      setLoading(false);
    }
  };

  // 取消售后
  const handleCancelAfterSale = async () => {
    if (!detail) return;

    Modal.confirm({
      title: '确认取消售后？',
      icon: <ExclamationCircleOutlined />,
      content: '取消后无法恢复，请确认是否继续？',
      okText: '确认取消',
      cancelText: '再想想',
      okButtonProps: {
        style: { backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }
      },
      onOk: async () => {
        try {
          setCancelling(true);
          await afterSaleService.cancelAfterSale(detail.id);
          message.success('售后已取消');
          fetchDetail();
        } catch (error) {
         globalErrorHandler.handle(error,toast.error)
        } finally {
          setCancelling(false);
        }
      }
    });
  };

  // 投诉售后
  const handleComplaint = () => {
    if (!detail) return;
    
    navigate('/after-sale/complaint', {
      state: { afterSaleId: detail.id }
    });
  };
  // 重新申请
 const handleReapply = () => {
    if (!detail) return;
    
    navigate('/after-sale/apply', {
      state: {
        orderId: detail.orderId,
        orderItemId: detail.orderItemId
      }
    });
  };
  // 查看订单详情 - 修正路径
  const handleViewOrderDetail = () => {
    if (detail) {
      navigate(`/order-detail/${detail.orderId}`);
    }
  };



  // 获取时间线数据
  const getTimelineItems = () => {
    if (!detail) return [];

    const items = [
      {
        color: '#ff6b35',
        children: (
          <div className="text-sm">
            <div className="font-medium">售后申请提交</div>
            <div className="text-gray-500">
              {dayjs(detail.applyTime).format('YYYY-MM-DD HH:mm')}
            </div>
          </div>
        )
      }
    ];

    if (detail.status === '已同意') {
      items.push({
        color: '#52c41a',
        children: (
          <div className="text-sm">
            <div className="font-medium">商家已同意售后申请</div>
            <div className="text-gray-500">
              请按照商家提供的地址寄回商品
            </div>
          </div>
        )
      });
    }

    if (detail.status === '已拒绝') {
      items.push({
        color: '#ff4d4f',
        children: (
          <div className="text-sm">
            <div className="font-medium">售后申请被拒绝</div>
            <div className="text-gray-500">
              拒绝原因：{detail.rejectReason}
            </div>
          </div>
        )
      });
    }

    if (detail.status === '已寄出') {
      items.push({
        color: '#1890ff',
        children: (
          <div className="text-sm">
            <div className="font-medium">商家已寄出商品</div>
            <div className="text-gray-500">
              物流单号：{detail.merchantLogisticsNo || '暂无'}
            </div>
          </div>
        )
      });
    }

    if (detail.status === '已寄回') {
      items.push({
        color: '#722ed1',
        children: (
          <div className="text-sm">
            <div className="font-medium">您已寄回商品</div>
            <div className="text-gray-500">
              物流单号：{detail.afterSaleNo || '暂无'}
            </div>
          </div>
        )
      });
    }

    if (detail.status === '已退款') {
      items.push({
        color: '#13c2c2',
        children: (
          <div className="text-sm">
            <div className="font-medium">退款已完成</div>
            <div className="text-gray-500">
              退款金额：¥{detail.order.actualPayAmount.toFixed(2)}
            </div>
          </div>
        )
      });
    }

    if (detail.status === '已完成') {
      items.push({
        color: '#fa8c16',
        children: (
          <div className="text-sm">
            <div className="font-medium">售后已完成</div>
            <div className="text-gray-500">
              {dayjs(detail.completeTime).format('YYYY-MM-DD HH:mm')}
            </div>
          </div>
        )
      });
    }

    return items;
  };

  // 初始化加载
  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!detail) {
    return null;
  }

  const statusInfo = statusConfig[detail.status] || { color: 'default', bgColor: '#f5f5f5', icon: null };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="mx-auto " style={{ maxWidth: '1200px' }}>
        {/* 头部 */}
        <div className="mb-6">
         
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">售后详情</h1>
              <div className="flex items-center gap-3">
                <span className="text-gray-600 text-sm">售后单号: {detail.afterSaleNo}</span>
                <span className="text-gray-600 text-sm">
                  申请时间: {dayjs(detail.applyTime).format('YYYY-MM-DD HH:mm')}
                </span>
              </div>
            </div>
            <Tag
              style={{
                backgroundColor: statusInfo.bgColor,
                color: statusInfo.color,
                borderColor: statusInfo.color,
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
              icon={statusInfo.icon}
            >
              {detail.status}
            </Tag>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧主要信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 售后基本信息 */}
            <Card
              title={
                <div className="flex items-center gap-2">
                  <FileTextOutlined className="text-red-600" />
                  <span className="font-bold text-gray-900">售后信息</span>
                </div>
              }
              className="shadow-sm border-0"
              headStyle={{
                borderBottom: '2px solid #f0f0f0',
                padding: '16px 24px',
                fontSize: '16px'
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="售后类型" span={2}>
                  <Tag color={typeConfig[detail.type].color} className="font-medium">
                    {typeConfig[detail.type].text}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="申请原因" span={2}>
                  {detail.reason}
                </Descriptions.Item>
                {detail.remark && (
                  <Descriptions.Item label="补充说明" span={2}>
                    {detail.remark}
                  </Descriptions.Item>
                )}
                {detail.rejectReason && (
                  <Descriptions.Item label="拒绝原因" span={2}>
                    <span className="text-red-600">{detail.rejectReason}</span>
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="关联订单">
                  {detail.order.orderNo}
                </Descriptions.Item>
                <Descriptions.Item label="订单状态">
                  {detail.order.status}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 商品信息 */}
            <Card
              title={
                <div className="flex items-center gap-2">
                  <ShoppingOutlined className="text-red-600" />
                  <span className="font-bold text-gray-900">商品信息</span>
                </div>
              }
              className="shadow-sm border-0"
              headStyle={{
                borderBottom: '2px solid #f0f0f0',
                padding: '16px 24px',
                fontSize: '16px'
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <div className="flex gap-4">
                <div className="shrink-0">
                  <Image
                    width={120}
                    height={120}
                    src={getImageUrl(detail.orderItem.product?.mainImage)}
                    alt={detail.orderItem.productName}
                    className="object-cover rounded-lg border border-gray-200"
                    preview={false}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {detail.orderItem.productName}
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      规格：{detail.orderItem.configName}
                    </p>
                    <p className="text-gray-600">
                      数量：{detail.orderItem.quantity}
                    </p>
                    <p className="text-gray-600">
                      单价：¥{detail.orderItem.price.toFixed(2)}
                    </p>
                    <p className="text-lg font-bold text-red-600">
                      小计：¥{(detail.orderItem.price * detail.orderItem.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* 图片凭证 */}
            {detail.images && detail.images.length > 0 && (
              <Card
                title={
                  <div className="flex items-center gap-2">
                    <FileTextOutlined className="text-red-600" />
                    <span className="font-bold text-gray-900">凭证图片</span>
                  </div>
                }
                className="shadow-sm border-0"
                headStyle={{
                  borderBottom: '2px solid #f0f0f0',
                  padding: '16px 24px',
                  fontSize: '16px'
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {detail.images.map((image) => (
                    <div key={image.id} className="relative">
                      <Image
                        width="100%"
                        height={200}
                        src={getImageUrl(image.image)}
                        alt="凭证图片"
                        className="object-cover rounded-lg border border-gray-200"
                        preview={{
                          mask: '查看大图'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 投诉记录 */}
            {detail.complaints && detail.complaints.length > 0 && (
              <Card
                title={
                  <div className="flex items-center gap-2">
                    <MessageOutlined className="text-red-600" />
                    <span className="font-bold text-gray-900">投诉记录</span>
                    <Badge count={detail.complaints.length} color="#ff6b35" />
                  </div>
                }
                className="shadow-sm border-0"
                headStyle={{
                  borderBottom: '2px solid #f0f0f0',
                  padding: '16px 24px',
                  fontSize: '16px'
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <List
                  dataSource={detail.complaints}
                  renderItem={(complaint: ComplaintDetail) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={
                          <div className="flex justify-between">
                            <span className="font-medium">投诉记录</span>
                            <span className="text-sm text-gray-500">
                              {dayjs(complaint.createdAt).format('YYYY-MM-DD HH:mm')}
                            </span>
                          </div>
                        }
                        description={
                          <div>
                            <p className="text-gray-700 mb-2">{complaint.content}</p>
                            {complaint.images && complaint.images.length > 0 && (
                              <div className="flex gap-2 mt-2">
                                {complaint.images.slice(0, 3).map((img) => (
                                  <Image
                                    key={img.id}
                                    width={80}
                                    height={80}
                                    src={getImageUrl(img.image)}
                                    alt="投诉图片"
                                    className="object-cover rounded border border-gray-200"
                                    preview={{
                                      mask: '查看大图'
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            )}
          </div>

          {/* 右侧信息 */}
          <div className="space-y-6">
            {/* 收货地址 */}
            <Card
              title={
                <div className="flex items-center gap-2">
                  <HomeOutlined className="text-red-600" />
                  <span className="font-bold text-gray-900">收货地址</span>
                </div>
              }
              className="shadow-sm border-0"
              headStyle={{
                borderBottom: '2px solid #f0f0f0',
                padding: '16px 24px',
                fontSize: '16px'
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <UserOutlined className="text-gray-400 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500">收货人</div>
                    <div className="font-medium text-gray-900">{detail.receiverName}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <PhoneOutlined className="text-gray-400 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500">联系电话</div>
                    <div className="font-medium text-gray-900">{detail.receiverPhone}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <HomeOutlined className="text-gray-400 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500">收货地址</div>
                    <div className="font-medium text-gray-900">
                      {`${detail.receiverProvince}${detail.receiverCity}${detail.receiverArea}${detail.receiverStreet}${detail.receiverAddress}`}
                    </div>
                  </div>
                </div>
                              {detail.receiverRemark && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-100 rounded">
                    <div className="text-sm text-gray-500">地址备注</div>
                    <div className="text-sm text-gray-700">{detail.receiverRemark}</div>
                  </div>
                )}
              </div>
            </Card>

            {/* 进度时间线 */}
            <Card
              title={
                <div className="flex items-center gap-2">
                  <ClockCircleOutlined className="text-red-600" />
                  <span className="font-bold text-gray-900">处理进度</span>
                </div>
              }
              className="shadow-sm border-0"
              headStyle={{
                borderBottom: '2px solid #f0f0f0',
                padding: '16px 24px',
                fontSize: '16px'
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <Timeline
                items={getTimelineItems()}
                className="lenovo-timeline"
              />
            </Card>

            {/* 操作按钮 */}
            <Card
              title={
                <div className="flex items-center gap-2">
                  <SyncOutlined className="text-red-600" />
                  <span className="font-bold text-gray-900">操作</span>
                </div>
              }
              className="shadow-sm border-0"
              headStyle={{
                borderBottom: '2px solid #f0f0f0',
                padding: '16px 24px',
                fontSize: '16px'
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <div className="space-y-3">
                {/* 申请中状态 */}
                {detail.status === '申请中' && (
                  <Button
                    danger
                    block
                    loading={cancelling}
                    onClick={handleCancelAfterSale}
                    className="h-10 font-medium"
                  >
                    取消申请
                  </Button>
                )}

                {/* 已同意状态 */}
                {detail.status === '已同意' && (
                  <Button
                    type="primary"
                    block
                    onClick={() => {
                      // 填写物流单号逻辑
                      Modal.info({
                        title: '填写物流单号',
                        content: (
                          <div className="space-y-4">
                            <p>请将商品寄回至以下地址：</p>
                            <div className="p-3 bg-gray-50 rounded">
                              <p className="font-medium">{detail.receiverName} {detail.receiverPhone}</p>
                              <p className="text-sm text-gray-600">
                                {`${detail.receiverProvince}${detail.receiverCity}${detail.receiverArea}${detail.receiverStreet}${detail.receiverAddress}`}
                              </p>
                            </div>
                            <p className="text-sm text-gray-500">
                              寄回后请在此页面更新物流单号
                            </p>
                          </div>
                        ),
                        okText: '我知道了'
                      });
                    }}
                    className="h-10 font-medium"
                    style={{ backgroundColor: '#ff6b35', borderColor: '#ff6b35' }}
                  >
                    填写物流单号
                  </Button>
                )}

                {/* 已拒绝或已取消状态 */}
                {['已拒绝', '已取消'].includes(detail.status) && (
                  <Button
                    type="primary"
                    block
                    icon={<RedoOutlined />}
                    onClick={handleReapply}
                    className="h-10 font-medium"
                    style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
                  >
                    重新申请
                  </Button>
                )}

                {/* 已完成状态且未投诉过 */}
                {detail.status === '已完成' && 
                 (!detail.complaints || detail.complaints.length === 0) && (
                  <Button
                    block
                    onClick={handleComplaint}
                    className="h-10 font-medium border-gray-300 hover:border-red-500 hover:text-red-600"
                  >
                    投诉售后
                  </Button>
                )}

                {/* 查看订单详情 */}
                <Button
                  block
              onClick={handleViewOrderDetail}
                  className="h-10 font-medium border-gray-300 hover:border-red-500 hover:text-red-600"
                >
                  查看订单详情
                </Button>

                {/* 联系客服 */}
                <Button
                  block
                  type="dashed"
                  onClick={() => navigate('/customer-service')}
                  className="h-10 font-medium border-gray-300 hover:border-red-500 hover:text-red-600"
                >
                  联系客服
                </Button>
              </div>
            </Card>

            {/* 金额信息 */}
            <Card
              title={
                <div className="flex items-center gap-2">
                  <FileTextOutlined className="text-red-600" />
                  <span className="font-bold text-gray-900">金额信息</span>
                </div>
              }
              className="shadow-sm border-0"
              headStyle={{
                borderBottom: '2px solid #f0f0f0',
                padding: '16px 24px',
                fontSize: '16px'
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">商品金额</span>
                  <span className="font-medium">
                    ¥{(detail.orderItem.price * detail.orderItem.quantity).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">订单实付</span>
                  <span className="font-medium">
                    ¥{detail.order.actualPayAmount.toFixed(2)}
                  </span>
                </div>
                {detail.status === '已退款' && (
                  <>
                    <Divider className="my-2" />
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span className="text-red-600">预计退款</span>
                      <span className="text-red-600">
                        ¥{detail.order.actualPayAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      * 退款金额以实际到账为准，通常1-3个工作日到账
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* 重要提示 */}
            <Card
              className="shadow-sm border-0 border-red-200"
              headStyle={{
                borderBottom: '2px solid #f0f0f0',
                padding: '16px 24px',
                fontSize: '16px',
                backgroundColor: '#fff2f0'
              }}
              bodyStyle={{ padding: '16px 24px' }}
            >
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <ExclamationCircleOutlined className="text-red-500 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    请保持手机畅通，客服可能会与您联系
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <ExclamationCircleOutlined className="text-red-500 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    退货时请勿使用到付，否则可能被拒收
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <ExclamationCircleOutlined className="text-red-500 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    寄回商品请确保包装完好，配件齐全
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfterSaleDetailPage;
