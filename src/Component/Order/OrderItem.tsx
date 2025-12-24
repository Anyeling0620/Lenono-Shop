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
import { deleteOrder } from '../../services/order';
import { addToShoppingCartService } from '../../services/products';
import type { SimpleOrderItem } from '../../types/order';

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
  const [timeLeft, setTimeLeft] = useState('');
  const navigate = useNavigate();

  // 倒计时逻辑
  useEffect(() => {
    if (order.status !== '待支付') {
      setTimeLeft('');
      return;
    }

    const calculateTimeLeft = () => {
      const createTime = new Date(order.createdAt).getTime();
      const expireTime = createTime + 24 * 60 * 60 * 1000;
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
      message.error('删除订单失败');
      console.error('删除订单失败:', error);
    }
  };

  // 再次购买
  const handleBuyAgain = async () => {
    try {
      const addToCartPromises = order.items.map(item => 
        addToShoppingCartService(item.id)
      );
      await Promise.all(addToCartPromises);
      message.success('已加入购物车');
      navigate('/shopping-cart');
    } catch (error) {
      message.error('加入购物车失败');
      console.error('加入购物车失败:', error);
    }
  };

  // 获取主商品信息
  const mainItem = order.items[0] || {};

  return (
    <div className="border border-gray-200 rounded-xl bg-white hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* 订单头部 - 联想风格 */}
      <div className="flex justify-between items-center px-6 py-2 bg-gradient-to-r from-gray-50 to-white border-b">
        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-600 font-medium">
            {new Date(order.createdAt).toLocaleDateString('zh-CN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          <span className="text-sm font-mono text-gray-800 bg-gray-100 px-3 py-1 rounded">
            订单号: {order.orderNo}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="/customer-service" 
            className="text-gray-600 hover:text-red-600 text-sm flex items-center gap-2 font-medium transition-colors"
          >
            <MessageOutlined />
            <span>联系客服</span>
          </Link>
          {(order.status === '已取消' || order.status === '已收货') && (
            <button
              onClick={handleDeleteOrder}
              className="text-gray-500 hover:text-red-600 cursor-pointer flex items-center gap-1 text-sm"
              title="删除订单"
            >
              <DeleteOutlined />
              <span>删除</span>
            </button>
          )}
        </div>
      </div>

      {/* 订单内容 */}
      <div className="p-6">
        <div className="flex gap-6">
          {/* 商品图片 */}
          <Link to={`/product/${mainItem.productId}`} target={mainItem.productId} className="shrink-0">
            <div className="relative">
              <Image
                width={100}
                height={100}
                src={mainItem.imageSnapshot}
                alt={mainItem.productName}
                className="rounded-lg border-2 border-gray-100 hover:border-red-300 transition-colors"
                fallback="https://via.placeholder.com/100"
                preview={false}
              />
              {order.items.length > 1 && (
                <div className="absolute -bottom-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
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
                  to={`/product/${mainItem.productId}`}
                  className="font-bold text-lg text-gray-900 hover:text-red-600 line-clamp-2 transition-colors"
                >
                  {mainItem.productName}
                </Link>
                <p className="text-sm text-gray-500 mt-2">
                  规格: {mainItem.config1} / {mainItem.config2}
                  {mainItem.config3 && ` / ${mainItem.config3}`}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-gray-700 font-medium">
                    单价: <span className="text-red-600">¥{mainItem.priceSnapshot}</span>
                  </span>
                  <span className="text-gray-400">×</span>
                  <span className="text-gray-700 font-medium">{mainItem.quantity}</span>
                </div>
              </div>
              
              {/* 订单状态和金额 */}
              <div className="w-56 shrink-0 text-right">
                <div className="mb-3">
                  <Tag 
                    color={statusColors[order.status] || 'default'}
                    className="px-3 py-1 rounded-full font-bold text-sm"
                    style={{ 
                      backgroundColor: statusColors[order.status] + '15',
                      color: statusColors[order.status],
                      borderColor: statusColors[order.status]
                    }}
                  >
                    {order.status}
                  </Tag>
                </div>
                <div className="text-2xl font-bold text-red-600 mb-2">
                  ¥{order.actualPayAmount.toFixed(2)}
                </div>
                <Link 
                  to={`/order-detail/${order.id}`}
                  className="text-red-600 hover:text-red-700 text-sm font-medium inline-flex items-center gap-1"
                >
                  查看详情
                  <RightOutlined className="text-xs" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 - 联想风格 */}
        <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
          {order.status === '待支付' && (
            <>
              <div className="flex items-center gap-2 text-sm text-orange-600 mr-auto bg-orange-50 px-4 py-2 rounded-lg">
                <ClockCircleOutlined />
                <span className="font-medium">剩余支付时间: {timeLeft}</span>
              </div>
              <Button 
                type="primary"
                onClick={() => navigate(`/payment?orderId=${order.orderNo}`)}
                className=""
                                style={{ 
                  backgroundColor: '#ff6b35',
                  borderColor: '#ff6b35',
                  height: '40px',
                  padding: '0 24px',
                  fontWeight: 'bold'
                }}
              >
                立即支付
              </Button>
              <Button 
                danger
                onClick={() => setIsModalOpen(true)}
                className="h-10 px-6 font-medium"
                style={{ borderColor: '#ff4d4f' }}
              >
                取消订单
              </Button>
            </>
          )}

          {order.status === '已发货' && (
            <Button 
              type="primary"
              onClick={() => navigate(`/order-detail/${order.id}`)}
              className="h-10 px-6 font-medium"
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
              className="h-10 px-6 font-medium border-gray-300 hover:border-red-500 hover:text-red-600"
            >
              评价商品
            </Button>
          )}

          {order.status === '已取消' && (
            <Button 
              onClick={handleBuyAgain}
              className="h-10 px-6 font-medium bg-red-600 text-white hover:bg-red-700 border-red-600"
            >
              再次购买
            </Button>
          )}

          {order.status === '待收货' && (
            <Button 
              type="primary"
              onClick={() => navigate(`/order-detail/${order.id}`)}
              className="h-10 px-6 font-medium"
              style={{ 
                backgroundColor: '#52c41a',
                borderColor: '#52c41a'
              }}
            >
              确认收货
            </Button>
          )}
        </div>
      </div>

      {/* 取消订单模态框 */}
      <CancelOrderModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderId={order.id}
        orderItems={order.items.map(item => ({
          configId: item.id,
          quantity: item.quantity,
          productName: item.productName
        }))}
        onSuccess={() => {
          onOrderCancelled(order.id);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default OrderItem;

