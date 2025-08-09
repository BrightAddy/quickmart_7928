import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, Modal, Animated, Easing, StyleSheet, View as RNView, Text as RNText, TextInput, FlatList, ViewProps, TextProps } from 'react-native';
import { useTheme } from '../theme/theme';

// Ghanaian-inspired loading animation component
export const GhanaianLoader: React.FC<{ size?: number }> = ({ size = 40 }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();
  
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <Animated.View 
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 3,
        borderColor: colors.secondary + '40',
        borderTopColor: colors.primary,
        transform: [{ rotate: rotation }]
      }}
    />
  );
};

// Kente-pattern inspired background component with animated patterns
export const KenteAccent: React.FC<{ style?: any; animated?: boolean }> = ({ style, animated = false }) => {
  const { colors } = useTheme();
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [animated]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[{
      position: 'absolute',
      top: 0,
      right: 0,
      width: 60,
      height: 60,
      overflow: 'hidden',
      transform: animated ? [{ rotate }] : [],
    }, style]}>
      {/* Enhanced Kente pattern */}
      <RNView style={{
        width: 80,
        height: 4,
        backgroundColor: colors.secondary,
        transform: [{ rotate: '45deg' }],
        position: 'absolute',
        top: 8,
        opacity: 0.9
      }} />
      <RNView style={{
        width: 80,
        height: 2,
        backgroundColor: colors.primary,
        transform: [{ rotate: '45deg' }],
        position: 'absolute',
        top: 18,
        opacity: 0.8
      }} />
      <RNView style={{
        width: 80,
        height: 3,
        backgroundColor: colors.error,
        transform: [{ rotate: '45deg' }],
        position: 'absolute',
        top: 28,
        opacity: 0.7
      }} />
      <RNView style={{
        width: 80,
        height: 2,
        backgroundColor: colors.secondary + '88',
        transform: [{ rotate: '45deg' }],
        position: 'absolute',
        top: 38,
        opacity: 0.6
      }} />
    </Animated.View>
  );
};

// Adinkra symbol loader with cultural significance
export const AdinkraLoader: React.FC<{ size?: number; symbol?: string }> = ({ size = 40, symbol = 'gye_nyame' }) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const adinkraSymbols = {
    gye_nyame: '⚡', // Except God - Supreme power
    sankofa: '🐦', // Return and get it - Learning from the past
    dwennimmen: '🐏', // Ram's horns - Humility and strength
    aya: '🌿', // Fern - Endurance and resourcefulness
    akoma: '❤️', // Heart - Patience and tolerance
    nkyinkyim: '🌀', // Twisting - Initiative and dynamism
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{
      transform: [{ scale: scaleAnim }, { rotate }],
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <RNView style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.primary + '22',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.primary + '44',
      }}>
        <RNText style={{ 
          fontSize: size * 0.5, 
          color: colors.primary 
        }}>
          {adinkraSymbols[symbol as keyof typeof adinkraSymbols] || '⚡'}
        </RNText>
      </RNView>
    </Animated.View>
  );
};

// Ghana flag colors gradient background
export const GhanaGradient: React.FC<{ style?: any; children?: React.ReactNode }> = ({ style, children }) => {
  const { colors } = useTheme();
  return (
    <RNView style={[{
      backgroundColor: colors.primary,
      position: 'relative',
    }, style]}>
      <RNView style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '33%',
        backgroundColor: colors.error + '88', // Red stripe
      }} />
      <RNView style={{
        position: 'absolute',
        top: '33%',
        left: 0,
        right: 0,
        height: '34%',
        backgroundColor: colors.secondary + '88', // Yellow stripe
      }} />
      <RNView style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '33%',
        backgroundColor: colors.primary + '88', // Green stripe
      }} />
      <RNView style={{
        position: 'absolute',
        top: '45%',
        left: '45%',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#000', // Black star
      }} />
      {children}
    </RNView>
  );
};

export const Screen: React.FC<ViewProps> = ({ style, ...props }) => {
  const { colors } = useTheme();
  return (
    <RNView
      style={[{ flex: 1, backgroundColor: colors.background, padding: 16 }, style]}
      {...props}
    />
  );
};

export const Title: React.FC<TextProps> = ({ style, ...props }) => {
  const { colors } = useTheme();
  return (
    <RNText
      style={[{ fontSize: 24, fontWeight: '700', color: colors.onBackground }, style]}
      {...props}
    />
  );
};

