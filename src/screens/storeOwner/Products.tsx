import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useTheme } from '@/theme/theme';

const ORANGE = '#FF7A00';

export default function Products() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 12, flexDirection: 'row', gap: 8 }}>
        <TextInput
          placeholder="Search products"
          placeholderTextColor={colors.onSurface + '66'}
          style={[styles.search, { color: colors.onSurface, borderColor: ORANGE + '55', backgroundColor: colors.surface }]}
        />
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: ORANGE }]}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 12, gap: 10 }}>
        {[1, 2, 3, 4, 5].map((id) => (
          <View key={id} style={[styles.productCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}> 
            <Text style={[styles.productTitle, { color: colors.onSurface }]}>Product {id}</Text>
            <Text style={{ color: colors.onSurface + '66' }}>GH₵ {(id * 9.5).toFixed(2)} • Stock: {id * 7}</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              {['Edit', 'Restock', 'Deactivate'].map((label) => (
                <TouchableOpacity key={label} style={[styles.actionBtn, { backgroundColor: ORANGE }]}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  search: { flex: 1, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  addBtn: { paddingHorizontal: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  productCard: { borderRadius: 12, padding: 14, borderWidth: 1 },
  productTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  actionBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
});


