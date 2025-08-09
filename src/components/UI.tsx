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

// Kente-pattern inspired background component
export const KenteAccent: React.FC<{ style?: any }> = ({ style }) => {
  const { colors } = useTheme();
  return (
    <RNView style={[{
      position: 'absolute',
      top: 0,
      right: 0,
      width: 60,
      height: 60,
      overflow: 'hidden'
    }, style]}>
      <RNView style={{
        width: 80,
        height: 4,
        backgroundColor: colors.secondary,
        transform: [{ rotate: '45deg' }],
        position: 'absolute',
        top: 10
      }} />
      <RNView style={{
        width: 80,
        height: 2,
        backgroundColor: colors.primary,
        transform: [{ rotate: '45deg' }],
        position: 'absolute',
        top: 20
      }} />
      <RNView style={{
        width: 80,
        height: 3,
        backgroundColor: colors.error,
        transform: [{ rotate: '45deg' }],
        position: 'absolute',
        top: 30
      }} />
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

const sampleMessages = [
  { from: 'bot', text: 'Hi! How can I help you today?' },
  { from: 'user', text: 'Where is my order?' },
  { from: 'bot', text: 'Your order is on the way! Estimated delivery: 15 min.' },
];

export const ChatbotModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(sampleMessages);
  const [lang, setLang] = useState<'en' | 'tw'>('en');
  const slideAnim = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true, easing: Easing.out(Easing.ease) }).start();
    } else {
      slideAnim.setValue(600);
    }
  }, [visible]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages((msgs) => [...msgs, { from: 'bot', text: lang === 'en' ? 'This is a sample AI response.' : 'Ɛyɛ AI mmuaeɛ a ɛyɛ dɛ.' }]);
    }, 900);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <RNView style={chatbotStyles.overlay}>
        <Animated.View style={[chatbotStyles.modal, { backgroundColor: colors.surface, transform: [{ translateY: slideAnim }] }]}> 
          <RNView style={chatbotStyles.header}>
            <RNText style={[chatbotStyles.headerText, { color: colors.primary }]}>QuickMart Assistant</RNText>
            <TouchableOpacity onPress={onClose}><RNText style={{ fontSize: 22, color: colors.primary }}>×</RNText></TouchableOpacity>
          </RNView>
          <RNView style={chatbotStyles.langRow}>
            <TouchableOpacity style={[chatbotStyles.langBtn, lang === 'en' && chatbotStyles.langBtnActive]} onPress={() => setLang('en')}><RNText style={chatbotStyles.langBtnText}>EN</RNText></TouchableOpacity>
            <TouchableOpacity style={[chatbotStyles.langBtn, lang === 'tw' && chatbotStyles.langBtnActive]} onPress={() => setLang('tw')}><RNText style={chatbotStyles.langBtnText}>TWI</RNText></TouchableOpacity>
          </RNView>
          <FlatList
            data={messages}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <RNView style={[chatbotStyles.bubble, item.from === 'user' ? chatbotStyles.userBubble : chatbotStyles.botBubble, { backgroundColor: item.from === 'user' ? colors.primary : '#eee' }]}> 
                <RNText style={{ color: item.from === 'user' ? 'white' : colors.onBackground }}>{item.text}</RNText>
              </RNView>
            )}
            contentContainerStyle={{ padding: 12, gap: 8 }}
            style={{ flex: 1 }}
            inverted
          />
          <RNView style={chatbotStyles.inputRow}>
            <TextInput
              style={[chatbotStyles.input, { color: colors.onBackground, backgroundColor: colors.surface, borderColor: colors.primary + '33' }]}
              placeholder={lang === 'en' ? 'Type your message...' : 'Kyerɛ wo asɛm...' }
              value={input}
              onChangeText={setInput}
              onSubmitEditing={sendMessage}
              placeholderTextColor={colors.onBackground + '77'}
            />
            <TouchableOpacity style={[chatbotStyles.sendBtn, { backgroundColor: colors.primary }]} onPress={sendMessage}>
              <RNText style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>→</RNText>
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

