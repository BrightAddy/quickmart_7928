import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';

export default function HelpCenter() {
  const { colors } = useTheme();
  return (
    <Screen style={{ flex: 1, padding: 20 }}>
      <Text style={[styles.title, { color: colors.onBackground }]}>Help Center</Text>
      <Text style={{ color: colors.onSurface + '88', marginTop: 8 }}>
        FAQs, contact support, and troubleshooting guides will appear here.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold' },
});


