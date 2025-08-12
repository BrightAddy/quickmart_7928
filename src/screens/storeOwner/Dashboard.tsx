import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/theme/theme';

const ORANGE = '#FF7A00';

export default function Dashboard() {
  const { colors } = useTheme();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={[styles.header, { color: colors.onBackground }]}>Overview</Text>
      <View style={styles.kpiRow}>
        {[
          { label: 'Sales', value: 'GH₵ 2,340' },
          { label: 'Orders', value: '18' },
          { label: 'Pending', value: '5' },
        ].map((k) => (
          <View key={k.label} style={[styles.kpiCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}> 
            <Text style={[styles.kpiValue, { color: ORANGE }]}>{k.value}</Text>
            <Text style={[styles.kpiLabel, { color: colors.onSurface + '88' }]}>{k.label}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}> 
        <Text style={[styles.cardTitle, { color: colors.onSurface }]}>Alerts</Text>
        <Text style={[styles.item, { color: colors.onSurface + '88' }]}>• 3 products are low on stock</Text>
        <Text style={[styles.item, { color: colors.onSurface + '88' }]}>• 2 orders need assignment</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}> 
        <Text style={[styles.cardTitle, { color: colors.onSurface }]}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          {[
            'Add Product',
            'Restock',
            'Update Hours',
          ].map((label) => (
            <TouchableOpacity key={label} style={[styles.actionBtn, { backgroundColor: ORANGE }]}> 
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 22, fontWeight: '700' },
  kpiRow: { flexDirection: 'row', gap: 10 },
  kpiCard: { flex: 1, borderRadius: 12, padding: 12, borderWidth: 1 },
  kpiValue: { fontSize: 18, fontWeight: '700' },
  kpiLabel: { fontSize: 12, marginTop: 4 },
  card: { borderRadius: 12, padding: 14, borderWidth: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  item: { fontSize: 14, marginBottom: 4 },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
});


