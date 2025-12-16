import React, { useState } from 'react';
import { Pagination, message, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import OrderItem from './OrderItem';
import OrderEmpty from './OrderEmpty';

// 模拟数据
const allOrders = [
  {
    id: '1',
    createTime: '2025-12-16 12:44:33', // 这是一个未来的时间，处于待付款
    orderNo: '300181180',
    status: 'pending',
    statusText: '待付款',
    product: {
      id: 'p1',
      name: '联想拯救者R9000P 2025 AI元启',
      image: 'https://p3.lefile.cn/product/adminweb/2025/07/31/AdVDQpEwiqWmyKKm6cYfosJjw-7110.jpg',
      spec: 'AMD Ryzen 9 8945HX/Windows 11 家庭中文版/16英寸/32GB(16+16)/1T SSD/ RTX™ 5060 8GB独显/冰魄白',
      count: 1,
      price: 4199,
    },
    recipient: {
      name: 'ouc',
      phone: '111111111',
      address: '山东省青岛市黄岛区中国海洋大学西海岸校区',
    },
    totalAmount: 4199,
  },
  {
    id: '2',
    createTime: '2023-12-08 19:44:33', // 这是一个过去的时间，应该会立即超时
    orderNo: '300181181',
    status: 'pending',
    statusText: '待付款',
    product: {
      id: 'p1',
      name: '联想拯救者R9000P 2025 AI元启',
      image: 'https://p3.lefile.cn/product/adminweb/2025/07/31/AdVDQpEwiqWmyKKm6cYfosJjw-7110.jpg',
      spec: 'AMD Ryzen 9 8945HX/Windows 11 家庭中文版/16英寸/32GB(16+16)/1T SSD/ RTX™ 5060 8GB独显/冰魄白',
      count: 1,
      price: 4199,
    },
    recipient: { name: 'ouc', phone: '111111111', address: '山东省青岛市黄岛区中国海洋大学西海岸校区' },
    totalAmount: 4199,
  },
  {
    id: '3',
    createTime: '2025-12-08 19:44:33',
    orderNo: '300181182',
    status: 'pending',
    statusText: '待付款',
    product: {
      id: 'p1',
      name: '联想拯救者R9000P 2025 AI元启',
      image: 'https://p3.lefile.cn/product/adminweb/2025/07/31/AdVDQpEwiqWmyKKm6cYfosJjw-7110.jpg',
      spec: 'AMD Ryzen 9 8945HX/Windows 11 家庭中文版/16英寸/32GB(16+16)/1T SSD/ RTX™ 5060 8GB独显/冰魄白',
      count: 1,
      price: 4199,
    },
    recipient: { name: 'ouc', phone: '111111111', address: '山东省青岛市黄岛区中国海洋大学西海岸校区' },
    totalAmount: 4199,
  },
  {
    id: '4',
    createTime: '2025-12-08 19:44:33',
    orderNo: '300181183',
    status: 'pending',
    statusText: '待付款',
    product: {
      id: 'p1',
      name: '联想拯救者R9000P 2025 AI元启',
      image: 'https://p3.lefile.cn/product/adminweb/2025/07/31/AdVDQpEwiqWmyKKm6cYfosJjw-7110.jpg',
      spec: 'AMD Ryzen 9 8945HX/Windows 11 家庭中文版/16英寸/32GB(16+16)/1T SSD/ RTX™ 5060 8GB独显/冰魄白',
      count: 1,
      price: 4199,
    },
    recipient: { name: 'ouc', phone: '111111111', address: '山东省青岛市黄岛区中国海洋大学西海岸校区' },
    totalAmount: 4199,
  },
  {
    id: '5',
    createTime: '2025-12-08 19:44:33',
    orderNo: '300181184',
    status: 'pending',
    statusText: '待付款',
    product: {
      id: 'p1',
      name: '联想拯救者R9000P 2025 AI元启',
      image: 'https://p3.lefile.cn/product/adminweb/2025/07/31/AdVDQpEwiqWmyKKm6cYfosJjw-7110.jpg',
      spec: 'AMD Ryzen 9 8945HX/Windows 11 家庭中文版/16英寸/32GB(16+16)/1T SSD/ RTX™ 5060 8GB独显/冰魄白',
      count: 1,
      price: 4199,
    },
    recipient: { name: 'ouc', phone: '111111111', address: '山东省青岛市黄岛区中国海洋大学西海岸校区' },
    totalAmount: 4199,
  },
  {
    id: '6',
    createTime: '2025-12-08 19:44:33',
    orderNo: '300181185',
    status: 'pending',
    statusText: '待付款',
    product: {
      id: 'p1',
      name: '联想拯救者R9000P 2025 AI元启',
      image: 'https://p3.lefile.cn/product/adminweb/2025/07/31/AdVDQpEwiqWmyKKm6cYfosJjw-7110.jpg',
      spec: 'AMD Ryzen 9 8945HX/Windows 11 家庭中文版/16英寸/32GB(16+16)/1T SSD/ RTX™ 5060 8GB独显/冰魄白',
      count: 1,
      price: 4199,
    },
    recipient: { name: 'ouc', phone: '111111111', address: '山东省青岛市黄岛区中国海洋大学西海岸校区' },
    totalAmount: 4199,
  },
  {
    id: '7',
    createTime: '2025-12-08 19:44:33',
    orderNo: '300181186',
    status: 'pending',
    statusText: '待付款',
    product: {
      id: 'p1',
      name: '联想拯救者R9000P 2025 AI元启',
      image: 'https://p3.lefile.cn/product/adminweb/2025/07/31/AdVDQpEwiqWmyKKm6cYfosJjw-7110.jpg',
      spec: 'AMD Ryzen 9 8945HX/Windows 11 家庭中文版/16英寸/32GB(16+16)/1T SSD/ RTX™ 5060 8GB独显/冰魄白',
      count: 1,
      price: 4199,
    },
    recipient: { name: 'ouc', phone: '111111111', address: '山东省青岛市黄岛区中国海洋大学西海岸校区' },
    totalAmount: 4199,
  },
];

const OrderList: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all'); 
  const [orders, setOrders] = useState(allOrders); 
  const [keyword, setKeyword] = useState(''); 

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // --- 逻辑修改：取消订单 ---
  // 不直接删除数据，而是将状态改为 cancelled。
  // 这样 activeTab === 'pending' 时，它会被 filteredOrders 过滤掉，从而从“待付款”列表消失。
  const handleCancelOrder = (id: string) => {
    setOrders(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: 'cancelled', statusText: '已取消' };
      }
      return item;
    }));
    message.success('订单已取消');
  };

  // --- 逻辑修改：处理超时 ---
  // 当子组件检测到超时，调用此函数更新父组件状态
  const handleTimeout = (id: string) => {
    setOrders(prev => prev.map(item => {
      if (item.id === id && item.status === 'pending') {
        // 只有状态改变时才更新，避免死循环
        return { ...item, status: 'cancelled', statusText: '已取消' };
      }
      return item;
    }));
  };

  // Tabs 配置
  const tabs = [
    { key: 'all', label: '全部订单' },
    { key: 'pending', label: '待付款', count: orders.filter(o => o.status === 'pending').length },
    { key: 'shipping', label: '待发货', count: orders.filter(o => o.status === 'shipping').length },
    { key: 'receiving', label: '待收货', count: orders.filter(o => o.status === 'receiving').length },
  ];

  // --- Tab 切换 ---
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  // --- 搜索逻辑 ---
  const handleSearch = () => {
    const term = keyword.trim();
    if (!term) {
        // 搜索逻辑如果涉及到重新请求API则这里需要调整，这里仅针对前端模拟数据
        // 因为 orders 已经是 state，这里搜索应该基于原始数据 filter，或者我们假设 orders 就是当前展示数据
        // 简单起见，我们这里仅提示，实际应配合 useEffect 或请求重置 orders
        message.info('请输入搜索内容'); 
        return;
    }
    // 简单的本地过滤演示（实际通常是后端搜索）
    const filtered = allOrders.filter(o => {
       const matchOrderNo = o.orderNo.includes(term);
       const matchProductName = o.product.name.toLowerCase().includes(term.toLowerCase());
       return matchOrderNo || matchProductName;
    });
    setOrders(filtered);
    setCurrentPage(1);
  };

  // --- 核心筛选逻辑 ---
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  // 分页切片
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentShowOrders = filteredOrders.slice(startIndex, endIndex);

  const onPageChange = (page: number) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

