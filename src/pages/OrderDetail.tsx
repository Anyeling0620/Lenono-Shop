import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    message,
    Spin,
    Button,
    Descriptions,
    Tag,
    Timeline,
    Card,
    Space,
    Image
} from 'antd';
import {
    ShoppingOutlined,
    CreditCardOutlined,
    TruckOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    HomeOutlined,
    PhoneOutlined,
    UserOutlined
} from '@ant-design/icons';
import type { OrderDetailResponse } from '../types/order';
import { cancelOrder, getOrderDetail } from '../services/order';

const OrderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<OrderDetailResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    // 获取订单详情
    const fetchOrderDetail = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const data = await getOrderDetail(id);
            setOrder(data);
        } catch (error) {
            message.error('获取订单详情失败');
            console.error('获取订单详情失败:', error);
            navigate('/orders');
        } finally {
            setLoading(false);
        }
    };

    // 取消订单
    const handleCancelOrder = async () => {
        if (!order) return;

        try {
            setCancelling(true);
            await cancelOrder({ orderId: order.id });
            message.success('订单已取消');
            fetchOrderDetail(); // 重新获取详情
        } catch (error) {
            message.error('取消订单失败');
            console.error('取消订单失败:', error);
        } finally {
            setCancelling(false);
        }
    };

    // 申请售后
    const handleApplyAfterSale = (orderItemId: string) => {
        navigate(`/after-sale/apply?orderId=${order?.id}&orderItemId=${orderItemId}`);
    };

    // 评价商品
    const handleEvaluateProduct = (productId: string, configId: string) => {
        navigate(`/evaluate?productId=${productId}&configId=${configId}`);
    };

    // 确认收货
    const handleConfirmReceipt = async () => {
        // 这里需要调用确认收货的API
        message.success('确认收货成功');
        fetchOrderDetail();
    };

    // 状态映射
    const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
        '待支付': { color: 'orange', icon: <ClockCircleOutlined /> },
        '已支付': { color: 'blue', icon: <CreditCardOutlined /> },
        '待发货': { color: 'purple', icon: <ShoppingOutlined /> },
        '已发货': { color: 'cyan', icon: <TruckOutlined /> },
        '待收货': { color: 'green', icon: <TruckOutlined /> },
        '已收货': { color: 'green', icon: <CheckCircleOutlined /> },
        '已取消': { color: 'red', icon: <CloseCircleOutlined /> }
    };

    // 时间线数据
    const getTimelineItems = () => {
        if (!order) return [];

        const items = [
            {
                color: 'green',
                children: `订单创建 ${new Date(order.createdAt).toLocaleString()}`
            }
        ];

        if (order.payTime) {
            items.push({
                color: 'blue',
                children: `支付完成 ${new Date(order.payTime).toLocaleString()}`
            });
        }

        if (order.shipTime) {
            items.push({
                color: 'cyan',
                children: `已发货 ${new Date(order.shipTime).toLocaleString()}`
            });
        }

        if (order.receiveTime) {
            items.push({
                color: 'green',
                children: `已收货 ${new Date(order.receiveTime).toLocaleString()}`
            });
        }

        if (order.cancelTime) {
            items.push({
                color: 'red',
                children: `已取消 ${new Date(order.cancelTime).toLocaleString()}`
            });
        }

        return items;
    };

    useEffect(() => {
        fetchOrderDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        );
    }

    if (!order) {
        return null;
    }

    const statusInfo = statusConfig[order.status] || { color: 'default', icon: null };

    return (
        <div className="bg-white min-h-screen p-6">
            <div className="mb-6">
                <Button
                    type="link"
                    onClick={() => navigate('/orders')}
                    className="mb-4"
                >
                    ← 返回订单列表
                </Button>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">订单详情</h1>
                        <p className="text-gray-500">订单号: {order.orderNo}</p>
                    </div>
                    <Tag
                        color={statusInfo.color}
                        icon={statusInfo.icon}
                        className="text-lg px-4 py-1"
                    >
                        {order.status}
                    </Tag>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 左侧主要信息 */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 订单商品 */}
                    <Card title="订单商品" className="shadow-sm">
                        {order.items.map((item, index) => (
                            <div key={item.id} className={`py-4 ${index > 0 ? 'border-t border-gray-100' : ''}`}>
                                <div className="flex gap-4">
                                    <Image
                                        width={80}
                                        height={80}
                                        src={item.imageSnapshot}
                                        alt={item.productName}
                                        className="object-cover rounded"
                                        fallback="https://via.placeholder.com/80"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-800">{item.productName}</h4>
                                        <p className="text-sm text-gray-500 mt-1">
                                            规格: {item.config1} / {item.config2} {item.config3 && `/ ${item.config3}`}
                                        </p>
                                        <div className="flex justify-between items-center mt-2">
                                            <div>
                                                <span className="text-gray-600">单价: ¥{item.priceSnapshot}</span>
                                                <span className="mx-2">×</span>
                                                <span className="text-gray-600">{item.quantity}</span>
                                            </div>
                                            <div className="text-lg font-bold text-red-500">
                                                ¥{(item.payAmountSnapshot * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 商品操作按钮 */}
                                {order.status === '已收货' && (
                                    <div className="mt-3 flex gap-2">
                                        <Button
                                            type="primary"
                                            size="small"
                                            onClick={() => handleEvaluateProduct(item.productId, item.id)}
                                        >
                                            评价商品
                                        </Button>
                                        <Button
                                            size="small"
                                            onClick={() => handleApplyAfterSale(item.id)}
                                        >
                                            申请售后
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </Card>

                    {/* 收货地址 */}
                    <Card title="收货信息" className="shadow-sm">
                        <Descriptions column={1}>
                            <Descriptions.Item label="收货人">
                                <Space>
                                    <UserOutlined />
                                    {order.address.receiver}
                                </Space>
                            </Descriptions.Item>
                            <Descriptions.Item label="联系电话">
                                <Space>
                                    <PhoneOutlined />
                                    {order.address.phone}
                                </Space>
                            </Descriptions.Item>
                            <Descriptions.Item label="收货地址">
                                <Space>
                                    <HomeOutlined />
                                    {`${order.address.province}${order.address.city}${order.address.area}${order.address.street}${order.address.detail}`}
                                </Space>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    {/* 订单时间线 */}
                    <Card title="订单进度" className="shadow-sm">
                        <Timeline items={getTimelineItems()} />
                    </Card>
                </div>

                {/* 右侧信息 */}
                <div className="space-y-6">
                    {/* 订单金额 */}
                    <Card title="订单金额" className="shadow-sm">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">商品总价</span>
                                <span>¥{order.payAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">优惠金额</span>
                                <span className="text-green-500">
                                    -¥{(order.payAmount - order.actualPayAmount).toFixed(2)}
                                </span>
                            </div>
                            {order.coupons.map(coupon => (
                                <div key={coupon.id} className="flex justify-between text-sm">
                                    <span className="text-gray-500">{coupon.name}</span>
                                    <span className="text-green-500">-¥{coupon.discount.toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="border-t pt-3">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>实付金额</span>
                                    <span className="text-red-500">¥{order.actualPayAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* 订单操作 */}
                    <Card title="订单操作" className="shadow-sm">
                        <div className="space-y-3">
                            {order.status === '待支付' && (
                                <>
                                    <Button
                                        type="primary"
                                        block
                                        onClick={() => navigate(`/payment?orderId=${order.orderNo}`)}
                                    >
                                        立即支付
                                    </Button>
                                    <Button
                                        block
                                        danger
                                        loading={cancelling}
                                        onClick={handleCancelOrder}
                                    >
                                        取消订单
                                    </Button>
                                    <p className="text-xs text-gray-500 text-center">
                                        支付截止时间: {new Date(order.payLimitTime).toLocaleString()}
                                    </p>
                                </>
                            )}

                            {order.status === '待收货' && (
                                <Button
                                    type="primary"
                                    block
                                    onClick={handleConfirmReceipt}
                                >
                                    确认收货
                                </Button>
                            )}

                            {order.status === '已收货' && (
                                <div className="space-y-2">
                                    <Button
                                        block
                                        onClick={() => navigate(`/after-sale/apply?orderId=${order.id}`)}
                                    >
                                        申请售后
                                    </Button>
                                    <Button
                                        block
                                        onClick={() => {
                                            // 再次购买逻辑
                                            message.info('功能开发中');
                                        }}
                                    >
                                        再次购买
                                    </Button>
                                </div>
                            )}

                            {order.status === '已取消' && (
                                <Button
                                    block
                                    onClick={() => {
                                        // 删除订单逻辑
                                        message.info('功能开发中');
                                    }}
                                    danger
                                >
                                    删除订单
                                </Button>
                            )}

                            {/* 联系客服 */}
                            <Button
                                block
                                type="dashed"
                                onClick={() => navigate('/customer-service')}
                            >
                                联系客服
                            </Button>
                        </div>
                    </Card>

                    {/* 支付信息 */}
                    <Card title="支付信息" className="shadow-sm">
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="支付方式">
                                {order.payType || '在线支付'}
                            </Descriptions.Item>
                            {order.payTime && (
                                <Descriptions.Item label="支付时间">
                                    {new Date(order.payTime).toLocaleString()}
                                </Descriptions.Item>
                            )}
                            {order.logisticsNo && (
                                <Descriptions.Item label="物流单号">
                                    {order.logisticsNo}
                                </Descriptions.Item>
                            )}
                        </Descriptions>
                    </Card>

                    {/* 优惠信息 */}
                    {(order.coupons.length > 0 || order.vouchers.length > 0) && (
                        <Card title="优惠信息" className="shadow-sm">
                            {order.coupons.map(coupon => (
                                <div key={coupon.id} className="mb-2 last:mb-0">
                                    <div className="flex justify-between">
                                        <span className="text-sm">{coupon.name}</span>
                                        <span className="text-green-500 text-sm">
                                            -¥{coupon.discount.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {order.vouchers.map(voucher => (
                                <div key={voucher.id} className="mb-2 last:mb-0">
                                    <div className="flex justify-between">
                                        <span className="text-sm">{voucher.title}</span>
                                        <span className="text-green-500 text-sm">
                                            -¥{voucher.usedAmount.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
