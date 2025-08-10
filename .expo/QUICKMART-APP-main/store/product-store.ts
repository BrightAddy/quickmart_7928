import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '@/types';

interface ProductState {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  verifyProduct: (productId: string) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      
      addProduct: (product) => {
        try {
          set((state) => ({
            products: [...state.products, product]
          }));
        } catch (error) {
          console.log('Add product error:', error);
        }
      },
      
      updateProduct: (productId, updates) => {
        set((state) => ({
          products: state.products.map(product => 
            product.id === productId 
              ? { ...product, ...updates } 
              : product
          )
        }));
      },
      
      deleteProduct: (productId) => {
        set((state) => ({
          products: state.products.filter(product => product.id !== productId)
        }));
      },
      
      verifyProduct: (productId) => {
        set((state) => ({
          products: state.products.map(product => 
            product.id === productId 
              ? { ...product, verified: true } 
              : product
          )
        }));
      }
    }),
    {
      name: 'quickmart-products',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);