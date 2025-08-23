import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Animated, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOrders } from '../../context/OrderContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'shopper';
  timestamp: Date;
}

export default function OrderTracking({ route, navigation }: any) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { getOrder } = useOrders();
  const order = getOrder(route.params?.id);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const riderProgress = useRef(new Animated.Value(0)).current;
  const riderAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showChat, setShowChat] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hi! I\'m your delivery partner. I\'ll be picking up your order from Daily Needs Super Shop & Market.',
      sender: 'shopper',
      timestamp: new Date(Date.now() - 300000) // 5 minutes ago
    }
  ]);

  useEffect(() => {
    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Start pulse animation for active locations
    if (order?.status === 'on_the_way' || order?.status === 'preparing') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Start rider animation along mocked route
      riderAnimationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(riderProgress, {
            toValue: 1,
            duration: 20000,
            useNativeDriver: true,
          }),
          Animated.timing(riderProgress, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
      riderAnimationRef.current.start();
    }

    return () => {
      clearInterval(interval);
      riderAnimationRef.current?.stop();
    };
  }, [order?.status]);

  if (!order) {
    return (
      <Screen style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.onBackground }]}>
            Order not found
          </Text>
        </View>
      </Screen>
    );
  }

  // Width of the mocked route area (left/right padding = 60 as in styles.routeContainer)
  const routeWidth = screenWidth - 120;
  const riderTranslateX = riderProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(0, routeWidth - 32)], // 32 = marker size
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#3b82f6';
      case 'preparing': return '#8b5cf6';
      case 'on_the_way': return '#10b981';
      case 'delivered': return '#059669';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Order Accepted';
      case 'confirmed': return 'Order Confirmed';
      case 'preparing': return 'Preparing Order';
      case 'on_the_way': return 'On the Way';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'pending': return 'Your order has been accepted and is being processed';
      case 'confirmed': return 'Your order has been confirmed and will be prepared soon';
      case 'preparing': return 'Your order is being prepared at the store';
      case 'on_the_way': return 'Your order is on its way to you';
      case 'delivered': return 'Your order has been delivered successfully';
      case 'cancelled': return 'Your order has been cancelled';
      default: return 'Order status unknown';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '📋';
      case 'confirmed': return '✅';
      case 'preparing': return '⚙️';
      case 'on_the_way': return '🚚';
      case 'delivered': return '📦';
      case 'cancelled': return '❌';
      default: return '❓';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getItemCount = (items: any[]) => {
    return items.reduce((sum, item) => sum + item.qty, 0);
  };

  const getEstimatedTime = () => {
    const now = currentTime;
    const estimatedTime = new Date(now.getTime() + 25 * 60000); // 25 minutes from now
    return estimatedTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleCallRider = () => {
    // In a real app, this would initiate a phone call
    console.log('Calling rider...');
  };

  const handleTextRider = () => {
    setShowChat(true);
  };

  const sendMessage = () => {
    if (messageText.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: messageText.trim(),
        sender: 'user',
        timestamp: new Date()
      };
      setChatMessages([...chatMessages, newMessage]);
      setMessageText('');
      
      // In a real app, this would send the message to the actual shopper
      // and receive real-time responses through a messaging service
      console.log('Sending message to shopper:', messageText.trim());
    }
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Screen style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Custom Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.primary }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Tracking</Text>
        <View style={styles.backButton} />
      </View>

      {/* Map Section */}
      <View style={styles.mapContainer}>
        {/* Map Background */}
        <View style={styles.mapBackground}>
          {/* Street Grid */}
          <View style={styles.streetGrid}>
            <View style={styles.street} />
            <View style={styles.street} />
            <View style={styles.street} />
            <View style={[styles.street, { width: '60%' }]} />
          </View>

          {/* Delivery Route */}
          <View style={styles.routeContainer}>
            <View style={styles.routeLine} />
          </View>

          {/* Rider moving along mocked route (no Google Maps needed) */}
          <Animated.View
            style={[
              styles.riderMarker,
              { top: 100 - 16, left: 60, transform: [{ translateX: riderTranslateX }] },
            ]}
          >
            <View style={[styles.locationIcon, { backgroundColor: colors.primary }]}> 
              <Text style={styles.locationIconText}>🚚</Text>
            </View>
          </Animated.View>

          {/* Pickup Location */}
          <View style={[styles.locationMarker, styles.pickupLocation]}>
            <Animated.View 
              style={[
                styles.pulseCircle,
                { 
                  backgroundColor: colors.primary + '20',
                  transform: [{ scale: pulseAnim }]
                }
              ]} 
            />
            <View style={[styles.locationIcon, { backgroundColor: colors.primary }]}>
              <Text style={styles.locationIconText}>⚙️</Text>
            </View>
            <View style={styles.locationLabel}>
              <Text style={styles.locationLabelText}>Daily Needs Super Shop & Market</Text>
            </View>
          </View>

          {/* Delivery Location */}
          <View style={[styles.locationMarker, styles.deliveryLocation]}>
            <Animated.View 
              style={[
                styles.pulseCircle,
                { 
                  backgroundColor: colors.primary + '20',
                  transform: [{ scale: pulseAnim }]
                }
              ]} 
            />
            <View style={[styles.locationIcon, { backgroundColor: colors.primary }]}>
              <Text style={styles.locationIconText}>📍</Text>
            </View>
            <View style={styles.locationLabel}>
              <Text style={styles.locationLabelText}>House 10, Road 5, Block J, Baridhara</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Order Status Card */}
      <View style={[styles.statusCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.statusTitle, { color: colors.onBackground }]}>
          {order.status === 'preparing' ? 'Picking up your order' : getStatusText(order.status)}
        </Text>
        
        <Text style={[styles.estimatedTime, { color: colors.onSurface + 'CC' }]}>
          Estimated arriving at: {getEstimatedTime()}-{getEstimatedTime()}
        </Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressStep, styles.completedStep]}>
              <View style={[styles.stepCircle, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepCheckmark}>✓</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.primary }]}>Accepted</Text>
            </View>
            
            <View style={[styles.progressLine, { backgroundColor: colors.primary }]} />
            
            <View style={[styles.progressStep, order.status === 'preparing' || order.status === 'on_the_way' || order.status === 'delivered' ? styles.activeStep : styles.pendingStep]}>
              <View style={[
                styles.stepCircle, 
                { 
                  backgroundColor: order.status === 'preparing' || order.status === 'on_the_way' || order.status === 'delivered' ? colors.primary : '#d1d5db'
                }
              ]}>
                {order.status === 'preparing' || order.status === 'on_the_way' || order.status === 'delivered' && (
                  <Text style={styles.stepCheckmark}>✓</Text>
                )}
              </View>
              <Text style={[
                styles.stepText, 
                { 
                  color: order.status === 'preparing' || order.status === 'on_the_way' || order.status === 'delivered' ? colors.primary : '#9ca3af'
                }
              ]}>Pickup</Text>
            </View>
            
            <View style={[styles.progressLine, { backgroundColor: order.status === 'delivered' ? colors.primary : '#d1d5db' }]} />
            
            <View style={[styles.progressStep, order.status === 'delivered' ? styles.activeStep : styles.pendingStep]}>
              <View style={[
                styles.stepCircle, 
                { 
                  backgroundColor: order.status === 'delivered' ? colors.primary : '#d1d5db'
                }
              ]}>
                {order.status === 'delivered' && (
                  <Text style={styles.stepCheckmark}>✓</Text>
                )}
              </View>
              <Text style={[
                styles.stepText, 
                { 
                  color: order.status === 'delivered' ? colors.primary : '#9ca3af'
                }
              ]}>Delivered</Text>
            </View>
          </View>
        </View>

        {/* Store Contact Section */}
        <View style={styles.storeSection}>
          <View style={styles.storeInfo}>
            <View style={styles.storeImage}>
              <Text style={styles.storeImageText}>🛒</Text>
            </View>
            <View style={styles.storeDetails}>
              <Text style={[styles.storeName, { color: colors.onBackground }]}>Daily Needs Su...</Text>
              <Text style={[styles.storeSubtitle, { color: colors.onSurface + 'CC' }]}>Super Shop</Text>
            </View>
          </View>
          
          <View style={styles.contactButtons}>
            <TouchableOpacity 
              style={[styles.contactButton, { backgroundColor: colors.primary }]}
              onPress={handleTextRider}
            >
              <Text style={styles.contactButtonText}>💬</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.contactButton, { backgroundColor: colors.primary }]}
              onPress={handleCallRider}
            >
              <Text style={styles.contactButtonText}>📞</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Chat Modal */}
      <Modal
        visible={showChat}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <KeyboardAvoidingView 
          style={[styles.chatContainer, { backgroundColor: colors.background }]}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Chat Header */}
          <View style={[styles.chatHeader, { paddingTop: insets.top + 10, backgroundColor: colors.primary }]}>
            <TouchableOpacity style={styles.chatBackButton} onPress={() => setShowChat(false)}>
              <Text style={styles.chatBackButtonText}>←</Text>
            </TouchableOpacity>
            <View style={styles.chatHeaderInfo}>
              <Text style={styles.chatHeaderTitle}>Chat with Shopper</Text>
              <Text style={styles.chatHeaderSubtitle}>Order #{order.orderNumber}</Text>
            </View>
            <View style={styles.chatBackButton} />
          </View>

          {/* Chat Messages */}
          <ScrollView 
            style={styles.chatMessages}
            contentContainerStyle={styles.chatMessagesContent}
            showsVerticalScrollIndicator={false}
          >
            {chatMessages.map((message) => (
              <View 
                key={message.id} 
                style={[
                  styles.messageContainer,
                  message.sender === 'user' ? styles.userMessage : styles.shopperMessage
                ]}
              >
                <View style={[
                  styles.messageBubble,
                  message.sender === 'user' 
                    ? { backgroundColor: colors.primary } 
                    : { backgroundColor: colors.surface }
                ]}>
                  <Text style={[
                    styles.messageText,
                    { color: message.sender === 'user' ? colors.onPrimary : colors.onBackground }
                  ]}>
                    {message.text}
                  </Text>
                  <Text style={[
                    styles.messageTime,
                    { color: message.sender === 'user' ? colors.onPrimary + 'CC' : colors.onSurface + 'CC' }
                  ]}>
                    {formatMessageTime(message.timestamp)}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Message Input */}
          <View style={[styles.messageInputContainer, { backgroundColor: colors.surface, paddingBottom: insets.bottom + 10 }]}>
            <View style={[styles.messageInputWrapper, { backgroundColor: colors.background }]}>
              <TextInput
                style={[styles.messageInput, { color: colors.onBackground }]}
                placeholder="Type a message..."
                placeholderTextColor={colors.onSurface + '66'}
                value={messageText}
                onChangeText={setMessageText}
                multiline
                maxLength={500}
              />
              <TouchableOpacity 
                style={[
                  styles.sendButton, 
                  { 
                    backgroundColor: messageText.trim() ? colors.primary : colors.onSurface + '33'
                  }
                ]}
                onPress={sendMessage}
                disabled={!messageText.trim()}
              >
                <Text style={[
                  styles.sendButtonText, 
                  { color: messageText.trim() ? colors.onPrimary : colors.onSurface + '66' }
                ]}>
                  Send
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  mapBackground: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#f1f5f9',
  },
  streetGrid: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    bottom: 50,
    justifyContent: 'space-between',
  },
  street: {
    height: 2,
    backgroundColor: '#cbd5e1',
    borderRadius: 1,
  },
  routeContainer: {
    position: 'absolute',
    top: 100,
    left: 60,
    right: 60,
    bottom: 100,
  },
  routeLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 3,
    borderTopColor: '#10b981',
    borderStyle: 'dashed',
  },
  riderMarker: {
    position: 'absolute',
    width: 32,
    height: 32,
  },
  locationMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  pickupLocation: {
    top: 80,
    right: 40,
  },
  deliveryLocation: {
    bottom: 80,
    left: 40,
  },
  pulseCircle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  locationIconText: {
    fontSize: 20,
  },
  locationLabel: {
    position: 'absolute',
    top: 50,
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    maxWidth: 120,
  },
  locationLabelText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  statusCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  estimatedTime: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  completedStep: {
    // Already styled
  },
  activeStep: {
    // Already styled
  },
  pendingStep: {
    // Already styled
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepCheckmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressLine: {
    height: 2,
    flex: 1,
    marginHorizontal: 8,
  },
  storeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  storeImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  storeImageText: {
    fontSize: 24,
  },
  storeDetails: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  storeSubtitle: {
    fontSize: 14,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactButtonText: {
    fontSize: 18,
  },
  // Chat Modal Styles
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  chatBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBackButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
  },
  chatHeaderInfo: {
    flex: 1,
    alignItems: 'center',
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
  },
  chatHeaderSubtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
  },
  chatMessages: {
    flex: 1,
  },
  chatMessagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  shopperMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  messageInputContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  messageInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginLeft: 8,
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});


