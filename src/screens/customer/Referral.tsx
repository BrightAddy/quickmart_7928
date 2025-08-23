import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';

export default function Referral() {
  const { colors } = useTheme();
  return (
    <Screen style={{ flex: 1, padding: 20 }}>
      <Text style={[styles.title, { color: colors.onBackground }]}>Referral Program</Text>
      <Text style={{ color: colors.onSurface + '88', marginTop: 8 }}>
        Invite friends and earn rewards when they place their first order.
      </Text>
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Share Invite Link</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold' },
  button: { marginTop: 20, padding: 14, borderRadius: 12, alignItems: 'center' },
});


