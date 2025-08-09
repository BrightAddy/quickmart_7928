import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';

export default function ShopperSchedule() {
  const { colors } = useTheme();
  return (
    <Screen style={{ flex: 1, padding: 20 }}>
      <Text style={[styles.title, { color: colors.onBackground }]}>Schedule</Text>
      <Text style={{ marginTop: 8, color: colors.onSurface + '88' }}>Set availability (calendar UI placeholder)</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold' },
});


