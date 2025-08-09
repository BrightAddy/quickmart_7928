import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Screen } from '../components/UI';
import { useTheme } from '../theme/theme';

export default function OrderTracking({ route }: any) {
  const { colors } = useTheme();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 800, useNativeDriver: true })
      ])
    ).start();
  }, []);

  return (
    <Screen style={{ flex: 1, padding: 16 }}>
      <Text style={[styles.title, { color: colors.onBackground }]}>Order Tracking</Text>
      <Text style={{ color: colors.onSurface + '88', marginBottom: 8 }}>Order ID: {route?.params?.id || '—'}</Text>
      <View style={[styles.mapBox, { borderColor: colors.primary + '22' }]}> 
        <Text style={{ fontSize: 28, marginBottom: 8 }}>🗺️</Text>
        <Text style={{ color: colors.onSurface + '88' }}>Accra • Legon • East Legon</Text>
        <Animated.View style={[styles.pulseDot, { backgroundColor: colors.primary, opacity: pulse.interpolate({ inputRange: [0,1], outputRange: [0.4, 1] }) }]} />
      </View>
      <View style={[styles.row, { borderColor: colors.primary + '22' }]}>
        <Text style={{ color: colors.onSurface }}>Shopper is heading to your address</Text>
        <Text style={{ color: colors.onSurface + '88' }}>ETA: 14 min</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  mapBox: { borderWidth: 1, borderRadius: 16, padding: 16, alignItems: 'center', justifyContent: 'center', height: 220, marginBottom: 12, position: 'relative' },
  pulseDot: { width: 14, height: 14, borderRadius: 7, position: 'absolute', bottom: 26, right: 26 },
  row: { borderWidth: 1, borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between' },
});


