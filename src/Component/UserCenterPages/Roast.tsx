import React from 'react';
import type { RoastItem, RoastStatus } from '../../types/roast';

const mockRoasts: RoastItem[] = [
  {
    id: 1,
    title: '物流速度太慢了',
    content: '下单三天还没发货，快递公司效率低下，希望优化物流！',
    rating: 2,
    status: 'pending',
    time: '2025-12-10',
    reply: '客服已联系快递公司，预计明天发货。感谢反馈！',
  },
  {
    id: 2,
    title: '客服回复不及时',
    content: '咨询问题等了半天没人回，体验很差。',
    rating: 1,
    status: 'replied',
    time: '2025-12-09',
    reply: '抱歉给您带来不便，我们会加强客服培训。',
  },
  {
    id: 3,
    title: '退货流程复杂',
    content: '退货需要很多步骤，能简化吗？',
    rating: 3,
    status: 'resolved',
    time: '2025-12-08',
    reply: '已优化退货流程，感谢建议！',
  },
];

const getStatusStyle = (status: RoastStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-orange-100 text-orange-800 border border-orange-200';
    case 'replied':
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'resolved':
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
};

const getStatusText = (status: RoastStatus) => {
  switch (status) {
    case 'pending':
      return '待处理';
    case 'replied':
      return '已回复';
    case 'resolved':
      return '已解决';
    default:
      return '未知';
  }
};

const Roast: React.FC = () => {
  return (
    <div className="p-6 bg-[#f5f5f5] min-h-[calc(90vh-120px)]">
      <h3 className="text-2xl font-bold mb-6 text-[#333]">我的吐槽</h3>
      <div className="space-y-4 max-w-4xl mx-auto">
        {mockRoasts.map((roast) => (
          <details key={roast.id} className="group">
            <summary className="cursor-pointer list-none p-0">
              <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-[#333] mb-2 leading-tight">
                      {roast.title}
                    </h4>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-base font-bold text-orange-500">
                        {roast.rating}.0 分
                      </span>
                      <span className="text-sm text-gray-500">{roast.time}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-md text-xs font-medium border capitalize ${getStatusStyle(roast.status)}`}>
                      {getStatusText(roast.status)}
                    </span>
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
                {roast.content}
              </p>
              {roast.reply && (
                <div className="bg-white p-6 rounded-lg border-l-4 border-blue-400 shadow-sm">
                  <h5 className="text-base font-semibold text-blue-900 mb-3">客服回复：</h5>
                  <p className="text-gray-700 leading-relaxed">{roast.reply}</p>
                </div>
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default Roast;
