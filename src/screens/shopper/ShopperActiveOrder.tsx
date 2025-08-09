import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Screen, ImageScanModal } from '../../components/UI';
import { useTheme } from '../../theme/theme';

const items = [
  { id: '1', name: 'Milo 400g', qty: 2 },
  { id: '2', name: 'Fan Milk Yoghurt', qty: 4 },
  { id: '3', name: 'Gino Tomato Paste', qty: 3 },
];

export default function ShopperActiveOrder() {
  const { colors } = useTheme();
  const [scanVisible, setScanVisible] = useState(false);
  const [verified, setVerified] = useState<Record<string, boolean>>({});

  return (
    <Screen style={{ flex: 1 }}>
      <Text style={[styles.title, { color: colors.onBackground }]}>Active Order</Text>
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
      <ImageScanModal visible={scanVisible} onClose={() => setScanVisible(false)} onRecognized={() => setScanVisible(false)} mode="shopper" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold', margin: 16 },
  row: { backgroundColor: '#fff', borderRadius: 14, padding: 12, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemName: { fontWeight: '600', marginBottom: 2 },
  verifyBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
});


