import React, { createContext, useContext, useMemo, useState } from 'react';

export type CartItem = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  unitLabel: string; // e.g., 1 KG, 500 g, 1 pc
  qty: number; // numeric quantity in selected unit
  note?: string;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty' | 'note'>, qty?: number) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  totalCount: number;
  applyPromoCode: (code: string) => boolean;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>(null);

  const addItem = (item: Omit<CartItem, 'qty' | 'note'>, qty: number = 1) => {
    setItems((prev) => {
      const index = prev.findIndex((i) => i.id === item.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = { ...next[index], qty: next[index].qty + qty };
        return next;
      }
      return [...prev, { ...item, qty }];
    });
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQty = (id: number, qty: number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode(null);
  };

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);
  const deliveryFee = useMemo(() => subtotal > 0 ? 5 : 0, [subtotal]); // Fixed delivery fee
  const discount = useMemo(() => {
    if (!promoCode) return 0;
    // Simple promo logic - 10% off for "SAVE10"
    if (promoCode.toUpperCase() === 'SAVE10') {
      return subtotal * 0.1;
    }
    return 0;
  }, [subtotal, promoCode]);
  const total = useMemo(() => subtotal + deliveryFee - discount, [subtotal, deliveryFee, discount]);
  const totalCount = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  const applyPromoCode = (code: string): boolean => {
    const upperCode = code.toUpperCase();
    if (upperCode === 'SAVE10') {
      setPromoCode(upperCode);
      return true;
    }
    return false;
  };

  const value = useMemo(
    () => ({ 
      items, 
      addItem, 
      removeItem, 
      updateQty, 
      clearCart, 
      subtotal, 
      deliveryFee, 
      discount, 
      total, 
      totalCount,
      applyPromoCode
    }),
    [items, subtotal, deliveryFee, discount, total, totalCount, applyPromoCode]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};