return (
    <div className="bg-white min-h-[600px]">
      <style>{`
        .custom-square-pagination .ant-pagination-item,
        .custom-square-pagination .ant-pagination-prev .ant-pagination-item-link,
        .custom-square-pagination .ant-pagination-next .ant-pagination-item-link,
        .custom-square-pagination .ant-select-selector,
        .custom-square-pagination .ant-pagination-options-quick-jumper input {
          border-radius: 0 !important;
        }
          .custom-square-pagination .ant-pagination-options-size-changer {
          display: none !important;
        }
      `}</style>

      {/* 顶部栏 */}
      <div className="flex justify-between items-center border-b border-gray-200 px-2 mb-4">
        <div className="flex gap-8">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`relative py-4 text-sm font-medium transition-colors ${
                activeTab === tab.key ? 'text-[#e1140a] font-bold' : 'text-gray-600 hover:text-[#e1140a]'
              }`}
            >
              {tab.label}
              {tab.count ? (
                 <span className="absolute top-2 -right-3 bg-[#e1140a] text-white text-[10px] px-1.5 h-4 rounded-full flex items-center justify-center leading-none">
                   {tab.count}
                 </span>
              ) : null}
              {activeTab === tab.key && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#e1140a]" />}
            </button>
          ))}
        </div>

        <div className="py-2 flex items-center">
            <input 
               type="text"
               value={keyword}
               onChange={(e) => setKeyword(e.target.value)}
               placeholder="输入商品名称/订单编号"
               className="w-[240px] h-[32px] px-3 text-xs border border-r-0 border-gray-300 outline-none focus:border-gray-400 placeholder-gray-400 transition-colors"
               onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
               onClick={handleSearch}
               className="h-[32px] px-4 text-xs text-[#333] bg-[#f5f5f5] border border-gray-300 hover:bg-[#e8e8e8] transition-colors cursor-pointer"
            >
               搜索订单
            </button>
        </div>
      </div>

      {/* 表头 */}
      <div className="bg-[#f5f5f5] text-xs text-gray-600 py-3 px-4 flex text-center mb-4">
        <div className="flex-1 text-left pl-10">订单详情</div>
        <div className="w-[120px]">收货人</div>
        <div className="w-[120px]">金额</div>
        <div className="w-[120px]">状态</div>
        <div className="w-[120px]">操作</div>
      </div>

      {/* 列表内容 */}
      <div className="space-y-4 mb-8">
        {currentShowOrders.length > 0 ? (
          currentShowOrders.map(order => (
            <OrderItem 
              key={order.id} 
              order={order} 
              onCancelSuccess={handleCancelOrder} 
              onTimeout={handleTimeout} // 传递超时处理函数
            />
          ))
        ) : (
          <OrderEmpty />
        )}
      </div>

      {/* 分页 */}
      {filteredOrders.length > 0 && (
        <ConfigProvider locale={zhCN}>
            <div className="flex justify-center py-6 custom-square-pagination">
            <Pagination
                total={filteredOrders.length}
                current={currentPage}
                pageSize={pageSize}
                onChange={onPageChange}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `共 ${total} 条订单`}
                defaultPageSize={5}
            />
            </div>
        </ConfigProvider>
      )}
    </div>
  );
};

export default OrderList;