export const Body: React.FC<TextProps> = ({ style, ...props }) => {
  const { colors } = useTheme();
  return (
    <RNText
      style={[{ fontSize: 16, color: colors.onBackground }, style]}
      {...props}
    />
  );
};

export const FloatingChatbotButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const { colors } = useTheme();
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Gentle bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: 1.08, duration: 1200, useNativeDriver: true, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) }),
        Animated.timing(bounceAnim, { toValue: 1, duration: 1200, useNativeDriver: true, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) })
      ])
    ).start();
    
    // Glow pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 2000, useNativeDriver: true })
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ position: 'absolute', right: 24, bottom: 32, zIndex: 100, transform: [{ scale: bounceAnim }] }}>
      <Animated.View 
        style={{
          position: 'absolute',
          width: 72, height: 72,
          borderRadius: 36,
          backgroundColor: colors.primary,
          opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.3] }),
          transform: [{ scale: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] }) }]
        }}
      />
      <TouchableOpacity
        onPress={onPress}
        style={{ 
          backgroundColor: colors.primary, 
          borderRadius: 32, 
          width: 56, 
          height: 56, 
          alignItems: 'center', 
          justifyContent: 'center', 
          shadowColor: colors.primary,
          shadowOpacity: 0.4,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 8
        }}
        activeOpacity={0.85}
        accessibilityLabel="Open AI Assistant"
        accessibilityHint="Get help with your shopping and orders"
        accessibilityRole="button"
      >
        <RNText style={{ fontSize: 28, color: 'white' }}>💬</RNText>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface ChatMessage {
  text: string;
  from: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'visual' | 'map' | 'product';
  visualData?: {
    type: 'map' | 'product' | 'order';
    data: any;
  };
}

