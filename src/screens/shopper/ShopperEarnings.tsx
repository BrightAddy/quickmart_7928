import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';

export default function ShopperEarnings() {
  const { colors } = useTheme();
  return (
    <Screen style={{ flex: 1, padding: 20 }}>
      <Text style={[styles.title, { color: colors.onBackground }]}>Earnings</Text>
      <View style={[styles.card, { borderColor: colors.primary + '22' }]}>
        <Text style={{ color: colors.onSurface + '88' }}>This week</Text>
        <Text style={[styles.amount, { color: colors.primary }]}>GHS 320.50</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, marginTop: 12 },
  amount: { fontSize: 28, fontWeight: 'bold', marginTop: 6 },
});


