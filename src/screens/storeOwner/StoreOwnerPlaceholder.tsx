import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/theme';

export default function StoreOwnerPlaceholder() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.onBackground }]}>Store Owner Area</Text>
      <Text style={[styles.subtitle, { color: colors.onBackground + '99' }]}>This interface is being rebuilt.</Text>
      <Text style={[styles.body, { color: colors.onBackground + '88' }]}>You can safely keep using the app while we set up your new Store Owner experience.</Text>
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => {}}>
        <Text style={{ color: colors.onPrimary, fontWeight: 'bold' }}>OK</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 10 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 16, marginTop: 6 },
  body: { fontSize: 14, textAlign: 'center', marginTop: 4 },
  button: { marginTop: 16, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
});


