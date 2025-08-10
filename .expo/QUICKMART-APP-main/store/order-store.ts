import { create } from 'zustand';
import { Order, Address, PaymentMethod, CartItem, OrderStatus } from '@/types';
import { mockOrders } from '@/mocks/orders';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  
  fetchOrders: (userId: string, role: string) => void;
  getOrderById: (orderId: string) => Order | null;
  createOrder: (
    customerId: string,
    storeId: string,
    items: CartItem[],
    address: Address,
    paymentMethod: PaymentMethod
  ) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, employeeId?: string) => void;
  markDeliveredByShopper: (orderId: string, deliveryPhoto?: string) => void;
  confirmDeliveryByCustomer: (orderId: string) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [...mockOrders], // Initialize with mock orders
  currentOrder: null,
  isLoading: false,
  error: null,
  
  fetchOrders: (userId, role) => {
    set({ isLoading: true, error: null });
    
    try {
      // Filter orders based on user role
      let filteredOrders: Order[] = [];
      
      if (role === 'customer') {
        filteredOrders = get().orders.filter(order => order.customerId === userId);
      } else if (role === 'employee') {
        filteredOrders = get().orders.filter(order => 
          order.employeeId === userId || 
          (order.status === 'pending' && !order.employeeId)
        );
      } else if (role === 'store_owner') {
        // Assuming store owners can see orders for their store
        const storeId = userId; // In this case, userId would be storeId
        filteredOrders = get().orders.filter(order => order.storeId === storeId);
      }
      
      set({ orders: filteredOrders, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch orders', isLoading: false });
    }
  },
  
  getOrderById: (orderId) => {
    return get().orders.find(order => order.id === orderId) || null;
  },
  
  createOrder: async (customerId, storeId, items, address, paymentMethod) => {
    set({ isLoading: true, error: null });
    
    try {
      // Calculate total
      const subtotal = items.reduce((total, item) => {
        const price = item.product.discountPrice || item.product.price;
        return total + (price * item.quantity);
      }, 0);
      
      const deliveryFee = 10.00; // Fixed delivery fee
      const total = subtotal + deliveryFee;
      
      // Create new order with unique ID
      const newOrder: Order = {
        id: `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        customerId,
        storeId,
        items: [...items], // Create a copy of items array
        status: 'pending',
        total,
        deliveryFee,
        address: { ...address }, // Create a copy of address object
        paymentMethod: { ...paymentMethod }, // Create a copy of paymentMethod object
        createdAt: Date.now(),
        updatedAt: Date.now(),
        estimatedDeliveryTime: Date.now() + 60 * 60 * 1000, // 1 hour from now
      };
      
      // Add to orders list
      set(state => ({
        orders: [...state.orders, newOrder],
        currentOrder: newOrder,
        isLoading: false
      }));
      
      console.log("Order created successfully:", newOrder);
      return newOrder;
    } catch (error) {
      console.error("Error creating order:", error);
      set({ error: 'Failed to create order', isLoading: false });
      throw error;
    }
  },
  
  updateOrderStatus: (orderId, status, employeeId) => {
    set(state => {
      const updatedOrders = state.orders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status,
            employeeId: employeeId || order.employeeId,
            updatedAt: Date.now()
          };
        }
        return order;
      });
      
      const updatedCurrentOrder = state.currentOrder?.id === orderId
        ? {
            ...state.currentOrder,
            status,
            employeeId: employeeId || state.currentOrder.employeeId,
            updatedAt: Date.now()
          }
        : state.currentOrder;
      
      return {
        orders: updatedOrders,
        currentOrder: updatedCurrentOrder
      };
    });
  },

  // New function for shopper to mark order as delivered
  markDeliveredByShopper: (orderId, deliveryPhoto) => {
    set(state => {
      const updatedOrders = state.orders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'delivered_by_shopper' as OrderStatus,
            shopperConfirmedAt: Date.now(),
            deliveryPhoto: deliveryPhoto || order.deliveryPhoto,
            updatedAt: Date.now()
          };
        }
        return order;
      });
      
      const updatedCurrentOrder = state.currentOrder?.id === orderId
        ? {
            ...state.currentOrder,
            status: 'delivered_by_shopper' as OrderStatus,
            shopperConfirmedAt: Date.now(),
            deliveryPhoto: deliveryPhoto || state.currentOrder.deliveryPhoto,
            updatedAt: Date.now()
          }
        : state.currentOrder;
      
      return {
        orders: updatedOrders,
        currentOrder: updatedCurrentOrder
      };
    });
  },

  // New function for customer to confirm delivery
  confirmDeliveryByCustomer: (orderId) => {
    set(state => {
      const updatedOrders = state.orders.map(order => {
        if (order.id === orderId) {
          // If shopper has already confirmed, mark as completed
          // Otherwise, mark as confirmed by customer
          const newStatus = order.shopperConfirmedAt 
            ? 'completed' as OrderStatus 
            : 'confirmed_by_customer' as OrderStatus;
          
          return {
            ...order,
            status: newStatus,
            customerConfirmedAt: Date.now(),
            updatedAt: Date.now()
          };
        }
        return order;
      });
      
      const updatedCurrentOrder = state.currentOrder?.id === orderId
        ? {
            ...state.currentOrder,
            status: state.currentOrder.shopperConfirmedAt 
              ? 'completed' as OrderStatus 
              : 'confirmed_by_customer' as OrderStatus,
            customerConfirmedAt: Date.now(),
            updatedAt: Date.now()
          }
        : state.currentOrder;
      
      return {
        orders: updatedOrders,
        currentOrder: updatedCurrentOrder
      };
    });
  }
}));