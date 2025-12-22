/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { lazy, Suspense } from 'react';
import { Modal, Form, Input, Checkbox, Spin } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import type { UserAddressItem } from '../../types/address';

// 延迟加载 AddressSelector 组件
const AddressSelector = lazy(() => import('../AddressSelector'));

interface AddressModalProps {
  open: boolean;
  editingAddress: UserAddressItem | null;
  onCancel: () => void;
  onSave: () => void;  
  form: any;
  tempRegionLabelsRef: React.MutableRefObject<string[]>; // 重命名为以 Ref 结尾
}

const AddressModal: React.FC<AddressModalProps> = ({
  open,
  editingAddress,
  onCancel,
  onSave,
  form,
  tempRegionLabelsRef, // 重命名为以 Ref 结尾
}) => {
  return (
    <Modal
      title={
        <div className="text-base font-normal pb-2 border-b border-[#eee]">
          {editingAddress ? '编辑收货地址' : '新增收货地址'}
        </div>
      }
      open={open}
      onCancel={onCancel}
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
              收货人:
            </span>
          }
          rules={[{ required: true, message: '请输入收货人姓名' }]}
        >
          <Input 
            placeholder="收货人" 
            size="large" 
            className="rounded-none hover:border-[#e1140a] focus:border-[#e1140a]" 
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label={
            <span>
              手机号:
            </span>
          }
          rules={[
            { required: true, message: '请输入手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误' },
          ]}
        >
          <Input 
            placeholder="手机号" 
            size="large" 
            maxLength={11} 
            className="rounded-none hover:border-[#e1140a] focus:border-[#e1140a]" 
          />
        </Form.Item>

        <Form.Item
          name="region"
          label={
            <span>
              地址:
            </span>
          }
          rules={[{ required: true, message: "请选择地址" }]}
        >
          <Suspense fallback={<Spin size="small" />}>
            <AddressSelector
              placeholder="请选择省/市/区/街道"
              value={form.getFieldValue('region')}
              onChange={(value, selectedOptions) => {
                // 1. 先设置表单字段值
                form.setFieldsValue({ region: value });

                // 2. 再存储标签
                if (selectedOptions && selectedOptions.length > 0) {
                  tempRegionLabelsRef.current = selectedOptions.map(
                    (opt: any) => opt.label as string
                  );
                } else {
                  tempRegionLabelsRef.current = value;
                }
              }}
            />
          </Suspense>
        </Form.Item>

        <Form.Item
          name="detail"
          label={
            <span>
              详细地址:
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
            onClick={onCancel}
            className="w-[120px] h-[40px] bg-[#f2f2f2] text-[#666] hover:bg-[#e0e0e0] transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={onSave}
            className="w-[120px] h-[40px] bg-[#e1140a] text-white hover:bg-[#c91008] transition-colors"
          >
            保存收货地址
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddressModal;
