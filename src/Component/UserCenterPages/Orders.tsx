import { useState, useEffect, useMemo } from 'react';
import { Tabs, Card, Button, Tag, Input, Spin, Empty, Divider, Image, Badge, Modal } from 'antd';
import { SearchOutlined, DeleteOutlined, ShoppingOutlined, ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

// ========== 类型定义 ==========

type OrderStatus = 'pending' | 'paid' | 'shipped' | 'afterSales' | 'completed' | 'cancelled';

interface OrderItem {
    id: number;
    title: string;
    spec: string;
    price: number;
    quantity: number;
    imageUrl: string;
}

interface Order {
    id: string;
    orderNo: string;
    createTime: string;
    status: OrderStatus;
    totalAmount: number;
    shippingFee: number;
    items: OrderItem[];
}

// ========== 模拟数据 ==========
const MOCK_ORDERS: Order[] = [
    {
        id: '1',
        orderNo: 'ORD202501120001',
        createTime: '2025-01-12 14:30:00',
        status: 'pending',
        totalAmount: 299.00,
        shippingFee: 0,
        items: [
            {
                id: 101,
                title: '无线降噪蓝牙耳机 Pro Max',
                spec: '颜色：深空灰',
                price: 299.00,
                quantity: 1,
                imageUrl: 'https://placehold.co/100x100/e2e8f0/1e293b?text=Headphone'
            }
        ]
    },
    {
        id: '2',
        orderNo: 'ORD202501100023',
        createTime: '2025-01-10 09:15:00',
        status: 'shipped',
        totalAmount: 158.50,
        shippingFee: 10,
        items: [
            {
                id: 102,
                title: '纯棉透气运动T恤',
                spec: '尺码：L, 颜色：白色',
                price: 49.50,
                quantity: 3,
                imageUrl: 'https://placehold.co/100x100/e2e8f0/1e293b?text=T-Shirt'
            }
        ]
    },
    {
        id: '3',
        orderNo: 'ORD202412250088',
        createTime: '2024-12-25 18:20:00',
        status: 'completed',
        totalAmount: 2899.00,
        shippingFee: 0,
        items: [
            {
                id: 103,
                title: '智能手表 Series 7',
                spec: '表带：运动型硅胶',
                price: 2899.00,
                quantity: 1,
                imageUrl: 'https://placehold.co/100x100/e2e8f0/1e293b?text=Watch'
            }
        ]
    },
    {
        id: '4',
        orderNo: 'ORD202411110001',
        createTime: '2024-11-11 00:05:00',
        status: 'cancelled',
        totalAmount: 88.00,
        shippingFee: 8,
        items: [
            {
                id: 104,
                title: '家用多功能收纳盒',
                spec: '规格：大号3件套',
                price: 80.00,
                quantity: 1,
                imageUrl: 'https://placehold.co/100x100/e2e8f0/1e293b?text=Box'
            }
        ]
    },
    {
        id: '5',
        orderNo: 'ORD202501130055',
        createTime: '2025-01-13 10:00:00',
        status: 'paid',
        totalAmount: 599.00,
        shippingFee: 0,
        items: [
            {
                id: 105,
                title: '机械键盘 Cherry轴',
                spec: '轴体：红轴, 背光：RGB',
                price: 599.00,
                quantity: 1,
                imageUrl: 'https://placehold.co/100x100/e2e8f0/1e293b?text=Keyboard'
            }
        ]
    },
    {
        id: '6',
        orderNo: 'ORD202501140099',
        createTime: '2025-01-14 09:30:00',
        status: 'afterSales',
        totalAmount: 1299.00,
        shippingFee: 0,
        items: [
            {
                id: 106,
                title: '家用空气净化器',
                spec: '适用面积：50m²',
                price: 1299.00,
                quantity: 1,
                imageUrl: 'https://placehold.co/100x100/e2e8f0/1e293b?text=Purifier'
            }
        ]
    }
];

// ========== 状态配置 ==========
const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
    pending: { label: '待付款', color: 'red' },
    paid: { label: '待发货', color: 'blue' },
    shipped: { label: '待收货', color: 'orange' },
    afterSales: { label: '退款/售后', color: 'purple' },
    completed: { label: '已完成', color: 'green' },
    cancelled: { label: '已取消', color: 'default' },
};

