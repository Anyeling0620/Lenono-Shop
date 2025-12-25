import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Card,
    Form,
    Input,
    Select,
    Upload,
    Button,
    message,
    Image,
    Radio,
    Modal,
    Divider
} from 'antd';
import {
    UploadOutlined,
    CameraOutlined,
    ArrowLeftOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { AfterSaleApplyState, AfterSaleType } from '../types/afterSale';
import { afterSaleService } from '../services/afterSale';
import globalErrorHandler from '../utils/globalAxiosErrorHandler';
import toast from 'react-hot-toast';
import { getOrderDetail } from '../services/order';

const { TextArea } = Input;
const { Option } = Select;

interface FormValues {
    type: AfterSaleType;
    reason: string;
    remark: string;
}

const AfterSaleApply: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [form] = Form.useForm<FormValues>();
    const [submitting, setSubmitting] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [orderInfo, setOrderInfo] = useState<any>(null);

    // 使用类型安全的 state
    const state = location.state as AfterSaleApplyState | undefined;
    const { orderId, orderItemId } = state || {};

    // 售后类型选项
    const afterSaleTypes: { value: AfterSaleType; label: string; description: string }[] = [
        { value: '退货', label: '退货', description: '退回商品并获得退款' },
        { value: '换货', label: '换货', description: '更换同款商品' },
        { value: '维修', label: '维修', description: '商品维修服务' }
    ];

    // 申请原因选项
    const reasonOptions = [
        { value: '商品质量问题', label: '商品质量问题' },
        { value: '商品与描述不符', label: '商品与描述不符' },
        { value: '商品损坏', label: '商品损坏' },
        { value: '商品错发/漏发', label: '商品错发/漏发' },
        { value: '七天无理由退货', label: '七天无理由退货' },
        { value: '其他原因', label: '其他原因' }
    ];

    // 验证参数并获取订单信息
    useEffect(() => {
        if (!orderId || !orderItemId) {
            message.error('参数错误，请从订单详情页进入');
            navigate('/orders');
            return;
        }

        // 获取订单详情
        const fetchOrderDetail = async () => {
            try {
                const orderDetail = await getOrderDetail(orderId);
                const orderItem = orderDetail.items.find(item => item.id === orderItemId);

                if (!orderItem) {
                    message.error('未找到对应的订单商品');
                    navigate(`/order-detail/${orderId}`);
                    return;
                }

                setOrderInfo({
                    orderNo: orderDetail.orderNo,
                    productName: orderItem.productName,
                    configName: `${orderItem.config1} / ${orderItem.config2}${orderItem.config3 ? ` / ${orderItem.config3}` : ''}`,
                    price: orderItem.priceSnapshot,
                    quantity: orderItem.quantity,
                    image: orderItem.imageSnapshot
                });
            } catch (error) {
                globalErrorHandler.handle(error, toast.error);
                navigate(`/order-detail/${orderId}`);
            }
        };

        fetchOrderDetail();
    }, [orderId, orderItemId, navigate]);

    // 处理图片预览
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewVisible(true);
    };

    const getBase64 = (file: RcFile): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    // 处理图片上传
    const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        const limitedFileList = newFileList.slice(0, 6);
        setFileList(limitedFileList);
    };

    // 上传前验证
    const beforeUpload = (file: RcFile) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('只能上传图片文件！');
            return false;
        }

        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('图片大小不能超过5MB！');
            return false;
        }

        return true;
    };

    // 提交申请
    const handleSubmit = async (values: FormValues) => {
        if (!orderId || !orderItemId) {
            message.error('参数错误');
            return;
        }

        if (fileList.length > 6) {
            message.warning('最多只能上传6张图片');
            return;
        }

        Modal.confirm({
            title: '确认提交售后申请？',
            icon: <ExclamationCircleOutlined />,
            content: '提交后客服将在24小时内处理您的申请',
            okText: '确认提交',
            cancelText: '再检查一下',
            okButtonProps: {
                style: { backgroundColor: '#E41E25', borderColor: '#E41E25' }
            },
            onOk: async () => {
                try {
                    setSubmitting(true);

                    const imageFiles = fileList
                        .filter(file => file.originFileObj && file.status === 'done')
                        .map(file => file.originFileObj as File);

                    await afterSaleService.createAfterSale({
                        orderId,
                        orderItemId,
                        type: values.type,
                        reason: values.reason,
                        remark: values.remark,
                        imageFiles
                    });

                    message.success('售后申请提交成功！');

                    Modal.success({
                        title: '申请已提交',
                        content: (
                            <div className="space-y-2">
                                <p>您的售后申请已成功提交，客服将在24小时内处理。</p>
                                <p className="text-sm text-gray-600">
                                    您可以在"我的售后"中查看处理进度
                                </p>
                            </div>
                        ),
                        okText: '查看售后列表',
                        okButtonProps: {
                            style: { backgroundColor: '#E41E25', borderColor: '#E41E25' }
                        },
                        onOk: () => {
                            navigate('/user-center');
                        }
                    });
                } catch (error: unknown) {
                    globalErrorHandler.handle(error, toast.error);
                } finally {
                    setSubmitting(false);
                }
            }
        });
    };

    // 自定义上传请求
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customUploadRequest = async (options: any) => {
        const { onSuccess } = options;
        onSuccess("ok");
    };

    // 删除图片
    const handleRemove = (file: UploadFile) => {
        const newFileList = fileList.filter(item => item.uid !== file.uid);
        setFileList(newFileList);
        return true;
    };

    // 返回按钮修正
    const handleBack = () => {
        if (orderId) {
            navigate(`/order-detail/${orderId}`);
        } else {
            navigate('/my-order');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="mx-auto" style={{ width: '1200px' }}>
                {/* 头部 */}
                <div className="mb-8">
                    <Button
                        type="link"
                        icon={<ArrowLeftOutlined />}
                        onClick={handleBack}
                        className="text-gray-600 hover:text-[#E41E25] mb-4 p-0 h-auto"
                        style={{ fontSize: '14px' }}
                    >
                        返回订单详情
                    </Button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">申请售后</h1>
                            <p className="text-gray-600 text-sm">请填写售后申请信息，客服将尽快为您处理</p>
                        </div>
                        {orderInfo && (
                            <div className="text-sm text-gray-500">
                                订单号: {orderInfo.orderNo || '--'}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-6">
                    {/* 左侧主内容区 */}
                    <div className="flex-1">
                        {/* 商品信息卡片 */}
                        {orderInfo && (
                            <Card
                                className="mb-6 shadow-sm border-0"
                                bodyStyle={{ padding: '20px' }}
                            >
                                <div className="flex gap-4 items-center">
                                    <div className="shrink-0">
                                        <Image
                                            width={100}
                                            height={100}
                                            src={orderInfo.image}
                                            alt={orderInfo.productName}
                                            className="object-cover border border-gray-200"
                                            preview={false}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                                            {orderInfo.productName}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="text-sm">
                                                <div className="text-gray-500 mb-1">规格</div>
                                                <div className="font-medium">{orderInfo.configName}</div>
                                            </div>
                                            <div className="text-sm">
                                                <div className="text-gray-500 mb-1">数量</div>
                                                <div className="font-medium">{orderInfo.quantity}</div>
                                            </div>
                                            <div className="text-sm">
                                                <div className="text-gray-500 mb-1">单价</div>
                                                <div className="font-medium">¥{orderInfo.price.toFixed(2)}</div>
                                            </div>
                                            <div className="text-sm">
                                                <div className="text-gray-500 mb-1">小计</div>
                                                <div className="font-bold text-[#E41E25]">
                                                    ¥{(orderInfo.price * orderInfo.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* 申请表单 */}
                        <Card
                            className="shadow-sm border-0 mb-6"
                            bodyStyle={{ padding: '24px' }}
                        >
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmit}
                                initialValues={{ type: '退货' }}
                            >

                                {/* 售后类型 */}
                                <Form.Item
                                    label={
                                        <div className="font-bold text-gray-900 text-base mb-3">售后类型</div>
                                    }
                                    name="type"
                                    rules={[{ required: true, message: '请选择售后类型' }]}
                                >
                                    <Radio.Group className="w-full">
                                        <div className="grid grid-cols-3 gap-4">
                                            {afterSaleTypes.map((type) => (
                                                <Radio.Button
                                                    key={type.value}
                                                    value={type.value}
                                                    className="h-20 flex flex-col items-center justify-center border-2 border-gray-200 hover:border-[#E41E25] hover:text-[#E41E25]"
                                                >
                                                    <div className="text-base font-bold mb-2">{type.label}</div>
                                                    <div className="text-xs text-gray-500 text-center px-2">
                                                        {type.description}
                                                    </div>
                                                </Radio.Button>
                                            ))}
                                        </div>
                                    </Radio.Group>
                                </Form.Item>


                                <Divider className="my-6" />

                                {/* 申请原因 */}
                                <Form.Item
                                    label={
                                        <div className="font-bold text-gray-900 text-base mb-3">申请原因</div>
                                    }
                                    name="reason"
                                    rules={[{ required: true, message: '请选择申请原因' }]}
                                >
                                    <Select
                                        placeholder="请选择申请原因"
                                        size="large"
                                        className="w-full"
                                        style={{ borderRadius: '4px' }}
                                    >
                                        {reasonOptions.map((option) => (
                                            <Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                {/* 问题描述 */}
                                <Form.Item
                                    label={
                                        <div className="font-bold text-gray-900 text-base mb-3">问题描述</div>
                                    }
                                    name="remark"
                                    rules={[
                                        { required: true, message: '请输入问题描述' },
                                        { min: 10, message: '请详细描述问题，至少10个字符' },
                                        { max: 500, message: '描述最多500个字符' }
                                    ]}
                                    extra={
                                        <div className="text-xs text-gray-500 mt-1">
                                            请详细描述您遇到的问题，有助于客服快速处理
                                        </div>
                                    }
                                >
                                    <TextArea
                                        rows={4}
                                        placeholder="请详细描述您遇到的问题，包括问题发生的时间、具体情况等..."
                                        showCount
                                        maxLength={500}
                                        className="resize-none border-gray-300 hover:border-[#E41E25] focus:border-[#E41E25]"
                                        style={{ padding: '12px', borderRadius: '4px' }}
                                    />
                                </Form.Item>

                                {/* 图片凭证 */}
                                <Form.Item
                                    label={
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 bg-[#E41E25] flex items-center justify-center">
                                                <CameraOutlined className="text-white text-sm" />
                                            </div>
                                            <span className="font-bold text-gray-900 text-base">上传凭证</span>
                                            <span className="text-sm text-gray-500">（可选，最多6张）</span>
                                        </div>
                                    }
                                    extra={
                                        <div className="text-xs text-gray-500 mt-1">
                                            请上传能证明问题的图片，如商品损坏、质量问题等
                                        </div>
                                    }
                                >
                                    <Upload
                                        listType="picture-card"
                                        fileList={fileList}
                                        onChange={handleUploadChange}
                                        onPreview={handlePreview}
                                        onRemove={handleRemove}
                                        beforeUpload={beforeUpload}
                                        customRequest={customUploadRequest}
                                        maxCount={6}
                                        multiple
                                    >
                                        {fileList.length >= 6 ? null : (
                                            <div className="flex flex-col items-center justify-center p-2">
                                                <div className="w-10 h-10 border-2 border-dashed border-gray-300 flex items-center justify-center mb-2 hover:border-[#E41E25]">
                                                    <UploadOutlined className="text-xl text-gray-400" />
                                                </div>
                                                <div className="text-xs text-gray-500">上传图片</div>
                                            </div>
                                        )}
                                    </Upload>
                                </Form.Item>

                                {/* 图片预览模态框 */}
                                <Modal
                                    open={previewVisible}
                                    title="图片预览"
                                    footer={null}
                                    onCancel={() => setPreviewVisible(false)}
                                    width={800}
                                >
                                    <img alt="预览" style={{ width: '100%' }} src={previewImage} />
                                </Modal>

                                {/* 重要提示 */}
                                <div className="mb-6 p-4 bg-[#E41E25]/5 border border-[#E41E25]/20">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-[#E41E25] flex items-center justify-center shrink-0">
                                            <ExclamationCircleOutlined className="text-white text-xs" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm font-bold text-[#E41E25]">重要提示：</p>
                                            <ul className="text-sm text-gray-700 space-y-1">
                                                <li className="flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 bg-[#E41E25] rounded-full mt-1.5"></div>
                                                    <span>请确保商品包装完好，配件齐全</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 bg-[#E41E25] rounded-full mt-1.5"></div>
                                                    <span>退货时请勿使用到付，否则可能被拒收</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 bg-[#E41E25] rounded-full mt-1.5"></div>
                                                    <span>请保持手机畅通，客服可能会与您联系</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 bg-[#E41E25] rounded-full mt-1.5"></div>
                                                    <span>申请提交后无法修改，请仔细核对信息</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* 提交按钮 */}
                                <Form.Item>
                                    <div className="flex gap-4 pt-4">
                                        <Button
                                            onClick={() => navigate(`/order-detail/${orderId}`)}

                                            className="flex-1 h-12 font-medium border-gray-300 hover:border-[#E41E25] hover:text-[#E41E25]"
                                            style={{ borderRadius: '4px' }}
                                        >
                                            取消
                                        </Button>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={submitting}
                                            className="flex-1 h-12 font-medium hover:opacity-90"
                                            style={{
                                                backgroundColor: '#E41E25',
                                                borderColor: '#E41E25',
                                                borderRadius: '4px',
                                                fontSize: '16px'
                                            }}
                                        >
                                            {submitting ? '提交中...' : '提交申请'}
                                        </Button>
                                    </div>
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>

                    {/* 右侧侧边栏 */}
                    <div className="w-80 shrink-0">
                        {/* 售后政策 */}
                        <Card
                            className="shadow-sm border-0 mb-6"
                            bodyStyle={{ padding: '20px' }}
                        >
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-6 bg-[#E41E25]"></div>
                                    <h4 className="font-bold text-gray-900 text-base">售后政策说明</h4>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-4 h-4 bg-[#E41E25]/10 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-[#E41E25]"></div>
                                            </div>
                                            <p className="font-bold text-sm text-gray-900">1. 退货政策</p>
                                        </div>
                                        <ul className="space-y-1 text-sm text-gray-700 pl-6">
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-[#E41E25] mt-1.5"></div>
                                                <span>商品存在质量问题：支持7天无理由退货，15天换货</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-[#E41E25] mt-1.5"></div>
                                                <span>商品完好未使用：支持7天无理由退货</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-[#E41E25] mt-1.5"></div>
                                                <span>退货需保持商品原包装、配件齐全</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-4 h-4 bg-[#E41E25]/10 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-[#E41E25]"></div>
                                            </div>
                                            <p className="font-bold text-sm text-gray-900">2. 换货政策</p>
                                        </div>
                                        <ul className="space-y-1 text-sm text-gray-700 pl-6">
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-[#E41E25] mt-1.5"></div>
                                                <span>商品存在质量问题：支持15天内换货</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-[#E41E25] mt-1.5"></div>
                                                <span>换货需提供问题证明图片</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-[#E41E25] mt-1.5"></div>
                                                <span>换货商品需保持完好</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-4 h-4 bg-[#E41E25]/10 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-[#E41E25]"></div>
                                            </div>
                                            <p className="font-bold text-sm text-gray-900">3. 维修政策</p>
                                        </div>
                                        <ul className="space-y-1 text-sm text-gray-700 pl-6">
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-[#E41E25] mt-1.5"></div>
                                                <span>商品在保修期内出现质量问题</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-[#E41E25] mt-1.5"></div>
                                                <span>需提供购买凭证和问题描述</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-[#E41E25] mt-1.5"></div>
                                                <span>维修时间根据具体情况而定</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* 处理流程 */}
                        <Card
                            className="shadow-sm border-0 border-[#E41E25]/20 bg-[#E41E25]/5"
                            bodyStyle={{ padding: '20px' }}
                        >
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-[#E41E25] flex items-center justify-center">
                                        <ExclamationCircleOutlined className="text-white text-xs" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-sm">处理流程</h4>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-[#E41E25] text-white text-xs flex items-center justify-center font-bold shrink-0">
                                            1
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">提交申请</p>
                                            <p className="text-xs text-gray-600 mt-1">填写申请信息并上传凭证</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-[#E41E25] text-white text-xs flex items-center justify-center font-bold shrink-0">
                                            2
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">客服审核</p>
                                            <p className="text-xs text-gray-600 mt-1">24小时内完成审核</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-[#E41E25] text-white text-xs flex items-center justify-center font-bold shrink-0">
                                            3
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">处理完成</p>
                                            <p className="text-xs text-gray-600 mt-1">根据审核结果进行处理</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 pt-3 border-t border-gray-200">
                                    如有疑问，请联系客服热线：400-xxx-xxxx
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AfterSaleApply;
