import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  Image, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';
import { useShopperChat } from '../../context/ShopperChatContext';

export default function ShopperChat({ navigation, route }: any) {
  const { colors } = useTheme();
  const { 
    currentSession, 
    sendMessage, 
    sendImage, 
    markAsTyping, 
    markItemAsFound, 
    pickImage, 
    takePhoto,
    updateShoppingItem 
  } = useShopperChat();
  
  const [messageText, setMessageText] = useState('');
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Mock data for demonstration
  const mockSession = {
    id: 'session_1',
    orderId: 'ORD-001',
    customerName: 'Kwame Asante',
    customerPhone: '+233 24 123 4567',
    storeName: 'FreshMart',
    messages: [
      {
        id: 'welcome',
        text: "Hello Kwame! I'm your shopper for FreshMart. I'll help you get your items. Let me know if you have any questions!",
        sender: 'shopper' as const,
        timestamp: new Date(),
        type: 'system' as const,
        orderId: 'ORD-001'
      },
      {
        id: 'customer_1',
        text: "Hi! Thank you. I'm looking for fresh tomatoes and onions. Can you confirm they look good?",
        sender: 'customer' as const,
        timestamp: new Date(),
        type: 'text' as const,
        orderId: 'ORD-001'
      }
    ],
    shoppingList: [
      { id: '1', name: 'Fresh Tomatoes', quantity: 2, unit: 'kg', notes: 'Ripe and red', found: false },
      { id: '2', name: 'Red Onions', quantity: 1, unit: 'kg', notes: 'Medium size', found: false },
      { id: '3', name: 'Bananas', quantity: 1, unit: 'bunch', notes: 'Yellow, not too ripe', found: true },
      { id: '4', name: 'Milk', quantity: 2, unit: 'liters', notes: 'Fresh milk', found: false }
    ],
    status: 'active' as const,
    createdAt: new Date()
  };

  const session = currentSession || mockSession;

  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [session?.messages]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      sendMessage(messageText.trim());
      setMessageText('');
    }
  };

  const handleImageAction = async (action: 'camera' | 'gallery') => {
    setShowImageOptions(false);
    let imageUri: string | null = null;
    
    if (action === 'camera') {
      imageUri = await takePhoto();
    } else {
      imageUri = await pickImage();
    }
    
    if (imageUri) {
      sendImage(imageUri);
    }
  };

  const handleItemFound = async (item: any) => {
    Alert.alert(
      'Item Found',
      `Would you like to take a photo of ${item.name} to confirm with the customer?`,
      [
        { text: 'Skip Photo', onPress: () => markItemAsFound(item.id) },
        { 
          text: 'Take Photo', 
          onPress: async () => {
            const imageUri = await takePhoto();
            if (imageUri) {
              markItemAsFound(item.id, imageUri);
            } else {
              markItemAsFound(item.id);
            }
          }
        }
      ]
    );
  };

  const renderMessage = ({ item }: { item: any }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'shopper' ? styles.shopperMessage : styles.customerMessage
    ]}>
      {item.type === 'image' && item.imageUri && (
        <Image source={{ uri: item.imageUri }} style={styles.messageImage} />
      )}
      <Text style={[
        styles.messageText,
        { color: item.sender === 'shopper' ? colors.onPrimary : colors.onSurface }
      ]}>
        {item.text}
      </Text>
      <Text style={[
        styles.messageTime,
        { color: item.sender === 'shopper' ? colors.onPrimary + '80' : colors.onSurface + '80' }
      ]}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  const renderShoppingItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[
        styles.shoppingItem,
        { 
          backgroundColor: item.found ? colors.primary + '20' : colors.surface,
          borderColor: item.found ? colors.primary : colors.primary + '33'
        }
      ]}
      onPress={() => !item.found && handleItemFound(item)}
    >
      <View style={styles.shoppingItemLeft}>
        <Text style={[styles.shoppingItemName, { color: colors.onSurface }]}>
          {item.name}
        </Text>
        <Text style={[styles.shoppingItemDetails, { color: colors.onSurface + 'CC' }]}>
          {item.quantity} {item.unit}
          {item.notes && ` • ${item.notes}`}
        </Text>
      </View>
      <View style={styles.shoppingItemRight}>
        {item.found ? (
          <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
        ) : (
          <Ionicons name="ellipse-outline" size={24} color={colors.primary + '66'} />
        )}
      </View>
    </TouchableOpacity>
  );

  if (!session) {
    return (
      <Screen style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={64} color={colors.onSurface + '40'} />
          <Text style={[styles.emptyText, { color: colors.onSurface }]}>
            No active chat session
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.onSurface + '66' }]}>
            Start a shopping task to begin chatting with customers
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.primary + '22' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.customerName, { color: colors.onSurface }]}>
            {session.customerName}
          </Text>
          <Text style={[styles.orderInfo, { color: colors.onSurface + '66' }]}>
            {session.storeName} • {session.orderId}
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.shoppingListButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowShoppingList(true)}
        >
          <Ionicons name="list" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={session.messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.primary + '22' }]}
      >
        <View style={styles.inputRow}>
          <TouchableOpacity 
            style={[styles.imageButton, { backgroundColor: colors.primary + '22' }]}
            onPress={() => setShowImageOptions(true)}
          >
            <Ionicons name="camera" size={20} color={colors.primary} />
          </TouchableOpacity>
          
          <TextInput
            style={[styles.textInput, { backgroundColor: colors.background, color: colors.onSurface }]}
            placeholder="Type a message..."
            placeholderTextColor={colors.onSurface + '66'}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity 
            style={[styles.sendButton, { backgroundColor: colors.primary }]}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Image Options Modal */}
      <Modal visible={showImageOptions} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.imageOptionsModal, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.onSurface }]}>Send Photo</Text>
            <View style={styles.imageOptions}>
              <TouchableOpacity 
                style={[styles.imageOption, { backgroundColor: colors.primary + '22' }]}
                onPress={() => handleImageAction('camera')}
              >
                <Ionicons name="camera" size={32} color={colors.primary} />
                <Text style={[styles.imageOptionText, { color: colors.primary }]}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.imageOption, { backgroundColor: colors.primary + '22' }]}
                onPress={() => handleImageAction('gallery')}
              >
                <Ionicons name="images" size={32} color={colors.primary} />
                <Text style={[styles.imageOptionText, { color: colors.primary }]}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={[styles.cancelButton, { backgroundColor: colors.onSurface + '22' }]}
              onPress={() => setShowImageOptions(false)}
            >
              <Text style={[styles.cancelButtonText, { color: colors.onSurface }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Shopping List Modal */}
      <Modal visible={showShoppingList} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.shoppingListModal, { backgroundColor: colors.surface }]}>
            <View style={styles.shoppingListHeader}>
              <Text style={[styles.modalTitle, { color: colors.onSurface }]}>Shopping List</Text>
              <TouchableOpacity onPress={() => setShowShoppingList(false)}>
                <Ionicons name="close" size={24} color={colors.onSurface} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={session.shoppingList}
              keyExtractor={(item) => item.id}
              renderItem={renderShoppingItem}
              style={styles.shoppingList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderInfo: {
    fontSize: 12,
    marginTop: 2,
  },
  shoppingListButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
  },
  shopperMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  customerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F2F2F7',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  inputContainer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  imageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOptionsModal: {
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  imageOptions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  imageOption: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
  },
  imageOptionText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  cancelButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  shoppingListModal: {
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  shoppingListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  shoppingList: {
    maxHeight: 400,
  },
  shoppingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  shoppingItemLeft: {
    flex: 1,
  },
  shoppingItemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  shoppingItemDetails: {
    fontSize: 14,
    marginTop: 4,
  },
  shoppingItemRight: {
    marginLeft: 12,
  },
});




