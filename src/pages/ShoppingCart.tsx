import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { CartListItemVO } from '../types/shopCard';
import { deleteShopCardsService, getShopCardsService } from '../services/products';
import globalErrorHandler from '../utils/globalAxiosErrorHandler';
import type { OrderState } from '../types/order';

const ShoppingCart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartListItemVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});

  // 获取购物车数据
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const response = await getShopCardsService();
        setCartItems(response.items || []);
        // 初始化选中状态和数量
        const initialQuantities: Record<string, number> = {};
        response.items.forEach(item => {
          initialQuantities[item.cartId] = item.quantity;
        });
        setItemQuantities(initialQuantities);
        setSelectedIds(response.items.map(item => item.cartId)); // 默认全选
      } catch (error) {
        globalErrorHandler.handle(error, toast.error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // 处理选择单个商品
  const handleToggleItem = (cartId: string) => {
    setSelectedIds(prev =>
      prev.includes(cartId) ? prev.filter(id => id !== cartId) : [...prev, cartId]
    );
  };

  // 处理全选
  const handleToggleAll = () => {
    if (selectedIds.length === cartItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cartItems.map(item => item.cartId));
    }
  };

  // 处理数量变化
  const handleQuantityChange = (cartId: string, delta: number) => {
    setItemQuantities(prev => {
      const current = prev[cartId] || 1;
      const newQuantity = Math.max(1, current + delta);
      return { ...prev, [cartId]: newQuantity };
    });
    // 这里可以调用API更新购物车数量
  };

  // 处理删除单个商品
  const handleRemoveItem = async (cartId: string) => {
    try {
      const { count } = await deleteShopCardsService([cartId]);
      toast.success(`删除${count}条购物车记录`);
      
      // 重新获取购物车数据
      const response = await getShopCardsService();
      setCartItems(response.items || []);
      setSelectedIds(prev => prev.filter(id => id !== cartId));
    } catch (error) {
      globalErrorHandler.handle(error, toast.error);
    }
  };

  // 处理删除选中商品
  const handleRemoveSelected = async () => {
    if (selectedIds.length === 0) {
      toast.error('请选择要删除的商品');
      return;
    }
    try {
      const { count } = await deleteShopCardsService(selectedIds);
      toast.success(`删除${count}条购物车记录`);
      
      // 重新获取购物车数据
      const response = await getShopCardsService();
      setCartItems(response.items || []);
      setSelectedIds([]);
    } catch (error) {
      globalErrorHandler.handle(error, toast.error);
    }
  };

  // 处理去结算
  const handleCheckout = () => {
    if (selectedIds.length === 0) {
      toast.error('请选择要结算的商品');
      return;
    }

    // 获取选中的商品
    const selectedItems = cartItems.filter(item => selectedIds.includes(item.cartId));
    
    // 转换为 OrderState 格式
    const orderState = selectedItems.map(item => {
      const quantity = itemQuantities[item.cartId] || item.quantity;
      
      return {
        cartId: item.cartId,
        productId: item.productId,
        productName: item.name,
        productImage: item.image,
        configId: item.configId,
        configContent: {
          config1: item.config1,
          config2: item.config2,
          config3: item.config3 || ''
        },
        quantity: quantity,
        unitPrice: item.salePrice,
        originalPrice: item.originalPrice,
        isSeckill: false,
        seckillId: null,
        seckillRoundId: null,
        stockCount: 100,
      } as OrderState;
    });

    console.log('跳转到结算页，携带数据:', orderState);
    
    // 跳转到结算页，携带订单数据
    navigate('/checkout', { state: orderState });
  };

  // 计算选中商品的总价和数量
  const { selectedCount, selectedTotal } = useMemo(() => {
    const selectedItems = cartItems.filter(item => selectedIds.includes(item.cartId));
    let count = 0;
    let total = 0;
    selectedItems.forEach(item => {
      const quantity = itemQuantities[item.cartId] || item.quantity;
      count += quantity;
      total += item.salePrice * quantity;
    });
    return { selectedCount: count, selectedTotal: total };
  }, [cartItems, selectedIds, itemQuantities]);

  // 所有商品是否全选
  const allSelected = cartItems.length > 0 && selectedIds.length === cartItems.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-40">
        <div className="text-gray-400 text-4xl mb-4">🛒</div>
        <div className="text-gray-500 text-lg mb-2">购物车还是空的</div>
        <div className="text-gray-400 text-sm">
          去<Link to="/index" className="text-[#e1140a] mx-1">首页</Link>逛逛吧~
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen font-sans text-[#333]">
      <div className="w-[1200px] mx-auto pt-6 pb-12">
        {/* 顶部标题 */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-[#333]">
            全部商品
            <span className="ml-1 text-[#e1140a]">{cartItems.length}</span>
          </div>
        </div>

        {/* 购物车主体区域 */}
        <div className="bg-white rounded-sm shadow-sm">
          {/* 表头 */}
          <div className="px-6 py-3 text-xs text-gray-500 flex items-center border-b border-gray-100">
            <div className="w-[80px] flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-[#e1140a]"
                checked={allSelected}
                onChange={handleToggleAll}
              />
              <span>全选</span>
            </div>
            <div className="w-[400px]">商品</div>
            <div className="w-[140px] text-center">单价</div>
            <div className="w-[140px] text-center">数量</div>
            <div className="w-[140px] text-center">小计</div>
            <div className="flex-1 text-center">操作</div>
          </div>

          {/* 商品行区域 */}
          <div className="bg-[#fff7f2]">
            {cartItems.map((item) => {
              const quantity = itemQuantities[item.cartId] || item.quantity;
              const isSelected = selectedIds.includes(item.cartId);
              
              return (
                <div
                  key={item.cartId}
                  className="relative px-6 py-4 flex items-center text-sm border-b border-[#ffe5d7] last:border-b-0"
                >
                  <div className="w-[80px] flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-[#e1140a]"
                      checked={isSelected}
                      onChange={() => handleToggleItem(item.cartId)}
                    />
                  </div>

                  {/* 商品信息 */}
                  <div className="w-[400px] flex">
                    <Link to={`/product/${item.productId}`} className="flex">
                      <div className="w-[80px] h-[80px] border border-gray-100 flex items-center justify-center mr-3 bg-white">
                        <img
                          src={item.image!}
                          alt={item.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </Link>
                    <div className="flex-1">
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-[13px] text-[#333] hover:text-[#e1140a] line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      {item.subTitle && (
                        <div className="text-xs text-gray-500 mt-1">
                          {item.subTitle}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        规格：{item.config1} / {item.config2} {item.config3 ? `/ ${item.config3}` : ''}
                      </div>
                    </div>
                  </div>

                  {/* 单价 */}
                  <div className="w-[140px] text-center text-sm">
                    <div className="text-[#333] font-semibold">
                      ¥{item.salePrice.toFixed(2)}
                    </div>
                    {item.originalPrice > item.salePrice && (
                      <div className="text-gray-500 line-through text-xs">
                        ¥{item.originalPrice.toFixed(2)}
                      </div>
                    )}
                  </div>

                  {/* 数量 */}
                  <div className="w-[140px] flex justify-center">
                    <div className="flex border border-gray-300 w-[110px] h-[30px] bg-white">
                      <button
                        className="w-[32px] text-gray-500 hover:bg-gray-100"
                        onClick={() => handleQuantityChange(item.cartId, -1)}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={quantity}
                        readOnly
                        className="w-[46px] text-center border-l border-r border-gray-300 text-xs"
                      />
                      <button
                        className="w-[32px] text-gray-500 hover:bg-gray-100"
                        onClick={() => handleQuantityChange(item.cartId, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* 小计 */}
                  <div className="w-[140px] text-center text-[#e1140a] font-semibold">
                    ¥{(item.salePrice * quantity).toFixed(2)}
                  </div>

                  {/* 操作 */}
                  <div className="flex-1 text-center text-xs text-gray-500 space-y-1">
                    <div
                      className="cursor-pointer hover:text-[#e1140a]"
                      onClick={() => handleRemoveItem(item.cartId)}
                    >
                      删除
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="mt-2 bg-white h-[60px] flex items-center px-6 rounded-sm shadow-sm text-sm">
          <div className="flex items-center gap-4 flex-1 text-gray-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-[#e1140a]"
                checked={allSelected}
                onChange={handleToggleAll}
              />
              <span>全选</span>
            </label>
            <button
              className="hover:text-[#e1140a]"
              onClick={handleRemoveSelected}
            >
              删除
            </button>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">
              已选择
              <span className="mx-1 text-[#e1140a]">{selectedCount}</span>
              件
            </span>
            <span className="text-gray-600">
              合计：
              <span className="text-[#e1140a] text-xl font-bold ml-2">
                ¥{selectedTotal.toFixed(2)}
              </span>
            </span>
            <button
              className={`w-[160px] h-[46px] text-lg font-bold ml-2 ${
                selectedCount === 0
                  ? "bg-gray-300 text-white cursor-not-allowed"
                  : "bg-[#e1140a] text-white hover:bg-[#c91008] transition-colors"
              }`}
              disabled={selectedCount === 0}
              onClick={handleCheckout}
            >
              去结算 ({selectedCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
