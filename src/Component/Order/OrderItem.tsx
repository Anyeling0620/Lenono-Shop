/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { UserOutlined, MessageOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom'; 
import { Popover, message } from 'antd';
import CancelOrderModal from './CancelOrderModal';

interface OrderItemProps {
  order: any;
  onCancelSuccess: (id: string) => void;
  onTimeout: (id: string) => void; // 新增 prop 类型定义
}

const OrderItem: React.FC<OrderItemProps> = ({ order, onCancelSuccess, onTimeout }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  
  // 移除本地 isExpired 状态，直接依赖 order.status
  // const [isExpired, setIsExpired] = useState(false); 

  const navigate = useNavigate();

  // 倒计时逻辑
  useEffect(() => {
    // 如果订单状态已经不是 pending，则不需要倒计时
    if (order.status !== 'pending') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTimeLeft('');
        return;
    }

    const calculateTimeLeft = () => {
      const createTime = new Date(order.createTime).getTime();
      const expireTime = createTime + 24 * 60 * 60 * 1000; // 假设24小时过期
      const now = new Date().getTime();
      const diff = expireTime - now;

      if (diff <= 0) {
        // 超时了！调用父组件方法更新状态
        setTimeLeft('已超时'); 
        if (order.status === 'pending') {
            onTimeout(order.id);
        }
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${String(h).padStart(2, '0')}小时${String(m).padStart(2, '0')}分${String(s).padStart(2, '0')}秒`);
    };

    // 立即执行一次
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [order.createTime, order.status, order.id, onTimeout]);

  // 直接使用 props 中的 status，不再依赖本地 isExpired
  const currentStatus = order.status;

  // 再次购买
  const handleBuyAgain = () => {
    const productToAdd = {
      ...order.product,
      originalPrice: order.product.price, 
      coupon: 0 
    };
    addToCart(productToAdd, 1, order.product.spec);
    message.success('已加入购物车');
    navigate('/shopping-cart');
  };


  const handleDeleteOrder = () => {
    onCancelSuccess(order.id); 
  };

  const recipientContent = (
    <div className="w-[260px] text-xs">
      <div className="font-bold text-gray-800 mb-2 text-sm">{order.recipient.name}</div>
      <div className="text-gray-500 mb-1 leading-relaxed">{order.recipient.address}</div>
      <div className="text-[#e1140a]">{order.recipient.phone}</div>
    </div>
  );

  return (
    <div className="border border-gray-200 hover:border-gray-300 transition-colors bg-white">
      {/* 头部 */}
      <div className="bg-[#f5f5f5] px-4 py-2 text-xs text-gray-500 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <span className="font-mono">{order.createTime}</span>
          <span>订单号：{order.orderNo}</span>
        </div>
        <div className="flex items-center gap-4">
            <Link to="/service" className="flex items-center gap-1 cursor-pointer hover:text-[#e1140a] text-gray-500">
                <MessageOutlined /> <span>客服咨询</span>
            </Link>
            {/* 只有非 pending 状态才显示删除按钮 */}
            {(currentStatus === 'cancelled' || currentStatus === 'completed') && (
                <DeleteOutlined 
                    className="text-lg cursor-pointer hover:text-[#e1140a] transition-colors" 
                    title="删除订单"
                    onClick={handleDeleteOrder}
                />
            )}
        </div>
      </div>

      <div className="flex items-stretch py-5 text-sm text-[#333]">
        
        <div className="flex-1 px-4 border-r border-gray-100 flex gap-4 min-w-0">
           <Link to={`/product/${order.product.id}`} className="block w-[80px] h-[80px] border border-gray-200 shrink-0">
             <img src={order.product.image} alt={order.product.name} className="w-full h-full object-contain" />
           </Link>
           <div className="flex flex-col justify-center flex-1 min-w-0 gap-1">
              <Link to={`/product/${order.product.id}`} className="text-sm font-bold hover:text-[#e1140a] hover:underline line-clamp-2 leading-5 text-[#333]">
                 {order.product.name}
              </Link>
              <div className="text-xs text-gray-500 truncate" title={order.product.spec}>
                  {order.product.spec}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                  单价：<span className="text-[#333]">¥{order.product.price}</span>
              </div>
           </div>
           <div className="text-center w-[40px] text-gray-400 flex items-center justify-center">
              x{order.product.count}
           </div>
        </div>

        <div className="w-[120px] border-r border-gray-100 flex items-center justify-center">
          <Popover content={recipientContent} trigger="hover" placement="bottom">
             <div className="flex items-center gap-1 cursor-pointer text-gray-600 hover:text-[#e1140a]">
               <span>{order.recipient.name}</span>
               <UserOutlined />
             </div>
          </Popover>
        </div>

        <div className="w-[120px] border-r border-gray-100 flex flex-col items-center justify-center gap-1">
          <span className="text-xs text-gray-400">应付：</span>
          <span className="font-bold text-sm border-b border-gray-300 pb-1">¥{order.totalAmount}</span>
          <span className="text-xs text-gray-400">在线支付</span>
        </div>

        <div className="w-[120px] border-r border-gray-100 flex flex-col items-center justify-center gap-2">
           {currentStatus === 'pending' ? (
               <span className="font-bold text-[#e1140a]">待付款</span>
           ) : currentStatus === 'cancelled' ? (
               <span className="text-gray-500">已取消</span>
           ) : (
               <span className="text-gray-600">{order.statusText || order.status}</span>
           )}
           <Link to="/order-detail/123" className="text-xs text-gray-500 hover:text-[#e1140a] hover:underline">
             订单详情
           </Link>
        </div>

        {/* 操作列 */}
        <div className="w-[130px] flex flex-col items-center justify-center gap-2 px-3">
          {currentStatus === 'pending' ? (
             <>
               <div className="text-xs text-gray-500 scale-90 whitespace-nowrap">
                  剩余：<span className="font-mono">{timeLeft}</span>
               </div>
               <Link 
                 to={`/payment?orderId=${order.orderNo}`}
                 className="block w-full text-center py-1.5 bg-[#e1140a] text-white text-xs rounded-sm hover:bg-[#c91008] transition-colors"
               >
                 去支付
               </Link>
               <button 
                 className="text-xs text-gray-500 hover:text-[#e1140a]"
                 onClick={() => setIsModalOpen(true)}
               >
                 取消订单
               </button>
             </>
          ) : currentStatus === 'cancelled' ? (
             <button 
                onClick={handleBuyAgain}
                className="w-full py-1.5 border border-[#e1140a] text-[#e1140a] bg-white text-xs rounded-sm hover:bg-red-50 transition-colors"
             >
                再次购买
             </button>
          ) : null}
        </div>
      </div>

      <CancelOrderModal 
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false);
          onCancelSuccess(order.id);
        }}
      />
    </div>
  );
};

export default OrderItem;