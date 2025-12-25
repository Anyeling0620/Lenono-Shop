// CancelOrderModal.tsx
import React, { useState } from 'react';
import { Modal, Switch, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { cancelOrder } from '../../services/order';
import { addToShoppingCartService } from '../../services/products';
import globalErrorHandler from '../../utils/globalAxiosErrorHandler';
import toast from 'react-hot-toast';

interface CancelOrderModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void; // 修改：将 onConfirm 改为 onSuccess
  orderId: string;
  orderItems: Array<{
    configId: string;
    quantity: number;
    productName: string;
  }>;
}

const reasons = [
  "地址信息填写错误",
  "不想要了",
  "商品错选/多选",
  "商品降价",
  "没用/少用/错用优惠"
];

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  visible,
  onClose,
  onSuccess, // 接收 onSuccess
  orderId,
  orderItems = [],
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [returnToCart, setReturnToCart] = useState(false);

  const handleOk = async () => {
    if (!selectedReason) {
      message.warning('请选择取消原因');
      return;
    }

    try {
      setLoading(true);

      // 1. 先调用取消订单API
      await cancelOrder({
        orderId: orderId,
      });

      // 2. 如果选择了放回购物车，将商品加入购物车
      if (returnToCart && orderItems.length > 0) {
        try {
          // 将订单中的所有商品加入购物车
          const addToCartPromises = orderItems.map(item =>
            addToShoppingCartService(item.configId)
          );

          await Promise.all(addToCartPromises);
          message.success(`已将${orderItems.length}件商品放回购物车`);
        } catch (cartError) {
          globalErrorHandler.handle(cartError, toast.error);
          // 即使加入购物车失败，也继续执行取消订单逻辑
        }
      }

      // 3. 调用父组件的成功回调
      onSuccess(); // 调用 onSuccess 而不是 onConfirm

      message.success('订单已取消');
      resetForm();
    } catch (error) {
      globalErrorHandler.handle(error, toast.error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedReason('');
    setReturnToCart(false);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      title="选择取消原因"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      centered
      maskClosable={!loading}
      closable={!loading}
    >
      <div className="bg-[#fff7e8] p-3 text-xs text-[#ff6600] flex items-start gap-2 mb-4 rounded-sm">
        <ExclamationCircleOutlined className="mt-0.5" />
        <div>
          1.限时特价、预约资格等购买优惠可能一并取消<br />
          2.优惠券将可能不再返还，支付优惠一并取消<br />
          3.订单一旦取消，无法恢复
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {reasons.map(reason => (
          <button
            key={reason}
            onClick={() => setSelectedReason(reason)}
            disabled={loading}
            className={`py-3 px-4 text-sm border rounded-sm text-left transition-all ${selectedReason === reason
                ? 'border-[#e1140a] text-[#e1140a] bg-white ring-1 ring-[#e1140a]'
                : 'border-gray-200 text-gray-600 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
          >
            {reason}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-4 mb-6">
        <div>
          <span className="text-sm text-gray-600">点击提交后，将本单所有商品放回购物车。</span>
          {orderItems.length > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              共{orderItems.length}件商品
            </div>
          )}
        </div>
        <Switch
          size="small"
          checked={returnToCart}
          onChange={setReturnToCart}
          disabled={loading}
        />
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleCancel}
          disabled={loading}
          className="w-[120px] h-[36px] border border-[#e1140a] text-[#e1140a] rounded-sm hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          再想想要
        </button>
        <button
          onClick={handleOk}
          disabled={!selectedReason || loading}
          className={`w-[120px] h-[36px] rounded-sm text-white flex items-center justify-center ${selectedReason && !loading
              ? 'bg-[#e1140a] hover:bg-[#c91008]'
              : 'bg-gray-300 cursor-not-allowed'
            }`}
        >
          {loading ? '处理中...' : '提交'}
        </button>
      </div>
    </Modal>
  );
};

export default CancelOrderModal;
