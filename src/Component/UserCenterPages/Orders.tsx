import { useState, useEffect, useCallback } from 'react';
import { Tabs, Card, Button, Tag, Input, Spin, Empty, Divider, Image, Badge, Modal } from 'antd';
import { SearchOutlined, DeleteOutlined, ShoppingOutlined, ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance, type ApiResponse } from '../../services/AxiosService';
import type { CreateAfterSaleDto, CreateAfterSaleResponse } from '../../types/afterSale';
import type { OrderListItem, OrderListQuery, OrderListResponse, OrderStats, OrderStatus } from '../../types/order';



// ========== 2. 类型定义 (严格同步 uploaded:order.ts) ==========

// // 更新 OrderStatus 枚举为中文
// export type OrderStatus =
//   | '待支付'
//   | '已支付'
//   | '待发货'
//   | '已发货'
//   | '待收货'
//   | '已收货'
//   | '已取消';

// // 对应 OrderItemSummary
// export interface OrderItemSummary {
//   id: string;
//   productId: string;
//   productName: string;
//   config1: string;
//   config2: string;
//   config3?: string;
//   quantity: number;
//   priceSnapshot: number;
//   payAmountSnapshot: number;
//   imageSnapshot?: string;
//   seckill: boolean;
// }

// // 对应 OrderListItem (列表项)
// export interface OrderListItem {
//   id: string;
//   orderNo: string;
//   status: OrderStatus;
//   payAmount: number;
//   actualPayAmount: number;
//   createdAt: Date | string; 
//   payTime?: Date | string;
//   items: OrderItemSummary[];
// }

// // 对应 OrderStats
// export interface OrderStats {
//   totalCount: number;
//   pendingPaymentCount: number;
//   pendingShipmentCount: number;
//   pendingReceiptCount: number;
//   completedCount: number;
//   cancelledCount: number;
//   totalAmount: number;
// }

// // 对应 OrderListQuery (并补充前端分页参数)
// export interface OrderListQuery {
//   status?: OrderStatus;
//   startDate?: string;
//   endDate?: string;
//   keyword?: string;
//   page?: number;     
//   pageSize?: number;
// }

// // 对应 OrderListResponse
// export interface OrderListResponse {
//   total: number;
//   data: OrderListItem[];
// }

// 对应 CancelOrderInput
interface CancelOrderInput {
  orderId: string;
  // 注意：Types文件中定义只有 orderId，这里前端可能需要 reason，但调用时需符合接口
  reason?: string; 
}


// ========== 3. 真实 API 服务函数 (适配新类型) ==========

/**
 * 获取订单列表
 */
// eslint-disable-next-line react-refresh/only-export-components
export async function getOrderList(params: OrderListQuery): Promise<OrderListResponse> {
    try {
        const res = await axiosInstance.get<ApiResponse<OrderListResponse>>("/order/list/query", {
            params
        });
        // 适配 uploaded:order.ts 中的 OrderListResponse { total, data }
        const data = res.data.data;
        if (!data) return { total: 0, data: [] };
        // 兼容性处理：如果后端直接返回数组
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (Array.isArray(data)) return { total: data.length, data: data as any };
        return data;
    } catch (error) {
        console.error("API Error: getOrderList", error);
        throw error; 
    }
}

/**
 * 获取订单统计信息
 */
// eslint-disable-next-line react-refresh/only-export-components
export async function getOrderStats(): Promise<OrderStats> {
    try {
        const res = await axiosInstance.get<ApiResponse<OrderStats>>("/order/stats");
        return res.data.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        // 返回默认空统计
        return { 
            totalCount: 0, 
            pendingPaymentCount: 0, 
            pendingShipmentCount: 0, 
            pendingReceiptCount: 0, 
            completedCount: 0, 
            cancelledCount: 0, 
            totalAmount: 0 
        };
    }
}

/**
 * 取消订单
 */
// eslint-disable-next-line react-refresh/only-export-components
export async function cancelOrder(params: CancelOrderInput): Promise<void> {
    await axiosInstance.post<ApiResponse<void>>("/order/cancel", params);
}

/**
 * 删除订单
 */
// eslint-disable-next-line react-refresh/only-export-components
export async function deleteOrder(orderId: string) {
    return (await axiosInstance.delete<ApiResponse<number>>(`/order/delete-order/${orderId}`)).data.data;
}

/**
 * 确认收货
 */
// eslint-disable-next-line react-refresh/only-export-components
export async function confirmReceipt(orderId: string) {
    return (await axiosInstance.post<ApiResponse<unknown>>('/order/confirm-receipt', { orderId })).data.data;
}

/**
 * 申请售后
 */
