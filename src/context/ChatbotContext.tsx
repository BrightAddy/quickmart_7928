import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type: 'text' | 'product_suggestion' | 'cart_update' | 'language_switch';
  data?: any;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  currency: string;
  store: string;
  category: string;
  image: string;
  discount?: number;
  originalPrice?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Language = 'english' | 'twi' | 'ewe' | 'ga' | 'hausa';

interface ChatbotContextType {
  messages: ChatMessage[];
  currentLanguage: Language;
  isOpen: boolean;
  cart: CartItem[];
  isTyping: boolean;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  sendMessage: (text: string) => void;
  toggleChat: () => void;
  switchLanguage: (language: Language) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  getCartTotal: () => number;
  getPersonalizedDeals: () => Product[];
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

// Localization data
const translations = {
  english: {
    welcome: "Hello! I'm your shopping assistant. How can I help you today?",
    addToCart: "Added to cart",
    cartUpdated: "Cart updated",
    languageChanged: "Language changed to English",
    shopForMe: "I'll help you shop for groceries. What would you like me to add to your cart?",
    bestDeals: "Here are some great deals based on your shopping history:",
    noProducts: "Sorry, I couldn't find those products. Would you like me to suggest alternatives?",
    cartEmpty: "Your cart is empty. Let me help you find some great products!",
    total: "Total",
    quantity: "Quantity",
    remove: "Remove",
    checkout: "Checkout",
    continueShopping: "Continue Shopping",
    searchProducts: "Searching for products...",
    foundProducts: "I found these products for you:",
    addMore: "Would you like me to add anything else to your cart?",
    storeSelection: "Which store would you like me to shop from?",
    categorySelection: "What category of products are you looking for?",
    priceRange: "What's your budget range?",
    confirmOrder: "Great! I've added these items to your cart. Ready to checkout?",
  },
  twi: {
    welcome: "Akwaba! Me yɛ wo shopping assistant. Deɛn na me bɛtumi akyerɛ wo?",
    addToCart: "Aka cart mu",
    cartUpdated: "Cart no ayɛ updated",
    languageChanged: "Kasa no ayɛ Twi",
    shopForMe: "Me bɛkyerɛ wo shop groceries. Deɛn na wo pɛ me ma me fa ka wo cart mu?",
    bestDeals: "Hena na ɛyɛ deals pa wɔ wo shopping history mu:",
    noProducts: "Kafra, me nhu products no. Wo pɛ me ma me suggest alternatives?",
    cartEmpty: "Wo cart no empty. Ma me kyerɛ wo products pa!",
    total: "Total",
    quantity: "Quantity",
    remove: "Remove",
    checkout: "Checkout",
    continueShopping: "Continue Shopping",
    searchProducts: "Me rehwehwɛ products...",
    foundProducts: "Me hu products yi ma wo:",
    addMore: "Wo pɛ me ma me fa biribi bio ka wo cart mu?",
    storeSelection: "Store bɛn na wo pɛ me ma me shop firi?",
    categorySelection: "Category bɛn na wo pɛ products?",
    priceRange: "Wo budget yɛ he?",
    confirmOrder: "Yie! Me aka items yi ka wo cart mu. Ready a checkout?",
  },
  ewe: {
    welcome: "Woezɔ! Nye wo shopping assistant. Nukae nye wo pɛe nye wo?",
    addToCart: "Aka cart me",
    cartUpdated: "Cart no ayɛ updated",
    languageChanged: "Gbe no ayɛ Ewe",
    shopForMe: "Nye wo shop groceries. Nukae nye wo pɛe nye wo pɛe nye wo cart me?",
    bestDeals: "Ame nye deals pa wɔ wo shopping history me:",
    noProducts: "Kafra, nye wo hu products no. Wo pɛe nye wo pɛe nye wo suggest alternatives?",
    cartEmpty: "Wo cart no empty. Ma nye wo kpɔ products pa!",
    total: "Total",
    quantity: "Quantity",
    remove: "Remove",
    checkout: "Checkout",
    continueShopping: "Continue Shopping",
    searchProducts: "Nye wo hɛ products...",
    foundProducts: "Nye wo hu products sia ma wo:",
    addMore: "Wo pɛe nye wo pɛe nye wo pɛe nye wo cart me?",
    storeSelection: "Store bɛn nye wo pɛe nye wo pɛe nye wo shop firi?",
    categorySelection: "Category bɛn nye wo pɛe products?",
    priceRange: "Wo budget yɛ he?",
    confirmOrder: "Yie! Nye wo aka items sia ka wo cart me. Ready a checkout?",
  },
  ga: {
    welcome: "Miaawɔ! Mi yɛ mli shopping assistant. Deɛn na mi bɛtumi akyerɛ wo?",
    addToCart: "Mi aka cart mli",
    cartUpdated: "Cart fee mi updated kɛ",
    languageChanged: "Kasa fee mi Ga kɛ",
    shopForMe: "Mi bɛkyerɛ wo shop groceries. Deɛn na wo hiɛ mi ka wo cart mli?",
    bestDeals: "Wole ni ɛyɛ deals pa wɔ wo shopping history mli:",
    noProducts: "Kafra, mi mɔ products fee. Wo hiɛ mi suggest alternatives?",
    cartEmpty: "Wo cart fee empty. Mi kyerɛ wo products pa!",
    total: "Total",
    quantity: "Quantity",
    remove: "Remove",
    checkout: "Checkout",
    continueShopping: "Continue Shopping",
    searchProducts: "Mi lɛ products...",
    foundProducts: "Mi yɛ products lɛ ma wo:",
    addMore: "Wo hiɛ mi ka biribi bio wo cart mli?",
    storeSelection: "Store bɛn na wo hiɛ mi shop firi?",
    categorySelection: "Category bɛn na wo hiɛ products?",
    priceRange: "Wo budget yɛ he?",
    confirmOrder: "Yie! Mi aka items lɛ ka wo cart mli. Ready a checkout?",
  },
  hausa: {
    welcome: "Sannu! Ni ne shopping assistant. Me za a i taimaka?",
    addToCart: "An saka a cart",
    cartUpdated: "Cart ya zama updated",
    languageChanged: "Harshe ya zama Hausa",
    shopForMe: "Zan taimaka ka siyo groceries. Me za ka so in saka a cart?",
    bestDeals: "Ga deals masu kyau bisa shopping history ka:",
    noProducts: "Yi hakuri, ban sami products ba. Ka so in ba da alternatives?",
    cartEmpty: "Cart ka babu kome. Bari in nemo products masu kyau!",
    total: "Total",
    quantity: "Quantity",
    remove: "Remove",
    checkout: "Checkout",
    continueShopping: "Continue Shopping",
    searchProducts: "Ina nema products...",
    foundProducts: "Na sami products wadannan ma ka:",
    addMore: "Ka so in saka wani abu a cart?",
    storeSelection: "Daga store wace ka so in siyo?",
    categorySelection: "Wane category na products ka ke nema?",
    priceRange: "Budget ka yaya?",
    confirmOrder: "Yaya! Na saka items wadannan a cart. A shirye don checkout?",
  },
};

// Sample products data
const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'Fresh Organic Carrots',
    price: 18.00,
    currency: '₵',
    store: 'Melcom',
    category: 'Vegetables',
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400',
    discount: 15,
    originalPrice: 21.00,
  },
  {
    id: 2,
    name: 'Ripe Red Tomatoes',
    price: 15.00,
    currency: '₵',
    store: 'Melcom',
    category: 'Vegetables',
    image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400',
    discount: 25,
    originalPrice: 20.00,
  },
  {
    id: 3,
    name: 'Fresh Green Spinach',
    price: 12.00,
    currency: '₵',
    store: 'Melcom',
    category: 'Vegetables',
    image: 'https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg?auto=compress&cs=tinysrgb&w=400',
    discount: 33,
    originalPrice: 18.00,
  },
  {
    id: 4,
    name: 'Organic Bananas',
    price: 8.00,
    currency: '₵',
    store: 'Melcom',
    category: 'Fruits',
    image: 'https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg?auto=compress&cs=tinysrgb&w=400',
    discount: 20,
    originalPrice: 10.00,
  },
  {
    id: 5,
    name: 'Fresh Milk',
    price: 25.00,
    currency: '₵',
    store: 'Melcom',
    category: 'Dairy',
    image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 6,
    name: 'Whole Grain Bread',
    price: 12.00,
    currency: '₵',
    store: 'Melcom',
    category: 'Bakery',
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
    discount: 10,
    originalPrice: 13.50,
  },
];

