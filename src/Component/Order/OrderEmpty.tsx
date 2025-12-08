//当列表为空时显示的界面
import React from 'react';
import { Link } from 'react-router-dom';
import { FileTextOutlined } from '@ant-design/icons';

const OrderEmpty: React.FC = () => {
  return (
    <div className="py-20 flex flex-col items-center justify-center bg-white">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-6">
        {/* 这里用图标代替截图里的图片，也可以换成 img */}
        <FileTextOutlined style={{ fontSize: '48px' }} />
      </div>
      <p className="text-gray-500 text-sm mb-6">您的订单空空如也，去商城逛逛吧~</p>
      <Link 
        to="/" 
        className="px-8 py-2 bg-[#e1140a] text-white rounded-sm hover:bg-[#c91008] transition-colors"
      >
        去逛逛
      </Link>
    </div>
  );
};

export default OrderEmpty;