import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Tag, Image, message } from 'antd';
import {
  MessageOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  RightOutlined
} from '@ant-design/icons';
import CancelOrderModal from './CancelOrderModal';
import { confirmReceipt, deleteOrder } from '../../services/order';
import { addToShoppingCartService } from '../../services/products';
import type { SimpleOrderItem, OrderResponse } from '../../types/order';
import globalErrorHandler from '../../utils/globalAxiosErrorHandler';
import toast from 'react-hot-toast';

interface OrderItemProps {
  order: SimpleOrderItem;
  onOrderDeleted: (orderId: string) => void;
  onOrderCancelled: (orderId: string) => void;
}

const OrderItem: React.FC<OrderItemProps> = ({ 
  order, 
  onOrderDeleted, 
  onOrderCancelled 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const navigate = useNavigate();

  // 倒计时逻辑
  useEffect(() => {
    if (order.status !== '待支付') {
      return;
    }

    const calculateTimeLeft = () => {
      const createTime = new Date(order.createdAt).getTime();
      const expireTime = createTime + 30 * 60 * 1000;
      const now = new Date().getTime();
      const diff = expireTime - now;

      if (diff <= 0) {
        setTimeLeft('已超时');
        onOrderCancelled(order.id);
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${h}小时${m}分${s}秒`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [order.createdAt, order.status, order.id, onOrderCancelled]);

  // 状态颜色映射 - 联想主题色
  const statusColors: Record<string, string> = {
    '待支付': '#ff6b35', // 橙色
    '已支付': '#1890ff', // 蓝色
    '待发货': '#722ed1', // 紫色
    '已发货': '#13c2c2', // 青色
    '待收货': '#52c41a', // 绿色
    '已收货': '#52c41a', // 绿色
    '已取消': '#ff4d4f'  // 红色
  };

  // 删除订单
  const handleDeleteOrder = async () => {
    try {
      await deleteOrder(order.id);
      message.success('订单已删除');
      onOrderDeleted(order.id);
    } catch (error) {
     globalErrorHandler.handle(error,toast.error)
    }
  };
  // 添加确认收货处理函数
const handleConfirmReceipt = async () => {
  if (order.status !== '待收货') {
    message.warning('当前订单状态不可确认收货');
    return;
  }

  setConfirmLoading(true);
  try {
    await confirmReceipt({ orderId: order.id });
    message.success('确认收货成功！');
    onOrderCancelled(order.id); // 更新订单状态
  } catch (error) {
    globalErrorHandler.handle(error, toast.error);
    message.error('确认收货失败');
  } finally {
    setConfirmLoading(false);
  }
};

  // 再次购买
  const handleBuyAgain = async () => {
    try {
      const addToCartPromises = order.items.map(item => 
        addToShoppingCartService(item.id)
      );
      await Promise.all(addToCartPromises);
      navigate('/shopping-cart')
    } catch (error) {
      globalErrorHandler.handle(error,toast.error)
    }
  };

// 处理支付跳转
const handlePayment = async () => {
  if (order.status !== '待支付') {
    message.warning('当前订单状态不可支付');
    return;
  }

  setPaymentLoading(true);
  try {
    // 直接使用当前组件的 order 数据构建 OrderResponse
    // 因为支付页面主要需要订单基本信息，这些在当前组件中基本都有
    const orderResponse: OrderResponse = {
      orderId: order.id,
      orderNo: order.orderNo,
      payAmount: order.payAmount,
      actualPayAmount: order.actualPayAmount,
      status: order.status,
      items: order.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        config1: item.config1,
        config2: item.config2,
        config3: item.config3,
        quantity: item.quantity,
        price: item.priceSnapshot, // 使用 priceSnapshot 作为 price
        discount: 0, // 默认折扣为0
        payAmount: item.payAmountSnapshot // 使用 payAmountSnapshot 作为 payAmount
      })),
      createdAt: order.createdAt,
      payLimitTime: new Date(new Date(order.createdAt).getTime() + 30 * 60 * 1000).toISOString()
    };
    
    // 导航到支付页面，传递构建好的 OrderResponse
    navigate(`/order/payment`, {
      replace: true,
      state: orderResponse
    });
  } catch (error) {
    globalErrorHandler.handle(error, toast.error);
    message.error('准备支付数据失败');
  } finally {
    setPaymentLoading(false);
  }
};

  // 获取主商品信息
  const mainItem = order.items[0] || {};

  // 处理取消订单成功
  const handleCancelSuccess = () => {
    onOrderCancelled(order.id);
    setIsModalOpen(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* 订单头部 - 紧凑版 */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-600">
            {new Date(order.createdAt).toLocaleDateString('zh-CN', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          <span className="text-xs font-mono text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
            订单号: {order.orderNo}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to="/customer-service" 
            className="text-gray-500 hover:text-red-600 text-xs flex items-center gap-1"
          >
            <MessageOutlined className="text-xs" />
            <span>客服</span>
          </Link>
          {(order.status === '已取消' || order.status === '已收货') && (
            <button
              onClick={handleDeleteOrder}
              className="text-gray-400 hover:text-red-600 cursor-pointer flex items-center gap-1 text-xs"
              title="删除订单"
            >
              <DeleteOutlined className="text-xs" />
              <span>删除</span>
            </button>
          )}
        </div>
      </div>

      {/* 订单内容 - 紧凑版 */}
      <div className="p-4">
        <div className="flex gap-4">
          {/* 商品图片 */}
          <Link to={`/product/${mainItem.productId}`} target={mainItem.productId}  className="shrink-0">
            <div className="relative">
              <Image
                width={80}
                height={80}
                src={mainItem.imageSnapshot}
                alt={mainItem.productName}
                className="rounded border border-gray-200 hover:border-red-300 transition-colors"
                fallback="https://via.placeholder.com/80"
                preview={false}
              />
              {order.items.length > 1 && (
                <div className="absolute -bottom-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  +{order.items.length - 1}
                </div>
              )}
            </div>
          </Link>

          {/* 商品信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <Link 
                  to={`/product/${mainItem.productId}`}  target={mainItem.productId}
                  className="font-semibold text-gray-900 hover:text-red-600 line-clamp-2 text-sm transition-colors"
                >
                  {mainItem.productName}
                </Link>
                <p className="text-xs text-gray-500 mt-1">
                  规格: {mainItem.config1} / {mainItem.config2}
                  {mainItem.config3 && ` / ${mainItem.config3}`}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-gray-700 text-sm">
                    单价: <span className="text-red-600">¥{mainItem.priceSnapshot}</span>
                  </span>
                  <span className="text-gray-400">×</span>
                  <span className="text-gray-700 text-sm">{mainItem.quantity}</span>
                </div>
              </div>
              
              {/* 订单状态和金额 */}
              <div className="w-40 shrink-0 text-right">
                <div className="mb-2">
                  <Tag 
                    color={statusColors[order.status] || 'default'}
                    className="px-2 py-0.5 rounded-full font-medium text-xs"
                    style={{ 
                      backgroundColor: statusColors[order.status] + '15',
                      color: statusColors[order.status],
                      borderColor: statusColors[order.status]
                    }}
                  >
                    {order.status}
                  </Tag>
                </div>
                <div className="text-lg font-bold text-red-600 mb-1">
                  ¥{order.actualPayAmount.toFixed(2)}
                </div>
                <Link 
                  to={`/order-detail/${order.id}`}
                  className="text-red-600 hover:text-red-700 text-xs font-medium inline-flex items-center gap-0.5"
                >
                  查看详情
                  <RightOutlined className="text-xs" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 - 紧凑版，按钮位置调换 */}
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
          {order.status === '待支付' && (
            <>
              <div className="flex items-center gap-1 text-xs text-orange-600 mr-auto bg-orange-50 px-3 py-1.5 rounded">
                <ClockCircleOutlined className="text-xs" />
                <span className="font-medium">剩余: {timeLeft}</span>
              </div>
              <Button 
                danger
                onClick={() => setIsModalOpen(true)}
                className="h-8 px-4 font-medium text-xs"
                style={{ borderColor: '#ff4d4f' }}
              >
                取消订单
              </Button>
              <Button 
                type="primary"
                onClick={handlePayment}
                loading={paymentLoading}
                className="h-8 px-4 font-medium text-xs"
                style={{ 
                  backgroundColor: '#ff6b35',
                  borderColor: '#ff6b35',
                  fontWeight: 'bold'
                }}
              >
                {paymentLoading ? '加载中...' : '立即支付'}
              </Button>
            </>
          )}

          {order.status === '已发货' && (
            <Button 
              type="primary"
              onClick={() => navigate(`/order-detail/${order.id}`)}
              className="h-8 px-4 font-medium text-xs"
              style={{ 
                backgroundColor: '#1890ff',
                borderColor: '#1890ff'
              }}
            >
              查看物流
            </Button>
          )}

          {order.status === '已收货' && (
            <Button 
              onClick={() => navigate(`/order-detail/${order.id}`)}
              className="h-8 px-4 font-medium text-xs border-gray-300 hover:border-red-500 hover:text-red-600"
            >
              评价商品
            </Button>
          )}

          {order.status === '已取消' && (
            <Button 
              onClick={handleBuyAgain}
              className="h-8 px-4 font-medium text-xs bg-red-600 text-white hover:bg-red-700 border-red-600"
            >
              再次购买
            </Button>
          )}

          {order.status === '待收货' && (
           <Button 
      type="primary"
      onClick={handleConfirmReceipt}
      loading={confirmLoading}
      className="h-8 px-4 font-medium text-xs"
      style={{ 
        backgroundColor: '#52c41a',
        borderColor: '#52c41a'
      }}
    >
      {confirmLoading ? '处理中...' : '确认收货'}
    </Button>
          )}
        </div>
      </div>

      {/* 取消订单模态框 - 修复通信 */}
      <CancelOrderModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCancelSuccess} // 传递正确的回调函数
        orderId={order.id}
        orderItems={order.items.map(item => ({
          configId: item.id,
          quantity: item.quantity,
          productName: item.productName
        }))}
      />
    </div>
  );
};

export default OrderItem;
