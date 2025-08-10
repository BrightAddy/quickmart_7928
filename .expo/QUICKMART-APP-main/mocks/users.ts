import { Customer, Employee, StoreOwner } from '@/types';

export const mockCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'John Doe',
    email: 'customer@example.com',
    phone: '+233 50 123 4567',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    createdAt: 1622505600000,
    addresses: [
      {
        id: 'a1',
        name: 'Home',
        address: '123 Main St, Accra',
        details: 'Near the big tree',
        latitude: 5.6037,
        longitude: -0.1870,
        isDefault: true
      },
      {
        id: 'a2',
        name: 'Work',
        address: '456 Business Ave, Accra',
        details: 'Office building, 3rd floor',
        latitude: 5.6057,
        longitude: -0.1890,
        isDefault: false
      }
    ],
    paymentMethods: [
      {
        id: 'p1',
        type: 'momo',
        name: 'MTN Mobile Money',
        details: '+233 50 123 4567',
        isDefault: true
      },
      {
        id: 'p2',
        type: 'card',
        name: 'Visa Card',
        details: '**** **** **** 1234',
        isDefault: false
      }
    ]
  },
  {
    id: 'c2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+233 55 987 6543',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    createdAt: 1625184000000,
    addresses: [
      {
        id: 'a3',
        name: 'Home',
        address: '789 Residential Rd, Kumasi',
        details: 'Yellow gate',
        latitude: 6.6885,
        longitude: -1.6244,
        isDefault: true
      }
    ],
    paymentMethods: [
      {
        id: 'p3',
        type: 'momo',
        name: 'Vodafone Cash',
        details: '+233 55 987 6543',
        isDefault: true
      }
    ]
  }
];

export const mockEmployees: Employee[] = [
  {
    id: 'e1',
    name: 'Kwame Mensah',
    email: 'employee@example.com',
    phone: '+233 24 555 7890',
    role: 'employee',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop',
    createdAt: 1620086400000,
    ghanaCardId: 'GHA-123456789-0',
    ghanaCardFrontImage: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1be?q=80&w=1000&auto=format&fit=crop',
    ghanaCardBackImage: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1be?q=80&w=1000&auto=format&fit=crop',
    vehicleInfo: 'Honda Motorcycle, Red, GR 1234-20',
    momoNumber: '+233 24 555 7890',
    rating: 4.8,
    earnings: 2500,
    nextOfKin: {
      name: 'Abena Mensah',
      relationship: 'Sister',
      phone: '+233 24 111 2222',
      address: '15 Family Street, Accra'
    },
    verificationStatus: {
      isVerified: true,
      ghanaCardVerified: true,
      selfieVerified: true,
      documentationComplete: true
    },
    lastVerifiedAt: Date.now() - 86400000, // 1 day ago
    verificationHistory: [
      {
        timestamp: Date.now() - 86400000,
        selfieImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop',
        status: 'approved',
        location: {
          latitude: 5.6037,
          longitude: -0.1870
        }
      }
    ]
  },
  {
    id: 'e2',
    name: 'Ama Owusu',
    email: 'ama@example.com',
    phone: '+233 20 111 2222',
    role: 'employee',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
    createdAt: 1622505600000,
    ghanaCardId: 'GHA-987654321-0',
    ghanaCardFrontImage: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1be?q=80&w=1000&auto=format&fit=crop',
    ghanaCardBackImage: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1be?q=80&w=1000&auto=format&fit=crop',
    vehicleInfo: 'Yamaha Motorcycle, Blue, GR 5678-21',
    momoNumber: '+233 20 111 2222',
    rating: 4.6,
    earnings: 1800,
    nextOfKin: {
      name: 'Kofi Owusu',
      relationship: 'Brother',
      phone: '+233 20 333 4444',
      address: '25 Family Avenue, Tema'
    },
    verificationStatus: {
      isVerified: true,
      ghanaCardVerified: true,
      selfieVerified: true,
      documentationComplete: true
    },
    lastVerifiedAt: Date.now() - 43200000, // 12 hours ago
    verificationHistory: [
      {
        timestamp: Date.now() - 43200000,
        selfieImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
        status: 'approved',
        location: {
          latitude: 5.6057,
          longitude: -0.1890
        }
      }
    ]
  }
];

export const mockStoreOwners: StoreOwner[] = [
  {
    id: 's1',
    name: 'Kofi Addo',
    email: 'store@example.com',
    phone: '+233 27 999 8888',
    role: 'store_owner',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
    createdAt: 1617494400000,
    businessName: 'Kofi\'s Grocery',
    businessAddress: '10 Market Street, Accra',
    momoNumber: '+233 27 999 8888',
    storeId: 'st1'
  },
  {
    id: 's2',
    name: 'Abena Mensah',
    email: 'abena@example.com',
    phone: '+233 26 777 6666',
    role: 'store_owner',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200&auto=format&fit=crop',
    createdAt: 1619913600000,
    businessName: 'Abena\'s Fresh Market',
    businessAddress: '25 Commerce Ave, Tema',
    momoNumber: '+233 26 777 6666',
    storeId: 'st2'
  }
];