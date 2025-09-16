import { TextSearchService, VisualSearchService, VoiceService, CartService, StockService, IntentParser, AssistantOrchestrator } from './interfaces';
import { AssistantIntent, ParsedIntent, ProductCandidate } from './intents';
import { buildUnifiedCatalog } from '../catalog';
import { createTextSearchService as createTextSearchOverCatalog } from '../search/textSearch';

// Baseline text search over the unified catalog
export const createTextSearchService = (getCatalog: () => any): TextSearchService => {
  const svc = createTextSearchOverCatalog(getCatalog);
  return svc;
};

// Visual search placeholder
export const createVisualSearchService = (): VisualSearchService => ({
  async searchByImage(imageUri) {
    // NOTE: Replace with real visual similarity pipeline in step 6
    return [];
  }
});

// Voice service placeholder
export const createVoiceService = (): VoiceService => ({
  async startListening() {},
  async stopListening() { return ''; },
  async speak() {}
});

// Cart service adapter stub
export const createCartService = (cartApi: { addItem: Function; updateQty: Function; }): CartService => ({
  async addToCart(productId, quantity) { cartApi.addItem({ id: productId }, quantity); },
  async updateQuantity(productId, quantity) { cartApi.updateQty(productId, quantity); }
});

// Stock service stub
export const createStockService = (getCatalog: () => any): StockService => ({
  async isInStock(productId) {
    try {
      const catalog = getCatalog() || [];
      const item = catalog.find((p: any) => p.id === productId);
      return !!(item && item.inStock);
    } catch {
      return true;
    }
  }
});

// Very simple intent parser stub
export const createIntentParser = (): IntentParser => ({
  async parse({ text, imageUri }) {
    const t = (text || '').toLowerCase();
    if (imageUri) return { intent: AssistantIntent.FIND_BY_IMAGE, imageUri } as ParsedIntent;
    if (t.includes('similar')) return { intent: AssistantIntent.FIND_SIMILAR, query: text };
    if (t.startsWith('add ')) return { intent: AssistantIntent.ADD_TO_CART, query: text };
    if (t.includes('track')) return { intent: AssistantIntent.TRACK_ORDER };
    if (t.includes('help')) return { intent: AssistantIntent.HELP };
    return { intent: AssistantIntent.FIND_PRODUCT, query: text };
  }
});

// Orchestrator stub
export const createAssistantOrchestrator = (
  search: TextSearchService,
  cart: CartService,
  stock: StockService
): AssistantOrchestrator => ({
  async handle(intent) {
    switch (intent.intent) {
      case AssistantIntent.FIND_PRODUCT: {
        const products = await search.searchByText(intent.query || '', { inStockOnly: true });
        return { action: { type: 'SHOW_PRODUCTS', products } };
      }
      case AssistantIntent.ADD_TO_CART: {
        // naive: add first match
        const products = await search.searchByText(intent.query || '', { inStockOnly: true });
        if (products[0]) {
          await cart.addToCart(products[0].id, intent.quantity || 1);
          return { action: { type: 'MESSAGE', text: `Added ${products[0].name} to your cart.` } };
        }
        return { action: { type: 'MESSAGE', text: 'I could not find that item.' } };
      }
      case AssistantIntent.SPLIT_BASKET: {
        // naive proposal: group cart by store with mock delivery fees
        // In UI, you will later confirm/accept this proposal
        return { action: { type: 'SPLIT_PROPOSAL', proposal: {
          stores: [
            { storeId: 'ns1', storeName: 'Sunrise Supermarket', itemCount: 3, eta: '20-30 min', deliveryFee: 8, subtotal: 120 },
            { storeId: 'ns2', storeName: 'MedCare Pharmacy', itemCount: 2, eta: '25-35 min', deliveryFee: 10, subtotal: 75 },
          ],
          totalDelivery: 18,
          totalItems: 5,
          subtotal: 195,
        } } };
      }
      default:
        return { action: { type: 'MESSAGE', text: 'Working on that capability...' } };
    }
  }
});


