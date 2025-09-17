import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  ImageStyle,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { useChatbot, Product, CartItem } from '../context/ChatbotContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ChatbotProps {
  isVisible: boolean;
  onClose: () => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ isVisible, onClose }) => {
  const {
    messages,
    currentLanguage,
    sendMessage,
    addToCart,
    cart,
    getCartTotal,
    switchLanguage,
    isTyping,
  } = useChatbot();

  const [inputText, setInputText] = useState('');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const languages = [
    { code: 'english', name: 'English', flag: '🇺🇸' },
    { code: 'twi', name: 'Twi', flag: '🇬🇭' },
    { code: 'ewe', name: 'Ewe', flag: '🇬🇭' },
    { code: 'ga', name: 'Ga', flag: '🇬🇭' },
    { code: 'hausa', name: 'Hausa', flag: '🇳🇬' },
  ];

  useEffect(() => {
    if (isVisible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isVisible, slideAnim]);

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleLanguageSwitch = (languageCode: string) => {
    switchLanguage(languageCode as any);
    setShowLanguageSelector(false);
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant microphone permission to use voice feature.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      // Simulate voice-to-text conversion
      // In a real app, you would use a service like Google Speech-to-Text
      const simulatedText = getVoiceToTextSimulation();
      if (simulatedText) {
        setInputText(simulatedText);
      }

      Alert.alert('Voice Recorded', 'Voice message processed! You can edit the text before sending.');
    } catch (error) {
      console.error('Failed to stop recording', error);
      Alert.alert('Error', 'Failed to process voice recording.');
    }
  };

  const getVoiceToTextSimulation = () => {
    // Simulate voice-to-text based on current language
    const voiceSimulations = {
      english: "I want to buy some fresh vegetables",
      twi: "Me pɛ me tɔ vegetables foforo",
      ewe: "Nye wo pɛe nye wo tɔ vegetables yeyewo",
      ga: "Mi hiɛ mi tɔ vegetables foforo",
      hausa: "Ina son in siyo vegetables masu kyau"
    };
    return voiceSimulations[currentLanguage as keyof typeof voiceSimulations] || "I want to shop for groceries";
  };

  const handleImageUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera/gallery permission to use image feature.');
        return;
      }

      Alert.alert(
        'Select Image',
        'Choose how you want to add an image',
        [
          { text: 'Camera', onPress: () => openCamera() },
          { text: 'Gallery', onPress: () => openGallery() },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } catch (error) {
      console.error('Failed to request permissions', error);
    }
  };

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Failed to open camera', error);
    }
  };

  const openGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Failed to open gallery', error);
    }
  };

  const processImage = (imageUri: string) => {
    // Simulate image recognition
    // In a real app, you would use services like Google Vision API or AWS Rekognition
    const recognizedProducts = [
      'Fresh Organic Carrots',
      'Ripe Red Tomatoes',
      'Fresh Green Spinach'
    ];
    
    const randomProduct = recognizedProducts[Math.floor(Math.random() * recognizedProducts.length)];
    const message = getImageRecognitionMessage(randomProduct);
    
    sendMessage(message);
    Alert.alert('Image Processed', `Found: ${randomProduct}. Check the chat for product suggestions!`);
  };

  const getImageRecognitionMessage = (productName: string) => {
    const messages = {
      english: `I found ${productName} in your image. Please show me similar products.`,
      twi: `Me hu ${productName} wɔ wo mfonini mu. Kyerɛ me products a ɛte sɛ wei.`,
      ewe: `Nye wo kpɔ ${productName} le wo image me. Fia nye wo products si sɔ kple esi.`,
      ga: `Mi yɛ ${productName} wɔ wo image mli. Kyerɛ mi products a ɛte sɛ wei.`,
      hausa: `Na gani ${productName} a hoton ka. Nuna ni products masu kama da wannan.`
    };
    return messages[currentLanguage as keyof typeof messages] || `Found ${productName} in your image. Show me similar products.`;
  };

  const renderMessage = (message: any) => {
    if (message.type === 'product_suggestion' && message.data) {
      return (
        <View style={styles.productSuggestions}>
          <Text style={styles.suggestionTitle}>{message.text}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {message.data.map((product: Product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.productCard}
                onPress={() => addToCart(product)}
              >
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <Text style={styles.productPrice}>
                    {product.currency} {product.price.toFixed(2)}
                  </Text>
                  {product.discount && (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>{product.discount}% OFF</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addToCart(product)}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      );
    }

    if (message.type === 'cart_update') {
      return (
        <View style={[styles.message, message.isUser ? styles.userMessage : styles.botMessage]}>
          <Text style={[styles.messageText, message.isUser ? styles.userMessageText : styles.botMessageText]}>
            {message.text}
          </Text>
          <View style={styles.cartUpdateInfo}>
            <Text style={styles.cartUpdateText}>
              Cart Total: ₵ {getCartTotal().toFixed(2)}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.message, message.isUser ? styles.userMessage : styles.botMessage]}>
        <Text style={[styles.messageText, message.isUser ? styles.userMessageText : styles.botMessageText]}>
          {message.text}
        </Text>
      </View>
    );
  };

  const renderCartSummary = () => {
    if (cart.length === 0) return null;

    return (
      <View style={styles.cartSummary}>
        <Text style={styles.cartSummaryTitle}>Your Cart ({cart.length} items)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {cart.map((item: CartItem) => (
            <View key={item.product.id} style={styles.cartItem}>
              <Image source={{ uri: item.product.image }} style={styles.cartItemImage} />
              <Text style={styles.cartItemName} numberOfLines={1}>
                {item.product.name}
              </Text>
              <Text style={styles.cartItemPrice}>
                ₵ {(item.product.price * item.quantity).toFixed(2)}
              </Text>
              <Text style={styles.cartItemQuantity}>Qty: {item.quantity}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.cartTotal}>
          <Text style={styles.cartTotalText}>Total: ₵ {getCartTotal().toFixed(2)}</Text>
          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.chatbotContainer,
          {
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [screenHeight, 0],
                }),
              },
            ],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.botAvatar}>
              <Ionicons name="chatbubble-ellipses" size={24} color="#51bc7d" />
            </View>
            <View>
              <Text style={styles.botName}>Shopping Assistant</Text>
              <Text style={styles.botStatus}>Online • {languages.find(lang => lang.code === currentLanguage)?.name}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => setShowLanguageSelector(!showLanguageSelector)}
            >
              <Text style={styles.languageButtonText}>
                {languages.find(lang => lang.code === currentLanguage)?.flag} {languages.find(lang => lang.code === currentLanguage)?.name}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Language Selector */}
        {showLanguageSelector && (
          <View style={styles.languageSelector}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageOption,
                    currentLanguage === language.code && styles.languageOptionActive,
                  ]}
                  onPress={() => handleLanguageSwitch(language.code)}
                >
                  <Text style={styles.languageFlag}>{language.flag}</Text>
                  <Text
                    style={[
                      styles.languageName,
                      currentLanguage === language.code && styles.languageNameActive,
                    ]}
                  >
                    {language.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View key={message.id} style={styles.messageWrapper}>
              {renderMessage(message)}
            </View>
          ))}
          {isTyping && (
            <View style={styles.typingIndicator}>
              <View style={styles.typingDots}>
                <View style={[styles.typingDot, styles.typingDot1]} />
                <View style={[styles.typingDot, styles.typingDot2]} />
                <View style={[styles.typingDot, styles.typingDot3]} />
              </View>
              <Text style={styles.typingText}>Bot is typing...</Text>
            </View>
          )}
        </ScrollView>

        {/* Cart Summary */}
        {renderCartSummary()}

        {/* Input Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
        >
          <View style={styles.inputWrapper}>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={handleImageUpload}
            >
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.voiceButton, isRecording && styles.voiceButtonRecording]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Ionicons name={isRecording ? "stop" : "mic"} size={20} color="#fff" />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              placeholder="Type your message..."
              placeholderTextColor="#999"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Ionicons name="send" size={20} color={inputText.trim() ? "#fff" : "#ccc"} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  chatbotContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.9,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  botStatus: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f8f0',
    borderRadius: 16,
  },
  languageButtonText: {
    fontSize: 12,
    color: '#51bc7d',
    fontWeight: '500',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageSelector: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  languageOptionActive: {
    backgroundColor: '#51bc7d',
    borderColor: '#51bc7d',
  },
  languageFlag: {
    fontSize: 16,
    marginRight: 6,
  },
  languageName: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  languageNameActive: {
    color: '#fff',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messageWrapper: {
    marginVertical: 8,
  },
  message: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#51bc7d',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#333',
  },
  productSuggestions: {
    marginVertical: 8,
  },
  suggestionTitle: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 12,
  },
  productCard: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 80,
  } as ImageStyle,
  productInfo: {
    padding: 8,
  },
  productName: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#51bc7d',
    fontWeight: '600',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  discountText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#51bc7d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartUpdateInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  cartUpdateText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  cartSummary: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cartSummaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  cartItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  cartItemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 4,
  } as ImageStyle,
  cartItemName: {
    fontSize: 10,
    color: '#333',
    textAlign: 'center',
    marginBottom: 2,
  },
  cartItemPrice: {
    fontSize: 12,
    color: '#51bc7d',
    fontWeight: '600',
    marginBottom: 2,
  },
  cartItemQuantity: {
    fontSize: 10,
    color: '#666',
  },
  cartTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cartTotalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#51bc7d',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#51bc7d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff6b6b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButtonRecording: {
    backgroundColor: '#ff4757',
    transform: [{ scale: 1.1 }],
  },
  imageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3742fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginVertical: 8,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#999',
    marginHorizontal: 2,
  },
  typingDot1: {
    // animationDelay: '0s', // Not supported in React Native styles
  },
  typingDot2: {
    // animationDelay: '0.2s', // Not supported in React Native styles
  },
  typingDot3: {
    // animationDelay: '0.4s', // Not supported in React Native styles
  },
  typingText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});