export const ChatbotModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      text: 'Hello! How can I help you today?', 
      from: 'bot', 
      type: 'text',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [lang, setLang] = useState<'en' | 'tw' | 'ga' | 'ew'>('en');
  const [isTyping, setIsTyping] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const typingAnim = useRef(new Animated.Value(0)).current;

  const languageLabels = {
    en: 'English',
    tw: 'Twi',
    ga: 'Ga',
    ew: 'Ewe'
  };

  const greetings = {
    en: 'Hello! How can I help you today?',
    tw: 'Akwaaba! Ɛdeɛn na metumi ayɛ ama wo ɛnnɛ?',
    ga: 'Baa! Ke mi tɔ nɛ lɛ mi baa wɔ?',
    ew: 'Woezɔ! Aleke mate ŋu akpe wò egbe?'
  };

  const placeholders = {
    en: 'Type your message...',
    tw: 'Kyerɛ wo asɛm...',
    ga: 'Ŋlɔ wɔ nuŋuiŋmɔ...',
    ew: 'Ŋlɔ wò nyagbe...'
  };

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      // Update greeting when modal opens
      setMessages([{
        text: greetings[lang],
        from: 'bot',
        type: 'text',
        timestamp: new Date()
      }]);
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, lang]);

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(typingAnim, { toValue: 0, duration: 600, useNativeDriver: true })
        ])
      ).start();
    } else {
      typingAnim.setValue(0);
    }
  }, [isTyping]);

  const generateSmartResponse = (userMessage: string): ChatMessage => {
    const lowerMsg = userMessage.toLowerCase();
    
    // Order tracking responses
    if (lowerMsg.includes('order') || lowerMsg.includes('delivery') || lowerMsg.includes('track')) {
      const responses = {
        en: "I can help you track your order! Your delivery is currently on its way. Here's the live location:",
        tw: "Metumi aboa wo ma wo nhwɛ wo order! Wo delivery reba ɛnnɛ. Hwɛ location ha:",
        ga: "Mi mate ŋu akpe wɔ order tracking! Wɔ delivery gbɛɛ lɛ. Yɛ location lɛ ni:",
        ew: "Mate ŋu akpe wò be nàkpɔ wò order! Wò delivery le mɔ dzi gbɔna. Teƒe si wòle la nye:"
      };
      return {
        text: responses[lang],
        from: 'bot',
        type: 'visual',
        timestamp: new Date(),
        visualData: {
          type: 'map',
          data: { lat: 5.6037, lng: -0.1870, address: 'Accra, Ghana' }
        }
      };
    }

    // Product help
    if (lowerMsg.includes('product') || lowerMsg.includes('item') || lowerMsg.includes('find')) {
      const responses = {
        en: "I can help you find products! Here are some popular items:",
        tw: "Metumi aboa wo ma wo nya nneɛma! Yei ne nneɛma a nnipa pɛ pii:",
        ga: "Mi mate ŋu akpe wɔ nɛ mi nya nɛɛma! Lɛɛ nɛɛma lɛ nnipa lɔɔ pii:",
        ew: "Mate ŋu akpe wò nàdi nusiwo! Nusi siwo amewo lɔ̃na wu la woe nye:"
      };
      return {
        text: responses[lang],
        from: 'bot',
        type: 'visual',
        timestamp: new Date(),
        visualData: {
          type: 'product',
          data: [
            { name: 'Fresh Tomatoes', price: 'GH₵ 5.50', image: '🍅' },
            { name: 'Rice (5kg)', price: 'GH₵ 25.00', image: '🍚' },
            { name: 'Palm Oil', price: 'GH₵ 15.00', image: '🫒' }
          ]
        }
      };
    }

    // Payment help
    if (lowerMsg.includes('payment') || lowerMsg.includes('pay') || lowerMsg.includes('money')) {
      const responses = {
        en: "I can help with payments! We accept Mobile Money (MTN MoMo, Vodafone Cash), cards, and cash on delivery.",
        tw: "Metumi aboa wo wɔ payment ho! Yɛgye Mobile Money (MTN MoMo, Vodafone Cash), cards, ne cash on delivery.",
        ga: "Mi mate ŋu akpe wɔ payment ho! Mi gbe Mobile Money (MTN MoMo, Vodafone Cash), cards, kɛ cash on delivery.",
        ew: "Mate ŋu akpe wò le ga xexe me! Míexɔa Mobile Money (MTN MoMo, Vodafone Cash), kaɖiwo, kple ga si woaxe le aƒe me."
      };
      return {
        text: responses[lang],
        from: 'bot',
        type: 'text',
        timestamp: new Date()
      };
    }

    // Default responses
    const defaultResponses = {
      en: [
        'I understand! Let me help you with that.',
        'Sure, I can assist you with your QuickMart needs.',
        'Let me check that for you right away!',
        'Great question! Here\'s what I can help with...'
      ],
      tw: [
        'Mete ase! Ma me mmoa wo.',
        'Ampa, metumi aboa wo wɔ QuickMart ho.',
        'Ma me nhwɛ ma wo ntɛmntɛm!',
        'Asɛm pa! Yei ne deɛ metumi aboa wo...'
      ],
      ga: [
        'Mi tɛ! Ma mi akpe wɔ.',
        'Ampa, mi mate ŋu akpe wɔ QuickMart ho.',
        'Ma mi lɔɔ lɛ ma wɔ ntɛmntɛm!',
        'Asɛm fɛɛ! Lɛɛ mi mate ŋu akpe wɔ...'
      ],
      ew: [
        'Mese egɔme! Na makpe wò.',
        'Nyateƒe, mate ŋu akpe wò le QuickMart ŋuti.',
        'Na makpɔe na wò enumake!',
        'Biabia nyui! Nu si ŋu mate ŋu akpe wò le enye...'
      ]
    };

    const randomResponse = defaultResponses[lang][Math.floor(Math.random() * defaultResponses[lang].length)];
    return {
      text: randomResponse,
      from: 'bot',
      type: 'text',
      timestamp: new Date()
    };
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { 
      text: input, 
      from: 'user', 
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [userMsg, ...prev]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const botResponse = generateSmartResponse(input);
      setMessages(prev => [botResponse, ...prev]);
      setIsTyping(false);
    }, 1200);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <RNView style={[
      chatbotStyles.bubble, 
      item.from === 'user' ? chatbotStyles.userBubble : chatbotStyles.botBubble,
      { backgroundColor: item.from === 'user' ? colors.primary : colors.surface }
    ]}>
      <RNText style={{ 
        color: item.from === 'user' ? colors.onPrimary : colors.onSurface,
        fontSize: 14,
        lineHeight: 20
      }}>
        {item.text}
      </RNText>
      
      {/* Visual aids for bot messages */}
      {item.type === 'visual' && item.visualData && (
        <RNView style={chatbotStyles.visualContainer}>
          {item.visualData.type === 'map' && (
            <RNView style={[chatbotStyles.mapPreview, { backgroundColor: colors.secondary + '22' }]}>
              <RNText style={{ fontSize: 24, marginBottom: 8 }}>📍</RNText>
              <RNText style={{ fontSize: 12, color: colors.onSurface, textAlign: 'center' }}>
                Live tracking: {item.visualData.data.address}
              </RNText>
            </RNView>
          )}
          
          {item.visualData.type === 'product' && (
            <RNView style={chatbotStyles.productGrid}>
              {item.visualData.data.map((product: any, index: number) => (
                <RNView key={index} style={[chatbotStyles.productCard, { backgroundColor: colors.background }]}>
                  <RNText style={{ fontSize: 20, marginBottom: 4 }}>{product.image}</RNText>
                  <RNText style={{ fontSize: 10, color: colors.onBackground, textAlign: 'center' }}>
                    {product.name}
                  </RNText>
                  <RNText style={{ fontSize: 10, fontWeight: 'bold', color: colors.primary, textAlign: 'center' }}>
                    {product.price}
                  </RNText>
                </RNView>
              ))}
            </RNView>
          )}
        </RNView>
      )}
      
      <RNText style={{ 
        fontSize: 10, 
        color: item.from === 'user' ? colors.onPrimary + '88' : colors.onSurface + '88',
        marginTop: 4,
        textAlign: item.from === 'user' ? 'right' : 'left'
      }}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </RNText>
    </RNView>
  );

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <RNView style={chatbotStyles.overlay}>
        <Animated.View style={[
          chatbotStyles.modal, 
          { backgroundColor: colors.surface, transform: [{ translateY: slideAnim }] }
        ]}> 
          <RNView style={[chatbotStyles.header, { borderBottomColor: colors.primary + '22' }]}>
            <RNView>
              <RNText style={[chatbotStyles.headerText, { color: colors.primary }]}>QuickMart Assistant</RNText>
              <RNText style={[chatbotStyles.headerSubtext, { color: colors.onSurface + '88' }]}>
                AI-powered multilingual support
              </RNText>
            </RNView>
            <TouchableOpacity onPress={onClose} style={chatbotStyles.closeButton}>
              <RNText style={{ fontSize: 20, color: colors.primary }}>×</RNText>
            </TouchableOpacity>
          </RNView>
          
          <RNView style={chatbotStyles.langRow}>
            {Object.entries(languageLabels).map(([key, label]) => (
              <TouchableOpacity 
                key={key}
                style={[
                  chatbotStyles.langBtn, 
                  lang === key && { backgroundColor: colors.primary },
                  { borderColor: colors.primary }
                ]} 
                onPress={() => setLang(key as any)}
              >
                <RNText style={[
                  chatbotStyles.langBtnText,
                  { color: lang === key ? colors.onPrimary : colors.primary }
                ]}>
                  {key.toUpperCase()}
                </RNText>
              </TouchableOpacity>
            ))}
          </RNView>
          
          <FlatList
            data={messages}
            keyExtractor={(_, i) => i.toString()}
            renderItem={renderMessage}
            contentContainerStyle={{ padding: 12, gap: 12 }}
            style={{ flex: 1 }}
            inverted
            showsVerticalScrollIndicator={false}
          />
          
          {isTyping && (
            <RNView style={[chatbotStyles.typingIndicator, { backgroundColor: colors.surface }]}>
              <Animated.View style={[
                chatbotStyles.typingDot,
                { backgroundColor: colors.primary, opacity: typingAnim }
              ]} />
              <Animated.View style={[
                chatbotStyles.typingDot,
                { backgroundColor: colors.primary, opacity: typingAnim }
              ]} />
              <Animated.View style={[
                chatbotStyles.typingDot,
                { backgroundColor: colors.primary, opacity: typingAnim }
              ]} />
              <RNText style={{ marginLeft: 8, color: colors.onSurface + '88', fontSize: 12 }}>
                Assistant is typing...
              </RNText>
            </RNView>
          )}
          
          <RNView style={[chatbotStyles.inputRow, { borderTopColor: colors.primary + '22' }]}>
            <TextInput
              style={[chatbotStyles.input, { 
                color: colors.onSurface, 
                backgroundColor: colors.background, 
                borderColor: colors.primary + '33' 
              }]}
              placeholder={placeholders[lang]}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={sendMessage}
              placeholderTextColor={colors.onSurface + '77'}
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[chatbotStyles.sendBtn, { backgroundColor: colors.primary }]} 
              onPress={sendMessage}
              disabled={!input.trim()}
            >
              <RNText style={{ color: colors.onPrimary, fontWeight: 'bold', fontSize: 16 }}>→</RNText>
            </TouchableOpacity>
          </RNView>
        </Animated.View>
      </RNView>
    </Modal>
  );
};

