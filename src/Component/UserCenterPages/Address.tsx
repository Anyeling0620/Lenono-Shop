/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react';
import { Form, message, Pagination, Popconfirm, Tag } from 'antd';
import { EditOutlined, CloseOutlined, CheckCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  getUserAddressList,
  addAddress,
  updateAddress,
  removeAddress,
  setDefaultAddress,
} from '../../services/address';
import type { AddressPayload, UserAddressItem } from '../../types/address';
import globalErrorHandler from '../../utils/globalAxiosErrorHandler';
import toast from 'react-hot-toast';
import AddressModal from './AddressModal';
import { Loading } from '../LoadingFallback';

const Address: React.FC = () => {
  const [addressList, setAddressList] = useState<UserAddressItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddressItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3; // 每页显示5条

  const [form] = Form.useForm();
  const tempRegionLabels = useRef<string[]>([]);

  // 确保 addressList 是数组
  const safeAddressList = Array.isArray(addressList) ? addressList : [];

  // 计算分页数据
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentAddressList = safeAddressList.slice(startIndex, endIndex);

  // 加载地址列表
  const loadAddressList = async () => {
    setLoading(true);
    try {
      const data = await getUserAddressList();
      setAddressList(data.list);
    } catch (error) {
      globalErrorHandler.handle(error, toast.error)
      setAddressList([]);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载地址列表
  useEffect(() => {
    loadAddressList();
  }, []);

  // 打开新增地址模态框
  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
    form.resetFields();
    tempRegionLabels.current = [];
  };

  // 打开编辑地址模态框 - 修复地址选择器回显问题
  const handleEditAddress = (address: UserAddressItem) => {
    setEditingAddress(address);
    setIsModalOpen(true);

    // 使用 setTimeout 确保在模态框打开后设置表单值
    setTimeout(() => {
      form.setFieldsValue({
        name: address.receiver,
        phone: address.phone,
        region: [
          address.province?.code || '',
          address.city?.code || '',
          address.area?.code || '',
          address.street?.code || ''
        ],
        detail: address.address,
        isDefault: address.isDefault,
      });

      // 设置临时标签，用于地址选择器的显示
      tempRegionLabels.current = [
        address.province?.name || '',
        address.city?.name || '',
        address.area?.name || '',
        address.street?.name || ''
      ];

      // 如果 AddressSelector 支持 labelInValue 模式，可以这样设置
      // 假设 AddressSelector 支持 value 为对象数组 [{value: code, label: name}, ...]
      const regionValue = [
        { value: address.province?.code || '', label: address.province?.name || '' },
        { value: address.city?.code || '', label: address.city?.name || '' },
        { value: address.area?.code || '', label: address.area?.name || '' },
        { value: address.street?.code || '', label: address.street?.name || '' }
      ];

      // 尝试设置对象格式的值
      form.setFieldsValue({ region: regionValue });
    }, 100);
  };

  // 删除地址
  const handleDeleteAddress = async (id: string) => {
    try {
      await removeAddress(id);
      await loadAddressList();
      // 如果删除后当前页没有数据，跳转到上一页
      if (currentAddressList.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      message.success('删除成功');
    } catch (error) {
      globalErrorHandler.handle(error,toast.error)
    }
  };

  // 设为默认地址
  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
      await loadAddressList();
      message.success('设置默认地址成功');
    } catch (error) {
      globalErrorHandler.handle(error,toast.error)
    }
  };

  // 保存地址（新增或编辑）
  const handleSaveAddress = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      // 处理 region 值，可能是对象数组或字符串数组
      let regionValues = values.region;
      if (Array.isArray(regionValues) && regionValues.length > 0) {
        // 如果是对象数组，提取 value
        if (typeof regionValues[0] === 'object' && regionValues[0].value) {
          regionValues = regionValues.map((item: any) => item.value || '');
        }
      }

      // 构建 API 请求参数
      const addressPayload: AddressPayload = {
        provinceCode: regionValues[0] || '',
        cityCode: regionValues[1] || '',
        areaCode: regionValues[2] || '',
        streetCode: regionValues[3] || '',
        address: values.detail,
        receiver: values.name,
        phone: values.phone,
        isDefault: values.isDefault || false
      };

      if (editingAddress) {
        // 编辑模式
        await updateAddress(editingAddress.id, addressPayload);
      } else {
        // 新增模式
        await addAddress(addressPayload);
      }

      // 重新加载地址列表
      await loadAddressList();
      setIsModalOpen(false);
      form.resetFields();
      tempRegionLabels.current = [];
    } catch (errorInfo) {
      globalErrorHandler.handle(errorInfo, toast.error)
    }
  };

  // 关闭模态框
  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    tempRegionLabels.current = [];
  };

  // 获取显示用的地址字符串
  const getDisplayRegion = (addr: UserAddressItem) => {
    const provinceName = addr.province?.name || '';
    const cityName = addr.city?.name || '';
    const areaName = addr.area?.name || '';
    const streetName = addr.street?.name || '';
    return `${provinceName}${cityName}${areaName}${streetName}`;
  };

  // 分页变化处理
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white min-h-[600px]">
      <div className="border-b border-gray-200 pb-4 mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">我的收货地址</h2>
          <p className="text-sm text-gray-500">
            设置便捷的购物信息，您可以在商品页直接下单，让购物简单快乐！
          </p>
        </div>

        {/* 新增地址按钮 - 移到右上角 */}
        <button
          onClick={handleAddAddress}
          className="px-6 py-2 bg-[#e1140a] mt-6 text-white hover:bg-[#c91008] transition-colors text-sm flex items-center gap-2"
        >
          <PlusOutlined />
          新增收货地址
        </button>
      </div>

      {/* 加载状态 */}
      {loading && (
        <Loading />
      )}

      {/* 地址列表 */}
      {!loading && (
        <div className="h-[580px] space-y-4  overflow-y-auto pb-2 pr-[6px] 
    [&::-webkit-scrollbar]:w-1
    [&::-webkit-scrollbar-track]:rounded-xl
    [&::-webkit-scrollbar-track]:bg-gray-100
    [&::-webkit-scrollbar-thumb]:rounded-xl
    [&::-webkit-scrollbar-thumb]:bg-gray-300
    [&::-webkit-scrollbar-thumb:hover]:bg-gray-400
    [&::-webkit-scrollbar-button]:hidden
">
          {currentAddressList.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p>暂无收货地址，请添加</p>
            </div>
          ) : (
            currentAddressList.map((address) => (
              <div
                key={address.id}
                className={`border border-gray-200 bg-white p-5 relative hover:shadow-md transition-shadow ${address.isDefault ? 'border-l-4 border-l-[#e1140a]' : ''}`}
              >
                {/* 默认地址角标 */}
                {address.isDefault && (
                  <div className="absolute top-0 left-0">
                    <Tag
                      color="#e1140a"
                      className="rounded-none text-white text-xs font-medium px-2 py-1"
                      style={{ borderTopLeftRadius: '0', borderBottomRightRadius: '4px' }}
                    >
                      <CheckCircleOutlined className="mr-1" />
                      默认地址
                    </Tag>
                  </div>
                )}

                {/* 删除按钮 - 使用 Popconfirm */}
                <Popconfirm
                  title="确认删除"
                  description="确定要删除该收货地址吗？"
                  onConfirm={() => handleDeleteAddress(address.id)}
                  okText="确定"
                  cancelText="取消"
                  placement="topRight"
                >
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <CloseOutlined />
                  </button>
                </Popconfirm>

                {/* 地址信息 */}
                <div className={`pr-8 ${address.isDefault ? 'pt-3' : ''}`}>
                  {/* 第一行：地址摘要 */}
                  <div className="mb-2 text-gray-700">
                    {address.receiver} {getDisplayRegion(address)} {address.address}
                  </div>

                  <div className="flex justify-between relative">
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>
                        <span className="text-gray-500">收货人：</span>
                        <span>{address.receiver}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">所在地区：</span>
                        <span>{getDisplayRegion(address)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">详细地址：</span>
                        <span>{address.address}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">手机：</span>
                        <span>{address.phone}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-0 right-0">
                      <div className="flex gap-4">
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



                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 分页 - 使用 Ant Design Pagination */}
      {!loading && safeAddressList.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            current={currentPage}
            total={safeAddressList.length}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
            // showQuickJumper
            showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
            className="custom-pagination"
          />
        </div>
      )}

      {/* 使用封装的模态框组件 */}
      <AddressModal
        open={isModalOpen}
        editingAddress={editingAddress}
        onCancel={handleModalCancel}
        onSave={handleSaveAddress}
        form={form}
        tempRegionLabelsRef={tempRegionLabels}
      />
    </div>
  );
};

export default Address;
