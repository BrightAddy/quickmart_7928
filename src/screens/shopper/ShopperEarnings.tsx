import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';

export default function ShopperEarnings() {
  const { colors } = useTheme();
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('week');
  const animatedValue = useRef(new Animated.Value(0)).current;
  const targets = { today: 54.75, week: 345.0, month: 1620.25 };
  const target = targets[period];

  useEffect(() => {
    animatedValue.setValue(0);
    Animated.timing(animatedValue, { toValue: target, duration: 900, useNativeDriver: false }).start();
  }, [period]);

  const displayed = animatedValue.interpolate({ inputRange: [0, target], outputRange: [0, target] });
  return (
    <Screen style={{ flex: 1, padding: 16 }}>
      <Text style={[styles.title, { color: colors.onBackground }]}>Earnings</Text>

      <View style={[styles.segment, { backgroundColor: colors.surface, borderColor: colors.primary + '22' }]}>
        {(['today', 'week', 'month'] as const).map((p) => (
          <TouchableOpacity key={p} style={[styles.segBtn, period === p && { backgroundColor: colors.primary }]} onPress={() => setPeriod(p)}>
            <Text style={{ color: period === p ? colors.onPrimary : colors.onSurface }}>{p === 'today' ? 'Today' : p === 'week' ? 'This Week' : 'This Month'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.card, { borderColor: colors.primary + '22', backgroundColor: colors.surface }]}>
        <Text style={{ color: colors.onSurface + '88', textAlign: 'center' }}>Total Earnings</Text>
        <Animated.Text style={[styles.amount, { color: colors.onBackground }]}>₵{(displayed as any)}</Animated.Text>
        <View style={styles.metricsRow}>
          <Metric label="Base Pay" value="₵230.00" color={colors.primary} />
          <Metric label="Tips" value="₵115.00" color={colors.secondary} />
          <Metric label="Orders" value="23" color={colors.onSurface} />
        </View>
      </View>

      <View style={[styles.card, { borderColor: colors.primary + '22', backgroundColor: colors.surface }]}>
        <Text style={{ color: colors.onSurface + '88' }}>Available for Cashout</Text>
        <Text style={[styles.cashout, { color: colors.primary }]}>₵0.00</Text>
        <TouchableOpacity style={[styles.cashBtn, { backgroundColor: '#7C9CF1' }]}> 
          <Text style={{ color: 'white', fontWeight: '700' }}>Cash Out Now</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold' },
  segment: { flexDirection: 'row', borderWidth: 1, borderRadius: 12, padding: 6, gap: 6, marginTop: 8 },
  segBtn: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 8 },
  card: { borderRadius: 16, padding: 16, borderWidth: 1, marginTop: 12 },
  amount: { fontSize: 32, fontWeight: '800', marginTop: 6, textAlign: 'center' },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  cashout: { fontSize: 24, fontWeight: '800', marginTop: 6 },
  cashBtn: { marginTop: 12, borderRadius: 10, alignItems: 'center', paddingVertical: 12 },
});

const Metric: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <View style={{ alignItems: 'center', flex: 1 }}>
    <Text style={{ color, fontWeight: '800', fontSize: 16 }}>{value}</Text>
    <Text style={{ opacity: 0.7 }}>{label}</Text>
  </View>
);


