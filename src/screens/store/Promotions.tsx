import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';

export default function Promotions() {
  const { colors } = useTheme();
  return (
    <Screen style={{ flex: 1, padding: 20 }}>
      <Text style={[styles.title, { color: colors.onBackground }]}>Promotions</Text>
      <Text style={{ color: colors.onSurface + '88', marginTop: 8 }}>Create and manage discounts.</Text>
      <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Create Promotion</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold' },
  btn: { marginTop: 16, padding: 14, borderRadius: 12, alignItems: 'center' },
});


