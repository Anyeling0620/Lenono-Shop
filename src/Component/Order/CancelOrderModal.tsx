//“取消订单”后弹出的窗口
import React, { useState } from 'react';
import { Modal, Switch, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface CancelOrderModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const reasons = [
  "地址信息填写错误",
  "不想要了",
  "商品错选/多选",
  "商品降价",
  "没用/少用/错用优惠"
];

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({ visible, onClose, onConfirm }) => {
  const [selectedReason, setSelectedReason] = useState<string>('');

  const handleOk = () => {
    if (!selectedReason) {
      message.warning('请选择取消原因');
      return;
    }
    onConfirm();
    setSelectedReason(''); // 重置
  };

  return (
    <Modal
      title="选择取消原因"
      open={visible}
      onCancel={onClose}
      footer={null} // 自定义底部按钮
      width={600}
      centered
    >
      <div className="bg-[#fff7e8] p-3 text-xs text-[#ff6600] flex items-start gap-2 mb-4 rounded-sm">
        <ExclamationCircleOutlined className="mt-0.5" />
        <div>
          1.限时特价、预约资格等购买优惠可能一并取消 2.优惠券将可能不再返还，支付优惠一并取消 3.订单一旦取消，无法恢复
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {reasons.map(reason => (
          <button
            key={reason}
            onClick={() => setSelectedReason(reason)}
            className={`py-3 px-4 text-sm border rounded-sm text-left transition-all ${
              selectedReason === reason 
                ? 'border-[#e1140a] text-[#e1140a] bg-white ring-1 ring-[#e1140a]' 
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {reason}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-4 mb-6">
        <span className="text-sm text-gray-600">点击提交后，将本单所有商品放回购物车。</span>
        <Switch size="small" />
      </div>

      <div className="flex justify-center gap-4">
        <button 
          onClick={onClose}
          className="w-[120px] h-[36px] border border-[#e1140a] text-[#e1140a] rounded-sm hover:bg-red-50"
        >
          再想想要
        </button>
        <button 
          onClick={handleOk}
          disabled={!selectedReason}
          className={`w-[120px] h-[36px] rounded-sm text-white ${
            selectedReason ? 'bg-[#e1140a] hover:bg-[#c91008]' : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          提交
        </button>
      </div>
    </Modal>
  );
};

export default CancelOrderModal;