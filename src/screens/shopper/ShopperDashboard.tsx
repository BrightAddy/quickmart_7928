import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';

const availableOrders = [
  { id: 'ORD-221', value: 'GHS 32', store: 'Makola Fresh', distance: '1.8 km', items: 6 },
  { id: 'ORD-219', value: 'GHS 54', store: 'Accra Mart', distance: '3.1 km', items: 10 },
];

export default function ShopperDashboard({ navigation }: any) {
  const { colors } = useTheme();
  return (
    <Screen style={{ flex: 1 }}>
      <Text style={[styles.title, { color: colors.onBackground }]}>Available Orders</Text>
      <FlatList
        data={availableOrders}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderColor: colors.primary + '22' }]}>
            <Text style={[styles.id, { color: colors.primary }]}>{item.id}</Text>
            <Text style={{ color: colors.onSurface }}>{item.store} • {item.distance}</Text>
            <Text style={{ color: colors.onSurface + '88' }}>{item.items} items • {item.value}</Text>
            <View style={styles.row}>
              <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate('ShopperActiveOrder', { id: item.id })}>
                <Text style={styles.btnText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { borderColor: colors.primary, borderWidth: 2 }]}> 
                <Text style={[styles.btnText, { color: colors.primary }]}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold', margin: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 1 },
  id: { fontWeight: 'bold', marginBottom: 6 },
  row: { flexDirection: 'row', gap: 8, marginTop: 10 },
  btn: { borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14 },
  btnText: { color: '#fff', fontWeight: 'bold' },
});


