import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, Linking } from 'react-native';
import { Screen, FloatingChatbotButton, ChatbotModal } from '../../components/UI';
import { useTheme } from '../../theme/theme';
import { Swipeable } from 'react-native-gesture-handler';

type OrderCard = {
  id: string;
  value: string;
  store: string;
  distance: string;
  items: number;
  estEarnings: string;
  storeLocation: { lat: number; lng: number };
  customerLocation: { lat: number; lng: number };
  customerName: string;
  address: string;
};

const availableOrders: OrderCard[] = [
  { id: 'ORD-221', value: 'GHS 132', store: 'Makola Fresh', distance: '1.8 km', items: 6, estEarnings: 'GHS 24.50', storeLocation: { lat: 5.5523, lng: -0.2065 }, customerLocation: { lat: 5.6037, lng: -0.1870 }, customerName: 'Ama', address: 'Osu, Oxford St.' },
  { id: 'ORD-219', value: 'GHS 254', store: 'Accra Mart', distance: '3.1 km', items: 10, estEarnings: 'GHS 38.10', storeLocation: { lat: 5.6145, lng: -0.2053 }, customerLocation: { lat: 5.6400, lng: -0.1869 }, customerName: 'Kofi', address: 'East Legon' },
];

export default function ShopperDashboard({ navigation }: any) {
  const { colors } = useTheme();
  const [chatOpen, setChatOpen] = useState(false);
  const hintAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(hintAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(hintAnim, { toValue: 0.8, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Screen style={{ flex: 1 }}>
      <View style={[styles.headerCard, { backgroundColor: colors.surface, borderColor: colors.primary + '22' }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.onBackground }]}>Partner Alex</Text>
          <Text style={{ color: colors.onSurface + '88' }}>Your earnings</Text>
          <Text style={[styles.headerEarnings, { color: colors.primary }]}>₵157.34</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ color: colors.onSurface + '88', marginBottom: 6 }}>Status</Text>
          <TouchableOpacity style={[styles.statusBtn, { backgroundColor: colors.primary }]}>
            <Text style={{ color: 'white', fontWeight: '700' }}>Online</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.banner, { backgroundColor: colors.secondary + '15' }]}>
        <Text style={[styles.bannerText, { color: colors.onSurface }]}>4 delivery orders found! </Text>
        <TouchableOpacity onPress={() => {}}>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>View details</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.title, { color: colors.onBackground }]}>Available Orders</Text>
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 8 }}>
        <TouchableOpacity style={[styles.quickBtn, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate('ShopperEarnings')}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Earnings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quickBtn, { borderWidth: 2, borderColor: colors.primary }]} onPress={() => navigation.navigate('ShopperSchedule')}>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quickBtn, { borderWidth: 2, borderColor: colors.primary }]} onPress={() => navigation.navigate('ShopperPerformance')}>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>Performance</Text>
        </TouchableOpacity>
      </View>
      <Animated.Text style={{ paddingHorizontal: 16, color: colors.onSurface + '88', transform: [{ scale: hintAnim }] }}>
        Tip: Swipe a card right to quickly accept
      </Animated.Text>
      <FlatList
        data={availableOrders}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => {
          const RightActions = () => (
            <View style={[styles.swipeAction, { backgroundColor: '#FDECEC', borderColor: colors.error + '33' }]}> 
              <Text style={[styles.swipeText, { color: colors.error }]}>Decline</Text>
            </View>
          );
          const LeftActions = () => (
            <View style={[styles.swipeAction, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '33' }]}> 
              <Text style={[styles.swipeText, { color: colors.primary }]}>Accept</Text>
            </View>
          );
          return (
            <Swipeable
              renderLeftActions={LeftActions}
              renderRightActions={RightActions}
              onSwipeableOpen={(direction) => {
                if (direction === 'left') {
                  navigation.navigate('ShopperActiveOrder', { order: item });
                }
              }}
            >
              <View style={[styles.card, { borderColor: colors.primary + '22' }]}> 
                <Text style={[styles.id, { color: colors.primary }]}>{item.id}</Text>
                <Text style={{ color: colors.onSurface }}>{item.store} • {item.distance}</Text>
                <View style={styles.valueRow}>
                  <Text style={{ color: colors.onSurface + '88' }}>{item.items} items • Order value</Text>
                  <View style={[styles.valuePill, { backgroundColor: colors.secondary + '20' }]}>
                    <Text style={{ color: colors.secondary, fontWeight: '700' }}>{item.value}</Text>
                  </View>
                </View>
                <Text style={{ color: colors.onSurface + '88', marginTop: 2 }}>Deliver to: {item.address}</Text>
                <View style={styles.metaRow}>
                  <Text style={{ color: colors.onSurface + '88' }}>Est. earnings</Text>
                  <Text style={{ color: colors.secondary, fontWeight: '700' }}>{item.estEarnings}</Text>
                </View>
                <View style={styles.row}>
                  <PulseButton color={colors.primary} onPress={() => navigation.navigate('ShopperActiveOrder', { order: item })} label="Accept" />
                  <TouchableOpacity style={[styles.btn, { borderColor: colors.primary, borderWidth: 2 }]} onPress={() => {}}>
                    <Text style={[styles.btnText, { color: colors.primary }]}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.btn, { borderColor: colors.primary, borderWidth: 2 }]} onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${item.storeLocation.lat},${item.storeLocation.lng}`)}>
                    <Text style={[styles.btnText, { color: colors.primary }]}>Map</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Swipeable>
          );
        }}
      />
      <FloatingChatbotButton onPress={() => setChatOpen(true)} />
      <ChatbotModal visible={chatOpen} onClose={() => setChatOpen(false)} />
    </Screen>
  );
}

const PulseButton: React.FC<{ color: string; label: string; onPress: () => void }> = ({ color, label, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.05, duration: 800, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity style={[styles.btn, { backgroundColor: color }]} onPress={onPress}>
        <Text style={styles.btnText}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold', margin: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 1 },
  id: { fontWeight: 'bold', marginBottom: 6 },
  row: { flexDirection: 'row', gap: 8, marginTop: 10 },
  btn: { borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  swipeAction: { justifyContent: 'center', alignItems: 'center', width: 100, borderWidth: 1, borderRadius: 12, marginVertical: 8 },
  swipeText: { fontWeight: '700' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  valueRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, alignItems: 'center' },
  valuePill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  quickBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 12, paddingVertical: 10 },
  headerCard: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, margin: 16, borderRadius: 16, borderWidth: 1 },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  headerEarnings: { fontSize: 22, fontWeight: '800', marginTop: 4 },
  statusBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 },
  banner: { marginHorizontal: 16, marginBottom: 8, padding: 12, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bannerText: { fontWeight: '600' },
});


