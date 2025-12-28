import React, { useState, useRef, useEffect } from 'react';
import {
  PlusOutlined,
  CheckCircleFilled,
  InfoCircleOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { Form, message, Spin } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// 引入你定义的类型接口
import type { UserAddressItem, AddressPayload } from '../types/address';
import type { UserCouponItem } from '../types/coupon'; // 假设你将优惠券类型放在此路径

// 引入组件和服务
import AddressModal from '../component/UserCenterPages/AddressModal';
import type { CreateOrderInput, OrderItemInput, OrderState } from '../types/order';
import { addAddress, getUserAddressList, removeAddress, setDefaultAddress, updateAddress } from '../services/address';
import { getCouponsByProductService } from '../services/coupon';
import globalErrorHandler from '../utils/globalAxiosErrorHandler';
import toast from 'react-hot-toast';
import { createOrder } from '../services/order';
import { deleteShopCardsService } from '../services/products';
import { getImageUrl } from '../utils/imageConfig';



const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 获取路由状态中的订单数据（严格使用OrderState类型）
  const orderState = location.state as OrderState[] || [];

  // --- 状态管理 ---
  const [payMethod, setPayMethod] = useState('online');
  const [couponTab, setCouponTab] = useState<'yes' | 'no'>('yes');
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false); // 全局加载状态
  const [couponLoading, setCouponLoading] = useState(false); // 优惠券加载状态
  const [couponList, setCouponList] = useState<UserCouponItem[]>([]); // 优惠券列表（使用你定义的类型）
  const [selectedCouponIds, setSelectedCouponIds] = useState<string[]>([]); // 选中的优惠券ID数组

  // 弹窗控制
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);



  // 地址列表状态（直接使用你定义的UserAddressItem类型）
  const [addressList, setAddressList] = useState<UserAddressItem[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [editingAddress, setEditingAddress] = useState<UserAddressItem | null>(null); // 编辑的地址（使用你定义的类型）

  // 临时存储选中的地址中文名称（与AddressModal的ref对应）
  const tempRegionLabelsRef = useRef<string[]>([]);

  // 表单实例
  const [addressForm] = Form.useForm();

  // --- 数据计算 ---
  // 从OrderState计算商品总数和总金额（严格使用OrderState的属性）
  const totalCount = orderState.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = orderState.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shippingFee = 0; // 实际项目可从API获取，此处暂设为0
  const hasSeckillItem = orderState.some(item => item.isSeckill);

  // 计算优惠券折扣金额
  // 计算多个优惠券的总折扣金额
  const calculateDiscount = () => {
    if (hasSeckillItem || selectedCouponIds.length === 0) return 0;

    let totalDiscount = 0;
    let remainingPrice = totalPrice;

    // 获取选中的优惠券
    const selectedCoupons = couponList.filter(coupon =>
      selectedCouponIds.includes(coupon.id)
    );

    // 检查优惠券组合是否有效
    if (!isCouponCombinationValid(selectedCoupons)) {
      return 0;
    }

    // 按类型分组
    const fullReductionCoupons = selectedCoupons.filter(c => c.coupon.type === '满减');
    const discountCoupons = selectedCoupons.filter(c => c.coupon.type === '折扣');

    // 先应用满减券
    for (const coupon of fullReductionCoupons) {
      const { threshold, amount } = coupon.coupon;
      if (remainingPrice >= threshold) {
        totalDiscount += amount;
        remainingPrice -= amount;
      }
    }

    // 再应用折扣券（最多一张）
    if (discountCoupons.length > 0) {
      const discountCoupon = discountCoupons[0]; // 只取第一张折扣券
      const { threshold, discount } = discountCoupon.coupon;
      if (remainingPrice >= threshold) {
        const discountAmount = remainingPrice * (1 - discount);
        totalDiscount += discountAmount;
      }
    }

    return totalDiscount;
  };

  // 检查优惠券组合是否有效的辅助函数
  const isCouponCombinationValid = (coupons: UserCouponItem[]): boolean => {
    if (coupons.length === 0) return true;

    // 检查是否同时包含满减券和折扣券
    const hasFullReduction = coupons.some(c => c.coupon.type === '满减');
    const hasDiscount = coupons.some(c => c.coupon.type === '折扣');

    if (hasFullReduction && hasDiscount) {
      return false; // 满减券和折扣券不能同时使用
    }

    // 检查折扣券数量（最多一张）
    const discountCount = coupons.filter(c => c.coupon.type === '折扣').length;
    if (discountCount > 1) {
      return false;
    }

    // 检查是否所有优惠券都可叠加
    const allStackable = coupons.every(c => c.coupon.isStackable);
    if (coupons.length > 1 && !allStackable) {
      return false; // 选择多个优惠券时，必须所有都可叠加
    }

    return true;
  };

  // 计算秒杀商品直降金额
  const calculateSeckillDiscount = () => {
    let totalSeckillDiscount = 0;

    orderState.forEach(item => {
      if (item.isSeckill) {
        // 计算单个商品的秒杀优惠：(原价 - 当前价) × 数量
        const itemDiscount = (item.originalPrice - item.unitPrice) * item.quantity;
        totalSeckillDiscount += itemDiscount;
      }
    });

    return totalSeckillDiscount;
  };

  const seckillDiscount = calculateSeckillDiscount();

  const discount = calculateDiscount();

  const finalPrice = totalPrice + shippingFee - discount;

  // 筛选优惠券：根据useOK属性
  const availableCoupons = couponList.filter(coupon => coupon.useOK && coupon.status === '未使用');
  const unavailableCoupons = couponList.filter(coupon => !coupon.useOK || coupon.status === '已过期' || coupon.status === '已使用');

  // 当前显示的优惠券列表
  const displayedCoupons = couponTab === 'yes' ? availableCoupons : unavailableCoupons;

  // 格式化时间为本地时间
  const formatToLocalTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('时间格式化错误:', error);
      return timeString; // 如果格式化失败，返回原字符串
    }
  };



  // 加载地址列表
  const fetchAddressList = async () => {
    try {
      const res = await getUserAddressList(); // 调用你定义的服务函数
      setAddressList(res.list);
      // 自动选中默认地址
      const defaultAddress = res.list.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
    } catch (error) {
      console.error('获取地址列表失败:', error);
      message.error('获取地址列表失败，请稍后重试');
    }
  };

  // 加载优惠券列表（根据第一个商品的productId）
  // 修改加载优惠券列表的逻辑，获取所有商品的优惠券
  const fetchCouponList = async () => {
    if (orderState.length === 0) return;

    // 检查订单中是否有秒杀商品
    const hasSeckillItem = orderState.some(item => item.isSeckill);

    // 如果有秒杀商品，直接清空优惠券列表
    if (hasSeckillItem) {
      setCouponList([]);
      setSelectedCouponIds([]);
      setCouponLoading(false);
      return;
    }

    setCouponLoading(true);
    try {
      // 获取所有商品的productId
      const productIds = orderState.map(item => item.productId);

      // 获取所有商品的优惠券并合并去重
      const allCoupons: UserCouponItem[] = [];
      const seenCouponIds = new Set<string>();

      for (const productId of productIds) {
        const res = await getCouponsByProductService(productId);
        for (const coupon of res.items) {
          if (!seenCouponIds.has(coupon.id)) {
            seenCouponIds.add(coupon.id);
            allCoupons.push(coupon);
          }
        }
      }

      setCouponList(allCoupons);
      // 不再自动选中优惠券
      setSelectedCouponIds([]);
    } catch (error) {
      globalErrorHandler.handle(error, toast.error);
    } finally {
      setCouponLoading(false);
    }
  };


  // 处理地址弹窗打开（新增/编辑）
  const handleAddressModalOpen = (addr?: UserAddressItem) => {
    setEditingAddress(addr || null);
    setIsAddressModalOpen(true);
    // 重置表单和临时标签
    tempRegionLabelsRef.current = [];
    if (addr) {
      // 编辑地址时填充表单
      addressForm.setFieldsValue({
        name: addr.receiver,
        phone: addr.phone,
        region: [addr.province.code, addr.city.code, addr.area.code, addr.street.code],
        detail: addr.address,
        isDefault: addr.isDefault
      });
      // 初始化地区标签
      tempRegionLabelsRef.current = [
        addr.province.name,
        addr.city.name,
        addr.area.name,
        addr.street.name
      ];
    } else {
      // 新增地址时重置表单
      addressForm.resetFields();
    }
  };

  // 处理地址保存（新增/编辑）
  const handleAddressSave = async () => {
    try {
      const values = await addressForm.validateFields();
      // 构造AddressPayload（严格使用你定义的类型）
      const payload: AddressPayload = {
        provinceCode: values.region[0],
        cityCode: values.region[1],
        areaCode: values.region[2],
        streetCode: values.region[3],
        address: values.detail,
        receiver: values.name,
        phone: values.phone,
        isDefault: values.isDefault || false
      };

      if (editingAddress) {
        // 编辑地址
        await updateAddress(editingAddress.id, payload); // 调用你定义的服务函数
        message.success('地址编辑成功');
      } else {
        // 新增地址
        const newAddressId = await addAddress(payload); // 调用你定义的服务函数
        message.success('地址添加成功');
        // 如果设置为默认地址，同步调用设置默认接口
        if (payload.isDefault) {
          await setDefaultAddress(newAddressId);
        }
      }

      // 关闭弹窗并重新加载地址列表
      setIsAddressModalOpen(false);
      await fetchAddressList();
    } catch (error) {
      console.error('保存地址失败:', error);
      message.error('保存地址失败，请检查表单信息');
    }
  };

  // 处理设置默认地址
  const handleSetDefaultAddress = async (addrId: string) => {
    try {
      await setDefaultAddress(addrId); // 调用你定义的服务函数
      message.success('默认地址设置成功');
      await fetchAddressList();
    } catch (error) {
      console.error('设置默认地址失败:', error);
      message.error('设置默认地址失败，请稍后重试');
    }
  };

  // 处理删除地址
  const handleRemoveAddress = async (addrId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止触发地址选择
    try {
      await removeAddress(addrId); // 调用你定义的服务函数
      message.success('地址删除成功');
      // 如果删除的是选中的地址，清空选中状态
      if (selectedAddressId === addrId) {
        setSelectedAddressId('');
      }
      await fetchAddressList();
    } catch (error) {
      console.error('删除地址失败:', error);
      message.error('删除地址失败，请稍后重试');
    }
  };

