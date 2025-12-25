import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Upload,
  Button,
  message,
  Modal,
  Divider,
  Select
} from 'antd';
import {
  UploadOutlined,
  CameraOutlined,
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  MessageOutlined
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { RcFile } from 'antd/es/upload';
import { afterSaleService } from '../services/afterSale';
import type { ComplaintPageState } from '../types/afterSale';
import globalErrorHandler from '../utils/globalAxiosErrorHandler';
import toast from 'react-hot-toast';

const { TextArea } = Input;
const { Option } = Select;
interface FormValues {
  type: string;
  content: string;
}
const ComplaintPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [afterSaleInfo, setAfterSaleInfo] = useState<any>(null);
  
  // 从state获取参数
   const state = location.state as ComplaintPageState | undefined;
  const { afterSaleId } = state || {};

  // 投诉类型选项
  const complaintTypes = [
    { value: '处理不及时', label: '处理不及时' },
    { value: '服务态度差', label: '服务态度差' },
    { value: '处理结果不满意', label: '处理结果不满意' },
    { value: '物流问题', label: '物流问题' },
    { value: '其他问题', label: '其他问题' }
  ];

  // 验证参数并获取售后信息
  useEffect(() => {
    if (!afterSaleId) {
      message.error('参数错误，请从售后详情页进入');
      navigate('/after-sale');
      return;
    }

    // 这里应该调用API获取售后信息
    // 暂时使用模拟数据
    setAfterSaleInfo({
      afterSaleNo: 'AS202312250001',
      type: '退货',
      status: '已完成',
      reason: '商品质量问题',
      applyTime: '2023-12-25 10:30:00'
    });
  }, [afterSaleId, navigate]);

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

  // 提交投诉
  const handleSubmit = async (values: FormValues) => {
    if (!afterSaleId) {
      message.error('参数错误');
      return;
    }

    // 验证图片数量
    if (fileList.length > 6) {
      message.warning('最多只能上传6张图片');
      return;
    }

    Modal.confirm({
      title: '确认提交投诉？',
      icon: <ExclamationCircleOutlined />,
      content: '提交后客服将尽快处理您的投诉',
      okText: '确认提交',
      cancelText: '再检查一下',
      okButtonProps: {
        style: { backgroundColor: '#ff6b35', borderColor: '#ff6b35' }
      },
      onOk: async () => {
        try {
          setSubmitting(true);
          
          // 提取有效的图片文件
          const imageFiles = fileList
            .filter(file => file.originFileObj && file.status === 'done')
            .map(file => file.originFileObj as File);

          await afterSaleService.createComplaint({
            afterSaleId,
            content: values.content,
            imageFiles
          });

          message.success('投诉提交成功！');
          
          // 显示成功提示
          Modal.success({
            title: '投诉已提交',
            content: (
              <div className="space-y-2">
                <p>您的投诉已成功提交，客服将在24小时内处理。</p>
                <p className="text-sm text-gray-600">
                  您可以在售后详情中查看投诉处理进度
                </p>
              </div>
            ),
            okText: '返回售后详情',
            okButtonProps: {
              style: { backgroundColor: '#ff6b35', borderColor: '#ff6b35' }
            },
            onOk: () => {
              navigate(`/after-sale/${afterSaleId}`);
            }
          });
        } catch (error) {
         globalErrorHandler.handle(error,toast.error)
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
    if (afterSaleId) {
      navigate(`/after-sale/${afterSaleId}`);
    } else {
      navigate('/after-sale');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="mx-auto px-4" style={{ maxWidth: '800px' }}>
        {/* 头部 */}
        <div className="mb-6">
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="text-gray-600 hover:text-red-600 mb-4"
          >
            返回售后详情
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">投诉售后</h1>
          <p className="text-gray-600">请描述您遇到的问题，我们将尽快处理</p>
        </div>

        {/* 售后信息卡片 */}
        {afterSaleInfo && (
         
          <Card className="mb-6 shadow-sm border-0">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MessageOutlined className="text-red-600" />
                <h3 className="text-lg font-bold text-gray-900">售后信息</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">售后单号</p>
                  <p className="font-medium">{afterSaleInfo.afterSaleNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">售后类型</p>
                  <p className="font-medium">{afterSaleInfo.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">当前状态</p>
                  <p className="font-medium">{afterSaleInfo.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">申请时间</p>
                  <p className="font-medium">{afterSaleInfo.applyTime}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">申请原因</p>
                <p className="font-medium">{afterSaleInfo.reason}</p>
              </div>
            </div>
          </Card>
        )}

        {/* 投诉表单 */}
        <Card className="shadow-sm border-0 mb-6">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ type: '处理不及时' }}
          >
            {/* 投诉类型 */}
            <Form.Item
              label={
                <div className="font-medium text-gray-900 mb-2">投诉类型</div>
              }
              name="type"
              rules={[{ required: true, message: '请选择投诉类型' }]}
            >
              <Select
                placeholder="请选择投诉类型"
                size="large"
                className="w-full"
              >
                {complaintTypes.map((type) => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Divider />

            {/* 投诉内容 */}
            <Form.Item
              label={
                <div className="font-medium text-gray-900 mb-2">投诉内容</div>
              }
              name="content"
              rules={[
                { required: true, message: '请输入投诉内容' },
                { min: 20, message: '请详细描述问题，至少20个字符' },
                { max: 1000, message: '描述最多1000个字符' }
              ]}
              extra="请详细描述您遇到的问题，包括时间、具体经过、期望的解决方案等"
            >
              <TextArea
                rows={6}
                placeholder="请详细描述您遇到的问题，包括：\n1. 问题发生的时间\n2. 具体经过\n3. 与客服的沟通情况\n4. 您的期望解决方案"
                showCount
                maxLength={1000}
                className="resize-none"
              />
            </Form.Item>

            {/* 图片凭证 */}
            <Form.Item
              label={
                <div className="flex items-center gap-2 mb-2">
                  <CameraOutlined className="text-red-600" />
                  <span className="font-medium text-gray-900">上传凭证</span>
                  <span className="text-sm text-gray-500">（可选，最多6张）</span>
                </div>
              }
              extra="请上传相关凭证，如聊天记录截图、问题照片等"
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
                  <div className="flex flex-col items-center justify-center">
                    <UploadOutlined className="text-2xl text-gray-400 mb-2" />
                    <div className="text-sm text-gray-500">上传图片</div>
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
            >
              <img alt="预览" style={{ width: '100%' }} src={previewImage} />
            </Modal>

            {/* 投诉须知 */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="flex items-start gap-2">
                <ExclamationCircleOutlined className="text-blue-500 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-700">投诉须知：</p>
                  <ul className="text-xs text-blue-600 space-y-1">
                    <li>• 请客观真实地描述问题，避免夸大或虚假陈述</li>
                    <li>• 提供准确的证据有助于快速解决问题</li>
                    <li>• 客服将在24小时内响应您的投诉</li>
                    <li>• 请保持手机畅通，客服可能会与您联系</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 提交按钮 */}
            <Form.Item>
              <div className="flex gap-4">
                <Button
                  onClick={() => navigate(`/after-sale/${afterSaleId}`)}
                  className="flex-1 h-12 font-medium border-gray-300 hover:border-red-500 hover:text-red-600"
                >
                  取消
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  className="flex-1 h-12 font-medium"
                  style={{ backgroundColor: '#ff6b35', borderColor: '#ff6b35' }}
                >
                  {submitting ? '提交中...' : '提交投诉'}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>

        {/* 投诉处理流程 */}
        <Card className="shadow-sm border-0 border-gray-200">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">投诉处理流程：</h4>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-medium shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium mb-1">提交投诉</p>
                  <p>填写投诉表单，描述问题并提供相关证据</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-medium shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium mb-1">客服受理</p>
                  <p>客服将在24小时内受理您的投诉，并联系您了解情况</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-medium shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium mb-1">问题调查</p>
                  <p>客服将调查核实问题，并与相关部门沟通</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-medium shrink-0">
                  4
                </div>
                <div>
                  <p className="font-medium mb-1">解决方案</p>
                  <p>客服将提出解决方案，并与您沟通确认</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-medium shrink-0">
                  5
                </div>
                <div>
                  <p className="font-medium mb-1">处理完成</p>
                  <p>问题解决后，客服将关闭投诉工单</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ComplaintPage;
