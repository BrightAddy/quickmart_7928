import { UnifiedProductRecord, UnifiedStoreRecord } from './types';
import { useProducts } from '../../context/ProductsContext';

// NOTE: This adapter pulls from the in-memory ProductsContext for now.
// Later, replace with backend fetch and incremental sync.

export function buildUnifiedCatalog(productsCtx: ReturnType<typeof useProducts>): UnifiedProductRecord[] {
  const { stores, products } = productsCtx as any;
  const storeMap: Record<string, UnifiedStoreRecord> = {};
  (stores || []).forEach((s: any) => {
    storeMap[s.id] = {
      id: s.id,
      name: s.name,
      rating: s.rating,
      distanceKm: s.distance ? parseFloat((s.distance || '0').toString()) : undefined,
      deliveryTime: s.deliveryTime,
    };
  });

  const unified: UnifiedProductRecord[] = (products || []).map((p: any) => {
    const store = storeMap[p.storeId] || { id: p.storeId, name: 'Unknown' } as UnifiedStoreRecord;
    const searchableText = [
      p.name,
      p.category,
      store.name,
      p.description,
    ].filter(Boolean).join(' ').toLowerCase();

    return {
      id: p.id,
      storeId: p.storeId,
      store,
      name: p.name,
      category: p.category,
      price: p.price,
      rating: p.rating,
      inStock: p.status === 'Active' && p.stock > 0,
      imageUrl: p.imageUrl || p.image,
      description: p.description,
      searchableText,
    };
  });

  return unified;
}


