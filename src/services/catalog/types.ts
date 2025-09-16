export interface UnifiedStoreRecord {
  id: string;
  name: string;
  rating?: number;
  distanceKm?: number;
  deliveryTime?: string;
}

export interface UnifiedProductRecord {
  id: string;
  storeId: string;
  store: UnifiedStoreRecord;
  name: string;
  category: string;
  price: number;
  rating?: number;
  inStock?: boolean;
  imageUrl?: string;
  description?: string;
  searchableText: string; // concatenated fields for baseline search/embedding
}


