import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';

export default function ShopperRoute({ route }: any) {
  const { colors } = useTheme();
  const { storeLocation, customerLocation } = route?.params || {};

  const openMaps = (coords?: { lat: number; lng: number }) => {
    if (!coords) return;
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`);
  };

  return (
    <Screen style={{ padding: 16 }}>
      <Text style={[styles.title, { color: colors.onBackground }]}>Route</Text>
      <View style={[styles.card, { borderColor: colors.primary + '22' }]}>
        <Text style={{ color: colors.onSurface + '88' }}>Use your preferred maps app to navigate.</Text>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={() => openMaps(storeLocation)}>
            <Text style={{ color: colors.onPrimary, fontWeight: '700' }}>To Store</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { borderColor: colors.primary, borderWidth: 2 }]} onPress={() => openMaps(customerLocation)}>
            <Text style={{ color: colors.primary, fontWeight: '700' }}>To Customer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, marginTop: 12 },
  row: { flexDirection: 'row', gap: 8, marginTop: 12 },
  btn: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
});