// eslint-disable-next-line react-refresh/only-export-components
export async function createAfterSale(
  params: Omit<CreateAfterSaleDto, 'images'> & { imageFiles?: File[] }
): Promise<CreateAfterSaleResponse> {
  const formData = new FormData();
  formData.append('orderId', params.orderId);
  formData.append('orderItemId', params.orderItemId);
  formData.append('type', params.type);
  formData.append('reason', params.reason);
  if (params.remark) {
    formData.append('remark', params.remark);
  }
  if (params.imageFiles && params.imageFiles.length > 0) {
    params.imageFiles.forEach((file) => {
      formData.append('images', file);
    });
  }
  return (await axiosInstance.post<ApiResponse<CreateAfterSaleResponse>>(
    "/after-sale/apply", 
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )).data.data;
}

// ========== 4. 状态配置 (适配中文枚举) ==========

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    '待支付': { label: '待付款', color: 'red' },
    '已支付': { label: '已支付', color: 'blue' },
    '待发货': { label: '待发货', color: 'blue' }, 
    '已发货': { label: '待收货', color: 'orange' },
    '待收货': { label: '待收货', color: 'orange' }, // 兼容可能的别名
    '已收货': { label: '已完成', color: 'green' },
    '已取消': { label: '已取消', color: 'default' },
};

// Tab Key -> 后端中文状态映射
const TAB_TO_STATUS_MAP: Record<string, OrderStatus | undefined> = {
    'all': undefined,
    'pending': '待支付',
    'paid': '待发货', // 假设 "Paid" tab 显示待发货
    'shipped': '待收货', // 假设 "Shipped" tab 显示已发货/待收货
    'completed': '已收货',
    'cancelled': '已取消',
    'afterSales': undefined // 如果后端支持 '售后中' 状态可添加
};

// ========== 5. 组件实现 ==========

