import React, { useState, useEffect, useCallback } from 'react';
import { Pagination, message, Spin, Input, Tabs } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import OrderItem from './OrderItem';
import OrderEmpty from './OrderEmpty';
import type { OrderStatus, SimpleOrderItem, OrderListQuery } from '../../types/order';
import { getOrderList, getOrderStats } from '../../services/order';

const OrderList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [orders, setOrders] = useState<SimpleOrderItem[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<SimpleOrderItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalCount: 0,
    pendingPaymentCount: 0,
    pendingShipmentCount: 0,
    pendingReceiptCount: 0,
    completedCount: 0,
    cancelledCount: 0
  });

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  // 获取订单列表
  const fetchOrders = useCallback(async (status?: OrderStatus) => {
    try {
      setLoading(true);
      const query: OrderListQuery = {};
      if (status) {
        query.status = status;
      }
      
      const response = await getOrderList(query);
      setOrders(response.data || []);
      setFilteredOrders(response.data || []);
    } catch (error) {
      message.error('获取订单列表失败');
      console.error('获取订单列表失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 获取订单统计
  const fetchOrderStats = useCallback(async () => {
    try {
      const response = await getOrderStats();
      setStats(response);
    } catch (error) {
      console.error('获取订单统计失败:', error);
    }
  }, []);

  // 初始化加载
  useEffect(() => {
    fetchOrders();
    fetchOrderStats();
  }, [fetchOrders, fetchOrderStats]);

  // Tab切换处理
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setCurrentPage(1);
    if (key === 'all') {
      fetchOrders();
    } else {
      fetchOrders(key as OrderStatus);
    }
  };

  // 搜索处理
  const handleSearch = useCallback(() => {
    const term = keyword.trim().toLowerCase();
    if (!term) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter(order => {
      const matchOrderNo = order.orderNo.toLowerCase().includes(term);
      const matchProductName = order.items.some(item => 
        item.productName.toLowerCase().includes(term)
      );
      return matchOrderNo || matchProductName;
    });

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [keyword, orders]);

  // 删除订单后的回调
  const handleOrderDeleted = useCallback((orderId: string) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
    setFilteredOrders(prev => prev.filter(order => order.id !== orderId));
    fetchOrderStats(); // 重新获取统计
  }, [fetchOrderStats]);

  // 取消订单后的回调
  const handleOrderCancelled = useCallback((orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: '已取消' } : order
    ));
    setFilteredOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: '已取消' } : order
    ));
    fetchOrderStats(); // 重新获取统计
  }, [fetchOrderStats]);

  // 分页处理
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Tab配置
  const tabItems = [
    {
      key: 'all',
      label: `全部订单`,
      count: stats.totalCount
    },
    {
      key: '待支付',
      label: '待付款',
      count: stats.pendingPaymentCount
    },
    {
      key: '待发货',
      label: '待发货',
      count: stats.pendingShipmentCount
    },
    {
      key: '待收货',
      label: '待收货',
      count: stats.pendingReceiptCount
    },
    {
      key: '已收货',
      label: '已完成',
      count: stats.completedCount
    },
    {
      key: '已取消',
      label: '已取消',
      count: stats.cancelledCount
    }
  ];

  return (
    <div className="bg-white min-h-[600px] p-4 mx-auto" style={{ maxWidth: '1200px' }}>
      {/* 页面标题区域 - 紧凑版 */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">我的订单</h1>
            <div className="h-1 w-16 bg-red-600 rounded-full"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-56">
              <Input
                placeholder="搜索订单号或商品"
                prefix={<SearchOutlined className="text-gray-500 text-xs" />}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onPressEnter={handleSearch}
                allowClear
                className="rounded-lg h-9 text-sm"
                size="middle"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
            >
              搜索
            </button>
          </div>
        </div>
        <p className="text-gray-600 text-sm mt-1">查看和管理您的所有订单</p>
      </div>

      {/* 标签页 - 紧凑版 */}
      <div className="mb-3 relative">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          className="lenovo-tabs"
          items={tabItems.map(tab => ({
            key: tab.key,
            label: (
              <div className="flex items-center gap-1 px-3 py-1">
                <span className="font-medium text-gray-800 text-sm">{tab.label}</span>
                {tab.count > 0 && (
                  <span className="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full font-bold min-w-5 h-5 flex items-center justify-center">
                    {tab.count}
                  </span>
                )}
              </div>
            )
          }))}
          tabBarStyle={{ 
            borderBottom: '1px solid #f0f0f0',
            marginBottom: '16px'
          }}
        />
      </div>

      {/* 订单列表 */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {paginatedOrders.length > 0 ? (
            <div className="space-y-3">
              {paginatedOrders.map(order => (
                <OrderItem
                  key={order.id}
                  order={order}
                  onOrderDeleted={handleOrderDeleted}
                  onOrderCancelled={handleOrderCancelled}
                />
              ))}
            </div>
          ) : (
            <OrderEmpty />
          )}

          {/* 分页 - 紧凑版 */}
          {filteredOrders.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                current={currentPage}
                total={filteredOrders.length}
                pageSize={pageSize}
                onChange={setCurrentPage}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) => 
                  <span className="text-gray-600 text-sm">
                    第 <span className="font-bold text-red-600">{range[0]}</span>-<span className="font-bold text-red-600">{range[1]}</span> 条，共 <span className="font-bold text-red-600">{total}</span> 条
                  </span>
                }
                className="lenovo-pagination"
                itemRender={(page, type, originalElement) => {
                  if (type === 'page') {
                    return (
                      <span className={`px-2 py-1 rounded text-sm ${currentPage === page ? 'bg-red-600 text-white' : 'text-gray-700 hover:text-red-600'}`}>
                        {page}
                      </span>
                    );
                  }
                  return originalElement;
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderList;