const Orders = () => {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [activeTab, setActiveTab] = useState<string>('all');
    const [searchText, setSearchText] = useState('');

    // 弹窗状态管理
    const [cancelModal, setCancelModal] = useState<{ open: boolean; orderId: string | null }>({
        open: false,
        orderId: null
    });
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; orderId: string | null }>({
        open: false,
        orderId: null
    });
    const [confirmModal, setConfirmModal] = useState<{ open: boolean; orderId: string | null }>({
        open: false,
        orderId: null
    });

    // 模拟数据加载
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                await new Promise(resolve => setTimeout(resolve, 800));
                setOrders(MOCK_ORDERS);
            } catch (error) {
                console.error(error);
                toast.error("获取订单列表失败");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // 筛选与搜索逻辑
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const statusMatch = activeTab === 'all' || order.status === activeTab;
            const searchMatch = searchText.trim() === '' || 
                order.orderNo.toLowerCase().includes(searchText.toLowerCase()) ||
                order.items.some(item => item.title.toLowerCase().includes(searchText.toLowerCase()));
            return statusMatch && searchMatch;
        });
    }, [orders, activeTab, searchText]);

    // 操作处理函数
    const handleAction = (action: string, orderId: string) => {
        toast.loading(`${action}处理中...`, { duration: 1000 });
        
        setTimeout(() => {
            setOrders(prev => {
                return prev.map(o => {
                    if (o.id !== orderId) return o;
                    
                    if (action === '取消订单') return { ...o, status: 'cancelled' };
                    if (action === '确认收货') return { ...o, status: 'completed' };
                    if (action === '支付') return { ...o, status: 'paid' };
                    if (action === '申请退款') return { ...o, status: 'afterSales' };
                    return o;
                });
            });
            
            if (action === '删除订单') {
                setOrders(prev => prev.filter(o => o.id !== orderId));
            }

            toast.success(`${action}成功`);
        }, 1000);
    };

    // --- 弹窗控制逻辑 ---
    // 取消
    const showCancelModal = (id: string) => setCancelModal({ open: true, orderId: id });
    const hideCancelModal = () => setCancelModal({ open: false, orderId: null });
    const confirmCancelOrder = () => {
        if (cancelModal.orderId) {
            handleAction('取消订单', cancelModal.orderId);
            hideCancelModal();
        }
    };

    // 删除
    const showDeleteModal = (id: string) => setDeleteModal({ open: true, orderId: id });
    const hideDeleteModal = () => setDeleteModal({ open: false, orderId: null });
    const confirmDeleteOrder = () => {
        if (deleteModal.orderId) {
            handleAction('删除订单', deleteModal.orderId);
            hideDeleteModal();
        }
    };

    // 确认收货
    const showConfirmModal = (id: string) => setConfirmModal({ open: true, orderId: id });
    const hideConfirmModal = () => setConfirmModal({ open: false, orderId: null });
    const confirmReceiveOrder = () => {
        if (confirmModal.orderId) {
            handleAction('确认收货', confirmModal.orderId);
            hideConfirmModal();
        }
    };

    // 获取特定状态的订单数量
    const getStatusCount = (status: OrderStatus) => {
        return orders.filter(o => o.status === status).length;
    };

    // 自定义 Tab 标签渲染（带 Badge）
    const renderTabLabel = (label: string, status?: OrderStatus) => {
        const count = status ? getStatusCount(status) : 0;
        return (
            <div className="flex items-center gap-1">
                {label}
                {count > 0 && (
                    <Badge 
                        count={count} 
                        showZero={false} 
                        size="small" 
                        offset={[2, -2]} 
                        style={{ backgroundColor: '#ff4d4f' }} 
                    />
                )}
            </div>
        );
    };

    // 渲染单个订单卡片
    const renderOrderCard = (order: Order) => {
        const statusInfo = STATUS_CONFIG[order.status];

        return (
            <Card
                key={order.id}
                className="mb-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                bodyStyle={{ padding: '0' }}
            >
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center text-sm">
                    <div className="text-gray-500 flex gap-4">
                        <span>{dayjs(order.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                        <span>订单号：{order.orderNo}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Tag color={statusInfo.color}>{statusInfo.label}</Tag>
                        <Link 
                            to={`#`} 
                            className="text-xs text-gray-500 hover:text-red-500 hover:underline"
                        >
                            订单详情 &gt;
                        </Link>
                    </div>
                </div>

                <div className="p-5">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4 mb-4 last:mb-0">
                            <Link to={`#`} className="block flex-shrink-0"> 
                                <div className="w-20 h-20 border border-gray-200 rounded-sm overflow-hidden bg-gray-100 hover:border-red-400 transition-colors">
                                    <Image 
                                        src={item.imageUrl} 
                                        alt={item.title}
                                        width={80}
                                        height={80}
                                        className="object-cover"
                                        preview={false} 
                                    />
                                </div>
                            </Link>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <Link to={`#`} className="text-gray-800 font-medium text-sm line-clamp-2 w-[70%] hover:text-red-500 transition-colors">
                                        {item.title}
                                    </Link>
                                    <div className="text-right">
                                        <div className="text-gray-800">¥{item.price.toFixed(2)}</div>
                                        <div className="text-gray-400 text-xs">x{item.quantity}</div>
                                    </div>
                                </div>
                                <div className="text-gray-400 text-xs mt-1 bg-gray-50 inline-block px-1.5 py-0.5 rounded">
                                    {item.spec}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Divider className="my-0" />

                <div className="px-5 py-3 flex justify-between items-center bg-white rounded-b-sm">
                    <div className="text-gray-600 text-sm">
                        共 {order.items.reduce((acc, cur) => acc + cur.quantity, 0)} 件商品，
                        实付 <span className="text-lg font-bold text-gray-900">¥{order.totalAmount.toFixed(2)}</span>
                        <span className="text-xs ml-1 text-gray-400">(含运费¥{order.shippingFee})</span>
                    </div>

                    <div className="flex gap-2">
                        {/* 统一按钮样式规则：
                           1. 主操作按钮：bg-red-500 text-white
                           2. 次要操作按钮：bg-white text-gray-600 border-gray-300 hover:text-red-500 hover:border-red-500
                           3. 所有按钮：rounded-sm (稍微方正)
                        */}

                        {order.status === 'pending' && (
                            <>
                                <Button 
                                    size="small" 
                                    onClick={() => showCancelModal(order.id)}
                                    className="rounded-sm border-gray-300 text-gray-600 hover:text-red-500 hover:border-red-500"
                                >
                                    取消订单
                                </Button>
                                <Link to={`#`}>
                                    <Button 
                                        size="small" 
                                        type="primary" 
                                        className="rounded-sm bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600"
                                    >
                                        立即付款
                                    </Button>
                                </Link>
                            </>
                        )}
                        
                        {order.status === 'shipped' && (
                            <>
                                <Link to={`#`}>
                                    <Button 
                                        size="small"
                                        className="rounded-sm border-gray-300 text-gray-600 hover:text-red-500 hover:border-red-500"
                                    >
                                        查看物流
                                    </Button>
                                </Link>
                                <Button 
                                    size="small" 
                                    type="primary" 
                                    className="rounded-sm bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600"
                                    onClick={() => showConfirmModal(order.id)}
                                >
                                    确认收货
                                </Button>
                            </>
                        )}

                        {order.status === 'completed' && (
                            <>
                                <Link to={`/after-sales/apply/${order.id}`}>
                                    <Button 
                                        size="small"
                                        className="rounded-sm border-gray-300 text-gray-600 hover:text-red-500 hover:border-red-500"
                                    >
                                        申请售后
                                    </Button>
                                </Link>
                                
                                <Link to={`/order/evaluate/${order.id}`}>
                                    <Button 
                                        size="small"
                                        className="rounded-sm border-gray-300 text-gray-600 hover:text-red-500 hover:border-red-500"
                                    >
                                        评价
                                    </Button>
                                </Link>

                                <Button 
                                    size="small" 
                                    danger 
                                    icon={<DeleteOutlined />}
                                    className="rounded-sm"
                                    onClick={() => showDeleteModal(order.id)}
                                >
                                    删除
                                </Button>
                            </>
                        )}

                        {order.status === 'cancelled' && (
                             <Button 
                                size="small" 
                                icon={<DeleteOutlined />}
                                className="rounded-sm border-gray-300 text-gray-600 hover:text-red-500 hover:border-red-500"
                                onClick={() => showDeleteModal(order.id)}
                             >
                                删除记录
                             </Button>
                        )}
                         {order.status === 'paid' && (
                             <Button 
                                size="small" 
                                className="rounded-sm border-gray-300 text-gray-600 hover:text-red-500 hover:border-red-500"
                                onClick={() => toast('提醒发货成功')}
                             >
                                 提醒发货
                             </Button>
                        )}
                        
                        {order.status === 'afterSales' && (
                             <Link to={`#`}>
                                <Button 
                                    size="small"
                                    className="rounded-sm border-gray-300 text-gray-600 hover:text-red-500 hover:border-red-500"
                                >
                                    查看进度
                                </Button>
                             </Link>
                        )}
                    </div>
                </div>
            </Card>
        );
    };

    if (loading) {
        return (
            <div className="py-40 w-full flex items-center justify-center">
                <Spin />
            </div>
        );
    }

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
                />
            </div>

            <div className="mb-4">
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        { key: 'all', label: '全部订单' },
                        { key: 'pending', label: renderTabLabel('待付款', 'pending') },
                        { key: 'paid', label: renderTabLabel('待发货', 'paid') },
                        { key: 'shipped', label: renderTabLabel('待收货', 'shipped') },
                        { key: 'afterSales', label: renderTabLabel('退款/售后', 'afterSales') },
                        { key: 'completed', label: '待评价' }, 
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
                {filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
                        <Empty 
                            image={Empty.PRESENTED_IMAGE_SIMPLE} 
                            description={
                                <span className="text-gray-500">暂无相关订单</span>
                            }
                        />
                         <Button type="primary" className="mt-4 bg-blue-500 rounded-sm" icon={<ShoppingOutlined />}>
                            去逛逛
                        </Button>
                    </div>
                ) : (
                    filteredOrders.map(order => renderOrderCard(order))
                )}
            </div>

            {/* 取消订单弹窗 (Modal) */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <ExclamationCircleFilled style={{ color: '#faad14' }} /> 取消订单
                    </div>
                }
                open={cancelModal.open}
                onOk={confirmCancelOrder}
                onCancel={hideCancelModal}
                okText="确定"
                cancelText="再想想"
                centered
                width={360}
                styles={{ body: { paddingTop: '10px' } }}
            >
                <p>确定要取消该订单吗？</p>
            </Modal>

            {/* 删除订单弹窗 (Modal) */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <ExclamationCircleFilled style={{ color: '#ff4d4f' }} /> 删除订单
                    </div>
                }
                open={deleteModal.open}
                onOk={confirmDeleteOrder}
                onCancel={hideDeleteModal}
                okText="删除"
                cancelText="取消"
                okButtonProps={{ danger: true }} // 红色删除按钮
                centered
                width={360}
                styles={{ body: { paddingTop: '10px' } }}
            >
                <p>确定要删除该订单记录吗？删除后不可恢复。</p>
            </Modal>

            {/* 新增：确认收货弹窗 (Modal) */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <CheckCircleFilled style={{ color: '#faad14' }} /> 确认收货
                    </div>
                }
                open={confirmModal.open}
                onOk={confirmReceiveOrder}
                onCancel={hideConfirmModal}
                okText="确认"
                cancelText="取消"
                // 红色确认按钮
                okButtonProps={{ style: { backgroundColor: '#ef4444', borderColor: '#ef4444' } }} 
                centered
                width={360}
                styles={{ body: { paddingTop: '10px' } }}
            >
                <p>确认已收到商品且商品无误吗？</p>
            </Modal>
        </div>
    );
};

export default Orders;