export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: translations.english.welcome,
      isUser: false,
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('english');
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const switchLanguage = useCallback((language: Language) => {
    setCurrentLanguage(language);
    // Update welcome message in new language
    setMessages(prev => prev.map(msg => 
      msg.id === '1' ? { ...msg, text: translations[language].welcome } : msg
    ));
  }, []);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cart]);

  const getPersonalizedDeals = useCallback(() => {
    // Simulate personalized deals based on cart and preferences
    const cartCategories = cart.map(item => item.product.category);
    const deals = sampleProducts.filter(product => 
      product.discount && product.discount > 20
    );
    return deals.slice(0, 4);
  }, [cart]);

  const sendMessage = useCallback(async (text: string) => {
    // Add user message
    addMessage({
      text,
      isUser: true,
      type: 'text',
    });

    // Show typing indicator
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      setIsTyping(false);
      processUserMessage(text);
    }, 1000);
  }, [addMessage]);

  const processUserMessage = useCallback((text: string) => {
    const lowerText = text.toLowerCase();

    // Language switching
    if (lowerText.includes('language') || lowerText.includes('kasa') || lowerText.includes('gbe') || lowerText.includes('harshe')) {
      if (lowerText.includes('twi')) {
        switchLanguage('twi');
        addMessage({
          text: translations.twi.languageChanged,
          isUser: false,
          type: 'language_switch',
        });
        return;
      } else if (lowerText.includes('ewe')) {
        switchLanguage('ewe');
        addMessage({
          text: translations.ewe.languageChanged,
          isUser: false,
          type: 'language_switch',
        });
        return;
      } else if (lowerText.includes('ga')) {
        switchLanguage('ga');
        addMessage({
          text: translations.ga.languageChanged,
          isUser: false,
          type: 'language_switch',
        });
        return;
      } else if (lowerText.includes('hausa')) {
        switchLanguage('hausa');
        addMessage({
          text: translations.hausa.languageChanged,
          isUser: false,
          type: 'language_switch',
        });
        return;
      } else if (lowerText.includes('english')) {
        switchLanguage('english');
        addMessage({
          text: translations.english.languageChanged,
          isUser: false,
          type: 'language_switch',
        });
        return;
      }
    }

    // Cart management
    if (lowerText.includes('cart') || lowerText.includes('basket')) {
      if (lowerText.includes('view') || lowerText.includes('show') || lowerText.includes('see')) {
        if (cart.length === 0) {
          addMessage({
            text: translations[currentLanguage].cartEmpty,
            isUser: false,
            type: 'text',
          });
        } else {
          addMessage({
            text: `Your cart has ${cart.length} items. Total: ₵${getCartTotal().toFixed(2)}`,
            isUser: false,
            type: 'cart_update',
          });
        }
        return;
      }
      if (lowerText.includes('empty') || lowerText.includes('clear')) {
        setCart([]);
        addMessage({
          text: "Cart cleared! What would you like to add?",
          isUser: false,
          type: 'text',
        });
        return;
      }
    }

    // Checkout requests
    if (lowerText.includes('checkout') || lowerText.includes('pay') || lowerText.includes('order')) {
      if (cart.length === 0) {
        addMessage({
          text: "Your cart is empty! Let me help you find some products first.",
          isUser: false,
          type: 'text',
        });
      } else {
        addMessage({
          text: `Ready to checkout! Your total is ₵${getCartTotal().toFixed(2)}. I'll take you to the payment screen.`,
          isUser: false,
          type: 'text',
        });
      }
      return;
    }

    // Product search by name
    const searchTerms = lowerText.split(' ').filter(word => word.length > 2);
    const matchingProducts = sampleProducts.filter(product => 
      searchTerms.some(term => 
        product.name.toLowerCase().includes(term) || 
        product.category.toLowerCase().includes(term)
      )
    );

    if (matchingProducts.length > 0) {
      addMessage({
        text: `I found ${matchingProducts.length} products matching "${text}":`,
        isUser: false,
        type: 'product_suggestion',
        data: matchingProducts.slice(0, 4),
      });
      return;
    }

    // Specific product requests
    if (lowerText.includes('vegetables') || lowerText.includes('veggies') || lowerText.includes('carrot') || lowerText.includes('tomato') || lowerText.includes('spinach')) {
      const vegetables = sampleProducts.filter(p => p.category === 'Vegetables');
      addMessage({
        text: "Here are some fresh vegetables:",
        isUser: false,
        type: 'product_suggestion',
        data: vegetables,
      });
      return;
    }

    if (lowerText.includes('fruit') || lowerText.includes('banana') || lowerText.includes('apple')) {
      const fruits = sampleProducts.filter(p => p.category === 'Fruits');
      addMessage({
        text: "Here are some fresh fruits:",
        isUser: false,
        type: 'product_suggestion',
        data: fruits,
      });
      return;
    }

    if (lowerText.includes('milk') || lowerText.includes('dairy') || lowerText.includes('bread')) {
      const dairy = sampleProducts.filter(p => p.category === 'Dairy' || p.category === 'Bakery');
      addMessage({
        text: "Here are some dairy and bakery items:",
        isUser: false,
        type: 'product_suggestion',
        data: dairy,
      });
      return;
    }

    // Shopping requests
    if (lowerText.includes('shop') || lowerText.includes('buy') || lowerText.includes('add') || lowerText.includes('need') || lowerText.includes('want')) {
      addMessage({
        text: translations[currentLanguage].shopForMe,
        isUser: false,
        type: 'text',
      });

      // Show product suggestions
      setTimeout(() => {
        const suggestions = sampleProducts.slice(0, 3);
        addMessage({
          text: translations[currentLanguage].foundProducts,
          isUser: false,
          type: 'product_suggestion',
          data: suggestions,
        });
      }, 500);
      return;
    }

    // Best deals request
    if (lowerText.includes('deal') || lowerText.includes('offer') || lowerText.includes('discount') || lowerText.includes('sale')) {
      const deals = getPersonalizedDeals();
      addMessage({
        text: translations[currentLanguage].bestDeals,
        isUser: false,
        type: 'product_suggestion',
        data: deals,
      });
      return;
    }

    // Help requests
    if (lowerText.includes('help') || lowerText.includes('what can you do') || lowerText.includes('commands')) {
      addMessage({
        text: "I can help you:\n• Find products by name or category\n• Add items to your cart\n• Show deals and discounts\n• Check your cart\n• Process checkout\n\nJust tell me what you're looking for!",
        isUser: false,
        type: 'text',
      });
      return;
    }

    // Greetings
    if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
      addMessage({
        text: "Hello! I'm your shopping assistant. What can I help you find today?",
        isUser: false,
        type: 'text',
      });
      return;
    }

    // Generic response with suggestions
    addMessage({
      text: "I'm here to help you shop! You can ask me to:\n• Find specific products\n• Show deals\n• Check your cart\n• Help with checkout\n\nWhat would you like to do?",
      isUser: false,
      type: 'text',
    });
  }, [currentLanguage, addMessage, switchLanguage, cart, getCartTotal, getPersonalizedDeals]);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { product, quantity }];
      }
    });

    addMessage({
      text: `${translations[currentLanguage].addToCart}: ${product.name}`,
      isUser: false,
      type: 'cart_update',
      data: { product, quantity },
    });
  }, [currentLanguage, addMessage]);

  const removeFromCart = useCallback((productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prev => prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      ));
    }
  }, [removeFromCart]);

  const value: ChatbotContextType = {
    messages,
    currentLanguage,
    isOpen,
    cart,
    isTyping,
    addMessage,
    sendMessage,
    toggleChat,
    switchLanguage,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getCartTotal,
    getPersonalizedDeals,
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};
