import React, { createContext, useContext, useMemo, useState } from "react";
import type { MainProduct } from "../types/mainProduct";

export interface CartItem {
  id: string;
  name: string;
  image: string;
  specText: string;
  price: number;
  originalPrice: number;
  count: number;
  coupon: number;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: MainProduct, count: number, specText: string) => void;
  replaceWithSingle: (
    product: MainProduct,
    count: number,
    specText: string
  ) => void;
  updateCount: (id: string, count: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: MainProduct, count: number, specText: string) => {
    setItems((prev) => {
      const existing = prev.find(
        (it) => it.id === product.id && it.specText === specText
      );
      if (existing) {
        return prev.map((it) =>
          it === existing ? { ...it, count: it.count + count } : it
        );
      }
      const price = product.originalPrice - product.coupon;
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          image: product.image,
          specText,
          price,
          originalPrice: product.originalPrice,
          count,
          coupon: product.coupon,
        },
      ];
    });
  };

  const replaceWithSingle = (
    product: MainProduct,
    count: number,
    specText: string
  ) => {
    const price = product.originalPrice - product.coupon;
    setItems([
      {
        id: product.id,
        name: product.name,
        image: product.image,
        specText,
        price,
        originalPrice: product.originalPrice,
        count,
        coupon: product.coupon,
      },
    ]);
  };

  const updateCount = (id: string, count: number) => {
    setItems((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, count: Math.max(1, count) } : it))
        .filter((it) => it.count > 0)
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const clearCart = () => setItems([]);

  const { totalCount, totalPrice } = useMemo(() => {
    return {
      totalCount: items.reduce((sum, it) => sum + it.count, 0),
      totalPrice: items.reduce((sum, it) => sum + it.price * it.count, 0),
    };
  }, [items]);

  const value: CartContextValue = {
    items,
    addToCart,
    replaceWithSingle,
    updateCount,
    removeItem,
    clearCart,
    totalCount,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
};


