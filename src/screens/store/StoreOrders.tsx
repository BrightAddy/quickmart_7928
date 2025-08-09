import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';

const incoming = [
  { id: 'S-101', items: 8, customer: 'Akosua', total: 'GHS 62.40' },
  { id: 'S-099', items: 3, customer: 'Yaw', total: 'GHS 18.10' },
];

export default function StoreOrders() {
  const { colors } = useTheme();
  return (
    <Screen style={{ flex: 1 }}>
      <Text style={[styles.title, { color: colors.onBackground }]}>Orders</Text>
      <FlatList
        data={incoming}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderColor: colors.primary + '22' }]}>
            <Text style={[styles.id, { color: colors.primary }]}>{item.id}</Text>
            <Text style={{ color: colors.onSurface }}>{item.customer} • {item.items} items</Text>
            <View style={styles.row}>
              <Text style={{ color: colors.onSurface + '88' }}>{item.total}</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]}>
                  <Text style={styles.btnText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, { borderColor: colors.primary, borderWidth: 2 }]}>
                  <Text style={[styles.btnText, { color: colors.primary }]}>Reject</Text>
                </TouchableOpacity>
              </View>
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
  row: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  btn: { borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
  btnText: { color: '#fff', fontWeight: 'bold' },
});


