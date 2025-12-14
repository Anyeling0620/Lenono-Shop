import { useState, useCallback } from 'react';

// 收藏状态接口
interface FavoriteState {
  [productId: string]: boolean;
}

// 收藏功能hook
export const useFavorites = () => {
  // 从localStorage初始化收藏状态
  const [favorites, setFavorites] = useState<FavoriteState>(() => {
    try {
      const stored = localStorage.getItem('userFavorites');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error);
      return {};
    }
  });

  // 保存到localStorage
  const saveToStorage = useCallback((newFavorites: FavoriteState) => {
    try {
      localStorage.setItem('userFavorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Failed to save favorites to localStorage:', error);
    }
  }, []);

  // 添加收藏
  const addFavorite = useCallback((productId: string) => {
    setFavorites(prev => {
      const newFavorites = { ...prev, [productId]: true };
      saveToStorage(newFavorites);
      return newFavorites;
    });
  }, [saveToStorage]);

  // 移除收藏
  const removeFavorite = useCallback((productId: string) => {
    setFavorites(prev => {
      const newFavorites = { ...prev, [productId]: false };
      saveToStorage(newFavorites);
      return newFavorites;
    });
  }, [saveToStorage]);

  // 切换收藏状态
  const toggleFavorite = useCallback((productId: string) => {
    setFavorites(prev => {
      const isCurrentlyFavorite = prev[productId] || false;
      const newFavorites = { ...prev, [productId]: !isCurrentlyFavorite };
      saveToStorage(newFavorites);
      return newFavorites;
    });
  }, [saveToStorage]);

  // 检查是否已收藏
  const isFavorite = useCallback((productId: string): boolean => {
    return favorites[productId] || false;
  }, [favorites]);

  // 获取所有收藏的商品ID
  const getFavoriteIds = useCallback((): string[] => {
    return Object.keys(favorites).filter(id => favorites[id]);
  }, [favorites]);

  // 获取收藏数量
  const getFavoriteCount = useCallback((): number => {
    return getFavoriteIds().length;
  }, [getFavoriteIds]);

  // 清空所有收藏
  const clearAllFavorites = useCallback(() => {
    const newFavorites: FavoriteState = {};
    setFavorites(newFavorites);
    saveToStorage(newFavorites);
  }, [saveToStorage]);

  return {
    // 状态检查
    isFavorite,
    getFavoriteIds,
    getFavoriteCount,

    // 操作方法
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearAllFavorites,

    // 原始数据（如果需要）
    favorites
  };
};

export default useFavorites;