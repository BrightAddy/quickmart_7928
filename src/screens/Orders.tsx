import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated } from 'react-native';
import { Screen, FloatingChatbotButton, ChatbotModal, GhanaianLoader } from '../components/UI';
import { useTheme } from '../theme/theme';

const mockOrders = [
  { id: 'QKM-1023', status: 'On the way', eta: '15 min', store: 'Kofi\'s Fresh Market', total: 'GHS 85.50' },
  { id: 'QKM-1009', status: 'Delivered', eta: 'Yesterday', store: 'Ama\'s Grocery', total: 'GHS 42.00' },
];

export default function Orders({ navigation }: any) {
  const { colors } = useTheme();
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const trackOrder = (orderId: string) => {
    navigation.navigate('OrderTracking', { id: orderId });
  };

  return (
    <Screen style={{ flex: 1 }}>
      <Text style={[styles.header, { color: colors.onBackground }]}>My Orders</Text>
      {loading ? (
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <GhanaianLoader size={48} />
          <Text style={{ marginTop: 8, color: colors.onSurface + '88' }}>Fetching live status...</Text>
        </View>
      ) : (
        <FlatList
          data={mockOrders}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: '#fff', borderColor: colors.primary + '22' }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.orderId, { color: colors.primary }]}>{item.id}</Text>
                <Text style={{ color: colors.onSurface + '88' }}>{item.total}</Text>
              </View>
              <Text style={{ marginTop: 4, fontWeight: '600', color: colors.onSurface }}>{item.store}</Text>
              <Text style={{ marginTop: 2, color: colors.onSurface + '88' }}>{item.status} • {item.eta}</Text>
              <View style={styles.row}>
                <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={() => trackOrder(item.id)}>
                  <Text style={styles.btnText}>Track</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, { borderColor: colors.primary, borderWidth: 2 }]} onPress={() => {}}>
                  <Text style={[styles.btnText, { color: colors.primary }]}>Rate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, { borderColor: colors.primary, borderWidth: 2 }]} onPress={() => {}}>
                  <Text style={[styles.btnText, { color: colors.primary }]}>Reorder</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
      <FloatingChatbotButton onPress={() => setChatbotVisible(true)} />
      <ChatbotModal visible={chatbotVisible} onClose={() => setChatbotVisible(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 22, fontWeight: 'bold', marginHorizontal: 16, marginTop: 12, marginBottom: 6 },
  card: { borderRadius: 16, padding: 14, borderWidth: 1 },
  orderId: { fontWeight: 'bold' },
  row: { flexDirection: 'row', gap: 8, marginTop: 12 },
  btn: { borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14 },
  btnText: { color: '#fff', fontWeight: 'bold' },
});


