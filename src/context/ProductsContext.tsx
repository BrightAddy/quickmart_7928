import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  id: string;
  storeId: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  status: 'Active' | 'Inactive';
  featured: boolean;
  sales: number;
  revenue: number;
  image: string;
  description?: string;
  unitLabel?: string;
  rating?: number;
  inStock?: boolean;
}

export interface Store {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string;
  imageUrl: string;
  distance?: string;
  isFavorite?: boolean;
  categories: string[];
  ownerId: string;
}

interface ProductsContextType {
  // Store Management
  stores: Store[];
  addStore: (store: Store) => void;
  updateStore: (storeId: string, updates: Partial<Store>) => void;
  deleteStore: (storeId: string) => void;
  searchStores: (query: string) => Store[];
  
  // Product Management
  products: Product[];
  getStoreProducts: (storeId: string) => Product[];
  getActiveProducts: (storeId: string) => Product[];
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  
  // Customer Interface
  getCustomerStoreProducts: (storeId: string) => Product[];
  searchProducts: (query: string, storeId?: string) => Product[];
  getProductsByCategory: (category: string, storeId?: string) => Product[];
  
  // Store Owner Interface
  getStoreOwnerProducts: (ownerId: string) => Product[];
  getProductStats: (ownerId: string) => {
    total: number;
    lowStock: number;
    active: number;
    revenue: number;
  };
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

interface ProductsProviderProps {
  children: ReactNode;
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({ children }) => {
  const [stores, setStores] = useState<Store[]>([
    {
      id: 'store-001',
      name: "Kofi's Fresh Market",
      rating: 4.8,
      deliveryTime: '15-25 min',
      imageUrl: 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=800',
      distance: '0.8 km',
      isFavorite: true,
      categories: ['Fresh Produce', 'Local Items', 'Food', 'Beverages'],
      ownerId: 'owner-001'
    },
    {
      id: 'store-002',
      name: "Ama's Grocery Store",
      rating: 4.6,
      deliveryTime: '20-30 min',
      imageUrl: 'https://images.pexels.com/photos/2292837/pexels-photo-2292837.jpeg?auto=compress&cs=tinysrgb&w=800',
      distance: '1.2 km',
      isFavorite: false,
      categories: ['Groceries', 'Household', 'Food', 'Beverages'],
      ownerId: 'owner-002'
    },
    {
      id: 'store-003',
      name: 'Fresh Market Accra',
      rating: 4.5,
      deliveryTime: '25-35 min',
      imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3',
      distance: '1.5 km',
      isFavorite: false,
      categories: ['Fresh Produce', 'Food', 'Beverages', 'Snacks'],
      ownerId: 'owner-003'
    }
    ,
    // Nearby Stores - ensure IDs match CustomerHome nearby list
    {
      id: 'ns1',
      name: 'Sunrise Supermarket',
      rating: 4.6,
      deliveryTime: '10-20 min',
      imageUrl: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&fit=crop&w=400&q=80',
      distance: '0.7 km',
      isFavorite: false,
      categories: ['Groceries', 'Produce', 'Bakery', 'Dairy', 'Beverages', 'Snacks'],
      ownerId: 'owner-ns1'
    },
    {
      id: 'ns2',
      name: 'MedCare Pharmacy',
      rating: 4.8,
      deliveryTime: '15-25 min',
      imageUrl: 'https://plus.unsplash.com/premium_photo-1687814802129-1896ae12cb36?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZHJ1Z3N8ZW58MHx8MHx8fDA%3D',
      distance: '1.1 km',
      isFavorite: false,
      categories: ['Medicines', 'OTC', 'Supplements', 'Personal Care', 'First Aid'],
      ownerId: 'owner-ns2'
    },
    {
      id: 'ns3',
      name: 'City Fresh Mart',
      rating: 4.5,
      deliveryTime: '12-22 min',
      imageUrl: 'https://images.pexels.com/photos/4393667/pexels-photo-4393667.jpeg?auto=compress&fit=crop&w=400&q=80',
      distance: '1.4 km',
      isFavorite: false,
      categories: ['Groceries', 'Produce', 'Beverages', 'Snacks'],
      ownerId: 'owner-ns3'
    },
    {
      id: 'ns4',
      name: 'StyleHub Boutique',
      rating: 4.3,
      deliveryTime: '20-30 min',
      imageUrl: 'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&fit=crop&w=400&q=80',
      distance: '2.3 km',
      isFavorite: false,
      categories: ['Men', 'Women', 'Footwear', 'Accessories'],
      ownerId: 'owner-ns4'
    },
    {
      id: 'ns5',
      name: 'GreenLeaf Organics',
      rating: 4.7,
      deliveryTime: '18-28 min',
      imageUrl: 'https://images.pexels.com/photos/586744/pexels-photo-586744.jpeg?auto=compress&fit=crop&w=400&q=80',
      distance: '1.9 km',
      isFavorite: false,
      categories: ['Organic Produce', 'Health Foods', 'Beverages'],
      ownerId: 'owner-ns5'
    }
  ]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: 'PRD-001',
      storeId: 'store-001',
      name: 'Fresh Bananas',
      category: 'Fruits',
      price: 8.5,
      stock: 45,
      sku: 'BANANA-FRESH-001',
      status: 'Active',
      featured: true,
      sales: 89,
      revenue: 756.5,
      image: 'https://images.unsplash.com/photo-1744659753302-9f4fc320f085?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZyZXNoJTIwYmFuYW5hfGVufDB8fDB8fHww',
      description: 'Fresh yellow bananas from local farms',
      unitLabel: '1 KG',
      rating: 4.2,
      inStock: true
    },
    {
      id: 'PRD-002',
      storeId: 'store-001',
      name: 'Organic Tomatoes',
      category: 'Vegetables',
      price: 12.0,
      stock: 12,
      sku: 'TOMATO-ORG-001',
      status: 'Active',
      featured: false,
      sales: 156,
      revenue: 1872.0,
      image: 'https://images.unsplash.com/photo-1745791562822-7ac21012bbb2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b3JnYW5pYyUyMHRvbWF0b2VzfGVufDB8fDB8fHww',
      description: 'Fresh organic tomatoes',
      unitLabel: '1 KG',
      rating: 4.5,
      inStock: true
    },
    {
      id: 'PRD-003',
      storeId: 'store-001',
      name: 'Fresh Milk 1L',
      category: 'Dairy',
      price: 6.5,
      stock: 0,
      sku: 'MILK-FRESH-1L',
      status: 'Inactive',
      featured: false,
      sales: 67,
      revenue: 435.5,
      image: 'https://images.unsplash.com/photo-1523473827533-2a64d0d36748?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJlc2glMjBtaWxrfGVufDB8fDB8fHww',
      description: 'Fresh cow milk',
      unitLabel: '1 Liter',
      rating: 4.0,
      inStock: false
    },
    {
      id: 'PRD-004',
      storeId: 'store-002',
      name: 'Chicken Breast',
      category: 'Meat',
      price: 25.0,
      stock: 78,
      sku: 'CHICKEN-BREAST-001',
      status: 'Active',
      featured: true,
      sales: 189,
      revenue: 4725.0,
      image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMGJyZWFzdHxlbnwwfHwwfHx8MA%3D%3D',
      description: 'Fresh chicken breast',
      unitLabel: '1 KG',
      rating: 4.3,
      inStock: true
    },
    {
      id: 'PRD-005',
      storeId: 'store-002',
      name: 'Whole Wheat Bread',
      category: 'Bakery',
      price: 4.5,
      stock: 23,
      sku: 'BREAD-WHEAT-001',
      status: 'Active',
      featured: false,
      sales: 234,
      revenue: 1053.0,
      image: 'https://images.unsplash.com/photo-1565181917578-a87c12e04ff7?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2hlYXQlMjBicmVhZHxlbnwwfHwwfHx8MA%3D%3D',
      description: 'Fresh whole wheat bread',
      unitLabel: '1 Loaf',
      rating: 4.1,
      inStock: true
    },
    {
      id: 'PRD-006',
      storeId: 'store-003',
      name: 'Orange Juice 500ml',
      category: 'Beverages',
      price: 7.0,
      stock: 34,
      sku: 'JUICE-ORANGE-500',
      status: 'Active',
      featured: false,
      sales: 156,
      revenue: 1092.0,
      image: 'https://plus.unsplash.com/premium_photo-1667543228378-ec4478ab2845?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b3JhbmdlJTIwanVpY2V8ZW58MHx8MHx8fDA%3D',
      description: 'Fresh orange juice',
      unitLabel: '500ml',
      rating: 4.4,
      inStock: true
    },
    {
      id: 'PRD-007',
      storeId: 'store-003',
      name: 'Plantain Chips',
      category: 'Snacks',
      price: 5.5,
      stock: 56,
      sku: 'CHIPS-PLANTAIN-001',
      status: 'Active',
      featured: true,
      sales: 89,
      revenue: 489.5,
      image: 'https://media.istockphoto.com/id/2161799331/photo/plantain-chips.webp?a=1&b=1&s=612x612&w=0&k=20&c=4dwN8tqoO-7S8J9HQP26ux45z_Lhj_CV-82HHb9HKLU=',
      description: 'Crispy plantain chips',
      unitLabel: '200g',
      rating: 4.0,
      inStock: true
    },
    {
      id: 'PRD-008',
      storeId: 'store-001',
      name: 'Potatoes',
      category: 'Vegetables',
      price: 3.5,
      stock: 120,
      sku: 'ONION-RED-001',
      status: 'Active',
      featured: false,
      sales: 210,
      revenue: 735.0,
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=60',
      description: 'Fresh red onions',
      unitLabel: '1 KG',
      rating: 4.2,
      inStock: true
    },
    {
      id: 'PRD-009',
      storeId: 'store-001',
      name: 'Black Berries',
      category: 'Fruits',
      price: 10.0,
      stock: 38,
      sku: 'PINEAPPLE-001',
      status: 'Active',
      featured: true,
      sales: 92,
      revenue: 920.0,
      image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=800&q=60',
      description: 'Sweet Ghanaian pineapple',
      unitLabel: '1 Pc',
      rating: 4.6,
      inStock: true
    },
    {
      id: 'PRD-010',
      storeId: 'store-001',
      name: 'Yoghurt 500ml',
      category: 'Dairy',
      price: 8.0,
      stock: 44,
      sku: 'YOG-500-001',
      status: 'Active',
      featured: false,
      sales: 76,
      revenue: 608.0,
      image: 'https://images.unsplash.com/photo-1709620054862-c2eb5b9dbefc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8eW9ndXJ0JTIwNTAwbWx8ZW58MHx8MHx8fDA%3D',
      description: 'Plain yoghurt 500ml',
      unitLabel: '500ml',
      rating: 4.1,
      inStock: true
    },
    {
      id: 'PRD-011',
      storeId: 'store-002',
      name: 'Beef Mince',
      category: 'Meat',
      price: 32.0,
      stock: 26,
      sku: 'BEEF-MINCE-001',
      status: 'Active',
      featured: false,
      sales: 65,
      revenue: 2080.0,
      image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=60',
      description: 'Fresh beef mince',
      unitLabel: '1 KG',
      rating: 4.4,
      inStock: true
    },
    {
      id: 'PRD-012',
      storeId: 'store-002',
      name: 'Brown Eggs (12)',
      category: 'Dairy',
      price: 18.0,
      stock: 60,
      sku: 'EGG-BROWN-12',
      status: 'Active',
      featured: true,
      sales: 301,
      revenue: 5418.0,
      image: 'https://images.unsplash.com/photo-1701252776710-d81bfd7a5806?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnJvd24lMjBlZ2dzfGVufDB8fDB8fHww',
      description: 'Free-range brown eggs pack of 12',
      unitLabel: '12 Pack',
      rating: 4.7,
      inStock: true
    },
    {
      id: 'PRD-013',
      storeId: 'store-002',
      name: 'Sliced Bread',
      category: 'Bakery',
      price: 5.0,
      stock: 80,
      sku: 'BREAD-SLICED-001',
      status: 'Active',
      featured: false,
      sales: 402,
      revenue: 2010.0,
      image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=60',
      description: 'Soft white sliced bread',
      unitLabel: '1 Loaf',
      rating: 4.0,
      inStock: true
    },
    {
      id: 'PRD-014',
      storeId: 'store-003',
      name: 'Coca-Cola 1.5L',
      category: 'Beverages',
      price: 12.0,
      stock: 100,
      sku: 'COKE-1_5L-001',
      status: 'Active',
      featured: false,
      sales: 520,
      revenue: 6240.0,
      image: 'https://images.unsplash.com/photo-1732031750172-1600351813d0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNva2ElMjBjb2xhfGVufDB8fDB8fHww',
      description: 'Coca-Cola bottle 1.5L',
      unitLabel: '1.5L',
      rating: 4.3,
      inStock: true
    },
    {
      id: 'PRD-015',
      storeId: 'store-003',
      name: 'Mango',
      category: 'Fruits',
      price: 6.0,
      stock: 70,
      sku: 'MANGO-001',
      status: 'Active',
      featured: true,
      sales: 210,
      revenue: 1260.0,
      image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFuZ298ZW58MHx8MHx8fDA%3D',
      description: 'Juicy ripe mango',
      unitLabel: '1 Pc',
      rating: 4.5,
      inStock: true
    },
    {
      id: 'PRD-016',
      storeId: 'store-001',
      name: 'Tomato Paste 400g',
      category: 'Snacks',
      price: 9.0,
      stock: 90,
      sku: 'TOM-PASTE-400',
      status: 'Active',
      featured: false,
      sales: 180,
      revenue: 1620.0,
      image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG9tYXRvJTIwcGFzdGV8ZW58MHx8MHx8fDA%3D',
      description: 'Rich tomato paste can',
      unitLabel: '400g',
      rating: 4.1,
      inStock: true
    },
    {
      id: 'PRD-017',
      storeId: 'store-002',
      name: 'Pineapple',
      category: 'Fruits',
      price: 7.5,
      stock: 48,
      sku: 'AVO-001',
      status: 'Active',
      featured: false,
      sales: 110,
      revenue: 825.0,
      image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=60',
      description: 'Creamy Hass avocado',
      unitLabel: '1 Pc',
      rating: 4.6,
      inStock: true
    },
    {
      id: 'PRD-018',
      storeId: 'store-003',
      name: 'Cabbage',
      category: 'Vegetables',
      price: 4.0,
      stock: 64,
      sku: 'CABBAGE-001',
      status: 'Active',
      featured: false,
      sales: 90,
      revenue: 360.0,
      image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FiYmFnZXxlbnwwfHwwfHx8MA%3D%3D',
      description: 'Green cabbage head',
      unitLabel: '1 Pc',
      rating: 4.0,
      inStock: true
    },
    {
      id: 'PRD-019',
      storeId: 'store-001',
      name: 'Groundnuts 500g',
      category: 'Snacks',
      price: 14.0,
      stock: 52,
      sku: 'GROUNDNUT-500',
      status: 'Active',
      featured: true,
      sales: 150,
      revenue: 2100.0,
      image: 'https://media.istockphoto.com/id/1333516900/photo/fresh-raw-peanuts-in-clear-plastic-wrap.webp?a=1&b=1&s=612x612&w=0&k=20&c=hDyHC0EXHh6L3hybQYOOnGmlsmwuRgmGFRB0T-nUmME=',
      description: 'Roasted peanuts 500g',
      unitLabel: '500g',
      rating: 4.3,
      inStock: true
    },
    {
      id: 'PRD-020',
      storeId: 'store-002',
      name: 'Tilapia',
      category: 'Meat',
      price: 22.0,
      stock: 33,
      sku: 'TILAPIA-001',
      status: 'Active',
      featured: false,
      sales: 70,
      revenue: 1540.0,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=60',
      description: 'Fresh farmed tilapia',
      unitLabel: '1 KG',
      rating: 4.2,
      inStock: true
    },
    // Pharmacy - MedCare Pharmacy (ns2)
    {
      id: 'PHARM-001',
      storeId: 'ns2',
      name: 'Paracetamol 500mg (Blister 10)',
      category: 'Medicines',
      price: 9.5,
      stock: 120,
      sku: 'MED-PARA-500-10',
      status: 'Active',
      featured: true,
      sales: 240,
      revenue: 2280.0,
      image: 'https://plus.unsplash.com/premium_photo-1664373622315-61c8ba4282a8?q=80&w=984&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      description: 'Pain reliever and fever reducer',
      unitLabel: '10 tablets',
      rating: 4.6,
      inStock: true
    },
    {
      id: 'PHARM-002',
      storeId: 'ns2',
      name: 'Ibuprofen 200mg (Blister 10)',
      category: 'Medicines',
      price: 10.0,
      stock: 85,
      sku: 'MED-IBU-200-10',
      status: 'Active',
      featured: false,
      sales: 180,
      revenue: 1800.0,
      image: 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aWJ1cHJvZmVufGVufDB8fDB8fHww',
      description: 'Anti-inflammatory pain relief',
      unitLabel: '10 tablets',
      rating: 4.5,
      inStock: true
    },
    {
      id: 'PHARM-003',
      storeId: 'ns2',
      name: 'Vitamin C 1000mg',
      category: 'Supplements',
      price: 35.0,
      stock: 60,
      sku: 'SUPP-VITC-1000',
      status: 'Active',
      featured: true,
      sales: 95,
      revenue: 3325.0,
      image: 'https://images.unsplash.com/photo-1614858819016-2d5e6006f29a?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dml0YW1pbiUyMGMlMjBkcnVnfGVufDB8fDB8fHww',
      description: 'Immune support tablets',
      unitLabel: 'Bottle',
      rating: 4.7,
      inStock: true
    },
    {
      id: 'PHARM-004',
      storeId: 'ns2',
      name: 'Cough Syrup 100ml',
      category: 'OTC',
      price: 28.0,
      stock: 40,
      sku: 'OTC-COUGH-100',
      status: 'Active',
      featured: false,
      sales: 62,
      revenue: 1736.0,
      image: 'https://images.unsplash.com/photo-1635166304271-04931640a450?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y291Z2glMjBzeXJ1cHxlbnwwfHwwfHx8MA%3D%3D',
      description: 'Soothing cough relief syrup',
      unitLabel: '100 ml',
      rating: 4.3,
      inStock: true
    },
    {
      id: 'PHARM-005',
      storeId: 'ns2',
      name: 'Adhesive Bandages (20 pack)',
      category: 'First Aid',
      price: 14.0,
      stock: 150,
      sku: 'FA-BAND-20',
      status: 'Active',
      featured: false,
      sales: 210,
      revenue: 2940.0,
      image: 'https://images.unsplash.com/photo-1652354989460-ecccd5644412?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YWRoZXNzaXZlJTIwYmFuZGFnZXN8ZW58MHx8MHx8fDA%3D',
      description: 'Assorted sizes',
      unitLabel: '20 pcs',
      rating: 4.4,
      inStock: true
    },
    {
      id: 'PHARM-006',
      storeId: 'ns2',
      name: 'Hand Sanitizer 250ml',
      category: 'Personal Care',
      price: 20.0,
      stock: 90,
      sku: 'PC-SAN-250',
      status: 'Active',
      featured: false,
      sales: 140,
      revenue: 2800.0,
      image: 'https://images.unsplash.com/photo-1608564348103-2b78891150cf?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGFuZCUyMHNhbml0aXplcnxlbnwwfHwwfHx8MA%3D%3D',
      description: 'Kills 99.9% germs',
      unitLabel: '250 ml',
      rating: 4.2,
      inStock: true
    },
    // Clothing - StyleHub Boutique (ns4)
    {
      id: 'CLOTH-001',
      storeId: 'ns4',
      name: "Men's Classic T-Shirt",
      category: 'Men',
      price: 75.0,
      stock: 48,
      sku: 'MEN-TSHIRT-CLASSIC',
      status: 'Active',
      featured: true,
      sales: 60,
      revenue: 4500.0,
      image: 'https://images.pexels.com/photos/5325891/pexels-photo-5325891.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: '100% cotton crew neck',
      unitLabel: 'Size S-XL',
      rating: 4.5,
      inStock: true
    },
    {
      id: 'CLOTH-002',
      storeId: 'ns4',
      name: 'Slim Fit Jeans',
      category: 'Men',
      price: 180.0,
      stock: 35,
      sku: 'MEN-JEANS-SLIM',
      status: 'Active',
      featured: false,
      sales: 42,
      revenue: 7560.0,
      image: 'https://images.pexels.com/photos/4448848/pexels-photo-4448848.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Dark wash denim',
      unitLabel: 'Size 28-38',
      rating: 4.4,
      inStock: true
    },
    {
      id: 'CLOTH-003',
      storeId: 'ns4',
      name: "Women's Summer Dress",
      category: 'Women',
      price: 220.0,
      stock: 28,
      sku: 'WOM-DRESS-SUMMER',
      status: 'Active',
      featured: true,
      sales: 38,
      revenue: 8360.0,
      image: 'https://images.pexels.com/photos/7940647/pexels-photo-7940647.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Floral midi dress',
      unitLabel: 'Size XS-L',
      rating: 4.6,
      inStock: true
    },
    {
      id: 'CLOTH-004',
      storeId: 'ns4',
      name: 'White Sneakers',
      category: 'Footwear',
      price: 260.0,
      stock: 40,
      sku: 'SHOE-SNEAKERS-WHITE',
      status: 'Active',
      featured: false,
      sales: 55,
      revenue: 14300.0,
      image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Comfortable everyday wear',
      unitLabel: 'Size 36-45',
      rating: 4.3,
      inStock: true
    },
    {
      id: 'CLOTH-005',
      storeId: 'ns4',
      name: 'Leather Handbag',
      category: 'Accessories',
      price: 350.0,
      stock: 22,
      sku: 'ACC-HANDBAG-LEATHER',
      status: 'Active',
      featured: true,
      sales: 20,
      revenue: 7000.0,
      image: 'https://images.pexels.com/photos/4755427/pexels-photo-4755427.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Genuine leather tote',
      unitLabel: 'One size',
      rating: 4.7,
      inStock: true
    },
    // Supermarket - Sunrise Supermarket (ns1)
    {
      id: 'NS1-001',
      storeId: 'ns1',
      name: 'Jasmine Rice 5kg',
      category: 'Groceries',
      price: 95.0,
      stock: 50,
      sku: 'GROC-RICE-5KG',
      status: 'Active',
      featured: true,
      sales: 120,
      revenue: 11400.0,
      image: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Premium jasmine rice',
      unitLabel: '5 kg',
      rating: 4.5,
      inStock: true
    },
    {
      id: 'NS1-002',
      storeId: 'ns1',
      name: 'Cooking Oil 1L',
      category: 'Groceries',
      price: 45.0,
      stock: 80,
      sku: 'GROC-OIL-1L',
      status: 'Active',
      featured: false,
      sales: 200,
      revenue: 9000.0,
      image: 'https://images.pexels.com/photos/4199093/pexels-photo-4199093.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Refined vegetable oil',
      unitLabel: '1 L',
      rating: 4.2,
      inStock: true
    },
    {
      id: 'NS1-003',
      storeId: 'ns1',
      name: 'Fresh Tomatoes',
      category: 'Produce',
      price: 14.0,
      stock: 100,
      sku: 'PROD-TOMATO-1KG',
      status: 'Active',
      featured: false,
      sales: 160,
      revenue: 2240.0,
      image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Farm-fresh tomatoes',
      unitLabel: '1 kg',
      rating: 4.4,
      inStock: true
    },
    {
      id: 'NS1-004',
      storeId: 'ns1',
      name: 'Whole Wheat Bread',
      category: 'Bakery',
      price: 8.0,
      stock: 70,
      sku: 'BAK-BREAD-WW',
      status: 'Active',
      featured: false,
      sales: 140,
      revenue: 1120.0,
      image: 'https://images.pexels.com/photos/1509440159596-0249088772ff/pexels-photo-1509440159596-0249088772ff.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Freshly baked',
      unitLabel: '1 loaf',
      rating: 4.1,
      inStock: true
    },
    // Grocery - City Fresh Mart (ns3)
    {
      id: 'NS3-001',
      storeId: 'ns3',
      name: 'Plantain (Bunch)',
      category: 'Produce',
      price: 22.0,
      stock: 60,
      sku: 'PROD-PLANTAIN',
      status: 'Active',
      featured: true,
      sales: 90,
      revenue: 1980.0,
      image: 'https://images.pexels.com/photos/4109950/pexels-photo-4109950.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Ripe plantains',
      unitLabel: 'Bunch',
      rating: 4.5,
      inStock: true
    },
    {
      id: 'NS3-002',
      storeId: 'ns3',
      name: 'Bottled Water 1.5L',
      category: 'Beverages',
      price: 6.0,
      stock: 180,
      sku: 'BEV-WATER-1_5L',
      status: 'Active',
      featured: false,
      sales: 260,
      revenue: 1560.0,
      image: 'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Purified drinking water',
      unitLabel: '1.5 L',
      rating: 4.2,
      inStock: true
    },
    {
      id: 'NS3-003',
      storeId: 'ns3',
      name: 'Cereal 500g',
      category: 'Groceries',
      price: 18.0,
      stock: 75,
      sku: 'GROC-CEREAL-500',
      status: 'Active',
      featured: false,
      sales: 110,
      revenue: 1980.0,
      image: 'https://images.pexels.com/photos/4197802/pexels-photo-4197802.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Breakfast cereal',
      unitLabel: '500 g',
      rating: 4.1,
      inStock: true
    },
    // Organic - GreenLeaf Organics (ns5)
    {
      id: 'NS5-001',
      storeId: 'ns5',
      name: 'Organic Kale',
      category: 'Organic Produce',
      price: 16.0,
      stock: 65,
      sku: 'ORG-KALE-1BUNCH',
      status: 'Active',
      featured: true,
      sales: 88,
      revenue: 1408.0,
      image: 'https://images.pexels.com/photos/1212845/pexels-photo-1212845.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Certified organic kale',
      unitLabel: 'Bunch',
      rating: 4.6,
      inStock: true
    },
    {
      id: 'NS5-002',
      storeId: 'ns5',
      name: 'Almond Milk 1L',
      category: 'Beverages',
      price: 24.0,
      stock: 55,
      sku: 'BEV-ALMOND-1L',
      status: 'Active',
      featured: false,
      sales: 75,
      revenue: 1800.0,
      image: 'https://images.pexels.com/photos/5938253/pexels-photo-5938253.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Dairy-free almond milk',
      unitLabel: '1 L',
      rating: 4.3,
      inStock: true
    },
    {
      id: 'NS5-003',
      storeId: 'ns5',
      name: 'Quinoa 1kg',
      category: 'Health Foods',
      price: 48.0,
      stock: 40,
      sku: 'HF-QUINOA-1KG',
      status: 'Active',
      featured: true,
      sales: 52,
      revenue: 2496.0,
      image: 'https://images.pexels.com/photos/6287226/pexels-photo-6287226.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'High-protein superfood',
      unitLabel: '1 kg',
      rating: 4.5,
      inStock: true
    }
  ]);

