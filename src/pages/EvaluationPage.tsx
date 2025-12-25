import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Rate,
  Upload,
  Button,
  message,
  Image,
  Divider,
  Modal
} from 'antd';
import {
  UploadOutlined,
  StarOutlined,
  CameraOutlined,
  ArrowLeftOutlined,
  EyeOutlined
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { RcFile } from 'antd/es/upload';
import { afterSaleService } from '../services/afterSale';
import type { EvaluationPageState } from '../types/afterSale';
import globalErrorHandler from '../utils/globalAxiosErrorHandler';
import toast from 'react-hot-toast';

const { TextArea } = Input;

interface FormValues {
  star: number;
  content: string;
}

const EvaluationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  
  // 从state获取参数
  const state = location.state as EvaluationPageState | undefined;
  const { productId, configId, productName, configName, image, orderId } = state || {};
  
  // 验证参数
  useEffect(() => {
    if (!productId || !configId) {
      message.error('参数错误，请从订单详情页进入');
      navigate('/my-order');
    }
  }, [productId, configId, navigate]);

  // 处理图片预览
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
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

  // 自定义上传行为
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customUploadRequest = async (options: any) => {
    const { onSuccess } = options;
    onSuccess("ok");
  };

  // 提交评价
  const handleSubmit = async (values: FormValues) => {
    if (!productId || !configId) {
      message.error('参数错误');
      return;
    }

    if (fileList.length > 6) {
      message.warning('最多只能上传6张图片');
      return;
    }

    try {
      setSubmitting(true);
      
      const imageFiles = fileList
        .filter(file => file.originFileObj)
        .map(file => file.originFileObj as File);

      await afterSaleService.createEvaluation({
        productId,
        configId,
        star: values.star,
        content: values.content,
        imageFiles
      });

      message.success('评价提交成功！');
      
      Modal.success({
        title: '评价成功',
        content: '感谢您的评价，您的反馈对其他用户非常有帮助！',
        okText: '返回订单',
        okButtonProps: {
          style: { backgroundColor: '#E41E25', borderColor: '#E41E25' }
        },
        onOk: () => {
          navigate(`/order-detail/${orderId}`);
        }
      });
    } catch (error: unknown) {
      globalErrorHandler.handle(error, toast.error);
    } finally {
      setSubmitting(false);
    }
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
              <h1 className="text-xl font-bold text-gray-900 mb-2">商品评价</h1>
              <p className="text-gray-600 text-sm">分享您的使用体验，帮助其他用户选择</p>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* 左侧主内容区 */}
          <div className="flex-1">
            {/* 商品信息卡片 */}
            <Card 
              className="mb-6 shadow-sm border-0 rounded-lg"
              bodyStyle={{ padding: '20px' }}
            >
              <div className="flex gap-4 items-center">
                <div className="shrink-0">
                  <Image
                    width={100}
                    height={100}
                    src={image}
                    alt={productName}
                    className="object-cover rounded-lg border border-gray-200"
                    preview={{
                      mask: <EyeOutlined className="text-white" />
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{productName}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded">规格：{configName}</span>
                    <span className="text-gray-500">请根据实际使用体验进行评价</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* 评价表单 */}
            <Card 
              className="shadow-sm border-0 mb-6 rounded-lg"
              bodyStyle={{ padding: '24px' }}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ star: 5 }}
              >
                {/* 评分 */}
                <Form.Item
                  label={
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-[#E41E25] rounded-full flex items-center justify-center">
                        <StarOutlined className="text-white text-sm" />
                      </div>
                      <span className="font-bold text-gray-900 text-base">商品评分</span>
                      <span className="text-sm text-gray-500">（必填）</span>
                    </div>
                  }
                  name="star"
                  rules={[{ required: true, message: '请选择评分' }]}
                >
                  <div className="space-y-3">
                    <Rate
                      className="text-3xl"
                      character={<StarOutlined />}
                      style={{ color: '#E41E25' }}
                    />
                    <div className="flex justify-between text-sm text-gray-500 px-1">
                      <span>非常不满意</span>
                      <span>非常满意</span>
                    </div>
                  </div>
                </Form.Item>

                <Divider className="my-6" />

                {/* 评价内容 */}
                <Form.Item
                  label={
                    <div className="font-bold text-gray-900 text-base mb-3">评价内容</div>
                  }
                  name="content"
                  rules={[
                    { required: true, message: '请输入评价内容' },
                    { min: 10, message: '评价内容至少10个字符' },
                    { max: 500, message: '评价内容最多500个字符' }
                  ]}
                >
                  <TextArea
                    rows={5}
                    placeholder="请详细描述您的使用体验，包括商品质量、使用感受、优缺点等..."
                    showCount
                    maxLength={500}
                    className="resize-none rounded-lg border-gray-300 hover:border-[#E41E25] focus:border-[#E41E25]"
                    style={{ padding: '12px' }}
                  />
                </Form.Item>

                {/* 图片上传 */}
                <Form.Item
                  label={
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-[#E41E25] rounded-full flex items-center justify-center">
                        <CameraOutlined className="text-white text-sm" />
                      </div>
                      <span className="font-bold text-gray-900 text-base">上传图片</span>
                      <span className="text-sm text-gray-500">（可选，最多6张）</span>
                    </div>
                  }
                  extra={
                    <div className="text-xs text-gray-500 mt-1">
                      支持 JPG、PNG 格式，单张图片不超过5MB
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
                    className="custom-upload"
                  >
                    {fileList.length >= 6 ? null : (
                      <div className="flex flex-col items-center justify-center p-2">
                        <div className="w-10 h-10 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-2 hover:border-[#E41E25]">
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
                  title={previewTitle}
                  footer={null}
                  onCancel={() => setPreviewVisible(false)}
                  width={800}
                >
                  <img alt="预览" style={{ width: '100%' }} src={previewImage} />
                </Modal>

                {/* 提交按钮 */}
                <Form.Item>
                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={() => navigate(`/order/${orderId}`)}
                      className="flex-1 h-12 font-medium border-gray-300 hover:border-[#E41E25] hover:text-[#E41E25] rounded-lg"
                    >
                      取消
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={submitting}
                      className="flex-1 h-12 font-medium rounded-lg hover:opacity-90 transition-opacity"
                      style={{ 
                        backgroundColor: '#E41E25', 
                        borderColor: '#E41E25',
                        fontSize: '16px'
                      }}
                    >
                      {submitting ? '提交中...' : '提交评价'}
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </Card>
          </div>

          {/* 右侧侧边栏 */}
          <div className="w-80 shrink-0">
            {/* 评价指南 */}
            <Card 
              className="shadow-sm border-0 rounded-lg mb-6"
              bodyStyle={{ padding: '20px' }}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-6 bg-[#E41E25] rounded"></div>
                  <h4 className="font-bold text-gray-900 text-base">评价指南</h4>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#E41E25]/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-[#E41E25] rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed">
                      请基于真实使用体验进行评价，避免虚假评价
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#E41E25]/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-[#E41E25] rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed">
                      可以分享商品的外观、性能、使用感受等
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#E41E25]/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-[#E41E25] rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed">
                      上传清晰的商品图片有助于其他用户了解商品
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#E41E25]/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-[#E41E25] rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed">
                      评价内容需符合社区规范，不得包含违规信息
                    </span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* 评价提示 */}
            <Card 
              className="shadow-sm border-0 rounded-lg border-[#E41E25]/20 bg-[#E41E25]/5"
              bodyStyle={{ padding: '20px' }}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#E41E25] rounded-full flex items-center justify-center">
                    <StarOutlined className="text-white text-xs" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">评价奖励</h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  完成评价可能获得 <span className="text-[#E41E25] font-bold">100元</span>优惠券，优质评价有机会获得额外奖励。
                </p>
                <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                  优惠券可是个好东西
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default EvaluationPage;
