import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Screen, ImageUploadButton, ImageScanModal } from '../../components/UI';
import { useTheme } from '../../theme/theme';

const products = [
  { id: 'p1', name: 'Titus Sardine', price: 'GHS 6.80', stock: 24 },
  { id: 'p2', name: 'Gino Tomato Paste', price: 'GHS 2.30', stock: 60 },
];

export default function Inventory() {
  const { colors } = useTheme();
  const [scanVisible, setScanVisible] = React.useState(false);
  return (
    <Screen style={{ flex: 1 }}>
      <Text style={[styles.title, { color: colors.onBackground }]}>Inventory</Text>
      <FlatList
        data={products}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item }) => (
          <View style={[styles.row, { borderColor: colors.primary + '22' }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: colors.onSurface }]}>{item.name}</Text>
              <Text style={{ color: colors.onSurface + '88' }}>{item.price} • Stock: {item.stock}</Text>
            </View>
            <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 }}>
            <ImageUploadButton onPress={() => setScanVisible(true)} />
          </View>
        }
      />
      <ImageScanModal visible={scanVisible} onClose={() => setScanVisible(false)} onRecognized={() => setScanVisible(false)} mode="store_owner" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold', margin: 16 },
  row: { backgroundColor: '#fff', borderRadius: 14, padding: 12, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  name: { fontWeight: '600', marginBottom: 2 },
  btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
});


