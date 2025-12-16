import React from 'react';
import type { AfterSaleItem, AfterSaleStatus } from '../../types/afterSale';

const mockAfterSales: AfterSaleItem[] = [
  {
    id: 1,
    orderId: '#123456',
    productName: '联想小新 Air 14',
    reason: '质量问题',
    status: 'processing',
    time: '2025-12-10',
    details: '屏幕有划痕，申请退货。',
  },
  {
    id: 2,
    orderId: '#123457',
    productName: 'ThinkPad X1 Carbon',
    reason: '不想要了',
    status: 'completed',
    time: '2025-12-09',
    details: '已退款到账。',
  },
  {
    id: 3,
    orderId: '#123458',
    productName: '拯救者游戏本',
    reason: '物流损坏',
    status: 'rejected',
    time: '2025-12-08',
    details: '包装完好，建议自检。',
  },
];

const getStatusStyle = (status: AfterSaleStatus) => {
  switch (status) {
    case 'applying':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    case 'processing':
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'completed':
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 border border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
};

const getStatusText = (status: AfterSaleStatus) => {
  switch (status) {
    case 'applying':
      return '申请中';
    case 'processing':
      return '处理中';
    case 'completed':
      return '已完成';
    case 'rejected':
      return '已拒绝';
    default:
      return '未知';
  }
};

const AfterSale: React.FC = () => {
  return (
    <div className="p-6 bg-[#f5f5f5] min-h-[calc(90vh-120px)]">
      <h3 className="text-2xl font-bold mb-6 text-[#333]">我的售后</h3>
      <div className="space-y-4 max-w-4xl mx-auto">
        {mockAfterSales.map((item) => (
          <details key={item.id} className="group">
            <summary className="cursor-pointer list-none p-0">
              <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-[#333] mb-2 leading-tight">
                      订单 {item.orderId} - {item.productName}
                    </h4>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-sm text-gray-500 font-medium">原因: {item.reason}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-md text-xs font-medium border capitalize ${getStatusStyle(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                    <span className="text-sm text-gray-500 ml-4">{item.time}</span>
                  </div>
                  <button className="ml-4 p-2 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors [&[open]]:rotate-180">
                    查看详情
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </summary>
            <div className="mt-0 pt-4 pb-6 px-6 bg-gray-50 border-t border-gray-200">
              <p className="text-base text-gray-700 leading-relaxed mb-6">
                {item.details}
              </p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default AfterSale;
