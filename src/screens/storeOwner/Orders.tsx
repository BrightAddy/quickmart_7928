import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/theme/theme';

const ORANGE = '#FF7A00';
const STATUSES = ['Pending', 'In Progress', 'Ready', 'Done', 'Cancelled'] as const;

export default function Orders() {
  const { colors } = useTheme();
  const [status, setStatus] = useState<typeof STATUSES[number]>('Pending');

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 12, gap: 8 }}>
        {STATUSES.map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setStatus(s)}
            style={[styles.chip, { borderColor: ORANGE }, s === status && { backgroundColor: ORANGE }]}
          >
            <Text style={{ color: s === status ? '#fff' : ORANGE, fontWeight: '600' }}>{s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ padding: 12, gap: 10 }}>
        {[1, 2, 3, 4].map((id) => (
          <View key={id} style={[styles.orderCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}> 
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[styles.orderTitle, { color: colors.onSurface }]}>Order #{id} • {status}</Text>
              <Text style={{ color: colors.onSurface + '66' }}>GH₵ {(id * 42).toFixed(2)}</Text>
            </View>
            <Text style={{ color: colors.onSurface + '88', marginTop: 4 }}>Kofi Mensah • Ring Road, Accra</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              {['Accept', 'Mark Ready', 'Assign'].map((label) => (
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
  chip: { borderWidth: 1.5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  orderCard: { borderRadius: 12, padding: 14, borderWidth: 1 },
  orderTitle: { fontSize: 16, fontWeight: '700' },
  actionBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
});


