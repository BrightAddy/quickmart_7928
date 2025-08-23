import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Screen, Title, Body } from '../../components/UI';
import { useTheme } from '../../theme/theme';

type WishItem = { id: string; name: string; price: string; inStock: boolean };

const initial: WishItem[] = [
  { id: 'w1', name: 'Milo Chocolate Drink', price: 'GHS 8.90', inStock: true },
  { id: 'w2', name: 'Titus Sardine', price: 'GHS 6.80', inStock: false },
];

export default function Wishlist() {
  const { colors } = useTheme();
  const [items, setItems] = useState<WishItem[]>(initial);

  const toggleItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <Screen>
      <View style={{ padding: 16 }}>
        <Title>Wishlist</Title>
        <Body style={{ marginTop: 4, opacity: 0.8 }}>Save items and get back‑in‑stock alerts</Body>

        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          ListEmptyComponent={<Body style={{ marginTop: 24, opacity: 0.7 }}>Your wishlist is empty.</Body>}
          renderItem={({ item }) => (
            <View style={[styles.row, { backgroundColor: colors.surface }]}> 
              <View>
                <Text style={[styles.name, { color: colors.onSurface }]}>{item.name}</Text>
                <Text style={{ color: item.inStock ? colors.primary : colors.onSurface + '66' }}>
                  {item.inStock ? 'In stock' : 'Out of stock'} · {item.price}
                </Text>
              </View>
              <TouchableOpacity onPress={() => toggleItem(item.id)} style={[styles.btn, { backgroundColor: colors.primary }]}> 
                <Text style={{ color: colors.onPrimary, fontWeight: '700' }}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          style={{ marginTop: 16 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { padding: 12, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 15, fontWeight: '700' },
  btn: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
});



