import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cart, CartItem, Product } from '@/types';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  addToCart: (product: Product, quantity: number, storeId: string, storeName: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      error: null,
      
      addToCart: (product, quantity, storeId, storeName) => {
        try {
          const currentCart = get().cart;
          
          // If cart is empty or from a different store, create a new cart
          if (!currentCart || currentCart.storeId !== storeId) {
            set({
              cart: {
                items: [{ product, quantity }],
                storeId,
                storeName
              }
            });
            return;
          }
          
          // Check if product already exists in cart
          const existingItemIndex = currentCart.items.findIndex(
            item => item.product.id === product.id
          );
          
          if (existingItemIndex >= 0) {
            // Update quantity if product exists
            const updatedItems = [...currentCart.items];
            updatedItems[existingItemIndex].quantity += quantity;
            
            set({
              cart: {
                ...currentCart,
                items: updatedItems
              }
            });
          } else {
            // Add new product to cart
            set({
              cart: {
                ...currentCart,
                items: [...currentCart.items, { product, quantity }]
              }
            });
          }
        } catch (error) {
          console.log('Add to cart error:', error);
          set({ error: 'Failed to add item to cart' });
        }
      },
      
      removeFromCart: (productId) => {
        const currentCart = get().cart;
        if (!currentCart) return;
        
        const updatedItems = currentCart.items.filter(
          item => item.product.id !== productId
        );
        
        if (updatedItems.length === 0) {
          set({ cart: null });
        } else {
          set({
            cart: {
              ...currentCart,
              items: updatedItems
            }
          });
        }
      },
      
      updateQuantity: (productId, quantity) => {
        const currentCart = get().cart;
        if (!currentCart) return;
        
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        
        const updatedItems = currentCart.items.map(item => 
          item.product.id === productId 
            ? { ...item, quantity } 
            : item
        );
        
        set({
          cart: {
            ...currentCart,
            items: updatedItems
          }
        });
      },
      
      clearCart: () => {
        set({ cart: null });
      },
      
      getCartTotal: () => {
        const currentCart = get().cart;
        if (!currentCart) return 0;
        
        return currentCart.items.reduce((total, item) => {
          const price = item.product.discountPrice || item.product.price;
          return total + (price * item.quantity);
        }, 0);
      },
      
      getItemCount: () => {
        const currentCart = get().cart;
        if (!currentCart) return 0;
        
        return currentCart.items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'quickmart-cart',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);