export const ImageUploadButton: React.FC<{ onPress: () => void; style?: any }> = ({ onPress, style }) => {
  const { colors } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[{ transform: [{ scale: pulseAnim }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        style={[imageStyles.uploadBtn, { backgroundColor: colors.primary }]}
        activeOpacity={0.8}
        accessibilityLabel="Scan product with camera"
        accessibilityHint="Take a photo to identify and add products"
        accessibilityRole="button"
      >
        <RNText style={{ fontSize: 20, color: 'white' }}>📷</RNText>
        <RNText style={[imageStyles.uploadBtnText, { color: 'white' }]}>Scan Product</RNText>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface ScanResult {
  product: string;
  confidence: number;
  category: string;
  price: string;
  alternatives?: Array<{ name: string; confidence: number; price: string }>;
  nutritionInfo?: { calories: number; ingredients: string[] };
  ghanaianName?: string;
  description?: string;
}

export const ImageScanModal: React.FC<{ 
  visible: boolean; 
  onClose: () => void; 
  onRecognized: (result: ScanResult) => void;
  mode?: 'customer' | 'shopper' | 'store_owner';
}> = ({ visible, onClose, onRecognized, mode = 'customer' }) => {
  const { colors } = useTheme();
  const [scanning, setScanning] = useState(false);
  const [recognized, setRecognized] = useState(false);
  const slideAnim = useRef(new Animated.Value(400)).current;
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    } else {
      slideAnim.setValue(400);
      setScanning(false);
      setRecognized(false);
    }
  }, [visible]);

  const ghanaianProducts: ScanResult[] = [
    {
      product: 'Kelewele Spice Mix',
      confidence: 0.98,
      category: 'Spices & Seasonings',
      price: 'GH₵ 4.50',
      ghanaianName: 'Kelewele Aduro',
      description: 'Traditional Ghanaian plantain seasoning blend',
      nutritionInfo: { calories: 15, ingredients: ['Ginger', 'Nutmeg', 'Cloves', 'Pepper'] }
    },
    {
      product: 'Fan Milk Yoghurt',
      confidence: 0.96,
      category: 'Dairy Products',
      price: 'GH₵ 3.20',
      ghanaianName: 'Fan Milk Yogurt',
      description: 'Popular Ghanaian dairy product',
      alternatives: [
        { name: 'Fan Ice Cream', confidence: 0.85, price: 'GH₵ 2.50' },
        { name: 'Voltic Yoghurt', confidence: 0.75, price: 'GH₵ 3.00' }
      ]
    },
    {
      product: 'Titus Sardine',
      confidence: 0.94,
      category: 'Canned Fish',
      price: 'GH₵ 6.80',
      ghanaianName: 'Titus Koobi',
      description: 'Premium canned sardines popular in Ghana',
      nutritionInfo: { calories: 180, ingredients: ['Sardines', 'Tomato Sauce', 'Salt'] }
    },
    {
      product: 'Gino Tomato Paste',
      confidence: 0.97,
      category: 'Condiments',
      price: 'GH₵ 2.30',
      ghanaianName: 'Gino Paste',
      description: 'Essential cooking ingredient for Ghanaian dishes'
    },
    {
      product: 'Milo Chocolate Drink',
      confidence: 0.99,
      category: 'Beverages',
      price: 'GH₵ 8.90',
      ghanaianName: 'Milo',
      description: 'Popular chocolate malt drink in Ghana',
      nutritionInfo: { calories: 95, ingredients: ['Malt Extract', 'Cocoa', 'Milk', 'Sugar'] }
    }
  ];

  const startScanning = (source: 'camera' | 'gallery' | 'barcode') => {
    setScanning(true);
    // Animate scanning effect
    Animated.loop(
      Animated.timing(scanAnim, { toValue: 1, duration: 1200, useNativeDriver: true })
    ).start();

    // Mock recognition with Ghanaian products
    setTimeout(() => {
      scanAnim.stopAnimation();
      setScanning(false);
      setRecognized(true);
      
      // Select random Ghanaian product
      const randomProduct = ghanaianProducts[Math.floor(Math.random() * ghanaianProducts.length)];
      
      setTimeout(() => {
        onRecognized(randomProduct);
        onClose();
      }, 1500);
    }, 2500);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <RNView style={imageStyles.overlay}>
        <Animated.View style={[imageStyles.scanModal, { backgroundColor: colors.surface, transform: [{ translateY: slideAnim }] }]}>
          {!scanning && !recognized && (
            <>
              <RNText style={[imageStyles.modalTitle, { color: colors.onSurface }]}>
                {mode === 'shopper' ? 'Verify Product' : 
                 mode === 'store_owner' ? 'Add to Inventory' : 
                 'Identify Product'}
              </RNText>
              <RNText style={[imageStyles.modalSubtitle, { color: colors.onSurface + '88' }]}>
                {mode === 'shopper' ? 'Confirm this matches the customer\'s request' :
                 mode === 'store_owner' ? 'Automatically categorize and price your inventory' :
                 'Find exactly what you\'re looking for'}
              </RNText>
              
              <TouchableOpacity style={[imageStyles.optionBtn, { borderColor: colors.primary }]} onPress={() => startScanning('camera')}>
                <RNText style={{ fontSize: 24, marginBottom: 4 }}>📷</RNText>
                <RNText style={[imageStyles.optionText, { color: colors.onSurface }]}>Take Photo</RNText>
                <RNText style={[imageStyles.optionSubtext, { color: colors.onSurface + '66' }]}>Best for fresh produce</RNText>
              </TouchableOpacity>
              
              <TouchableOpacity style={[imageStyles.optionBtn, { borderColor: colors.primary }]} onPress={() => startScanning('gallery')}>
                <RNText style={{ fontSize: 24, marginBottom: 4 }}>🖼️</RNText>
                <RNText style={[imageStyles.optionText, { color: colors.onSurface }]}>Choose from Gallery</RNText>
                <RNText style={[imageStyles.optionSubtext, { color: colors.onSurface + '66' }]}>Upload existing photos</RNText>
              </TouchableOpacity>
              
              <TouchableOpacity style={[imageStyles.optionBtn, { borderColor: colors.secondary }]} onPress={() => startScanning('barcode')}>
                <RNText style={{ fontSize: 24, marginBottom: 4 }}>🔍</RNText>
                <RNText style={[imageStyles.optionText, { color: colors.onSurface }]}>Scan Barcode</RNText>
                <RNText style={[imageStyles.optionSubtext, { color: colors.onSurface + '66' }]}>Most accurate for packaged items</RNText>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={onClose} style={imageStyles.cancelBtn}>
                <RNText style={[imageStyles.cancelText, { color: colors.primary }]}>Cancel</RNText>
              </TouchableOpacity>
            </>
          )}
          
          {scanning && (
            <RNView style={imageStyles.scanningView}>
              <RNView style={[imageStyles.scanFrame, { borderColor: colors.primary }]}>
                <Animated.View style={[
                  imageStyles.scanLine, 
                  { 
                    backgroundColor: colors.secondary,
                    transform: [{ translateY: scanAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 120] }) }] 
                  }
                ]} />
              </RNView>
              <RNText style={[imageStyles.scanningText, { color: colors.primary }]}>
                Analyzing Ghanaian products...
              </RNText>
              <RNText style={[imageStyles.scanningSubtext, { color: colors.onSurface + '88' }]}>
                AI processing in progress
              </RNText>
              
              {/* Progress indicator */}
              <RNView style={[imageStyles.progressContainer, { backgroundColor: colors.background }]}>
                <RNView style={[imageStyles.progressBar, { backgroundColor: colors.primary }]} />
              </RNView>
            </RNView>
          )}
          
          {recognized && (
            <RNView style={imageStyles.recognizedView}>
              <RNView style={[imageStyles.checkmarkContainer, { backgroundColor: colors.primary + '22' }]}>
                <RNText style={{ fontSize: 48, color: colors.primary }}>✓</RNText>
              </RNView>
              <RNText style={[imageStyles.recognizedText, { color: colors.primary }]}>Product Identified!</RNText>
              <RNText style={[imageStyles.recognizedSubtext, { color: colors.onSurface + '88' }]}>
                {mode === 'shopper' ? 'Verification complete' : 
                 mode === 'store_owner' ? 'Adding to inventory...' : 
                 'Product details loaded'}
              </RNText>
            </RNView>
          )}
        </Animated.View>
      </RNView>
    </Modal>
  );
};