  // Store Management Functions
  const addStore = (store: Store) => {
    setStores(prev => [...prev, store]);
  };

  const updateStore = (storeId: string, updates: Partial<Store>) => {
    setStores(prev => prev.map(store => 
      store.id === storeId ? { ...store, ...updates } : store
    ));
  };

  const deleteStore = (storeId: string) => {
    setStores(prev => prev.filter(store => store.id !== storeId));
    // Also delete all products from this store
    setProducts(prev => prev.filter(product => product.storeId !== storeId));
  };

  // Product Management Functions
  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === productId ? { ...product, ...updates } : product
    ));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
  };

  // Helper Functions
  const getStoreProducts = (storeId: string): Product[] => {
    return products.filter(product => product.storeId === storeId);
  };

  const getActiveProducts = (storeId: string): Product[] => {
    return products.filter(product => 
      product.storeId === storeId && product.status === 'Active'
    );
  };

  const getCustomerStoreProducts = (storeId: string): Product[] => {
    return products.filter(product => 
      product.storeId === storeId && 
      product.status === 'Active' && 
      product.stock > 0
    );
  };

  const getStoreOwnerProducts = (ownerId: string): Product[] => {
    const ownerStores = stores.filter(store => store.ownerId === ownerId);
    const storeIds = ownerStores.map(store => store.id);
    return products.filter(product => storeIds.includes(product.storeId));
  };

  const getProductStats = (ownerId: string) => {
    const ownerProducts = getStoreOwnerProducts(ownerId);
    return {
      total: ownerProducts.length,
      lowStock: ownerProducts.filter(p => p.stock <= 10).length,
      active: ownerProducts.filter(p => p.status === 'Active').length,
      revenue: ownerProducts.reduce((sum, p) => sum + p.revenue, 0)
    };
  };

  const searchProducts = (query: string, storeId?: string): Product[] => {
    let filteredProducts = products.filter(product => 
      product.status === 'Active' && product.stock > 0
    );
    
    if (storeId) {
      filteredProducts = filteredProducts.filter(product => product.storeId === storeId);
    }
    
    if (query.trim()) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.sku.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    return filteredProducts;
  };

  const getProductsByCategory = (category: string, storeId?: string): Product[] => {
    let filteredProducts = products.filter(product => 
      product.status === 'Active' && product.stock > 0
    );
    
    if (storeId) {
      filteredProducts = filteredProducts.filter(product => product.storeId === storeId);
    }
    
    if (category !== 'All') {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    return filteredProducts;
  };

  const searchStores = (query: string): Store[] => {
    const q = (query || '').toLowerCase();
    if (!q.trim()) return [];
    return stores.filter(s => {
      const inName = s.name.toLowerCase().includes(q);
      const inCats = (s.categories || []).some((c: string) => (c || '').toLowerCase().includes(q));
      return inName || inCats;
    });
  };

  const value: ProductsContextType = {
    stores,
    addStore,
    updateStore,
    deleteStore,
    searchStores,
    products,
    getStoreProducts,
    getActiveProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getCustomerStoreProducts,
    searchProducts,
    getProductsByCategory,
    getStoreOwnerProducts,
    getProductStats
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
