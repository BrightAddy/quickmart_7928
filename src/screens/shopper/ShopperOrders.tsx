import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';

const myOrders = [
  { id: 'ORD-210', status: 'Delivered', amount: '₵42.30', date: 'Today 1:23 pm' },
  { id: 'ORD-207', status: 'Delivered', amount: '₵79.90', date: 'Yesterday 3:10 pm' },
  { id: 'ORD-202', status: 'Cancelled', amount: '—', date: 'Mon 10:14 am' },
];

export default function ShopperOrders({ navigation }: any) {
  const { colors } = useTheme();
  return (
    <Screen>
      <View style={{ padding: 16 }}>
        <Text style={[styles.title, { color: colors.onBackground }]}>My Orders</Text>
        <FlatList
          data={myOrders}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.primary + '22' }]} onPress={() => navigation.navigate('ShopperChat', { orderId: item.id, peerName: 'Customer' })}>
              <View>
                <Text style={[styles.id, { color: colors.primary }]}>{item.id}</Text>
                <Text style={{ color: colors.onSurface + '88' }}>{item.date}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontWeight: '700', color: item.status === 'Delivered' ? colors.primary : colors.onSurface }}>{item.status}</Text>
                <Text style={{ color: colors.onSurface + '66' }}>{item.amount}</Text>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          style={{ marginTop: 12 }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700' },
  row: { borderWidth: 1, borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  id: { fontWeight: '700', marginBottom: 4 },
});


