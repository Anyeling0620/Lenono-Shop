// 文件路径: src/pages/Checkout.tsx

import React, { useState, useRef } from 'react';
import { 
  PlusOutlined, 
  CheckCircleFilled, 
  InfoCircleOutlined,
  DownOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { Modal, Form, Input, Checkbox, Select, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
// 1. 引入封装好的地址选择器组件
import AddressSelector from '../component/AddressSelector';

const { Option } = Select;

// 定义地址类型
interface Address {
  id: string;
  name: string;
  phone: string;
  region: string[]; // 存代码
  regionLabels?: string[]; // 存中文名称 (用于展示)
  detail: string;
  isDefault: boolean;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalCount, totalPrice, clearCart } = useCart();

  // --- 状态管理 ---
  const [payMethod, setPayMethod] = useState('online'); 
  const [couponTab, setCouponTab] = useState<'coupon' | 'code' | 'bean'>('coupon'); 
  const [remark, setRemark] = useState(''); 
  
  // 弹窗控制
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  
  // 发票状态
  const [invoiceType, setInvoiceType] = useState('electronic'); 
  const [invoiceHeader, setInvoiceHeader] = useState('personal'); 
  
  // 商品行下拉面板控制
  const [openPanelId, setOpenPanelId] = useState<string | null>(null);
  const [openPanelType, setOpenPanelType] = useState<"service" | "gift" | "coupon" | null>(null);

  // 地址列表状态
  const [addressList, setAddressList] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  // 临时存储选中的地址中文名称 (用于解决列表显示问题)
  const tempRegionLabels = useRef<string[]>([]);

  const [addressForm] = Form.useForm();
  const [invoiceForm] = Form.useForm();

  const shippingFee = 0; 
  const discount = 0;    
  const finalPrice = totalPrice + shippingFee - discount;

  const handleTogglePanel = (id: string, type: "service" | "gift" | "coupon") => {
    if (openPanelId === id && openPanelType === type) {
      setOpenPanelId(null);
      setOpenPanelType(null);
    } else {
      setOpenPanelId(id);
      setOpenPanelType(type);
    }
  };

  // 处理添加新地址
  const handleAddAddress = () => {
    addressForm.validateFields().then((values) => {
      // 这里的 values.region 可能是代码数组 (取决于 AddressSelector 的 value)
      // 我们使用 tempRegionLabels.current 来获取对应的中文名称
      const labels = tempRegionLabels.current.length > 0 ? tempRegionLabels.current : values.region;

      const newAddress: Address = {
        id: Date.now().toString(),
        name: values.name,
        phone: values.phone,
        region: values.region, // 保存原始值(可能是代码)
        regionLabels: labels,  // 保存中文名称用于展示
        detail: values.detail,
        isDefault: values.isDefault || false,
      };

      // 添加到列表
      setAddressList(prev => [...prev, newAddress]);
      // 自动选中新添加的地址
      setSelectedAddressId(newAddress.id);
      
      message.success('地址添加成功！');
      setIsAddressModalOpen(false);
      addressForm.resetFields();
      tempRegionLabels.current = []; // 重置临时标签
    }).catch(errorInfo => {
      console.log('Failed:', errorInfo);
    });
  };

  // 捕获地址选择器的变化，保存中文标签
  const onAddressChange = (_val: string[], selectedOptions: any[]) => {
    if (selectedOptions) {
      tempRegionLabels.current = selectedOptions.map(opt => opt.label);
    }
  };

  const handleSaveInvoice = () => {
    invoiceForm.validateFields().then(() => {
      message.success('发票信息已保存');
      setIsInvoiceModalOpen(false);
    });
  };

  const handleSubmitOrder = () => {
    if (items.length === 0) {
      message.error('购物车为空');
      return;
    }
    if (!selectedAddressId) {
      message.error('请选择收货地址');
      return;
    }
    const hide = message.loading('提交中...', 0);
    setTimeout(() => {
      hide();
      message.success('订单提交成功！');
      clearCart();
      navigate("/");
    }, 1000);
  };

  // 获取当前选中的地址对象，用于底部展示
  const currentAddress = addressList.find(addr => addr.id === selectedAddressId);

  // 辅助函数：获取显示用的地址字符串
  const getDisplayRegion = (addr: Address) => {
    // 优先使用 regionLabels (中文), 降级使用 region
    const parts = addr.regionLabels || addr.region;
    return parts.join(' '); // 用空格分隔
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-20 pt-5 font-sans text-[#333]" onClick={() => { setOpenPanelId(null); setOpenPanelType(null); }}>
      <div className="w-[1200px] mx-auto space-y-4">
        {/* 面包屑 */}
        <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
          <Link to="/">首页</Link> &gt; <Link to="/shopping-cart">购物车</Link> &gt; <span>填写订单</span>
        </div>
        
        {/* 1. 收货地址区域 */}
        <section className="bg-white p-6 shadow-sm">
          <h2 className="text-[18px] text-[#333] mb-5">收货地址</h2>
          <div className="flex flex-wrap gap-4">
            
            {/* 渲染已有的地址列表 */}
            {addressList.map(addr => (
              <div 
                key={addr.id}
                onClick={() => setSelectedAddressId(addr.id)}
                className={`w-[298px] h-[148px] border p-4 cursor-pointer relative transition-all bg-white hover:border-[#e1140a] ${selectedAddressId === addr.id ? 'border-[#e1140a] ring-1 ring-[#e1140a]' : 'border-[#e0e0e0]'}`}
              >
                <div className="flex justify-between items-center mb-3 border-b border-[#f0f0f0] pb-2">
                  <span className="font-bold text-sm truncate max-w-[100px]" title={getDisplayRegion(addr)}>
                    {/* 显示省份作为标题 (取第一个) */}
                    {(addr.regionLabels || addr.region)[0]} ({addr.name})
                  </span>
                  {addr.isDefault && <span className="text-xs bg-[#999] text-white px-1">默认</span>}
                </div>
                <div className="text-xs text-[#666] space-y-1">
                  <p>收货人：{addr.name}</p>
                  <p>电话：{addr.phone}</p>
                  <p className="line-clamp-2 h-[32px]">地址：{getDisplayRegion(addr)} {addr.detail}</p>
                </div>
                
                {selectedAddressId === addr.id && (
                  <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[20px] border-r-[20px] border-b-[#e1140a] border-r-[#e1140a] border-l-[20px] border-t-[20px] border-l-transparent border-t-transparent">
                    <CheckOutlined className="absolute bottom-[-20px] right-[-20px] text-white text-xs -translate-x-1 -translate-y-1" />
                  </div>
                )}
                {/* 选中状态下右下角的勾选标 */}
                {selectedAddressId === addr.id && (
                   <div className="absolute bottom-0 right-0">
                      <CheckCircleFilled className="text-[#e1140a] text-lg bg-white rounded-full" /> 
                   </div>
                )}
              </div>
            ))}

            {/* 添加新地址按钮 */}
            <div 
              onClick={() => setIsAddressModalOpen(true)}
              className="w-[298px] h-[148px] border border-[#e0e0e0] bg-[#f9f9f9] flex flex-col items-center justify-center cursor-pointer hover:border-[#ccc] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#e0e0e0] text-white flex items-center justify-center mb-2">
                <PlusOutlined />
              </div>
              <span className="text-[#999] text-sm">添加新地址</span>
            </div>
          </div>
        </section>

        {/* 2. 支付方式 */}
        <section className="bg-white p-6 shadow-sm">
          <h2 className="text-[18px] text-[#333] mb-5">支付方式</h2>
          <div className="flex gap-4">
            <button onClick={() => setPayMethod('online')} className={`px-8 py-2 border text-sm relative transition-all ${payMethod === 'online' ? 'border-[#e1140a] ring-1 ring-[#e1140a]' : 'border-[#e0e0e0] hover:border-[#e1140a]'}`}>
              在线支付
              {payMethod === 'online' && <CheckCircleFilled className="absolute bottom-[-8px] right-[-8px] text-[#e1140a] bg-white rounded-full" />}
            </button>
          </div>
        </section>

        {/* 3. 送货清单 */}
        <section className="bg-white p-6 shadow-sm">
          <div className="flex justify-between mb-5">
            <h2 className="text-[18px]">送货清单</h2>
            <Link to="/shopping-cart" className="text-xs text-blue-500">返回购物车 &gt;</Link>
          </div>
          <div className="bg-[#fbfcff] border border-[#f0f0f0]">
            <div className="p-5 border-b border-[#f0f0f0] font-bold text-sm">配送方式 <span className="ml-4 font-normal text-[#e1140a] border border-[#e1140a] px-2 text-xs bg-[#fff4f4]">快递配送</span></div>
            
            {items.length > 0 ? items.map((item) => (
              <div key={`${item.id}-${item.specText}`} className="relative p-5 border-b border-[#f0f0f0] flex items-start">
                <img src={item.image} alt={item.name} className="w-[100px] h-[100px] object-contain border border-[#eee] bg-white mr-4" />
                <div className="flex-1 pr-10">
                  <h4 className="text-sm mb-2 text-[#333]">{item.name}</h4>
                  <p className="text-xs text-gray-500 mb-2">规格：{item.specText}</p>
                  <div className="flex items-center gap-1 text-[#e57e33] text-xs">
                     <InfoCircleOutlined /> 支持7天无理由退换
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="mt-3 flex gap-2 text-xs">
                    <button onClick={(e) => { e.stopPropagation(); handleTogglePanel(item.id, 'service'); }} className="border border-[#e1140a] text-[#e1140a] px-2 py-0.5 bg-white hover:bg-[#fff0f0]">选择服务 <DownOutlined /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleTogglePanel(item.id, 'gift'); }} className="border border-[#e1140a] text-[#e1140a] px-2 py-0.5 bg-white hover:bg-[#fff0f0]">选择赠品 <DownOutlined /></button>
                  </div>

                  {/* 悬浮面板 */}
                  {openPanelId === item.id && (
                    <div className="absolute left-[130px] top-[120px] z-10 bg-white border border-[#ffd0bf] p-3 shadow-lg w-[300px]" onClick={e => e.stopPropagation()}>
                       <div className="text-[#e1140a] mb-2 font-bold text-xs">
                         {openPanelType === 'service' ? '可选服务' : '可选赠品'}
                       </div>
                       <div className="text-xs text-gray-600">暂无更多可选项</div>
                    </div>
                  )}
                </div>
                <div className="w-[150px] text-right">
                  <div className="text-[#e1140a] font-bold">¥{item.price}</div>
                  <div className="text-gray-500">x{item.count}</div>
                </div>
              </div>
            )) : <div className="p-10 text-center text-gray-400">购物车为空</div>}
          </div>
        </section>

        {/* 4. 发票信息 */}
        <section className="bg-white p-6 shadow-sm">
          <h2 className="text-[18px] text-[#333] mb-4">发票信息</h2>
          <div className="text-sm text-[#666] flex gap-8 items-center">
            <span>{invoiceType === 'electronic' ? '电子普通发票' : '专用发票'}</span>
            <span>{invoiceHeader === 'personal' ? '个人' : '单位'}</span>
            <span>商品明细</span>
            <span className="text-[#e1140a] cursor-pointer hover:underline" onClick={() => setIsInvoiceModalOpen(true)}>修改 &gt;</span>
          </div>
        </section>

        {/* 5. 优惠与备注 */}
        <section className="bg-white p-6 shadow-sm">
           <h2 className="text-[18px] text-[#333] mb-4 flex items-center gap-2">使用优惠</h2>
           <div className="flex border-b border-[#eee] mb-5">
             {['优惠券', '优惠码', '乐豆'].map((label, idx) => {
                const keys = ['coupon', 'code', 'bean'] as const;
                return (
                 <div key={label} onClick={() => setCouponTab(keys[idx])} className={`px-6 py-2 text-sm cursor-pointer border-b-2 transition-colors ${couponTab === keys[idx] ? 'border-[#e1140a] text-[#e1140a]' : 'border-transparent text-[#666]'}`}>
                   {label}
                 </div>
                );
             })}
           </div>
           {couponTab === 'coupon' && <div className="py-8 text-center text-[#999] text-sm">暂无可用优惠券</div>}
        </section>

        <section className="bg-white p-6 shadow-sm">
          <h2 className="text-[18px] text-[#333] mb-4">订单备注</h2>
          <textarea 
            value={remark} onChange={(e) => setRemark(e.target.value)} 
            placeholder="限100字" maxLength={100}
            className="border border-[#e0e0e0] p-2 text-sm w-full h-[80px] resize-none outline-none focus:border-[#e1140a]"
          />
        </section>

        {/* 6. 底部结算 */}
        <section className="bg-white p-8 shadow-sm flex flex-col items-end">
          <div className="text-right space-y-2 text-sm text-gray-600 mb-4 w-[300px]">
             <div className="flex justify-between"><span><span className="text-[#e1140a] mr-1">{totalCount}</span>件商品，总金额：</span><span>¥{totalPrice}</span></div>
             <div className="flex justify-between"><span>运费：</span><span>¥{shippingFee}</span></div>
             <div className="flex justify-between"><span>优惠：</span><span>- ¥{discount}</span></div>
          </div>
          <div className="bg-[#f9f9f9] w-full h-[1px] mb-6"></div>
          <div className="flex items-center gap-4 text-xl justify-end w-full">
             <span className="text-sm text-[#333]">实付款：</span>
             <span className="text-[#e1140a] font-bold text-3xl">¥{finalPrice}</span>
          </div>
          
          <div className="mt-6 text-right w-full">
              {/* 动态显示选中的地址 */}
              <div className="text-xs text-gray-500 mb-2 bg-[#fbfcff] p-2 border border-[#f0f0f0] inline-block">
                {currentAddress ? (
                  <>
                    寄送至：{getDisplayRegion(currentAddress)} {currentAddress.detail} &nbsp;&nbsp; 收货人：{currentAddress.name} {currentAddress.phone}
                  </>
                ) : (
                  <span className="text-[#e1140a]">请先添加并选择收货地址</span>
                )}
              </div>
              <div>
                <button 
                  onClick={handleSubmitOrder} 
                  className={`w-[160px] h-[46px] text-lg font-bold transition-colors ${items.length > 0 && selectedAddressId ? 'bg-[#e1140a] text-white hover:bg-[#c91008]' : 'bg-gray-300 text-white cursor-not-allowed'}`}
                  disabled={items.length === 0 || !selectedAddressId}
                >
                  提交订单
                </button>
              </div>
          </div>
        </section>
      </div>

      {/* --- 弹窗 1: 添加地址 (已使用 AddressSelector) --- */}
      <Modal
        title={<div className="text-base font-normal pb-2 border-b border-[#eee]">添加新地址</div>}
        open={isAddressModalOpen}
        onCancel={() => setIsAddressModalOpen(false)}
        footer={null}
        width={600}
        centered
        className="custom-modal"
      >
        <Form form={addressForm} layout="vertical" className="pt-6 px-4">
            <div className="flex gap-4">
                <Form.Item name="name" className="flex-1" label="姓名" required rules={[{ required: true, message: '请输入姓名' }]}>
                    <Input placeholder="姓名" size="large" className="rounded-none hover:border-[#e1140a] focus:border-[#e1140a]" />
                </Form.Item>
                <Form.Item name="phone" className="flex-1" label="手机号" required rules={[{ required: true, message: '请输入手机号' }, { pattern: /^1[3-9]\d{9}$/, message: '格式错误' }]}>
                    <Input placeholder="手机号" size="large" maxLength={11} className="rounded-none hover:border-[#e1140a] focus:border-[#e1140a]" />
                </Form.Item>
            </div>
            
            {/* 使用 AddressSelector 替换原有的 Cascader */}
            {/* onAddressChange 用于捕获选中项的详细对象（包含中文名称） */}
            <Form.Item 
                name="region" 
                label="所在地区" 
                required 
                rules={[{ required: true, message: '请选择地区' }]}
            >
                <AddressSelector 
                    placeholder="请选择省 / 市 / 区" 
                    onChange={onAddressChange} // 捕获中文名称
                />
            </Form.Item>

            <Form.Item name="detail" label="详细地址" required rules={[{ required: true, message: '请输入详细地址' }]}>
                <Input.TextArea placeholder="详细地址" className="rounded-none hover:border-[#e1140a] focus:border-[#e1140a] resize-none" rows={2} />
            </Form.Item>
            
            <Form.Item name="isDefault" valuePropName="checked">
                <Checkbox className="text-gray-500">设为默认地址</Checkbox>
            </Form.Item>
            
            <div className="flex justify-center gap-4 mt-6 pb-2">
                <button type="button" onClick={() => setIsAddressModalOpen(false)} className="w-[120px] h-[40px] bg-[#f2f2f2] text-[#666] hover:bg-[#e0e0e0] transition-colors">取消</button>
                <button type="button" onClick={handleAddAddress} className="w-[120px] h-[40px] bg-[#e1140a] text-white hover:bg-[#c91008] transition-colors">保存</button>
            </div>
        </Form>
      </Modal>

      {/* --- 弹窗 2: 发票信息 --- */}
      <Modal
        title={<div className="flex justify-between items-center pb-2 border-b border-[#eee]"><span className="text-base font-normal">发票信息</span><span className="text-xs text-[#0093e6] cursor-pointer hover:underline">发票须知</span></div>}
        open={isInvoiceModalOpen}
        onCancel={() => setIsInvoiceModalOpen(false)}
        footer={null}
        width={680}
        centered
        className="custom-modal"
      >
        <div className="bg-[#fff7e8] text-[#ff6600] text-xs p-2 text-center mb-4">🔔 企业用户开增值税发票可获取企业积分</div>
        <Form form={invoiceForm} layout="horizontal" className="px-6 pb-6">
            <Form.Item label="发票类型" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <div className="flex gap-4">
                    <div onClick={() => setInvoiceType('electronic')} className={`px-6 py-2 border cursor-pointer text-sm transition-colors ${invoiceType === 'electronic' ? 'border-[#e1140a] text-[#e1140a]' : 'border-[#ddd] hover:border-[#e1140a]'}`}>电子普通发票</div>
                    <div onClick={() => setInvoiceType('special')} className={`px-6 py-2 border cursor-pointer text-sm transition-colors ${invoiceType === 'special' ? 'border-[#e1140a] text-[#e1140a]' : 'border-[#ddd] hover:border-[#e1140a]'}`}>专用发票</div>
                </div>
            </Form.Item>
            <Form.Item label="发票抬头" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <div className="flex gap-4 mb-3">
                    <div onClick={() => setInvoiceHeader('personal')} className={`px-8 py-2 border cursor-pointer text-sm transition-colors ${invoiceHeader === 'personal' ? 'border-[#e1140a] text-[#e1140a]' : 'border-[#ddd] hover:border-[#e1140a]'}`}>个人</div>
                    <div onClick={() => setInvoiceHeader('unit')} className={`px-8 py-2 border cursor-pointer text-sm transition-colors ${invoiceHeader === 'unit' ? 'border-[#e1140a] text-[#e1140a]' : 'border-[#ddd] hover:border-[#e1140a]'}`}>单位</div>
                </div>
                <Input value={invoiceHeader === 'personal' ? '个人' : ''} disabled={invoiceHeader === 'personal'} placeholder="请输入单位名称" size="large" className="rounded-none w-full hover:border-[#e1140a] focus:border-[#e1140a]" />
            </Form.Item>
            <Form.Item label="收票人" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <div className="space-y-3">
                    <Input placeholder="选填，请输入收票人电话" size="large" className="rounded-none hover:border-[#e1140a] focus:border-[#e1140a]" />
                    <Input placeholder="选填，用来接收数电票和电子票邮件" size="large" className="rounded-none hover:border-[#e1140a] focus:border-[#e1140a]" />
                </div>
            </Form.Item>
            <div className="flex justify-center gap-6 mt-8">
                <button type="button" onClick={handleSaveInvoice} className="w-[140px] h-[40px] bg-[#e1140a] text-white hover:bg-[#c91008] transition-colors">确定</button>
                <button type="button" onClick={() => setIsInvoiceModalOpen(false)} className="w-[140px] h-[40px] bg-white border border-[#ddd] text-[#333] hover:border-[#aaa] transition-colors">取消</button>
            </div>
        </Form>
      </Modal>

      <style>{`
        .custom-modal .ant-modal-content { padding: 0; border-radius: 0; }
        .custom-modal .ant-modal-header { margin-bottom: 0; border-radius: 0; }
        .ant-select-selector { border-radius: 0 !important; }
        .ant-form-item-label > label { color: #666; }
        /* 覆盖 AddressSelector 样式以匹配 Modal */
        .address-selector-container .address-cascader { width: 100% !important; max-width: none !important; }
      `}</style>
    </div>
  );
};

export default Checkout;