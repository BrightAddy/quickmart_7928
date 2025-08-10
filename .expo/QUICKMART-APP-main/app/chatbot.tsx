import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Send, Mic, MicOff, Paperclip, RotateCcw, ShoppingCart, Store, Package, Search } from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';
import { Audio } from 'expo-av';
import { useCartStore } from '@/store/cart-store';
import { mockStores } from '@/mocks/stores';
import { getProductsByStore, mockProducts } from '@/mocks/products';
import { Store as StoreType, Product } from '@/types';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  actions?: ShoppingAction[];
}

interface ShoppingAction {
  type: 'add_to_cart' | 'view_store' | 'search_products' | 'checkout';
  data: any;
  label: string;
}

export default function ChatbotScreen() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  const { addToCart, getItemCount, cart } = useCartStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI shopping assistant for QuickMart. I can help you find stores, search for products, add items to your cart, and even complete your shopping automatically. What would you like to shop for today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const suggestedPrompts = [
    'Shop for groceries automatically',
    'Find fresh vegetables and fruits',
    'Add rice and cooking oil to cart',
    'Show me electronics stores',
    'Complete my weekly shopping'
  ];

  useEffect(() => {
    // Configure audio mode for recording
    const configureAudio = async () => {
      if (Platform.OS !== 'web') {
        try {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
          });
        } catch (error) {
          console.log('Audio configuration error:', error);
        }
      }
    };
    configureAudio();
  }, []);

  // Shopping functions
  const findStores = (query?: string): StoreType[] => {
    if (!query) return mockStores.filter(store => store.isOpen);
    
    return mockStores.filter(store => 
      store.isOpen && (
        store.name.toLowerCase().includes(query.toLowerCase()) ||
        store.categories.some(cat => cat.toLowerCase().includes(query.toLowerCase()))
      )
    );
  };

  const findProducts = (query: string, storeId?: string): Product[] => {
    let products = storeId ? getProductsByStore(storeId) : mockProducts;
    
    return products.filter(product => 
      product.inStock && (
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      )
    ).slice(0, 10); // Limit to 10 products
  };

  const autoShop = async (items: string[], storePreference?: string): Promise<{ addedItems: Product[], totalCost: number }> => {
    const addedItems: Product[] = [];
    let totalCost = 0;

    // Find the best store
    let targetStore: StoreType | null = null;
    if (storePreference) {
      targetStore = mockStores.find(store => 
        store.name.toLowerCase().includes(storePreference.toLowerCase()) && store.isOpen
      ) || null;
    }
    
    if (!targetStore) {
      // Find store with most items available
      const storeScores = mockStores.filter(store => store.isOpen).map(store => {
        const storeProducts = getProductsByStore(store.id);
        const availableItems = items.filter(item => 
          storeProducts.some(product => 
            product.inStock && product.name.toLowerCase().includes(item.toLowerCase())
          )
        );
        return { store, score: availableItems.length };
      });
      
      storeScores.sort((a, b) => b.score - a.score);
      targetStore = storeScores[0]?.store || mockStores.find(store => store.isOpen) || null;
    }

    if (!targetStore) {
      throw new Error('No available stores found');
    }

    const storeProducts = getProductsByStore(targetStore.id);
    
    // Add items to cart
    for (const item of items) {
      const product = storeProducts.find(p => 
        p.inStock && p.name.toLowerCase().includes(item.toLowerCase())
      );
      
      if (product) {
        addToCart(product, 1, targetStore.id, targetStore.name);
        addedItems.push(product);
        totalCost += product.discountPrice || product.price;
      }
    }

    return { addedItems, totalCost };
  };

  const processShoppingRequest = async (userInput: string): Promise<{ response: string, actions?: ShoppingAction[] }> => {
    const input = userInput.toLowerCase();
    const actions: ShoppingAction[] = [];
    
    // Auto shopping patterns
    if (input.includes('shop for') || input.includes('buy') || input.includes('get me') || input.includes('add to cart')) {
      const items = extractItems(userInput);
      if (items.length > 0) {
        try {
          const result = await autoShop(items);
          
          if (result.addedItems.length > 0) {
            actions.push({
              type: 'checkout',
              data: { items: result.addedItems, total: result.totalCost },
              label: `Proceed to Checkout (₵${result.totalCost.toFixed(2)})`
            });
            
            return {
              response: `Great! I've automatically added ${result.addedItems.length} items to your cart:\n\n${result.addedItems.map(item => `• ${item.name} - ₵${(item.discountPrice || item.price).toFixed(2)}`).join('\n')}\n\nTotal: ₵${result.totalCost.toFixed(2)}\n\nWould you like to proceed to checkout or continue shopping?`,
              actions
            };
          } else {
            return {
              response: `I couldn't find the items you requested in stock. Let me show you what's available instead.`,
              actions: [{
                type: 'search_products',
                data: { query: items[0] },
                label: `Search for "${items[0]}"`
              }]
            };
          }
        } catch (error) {
          return {
            response: 'Sorry, I encountered an issue while shopping for you. Please try again or browse stores manually.',
            actions: [{
              type: 'view_store',
              data: { storeId: mockStores[0]?.id },
              label: 'Browse Stores'
            }]
          };
        }
      }
    }
    
    // Store finding
    if (input.includes('find store') || input.includes('show store') || input.includes('which store')) {
      const stores = findStores();
      actions.push(...stores.slice(0, 3).map(store => ({
        type: 'view_store' as const,
        data: { storeId: store.id },
        label: `Visit ${store.name}`
      })));
      
      return {
        response: `I found ${stores.length} open stores near you. Here are the top options:\n\n${stores.slice(0, 3).map(store => `• ${store.name} - ${store.categories.join(', ')} (Rating: ${store.rating}⭐)`).join('\n')}`,
        actions
      };
    }
    
    // Product search
    if (input.includes('search') || input.includes('find product') || input.includes('looking for')) {
      const query = extractSearchQuery(userInput);
      if (query) {
        const products = findProducts(query);
        if (products.length > 0) {
          actions.push(...products.slice(0, 3).map(product => ({
            type: 'add_to_cart' as const,
            data: { product },
            label: `Add ${product.name} (₵${(product.discountPrice || product.price).toFixed(2)})`
          })));
          
          return {
            response: `I found ${products.length} products matching "${query}":\n\n${products.slice(0, 5).map(product => `• ${product.name} - ₵${(product.discountPrice || product.price).toFixed(2)} at ${mockStores.find(s => s.id === product.storeId)?.name}`).join('\n')}`,
            actions
          };
        }
      }
    }
    
    return { response: '' };
  };

  const extractItems = (text: string): string[] => {
    const commonItems = [
      'rice', 'bread', 'milk', 'eggs', 'chicken', 'beef', 'fish', 'tomatoes', 'onions', 'potatoes',
      'cooking oil', 'flour', 'sugar', 'salt', 'pasta', 'cheese', 'butter', 'yogurt', 'bananas',
      'apples', 'oranges', 'carrots', 'spinach', 'lettuce', 'garlic', 'ginger', 'soap', 'shampoo',
      'toothpaste', 'toilet paper', 'detergent', 'water', 'juice', 'coffee', 'tea', 'biscuits'
    ];
    
    const foundItems: string[] = [];
    const lowerText = text.toLowerCase();
    
    for (const item of commonItems) {
      if (lowerText.includes(item)) {
        foundItems.push(item);
      }
    }
    
    return foundItems;
  };

  const extractSearchQuery = (text: string): string => {
    const patterns = [
      /search for (.+)/i,
      /find (.+)/i,
      /looking for (.+)/i,
      /show me (.+)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    
    return '';
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // First try to process as shopping request
      const shoppingResult = await processShoppingRequest(text.trim());
      
      if (shoppingResult.response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: shoppingResult.response,
          isUser: false,
          timestamp: new Date(),
          actions: shoppingResult.actions
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
        return;
      }

      // Fallback to AI API for general queries
      const aiMessages = [
        {
          role: 'system' as const,
          content: `You are an AI shopping assistant for QuickMart, a grocery delivery app. You can help users:
          1. Find and browse stores
          2. Search for specific products
          3. Add items to cart automatically
          4. Complete shopping tasks
          5. Provide product recommendations
          
          Current cart status: ${getItemCount()} items
          Available stores: ${mockStores.filter(s => s.isOpen).map(s => s.name).join(', ')}
          
          Be helpful, concise, and focus on shopping assistance. If users ask about shopping, suggest specific actions they can take.`
        },
        ...messages.map(msg => ({
          role: msg.isUser ? 'user' as const : 'assistant' as const,
          content: msg.text
        })),
        {
          role: 'user' as const,
          content: text.trim()
        }
      ];

      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: aiMessages
        })
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.completion || 'Sorry, I couldn\'t generate a response.',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI API request error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I\'m having trouble connecting right now. Let me help you with shopping instead. Try asking me to "shop for groceries" or "find stores near me".',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Voice recording is not available on web');
      return;
    }

    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant microphone permission to use voice recording.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      
      const uri = recording.getURI();
      if (!uri) {
        throw new Error('No recording URI');
      }

      // Transcribe audio
      const formData = new FormData();
      const uriParts = uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      const audioFile = {
        uri,
        name: "recording." + fileType,
        type: "audio/" + fileType
      } as any;

      formData.append('audio', audioFile);

      const response = await fetch('https://toolkit.rork.com/stt/transcribe/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      
      if (data.text && data.text.trim()) {
        await sendMessage(data.text.trim());
      } else {
        Alert.alert('No speech detected', 'Please try speaking again.');
      }
    } catch (error) {
      console.error('Recording processing error:', error);
      Alert.alert('Error', 'Failed to process voice recording. Please try again.');
    } finally {
      setRecording(null);
      
      // Reset audio mode
      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
      }
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleAction = async (action: ShoppingAction) => {
    switch (action.type) {
      case 'add_to_cart':
        const { product } = action.data;
        const store = mockStores.find(s => s.id === product.storeId);
        if (store) {
          addToCart(product, 1, store.id, store.name);
          
          const confirmMessage: Message = {
            id: Date.now().toString(),
            text: `✅ Added ${product.name} to your cart! You now have ${getItemCount() + 1} items in your cart.`,
            isUser: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, confirmMessage]);
        }
        break;
        
      case 'view_store':
        router.push({
          pathname: '/store/[id]',
          params: { id: action.data.storeId }
        });
        break;
        
      case 'checkout':
        if (getItemCount() > 0) {
          router.push('/checkout');
        } else {
          Alert.alert('Empty Cart', 'Your cart is empty. Add some items first!');
        }
        break;
        
      case 'search_products':
        const products = findProducts(action.data.query);
        const searchMessage: Message = {
          id: Date.now().toString(),
          text: `Here are products matching "${action.data.query}":\n\n${products.slice(0, 5).map(p => `• ${p.name} - ₵${(p.discountPrice || p.price).toFixed(2)}`).join('\n')}`,
          isUser: false,
          timestamp: new Date(),
          actions: products.slice(0, 3).map(product => ({
            type: 'add_to_cart' as const,
            data: { product },
            label: `Add ${product.name}`
          }))
        };
        setMessages(prev => [...prev, searchMessage]);
        break;
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: 'Hello! I\'m your AI shopping assistant for QuickMart. I can help you find stores, search for products, add items to your cart, and even complete your shopping automatically. What would you like to shop for today?',
        isUser: false,
        timestamp: new Date()
      }
    ]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Ensure all color properties exist with fallbacks
  const safeColors = {
    text: Colors.text || '#333333',
    subtext: Colors.subtext || '#757575',
    background: Colors.background || '#F5F7FA',
    white: Colors.white || '#FFFFFF',
    black: Colors.black || '#000000',
    border: Colors.border || '#E0E0E0',
    card: Colors.card || '#F9FAFC',
    lightGray: Colors.lightGray || '#F0F0F0',
    primary: Colors.primary || '#4361EE',
    success: Colors.success || '#4CAF50',
    error: Colors.error || '#F44336',
  };

  const styles = createStyles(safeColors);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={safeColors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <View style={styles.aiAvatar}>
            <View style={styles.aiAvatarInner} />
          </View>
          <Text style={styles.headerTitle}>Shopping Assistant</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => router.push('/(customer)/cart')}
        >
          <ShoppingCart size={24} color={safeColors.text} />
          {getItemCount() > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{getItemCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.clearButton} onPress={clearChat}>
          <RotateCcw size={20} color={safeColors.text} />
        </TouchableOpacity>
      </View>
      
      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <View key={message.id} style={[
            styles.messageContainer,
            message.isUser ? styles.userMessageContainer : styles.aiMessageContainer
          ]}>
            {!message.isUser && (
              <View style={styles.aiMessageAvatar}>
                <View style={styles.aiAvatarSmall} />
              </View>
            )}
            
            <View style={[
              styles.messageBubble,
              message.isUser ? styles.userMessageBubble : styles.aiMessageBubble
            ]}>
              <Text style={[
                styles.messageText,
                message.isUser ? styles.userMessageText : styles.aiMessageText
              ]}>
                {message.text}
              </Text>
              
              {message.actions && message.actions.length > 0 && (
                <View style={styles.actionsContainer}>
                  {message.actions.map((action, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.actionButton}
                      onPress={() => handleAction(action)}
                    >
                      {action.type === 'add_to_cart' && <Package size={16} color={safeColors.primary} />}
                      {action.type === 'view_store' && <Store size={16} color={safeColors.primary} />}
                      {action.type === 'checkout' && <ShoppingCart size={16} color={safeColors.primary} />}
                      {action.type === 'search_products' && <Search size={16} color={safeColors.primary} />}
                      <Text style={styles.actionButtonText}>{action.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            
            {message.isUser && (
              <Text style={styles.messageTime}>
                {formatTime(message.timestamp)}
              </Text>
            )}
          </View>
        ))}
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <View style={styles.aiMessageAvatar}>
              <View style={styles.aiAvatarSmall} />
            </View>
            <View style={styles.loadingBubble}>
              <View style={styles.typingIndicator}>
                <View style={[styles.typingDot, { animationDelay: '0ms' }]} />
                <View style={[styles.typingDot, { animationDelay: '150ms' }]} />
                <View style={[styles.typingDot, { animationDelay: '300ms' }]} />
              </View>
            </View>
          </View>
        )}
        
        {/* Suggested Prompts */}
        {messages.length === 1 && (
          <View style={styles.suggestedPromptsContainer}>
            <Text style={styles.suggestedPromptsTitle}>Try these shopping commands or describe what you need</Text>
            <View style={styles.suggestedPrompts}>
              {suggestedPrompts.map((prompt, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.suggestedPrompt}
                  onPress={() => handleSuggestedPrompt(prompt)}
                >
                  <Text style={styles.suggestedPromptText}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.shoppingStats}>
              <Text style={styles.shoppingStatsText}>
                🛍️ {mockStores.filter(s => s.isOpen).length} stores open • 🛒 {getItemCount()} items in cart
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
      
      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.attachButton}>
            <Paperclip size={20} color={safeColors.subtext} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            placeholder="What would you like to shop for?"
            placeholderTextColor={safeColors.subtext}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />
          
          <TouchableOpacity 
            style={styles.voiceButton}
            onPress={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
          >
            {isRecording ? (
              <MicOff size={20} color={safeColors.error} />
            ) : (
              <Mic size={20} color={safeColors.subtext} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled
            ]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim() || isLoading}
          >
            <Send size={20} color={(!inputText.trim() || isLoading) ? safeColors.subtext : safeColors.primary} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.disclaimer}>
          I can automatically add items to your cart and help you shop!
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (safeColors: any) => {
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: safeColors.white,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: 50,
      paddingBottom: 16,
      backgroundColor: 'transparent',
    },
    backButton: {
      padding: 8,
    },
    headerCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      marginHorizontal: 16,
    },
    aiAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#E8F5E8',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    aiAvatarInner: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: safeColors.success,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: safeColors.text,
    },
    cartButton: {
      position: 'relative',
      padding: 8,
    },
    cartBadge: {
      position: 'absolute',
      top: 2,
      right: 2,
      backgroundColor: safeColors.error,
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cartBadgeText: {
      color: safeColors.white,
      fontSize: 12,
      fontWeight: 'bold',
    },
    clearButton: {
      padding: 8,
    },
    messagesContainer: {
      flex: 1,
    },
    messagesContent: {
      padding: 16,
      paddingBottom: 32,
    },
    messageContainer: {
      flexDirection: 'row',
      marginBottom: 16,
      alignItems: 'flex-end',
    },
    userMessageContainer: {
      justifyContent: 'flex-end',
      alignSelf: 'flex-end',
    },
    aiMessageContainer: {
      justifyContent: 'flex-start',
      alignSelf: 'flex-start',
    },
    aiMessageAvatar: {
      marginRight: 8,
      marginBottom: 4,
    },
    aiAvatarSmall: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: safeColors.success,
    },
    messageBubble: {
      maxWidth: '80%',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 20,
    },
    userMessageBubble: {
      backgroundColor: safeColors.primary,
      borderBottomRightRadius: 4,
    },
    aiMessageBubble: {
      backgroundColor: safeColors.lightGray,
      borderBottomLeftRadius: 4,
    },
    messageText: {
      fontSize: 16,
      lineHeight: 22,
    },
    userMessageText: {
      color: safeColors.white,
    },
    aiMessageText: {
      color: safeColors.text,
    },
    actionsContainer: {
      marginTop: 12,
      gap: 8,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: safeColors.card,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: safeColors.border,
    },
    actionButtonText: {
      fontSize: 14,
      color: safeColors.primary,
      marginLeft: 6,
      fontWeight: '500',
    },
    messageTime: {
      fontSize: 12,
      color: safeColors.subtext,
      marginLeft: 8,
      marginBottom: 4,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginBottom: 16,
    },
    loadingBubble: {
      backgroundColor: safeColors.lightGray,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 20,
      borderBottomLeftRadius: 4,
    },
    typingIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    typingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: safeColors.subtext,
      marginHorizontal: 2,
    },
    suggestedPromptsContainer: {
      marginTop: 24,
      alignItems: 'center',
    },
    suggestedPromptsTitle: {
      fontSize: 14,
      color: safeColors.subtext,
      textAlign: 'center',
      marginBottom: 16,
      paddingHorizontal: 32,
      lineHeight: 20,
    },
    suggestedPrompts: {
      width: '100%',
      marginBottom: 16,
    },
    suggestedPrompt: {
      backgroundColor: safeColors.card,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: safeColors.border,
    },
    suggestedPromptText: {
      fontSize: 14,
      color: safeColors.text,
      fontWeight: '500',
    },
    shoppingStats: {
      marginTop: 16,
      alignItems: 'center',
    },
    shoppingStatsText: {
      fontSize: 14,
      color: safeColors.subtext,
      textAlign: 'center',
    },
    inputContainer: {
      backgroundColor: safeColors.white,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 32,
      borderTopWidth: 1,
      borderTopColor: safeColors.border,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      backgroundColor: safeColors.lightGray,
      borderRadius: 24,
      paddingHorizontal: 4,
      paddingVertical: 4,
      marginBottom: 8,
    },
    attachButton: {
      padding: 12,
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      color: safeColors.text,
      paddingVertical: 12,
      paddingHorizontal: 8,
      maxHeight: 100,
    },
    voiceButton: {
      padding: 12,
    },
    sendButton: {
      padding: 12,
    },
    sendButtonDisabled: {
      opacity: 0.5,
    },
    disclaimer: {
      fontSize: 12,
      color: safeColors.subtext,
      textAlign: 'center',
    },
  });
};