import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated, Linking } from 'react-native';
import { Screen, ImageScanModal, ImageRecognitionResult } from '../../components/UI';
import { useTheme } from '../../theme/theme';

const items = [
  { id: '1', name: 'Milo 400g', qty: 2 },
  { id: '2', name: 'Fan Milk Yoghurt', qty: 4 },
  { id: '3', name: 'Gino Tomato Paste', qty: 3 },
];

export default function ShopperActiveOrder({ route, navigation }: any) {
  const { colors } = useTheme();
  const [scanVisible, setScanVisible] = useState(false);
  const [verified, setVerified] = useState<Record<string, boolean>>({});
  const [lastScan, setLastScan] = useState<any | null>(null);
  const [showResult, setShowResult] = useState(false);
  const pulse = useRef(new Animated.Value(1)).current;

  return (
    <Screen style={{ flex: 1 }}>
      <Text style={[styles.title, { color: colors.onBackground }]}>Order Summary</Text>
      <View style={[styles.summary, { borderColor: colors.primary + '22' }]}> 
        <View style={styles.summaryRow}>
          <SummaryMetric label="Delivery Earnings" value="$39.95" color={colors.onSurface} />
          <SummaryMetric label="Tips" value="$11.50" color={colors.onSurface} />
          <SummaryMetric label="Distance" value="11.3 mi" color={colors.onSurface} />
        </View>
        <View style={[styles.totalRow, { borderTopColor: colors.primary + '22' }]}>
          <Text style={{ color: colors.onSurface + '88' }}>Total Est. Earnings</Text>
          <Text style={{ color: colors.onBackground, fontWeight: '800' }}>$51.45</Text>
        </View>
      </View>
      <Text style={[styles.title, { color: colors.onBackground, marginTop: 8 }]}>Pick List</Text>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item }) => (
          <View style={[styles.row, { borderColor: colors.primary + '22' }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.itemName, { color: colors.onSurface }]}>{item.name}</Text>
              <Text style={{ color: colors.onSurface + '88' }}>Qty: {item.qty}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.verifyBtn, { backgroundColor: verified[item.id] ? colors.secondary : colors.primary }]}
              onPress={() => setScanVisible(true)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>{verified[item.id] ? 'Verified' : 'Scan'}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.footerRow}>
        <TouchableOpacity style={[styles.navBtn, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate('ShopperRoute', route?.params || {})}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Start Route</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navBtn, { borderColor: colors.primary, borderWidth: 2 }]} onPress={() => navigation.navigate('ShopperChat', { orderId: route?.params?.order?.id, peerName: 'Customer' })}>
          <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Open Chat</Text>
        </TouchableOpacity>
      </View>

      <ImageScanModal 
        visible={scanVisible} 
        onClose={() => setScanVisible(false)} 
        onRecognized={(res) => { setLastScan(res); setShowResult(true); setScanVisible(false); setVerified((v) => ({ ...v, [items[0].id]: true })); }} 
        mode="shopper" 
      />
      {lastScan && (
        <ImageRecognitionResult result={lastScan} visible={showResult} onClose={() => setShowResult(false)} />
      )}
    </Screen>
  );
}

const SummaryMetric: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <View style={{ alignItems: 'center', flex: 1 }}>
    <Text style={{ color, fontWeight: '800', fontSize: 16 }}>{value}</Text>
    <Text style={{ opacity: 0.7 }}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold', margin: 16 },
  row: { backgroundColor: '#fff', borderRadius: 14, padding: 12, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemName: { fontWeight: '600', marginBottom: 2 },
  verifyBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  footerRow: { flexDirection: 'row', gap: 10, padding: 16 },
  navBtn: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  summary: { borderWidth: 1, marginHorizontal: 16, borderRadius: 16, padding: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, marginTop: 8, borderTopWidth: 1 },
});


