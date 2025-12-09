// 文件路径: src/pages/Checkout.tsx

import React, { useState, useMemo } from 'react';
import { 
  PlusOutlined, 
  CheckCircleFilled, 
  InfoCircleOutlined,
  QuestionCircleOutlined,
  DownOutlined
} from '@ant-design/icons';
import { Modal, Form, Input, Checkbox, Select, message, Cascader } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { chinaRegions } from '../assets/data/chinaRegions';

const { Option } = Select;

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalCount, totalPrice, clearCart } = useCart();

  const [payMethod, setPayMethod] = useState('online'); 
  const [couponTab, setCouponTab] = useState<'coupon' | 'code' | 'bean'>('coupon'); 
  const [remark, setRemark] = useState(''); 
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceType, setInvoiceType] = useState('electronic'); 
  const [invoiceHeader, setInvoiceHeader] = useState('personal'); 
  
  // 控制下拉面板的状态
  const [openPanelId, setOpenPanelId] = useState<string | null>(null);
  const [openPanelType, setOpenPanelType] = useState<"service" | "gift" | "coupon" | null>(null);

  const [addressForm] = Form.useForm();
  const [invoiceForm] = Form.useForm();

  const shippingFee = 0; 
  const discount = 0;    
  const finalPrice = totalPrice + shippingFee - discount;

  // 地址级联数据
  const addressOptions = useMemo(() => {
    return chinaRegions.map((region) => ({
      value: region.province,
      label: region.province,
      children: region.cities.map((city) => ({
        value: city.city,
        label: city.city,
        children: city.districts.map((district) => ({
          value: district,
          label: district,
        })),
      })),
    }));
  }, []);

  const handleTogglePanel = (id: string, type: "service" | "gift" | "coupon") => {
    if (openPanelId === id && openPanelType === type) {
      setOpenPanelId(null);
      setOpenPanelType(null);
    } else {
      setOpenPanelId(id);
      setOpenPanelType(type);
    }
  };

  const handleSubmitOrder = () => {
    if (items.length === 0) {
      message.error('购物车为空');
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

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-20 pt-5 font-sans text-[#333]" onClick={() => { setOpenPanelId(null); setOpenPanelType(null); }}>
      <div className="w-[1200px] mx-auto space-y-4">
        {/* 面包屑 */}
        <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
          <Link to="/">首页</Link> &gt; <Link to="/shopping-cart">购物车</Link> &gt; <span>填写订单</span>
        </div>
        
        {/* 收货地址 */}
        <section className="bg-white p-6 shadow-sm">
          <h2 className="text-[18px] text-[#333] mb-5">收货地址</h2>
          <div className="flex flex-wrap gap-4">
            <div onClick={() => setIsAddressModalOpen(true)} className="w-[298px] h-[148px] border border-[#e0e0e0] bg-[#f9f9f9] flex flex-col items-center justify-center cursor-pointer hover:border-[#ccc]">
              <div className="w-8 h-8 rounded-full bg-[#e0e0e0] text-white flex items-center justify-center mb-2"><PlusOutlined /></div>
              <span className="text-[#999] text-sm">添加新地址</span>
            </div>
          </div>
        </section>

        {/* 支付方式 */}
        <section className="bg-white p-6 shadow-sm">
          <h2 className="text-[18px] text-[#333] mb-5">支付方式</h2>
          <div className="flex gap-4">
            <button onClick={() => setPayMethod('online')} className={`px-8 py-2 border text-sm relative ${payMethod === 'online' ? 'border-[#e1140a]' : 'border-[#e0e0e0]'}`}>
              在线支付
              {payMethod === 'online' && <CheckCircleFilled className="absolute bottom-0 right-0 text-[#e1140a]" />}
            </button>
          </div>
        </section>

        {/* 送货清单 */}
        <section className="bg-white p-6 shadow-sm">
          <div className="flex justify-between mb-5">
            <h2 className="text-[18px]">送货清单</h2>
            <Link to="/shopping-cart" className="text-xs text-blue-500">返回购物车 &gt;</Link>
          </div>
          <div className="bg-[#fbfcff] border border-[#f0f0f0]">
            <div className="p-5 border-b border-[#f0f0f0] font-bold text-sm">配送方式 <span className="ml-4 font-normal text-[#e1140a] border border-[#e1140a] px-2 text-xs">快递配送</span></div>
            
            {items.length > 0 ? items.map((item) => (
              <div key={item.id} className="relative p-5 border-b border-[#f0f0f0] flex">
                <img src={item.image} alt={item.name} className="w-[100px] h-[100px] object-contain border border-[#eee] bg-white mr-4" />
                <div className="flex-1 pr-10">
                  <h4 className="text-sm mb-2">{item.name}</h4>
                  <p className="text-xs text-gray-500">规格：{item.specText}</p>
                  
                  {/* 操作按钮 */}
                  <div className="mt-2 flex gap-2 text-xs">
                    <button onClick={(e) => { e.stopPropagation(); handleTogglePanel(item.id, 'service'); }} className="border border-[#e1140a] text-[#e1140a] px-2">选择服务</button>
                    <button onClick={(e) => { e.stopPropagation(); handleTogglePanel(item.id, 'gift'); }} className="border border-[#e1140a] text-[#e1140a] px-2">选择赠品</button>
                  </div>

                  {/* 悬浮面板 (简单示例) */}
                  {openPanelId === item.id && (
                    <div className="absolute left-[130px] top-[100px] z-10 bg-white border border-[#ffd0bf] p-3 shadow-lg w-[300px]" onClick={e => e.stopPropagation()}>
                       <div className="text-[#e1140a] mb-2 font-bold">
                         {openPanelType === 'service' ? '可选服务' : openPanelType === 'gift' ? '可选赠品' : '优惠券'}
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

        {/* 底部结算 */}
        <section className="bg-white p-8 shadow-sm flex flex-col items-end">
          <div className="text-right space-y-2 text-sm text-gray-600 mb-4">
             <div><span className="text-[#e1140a] mr-1">{totalCount}</span>件商品，总金额：¥{totalPrice}</div>
             <div>运费：¥{shippingFee}</div>
          </div>
          <div className="flex items-center gap-4 text-xl">
             <span>实付款：</span>
             <span className="text-[#e1140a] font-bold text-3xl">¥{finalPrice}</span>
          </div>
          <button onClick={handleSubmitOrder} className="mt-4 w-[160px] h-[46px] bg-[#e1140a] text-white text-lg font-bold hover:bg-[#c91008]">提交订单</button>
        </section>
      </div>

      {/* 地址弹窗 */}
      <Modal title="添加新地址" open={isAddressModalOpen} onCancel={() => setIsAddressModalOpen(false)} footer={null} width={600} centered>
        <Form form={addressForm} layout="vertical" onFinish={() => { message.success('地址保存成功'); setIsAddressModalOpen(false); }}>
           <div className="flex gap-4">
             <Form.Item name="name" className="flex-1" rules={[{ required: true }]}><Input placeholder="姓名" /></Form.Item>
             <Form.Item name="phone" className="flex-1" rules={[{ required: true }]}><Input placeholder="手机号" /></Form.Item>
           </div>
           <Form.Item name="region" rules={[{ required: true }]}><Cascader options={addressOptions} placeholder="选择省/市/区" /></Form.Item>
           <Form.Item name="detail" rules={[{ required: true }]}><Input.TextArea placeholder="详细地址" /></Form.Item>
           <div className="text-center"><button className="bg-[#e1140a] text-white px-8 py-2">保存</button></div>
        </Form>
      </Modal>

      {/* 发票弹窗 */}
      <Modal title="发票信息" open={isInvoiceModalOpen} onCancel={() => setIsInvoiceModalOpen(false)} footer={null} width={600} centered>
         <div className="p-4 text-center">
            <div className="flex justify-center gap-4 mb-4">
               <button onClick={() => setInvoiceType('electronic')} className={`border px-4 py-2 ${invoiceType === 'electronic' ? 'border-red-500 text-red-500' : ''}`}>电子普通发票</button>
               <button onClick={() => setInvoiceType('special')} className={`border px-4 py-2 ${invoiceType === 'special' ? 'border-red-500 text-red-500' : ''}`}>专用发票</button>
            </div>
            <div className="flex justify-center gap-4 mb-4">
               <button onClick={() => setInvoiceHeader('personal')} className={`border px-4 py-2 ${invoiceHeader === 'personal' ? 'border-red-500 text-red-500' : ''}`}>个人</button>
               <button onClick={() => setInvoiceHeader('unit')} className={`border px-4 py-2 ${invoiceHeader === 'unit' ? 'border-red-500 text-red-500' : ''}`}>单位</button>
            </div>
            <button onClick={() => { message.success('发票保存成功'); setIsInvoiceModalOpen(false); }} className="bg-[#e1140a] text-white px-8 py-2">确定</button>
         </div>
      </Modal>
    </div>
  );
};

export default Checkout;