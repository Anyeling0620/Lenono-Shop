import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getShopCardsService } from '../../services/products';
import type { CartListItemVO } from '../../types/shopCard';

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartListItemVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});

  // 获取购物车数据
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      // 暂时使用模拟数据，待API可用后切换
      const useMock = false; // 设置为 false 以使用真实API
      if (useMock) {
        // 模拟数据用于测试（超过3个种类）
        const mockItems: CartListItemVO[] = [
          {
            cartId: 'cart-1',
            productId: 'product-1',
            configId: 'config-1',
            quantity: 1,
            name: '联想拯救者 Y9000P 2025',
            subTitle: '高性能游戏本',
            image: 'https://via.placeholder.com/80',
            config1: '黑色',
            config2: '16GB',
            config3: '512GB',
            salePrice: 8999,
            originalPrice: 9999,
            availableConfigs: [],
          },
          {
            cartId: 'cart-2',
            productId: 'product-2',
            configId: 'config-2',
            quantity: 2,
            name: '联想小新 Pro 16 2025',
            subTitle: '轻薄办公本',
            image: 'https://via.placeholder.com/80',
            config1: '银色',
            config2: '32GB',
            config3: '1TB',
            salePrice: 6999,
            originalPrice: 7999,
            availableConfigs: [],
          },
          {
            cartId: 'cart-3',
            productId: 'product-3',
            configId: 'config-3',
            quantity: 1,
            name: '联想ThinkPad X1 Carbon 2025',
            subTitle: '商务旗舰本',
            image: 'https://via.placeholder.com/80',
            config1: '深空灰',
            config2: '16GB',
            config3: '512GB',
            salePrice: 12999,
            originalPrice: 13999,
            availableConfigs: [],
          },
          {
            cartId: 'cart-4',
            productId: 'product-4',
            configId: 'config-4',
            quantity: 3,
            name: '联想YOGA Pro 14s 2025',
            subTitle: '创意设计本',
            image: 'https://via.placeholder.com/80',
            config1: '墨绿色',
            config2: '24GB',
            config3: '2TB',
            salePrice: 10999,
            originalPrice: 11999,
            availableConfigs: [],
          },
          {
            cartId: 'cart-5',
            productId: 'product-5',
            configId: 'config-5',
            quantity: 1,
            name: '联想Legion 7i 2025',
            subTitle: '顶级电竞本',
            image: 'https://via.placeholder.com/80',
            config1: '灰色',
            config2: '64GB',
            config3: '4TB',
            salePrice: 19999,
            originalPrice: 21999,
            availableConfigs: [],
          },
          {
            cartId: 'cart-6',
            productId: 'product-6',
            configId: 'config-6',
            quantity: 2,
            name: '联想IdeaPad 5 2025',
            subTitle: '学生入门本',
            image: 'https://via.placeholder.com/80',
            config1: '白色',
            config2: '8GB',
            config3: '256GB',
            salePrice: 4999,
            originalPrice: 5499,
            availableConfigs: [],
          },
        ];
        setCartItems(mockItems);
        const initialQuantities: Record<string, number> = {};
        mockItems.forEach(item => {
          initialQuantities[item.cartId] = item.quantity;
        });
        setItemQuantities(initialQuantities);
        setSelectedIds(mockItems.map(item => item.cartId));
        setLoading(false);
      } else {
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
          console.error('获取购物车数据失败:', error);
          // 如果API失败，可以显示错误信息
        } finally {
          setLoading(false);
        }
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

  // 处理删除商品
  const handleRemoveItem = (cartId: string) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
    setSelectedIds(prev => prev.filter(id => id !== cartId));
    // 这里可以调用API删除购物车商品
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
      <div className="text-center py-12">
        <div className="text-gray-400 text-4xl mb-4">🛒</div>
        <div className="text-gray-500 text-lg mb-2">购物车还是空的</div>
        <div className="text-gray-400 text-sm">
          去<Link to="/" className="text-[#e1140a] mx-1">首页</Link>逛逛吧~
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full mx-auto">
      {/* 标题区域 */}
      <div className="mb-6 py-4 pl-4 pr-4 bg-white rounded-sm border-b-2 border-gray-100 flex justify-between items-center">
        <h1 className="text-[22px] font-semibold text-gray-800 leading-tight">
          我的购物车
        </h1>
        <div className="text-sm text-gray-500">
          共 <span className="text-[#e1140a] font-medium">{cartItems.length}</span> 件商品
        </div>
      </div>

      {/* 商品卡片列表容器（固定高度，内部滚动） */}
      <div className={`h-[400px] overflow-y-auto pr-[6px] pb-2 mb-4
          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-track]:rounded-xl
          [&::-webkit-scrollbar-track]:bg-gray-100
          [&::-webkit-scrollbar-thumb]:rounded-xl
          [&::-webkit-scrollbar-thumb]:bg-gray-300
          [&::-webkit-scrollbar-thumb:hover]:bg-gray-400
          [&::-webkit-scrollbar-button]:hidden
      `}>
        <div className="space-y-3">
          {cartItems.map(item => {
            const quantity = itemQuantities[item.cartId] || item.quantity;
            const isSelected = selectedIds.includes(item.cartId);
            return (
              <div
                key={item.cartId}
                className={`bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-shadow duration-300 ${isSelected ? 'border-[#e1140a]' : ''}`}
              >
                <div className="p-4">
                  <div className="flex">
                    {/* 左侧：选择框 + 图片 + 商品信息 */}
                    <div className="flex flex-1">
                      {/* 选择框 */}
                      <div className="mr-3 mt-0.5">
                        <input
                          type="checkbox"
                          className="h-4 w-4  mt-5 accent-[#e1140a] rounded"
                          checked={isSelected}
                          onChange={() => handleToggleItem(item.cartId)}
                        />
                      </div>

                      {/* 商品图片 */}
                      <Link to={`/product/${item.productId}`} className="block flex-shrink-0">
                        <div className="w-16 h-16 border border-gray-200 rounded-sm overflow-hidden bg-gray-100 hover:border-red-400 transition-colors">
                          <img
                            src={item.image || 'https://via.placeholder.com/80'}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </Link>

                      {/* 商品信息 */}
                      <div className="flex-1 min-w-0 ml-3">
                        <Link
                          to={`/product/${item.productId}`}
                          className="text-gray-800 font-medium text-sm truncate block hover:text-red-500 transition-colors"
                          title={item.name}
                        >
                          {item.name}
                        </Link>
                        <div className="text-gray-500 text-xs mt-1 truncate">{item.subTitle}</div>
                        <div className="text-gray-400 text-xs mt-1 bg-gray-50 inline-block px-1.5 py-0.5 rounded">
                          规格：{item.config1} / {item.config2} {item.config3 ? `/ ${item.config3}` : ''}
                        </div>
                      </div>
                    </div>

                    {/* 右侧：价格、数量、小计、删除 */}
                    <div className="flex flex-col items-end justify-between ml-4">
                      {/* 价格 */}
                      <div className="text-right">
                        <div className="text-gray-800 text-sm">¥{item.salePrice.toFixed(2)}</div>
                        {item.originalPrice > item.salePrice && (
                          <div className="text-gray-400 text-xs line-through">¥{item.originalPrice.toFixed(2)}</div>
                        )}
                      </div>

                      {/* 数量控件 */}
                      <div className="flex items-center mt-2">
                        <div className="text-gray-600 text-xs mr-2">数量：</div>
                        <div className="flex items-center">
                          <button
                            className="w-7 h-7 border border-gray-300 rounded-l-sm text-gray-600 hover:bg-gray-100 hover:border-gray-400 text-xs"
                            onClick={() => handleQuantityChange(item.cartId, -1)}
                          >
                            -
                          </button>
                          <div className="w-10 h-7 border-y border-gray-300 flex items-center justify-center text-xs bg-white">
                            {quantity}
                          </div>
                          <button
                            className="w-7 h-7 border border-gray-300 rounded-r-sm text-gray-600 hover:bg-gray-100 hover:border-gray-400 text-xs"
                            onClick={() => handleQuantityChange(item.cartId, 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* 小计和删除 */}
                      <div className="flex items-center space-x-3 mt-2">
                        <div className="text-gray-700 text-xs">
                          小计：<span className="text-[#e1140a] font-bold text-base ml-1">¥{(item.salePrice * quantity).toFixed(2)}</span>
                        </div>
                        <button
                          className="text-xs text-gray-500 hover:text-[#e1140a]"
                          onClick={() => handleRemoveItem(item.cartId)}
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="mt-3 bg-white border border-gray-200 rounded-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <label className="flex items-center text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[#e1140a] rounded mr-2"
              checked={allSelected}
              onChange={handleToggleAll}
            />
            <span className="text-xs">全选</span>
          </label>
          <button
            className="text-xs text-gray-600 hover:text-[#e1140a] whitespace-nowrap"
            onClick={() => {
              selectedIds.forEach(id => handleRemoveItem(id));
            }}
          >
            删除选中
          </button>
          <button className="text-xs text-gray-600 hover:text-[#e1140a] whitespace-nowrap">移入收藏夹</button>
          <button className="text-xs text-gray-600 hover:text-[#e1140a] whitespace-nowrap">清空失效商品</button>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-gray-700 text-xs whitespace-nowrap">
            已选择 <span className="text-[#e1140a] font-bold mx-1">{selectedCount}</span> 件商品
          </div>
          <div className="text-gray-700 text-xs whitespace-nowrap">
            合计：<span className="text-[#e1140a] font-bold text-xl ml-2">¥{selectedTotal.toFixed(2)}</span>
          </div>
          <button
            className="bg-[#e1140a] text-white px-8 py-2 rounded-sm font-bold hover:bg-[#c91008] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-xs whitespace-nowrap"
            disabled={selectedCount === 0}
          >
            去结算 ({selectedCount})
          </button>
        </div>
      </div>

      {/* 温馨提示 */}
      <div className="mt-4 px-4 py-2 bg-[#f5f5f5] border border-gray-300 rounded-md">
        <div className="flex items-start">
          <div className="text-gray-500 mr-3 text-sm">ℹ️</div>
          <div className="text-sm text-gray-700">
            <div className="font-medium mb-1 text-gray-800">温馨提示</div>
            <div className="mb-1">1. 商品价格可能随活动变化，请以结算时价格为准。</div>
            <div className="mb-1">2. 库存有限，请尽快下单。</div>
            <div>3. 支持7天无理由退货。</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;