export const ImageRecognitionResult: React.FC<{ result: ScanResult; visible: boolean; onClose: () => void }> = ({ result, visible, onClose }) => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true })
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [visible]);

  if (!visible || !result) return null;

  const getProductEmoji = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'spices & seasonings': return '🌶️';
      case 'dairy products': return '🥛';
      case 'canned fish': return '🐟';
      case 'condiments': return '🍅';
      case 'beverages': return '☕';
      case 'fruits': return '🍌';
      case 'vegetables': return '🥕';
      default: return '📦';
    }
  };

  return (
    <Animated.View style={[imageStyles.resultOverlay, { opacity: fadeAnim }]}>
      <Animated.View style={[
        imageStyles.resultCard, 
        { backgroundColor: colors.surface, transform: [{ scale: scaleAnim }] }
      ]}>
        <RNView style={[imageStyles.boundingBox, { borderColor: colors.primary }]}>
          <RNText style={{ fontSize: 40 }}>{getProductEmoji(result.category)}</RNText>
          <Animated.View style={[
            imageStyles.confidenceBadge,
            { backgroundColor: result.confidence > 0.9 ? colors.primary : colors.secondary }
          ]}>
            <RNText style={[imageStyles.confidenceText, { color: colors.onPrimary }]}>
              {Math.round(result.confidence * 100)}%
            </RNText>
          </Animated.View>
        </RNView>
        
        <RNText style={[imageStyles.resultTitle, { color: colors.onSurface }]}>{result.product}</RNText>
        
        {result.ghanaianName && (
          <RNText style={[imageStyles.ghanaianName, { color: colors.primary }]}>
            {result.ghanaianName}
          </RNText>
        )}
        
        <RNText style={[imageStyles.resultCategory, { color: colors.onSurface + '88' }]}>
          {result.category}
        </RNText>
        
        <RNText style={[imageStyles.resultPrice, { color: colors.primary }]}>{result.price}</RNText>
        
        {result.description && (
          <RNText style={[imageStyles.resultDescription, { color: colors.onSurface + '99' }]}>
            {result.description}
          </RNText>
        )}
        
        {result.nutritionInfo && (
          <RNView style={[imageStyles.nutritionContainer, { backgroundColor: colors.background }]}>
            <RNText style={[imageStyles.nutritionTitle, { color: colors.onBackground }]}>
              Nutrition (per serving)
            </RNText>
            <RNText style={[imageStyles.nutritionText, { color: colors.onBackground + '88' }]}>
              {result.nutritionInfo.calories} calories
            </RNText>
            <RNText style={[imageStyles.nutritionText, { color: colors.onBackground + '88' }]}>
              Ingredients: {result.nutritionInfo.ingredients.join(', ')}
            </RNText>
          </RNView>
        )}
        
        {result.alternatives && result.alternatives.length > 0 && (
          <RNView style={imageStyles.alternativesContainer}>
            <RNText style={[imageStyles.alternativesTitle, { color: colors.onSurface }]}>
              Similar products:
            </RNText>
            {result.alternatives.map((alt, index) => (
              <RNView key={index} style={[imageStyles.alternativeItem, { backgroundColor: colors.background }]}>
                <RNText style={[imageStyles.alternativeName, { color: colors.onBackground }]}>
                  {alt.name}
                </RNText>
                <RNText style={[imageStyles.alternativePrice, { color: colors.primary }]}>
                  {alt.price}
                </RNText>
              </RNView>
            ))}
          </RNView>
        )}
        
        <RNView style={imageStyles.buttonRow}>
          <TouchableOpacity 
            style={[imageStyles.resultBtn, imageStyles.secondaryBtn, { borderColor: colors.primary }]} 
            onPress={onClose}
          >
            <RNText style={[imageStyles.resultBtnText, { color: colors.primary }]}>Close</RNText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[imageStyles.resultBtn, imageStyles.primaryBtn, { backgroundColor: colors.primary }]} 
            onPress={onClose}
          >
            <RNText style={[imageStyles.resultBtnText, { color: colors.onPrimary }]}>Add to Cart</RNText>
          </TouchableOpacity>
        </RNView>
      </Animated.View>
    </Animated.View>
  );
};

