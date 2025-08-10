import { Order } from '@/types';
import { mockProducts } from './products';

export const mockOrders: Order[] = [
  {
    id: 'o1',
    customerId: 'c1',
    employeeId: 'e1',
    storeId: 's1',
    items: [
      {
        product: mockProducts[0], // Fresh Tomatoes
        quantity: 2
      },
      {
        product: mockProducts[2], // Rice
        quantity: 1
      }
    ],
    status: 'delivered',
    total: 90.00,
    deliveryFee: 10.00,
    address: {
      id: 'a1',
      name: 'Home',
      address: '123 Independence Ave, Accra',
      details: 'Near Accra Mall',
      latitude: 5.6037,
      longitude: -0.1870,
      isDefault: true,
    },
    paymentMethod: {
      id: 'pm1',
      type: 'momo',
      name: 'MTN Mobile Money',
      details: '+233501234567',
      isDefault: true,
    },
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000, // 2 hours after creation
  },
  {
    id: 'o2',
    customerId: 'c1',
    employeeId: 'e2',
    storeId: 's2',
    items: [
      {
        product: mockProducts[5], // Fresh Tilapia
        quantity: 1
      },
      {
        product: mockProducts[7], // Fresh Bread
        quantity: 2
      }
    ],
    status: 'delivered',
    total: 55.00,
    deliveryFee: 10.00,
    address: {
      id: 'a2',
      name: 'Work',
      address: '45 Liberation Rd, Accra',
      details: 'Office Building, 3rd Floor',
      latitude: 5.6219,
      longitude: -0.1733,
      isDefault: false,
    },
    paymentMethod: {
      id: 'pm2',
      type: 'card',
      name: 'Visa Card',
      details: '**** **** **** 4567',
      isDefault: false,
    },
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000, // 3 hours after creation
  },
  {
    id: 'o3',
    customerId: 'c2',
    employeeId: 'e1',
    storeId: 's3',
    items: [
      {
        product: mockProducts[10], // Coca-Cola
        quantity: 3
      },
      {
        product: mockProducts[11], // Potato Chips
        quantity: 2
      }
    ],
    status: 'delivered',
    total: 46.00,
    deliveryFee: 10.00,
    address: {
      id: 'a3',
      name: 'Home',
      address: '78 Cantonments Rd, Accra',
      details: 'Blue gate',
      latitude: 5.5913,
      longitude: -0.1733,
      isDefault: true,
    },
    paymentMethod: {
      id: 'pm3',
      type: 'momo',
      name: 'Vodafone Cash',
      details: '+233507654321',
      isDefault: true,
    },
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    updatedAt: Date.now() - 7 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000, // 2.5 hours after creation
  },
  {
    id: 'o4',
    customerId: 'c1',
    storeId: 's1',
    items: [
      {
        product: mockProducts[3], // Cooking Oil
        quantity: 1
      },
      {
        product: mockProducts[4], // Toilet Paper
        quantity: 2
      }
    ],
    status: 'pending',
    total: 58.50,
    deliveryFee: 10.00,
    address: {
      id: 'a1',
      name: 'Home',
      address: '123 Independence Ave, Accra',
      details: 'Near Accra Mall',
      latitude: 5.6037,
      longitude: -0.1870,
      isDefault: true,
    },
    paymentMethod: {
      id: 'pm1',
      type: 'momo',
      name: 'MTN Mobile Money',
      details: '+233501234567',
      isDefault: true,
    },
    createdAt: Date.now() - 30 * 60 * 1000, // 30 minutes ago
    updatedAt: Date.now() - 30 * 60 * 1000,
  }
];

export const getOrdersByCustomer = (customerId: string): Order[] => {
  return mockOrders.filter(order => order.customerId === customerId);
};

export const getOrdersByEmployee = (employeeId: string): Order[] => {
  return mockOrders.filter(order => order.employeeId === employeeId);
};

export const getOrdersByStore = (storeId: string): Order[] => {
  return mockOrders.filter(order => order.storeId === storeId);
};

export const getPendingOrders = (): Order[] => {
  return mockOrders.filter(order => order.status === 'pending');
};

// Add the missing getOrderById function
export const getOrderById = (orderId: string): Order | undefined => {
  return mockOrders.find(order => order.id === orderId);
};