import { ParsedIntent, ProductCandidate, ProductFilter } from './intents';

export interface TextSearchService {
  searchByText: (query: string, filters?: ProductFilter) => Promise<ProductCandidate[]>;
}

export interface VisualSearchService {
  searchByImage: (imageUri: string, filters?: ProductFilter) => Promise<ProductCandidate[]>;
}

export interface VoiceService {
  startListening: (locale?: string) => Promise<void>;
  stopListening: () => Promise<string>; // returns transcript
  speak: (text: string, locale?: string) => Promise<void>;
}

export interface CartService {
  addToCart: (productId: string, quantity: number, variant?: Record<string, string>) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
}

export interface StockService {
  isInStock: (productId: string) => Promise<boolean>;
}

export interface IntentParser {
  parse: (input: { text?: string; imageUri?: string; locale?: string }) => Promise<ParsedIntent>;
}

export interface AssistantOrchestrator {
  handle: (intent: ParsedIntent) => Promise<{ action: any }>;
}