const imageStyles = StyleSheet.create({
  uploadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8, gap: 6 },
  uploadBtnText: { fontSize: 14, fontWeight: 'bold' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  scanModal: { width: 320, borderRadius: 20, padding: 24, alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 4, textAlign: 'center' },
  modalSubtitle: { fontSize: 14, marginBottom: 24, textAlign: 'center', lineHeight: 20 },
  optionBtn: { width: '100%', borderWidth: 2, borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginBottom: 12 },
  optionText: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  optionSubtext: { fontSize: 12, textAlign: 'center' },
  cancelBtn: { marginTop: 12, paddingVertical: 12 },
  cancelText: { fontSize: 16, fontWeight: 'bold' },
  scanningView: { alignItems: 'center', paddingVertical: 40, width: '100%' },
  scanFrame: { width: 160, height: 160, borderWidth: 2, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 20, position: 'relative' },
  scanLine: { width: 140, height: 3, borderRadius: 2, position: 'absolute' },
  scanningText: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  scanningSubtext: { fontSize: 14, textAlign: 'center' },
  progressContainer: { width: 200, height: 4, borderRadius: 2, marginTop: 16, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 2, width: '60%' },
  recognizedView: { alignItems: 'center', paddingVertical: 30 },
  checkmarkContainer: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  recognizedText: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  recognizedSubtext: { fontSize: 14, textAlign: 'center' },
  resultOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 200, backgroundColor: 'rgba(0,0,0,0.5)' },
  resultCard: { borderRadius: 20, padding: 24, margin: 20, elevation: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10, maxWidth: '90%', maxHeight: '80%' },
  boundingBox: { borderWidth: 3, borderRadius: 16, padding: 20, marginBottom: 16, borderStyle: 'dashed', position: 'relative', alignItems: 'center' },
  confidenceBadge: { position: 'absolute', top: -8, right: -8, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  confidenceText: { fontSize: 10, fontWeight: 'bold' },
  resultTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 4, textAlign: 'center' },
  ghanaianName: { fontSize: 16, fontStyle: 'italic', marginBottom: 4, textAlign: 'center' },
  resultCategory: { fontSize: 14, marginBottom: 8, textAlign: 'center' },
  resultPrice: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  resultDescription: { fontSize: 14, marginBottom: 16, textAlign: 'center', lineHeight: 20 },
  nutritionContainer: { borderRadius: 12, padding: 12, marginBottom: 16, width: '100%' },
  nutritionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  nutritionText: { fontSize: 12, marginBottom: 2 },
  alternativesContainer: { width: '100%', marginBottom: 16 },
  alternativesTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  alternativeItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 8, borderRadius: 8, marginBottom: 4 },
  alternativeName: { fontSize: 12, flex: 1 },
  alternativePrice: { fontSize: 12, fontWeight: 'bold' },
  buttonRow: { flexDirection: 'row', gap: 12, width: '100%', marginTop: 8 },
  resultBtn: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  primaryBtn: { },
  secondaryBtn: { borderWidth: 2 },
  resultBtnText: { fontWeight: 'bold', fontSize: 14 },
});

const chatbotStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modal: { minHeight: 500, maxHeight: '85%', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 12, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
  headerText: { fontWeight: 'bold', fontSize: 18 },
  headerSubtext: { fontSize: 12, marginTop: 2 },
  closeButton: { padding: 4 },
  langRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginVertical: 8, paddingHorizontal: 16 },
  langBtn: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, minWidth: 50, alignItems: 'center' },
  langBtnText: { fontWeight: '600', fontSize: 12 },
  bubble: { alignSelf: 'flex-start', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 10, maxWidth: '85%', elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  userBubble: { alignSelf: 'flex-end' },
  botBubble: { alignSelf: 'flex-start' },
  visualContainer: { marginTop: 8, borderRadius: 12, overflow: 'hidden' },
  mapPreview: { padding: 12, alignItems: 'center', borderRadius: 12, marginTop: 8 },
  productGrid: { flexDirection: 'row', gap: 8, marginTop: 8 },
  productCard: { flex: 1, padding: 8, borderRadius: 8, alignItems: 'center', minHeight: 60 },
  typingIndicator: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  typingDot: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 2 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, gap: 8, borderTopWidth: 1 },
  input: { flex: 1, borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, maxHeight: 100 },
  sendBtn: { borderRadius: 20, padding: 12, minWidth: 44, alignItems: 'center', justifyContent: 'center' },
});


