import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Card,
    Button,
    Radio,
    List,
    Tag,
    Divider,
    Statistic,
    Alert,
    Spin,
    message,
    Row,
    Col,
    Typography,
    Space,
    Badge,
    Modal,
    Descriptions,
    Progress
} from 'antd';
import {
    ShoppingCartOutlined,
    CreditCardOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    TagOutlined,
    SafetyOutlined,
    GiftOutlined,
    FileTextOutlined,
    PhoneOutlined,
    ThunderboltOutlined
} from '@ant-design/icons';
import type { OrderItemDetail, OrderResponse } from '../types/order';
import type { UserVoucherItem } from '../types/coupon';
import { getVouchersService } from '../services/coupon';
import { payWithVoucher } from '../services/order';

const { Countdown } = Statistic;
const { Title, Text } = Typography;

const PayPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [orderData, setOrderData] = useState<OrderResponse | null>(null);
    const [vouchers, setVouchers] = useState<UserVoucherItem[]>([]);
    const [selectedVoucherId, setSelectedVoucherId] = useState<string>('');
    const [voucherLoading, setVoucherLoading] = useState(false);
    const [payLoading, setPayLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number>(0);

    // 红色主题配置
    const themeColors = {
        primary: '#e60012', // 联想红
        primaryHover: '#cc0010',
        secondary: '#333333',
        lightBg: '#f8f8f8',
        border: '#e8e8e8',
        success: '#52c41a',
        warning: '#faad14',
        danger: '#ff4d4f'
    };


    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // 从路由状态获取订单数据
    useEffect(() => {
        if (location.state) {
            const order = location.state as OrderResponse;
            setOrderData(order);

            // 计算支付倒计时
            if (order.payLimitTime) {
                const limitTime = new Date(order.payLimitTime).getTime();
                const now = Date.now();
                const diff = Math.max(0, limitTime - now);
                setTimeLeft(diff);
            }
        } else {
            message.error('订单信息不存在');
            navigate('/cart');
        }
    }, [location.state, navigate]);

    // 加载用户代金券
    useEffect(() => {
        const loadVouchers = async () => {
            if (!orderData) return;

            setVoucherLoading(true);
            try {
                const response = await getVouchersService();
                // 过滤出有效的代金券
                const validVouchers = response.items.filter(voucher =>
                    voucher.status && voucher.remainAmount > 0
                );
                setVouchers(validVouchers);
            } catch (error) {
                message.error('加载代金券失败');
                console.error('加载代金券失败:', error);
            } finally {
                setVoucherLoading(false);
            }
        };

        loadVouchers();
    }, [orderData]);

    // 处理代金券选择
    const handleVoucherSelect = (voucherId: string) => {
        setSelectedVoucherId(voucherId);
    };

    // 处理支付
    const handlePayment = async () => {
        if (!orderData || !selectedVoucherId) {
            message.warning('请选择代金券');
            return;
        }

        setPayLoading(true);
        try {
            const paymentParams = {
                orderId: orderData.orderId,
                voucherId: selectedVoucherId
            };

            const result = await payWithVoucher(paymentParams);

            if (result.success) {
                message.success('支付成功！');

                // 显示支付结果弹窗
                Modal.success({
                    title: '支付成功',
                    content: (
                        <div>
                            <p>订单号：{orderData.orderNo}</p>
                            <p>支付金额：¥{result.paidAmount.toFixed(2)}</p>
                            <p>剩余金额：¥{result.remainAmount.toFixed(2)}</p>
                        </div>
                    ),
                    onOk: () => {
                        navigate('/order/list');
                    }
                });
            } else {
                message.error('支付失败，请重试');
            }
        } catch (error) {
            message.error('支付失败');
            console.error('支付失败:', error);
        } finally {
            setPayLoading(false);
        }
    };

    // 格式化金额
    const formatCurrency = (amount: number) => {
        return `¥${amount.toFixed(2)}`;
    };

    // 格式化日期
    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // 计算代金券折扣金额
    const calculateDiscount = () => {
        if (!selectedVoucherId || !orderData) return 0;

        const selectedVoucher = vouchers.find(v => v.id === selectedVoucherId);
        if (!selectedVoucher) return 0;

        return Math.min(selectedVoucher.remainAmount, orderData.payAmount);
    };

    if (!orderData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    const selectedVoucher = vouchers.find(v => v.id === selectedVoucherId);
    const discountAmount = calculateDiscount();
    const finalAmount = orderData.payAmount - discountAmount;

    return (
        <div className="min-h-screen bg-gray-50 ">
            <div className="max-w-[1200px] mx-auto pt-4">

                <Row gutter={[24, 24]}>
                    {/* 左侧：订单详情 */}
                    <Col xs={24} lg={16}>
                        {/* 订单信息卡片 */}
                        <Card
                            title={
                                <div className="flex items-center">
                                    <div className="w-1 h-6 bg-[#e60012] mr-3"></div>
                                    <span className="text-lg font-bold">订单信息</span>
                                </div>
                            }
                            className="shadow-sm border border-[#e8e8e8] rounded-md mb-6"
                            headStyle={{
                                borderBottom: '1px solid #e8e8e8',
                                padding: '16px 24px'
                            }}
                            bodyStyle={{ padding: '24px' }}
                        >
                            {/* 订单基本信息 */}
                            <Descriptions
                                column={2}
                                size="small"
                                className="mb-6"
                                labelStyle={{
                                    fontWeight: 'bold',
                                    color: '#666',
                                    width: '100px'
                                }}
                            >
                                <Descriptions.Item label="订单编号">
                                    <Text copyable strong>{orderData.orderNo}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="创建时间">
                                    <Text>{formatDate(orderData.createdAt)}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="支付截止">
                                    <Text type="danger">{formatDate(orderData.payLimitTime)}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="订单状态">
                                    <Tag color="red" className="font-bold">待支付</Tag>
                                </Descriptions.Item>
                            </Descriptions>

                            <Divider />

                            {/* 商品清单 */}
                            <div className="mb-6">
                                <div className="flex items-center mb-4">
                                    <ShoppingCartOutlined className="text-[#e60012] mr-2" />
                                    <Title level={5} className="mb-0">商品清单</Title>
                                </div>
                                <List
                                    dataSource={orderData.items}
                                    renderItem={(item: OrderItemDetail) => (
                                        <List.Item className="border-0 py-4 px-0">
                                            <div className="flex w-full items-center">
                                                <div className="flex-1">
                                                    <Text strong className="block mb-1 text-base">
                                                        {item.productName}
                                                    </Text>
                                                    <div className="text-gray-500 text-sm space-x-2">
                                                        <span>{item.config1}</span>
                                                        <span>|</span>
                                                        <span>{item.config2}</span>
                                                        {item.config3 && (
                                                            <>
                                                                <span>|</span>
                                                                <span>{item.config3}</span>
                                                            </>
                                                        )}
                                                        <span>|</span>
                                                        <span>数量：{item.quantity}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="mb-1">
                                                        <Text strong className="text-base">
                                                            ¥{item.price.toFixed(2)}
                                                        </Text>
                                                    </div>
                                                    <Text type="secondary" className="text-sm">
                                                        小计：¥{item.payAmount.toFixed(2)}
                                                    </Text>
                                                </div>
                                            </div>
                                        </List.Item>
                                    )}
                                />
                            </div>

                            {/* 支付倒计时 */}
                            <Alert
                                message={
                                    <div className="flex items-center">
                                        <ClockCircleOutlined className="text-[#e60012] mr-2" />
                                        <span className="font-bold">支付倒计时</span>
                                    </div>
                                }
                                description={
                                    <div className="mt-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <Text strong>剩余支付时间：</Text>
                                            <Countdown
                                                value={Date.now() + timeLeft}
                                                format="HH:mm:ss"
                                                className="text-2xl font-bold text-[#e60012]"
                                            />
                                        </div>
                                        <Progress
                                            percent={Math.floor((timeLeft / (15 * 60 * 1000)) * 100)}
                                            strokeColor="#e60012"
                                            showInfo={false}
                                        />
                                        <Text type="secondary" className="block mt-2 text-sm">
                                            超时未支付订单将自动取消，请尽快完成支付
                                        </Text>
                                    </div>
                                }
                                type="warning"
                                className="mb-6 border border-[#faad14]"
                            />

                            {/* 安全保障 */}
                            <div className="bg-[#f8f8f8] p-4 rounded-md">
                                <div className="flex items-center mb-3">
                                    <Text strong>支付安全保障</Text>
                                </div>
                                <Row gutter={[16, 16]}>
                                    <Col span={8}>
                                        <div className="text-center">
                                            <SafetyOutlined className="text-2xl text-[#52c41a] mb-2" />
                                            <Text className="block text-sm">银行级加密</Text>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <div className="text-center">
                                            <CheckCircleOutlined className="text-2xl text-[#52c41a] mb-2" />
                                            <Text className="block text-sm">7天无理由退款</Text>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <div className="text-center">
                                            <ThunderboltOutlined className="text-2xl text-[#52c41a] mb-2" />
                                            <Text className="block text-sm">极速退款</Text>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>

                    {/* 右侧：支付信息 */}
                    <Col xs={24} lg={8}>
                        <div className="sticky top-6">
                            {/* 支付金额卡片 */}
                            <Card
                                title={
                                    <div className="flex items-center">
                                        <div className="w-1 h-6 bg-[#e60012] mr-3"></div>
                                        <span className="text-lg font-bold">支付信息</span>
                                    </div>
                                }
                                className="shadow-sm border border-[#e8e8e8] rounded-md mb-6"
                                headStyle={{
                                    borderBottom: '1px solid #e8e8e8',
                                    padding: '16px 24px'
                                }}
                                bodyStyle={{ padding: '24px' }}
                            >
                                <Space direction="vertical" size="large" className="w-full">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <Text className="text-gray-600">商品金额</Text>
                                            <Text strong className="text-lg">
                                                {formatCurrency(orderData.payAmount)}
                                            </Text>
                                        </div>

                                        {selectedVoucher && (
                                            <div className="flex justify-between items-center bg-[#f6ffed] p-3 rounded-md">
                                                <div>
                                                    <Text type="success" strong>代金券抵扣</Text>
                                                    <div className="text-xs text-gray-500">
                                                        {selectedVoucher.voucher.title}
                                                    </div>
                                                </div>
                                                <Text type="success" strong className="text-lg">
                                                    -{formatCurrency(discountAmount)}
                                                </Text>
                                            </div>
                                        )}

                                        <Divider className="my-2" />

                                        <div className="flex justify-between items-center pt-3 border-t border-dashed">
                                            <Text strong className="text-base">应付金额</Text>
                                            <div>
                                                <Text
                                                    strong
                                                    className="text-2xl"
                                                    style={{ color: themeColors.primary }}
                                                >
                                                    {formatCurrency(finalAmount)}
                                                </Text>
                                                {discountAmount > 0 && (
                                                    <div className="text-xs text-gray-500 text-right">
                                                        已节省：{formatCurrency(discountAmount)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        type="primary"
                                        size="large"
                                        block
                                        icon={<CreditCardOutlined />}
                                        loading={payLoading}
                                        onClick={handlePayment}
                                        disabled={!selectedVoucherId}
                                        className="h-12 text-base font-bold"
                                        style={{
                                            background: themeColors.primary,
                                            borderColor: themeColors.primary,
                                            borderRadius: '4px'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = themeColors.primaryHover;
                                            e.currentTarget.style.borderColor = themeColors.primaryHover;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = themeColors.primary;
                                            e.currentTarget.style.borderColor = themeColors.primary;
                                        }}
                                    >
                                        {payLoading ? '支付中...' : '确认支付'}
                                    </Button>

                                    <div className="text-center text-sm text-gray-500">
                                        <CheckCircleOutlined className="text-green-500 mr-1" />
                                        支付即代表您已阅读并同意
                                        <a href="" className="text-[#e60012] ml-1">《用户协议》</a>
                                    </div>
                                </Space>
                            </Card>

                            {/* 代金券选择 */}
                            <Card
                                title={
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-1 h-6 bg-[#e60012] mr-3"></div>
                                            <span className="text-lg font-bold">选择代金券</span>
                                        </div>
                                        <Badge
                                            count={vouchers.length}
                                            style={{
                                                backgroundColor: themeColors.primary,
                                                fontWeight: 'bold'
                                            }}
                                        />
                                    </div>
                                }
                                className="shadow-sm border border-[#e8e8e8] rounded-md"
                                headStyle={{
                                    borderBottom: '1px solid #e8e8e8',
                                    padding: '16px 24px'
                                }}
                                bodyStyle={{ padding: '24px' }}
                                loading={voucherLoading}
                            >
                                {vouchers.length === 0 ? (
                                    <div className="text-center py-8">
                                        <GiftOutlined className="text-4xl text-gray-300 mb-4" />
                                        <Text type="secondary">暂无可用代金券</Text>
                                        <Button
                                            type="link"
                                            className="mt-2 text-[#e60012]"
                                            onClick={() => navigate('/voucher')}
                                        >
                                            去领取代金券
                                        </Button>
                                    </div>
                                ) : (
                                    <Radio.Group
                                        value={selectedVoucherId}
                                        onChange={(e) => handleVoucherSelect(e.target.value)}
                                        className="w-full"
                                    >
                                        <Space direction="vertical" className="w-full" size={12}>
                                            {vouchers.map(voucher => (
                                                <Radio
                                                    key={voucher.id}
                                                    value={voucher.id}
                                                    className="w-full"
                                                >
                                                    <Card
                                                        size="small"
                                                        className={`w-full cursor-pointer transition-all duration-200 border-2 ${selectedVoucherId === voucher.id
                                                                ? 'border-[#e60012] bg-[#fff2f0]'
                                                                : 'border-[#e8e8e8] hover:border-[#d9d9d9]'
                                                            }`}
                                                        style={{ borderRadius: '4px' }}
                                                    >
                                                        <div className="flex justify-between items-center w-[280px]">
                                                            <div>
                                                                <div className="flex items-center mb-1">
                                                                    <TagOutlined className="text-[#e60012] mr-2" />
                                                                    <Text strong className="text-base">
                                                                        {voucher.voucher.title}
                                                                    </Text>
                                                                </div>
                                                                <Text type="secondary" className="text-sm block">
                                                                    有效期至：<br/>{formatDate(voucher.voucher.endTime)}
                                                                </Text>
                                                            </div>
                                                            <div className="text-right">
                                                                <Text
                                                                    strong
                                                                    className="text-lg block"
                                                                    style={{ color: themeColors.primary }}
                                                                >
                                                                    ¥{voucher.remainAmount.toFixed(2)}
                                                                </Text>
                                                                <Text type="secondary" className="text-xs">
                                                                    剩余金额
                                                                </Text>
                                                            </div>
                                                        </div>
                                                        {selectedVoucherId === voucher.id && (
                                                            <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                                                                <div className="flex justify-between items-center">
                                                                    <Text type="secondary" className="text-sm">
                                                                        本次可抵扣：
                                                                    </Text>
                                                                    <Text strong className="text-[#e60012]">
                                                                        ¥{Math.min(voucher.remainAmount, orderData.payAmount).toFixed(2)}
                                                                    </Text>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Card>
                                                </Radio>
                                            ))}
                                        </Space>
                                    </Radio.Group>
                                )}

                                {/* 代金券使用说明 */}
                                <Divider />
                                <div className="bg-[#f8f8f8] p-4 rounded-md">
                                    <div className="flex items-center mb-3">
                                        <FileTextOutlined className="text-[#e60012] mr-2" />
                                        <Text strong>代金券使用说明</Text>
                                    </div>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-[#e60012] rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                                            <span>支付后剩余金额可继续使用</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-[#e60012] rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                                            <span>代金券不可提现、不可转让</span>
                                        </li>
                                    </ul>
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>

                {/* 底部服务保障 */}
                <div className="mt-8 bg-white border border-[#e8e8e8] rounded-md p-6">
                    <Title level={4} className="text-center mb-6" style={{ color: themeColors.primary }}>
                        联想商城服务保障
                    </Title>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} sm={12} md={6}>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-[#fff2f0] rounded-md flex items-center justify-center mx-auto mb-3">
                                    <SafetyOutlined className="text-2xl" style={{ color: themeColors.primary }} />
                                </div>
                                <Text strong className="block mb-1">正品保障</Text>
                                <Text type="secondary" className="text-sm">100%官方正品</Text>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-[#fff2f0] rounded-md flex items-center justify-center mx-auto mb-3">
                                    <ClockCircleOutlined className="text-2xl" style={{ color: themeColors.primary }} />
                                </div>
                                <Text strong className="block mb-1">快速发货</Text>
                                <Text type="secondary" className="text-sm">24小时内发货</Text>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-[#fff2f0] rounded-md flex items-center justify-center mx-auto mb-3">
                                    <CheckCircleOutlined className="text-2xl" style={{ color: themeColors.primary }} />
                                </div>
                                <Text strong className="block mb-1">无忧售后</Text>
                                <Text type="secondary" className="text-sm">7天无理由退货</Text>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-[#fff2f0] rounded-md flex items-center justify-center mx-auto mb-3">
                                    <PhoneOutlined className="text-2xl" style={{ color: themeColors.primary }} />
                                </div>
                                <Text strong className="block mb-1">专业客服</Text>
                                <Text type="secondary" className="text-sm">7×24小时在线</Text>
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* 底部信息 */}
                <div className="mt-8 text-center">
                    <div className="mb-4">
                        <Text type="secondary">
                            如有问题，请联系客服：<span className="font-bold text-[#e60012]">400-100-2000</span>
                        </Text>
                    </div>
                    <div className="text-xs text-gray-400">
                        <Text type="secondary">
                            © 2023 联想商城 版权所有 |
                            <a href="#" className="mx-2 hover:text-[#e60012]">隐私政策</a> |
                            <a href="#" className="mx-2 hover:text-[#e60012]">用户协议</a> |
                            <a href="#" className="mx-2 hover:text-[#e60012]">售后服务</a>
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayPage;