const Orders = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState<OrderListItem[]>([]);
    const [stats, setStats] = useState<OrderStats | null>(null);
    const [activeTab, setActiveTab] = useState<string>('all');
    const [searchText, setSearchText] = useState('');

    // 弹窗状态管理
    const [cancelModal, setCancelModal] = useState<{ open: boolean; orderId: string | null }>({
        open: false, orderId: null
    });
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; orderId: string | null }>({
        open: false, orderId: null
    });
    const [confirmModal, setConfirmModal] = useState<{ open: boolean; orderId: string | null }>({
        open: false, orderId: null
    });

    // 获取统计数据
    const fetchStats = useCallback(async () => {
        try {
            const data = await getOrderStats();
            setStats(data);
        } catch (e) { console.error(e); }
    }, []);

    // 获取订单列表
    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const statusParam = TAB_TO_STATUS_MAP[activeTab];
            
            const queryParams: OrderListQuery = {
                keyword: searchText || undefined,
                status: statusParam,
            };

            const res = await getOrderList(queryParams);
            // 适配 OrderListResponse { total, data }
            setOrders(res.data || []);
            fetchStats();
        } catch (error) {
            console.error('获取订单列表失败:', error);
        } finally {
            setLoading(false);
        }
    }, [activeTab, searchText, fetchStats]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);


    const showCancelModal = (id: string) => setCancelModal({ open: true, orderId: id });
    const hideCancelModal = () => setCancelModal({ open: false, orderId: null });
    const confirmCancelOrder = async () => {
        if (!cancelModal.orderId) return;
        try {
            await cancelOrder({ orderId: cancelModal.orderId, reason: '用户主动取消' });
            toast.success('订单已取消');
            fetchOrders(); 
        } catch (error) {
            console.error(error);
            toast.error('取消订单失败');
        } finally {
            hideCancelModal();
        }
    };

    const showDeleteModal = (id: string) => setDeleteModal({ open: true, orderId: id });
    const hideDeleteModal = () => setDeleteModal({ open: false, orderId: null });
    const confirmDeleteOrder = async () => {
        if (!deleteModal.orderId) return;
        try {
            await deleteOrder(deleteModal.orderId);
            toast.success('订单记录已删除');
            setOrders(prev => prev.filter(o => o.id !== deleteModal.orderId));
            fetchStats();
        } catch (error) {
            console.error(error);
            toast.error('删除订单失败');
        } finally {
            hideDeleteModal();
        }
    };

    const showConfirmModal = (id: string) => setConfirmModal({ open: true, orderId: id });
    const hideConfirmModal = () => setConfirmModal({ open: false, orderId: null });
    const confirmReceiveOrder = async () => {
        if (!confirmModal.orderId) return;
        try {
            await confirmReceipt(confirmModal.orderId);
            toast.success('确认收货成功');
            fetchOrders(); 
        } catch (error) {
            console.error(error);
            toast.error('操作失败');
        } finally {
            hideConfirmModal();
        }
    };

    const handlePay = (order: OrderListItem) => {
        navigate(`/pay?orderId=${order.id}&amount=${order.actualPayAmount}`);
    };

    const handleApplyAfterSale = (order: OrderListItem) => {
        navigate(`/after-sales/apply/${order.id}`);
    };

    // --- 渲染辅助 ---

    const renderTabLabel = (label: string, count?: number) => {
        return (
            <div className="flex items-center gap-1">
                {label}
                {count !== undefined && count > 0 && (
                    <Badge 
                        count={count} 
                        showZero={false} 
                        size="small" 
                        offset={[2, -2]} 
                        style={{ backgroundColor: '#ff4d4f', boxShadow: 'none' }} 
                    />
                )}
            </div>
        );
    };

    const renderOrderCard = (order: OrderListItem) => {
        // 使用 status 映射配置
        const statusInfo = STATUS_CONFIG[order.status] || { label: order.status, color: 'default' };

        return (
            <Card
                key={order.id}
                className="mb-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                bodyStyle={{ padding: '0' }}
            >
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center text-sm">
                    <div className="text-gray-500 flex gap-4">
                        <span>{dayjs(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                        <span>订单号：{order.orderNo}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Tag color={statusInfo.color}>{statusInfo.label}</Tag>
                        <Link 
                             to={`/order-detail/${order.id}`}
                            className="text-xs text-gray-500 hover:text-red-500 hover:underline"
                        >
                            订单详情 &gt;
                        </Link>
                    </div>
                </div>

                <div className="p-5">
                    {order.items && order.items.map((item) => (
                        <div key={item.id} className="flex gap-4 mb-4 last:mb-0">
                            <Link to={`/product/${item.productId}`} className="block flex-shrink-0"> 
                                <div className="w-20 h-20 border border-gray-200 rounded-sm overflow-hidden bg-gray-100 hover:border-red-400 transition-colors">
                                    <Image 
                                        src={item.imageSnapshot} 
                                        alt={item.productName}
                                        width={80}
                                        height={80}
                                        className="object-cover"
                                        preview={false}
                                        fallback="https://placehold.co/100x100/e2e8f0/1e293b?text=No+Image"
                                    />
                                </div>
                            </Link>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <Link to={`/product/${item.productId}`} className="text-gray-800 font-medium text-sm line-clamp-2 w-[70%] hover:text-red-500 transition-colors">
                                        {item.productName}
                                    </Link>
                                    <div className="text-right">
                                        <div className="text-gray-800">¥{item.priceSnapshot}</div>
                                        <div className="text-gray-400 text-xs">x{item.quantity}</div>
                                    </div>
                                </div>
                                <div className="text-gray-400 text-xs mt-1 bg-gray-50 inline-block px-1.5 py-0.5 rounded">
                                    {item.config1} {item.config2}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Divider className="my-0" />

                <div className="px-5 py-3 flex justify-between items-center bg-white rounded-b-sm">
                    <div className="text-gray-600 text-sm">
                        共 {order.items ? order.items.reduce((acc, cur) => acc + cur.quantity, 0) : 0} 件商品，
                        实付 <span className="text-lg font-bold text-gray-900">¥{order.actualPayAmount}</span>
                    </div>

                    <div className="flex gap-2">
                        {order.status === '待支付' && (
                            <>
                                <Button size="small" onClick={() => showCancelModal(order.id)} className="rounded-sm border-gray-300 text-gray-600 hover:text-red-500 hover:border-red-500">取消订单</Button>
                                <Button size="small" type="primary" className="rounded-sm bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600" onClick={() => handlePay(order)}>立即付款</Button>
                            </>
                        )}
                        {(order.status === '已发货' || order.status === '待收货') && (
                            <>
                                <Link to={`/logistics/${order.orderNo}`}>
                                    <Button size="small" className="rounded-sm border-gray-300 text-gray-600 hover:text-red-500 hover:border-red-500">查看物流</Button>
                                </Link>
                                <Button size="small" type="primary" className="rounded-sm bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600" onClick={() => showConfirmModal(order.id)}>确认收货</Button>
                            </>
                        )}
                        {order.status === '已收货' && (
                            <>
                                <Button size="small" className="rounded-sm border-gray-300 text-gray-600 hover:text-red-500 hover:border-red-500" onClick={() => handleApplyAfterSale(order)}>申请售后</Button>
                                <Link to={`/order/evaluate/${order.id}`}>
                                    <Button size="small" className="rounded-sm border-gray-300 text-gray-600 hover:text-red-500 hover:border-red-500">评价</Button>
                                </Link>
                                <Button size="small" danger icon={<DeleteOutlined />} className="rounded-sm" onClick={() => showDeleteModal(order.id)}>删除</Button>
                            </>
                        )}
                        {order.status === '已取消' && (
                             <Button size="small" icon={<DeleteOutlined />} className="rounded-sm border-gray-300 text-gray-600 hover:text-red-500 hover:border-red-500" onClick={() => showDeleteModal(order.id)}>删除记录</Button>
                        )}
                         {order.status === '已支付' && (
                             <Button size="small" className="rounded-sm border-gray-300 text-gray-600 hover:text-red-500 hover:border-red-500" onClick={() => toast.success('提醒发货成功')}>提醒发货</Button>
                        )}
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="p-6 w-full mx-auto">
            <div className="mb-6 py-4 pl-4 pr-4 bg-white rounded-sm border-b-2 border-gray-100 flex justify-between items-center">
                <h1 className="text-[22px] font-semibold text-gray-800 leading-tight">
                    我的订单
                </h1>
                <Input 
                    prefix={<SearchOutlined className="text-gray-400" />}
                    placeholder="搜索订单号 / 商品名称"
                    allowClear
                    className="w-64"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onPressEnter={() => fetchOrders()} 
                />
            </div>

            <div className="mb-4">
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        { key: 'all', label: '全部订单' },
                        { key: 'pending', label: renderTabLabel('待付款', stats?.pendingPaymentCount) },
                        { key: 'paid', label: renderTabLabel('待发货', stats?.pendingShipmentCount) },
                        { key: 'shipped', label: renderTabLabel('待收货', stats?.pendingReceiptCount) },
                        { key: 'afterSales', label: renderTabLabel('退款/售后', 0) }, // OrderStats 中暂时没有 afterSalesCount
                        { key: 'completed', label: renderTabLabel('待评价', stats?.completedCount) }, 
                    ]}
                />
            </div>

            <div className={`h-[500px] overflow-y-auto pr-[6px] pb-2
                [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar-track]:rounded-xl
                [&::-webkit-scrollbar-track]:bg-gray-100
                [&::-webkit-scrollbar-thumb]:rounded-xl
                [&::-webkit-scrollbar-thumb]:bg-gray-300
                [&::-webkit-scrollbar-thumb:hover]:bg-gray-400
                [&::-webkit-scrollbar-button]:hidden
            `}>
                {loading && orders.length === 0 ? (
                    <div className="py-40 w-full flex items-center justify-center">
                        <Spin size="large" tip="加载中..." />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
                        <Empty 
                            image={Empty.PRESENTED_IMAGE_SIMPLE} 
                            description={
                                <span className="text-gray-500">
                                    {searchText ? '未找到相关订单' : '暂无相关订单'}
                                </span>
                            }
                        />
                         <Button type="primary" className="mt-4 bg-blue-500 rounded-sm" icon={<ShoppingOutlined />} onClick={() => navigate('/')}>
                            去逛逛
                        </Button>
                    </div>
                ) : (
                    <div>
                        {orders.map(order => renderOrderCard(order))}
                        {loading && <div className="text-center py-4"><Spin /></div>}
                    </div>
                )}
            </div>

            <Modal title={<div className="flex items-center gap-2"><ExclamationCircleFilled style={{ color: '#faad14' }} /> 取消订单</div>} open={cancelModal.open} onOk={confirmCancelOrder} onCancel={hideCancelModal} okText="确定" cancelText="再想想" centered width={360} styles={{ body: { paddingTop: '10px' } }}><p>确定要取消该订单吗？</p></Modal>
            <Modal title={<div className="flex items-center gap-2"><ExclamationCircleFilled style={{ color: '#ff4d4f' }} /> 删除订单</div>} open={deleteModal.open} onOk={confirmDeleteOrder} onCancel={hideDeleteModal} okText="删除" cancelText="取消" okButtonProps={{ danger: true }} centered width={360} styles={{ body: { paddingTop: '10px' } }}><p>确定要删除该订单记录吗？删除后不可恢复。</p></Modal>
            <Modal title={<div className="flex items-center gap-2"><CheckCircleFilled style={{ color: '#faad14' }} /> 确认收货</div>} open={confirmModal.open} onOk={confirmReceiveOrder} onCancel={hideConfirmModal} okText="确认" cancelText="取消" okButtonProps={{ style: { backgroundColor: '#ef4444', borderColor: '#ef4444' } }} centered width={360} styles={{ body: { paddingTop: '10px' } }}><p>确认已收到商品且商品无误吗？</p></Modal>
        </div>
    );
};

export default Orders;