import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Animated, ScrollView, TextInput, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';
import { useShopperOrders } from '../../context/ShopperOrderContext';

export default function ShopperDashboard({ navigation }: any) {
  const { colors } = useTheme();
  const { addAcceptedOrder } = useShopperOrders();
  const [isOnline, setIsOnline] = useState(false);
  const bannerHeight = useRef(new Animated.Value(0)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslate = useRef(new Animated.Value(16)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;
  const tickerOpacity = useRef(new Animated.Value(0)).current;
  const [tickerIndex, setTickerIndex] = useState(0);
  const vehicleOpacity = useRef(new Animated.Value(1)).current;
  const [vehicleIndex, setVehicleIndex] = useState(0); // 0: bike, 1: car, 2: walking
  const [locationText, setLocationText] = useState('Spintex Rd, Accra');
  const [todayEarnings] = useState('₵120.50');
  const [showLocationEdit, setShowLocationEdit] = useState(false);
  const [tempLocation, setTempLocation] = useState(locationText);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [hotDeals, setHotDeals] = useState([
    { id: '#324561324', description: 'Fresh produce delivery', bonus: '+₵25', status: 'High Priority', statusColor: '#8B5CF6', storeName: 'Kwame Fresh Store', expectedTime: '30 mins', urgency: 1 },
    { id: '#894831435', description: 'Grocery essentials', bonus: '+₵18', status: 'Peak Hours', statusColor: '#10B981', storeName: 'Kwame Fresh Store', expectedTime: '20 mins', urgency: 0 },
    { id: '#567891234', description: 'Dairy products delivery', bonus: '+₵35', status: 'Urgent', statusColor: '#EF4444', storeName: 'Kwame Fresh Store', expectedTime: '20 mins', urgency: 2 }
  ]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroOpacity, { toValue: 1, duration: 600, useNativeDriver: true, delay: 150 }),
      Animated.timing(heroTranslate, { toValue: 0, duration: 600, useNativeDriver: true, delay: 150 }),
    ]).start();

    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(tickerOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
        Animated.timing(tickerOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
      ]).start();
      setTickerIndex((i) => (i + 1) % 4);
    }, 2600);
    Animated.timing(tickerOpacity, { toValue: 1, duration: 600, useNativeDriver: true, delay: 500 }).start();

    const vehicleTimer = setInterval(() => {
      Animated.timing(vehicleOpacity, { toValue: 0, duration: 600, useNativeDriver: true }).start(({ finished }) => {
        if (finished) {
          setVehicleIndex((i) => (i + 1) % 3);
          Animated.timing(vehicleOpacity, { toValue: 1, duration: 800, useNativeDriver: true }).start();
        }
      });
    }, 6000);

    return () => { clearInterval(interval); clearInterval(vehicleTimer); };
  }, []);

  const handleLocationPress = () => {
    setShowLocationEdit(true);
    setTempLocation(locationText);
  };

  const handleLocationSave = () => {
    if (tempLocation.trim()) {
      setLocationText(tempLocation.trim());
      setShowLocationEdit(false);
    } else {
      Alert.alert('Invalid Location', 'Please enter a valid location');
    }
  };

  const handleLocationCancel = () => {
    setTempLocation(locationText);
    setShowLocationEdit(false);
  };

  const handleProfilePress = () => {
    Alert.alert('Profile', 'Profile settings will be available soon');
  };

  const handleNotificationPress = () => {
    Alert.alert('Notifications', 'You have 3 new notifications');
  };


  const handleOrderPress = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleAcceptOrder = (order: any) => {
    // Remove from hot deals
    setHotDeals(prev => prev.filter(deal => deal.id !== order.id));
    
    // Add to accepted orders using context
    addAcceptedOrder({
      ...order,
      status: 'Active',
      acceptedAt: new Date().toISOString(),
      payout: parseFloat(order.bonus.replace('+₵', '')),
      distanceKm: 1.5, // Default distance
      items: orderItems[order.id as keyof typeof orderItems]?.length || 0,
      etaMins: parseInt(order.expectedTime.replace(' mins', ''))
    });
    
    // Close modal
    setShowOrderDetails(false);
    
    // Navigate to orders page
    navigation.navigate('Orders');
    
    // Show success message
    Alert.alert('Order Accepted!', `You have accepted order from ${order.storeName}. Check your active orders.`);
  };

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

  useEffect(() => {
    Animated.timing(bannerHeight, {
      toValue: isOnline ? 52 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isOnline]);

  return (
    <Screen style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
      {/* Delivery status card moved into hero below */}
      <Animated.View style={[styles.banner, { backgroundColor: isOnline ? '#DCFCE7' : '#F3F4F6', height: bannerHeight }]}> 
        {isOnline && <Text style={[styles.bannerText, { color: '#065F46' }]}>You are Online</Text>}
      </Animated.View>

      {/* Hero Card with location, profile, notifications */}
      <Animated.View style={{ opacity: heroOpacity, transform: [{ translateY: heroTranslate }] }}>
        <LinearGradient colors={[colors.primary + '1A', '#FFFFFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.hero, { borderColor: colors.primary + '33' }]}> 
          {/* Header row inside hero */}
          <View style={styles.heroHeader}>
            <TouchableOpacity onPress={handleLocationPress} style={styles.locationContainer}>
              <Text style={[styles.locationText, { color: colors.onSurface }]}>📍 {locationText}</Text>
            </TouchableOpacity>
            <View style={styles.topRight}>
              <TouchableOpacity onPress={handleProfilePress} style={[styles.avatar, { backgroundColor: colors.surface, borderColor: colors.primary + '22' }]}>
                <Text style={{ fontSize: 14, color: colors.onSurface }}>👤</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNotificationPress}>
                <Text style={[styles.bell, { color: colors.onSurface }]}>🔔</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.heroContent}>
            <View style={styles.heroLeft}>
              <Text style={[styles.heroTitle, { color: colors.onBackground }]}>Deliver. Earn. Grow.</Text>
              <Animated.Text style={[styles.ticker, { color: colors.onSurface + 'CC', opacity: tickerOpacity }]}>
                {['Earn weekly payouts', 'Flexible shifts', '24/7 support', 'Secure payments'][tickerIndex]}
              </Animated.Text>
              <View style={styles.inlineStatusRow}>
                <Text style={[styles.statusTitle, { color: colors.onSurface }]}>Open to delivery</Text>
                <View style={styles.switchRow}>
                  <Text style={[styles.switchLabel, { color: colors.onSurface }]}>{isOnline ? 'Online' : 'Offline'}</Text>
                  <Switch value={isOnline} onValueChange={setIsOnline} thumbColor={'#fff'} trackColor={{ false: '#d1d5db', true: colors.primary }} />
                </View>
              </View>
              <View style={{ marginTop: 10 }}>
                <Text style={[styles.earningsLabel, { color: colors.onSurface + 'CC' }]}>Today's Earnings</Text>
                <Text style={[styles.earningsAmount, { color: colors.primary }]}>{todayEarnings}</Text>
              </View>
            </View>
          </View>
          
          {/* Vehicle positioned at bottom right */}
          <View style={styles.vehicleContainer}>
            <Animated.Text style={[styles.heroEmoji, { opacity: vehicleOpacity }]}>
              {vehicleIndex === 0 ? '🛵' : vehicleIndex === 1 ? '🚗' : '🚶‍♂️'}
            </Animated.Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Location Edit Modal */}
      <Modal visible={showLocationEdit} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.onSurface }]}>Update Location</Text>
            <TextInput
              style={[styles.modalInput, { borderColor: colors.primary + '33', color: colors.onSurface }]}
              value={tempLocation}
              onChangeText={setTempLocation}
              placeholder="Enter your location"
              placeholderTextColor={colors.onSurface + '66'}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleLocationCancel} style={[styles.modalButton, { backgroundColor: colors.onSurface + '22' }]}>
                <Text style={[styles.modalButtonText, { color: colors.onSurface }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLocationSave} style={[styles.modalButton, { backgroundColor: colors.primary }]}>
                <Text style={[styles.modalButtonText, { color: 'white' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>



      {/* Hot Deals Section */}
      <Text style={[styles.sectionTitle, { color: colors.onBackground, marginTop: 16 }]}>🔥 Hot Deals</Text>
      <View style={styles.hotDealsContainer}>
        {hotDeals.map((deal) => (
          <HotDealCard 
            key={deal.id}
            orderId={deal.id}
            description={deal.description}
            bonus={deal.bonus}
            status={deal.status}
            statusColor={deal.statusColor}
            storeName={deal.storeName}
            expectedTime={deal.expectedTime}
            urgency={deal.urgency}
            colors={colors}
            onPress={() => handleOrderPress(deal)}
          />
        ))}
      </View>


      {/* Order Details Modal */}
      <Modal visible={showOrderDetails} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.orderDetailsModal, { backgroundColor: colors.surface }]}>
            <View style={styles.orderDetailsHeader}>
              <Text style={[styles.modalTitle, { color: colors.onSurface }]}>Order Details</Text>
              <TouchableOpacity 
                onPress={() => setShowOrderDetails(false)}
                style={styles.closeButton}
              >
                <Text style={[styles.closeButtonText, { color: colors.onSurface }]}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedOrder && (
              <>
                <View style={styles.orderInfo}>
                  <Text style={[styles.orderId, { color: colors.onBackground }]}>{selectedOrder.storeName}</Text>
                  <Text style={[styles.orderDescription, { color: colors.onSurface + 'CC' }]}>{selectedOrder.description}</Text>
                  <Text style={[styles.orderId, { color: colors.onSurface + 'CC', fontSize: 14, marginTop: 4 }]}>Order ID: {selectedOrder.id}</Text>
                  <Text style={[styles.orderBonus, { color: colors.primary }]}>{selectedOrder.bonus} bonus</Text>
                </View>

                <Text style={[styles.itemsTitle, { color: colors.onBackground }]}>Items to Pick Up:</Text>
                <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
                  {orderItems[selectedOrder.id as keyof typeof orderItems]?.map((item, index) => (
                    <View key={index} style={[styles.itemCard, { backgroundColor: colors.background, borderColor: colors.primary + '22' }]}>
                      <View style={styles.itemLeft}>
                        <Text style={[styles.itemName, { color: colors.onBackground }]}>{item.name}</Text>
                        <Text style={[styles.itemDetails, { color: colors.onSurface + 'CC' }]}>
                          {item.quantity} {item.unit}
                          {item.notes && ` • ${item.notes}`}
                        </Text>
                      </View>
                      <Text style={[styles.itemPrice, { color: colors.primary }]}>{item.price}</Text>
                    </View>
                  ))}
                </ScrollView>

                <View style={styles.orderActions}>
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: colors.primary }]}
                    onPress={() => handleAcceptOrder(selectedOrder)}
                  >
                    <Text style={[styles.actionButtonText, { color: 'white' }]}>Accept Order</Text>
                  </TouchableOpacity>
            <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: colors.onSurface + '22' }]}
                    onPress={() => setShowOrderDetails(false)}
            >
                    <Text style={[styles.actionButtonText, { color: colors.onSurface }]}>Cancel</Text>
            </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      </ScrollView>
    </Screen>
  );
}


