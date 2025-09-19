import React, { createContext, useContext, useState, ReactNode } from 'react';

type Order = {
  id: string;
  store: string;
  distanceKm: number;
  payout: number;
  items: number;
  etaMins: number;
  storeName: string; // Added for consistency
  description: string; // Added for consistency
  bonus: string; // Added for consistency
  status: string; // Added for consistency
  acceptedAt: string; // Added for tracking
};

type ShopperOrderContextType = {
  acceptedOrders: Order[];
  addAcceptedOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: string) => void;
};

const ShopperOrderContext = createContext<ShopperOrderContextType | undefined>(undefined);

export const ShopperOrderProvider = ({ children }: { children: ReactNode }) => {
  const [acceptedOrders, setAcceptedOrders] = useState<Order[]>([]);

  const addAcceptedOrder = (order: Order) => {
    setAcceptedOrders(prev => {
      if (!prev.some(o => o.id === order.id)) {
        return [...prev, order];
      }
      return prev;
    });
  };

  const updateOrderStatus = (orderId: string, status: string) => {
    if (status === 'Completed') {
      setAcceptedOrders(prev => prev.filter(order => order.id !== orderId));
    } else {
      setAcceptedOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    }
  };

  return (
    <ShopperOrderContext.Provider
      value={{
        acceptedOrders,
        addAcceptedOrder,
        updateOrderStatus
      }}
    >
      {children}
    </ShopperOrderContext.Provider>
  );
};

export const useShopperOrders = () => {
  const context = useContext(ShopperOrderContext);
  if (context === undefined) {
    throw new Error('useShopperOrders must be used within a ShopperOrderProvider');
  }
  return context;
};