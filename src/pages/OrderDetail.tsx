import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    message,
    Spin,
    Button,
    Tag,
    Timeline,
    Card,
    Image,
    Row,
    Col,
    Divider,
    Badge,
    Tooltip,
    Modal
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
    UserOutlined,
    FireOutlined,
    TagOutlined,
    GiftOutlined,
    InfoCircleOutlined,
    ThunderboltOutlined
} from '@ant-design/icons';
import type { OrderDetailResponse } from '../types/order';
import { cancelOrder, confirmReceipt, getOrderDetail } from '../services/order';
import type { AfterSaleApplyState, EvaluationPageState } from '../types/afterSale';
import toast from 'react-hot-toast';
import globalErrorHandler from '../utils/globalAxiosErrorHandler';
import { getImageUrl } from '../utils/imageConfig';

const OrderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<OrderDetailResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [confirming, setConfirming] = useState(false); // 添加确认收货加载状态

    // 获取订单详情
    const fetchOrderDetail = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const data = await getOrderDetail(id);
            setOrder(data);
        } catch (error) {
            globalErrorHandler.handle(error, toast.error)
            navigate('/my-order');
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
            globalErrorHandler.handle(error, toast.error)
        } finally {
            setCancelling(false);
        }
    };

    // 申请售后
    const handleApplyAfterSale = (orderItemId: string) => {
        if (!order) return;

        const state: AfterSaleApplyState = {
            orderId: order.id,
            orderItemId
        };
        navigate('/after-sale/apply', { state });
    };
    // 评价商品
    const handleEvaluateProduct = (orderItem: OrderDetailResponse['items'][0]) => {
        if (!order) return;

        const state: EvaluationPageState = {
            productId: orderItem.productId,
            configId: orderItem.configId,
            productName: orderItem.productName,
            configName: `${orderItem.config1} / ${orderItem.config2}${orderItem.config3 ? ` / ${orderItem.config3}` : ''}`,
            image: orderItem.imageSnapshot!,
            orderId: order.id
        };
        navigate('/evaluate', { state });
    };

    const handleConfirmReceipt = async () => {
        if (!order || order.status !== '待收货') {
            message.warning('当前订单状态不可确认收货');
            return;
        }

        Modal.confirm({
            title: '确认收货',
            content: '请确认您已收到商品且商品完好无损。确认收货后，订单将完成交易。',
            okText: '确认收货',
            cancelText: '取消',
            okButtonProps: {
                style: {
                    backgroundColor: '#52c41a',
                    borderColor: '#52c41a'
                }
            },
            onOk: async () => {
                setConfirming(true);
                try {
                    await confirmReceipt({ orderId: order.id });
                    message.success('确认收货成功！');
                    fetchOrderDetail();
                } catch (error) {
                    globalErrorHandler.handle(error, toast.error)
                } finally {
                    setConfirming(false);
                }
            }
        });
    };

    // 状态映射 - 联想主题色
    const statusConfig: Record<string, { color: string; bgColor: string; icon: React.ReactNode }> = {
        '待支付': { color: '#ff6b35', bgColor: '#fff7e6', icon: <ClockCircleOutlined /> },
        '已支付': { color: '#1890ff', bgColor: '#e6f7ff', icon: <CreditCardOutlined /> },
        '待发货': { color: '#722ed1', bgColor: '#f9f0ff', icon: <ShoppingOutlined /> },
        '已发货': { color: '#13c2c2', bgColor: '#e6fffb', icon: <TruckOutlined /> },
        '待收货': { color: '#52c41a', bgColor: '#f6ffed', icon: <TruckOutlined /> },
        '已收货': { color: '#52c41a', bgColor: '#f6ffed', icon: <CheckCircleOutlined /> },
        '已取消': { color: '#ff4d4f', bgColor: '#fff1f0', icon: <CloseCircleOutlined /> }
    };

    // 优惠券类型映射
    const couponTypeMap: Record<string, string> = {
        'discount': '折扣券',
        'deduction': '满减券',
        'freight': '运费券',
        'default': '优惠券'
    };

    // 时间线数据
    const getTimelineItems = () => {
        if (!order) return [];

        const items = [
            {
                color: '#52c41a',
                children: (
                    <div className="text-sm">
                        <div className="font-medium">订单创建</div>
                        <div className="text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
                    </div>
                )
            }
        ];

        if (order.payTime) {
            items.push({
                color: '#1890ff',
                children: (
                    <div className="text-sm">
                        <div className="font-medium">支付完成</div>
                        <div className="text-gray-500">{new Date(order.payTime).toLocaleString()}</div>
                    </div>
                )
            });
        }

        if (order.shipTime) {
            items.push({
                color: '#13c2c2',
                children: (
                    <div className="text-sm">
                        <div className="font-medium">已发货</div>
                        <div className="text-gray-500">{new Date(order.shipTime).toLocaleString()}</div>
                    </div>
                )
            });
        }

        if (order.receiveTime) {
            items.push({
                color: '#52c41a',
                children: (
                    <div className="text-sm">
                        <div className="font-medium">已收货</div>
                        <div className="text-gray-500">{new Date(order.receiveTime).toLocaleString()}</div>
                    </div>
                )
            });
        }

        if (order.cancelTime) {
            items.push({
                color: '#ff4d4f',
                children: (
                    <div className="text-sm">
                        <div className="font-medium">已取消</div>
                        <div className="text-gray-500">{new Date(order.cancelTime).toLocaleString()}</div>
                    </div>
                )
            });
        }

        return items;
    };

    // 计算商品总价
    const calculateItemsTotal = () => {
        if (!order) return 0;
        return order.items.reduce((total, item) => {
            return total + (item.payAmountSnapshot * item.quantity);
        }, 0);
    };

    // 计算优惠总金额
    const calculateDiscountTotal = () => {
        if (!order) return 0;
        let total = 0;
        order.coupons.forEach(coupon => total += coupon.discount);
        order.vouchers.forEach(voucher => total += voucher.usedAmount);
        return total;
    };

    useEffect(() => {
        fetchOrderDetail();
    }, []);

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

    const statusInfo = statusConfig[order.status] || { color: 'default', bgColor: '#f5f5f5', icon: null };
    const itemsTotal = calculateItemsTotal();
    const discountTotal = calculateDiscountTotal();

    return (
        <div className="bg-gray-50 min-h-screen py-6">
            <div className="mx-auto" style={{ maxWidth: '1200px' }}>
                {/* 联想风格头部 */}
                <div className="bg-white  shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">订单详情</h1>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-600 text-sm">订单号: {order.orderNo}</span>
                                <span className="text-gray-600 text-sm">
                                    下单时间: {new Date(order.createdAt).toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <Tag
                            style={{
                                backgroundColor: statusInfo.bgColor,
                                color: statusInfo.color,
                                borderColor: statusInfo.color,
                                padding: '6px 16px',
                                borderRadius: '20px',
                                fontSize: '14px',
                                fontWeight: 'bold'
                            }}
                            icon={statusInfo.icon}
                        >
                            {order.status}
                        </Tag>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 左侧主要信息 */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* 订单商品 - 联想风格 */}
                        <Card
                            title={
                                <div className="flex items-center gap-2">
                                    <ShoppingOutlined className="text-red-600" />
                                    <span className="font-bold text-gray-900">订单商品</span>
                                    <span className="text-sm text-gray-500">({order.items.length}件)</span>
                                </div>
                            }
                            className="shadow-sm border-0  overflow-hidden"
                            headStyle={{
                                borderBottom: '2px solid #f0f0f0',
                                padding: '16px 24px',
                                fontSize: '16px'
                            }}
                            bodyStyle={{ padding: '0' }}
                        >
                            {order.items.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`p-6 ${index > 0 ? 'border-t border-gray-100' : ''}`}
                                >
                                    <div className="flex gap-4">
                                        <div className="relative shrink-0">
                                            <Link to={`/product/${item.productId}`}>
                                                <Badge.Ribbon
                                                    text="秒杀"
                                                    color="red"
                                                    style={{
                                                        display: item.seckill ? 'block' : 'none',
                                                        fontSize: '12px',
                                                        padding: '0 8px',
                                                        height: '22px',
                                                        lineHeight: '22px'
                                                    }}
                                                >
                                                    <Image
                                                        width={100}
                                                        height={100}
                                                        src={getImageUrl(item.imageSnapshot)}
                                                        alt={item.productName}
                                                        className="object-cover rounded-lg border border-gray-200 hover:border-red-300 transition-colors"
                                                        fallback="https://via.placeholder.com/100"
                                                        preview={false}
                                                    />
                                                </Badge.Ribbon>
                                            </Link>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <Link
                                                        to={`/product/${item.productId}`}
                                                        className="font-bold text-gray-900 hover:text-red-600 transition-colors line-clamp-2 text-base"
                                                    >
                                                        {item.productName}
                                                        {item.seckill && (
                                                            <Tooltip title="此商品为秒杀商品">
                                                                <FireOutlined className="ml-2 text-red-500" />
                                                            </Tooltip>
                                                        )}
                                                    </Link>
                                                    <div className="mt-2">
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-medium">规格:</span>
                                                            <span className="ml-2">{item.config1} / {item.config2}</span>
                                                            {item.config3 && <span> / {item.config3}</span>}
                                                        </p>

                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-red-600">
                                                        ¥{(item.payAmountSnapshot * item.quantity).toFixed(2)}
                                                    </div>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        ¥{item.priceSnapshot.toFixed(2)} × {item.quantity}
                                                    </div>
                                                    {item.payAmountSnapshot < item.priceSnapshot && (
                                                        <div className="text-xs text-green-600 mt-1">
                                                            优惠: ¥{(item.priceSnapshot - item.payAmountSnapshot).toFixed(2)}/件
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* 商品操作按钮 */}
                                            {order.status === '已收货' && (
                                                <div className="mt-4 flex gap-3">
                                                    <Button
                                                        type="primary"
                                                        size="small"
                                                        onClick={() => handleEvaluateProduct(item)}
                                                        className="h-8 px-4 text-xs font-medium"
                                                        style={{
                                                            backgroundColor: '#ff6b35',
                                                            borderColor: '#ff6b35'
                                                        }}
                                                    >
                                                        评价商品
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        onClick={() => handleApplyAfterSale(item.id)}
                                                        className="h-8 px-4 text-xs font-medium border-gray-300 hover:border-red-500 hover:text-red-600"
                                                    >
                                                        申请售后
                                                    </Button>
                                                    {item.seckill && (
                                                        <Tooltip title="秒杀商品不支持7天无理由退货">
                                                            <InfoCircleOutlined className="text-gray-400 mt-2" />
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* 商品汇总 */}
                            <div className="border-t border-gray-200 p-6 bg-gray-50">
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <div className="text-gray-600">商品总价</div>
                                        <div className="text-lg font-bold text-gray-900 mt-1">
                                            ¥{itemsTotal.toFixed(2)}
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div className="text-gray-600">优惠金额</div>
                                        <div className="text-lg font-bold text-green-600 mt-1">
                                            -¥{discountTotal.toFixed(2)}
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Card>

                        {/* 优惠信息详情 */}
                        {(order.coupons.length > 0 || order.vouchers.length > 0) && (
                            <Card
                                title={
                                    <div className="flex items-center gap-2">
                                        <GiftOutlined className="text-red-600" />
                                        <span className="font-bold text-gray-900">优惠详情</span>
                                        <span className="text-sm text-gray-500">
                                            (共{order.coupons.length + order.vouchers.length}项优惠)
                                        </span>
                                    </div>
                                }
                                className="shadow-sm border-0 "
                                headStyle={{
                                    borderBottom: '2px solid #f0f0f0',
                                    padding: '16px 24px',
                                    fontSize: '16px'
                                }}
                                bodyStyle={{ padding: '24px' }}
                            >
                                <div className="space-y-4">
                                    {/* 优惠券 */}
                                    {order.coupons.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <TagOutlined className="text-blue-500" />
                                                <span className="font-medium text-gray-900">优惠券</span>
                                                <span className="text-sm text-gray-500">({order.coupons.length}张)</span>
                                            </div>
                                            <div className="space-y-3">
                                                {order.coupons.map(coupon => (
                                                    <div
                                                        key={coupon.id}
                                                        className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100"
                                                    >
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-gray-900">
                                                                    {coupon.name}
                                                                </span>
                                                                <Tag color="blue" >
                                                                    {couponTypeMap[coupon.type] || couponTypeMap.default}
                                                                </Tag>
                                                            </div>

                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-lg font-bold text-green-600">
                                                                -¥{coupon.amount.toFixed(2)}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                面额: ¥{coupon.amount.toFixed(2)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 代金券 */}
                                    {order.vouchers.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <CreditCardOutlined className="text-green-500" />
                                                <span className="font-medium text-gray-900">代金券</span>
                                                <span className="text-sm text-gray-500">({order.vouchers.length}张)</span>
                                            </div>
                                            <div className="space-y-3">
                                                {order.vouchers.map(voucher => (
                                                    <div
                                                        key={voucher.id}
                                                        className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100"
                                                    >
                                                        <div className="flex-1">
                                                            <div className="font-medium text-gray-900">
                                                                {voucher.title}
                                                            </div>
                                                            <div className="flex items-center gap-4 mt-1">

                                                                <div className="text-xs text-gray-500">
                                                                    使用时间: {new Date(voucher.useTime).toLocaleString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-lg font-bold text-green-600">
                                                                -¥{voucher.usedAmount.toFixed(2)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 优惠汇总 */}
                                    <Divider />
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div className="font-medium text-gray-900">优惠总计</div>
                                        <div className="text-xl font-bold text-green-600">
                                            -¥{discountTotal.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* 收货地址 - 联想风格 */}
                        <Card
                            title={
                                <div className="flex items-center gap-2">
                                    <HomeOutlined className="text-red-600" />
                                    <span className="font-bold text-gray-900">收货信息</span>
                                </div>
                            }
                            className="shadow-sm border-0 "
                            headStyle={{
                                borderBottom: '2px solid #f0f0f0',
                                padding: '16px 24px',
                                fontSize: '16px'
                            }}
                            bodyStyle={{ padding: '24px' }}
                        >
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <UserOutlined className="text-gray-400 mt-1" />
                                    <div>
                                        <div className="text-sm text-gray-500">收货人</div>
                                        <div className="font-medium text-gray-900">{order.address.receiver}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <PhoneOutlined className="text-gray-400 mt-1" />
                                    <div>
                                        <div className="text-sm text-gray-500">联系电话</div>
                                        <div className="font-medium text-gray-900">{order.address.phone}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <HomeOutlined className="text-gray-400 mt-1" />
                                    <div>
                                        <div className="text-sm text-gray-500">收货地址</div>
                                        <div className="font-medium text-gray-900">
                                            {`${order.address.province}${order.address.city}${order.address.area}${order.address.street}${order.address.detail}`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* 订单时间线 - 联想风格 */}
                        <Card
                            title={
                                <div className="flex items-center gap-2">
                                    <ClockCircleOutlined className="text-red-600" />
                                    <span className="font-bold text-gray-900">订单进度</span>
                                </div>
                            }
                            className="shadow-sm border-0 "
                            headStyle={{
                                borderBottom: '2px solid #f0f0f0',
                                padding: '16px 24px',
                                fontSize: '16px'
                            }}
                            bodyStyle={{ padding: '24px' }}
                        >
                            <Timeline
                                items={getTimelineItems()}
                                className="lenovo-timeline"
                            />
                        </Card>
                    </div>

                    {/* 右侧信息 */}
                    <div className="space-y-6">
                        {/* 订单金额汇总 - 联想风格 */}
                        <Card
                            title={
                                <div className="flex items-center gap-2">
                                    <CreditCardOutlined className="text-red-600" />
                                    <span className="font-bold text-gray-900">订单金额</span>
                                </div>
                            }
                            className="shadow-sm border-0 "
                            headStyle={{
                                borderBottom: '2px solid #f0f0f0',
                                padding: '16px 24px',
                                fontSize: '16px'
                            }}
                            bodyStyle={{ padding: '24px' }}
                        >
                            <div className="space-y-4">
                                {/* 商品总价 */}
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">商品总价</span>
                                    <span className="font-medium">¥{itemsTotal.toFixed(2)}</span>
                                </div>

                                {/* 秒杀商品标识 */}
                                {order.items.some(item => item.seckill) && (
                                    <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                                        <div className="flex items-center gap-2">
                                            <ThunderboltOutlined className="text-red-500" />
                                            <span className="text-gray-600">秒杀优惠</span>
                                        </div>
                                        <span className="text-green-500 font-medium">
                                            -¥{(itemsTotal - order.payAmount).toFixed(2)}
                                        </span>
                                    </div>
                                )}

                                {/* 优惠券优惠 */}
                                {order.coupons.map(coupon => (
                                    <div key={coupon.id} className="flex justify-between items-center text-sm pl-4">
                                        <div className="flex items-center gap-2">
                                            <TagOutlined className="text-blue-500 text-xs" />
                                            <span className="text-gray-500">{coupon.name}</span>
                                            <Tag color="blue" >
                                                {couponTypeMap[coupon.type] || couponTypeMap.default}
                                            </Tag>
                                        </div>
                                        <span className="text-green-500">-¥{coupon.amount.toFixed(2)}</span>
                                    </div>
                                ))}

                                {/* 代金券优惠 */}
                                {order.vouchers.map(voucher => (
                                    <div key={voucher.id} className="flex justify-between items-center text-sm pl-4">
                                        <div className="flex items-center gap-2">
                                            <CreditCardOutlined className="text-green-500 text-xs" />
                                            <span className="text-gray-500">{voucher.title}</span>
                                        </div>
                                        <span className="text-green-500">-¥{voucher.usedAmount.toFixed(2)}</span>
                                    </div>
                                ))}

                                {/* 优惠总计 */}
                                {(order.coupons.length > 0 || order.vouchers.length > 0) && (
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                        <span className="text-gray-600 font-medium">优惠总计</span>
                                        <span className="text-green-500 font-bold">
                                            -¥{discountTotal.toFixed(2)}
                                        </span>
                                    </div>
                                )}

                                {/* 实付金额 */}
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between items-center text-lg font-bold">
                                        <span>实付金额</span>
                                        <div className="flex flex-col items-end">
                                            <span className="text-red-600 text-2xl">
                                                ¥{order.actualPayAmount.toFixed(2)}
                                            </span>
                                            {order.payAmount > order.actualPayAmount && (
                                                <span className="text-xs text-gray-500 line-through mt-1">
                                                    原价: ¥{order.payAmount.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 节省金额 */}
                                {order.payAmount > order.actualPayAmount && (
                                    <div className="text-center text-green-600 font-medium bg-green-50 py-2 rounded">
                                        为您节省 ¥{(order.payAmount - order.actualPayAmount).toFixed(2)}
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* 订单操作 - 联想风格 */}
                        <Card
                            title={
                                <div className="flex items-center gap-2">
                                    <ShoppingOutlined className="text-red-600" />
                                    <span className="font-bold text-gray-900">订单操作</span>
                                </div>
                            }
                            className="shadow-sm border-0 "
                            headStyle={{
                                borderBottom: '2px solid #f0f0f0',
                                padding: '16px 24px',
                                fontSize: '16px'
                            }}
                            bodyStyle={{ padding: '24px' }}
                        >
                            <div className="space-y-3">
                                {order.status === '待支付' && (
                                    <>
                                        <Button
                                            danger
                                            block
                                            loading={cancelling}
                                            onClick={handleCancelOrder}
                                            className="h-10 font-medium"
                                            style={{ borderColor: '#ff4d4f' }}
                                        >
                                            取消订单
                                        </Button>
                                        <Button
                                            type="primary"
                                            block
                                            onClick={() => {
                                                // 构建支付页面需要的 OrderResponse 数据
                                                const paymentData = {
                                                    orderId: order.id,
                                                    orderNo: order.orderNo,
                                                    payAmount: order.payAmount,
                                                    actualPayAmount: order.actualPayAmount,
                                                    status: order.status,
                                                    items: order.items.map(item => ({
                                                        productId: item.productId,
                                                        productName: item.productName,
                                                        config1: item.config1,
                                                        config2: item.config2,
                                                        config3: item.config3,
                                                        quantity: item.quantity,
                                                        price: item.priceSnapshot,
                                                        discount: 0,
                                                        payAmount: item.payAmountSnapshot
                                                    })),
                                                    createdAt: order.createdAt,
                                                    payLimitTime: order.payLimitTime
                                                };

                                                // 导航到支付页面，传递正确的 state
                                                navigate(`/order/payment`, {
                                                    replace: true,
                                                    state: paymentData
                                                });
                                            }}
                                            className="h-10 font-medium"
                                            style={{
                                                backgroundColor: '#ff6b35',
                                                borderColor: '#ff6b35'
                                            }}
                                        >
                                            立即支付
                                        </Button>
                                        <p className="text-xs text-gray-500 text-center pt-2">
                                            支付截止时间: {new Date(order.payLimitTime).toLocaleString()}
                                        </p>
                                    </>
                                )}


                                {order.status === '待收货' && (
                                    <Button
                                        type="primary"
                                        block
                                        onClick={handleConfirmReceipt}
                                        loading={confirming}
                                        className="h-10 font-medium"
                                        style={{
                                            backgroundColor: '#52c41a',
                                            borderColor: '#52c41a'
                                        }}
                                    >
                                        {confirming ? '处理中...' : '确认收货'}
                                    </Button>
                                )}

                                {order.status === '已收货' && (
                                    <div className="space-y-3">
                                        <Button
                                            block
                                            onClick={() => toast('点左边的商品进行售后')}
                                            className="h-10 font-medium border-gray-300 hover:border-red-500 hover:text-red-600"
                                        >
                                            申请售后
                                        </Button>
                                        <Button
                                            block
                                            onClick={() => {
                                                // 再次购买逻辑
                                                const seckillItems = order.items.filter(item => item.seckill);
                                                if (seckillItems.length > 0) {
                                                    message.warning('秒杀商品不支持再次购买');
                                                } else {
                                                    message.info('功能开发中');
                                                }
                                            }}
                                            className="h-10 font-medium bg-red-600 text-white hover:bg-red-700 border-red-600"
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
                                        className="h-10 font-medium"
                                    >
                                        删除订单
                                    </Button>
                                )}

                                {/* 联系客服 */}
                                <Button
                                    block
                                    type="dashed"
                                    onClick={() => navigate('/customer-service')}
                                    className="h-10 font-medium border-gray-300 hover:border-red-500 hover:text-red-600"
                                >
                                    联系客服
                                </Button>
                            </div>
                        </Card>

                        {/* 支付信息 - 联想风格 */}
                        <Card
                            title={
                                <div className="flex items-center gap-2">
                                    <CreditCardOutlined className="text-red-600" />
                                    <span className="font-bold text-gray-900">支付信息</span>
                                </div>
                            }
                            className="shadow-sm border-0 "
                            headStyle={{
                                borderBottom: '2px solid #f0f0f0',
                                padding: '16px 24px',
                                fontSize: '16px'
                            }}
                            bodyStyle={{ padding: '24px' }}
                        >
                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm text-gray-500 mb-1">支付方式</div>
                                    <div className="font-medium text-gray-900">{order.payType || '在线支付'}</div>
                                </div>
                                {order.payTime && (
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">支付时间</div>
                                        <div className="font-medium text-gray-900">
                                            {new Date(order.payTime).toLocaleString()}
                                        </div>
                                    </div>
                                )}
                                {order.logisticsNo && (
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">物流单号</div>
                                        <div className="font-medium text-gray-900">{order.logisticsNo}</div>
                                    </div>
                                )}
                                {order.remark && (
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">订单备注</div>
                                        <div className="font-medium text-gray-900">{order.remark}</div>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* 秒杀商品提示 */}
                        {order.items.some(item => item.seckill) && (
                            <Card
                                title={
                                    <div className="flex items-center gap-2">
                                        <FireOutlined className="text-red-600" />
                                        <span className="font-bold text-gray-900">秒杀商品提示</span>
                                    </div>
                                }
                                className="shadow-sm border-0  border-red-200"
                                headStyle={{
                                    borderBottom: '2px solid #f0f0f0',
                                    padding: '16px 24px',
                                    fontSize: '16px',
                                    backgroundColor: '#fff2f0'
                                }}
                                bodyStyle={{ padding: '16px 24px' }}
                            >
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <InfoCircleOutlined className="text-red-500 mt-0.5" />
                                        <span className="text-sm text-gray-700">
                                            本订单包含秒杀商品，享受专属优惠价格
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <InfoCircleOutlined className="text-red-500 mt-0.5" />
                                        <span className="text-sm text-gray-700">
                                            秒杀商品不支持7天无理由退货
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <InfoCircleOutlined className="text-red-500 mt-0.5" />
                                        <span className="text-sm text-gray-700">
                                            如有质量问题，请在收货后7天内联系客服
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;

