import { UnifiedProductRecord } from '../catalog/types';
import { ProductCandidate, ProductFilter } from '../assistant/intents';
import { TextSearchService } from '../assistant/interfaces';

const STOPWORDS = new Set([
  'the','a','an','and','or','for','to','of','in','on','with','by','at','is','are','it','this','that','these','those'
]);

function tokenize(text: string): string[] {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t && !STOPWORDS.has(t));
}

function passesFilters(p: UnifiedProductRecord, filters?: ProductFilter): boolean {
  if (!filters) return true;
  if (filters.inStockOnly && !p.inStock) return false;
  if (filters.category && p.category !== filters.category) return false;
  if (filters.priceMin != null && p.price < filters.priceMin) return false;
  if (filters.priceMax != null && p.price > filters.priceMax) return false;
  if (filters.storeIds && filters.storeIds.length > 0 && !filters.storeIds.includes(p.storeId)) return false;
  return true;
}

function scoreProduct(query: string, queryTokens: string[], p: UnifiedProductRecord): number {
  const text = p.searchableText;
  let score = 0;

  // Phrase match boost
  if (text.includes(query)) score += 5;

  // Token overlap
  for (const t of queryTokens) {
    if (text.includes(t)) score += 2;
  }

  // Category hint
  if (queryTokens.includes(p.category.toLowerCase())) score += 1.5;

  // Stock, rating minor boosts
  if (p.inStock) score += 0.5;
  if (p.rating) score += Math.min(1.5, (p.rating - 3.5) * 0.5);

  return score;
}

export const createTextSearchService = (getCatalog: () => UnifiedProductRecord[]): TextSearchService => ({
  async searchByText(query: string, filters?: ProductFilter): Promise<ProductCandidate[]> {
    const catalog = getCatalog();
    const q = (query || '').trim().toLowerCase();
    const tokens = tokenize(q);
    const scored: Array<{ p: UnifiedProductRecord; score: number }> = [];

    for (const p of catalog) {
      if (!passesFilters(p, filters)) continue;
      const s = scoreProduct(q, tokens, p);
      if (s > 0) scored.push({ p, score: s });
    }

    if (scored.length === 0) return [];

    const maxScore = Math.max(...scored.map(x => x.score));
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, 50).map(({ p, score }) => ({
      id: p.id,
      storeId: p.storeId,
      name: p.name,
      category: p.category,
      price: p.price,
      rating: p.rating,
      distanceKm: p.store.distanceKm,
      imageUrl: p.imageUrl,
      inStock: p.inStock,
      confidence: maxScore ? Number((score / maxScore).toFixed(3)) : 0.0,
    }));
  }
});