function HotDealCard({ 
  orderId, 
  description, 
  bonus, 
  status, 
  statusColor, 
  storeName, 
  expectedTime, 
  urgency, 
  colors,
  onPress
}: { 
  orderId: string; 
  description: string; 
  bonus: string; 
  status: string; 
  statusColor: string; 
  storeName: string; 
  expectedTime: string; 
  urgency: number; 
  colors: any;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity 
      style={[styles.hotDealCard, { backgroundColor: colors.surface, borderColor: colors.primary + '22' }]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      {/* Header Section */}
      <View style={styles.hotDealHeader}>
        <View style={styles.hotDealLeft}>
          <Text style={styles.hotDealIcon}>📦</Text>
          <View style={styles.hotDealInfo}>
            <Text style={[styles.hotDealOrderId, { color: colors.onBackground }]}>{orderId}</Text>
            <Text style={[styles.hotDealDescription, { color: colors.onSurface + 'CC' }]}>{description}</Text>
          </View>
        </View>
        <View style={[styles.hotDealStatus, { backgroundColor: statusColor }]}>
          <Text style={styles.hotDealStatusText}>{status}</Text>
        </View>
      </View>

      {/* Middle Section */}
      <View style={styles.hotDealMiddle}>
        <Text style={[styles.hotDealBonus, { color: colors.primary }]}>{bonus}</Text>
        <View style={styles.hotDealRight}>
          {urgency > 0 && (
            <View style={[styles.urgencyBadge, { backgroundColor: '#EF4444' }]}>
              <Text style={styles.urgencyText}>{urgency}</Text>
            </View>
          )}
          <Text style={[styles.hotDealArrow, { color: colors.onSurface + '66' }]}>›</Text>
        </View>
      </View>

      {/* Footer Section */}
      <View style={styles.hotDealFooter}>
        <Text style={[styles.hotDealStore, { color: colors.onSurface + 'CC' }]}>{storeName}</Text>
        <Text style={[styles.hotDealTime, { color: colors.onSurface + 'CC' }]}>ETA: {expectedTime}</Text>
      </View>
    </TouchableOpacity>
  );
}

function Badge({ text, colors }: { text: string; colors: any }) {
  return (
    <View style={[styles.badge, { backgroundColor: colors.primary + '22' }]}>
      <Text style={[styles.badgeText, { color: colors.primary }]}>{text}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  banner: { alignItems: 'center', justifyContent: 'center' },
  bannerText: { fontSize: 12, fontWeight: '700' },
  // Header removed
  sectionTitle: { fontSize: 16, fontWeight: '800', marginTop: 8, paddingHorizontal: 16 },
  hotDealsContainer: { paddingHorizontal: 16, marginTop: 12, gap: 12 },
  hotDealCard: { 
    borderWidth: 1, 
    borderRadius: 12, 
    padding: 16, 
    backgroundColor: '#F9FAFB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  hotDealHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 12 
  },
  hotDealLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1 
  },
  hotDealIcon: { 
    fontSize: 20, 
    marginRight: 12 
  },
  hotDealInfo: { 
    flex: 1 
  },
  hotDealOrderId: { 
    fontSize: 16, 
    fontWeight: '700' 
  },
  hotDealDescription: { 
    fontSize: 12, 
    marginTop: 2 
  },
  hotDealStatus: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20 
  },
  hotDealStatusText: { 
    color: 'white', 
    fontSize: 12, 
    fontWeight: '600' 
  },
  hotDealMiddle: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 12 
  },
  hotDealBonus: { 
    fontSize: 24, 
    fontWeight: '800' 
  },
  hotDealRight: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  urgencyBadge: { 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  urgencyText: { 
    color: 'white', 
    fontSize: 12, 
    fontWeight: '700' 
  },
  hotDealArrow: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  hotDealFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  hotDealStore: { 
    fontSize: 12, 
    flex: 1 
  },
  hotDealTime: { 
    fontSize: 12, 
    fontWeight: '600' 
  },
  orderDetailsModal: { 
    backgroundColor: 'white', 
    borderRadius: 20, 
    padding: 24, 
    width: '90%', 
    maxWidth: 400, 
    maxHeight: '80%',
    alignItems: 'center' 
  },
  orderDetailsHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    width: '100%', 
    marginBottom: 20 
  },
  closeButton: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: '#F3F4F6', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  closeButtonText: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  orderInfo: { 
    width: '100%', 
    marginBottom: 20, 
    padding: 16, 
    backgroundColor: '#F9FAFB', 
    borderRadius: 12 
  },
  orderId: { 
    fontSize: 18, 
    fontWeight: '700', 
    marginBottom: 4 
  },
  orderDescription: { 
    fontSize: 14, 
    marginBottom: 8 
  },
  orderBonus: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
  itemsTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    marginBottom: 12, 
    alignSelf: 'flex-start' 
  },
  itemsList: { 
    width: '100%', 
    maxHeight: 200, 
    marginBottom: 20 
  },
  itemCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 12, 
    marginBottom: 8, 
    borderRadius: 8, 
    borderWidth: 1 
  },
  itemLeft: { 
    flex: 1 
  },
  itemName: { 
    fontSize: 14, 
    fontWeight: '600', 
    marginBottom: 2 
  },
  itemDetails: { 
    fontSize: 12 
  },
  itemPrice: { 
    fontSize: 14, 
    fontWeight: '600' 
  },
  orderActions: { 
    flexDirection: 'row', 
    gap: 12, 
    width: '100%' 
  },
  actionButton: { 
    flex: 1, 
    paddingVertical: 12, 
    paddingHorizontal: 16, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  actionButtonText: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
   hero: { marginTop: 12, borderRadius: 16, padding: 16, borderWidth: 1, flexDirection: 'column', position: 'relative' },
   heroHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
   heroContent: { flexDirection: 'row', alignItems: 'center' },
   heroLeft: { flex: 1 },
   heroRight: { paddingLeft: 12 },
   vehicleContainer: { position: 'absolute', bottom: 16, right: 16 },
   heroEmoji: { fontSize: 44 },
   heroTitle: { fontSize: 20, fontWeight: '900' },
   ticker: { marginTop: 4 },
   heroCta: { marginTop: 12, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, alignItems: 'center', alignSelf: 'flex-start', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
   heroCtaText: { color: 'white', fontWeight: '800' },
   topRow: { paddingHorizontal: 16, paddingTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
   topCard: { marginHorizontal: 16, marginTop: 12, borderRadius: 14, borderWidth: 1, paddingVertical: 10 },
   locationContainer: { flex: 1 },
   locationText: { fontSize: 12, fontWeight: '700' },
   topRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
   avatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#eee' },
   bell: { fontSize: 18 },
   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
   modalContent: { backgroundColor: 'white', borderRadius: 16, padding: 20, width: 300, alignItems: 'center' },
   modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
   modalInput: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, width: '100%', marginBottom: 20 },
   modalButtons: { flexDirection: 'row', gap: 12 },
   modalButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, minWidth: 80, alignItems: 'center' },
   modalButtonText: { fontSize: 16, fontWeight: '600' },
  // statusCard removed
  statusTitle: { fontSize: 12, fontWeight: '700' },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  switchLabel: { fontSize: 12, fontWeight: '700' },
  earningsLabel: { fontSize: 12, fontWeight: '700' },
  earningsAmount: { fontSize: 24, fontWeight: '900' },
  inlineStatusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontSize: 12, fontWeight: '700' },
});



