import React, { createContext, useState, useContext, useMemo } from 'react';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  unitLabel: string;
  imageUrl: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  store: string;
  address: string;
  paymentMethod: string;
  deliveryMethod?: string;
  deliveryMethodEmoji?: string;
  estimatedDeliveryTime?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';
  createdAt: Date;
  estimatedDelivery?: Date;
  eta?: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrder: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => {
    const orderNumber = Math.floor(Math.random() * 9000000) + 1000000;
    const newOrder: Order = {
      ...orderData,
      id: `QKM-${orderNumber}`,
      orderNumber,
      createdAt: new Date(),
      status: 'pending',
      eta: '25 min'
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status, eta: status === 'on_the_way' ? '15 min' : order.eta }
        : order
    ));
  };

  const getOrder = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  const value = useMemo(() => ({
    orders,
    addOrder,
    updateOrderStatus,
    getOrder
  }), [orders]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};