const deleteShoppingCartItems = async (orderItems: OrderState[]) => {
  try {
    // 过滤出非秒杀商品且有购物车ID的商品
    const itemsToDelete = orderItems.filter(item => 
      !item.isSeckill && item.cartId
    );
    
    if (itemsToDelete.length === 0) {
      return;
    }
    
    // 提取购物车ID数组
    const cartIds = itemsToDelete
      .map(item => item.cartId!)
      .filter((id): id is string => id !== undefined && id !== null);
    
    if (cartIds.length > 0) {
      const result = await deleteShopCardsService(cartIds);
      console.log(`成功删除 ${result.count} 个购物车商品`);
    }
    
  } catch (error) {
   globalErrorHandler.handle(error,toast.error)
  
  }
};

const clearOrderState = () => {
  setSelectedCouponIds([]);
  setCouponList([]);
  setSelectedAddressId('');
};



  // 处理订单提交
 const handleSubmitOrder = async () => {
  // 验证订单数据
  if (orderState.length === 0) {
    message.error('订单商品为空');
    return;
  }
  
  if (!selectedAddressId) {
    message.error('请选择收货地址');
    return;
  }
  
  // 验证库存
  const outOfStockItems = orderState.filter(item => item.quantity > item.stockCount);
  if (outOfStockItems.length > 0) {
    const productNames = outOfStockItems.map(item => item.productName).join('、');
    message.error(`${productNames} 库存不足，请调整数量`);
    return;
  }
  
  // 验证优惠券组合（如果有选中的优惠券）
  if (selectedCouponIds.length > 0) {
    const selectedCoupons = couponList.filter(coupon => 
      selectedCouponIds.includes(coupon.id)
    );
    
    if (!isCouponCombinationValid(selectedCoupons)) {
      message.error('优惠券组合无效，请重新选择');
      return;
    }
  }
  
  setLoading(true);
  try {
    // 构建订单项数据
    const orderItems: OrderItemInput[] = orderState.map(item => {
      const itemData: OrderItemInput = {
        productId: item.productId,
        configId: item.configId,
        quantity: item.quantity
      };
      
      // 如果是秒杀商品，添加秒杀轮次ID
      if (item.isSeckill && item.seckillRoundId) {
        itemData.seckillRoundId = item.seckillRoundId;
      }
      
      return itemData;
    });

    // 构建订单参数
    const orderParams: CreateOrderInput = {
      seckill: orderState.some(item => item.isSeckill),
      addressId: selectedAddressId,
      items: orderItems,
      couponIds: selectedCouponIds,
    };

    console.log('提交订单参数:', orderParams); // 调试用
    
    // 调用真实API创建订单
    const orderResponse = await createOrder(orderParams);
    
    message.success('订单创建成功！');
    await deleteShoppingCartItems(orderState);
    
     clearOrderState();
    
    // 跳转到支付页面
    navigate('/order/payment', {
      replace: true,
      state: {
        orderId: orderResponse.orderId,
        orderNo: orderResponse.orderNo,
        payAmount: orderResponse.payAmount,
        actualPayAmount: orderResponse.actualPayAmount,
        payLimitTime: orderResponse.payLimitTime,
        status: orderResponse.status,
        items: orderResponse.items,
        createdAt: orderResponse.createdAt
      }
    });
    
  } catch (error) {
    globalErrorHandler.handle(error,toast.error)
  } finally {
    setLoading(false);
  }
};


  // 辅助函数：拼接地区名称（省市区街道）
  const getRegionName = (addr: UserAddressItem) => {
    return `${addr.province.name} ${addr.city.name} ${addr.area.name} ${addr.street.name}`;
  };

  // --- 生命周期钩子 ---
  useEffect(() => {


    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

    // 初始化加载地址和优惠券

    fetchAddressList();
    fetchCouponList();
  }, []);





  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-20 pt-5 font-sans text-[#333]">
      <div className="w-[1200px] mx-auto space-y-4">
        {/* 面包屑 */}
        <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
          <Link to="/" target='_parent'>首页</Link> &gt;
          <Link to="/shopping-cart">购物车</Link> &gt;
          <span>填写订单</span>
        </div>

        {/* 1. 收货地址区域 */}
        <section className="bg-white p-6 shadow-sm">
          <h2 className="text-[18px] text-[#333] mb-5">收货地址</h2>
          <div className=" grid grid-cols-4  gap-4">
            {/* 渲染已有的地址列表（使用UserAddressItem类型） */}
            {addressList.map(addr => (
              <div
                key={addr.id}
                onClick={() => setSelectedAddressId(addr.id)}
                className={`w-auto h-[148px] border p-4 cursor-pointer relative transition-all bg-white hover:border-[#e1140a] 
                           ${selectedAddressId === addr.id ? 'border-[#e1140a] ring-1 ring-[#e1140a]' : 'border-[#e0e0e0]'}`}
              >
                <div className="flex justify-between items-center mb-2 border-b border-[#f0f0f0] pb-2">
                  <span className="font-bold text-sm truncate max-w-[100px]" title={getRegionName(addr)}>
                    {addr.province.name} ({addr.receiver})
                  </span>
                  {addr.isDefault && (
                    <span className="text-xs bg-[#c11717bc] absolute top-0  left-0 text-white px-1">默认</span>
                  )}
                </div>
                <div className="text-xs text-[#666] space-y-1">
                  <p>收货人：{addr.receiver}</p>
                  <p>电话：{addr.phone}</p>
                  <p className="">
                    地址：{getRegionName(addr)}
                  </p>
                  <p >详细地址：{addr.address}</p>
                </div>

                {/* 选中状态标识 */}
                {selectedAddressId === addr.id && (
                  <div className="absolute bottom-0 right-0">
                    <CheckCircleFilled className="text-[#e1140a] text-lg bg-white rounded-full" />
                  </div>
                )}

                {/* 地址操作按钮（编辑/删除/设为默认） */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAddressModalOpen(addr); }}
                    className="text-xs text-gray-500 hover:text-[#e1140a]"
                  >
                    编辑
                  </button>
                  <span className="text-xs text-gray-300">|</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSetDefaultAddress(addr.id); }}
                    className="text-xs text-gray-500 hover:text-[#e1140a]"
                    disabled={addr.isDefault}
                  >
                    {addr.isDefault ? '' : '设为默认'}
                  </button>
                  <span className="text-xs text-gray-300">|</span>
                  <button
                    onClick={(e) => handleRemoveAddress(addr.id, e)}
                    className="text-xs text-gray-500 hover:text-[#e1140a]"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}

            {/* 添加新地址按钮 */}
            <div
              onClick={() => handleAddressModalOpen()}
              className="w-auto h-[148px] border border-[#e0e0e0] bg-[#f9f9f9] flex flex-col items-center justify-center cursor-pointer hover:border-[#ccc] transition-colors"
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
            <button
              onClick={() => setPayMethod('online')}
              className={`px-8 py-2 border text-sm relative transition-all 
                         ${payMethod === 'online' ? 'border-[#e1140a] ring-1 ring-[#e1140a]' : 'border-[#e0e0e0] hover:border-[#e1140a]'}`}
            >
              在线支付
              {payMethod === 'online' && (
                <CheckCircleFilled className="absolute bottom-[-8px] right-[-8px] text-[#e1140a] bg-white rounded-full" />
              )}
            </button>
            {/* <button
              onClick={() => setPayMethod('cod')}
              className={`px-8 py-2 border text-sm relative transition-all 
                         ${payMethod === 'cod' ? 'border-[#e1140a] ring-1 ring-[#e1140a]' : 'border-[#e0e0e0] hover:border-[#e1140a]'}`}
            >
              货到付款
              {payMethod === 'cod' && (
                <CheckCircleFilled className="absolute bottom-[-8px] right-[-8px] text-[#e1140a] bg-white rounded-full" />
              )}
            </button> */}
          </div>
        </section>

        {/* 3. 送货清单 */}
        <section className="bg-white p-6 shadow-sm">
          <div className="flex justify-between mb-5">
            <h2 className="text-[18px]">送货清单</h2>
            <Link to="/shopping-cart" className="text-xs text-blue-500">返回购物车 &gt;</Link>
          </div>
          <div className="bg-[#fbfcff] border border-[#f0f0f0]">
            <div className="p-5 border-b border-[#f0f0f0] font-bold text-sm">
              配送方式
              <span className="ml-4 font-normal text-[#e1140a] border border-[#e1140a] px-2 text-xs bg-[#fff4f4]">
                快递配送
              </span>
            </div>

            {orderState.length > 0 ? (
              orderState.map((item) => (
                <div
                  key={`${item.productId}-${item.configId}`}
                  className="relative p-5 border-b border-[#f0f0f0] flex items-start"
                >
                  <img
                    src={getImageUrl(item.productImage) }
                    alt={item.productName}
                    className="w-[100px] h-[100px] object-contain border border-[#eee] bg-white mr-4"
                  />
                  <div className="flex-1 pr-10">
                    <h4 className="text-sm mb-2 text-[#333]">{item.productName}</h4>
                    <p className="text-xs text-gray-500 mb-2">
                      规格：{Object.entries(item.configContent).map(([k, v]) => `${k}: ${v}`).join('; ')}
                    </p>
                    <div className="flex items-center gap-1 text-[#e57e33] text-xs">
                      <InfoCircleOutlined /> 支持7天无理由退换
                    </div>


                  </div>
                  <div className="w-[150px] text-right mt-4 mr-4">
                    <del className="text-[#797979] font-bold">¥{item.originalPrice.toFixed(2)}</del>
                    <div className="text-[#e1140a] font-bold">¥{item.unitPrice.toFixed(2)}</div>
                    <div className="text-gray-500">x{item.quantity}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-gray-400">购物车为空</div>
            )}
          </div>
        </section>

        {/* 4. 优惠与备注 */}
        <section className="bg-white p-6 shadow-sm">
          <div className='flex  relative '>
            <h2 className="text-[18px] text-[#333] mb-4 flex items-center gap-2">使用优惠券</h2>
            {orderState.some(item => item.isSeckill) && (
              <div className="mb-4 absolute right-0 px-3 py-1 mt-11 bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm rounded">
                ⚠️ 当前订单包含秒杀商品，不可使用优惠券
              </div>
            )}
          </div>
          <div className="flex border-b border-[#eee] mb-5">
            {['可用', '不可用'].map((label, idx) => {
              const keys = ['yes', 'no'] as const;
              return (
                <div
                  key={label}
                  onClick={() => setCouponTab(keys[idx])}
                  className={`px-6 py-2 text-sm cursor-pointer border-b-2 transition-colors 
                     ${couponTab === keys[idx] ? 'border-[#e1140a] text-[#e1140a]' : 'border-transparent text-[#666]'}`}
                >
                  {label}
                </div>
              );
            })}
          </div>


          {/* 优惠券面板 */}
          <div className="py-4">
            {couponLoading ? (
              <div className="py-8 text-center">
                <Spin size="small" />
              </div>
            ) : displayedCoupons.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {displayedCoupons.map((coupon) => {
                  // 检查当前优惠券是否可用（满足门槛）
                  // 检查是否有秒杀商品
                  const hasSeckillItem = orderState.some(item => item.isSeckill);
                  const isCouponAvailable = !hasSeckillItem && totalPrice >= coupon.coupon.threshold && coupon.useOK;

                  return (
                    <div
                      key={coupon.id}
                      className={`relative cursor-pointer transition-all duration-200
  ${selectedCouponIds.includes(coupon.id) && isCouponAvailable
                          ? 'scale-[1.02]'
                          : ''}`}

                      // 在优惠券点击事件中修改
                      onClick={() => {
                        // 如果有秒杀商品，不允许选择优惠券
                        const hasSeckillItem = orderState.some(item => item.isSeckill);
                        if (hasSeckillItem || !isCouponAvailable) return;

                        const isSelected = selectedCouponIds.includes(coupon.id);

                        if (isSelected) {
                          // 取消选中
                          setSelectedCouponIds(prev => prev.filter(id => id !== coupon.id));
                        } else {
                          // 尝试添加新优惠券
                          const newSelectedCoupons = [
                            ...selectedCouponIds.map(id => couponList.find(c => c.id === id)).filter(Boolean) as UserCouponItem[],
                            coupon
                          ];

                          // 检查组合是否有效
                          if (isCouponCombinationValid(newSelectedCoupons)) {
                            setSelectedCouponIds(prev => [...prev, coupon.id]);
                          } else {
                            // 显示错误提示
                            if (newSelectedCoupons.some(c => c.coupon.type === '满减') &&
                              newSelectedCoupons.some(c => c.coupon.type === '折扣')) {
                              message.error('满减券和折扣券不能同时使用');
                            } else if (newSelectedCoupons.filter(c => c.coupon.type === '折扣').length > 1) {
                              message.error('最多只能选择一张折扣券');
                            } else if (newSelectedCoupons.length > 1 && !newSelectedCoupons.every(c => c.coupon.isStackable)) {
                              message.error('选择的优惠券中有不可叠加的券');
                            }
                          }
                        }
                      }}

                    >

                      {/* 优惠券主体 */}
                      <div className={`relative overflow-hidden border-2
                              ${selectedCouponIds.includes(coupon.id) && isCouponAvailable

                          ? 'border-[#e1140a]'
                          : isCouponAvailable
                            ? 'border-[#e1140e]/20 hover:border-[#e1140a]/40'
                            : 'border-gray-200 opacity-70'}`}>

                        {/* 优惠券顶部装饰 */}
                        <div className={`absolute top-0 left-0 right-0 h-1 
                              ${isCouponAvailable ? 'bg-gradient-to-r from-[#e1140a] to-[#ff6b6b]' : 'bg-gray-300'}`}></div>

                        {/* 中间虚线分割线 */}
                        <div className="absolute left-1/3 top-0 bottom-0 w-4">
                        </div>

                        {/* 优惠券内容 - 左右布局 */}
                        <div className="flex bg-gradient-to-br from-white to-gray-50/50">
                          {/* 左侧：金额区域 */}
                          <div className="w-1/3 p-3 flex flex-col items-center justify-center border-r border-dashed border-gray-200">
                            <div className={`text-xl font-bold leading-tight
                                  ${isCouponAvailable ? 'text-[#e1140a]' : 'text-gray-400'}`}>
                              {coupon.coupon.type === '满减' ? `¥${coupon.coupon.amount}` : `${coupon.coupon.discount * 100}折`}
                            </div>
                            <div className="text-[10px] text-gray-500 mt-1">优惠券</div>
                          </div>

                          {/* 右侧：描述和时间 */}
                          <div className="w-2/3 p-3">
                            <div className="text-xs font-semibold text-gray-800 mb-1 truncate">
                              {coupon.coupon.name}
                            </div>
                            <div className={`text-[11px] mb-2
                                  ${isCouponAvailable ? 'text-gray-600' : 'text-gray-400'}`}>
                              满{coupon.coupon.threshold}元可用
                              {!isCouponAvailable && couponTab === 'yes' && (
                                <span className="text-[#e1140a] ml-1">(未满足门槛)</span>
                              )}
                            </div>

                            {coupon.coupon.expireTime && (
                              <div className="text-[10px] text-gray-400">
                                有效期至<br />
                                <span className="font-medium">{formatToLocalTime(coupon.coupon.expireTime)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 不可用遮罩 */}
                        {!isCouponAvailable && (
                          <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center">
                            <div className="text-xs text-gray-400 bg-white/90 px-2 py-1 rounded">
                              {couponTab === 'yes' ? '不可用' : '已失效'}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 选中标记 */}
                      {selectedCouponIds.includes(coupon.id) && isCouponAvailable && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#e1140a] rounded-full flex items-center justify-center shadow-lg z-10">
                          <CheckOutlined className="text-white text-xs" />
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-[#999] text-sm">
                {couponTab === 'yes' ? '暂无可用优惠券' : '暂无不可用优惠券'}
              </div>
            )}
          </div>
          <div className="mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <InfoCircleOutlined />
              <span>优惠券使用规则：</span>
            </div>
            <ul className="ml-6 mt-1 text-xs text-gray-500 space-y-1">
              <li>• 满减券和折扣券不能同时使用</li>
              <li>• 折扣券最多选择一张</li>
              <li>• 选择多个优惠券时，所有优惠券必须可叠加</li>
              <li>• 订单包含秒杀商品时不能使用优惠券</li>
            </ul>
          </div>

        </section>

        {/* 5. 订单备注 */}
        <section className="bg-white p-6 shadow-sm">
          <h2 className="text-[18px] text-[#333] mb-4">订单备注</h2>
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="限100字"
            maxLength={100}
            className="border border-[#e0e0e0] p-2 text-sm w-full h-[80px] resize-none outline-none focus:border-[#e1140a]"
          />
        </section>

        {/* 6. 底部结算 */}
        <section className="bg-white p-8 shadow-sm flex flex-col items-end">
          <div className="text-right space-y-2 text-sm text-gray-600 mb-4 w-[300px]">
            <div className="flex justify-between">
              <span>
                <span className="text-[#e1140a] mr-1">{totalCount}</span>件商品，总金额：
              </span>
              <span>¥{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>运费：</span>
              <span>¥{shippingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>优惠：</span>
              <span className="text-[#e1140a]">- ¥{discount.toFixed(2)}</span>
            </div>
            {hasSeckillItem && (
              <div className="flex justify-between ">
                <span>秒杀直降：</span>
                <span className='text-red-600'>
                  - ¥{seckillDiscount.toFixed(2)}
                </span>
              </div>
            )}
            {selectedCouponIds.length > 0 && (
              <div className="flex justify-between text-xs text-gray-500">
                <span>使用优惠券：</span>
                <span>
                  {(() => {
                    const selectedCoupons = couponList.filter(c => selectedCouponIds.includes(c.id));
                    return selectedCoupons.map(coupon => {
                      const { coupon: couponDetail } = coupon;
                      return couponDetail.type === '满减'
                        ? `满${couponDetail.threshold}减${couponDetail.amount}`
                        : `满${couponDetail.threshold}打${couponDetail.discount * 100}折`;
                    }).join(' + ');
                  })()}
                </span>
              </div>
            )}

          </div>
          <div className="bg-[#f9f9f9] w-full h-[1px] mb-6"></div>
          <div className="flex items-center gap-4 text-xl justify-end w-full">
            <span className="text-sm text-[#333]">实付款：</span>
            <span className="text-[#e1140a] font-bold text-3xl">¥{finalPrice.toFixed(2)}</span>
          </div>

          <div className="mt-6 text-right w-full">
            {/* 动态显示选中的地址 */}
            <div className="text-xs text-gray-500 mb-2 bg-[#fbfcff] p-2 border border-[#f0f0f0] inline-block">
              {selectedAddressId ? (
                addressList.find(addr => addr.id === selectedAddressId) ? (
                  <>
                    寄送至：{getRegionName(addressList.find(addr => addr.id === selectedAddressId)!)} {addressList.find(addr => addr.id === selectedAddressId)!.address}
                    &nbsp;&nbsp; 收货人：{addressList.find(addr => addr.id === selectedAddressId)!.receiver} {addressList.find(addr => addr.id === selectedAddressId)!.phone}
                  </>
                ) : (
                  <span className="text-[#e1140a]">地址不存在</span>
                )
              ) : (
                <span className="text-[#e1140a]">请先添加并选择收货地址</span>
              )}
            </div>
            <div>
              <button
                onClick={handleSubmitOrder}
                className={`w-[160px] h-[46px] text-lg font-bold transition-colors 
                           ${orderState.length > 0 && selectedAddressId ? 'bg-[#e1140a] text-white hover:bg-[#c91008]' : 'bg-gray-300 text-white cursor-not-allowed'}`}
                disabled={orderState.length === 0 || !selectedAddressId || loading}
              >
                {loading ? <Spin size="small" /> : '提交订单'}
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* 地址弹窗（严格传递Props） */}
      <AddressModal
        open={isAddressModalOpen}
        editingAddress={editingAddress}
        onCancel={() => setIsAddressModalOpen(false)}
        onSave={handleAddressSave}
        form={addressForm}
        tempRegionLabelsRef={tempRegionLabelsRef}
      />
    </div>
  );
};

export default Checkout;
