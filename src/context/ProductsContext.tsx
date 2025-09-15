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
      image: '🍌',
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
      image: '🍅',
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
      image: '🥛',
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
      image: '🍗',
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
      image: '🍞',
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
      image: '🧃',
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
      image: '🍟',
      description: 'Crispy plantain chips',
      unitLabel: '200g',
      rating: 4.0,
      inStock: true
    },
    {
      id: 'PRD-008',
      storeId: 'store-001',
      name: 'Red Onions',
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
      name: 'Pineapple',
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
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=60',
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
      image: 'https://images.unsplash.com/photo-1517959105821-eaf2591984c2?auto=format&fit=crop&w=800&q=60',
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
      image: 'https://images.unsplash.com/photo-1582719478250-ccb7715f3e55?auto=format&fit=crop&w=800&q=60',
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
      image: 'https://images.unsplash.com/photo-1623062997576-b2e2c58e4458?auto=format&fit=crop&w=800&q=60',
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
      image: 'https://images.unsplash.com/photo-1604908554049-4a6a2e1d2a3a?auto=format&fit=crop&w=800&q=60',
      description: 'Rich tomato paste can',
      unitLabel: '400g',
      rating: 4.1,
      inStock: true
    },
    {
      id: 'PRD-017',
      storeId: 'store-002',
      name: 'Avocado',
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
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=60',
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
      image: 'https://images.unsplash.com/photo-1604908554049-d9b0b1a9c87b?auto=format&fit=crop&w=800&q=60',
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

  const value: ProductsContextType = {
    stores,
    addStore,
    updateStore,
    deleteStore,
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
