import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';

export default function ShopperPerformance() {
  const { colors } = useTheme();
  return (
    <Screen style={{ padding: 16 }}>
      <Text style={[styles.title, { color: colors.onBackground }]}>Performance</Text>
      <View style={[styles.row, { borderColor: colors.primary + '22', backgroundColor: colors.surface }]}>
        <View style={styles.metric}> 
          <Text style={[styles.metricValue, { color: colors.primary }]}>4.8</Text>
          <Text style={[styles.metricLabel, { color: colors.onSurface + '88' }]}>Rating</Text>
        </View>
        <View style={styles.metric}> 
          <Text style={[styles.metricValue, { color: colors.primary }]}>96%</Text>
          <Text style={[styles.metricLabel, { color: colors.onSurface + '88' }]}>On‑time</Text>
        </View>
        <View style={styles.metric}> 
          <Text style={[styles.metricValue, { color: colors.primary }]}>124</Text>
          <Text style={[styles.metricLabel, { color: colors.onSurface + '88' }]}>Completed</Text>
        </View>
      </View>

      <Text style={[styles.subtitle, { color: colors.onBackground }]}>Recent Feedback</Text>
      <View style={[styles.card, { borderColor: colors.primary + '22', backgroundColor: colors.surface }]}>
        <Text style={{ color: colors.onSurface }}>“Great communication and on time!” — Ama</Text>
      </View>
      <View style={[styles.card, { borderColor: colors.primary + '22', backgroundColor: colors.surface }]}>
        <Text style={{ color: colors.onSurface }}>“Found the exact brand I wanted.” — Kofi</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  subtitle: { fontSize: 16, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  row: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, padding: 12, gap: 12 },
  metric: { flex: 1, alignItems: 'center' },
  metricValue: { fontSize: 22, fontWeight: '800' },
  metricLabel: { fontSize: 12 },
  card: { borderRadius: 12, borderWidth: 1, padding: 12, marginTop: 8 },
});


