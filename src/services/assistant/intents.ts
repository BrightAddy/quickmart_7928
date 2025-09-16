export enum AssistantIntent {
  FIND_PRODUCT = 'FIND_PRODUCT',
  FIND_SIMILAR = 'FIND_SIMILAR',
  FIND_BY_IMAGE = 'FIND_BY_IMAGE',
  ADD_TO_CART = 'ADD_TO_CART',
  UPDATE_QUANTITY = 'UPDATE_QUANTITY',
  REPLACE_ITEM = 'REPLACE_ITEM',
  TRACK_ORDER = 'TRACK_ORDER',
  HELP = 'HELP',
  VOICE_QUERY = 'VOICE_QUERY',
  SPLIT_BASKET = 'SPLIT_BASKET',
}

export interface ProductFilter {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  distanceKm?: number;
  storeIds?: string[];
  dietary?: string[];
  brand?: string;
  inStockOnly?: boolean;
}

export interface ParsedIntent {
  intent: AssistantIntent;
  query?: string;
  imageUri?: string;
  productId?: string;
  quantity?: number;
  variant?: Record<string, string>;
  filters?: ProductFilter;
  locale?: string;
}

export interface ProductCandidate {
  id: string;
  storeId: string;
  name: string;
  category: string;
  price: number;
  rating?: number;
  distanceKm?: number;
  imageUrl?: string;
  inStock?: boolean;
  confidence?: number;
}

export type AssistantAction =
  | { type: 'SHOW_PRODUCTS'; products: ProductCandidate[]; }
  | { type: 'ADD_TO_CART'; productId: string; quantity: number; variant?: Record<string, string>; }
  | { type: 'UPDATE_CART_QTY'; productId: string; quantity: number; }
  | { type: 'MESSAGE'; text: string }
  | { type: 'SPLIT_PROPOSAL'; proposal: {
      stores: Array<{ storeId: string; storeName: string; itemCount: number; eta: string; deliveryFee: number; subtotal: number }>;
      totalDelivery: number;
      totalItems: number;
      subtotal: number;
    }};


