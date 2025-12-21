import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { Modal, Form, Input, Checkbox, message, Spin } from 'antd';
import { EditOutlined, CloseOutlined } from '@ant-design/icons';

// 延迟加载 AddressSelector 组件，避免阻塞页面加载
const AddressSelector = lazy(() => import('../AddressSelector'));

// 定义地址类型
interface Address {
  id: string;
  name: string;
  phone: string;
  fixedPhone?: string;
  region: string[]; // 存代码
  regionLabels?: string[]; // 存中文名称 (用于展示)
  detail: string;
  email?: string;
  isDefault: boolean;
}

const Address: React.FC = () => {
  const [addressList, setAddressList] = useState<Address[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputValue, setPageInputValue] = useState<string>('1');
  const pageSize = 5; // 每页显示5条

  const [form] = Form.useForm();
  const tempRegionLabels = useRef<string[]>([]);

  // 计算分页数据
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentAddressList = addressList.slice(startIndex, endIndex);
  const totalPages = Math.ceil(addressList.length / pageSize);

  // 同步页码输入框的值
  useEffect(() => {
    setPageInputValue(currentPage.toString());
  }, [currentPage]);

  // 打开新增地址模态框
  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
    form.resetFields();
    tempRegionLabels.current = [];
  };

  // 打开编辑地址模态框
  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
    form.setFieldsValue({
      name: address.name,
      phone: address.phone,
      fixedPhone: address.fixedPhone || '',
      region: address.region,
      detail: address.detail,
      email: address.email || '',
      isDefault: address.isDefault,
    });
    tempRegionLabels.current = address.regionLabels || [];
  };

  // 删除地址
  const handleDeleteAddress = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该收货地址吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const newList = addressList.filter(addr => addr.id !== id);
        setAddressList(newList);
        // 如果删除后当前页没有数据，跳转到上一页
        if (currentAddressList.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        message.success('删除成功');
      },
    });
  };

  // 设为默认地址
  const handleSetDefault = (id: string) => {
    const newList = addressList.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    setAddressList(newList);
    message.success('设置默认地址成功');
  };

  // 保存地址（新增或编辑）
  const handleSaveAddress = () => {
    form.validateFields().then((values) => {
      const labels = tempRegionLabels.current.length > 0 ? tempRegionLabels.current : values.region;

      if (editingAddress) {
        // 编辑模式
        const newList = addressList.map(addr =>
          addr.id === editingAddress.id
            ? {
                ...addr,
                name: values.name,
                phone: values.phone,
                fixedPhone: values.fixedPhone || undefined,
                region: values.region,
                regionLabels: labels,
                detail: values.detail,
                email: values.email || undefined,
                isDefault: values.isDefault || false,
              }
            : {
                ...addr,
                // 如果设置为默认，其他地址取消默认
                isDefault: values.isDefault ? false : addr.isDefault,
              }
        );
        setAddressList(newList);
        message.success('地址修改成功');
      } else {
        // 新增模式
        const newAddress: Address = {
          id: Date.now().toString(),
          name: values.name,
          phone: values.phone,
          fixedPhone: values.fixedPhone || undefined,
          region: values.region,
          regionLabels: labels,
          detail: values.detail,
          email: values.email || undefined,
          isDefault: values.isDefault || false,
        };

        // 如果设置为默认，其他地址取消默认
        const newList = addressList.map(addr => ({
          ...addr,
          isDefault: values.isDefault ? false : addr.isDefault,
        }));
        newList.push(newAddress);
        setAddressList(newList);
        message.success('地址添加成功');
      }

      setIsModalOpen(false);
      form.resetFields();
      tempRegionLabels.current = [];
    }).catch(errorInfo => {
      console.log('Failed:', errorInfo);
    });
  };


  // 获取显示用的地址字符串
  const getDisplayRegion = (addr: Address) => {
    const parts = addr.regionLabels || addr.region;
    return parts.join('');
  };

  // 跳转到指定页
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setPageInputValue(page.toString());
    }
  };

  // 确认跳转到输入框指定的页面
  const handleConfirmPageJump = () => {
    const page = parseInt(pageInputValue);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setPageInputValue(currentPage.toString());
      message.warning(`请输入1-${totalPages}之间的页码`);
    }
  };

  return (
    <div className="bg-white min-h-[600px]">
      {/* 页面标题 */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">我的收货地址</h2>
        <p className="text-sm text-gray-500">
          设置便捷的购物信息，您可以在商品页直接下单，让购物简单快乐！
        </p>
      </div>

      {/* 新增地址按钮 */}
      <div className="mb-6">
        <button
          onClick={handleAddAddress}
          className="px-6 py-2 bg-[#e1140a] text-white hover:bg-[#c91008] transition-colors text-sm"
        >
          新增收货地址
        </button>
      </div>

      {/* 地址列表 */}
      <div className="space-y-4">
        {currentAddressList.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p>暂无收货地址，请添加</p>
          </div>
        ) : (
          currentAddressList.map((address) => (
            <div
              key={address.id}
              className="border border-gray-200 bg-white p-5 relative hover:shadow-md transition-shadow"
            >
              {/* 删除按钮 */}
              <button
                onClick={() => handleDeleteAddress(address.id)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
              >
                <CloseOutlined />
              </button>

              {/* 地址信息 */}
              <div className="pr-8">
                {/* 第一行：地址摘要 */}
                <div className="mb-4 text-gray-700">
                  {address.name} {getDisplayRegion(address)} {address.detail}
                </div>

                {/* 详细信息 */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div>
                    <span className="text-gray-500">收货人：</span>
                    <span>{address.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">所在地区：</span>
                    <span>{getDisplayRegion(address)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">地址：</span>
                    <span>{address.detail}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">手机：</span>
                    <span>{address.phone}</span>
                  </div>
                  {address.email && (
                    <div>
                      <span className="text-gray-500">邮箱：</span>
                      <span>{address.email}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">是否默认：</span>
                    <span>{address.isDefault ? '是' : '否'}</span>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="text-blue-500 hover:text-blue-600 flex items-center gap-1 text-sm"
                  >
                    <EditOutlined />
                    编辑
                  </button>
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="text-blue-500 hover:text-blue-600 text-sm"
                    >
                      设为默认地址
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 分页 */}
      {addressList.length > 0 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-1 border ${
              currentPage === 1
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 hover:border-blue-500 hover:text-blue-500'
            } transition-colors`}
          >
            上一页
          </button>
          <span className="text-gray-600">{currentPage}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-1 border ${
              currentPage === totalPages
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 hover:border-blue-500 hover:text-blue-500'
            } transition-colors`}
          >
            下一页
          </button>
          <span className="text-gray-500 text-sm">共{totalPages}页</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">到第</span>
            <Input
              type="number"
              min={1}
              max={totalPages}
              value={pageInputValue}
              onChange={(e) => {
                setPageInputValue(e.target.value);
              }}
              onPressEnter={handleConfirmPageJump}
              className="w-16 text-center"
            />
            <span className="text-gray-500 text-sm">页</span>
            <button
              onClick={handleConfirmPageJump}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm transition-colors"
            >
              确定
            </button>
          </div>
        </div>
      )}

      {/* 编辑/新增地址模态框 */}
      <Modal
      maskStyle={{ backdropFilter: "none" }}
        title={
          <div className="text-base font-normal pb-2 border-b border-[#eee] text-blue-500 underline">
            {editingAddress ? '编辑收货地址' : '新增收货地址'}
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          tempRegionLabels.current = [];
        }}
        footer={null}
        width={600}
        centered
        className="custom-modal"
        closeIcon={<CloseOutlined className="text-gray-400" />}
      >
        <Form form={form} layout="vertical" className="pt-6 px-4">
          <Form.Item
            name="name"
            label={
              <span>
                <span className="text-red-500">*</span> 收货人:
              </span>
            }
            rules={[{ required: true, message: '请输入收货人姓名' }]}
          >
            <Input placeholder="收货人" size="large" className="rounded-none hover:border-[#e1140a] focus:border-[#e1140a]" />
          </Form.Item>

          <Form.Item
            name="phone"
            label={
              <span>
                <span className="text-red-500">*</span> 手机号:
              </span>
            }
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误' },
            ]}
          >
            <Input placeholder="手机号" size="large" maxLength={11} className="rounded-none hover:border-[#e1140a] focus:border-[#e1140a]" />
          </Form.Item>

          <Form.Item
            name="region"
            label={
              <span>
                <span className="text-red-500">*</span> 地址:
              </span>
            }
            rules={[{ required: true, message: "请选择地址" }]}
          >
            {/* 延迟加载 AddressSelector，避免阻塞页面 */}
            <Suspense fallback={<Spin size="small" />}>
              <AddressSelector
                placeholder="请选择省/市/区/街道"
                onChange={(value, selectedOptions) => {
                  if (selectedOptions && selectedOptions.length > 0) {
                    tempRegionLabels.current = selectedOptions.map(
                      (opt: any) => opt.label as string
                    );
                  } else {
                    // 兜底：直接使用编码数组
                    tempRegionLabels.current = value;
                  }
                }}
              />
            </Suspense>
          </Form.Item>

          <Form.Item
            name="detail"
            label={
              <span>
                <span className="text-red-500">*</span> 详细地址:
              </span>
            }
            rules={[{ required: true, message: '请输入详细地址' }]}
          >
            <Input.TextArea
              placeholder="详细地址"
              className="rounded-none hover:border-[#e1140a] focus:border-[#e1140a] resize-none"
              rows={2}
            />
          </Form.Item>

          <Form.Item name="isDefault" valuePropName="checked">
            <Checkbox className="text-gray-500">设为默认地址</Checkbox>
          </Form.Item>

          <div className="flex justify-center gap-4 mt-6 pb-2">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                form.resetFields();
                tempRegionLabels.current = [];
              }}
              className="w-[120px] h-[40px] bg-[#f2f2f2] text-[#666] hover:bg-[#e0e0e0] transition-colors"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSaveAddress}
              className="w-[120px] h-[40px] bg-[#e1140a] text-white hover:bg-[#c91008] transition-colors"
            >
              保存收货地址
            </button>
          </div>
        </Form>
      </Modal>

      <style>{`
        .custom-modal .ant-modal-content { padding: 0; border-radius: 0; }
        .custom-modal .ant-modal-header { margin-bottom: 0; border-radius: 0; }
        .ant-form-item-label > label { color: #666; }
        .address-selector-container { width: 100% !important; max-width: none !important; }
      `}</style>
    </div>
  );
};

export default Address;
