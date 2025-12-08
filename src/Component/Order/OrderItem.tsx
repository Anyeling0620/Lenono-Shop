import React, { useState, useEffect } from 'react';
import { UserOutlined, MessageOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Popover } from 'antd';
import CancelOrderModal from './CancelOrderModal';

interface OrderItemProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  order: any;
  onCancelSuccess: (id: string) => void;
}

const OrderItem: React.FC<OrderItemProps> = ({ order, onCancelSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');


  useEffect(() => {
    if (order.status !== 'pending') return;
    const calculateTimeLeft = () => {
      const createTime = new Date(order.createTime).getTime();
      const expireTime = createTime + 24 * 60 * 60 * 1000;
      const now = new Date().getTime();
      const diff = expireTime - now;
      if (diff <= 0) {
        setTimeLeft('已过期');
        return;
      }
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${String(h).padStart(2, '0')}小时${String(m).padStart(2, '0')}分${String(s).padStart(2, '0')}秒`);
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [order.createTime, order.status]);

  const recipientContent = (
    <div className="w-[260px] text-xs">
      <div className="font-bold text-gray-800 mb-2 text-sm">{order.recipient.name}</div>
      <div className="text-gray-500 mb-1 leading-relaxed">{order.recipient.address}</div>
      <div className="text-[#e1140a]">{order.recipient.phone}</div>
    </div>
  );

  return (
    <div className="border border-gray-200 hover:border-gray-300 transition-colors bg-white">
      {/* 订单头部 */}
      <div className="bg-[#f5f5f5] px-4 py-2 text-xs text-gray-500 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <span className="font-mono">{order.createTime}</span>
          <span>订单号：{order.orderNo}</span>
        </div>
        <Link to="/service" className="flex items-center gap-1 cursor-pointer hover:text-[#e1140a] text-gray-500">
          <MessageOutlined /> <span>客服咨询</span>
        </Link>
      </div>

      <div className="flex items-stretch py-5 text-sm text-[#333]">
        
        {/* 商品详情区域 */}
        <div className="flex-1 px-4 border-r border-gray-100 flex gap-4 min-w-0">
           <Link to={`/product/${order.product.id}`} className="block w-[80px] h-[80px] border border-gray-200 shrink-0">
             <img src={order.product.image} alt={order.product.name} className="w-full h-full object-contain" />
           </Link>
           
           <div className="flex flex-col justify-center flex-1 min-w-0 gap-1">
              {/* 商品名称 */}
              <Link to={`/product/${order.product.id}`} className="text-sm font-bold hover:text-[#e1140a] hover:underline line-clamp-2 leading-5 text-[#333]">
                 {order.product.name}
              </Link>
              
              {/* 描述/规格：单行显示，超出省略 */}
              {/* truncate = overflow-hidden + text-ellipsis + whitespace-nowrap */}
              <div className="text-xs text-gray-500 truncate" title={order.product.spec}>
                  {order.product.spec}
              </div>

              {/* 价格 */}
              <div className="text-sm font-bold text-[#333] mt-0.5">
                  ¥{order.product.price}
              </div>
           </div>
           
           <div className="text-center w-[40px] text-gray-400 flex items-center justify-center">
              x{order.product.count}
           </div>
        </div>

        {/* 收货人 */}
        <div className="w-[120px] border-r border-gray-100 flex items-center justify-center">
          <Popover content={recipientContent} trigger="hover" placement="bottom">
             <div className="flex items-center gap-1 cursor-pointer text-gray-600 hover:text-[#e1140a]">
               <span>{order.recipient.name}</span>
               <UserOutlined />
             </div>
          </Popover>
        </div>

        {/* 金额 */}
        <div className="w-[120px] border-r border-gray-100 flex flex-col items-center justify-center gap-1">
          <span className="text-xs text-gray-400">应付：</span>
          <span className="font-bold text-sm border-b border-gray-300 pb-1">¥{order.totalAmount}</span>
          <span className="text-xs text-gray-400">在线支付</span>
        </div>

        {/* 状态 */}
        <div className="w-[120px] border-r border-gray-100 flex flex-col items-center justify-center gap-2">
           <span className={`font-bold ${order.status === 'pending' ? 'text-[#e1140a]' : 'text-gray-600'}`}>
             {order.status === 'pending' ? '待付款' : order.statusText}
           </span>
           <Link to="/order-detail/123" className="text-xs text-gray-500 hover:text-[#e1140a] hover:underline">
             订单详情
           </Link>
        </div>

        {/* 操作 */}
        <div className="w-[130px] flex flex-col items-center justify-center gap-2 px-3">
          {order.status === 'pending' && (
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
          )}
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