export const ImageScanModal: React.FC<{ visible: boolean; onClose: () => void; onRecognized: (result: any) => void }> = ({ visible, onClose, onRecognized }) => {
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

  const startScanning = (source: 'camera' | 'gallery') => {
    setScanning(true);
    // Animate scanning effect
    Animated.loop(
      Animated.timing(scanAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
    ).start();

    // Mock recognition after 2 seconds
    setTimeout(() => {
      scanAnim.stopAnimation();
      setScanning(false);
      setRecognized(true);
      
      // Mock recognition result
      const mockResult = {
        product: 'Fresh Bananas',
        confidence: 0.95,
        category: 'Fruits',
        price: 'GHS 8.50'
      };
      
      setTimeout(() => {
        onRecognized(mockResult);
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <RNView style={imageStyles.overlay}>
        <Animated.View style={[imageStyles.scanModal, { backgroundColor: colors.surface, transform: [{ translateY: slideAnim }] }]}>
          {!scanning && !recognized && (
            <>
              <RNText style={[imageStyles.modalTitle, { color: colors.onSurface }]}>Scan Product</RNText>
              <RNText style={[imageStyles.modalSubtitle, { color: colors.onSurface + '88' }]}>Choose how to identify the product</RNText>
              
              <TouchableOpacity style={[imageStyles.optionBtn, { borderColor: colors.primary }]} onPress={() => startScanning('camera')}>
                <RNText style={{ fontSize: 24, marginBottom: 4 }}>📷</RNText>
                <RNText style={[imageStyles.optionText, { color: colors.onSurface }]}>Take Photo</RNText>
              </TouchableOpacity>
              
              <TouchableOpacity style={[imageStyles.optionBtn, { borderColor: colors.primary }]} onPress={() => startScanning('gallery')}>
                <RNText style={{ fontSize: 24, marginBottom: 4 }}>🖼️</RNText>
                <RNText style={[imageStyles.optionText, { color: colors.onSurface }]}>Choose from Gallery</RNText>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={onClose} style={imageStyles.cancelBtn}>
                <RNText style={[imageStyles.cancelText, { color: colors.primary }]}>Cancel</RNText>
              </TouchableOpacity>
            </>
          )}
          
          {scanning && (
            <RNView style={imageStyles.scanningView}>
              <Animated.View style={[imageStyles.scanLine, { transform: [{ translateY: scanAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 100] }) }] }]} />
              <RNText style={[imageStyles.scanningText, { color: colors.primary }]}>Scanning product...</RNText>
              <RNText style={[imageStyles.scanningSubtext, { color: colors.onSurface + '88' }]}>Please hold steady</RNText>
            </RNView>
          )}
          
          {recognized && (
            <RNView style={imageStyles.recognizedView}>
              <RNText style={{ fontSize: 48, color: colors.primary }}>✓</RNText>
              <RNText style={[imageStyles.recognizedText, { color: colors.primary }]}>Product Recognized!</RNText>
              <RNText style={[imageStyles.recognizedSubtext, { color: colors.onSurface + '88' }]}>Adding to your selection...</RNText>
            </RNView>
          )}
        </Animated.View>
      </RNView>
    </Modal>
  );
};

export const ImageRecognitionResult: React.FC<{ result: any; visible: boolean; onClose: () => void }> = ({ result, visible, onClose }) => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[imageStyles.resultOverlay, { opacity: fadeAnim }]}>
      <RNView style={[imageStyles.resultCard, { backgroundColor: colors.surface }]}>
        <RNView style={[imageStyles.boundingBox, { borderColor: colors.primary }]}>
          <RNText style={{ fontSize: 32 }}>🍌</RNText>
        </RNView>
        <RNText style={[imageStyles.resultTitle, { color: colors.onSurface }]}>{result?.product}</RNText>
        <RNText style={[imageStyles.resultPrice, { color: colors.primary }]}>{result?.price}</RNText>
        <RNText style={[imageStyles.resultConfidence, { color: colors.onSurface + '88' }]}>
          {Math.round((result?.confidence || 0) * 100)}% confidence
        </RNText>
        <TouchableOpacity style={[imageStyles.resultBtn, { backgroundColor: colors.primary }]} onPress={onClose}>
          <RNText style={imageStyles.resultBtnText}>Add to Cart</RNText>
        </TouchableOpacity>
      </RNView>
    </Animated.View>
  );
};

const imageStyles = StyleSheet.create({
  uploadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8, gap: 6 },
  uploadBtnText: { fontSize: 14, fontWeight: 'bold' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  scanModal: { width: 300, borderRadius: 20, padding: 24, alignItems: 'center', elevation: 8 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  modalSubtitle: { fontSize: 14, marginBottom: 20, textAlign: 'center' },
  optionBtn: { width: 200, borderWidth: 2, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  optionText: { fontSize: 16, fontWeight: 'bold' },
  cancelBtn: { marginTop: 8, paddingVertical: 8 },
  cancelText: { fontSize: 16, fontWeight: 'bold' },
  scanningView: { alignItems: 'center', paddingVertical: 40, position: 'relative' },
  scanLine: { width: 200, height: 2, backgroundColor: '#2E7D32', position: 'absolute', top: 20 },
  scanningText: { fontSize: 18, fontWeight: 'bold', marginTop: 40 },
  scanningSubtext: { fontSize: 14, marginTop: 4 },
  recognizedView: { alignItems: 'center', paddingVertical: 20 },
  recognizedText: { fontSize: 18, fontWeight: 'bold', marginTop: 8 },
  recognizedSubtext: { fontSize: 14, marginTop: 4 },
  resultOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 200 },
  resultCard: { borderRadius: 20, padding: 20, alignItems: 'center', elevation: 8, margin: 20 },
  boundingBox: { borderWidth: 3, borderRadius: 12, padding: 16, marginBottom: 12, borderStyle: 'dashed' },
  resultTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  resultPrice: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  resultConfidence: { fontSize: 12, marginBottom: 16 },
  resultBtn: { borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10 },
  resultBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

const chatbotStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'flex-end' },
  modal: { minHeight: 420, maxHeight: 600, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 12, elevation: 8 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  headerText: { fontWeight: 'bold', fontSize: 18 },
  langRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 4, marginBottom: 2 },
  langBtn: { backgroundColor: '#eee', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 4, marginHorizontal: 2 },
  langBtnActive: { backgroundColor: '#2E7D32' },
  langBtnText: { color: '#222', fontWeight: 'bold' },
  bubble: { alignSelf: 'flex-start', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 8, maxWidth: '80%' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#2E7D32' },
  botBubble: { alignSelf: 'flex-start', backgroundColor: '#eee' },
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8 },
  input: { flex: 1, borderWidth: 1, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 8, fontSize: 16 },
  sendBtn: { borderRadius: 16, padding: 10, marginLeft: 2 },
});


