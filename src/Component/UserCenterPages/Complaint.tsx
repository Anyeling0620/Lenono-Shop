import React from 'react';
import type { RoastItem, RoastStatus } from '../../types/roast';

const mockComplaints: RoastItem[] = [
  {
    id: 1,
    title: '产品质量问题',
    content: '收到货有明显划痕，包装破损严重。',
    rating: 1,
    status: 'processing',
    time: '2025-12-11',
    reply: '已安排质检，确认问题后立即处理。',
  },
  {
    id: 2,
    title: '虚假宣传',
    content: '广告说24小时发货，实际一周才到。',
    rating: 2,
    status: 'replied',
    time: '2025-12-10',
    reply: '宣传有误，系统已优化，已补偿优惠券。',
  },
  {
    id: 3,
    title: '服务态度差',
    content: '客服不专业，解决问题推诿。',
    rating: 1,
    status: 'pending',
    time: '2025-12-09',
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

const Complaint: React.FC = () => {
  return (
    <div className="p-6 bg-[#f5f5f5] min-h-[calc(90vh-120px)]">
      <h3 className="text-2xl font-bold mb-6 text-[#333]">我的投诉</h3>
      <div className="space-y-4 max-w-4xl mx-auto">
        {mockComplaints.map((complaint) => (
          <details key={complaint.id} className="group">
            <summary className="cursor-pointer list-none p-0">
              <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-[#333] mb-2 leading-tight">
                      {complaint.title}
                    </h4>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-base font-bold text-orange-500">
                        {complaint.rating}.0 分
                      </span>
                      <span className="text-sm text-gray-500">{complaint.time}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-md text-xs font-medium border capitalize ${getStatusStyle(complaint.status)}`}>
                      {getStatusText(complaint.status)}
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
                {complaint.content}
              </p>
              {complaint.reply && (
                <div className="bg-white p-6 rounded-lg border-l-4 border-blue-400 shadow-sm">
                  <h5 className="text-base font-semibold text-blue-900 mb-3">客服回复：</h5>
                  <p className="text-gray-700 leading-relaxed">{complaint.reply}</p>
                </div>
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default Complaint;
