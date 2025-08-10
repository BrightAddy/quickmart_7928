import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';

export default function ShopperSchedule() {
  const { colors } = useTheme();
  const [days, setDays] = useState<Record<string, { enabled: boolean; start: string; end: string }>>({
    Mon: { enabled: true, start: '09:00', end: '17:00' },
    Tue: { enabled: true, start: '09:00', end: '17:00' },
    Wed: { enabled: true, start: '09:00', end: '17:00' },
    Thu: { enabled: false, start: '10:00', end: '16:00' },
    Fri: { enabled: true, start: '09:00', end: '18:00' },
    Sat: { enabled: false, start: '10:00', end: '14:00' },
    Sun: { enabled: false, start: '10:00', end: '14:00' },
  });
  return (
    <Screen style={{ flex: 1, padding: 20 }}>
      <Text style={[styles.title, { color: colors.onBackground }]}>Schedule</Text>
      <Text style={{ marginTop: 8, color: colors.onSurface + '88' }}>Set availability</Text>
      <View style={{ marginTop: 16, gap: 10 }}>
        {Object.entries(days).map(([day, cfg]) => (
          <View key={day} style={[styles.row, { borderColor: colors.primary + '22', backgroundColor: colors.surface }]}>
            <Text style={[styles.day, { color: colors.onSurface }]}>{day}</Text>
            <Text style={{ color: cfg.enabled ? colors.primary : colors.onSurface + '66', fontWeight: '600' }}>
              {cfg.start} - {cfg.end}
            </Text>
            <Switch value={cfg.enabled} onValueChange={(v) => setDays((d) => ({ ...d, [day]: { ...cfg, enabled: v } }))} />
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold' },
  row: { borderWidth: 1, padding: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  day: { fontWeight: '700' },
});


