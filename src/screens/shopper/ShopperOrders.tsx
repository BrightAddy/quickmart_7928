import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl, Animated } from 'react-native';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';

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

export default function ShopperOrders() {
  const { colors } = useTheme();
  const [segment, setSegment] = useState<Segment>('New');
  const [refreshing, setRefreshing] = useState(false);
  const underline = useRef(new Animated.Value(0)).current;

  const initialNew = useMemo<Order[]>(() => ([
    { id: 'o1', store: 'Daily Needs', distanceKm: 1.2, payout: 16.5, items: 5, etaMins: 18 },
    { id: 'o2', store: 'FreshMart', distanceKm: 2.4, payout: 20.0, items: 8, etaMins: 25 },
    { id: 'o3', store: 'GreenGrocer', distanceKm: 0.9, payout: 14.2, items: 3, etaMins: 15 },
  ]), []);

  const [newOrders, setNewOrders] = useState<Order[]>(initialNew);
  const [activeOrders, setActiveOrders] = useState<Order[]>([{ id: 'oA', store: 'MegaMart', distanceKm: 1.8, payout: 19.7, items: 6, etaMins: 22 }]);
  const [historyOrders, setHistoryOrders] = useState<Order[]>([{ id: 'oH', store: 'QuickShop', distanceKm: 3.1, payout: 21.5, items: 7, etaMins: 0 }]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const switchSegment = (idx: number) => {
    setSegment(SEGMENTS[idx]);
    Animated.spring(underline, { toValue: idx, useNativeDriver: true, stiffness: 160, damping: 18, mass: 0.7 } as any).start();
  };

  const acceptOrder = (order: Order) => {
    setNewOrders(prev => prev.filter(o => o.id !== order.id));
    setActiveOrders(prev => [{ ...order }, ...prev]);
  };

  const declineOrder = (order: Order) => {
    setNewOrders(prev => prev.filter(o => o.id !== order.id));
  };

  const completeOrder = (order: Order) => {
    setActiveOrders(prev => prev.filter(o => o.id !== order.id));
    setHistoryOrders(prev => [{ ...order }, ...prev]);
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={[styles.card, { borderColor: colors.primary + '22', backgroundColor: colors.surface }]}> 
      <View style={styles.cardRow}>
        <Text style={[styles.store, { color: colors.onBackground }]}>{item.store}</Text>
        <Text style={[styles.payout, { color: colors.primary }]}>₵{item.payout.toFixed(2)}</Text>
      </View>
      <Text style={[styles.sub, { color: colors.onSurface + 'CC' }]}>{item.distanceKm.toFixed(1)} km · {item.items} items</Text>
      {segment !== 'History' ? (
        <Text style={[styles.sub, { color: colors.onSurface + '99', marginTop: 2 }]}>ETA {item.etaMins} mins</Text>
      ) : null}

      {segment === 'New' && (
        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={() => acceptOrder(item)}>
            <Text style={[styles.btnText, { color: colors.onPrimary }]}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#ef4444' }]} onPress={() => declineOrder(item)}>
            <Text style={[styles.btnText, { color: '#fff' }]}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
      {segment === 'Active' && (
        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={() => completeOrder(item)}>
            <Text style={[styles.btnText, { color: colors.onPrimary }]}>Mark Delivered</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { backgroundColor: colors.onSurface + '1A' }]}> 
            <Text style={[styles.btnText, { color: colors.onBackground }]}>Details</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const data = segment === 'New' ? newOrders : segment === 'Active' ? activeOrders : historyOrders;

  return (
    <Screen style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <View style={[styles.segmentRow, { borderColor: colors.primary + '22' }]}>
          {SEGMENTS.map((s, i) => (
            <TouchableOpacity key={s} style={styles.seg} onPress={() => switchSegment(i)}>
              <Text style={[styles.segText, { color: segment === s ? colors.primary : '#6b7280' }]}>{s}</Text>
            </TouchableOpacity>
          ))}
          <Animated.View
            style={[
              styles.underline,
              {
                backgroundColor: colors.primary,
                transform: [{ translateX: underline.interpolate({ inputRange: [0, 1, 2], outputRange: [0, 110, 220] }) }],
              },
            ]}
          />
        </View>
      </View>

      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40, color: '#6b7280' }}>No orders</Text>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  segmentRow: { flexDirection: 'row', borderWidth: 1, borderRadius: 999, padding: 6, position: 'relative' },
  seg: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  segText: { fontSize: 14, fontWeight: '800' },
  underline: { position: 'absolute', height: 28, width: 100, borderRadius: 999, left: 6, top: 6 },
  card: { borderWidth: 1, borderRadius: 12, padding: 14 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  store: { fontSize: 16, fontWeight: '800' },
  payout: { fontSize: 16, fontWeight: '800' },
  sub: { fontSize: 12, marginTop: 4 },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  btn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  btnText: { fontSize: 12, fontWeight: '800' },
});




