import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import * as ImagePicker from 'expo-image-picker';

export interface ShopperChatMessage {
  id: string;
  text: string;
  sender: 'shopper' | 'customer';
  timestamp: Date;
  type: 'text' | 'image' | 'system';
  imageUri?: string;
  orderId?: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
  found: boolean;
  imageUri?: string;
}

export interface ShopperChatSession {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  storeName: string;
  messages: ShopperChatMessage[];
  shoppingList: ShoppingListItem[];
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
}

interface ShopperChatContextType {
  currentSession: ShopperChatSession | null;
  sessions: ShopperChatSession[];
  isTyping: boolean;
  
  // Session management
  startSession: (orderId: string, customerName: string, customerPhone: string, storeName: string, shoppingList: ShoppingListItem[]) => void;
  endSession: () => void;
  
  // Messaging
  sendMessage: (text: string) => void;
  sendImage: (imageUri: string) => void;
  markAsTyping: (isTyping: boolean) => void;
  
  // Shopping list management
  updateShoppingItem: (itemId: string, updates: Partial<ShoppingListItem>) => void;
  markItemAsFound: (itemId: string, imageUri?: string) => void;
  
  // Image handling
  pickImage: () => Promise<string | null>;
  takePhoto: () => Promise<string | null>;
}

const ShopperChatContext = createContext<ShopperChatContextType | undefined>(undefined);

export const useShopperChat = () => {
  const context = useContext(ShopperChatContext);
  if (!context) {
    throw new Error('useShopperChat must be used within a ShopperChatProvider');
  }
  return context;
};

interface ShopperChatProviderProps {
  children: ReactNode;
}

export const ShopperChatProvider: React.FC<ShopperChatProviderProps> = ({ children }) => {
  const [sessions, setSessions] = useState<ShopperChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ShopperChatSession | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const startSession = useCallback((
    orderId: string, 
    customerName: string, 
    customerPhone: string, 
    storeName: string, 
    shoppingList: ShoppingListItem[]
  ) => {
    const newSession: ShopperChatSession = {
      id: `session_${Date.now()}`,
      orderId,
      customerName,
      customerPhone,
      storeName,
      messages: [
        {
          id: 'welcome',
          text: `Hello ${customerName}! I'm your shopper for ${storeName}. I'll help you get your items. Let me know if you have any questions!`,
          sender: 'shopper',
          timestamp: new Date(),
          type: 'system',
          orderId
        }
      ],
      shoppingList,
      status: 'active',
      createdAt: new Date()
    };

    setCurrentSession(newSession);
    setSessions(prev => [newSession, ...prev]);
  }, []);

  const endSession = useCallback(() => {
    if (currentSession) {
      setSessions(prev => 
        prev.map(session => 
          session.id === currentSession.id 
            ? { ...session, status: 'completed' as const }
            : session
        )
      );
      setCurrentSession(null);
    }
  }, [currentSession]);

  const sendMessage = useCallback((text: string) => {
    if (!currentSession) return;

    const newMessage: ShopperChatMessage = {
      id: `msg_${Date.now()}`,
      text,
      sender: 'shopper',
      timestamp: new Date(),
      type: 'text',
      orderId: currentSession.orderId
    };

    setCurrentSession(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage]
    } : null);

    // Simulate customer response after a delay
    setTimeout(() => {
      const customerResponse: ShopperChatMessage = {
        id: `msg_${Date.now()}_response`,
        text: "Thank you for the update! Please let me know if you find everything.",
        sender: 'customer',
        timestamp: new Date(),
        type: 'text',
        orderId: currentSession.orderId
      };

      setCurrentSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, customerResponse]
      } : null);
    }, 2000);
  }, [currentSession]);

  const sendImage = useCallback((imageUri: string) => {
    if (!currentSession) return;

    const newMessage: ShopperChatMessage = {
      id: `img_${Date.now()}`,
      text: "Here's a photo of the item I found:",
      sender: 'shopper',
      timestamp: new Date(),
      type: 'image',
      imageUri,
      orderId: currentSession.orderId
    };

    setCurrentSession(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage]
    } : null);
  }, [currentSession]);

  const markAsTyping = useCallback((typing: boolean) => {
    setIsTyping(typing);
  }, []);

  const updateShoppingItem = useCallback((itemId: string, updates: Partial<ShoppingListItem>) => {
    if (!currentSession) return;

    setCurrentSession(prev => prev ? {
      ...prev,
      shoppingList: prev.shoppingList.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    } : null);
  }, [currentSession]);

  const markItemAsFound = useCallback((itemId: string, imageUri?: string) => {
    updateShoppingItem(itemId, { found: true, imageUri });
    
    if (currentSession) {
      const item = currentSession.shoppingList.find(i => i.id === itemId);
      if (item) {
        sendMessage(`✅ Found: ${item.name} (${item.quantity} ${item.unit})`);
        if (imageUri) {
          sendImage(imageUri);
        }
      }
    }
  }, [currentSession, updateShoppingItem, sendMessage, sendImage]);

  const pickImage = useCallback(async (): Promise<string | null> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      return null;
    }
  }, []);

  const takePhoto = useCallback(async (): Promise<string | null> => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error('Error taking photo:', error);
      return null;
    }
  }, []);

  const value: ShopperChatContextType = {
    currentSession,
    sessions,
    isTyping,
    startSession,
    endSession,
    sendMessage,
    sendImage,
    markAsTyping,
    updateShoppingItem,
    markItemAsFound,
    pickImage,
    takePhoto
  };

  return (
    <ShopperChatContext.Provider value={value}>
      {children}
    </ShopperChatContext.Provider>
  );
};
