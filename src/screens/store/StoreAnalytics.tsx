import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';

export default function StoreAnalytics() {
  const { colors } = useTheme();
  return (
    <Screen style={{ flex: 1, padding: 20 }}>
      <Text style={[styles.title, { color: colors.onBackground }]}>Analytics</Text>
      <View style={[styles.card, { borderColor: colors.primary + '22' }]}>
        <Text style={{ color: colors.onSurface + '88' }}>Weekly Sales</Text>
        <Text style={[styles.metric, { color: colors.primary }]}>GHS 5,420</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, marginTop: 12 },
  metric: { fontSize: 28, fontWeight: 'bold', marginTop: 6 },
});


