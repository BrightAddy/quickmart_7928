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
