import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Screen } from '../components/UI';
import { useTheme } from '../theme/theme';

export default function PaymentMethods() {
  const { colors } = useTheme();
  const [selected, setSelected] = useState<'mtn'|'vodafone'|'card'|'cash'>('mtn');
  return (
    <Screen style={{ flex: 1, padding: 16 }}>
      <Text style={[styles.title, { color: colors.onBackground }]}>Payment Methods</Text>
      {[
        { key: 'mtn', label: 'MTN MoMo', icon: '📱' },
        { key: 'vodafone', label: 'Vodafone Cash', icon: '📲' },
        { key: 'card', label: 'Debit/Credit Card', icon: '💳' },
        { key: 'cash', label: 'Cash on Delivery', icon: '💵' },
      ].map((p: any) => (
        <TouchableOpacity key={p.key} style={[styles.item, { borderColor: selected === p.key ? colors.primary : colors.primary + '22', backgroundColor: selected === p.key ? colors.primary + '11' : '#fff' }]} onPress={() => setSelected(p.key)}>
          <Text style={styles.icon}>{p.icon}</Text>
          <Text style={{ flex: 1, color: colors.onSurface }}>{p.label}</Text>
          {selected === p.key && <Text style={{ color: colors.primary, fontWeight: 'bold' }}>✓</Text>}
        </TouchableOpacity>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  item: { borderWidth: 2, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  icon: { fontSize: 20 },
});


