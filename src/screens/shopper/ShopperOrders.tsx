import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl, Animated, Alert, Modal, ScrollView } from 'react-native';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';
import { useShopperOrders } from '../../context/ShopperOrderContext';

type Order = {
  id: string;
  store: string;
  distanceKm: number;
  payout: number;
  items: number;
  etaMins: number;
};

const SEGMENTS = ['New', 'Active', 'History'] as const;

type Segment = typeof SEGMENTS[number];

export default function ShopperOrders({ navigation }: any) {
  const { colors } = useTheme();
  const { acceptedOrders, updateOrderStatus, addAcceptedOrder } = useShopperOrders();
  const [segment, setSegment] = useState<Segment>('New');
  const [refreshing, setRefreshing] = useState(false);
  const underline = useRef(new Animated.Value(0)).current;
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const initialNew = useMemo<Order[]>(() => ([
    { id: 'o1', store: 'Daily Needs', distanceKm: 1.2, payout: 16.5, items: 5, etaMins: 18 },
    { id: 'o2', store: 'FreshMart', distanceKm: 2.4, payout: 20.0, items: 8, etaMins: 25 },
    { id: 'o3', store: 'GreenGrocer', distanceKm: 0.9, payout: 14.2, items: 3, etaMins: 15 },
    { id: 'o4', store: 'QuickMart', distanceKm: 1.8, payout: 18.0, items: 6, etaMins: 20 },
  ]), []);

  const [newOrders, setNewOrders] = useState<Order[]>(initialNew);
  const [historyOrders, setHistoryOrders] = useState<Order[]>([
    { id: 'oH1', store: 'QuickShop', distanceKm: 3.1, payout: 21.5, items: 7, etaMins: 0 },
    { id: 'oH2', store: 'SuperStore', distanceKm: 2.5, payout: 19.0, items: 4, etaMins: 0 },
    { id: 'oH3', store: 'FreshMarket', distanceKm: 1.9, payout: 15.5, items: 8, etaMins: 0 }
  ]);
  
  // Convert accepted orders to the format expected by the UI
  const activeOrders = useMemo(() => 
    acceptedOrders.map(order => ({
      id: order.id,
      store: order.storeName,
      distanceKm: order.distanceKm,
      payout: order.payout,
      items: order.items,
      etaMins: order.etaMins
    })), [acceptedOrders]
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const switchSegment = (idx: number) => {
    setSegment(SEGMENTS[idx]);
    Animated.timing(underline, { 
      toValue: idx, 
      duration: 300, 
      useNativeDriver: false 
    }).start();
  };

  const acceptOrder = (order: Order) => {
    setNewOrders(prev => prev.filter(o => o.id !== order.id));
    // Add to context instead of local state
    addAcceptedOrder({
      ...order,
      storeName: order.store,
      description: `Order from ${order.store}`,
      bonus: `+₵${order.payout.toFixed(2)}`,
      status: 'Active',
      acceptedAt: new Date().toISOString()
    });
  };

  const declineOrder = (order: Order) => {
    setNewOrders(prev => prev.filter(o => o.id !== order.id));
  };

  const completeOrder = (order: Order) => {
    // Remove from active orders in context
    updateOrderStatus(order.id, 'Completed');
    
    // Add to history
    setHistoryOrders(prev => [{ ...order, etaMins: 0 }, ...prev]);
    
    // Show completion message
    Alert.alert('Order Completed!', `You have successfully delivered order ${order.id}`);
  };

  const handleOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleTaskAction = (action: string) => {
    setShowOrderDetails(false);
    switch (action) {
      case 'chat':
        navigation.navigate('ShopperChat');
        break;
      case 'call':
        Alert.alert('Call', 'Calling customer...');
        break;
      case 'navigate':
        Alert.alert('Navigate', 'Opening navigation to pickup location...');
        break;
    }
  };

  // Order items data (same as in dashboard)
  const orderItems = {
    '#324561324': [
      { name: 'Fresh Bananas', quantity: 2, unit: 'bunch', price: '₵12.00', notes: 'Ripe and yellow' },
      { name: 'Potatoes', quantity: 3, unit: 'kg', price: '₵18.00', notes: 'Fresh from farm' },
      { name: 'Carrots', quantity: 1, unit: 'kg', price: '₵8.00', notes: 'Organic carrots' },
      { name: 'Onions', quantity: 2, unit: 'kg', price: '₵15.00', notes: 'Red onions' }
    ],
    '#894831435': [
      { name: 'Fresh Tomatoes', quantity: 2, unit: 'kg', price: '₵18.00', notes: 'Ripe and red' },
      { name: 'Cooking Oil', quantity: 1, unit: 'bottle', price: '₵25.00', notes: 'Sunflower oil' },
      { name: 'Rice', quantity: 5, unit: 'kg', price: '₵35.00', notes: 'Basmati rice' },
      { name: 'Chicken', quantity: 1, unit: 'kg', price: '₵28.00', notes: 'Fresh whole chicken' },
      { name: 'Bread', quantity: 2, unit: 'loaves', price: '₵12.00', notes: 'White bread' }
    ],
    '#567891234': [
      { name: 'Fresh Milk', quantity: 2, unit: 'liters', price: '₵15.00', notes: 'Whole milk' },
      { name: 'Eggs', quantity: 1, unit: 'tray', price: '₵22.00', notes: 'Free range eggs' },
      { name: 'Butter', quantity: 1, unit: 'pack', price: '₵18.00', notes: 'Salted butter' },
      { name: 'Cheese', quantity: 1, unit: 'block', price: '₵25.00', notes: 'Cheddar cheese' }
    ]
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={[styles.card, { borderColor: colors.primary + '22', backgroundColor: colors.surface }]}> 
      <View style={styles.cardRow}>
        <Text style={[styles.store, { color: '#1f2937' }]}>{item.store}</Text>
        <Text style={[styles.payout, { color: colors.primary }]}>₵{item.payout.toFixed(2)}</Text>
      </View>
      
      <View style={styles.orderDetails}>
        <Text style={[styles.sub, { color: '#6b7280' }]}>
          📍 {item.distanceKm.toFixed(1)} km
        </Text>
        <Text style={[styles.sub, { color: '#6b7280' }]}>
          📦 {item.items} items
        </Text>
        {segment !== 'History' && (
          <Text style={[styles.sub, { color: '#9ca3af' }]}>
            ⏱️ ETA {item.etaMins} mins
          </Text>
        )}
      </View>

      {segment === 'New' && (
        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={() => acceptOrder(item)}>
            <Text style={[styles.btnText, { color: '#ffffff' }]}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#ef4444' }]} onPress={() => declineOrder(item)}>
            <Text style={[styles.btnText, { color: '#ffffff' }]}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
      {segment === 'Active' && (
        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={() => completeOrder(item)}>
            <Text style={[styles.btnText, { color: '#ffffff' }]}>Mark Delivered</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.btn, { backgroundColor: '#f3f4f6' }]}
            onPress={() => handleOrderDetails(item)}
          > 
            <Text style={[styles.btnText, { color: '#1f2937' }]}>Details</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const data = segment === 'New' ? newOrders : segment === 'Active' ? activeOrders : historyOrders;

  return (
    <Screen style={{ flex: 1 }}>
      <View style={styles.segmentContainer}>
        <View style={[styles.segmentRow, { borderColor: colors.primary + '22' }]}>
          {SEGMENTS.map((s, i) => (
            <TouchableOpacity key={s} style={styles.seg} onPress={() => switchSegment(i)}>
              <Text style={[styles.segText, { color: segment === s ? '#ffffff' : '#374151' }]}>{s}</Text>
            </TouchableOpacity>
          ))}
          <Animated.View
            style={[
              styles.underline,
              {
                backgroundColor: colors.primary,
                transform: [{ 
                  translateX: underline.interpolate({ 
                    inputRange: [0, 1, 2], 
                    outputRange: [0, 100, 200] 
                  }) 
                }],
              },
            ]}
          />
        </View>
      </View>

      {/* Tab Header */}
      <View style={[styles.tabHeader, { backgroundColor: colors.background }]}>
        <Text style={[styles.tabHeaderText, { color: '#1f2937' }]}>
          {segment === 'New' ? '🆕 New Delivery Opportunities' : 
           segment === 'Active' ? '🚚 Your Active Deliveries' : 
           '✅ Completed Deliveries'}
        </Text>
        <Text style={[styles.tabHeaderSubtext, { color: '#6b7280' }]}>
          {segment === 'New' ? 'Accept orders to start earning' : 
           segment === 'Active' ? 'Manage your current deliveries' : 
           'View your delivery history'}
        </Text>
      </View>

      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              {segment === 'New' ? '🆕' : segment === 'Active' ? '🚚' : '✅'}
            </Text>
            <Text style={styles.emptyText}>
              {segment === 'New' ? 'No New Orders' : 
               segment === 'Active' ? 'No Active Orders' : 
               'No Completed Orders'}
            </Text>
            <Text style={styles.emptySubtext}>
              {segment === 'New' ? 'Check back later for new delivery opportunities' :
               segment === 'Active' ? 'You have no active deliveries at the moment' :
               'No completed deliveries yet'}
            </Text>
          </View>
        }
      />

      {/* Order Details Modal */}
      <Modal visible={showOrderDetails} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.orderDetailsModal, { backgroundColor: colors.surface }]}>
            <View style={styles.orderDetailsHeader}>
              <Text style={[styles.modalTitle, { color: '#1f2937' }]}>Order Details</Text>
              <TouchableOpacity 
                onPress={() => setShowOrderDetails(false)}
                style={styles.closeButton}
              >
                <Text style={[styles.closeButtonText, { color: '#6b7280' }]}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {selectedOrder && (
              <>
                <View style={styles.orderInfo}>
                  <Text style={[styles.orderId, { color: '#1f2937' }]}>{selectedOrder.store}</Text>
                  <Text style={[styles.orderDescription, { color: '#6b7280' }]}>Order ID: {selectedOrder.id}</Text>
                  <Text style={[styles.orderPayout, { color: colors.primary }]}>₵{selectedOrder.payout.toFixed(2)} payout</Text>
                </View>

                <Text style={[styles.itemsTitle, { color: '#1f2937' }]}>Items to Pick Up:</Text>
                <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
                  {orderItems[selectedOrder.id as keyof typeof orderItems]?.map((item, index) => (
                    <View key={index} style={[styles.itemCard, { backgroundColor: colors.background, borderColor: colors.primary + '22' }]}>
                      <View style={styles.itemLeft}>
                        <Text style={[styles.itemName, { color: '#1f2937' }]}>{item.name}</Text>
                        <Text style={[styles.itemDetails, { color: '#6b7280' }]}>
                          {item.quantity} {item.unit}
                          {item.notes && ` • ${item.notes}`}
                        </Text>
                      </View>
                      <Text style={[styles.itemPrice, { color: colors.primary }]}>{item.price}</Text>
                    </View>
                  ))}
                </ScrollView>

                {/* Task Actions */}
                <Text style={[styles.taskActionsTitle, { color: '#1f2937' }]}>Task Actions</Text>
                <View style={styles.taskActionButtons}>
                  <TouchableOpacity 
                    style={[styles.taskActionButton, { backgroundColor: colors.primary + '22', borderColor: colors.primary + '33' }]}
                    onPress={() => handleTaskAction('chat')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.taskActionEmoji}>💬</Text>
                    <Text style={[styles.taskActionText, { color: colors.primary }]}>Chat</Text>
                    <Text style={[styles.taskActionSubtext, { color: '#6b7280' }]}>Message customer</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.taskActionButton, { backgroundColor: colors.primary + '22', borderColor: colors.primary + '33' }]}
                    onPress={() => handleTaskAction('call')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.taskActionEmoji}>📞</Text>
                    <Text style={[styles.taskActionText, { color: colors.primary }]}>Call</Text>
                    <Text style={[styles.taskActionSubtext, { color: '#6b7280' }]}>Call customer</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.taskActionButton, { backgroundColor: colors.primary + '22', borderColor: colors.primary + '33' }]}
                    onPress={() => handleTaskAction('navigate')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.taskActionEmoji}>🧭</Text>
                    <Text style={[styles.taskActionText, { color: colors.primary }]}>Navigate</Text>
                    <Text style={[styles.taskActionSubtext, { color: '#6b7280' }]}>Get directions</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.orderActions}>
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: colors.primary }]}
                    onPress={() => completeOrder(selectedOrder)}
                  >
                    <Text style={[styles.actionButtonText, { color: '#ffffff' }]}>Mark Delivered</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: '#f3f4f6' }]}
                    onPress={() => setShowOrderDetails(false)}
                  >
                    <Text style={[styles.actionButtonText, { color: '#1f2937' }]}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  segmentContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    width: '100%',
  },
  segmentRow: { 
    flexDirection: 'row', 
    borderWidth: 1, 
    borderRadius: 12, 
    padding: 4, 
    position: 'relative',
    backgroundColor: '#f8f9fa',
    width: '100%',
  },
  seg: { 
    flex: 1, 
    alignItems: 'center', 
    paddingVertical: 12,
    paddingHorizontal: 8,
    zIndex: 2,
  },
  segText: { 
    fontSize: 14, 
    fontWeight: '600',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  underline: { 
    position: 'absolute', 
    height: 40, 
    width: 100, 
    borderRadius: 8, 
    left: 4, 
    top: 4,
    backgroundColor: '#FF9800',
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1,
    zIndex: 1,
  },
  card: { 
    borderWidth: 1, 
    borderRadius: 12, 
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 8,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  store: { 
    fontSize: 16, 
    fontWeight: '700',
    flex: 1,
  },
  payout: { 
    fontSize: 16, 
    fontWeight: '700',
    color: '#FF9800',
  },
  sub: { 
    fontSize: 13, 
    marginTop: 4,
    opacity: 0.7,
  },
  btnRow: { 
    flexDirection: 'row', 
    gap: 12, 
    marginTop: 12,
  },
  btn: { 
    flex: 1, 
    paddingVertical: 12, 
    borderRadius: 8, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  btnText: { 
    fontSize: 13, 
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
  tabHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tabHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  tabHeaderSubtext: {
    fontSize: 14,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderDetailsModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '85%',
    alignItems: 'center',
  },
  orderDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderInfo: {
    width: '100%',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  orderDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  orderPayout: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  itemsList: {
    width: '100%',
    maxHeight: 400,
    marginBottom: 20,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: '#f8f9fa',
    borderColor: '#e9ecef',
  },
  itemLeft: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  taskActionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  taskActionButtons: {
    width: '100%',
    marginBottom: 20,
  },
  taskActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  taskActionEmoji: {
    fontSize: 24,
  },
  taskActionText: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  taskActionSubtext: {
    fontSize: 12,
    fontWeight: '500',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});




