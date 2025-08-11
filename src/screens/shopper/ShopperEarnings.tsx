import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Modal, TextInput, Alert, Share } from 'react-native';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';

const PERIODS = ['Today', 'Week', 'Month'] as const;
const SEGMENTS = ['Overview', 'Breakdown', 'Activity', 'Payouts'] as const;

type Period = typeof PERIODS[number];
type Segment = typeof SEGMENTS[number];

type TimePoint = { ts: string; base: number; tips: number; bonus: number };
type Payout = { id: string; amount: number; date: string; status: 'Scheduled' | 'Paid' | 'Failed' };
type OrderLite = { id: string; date: string; store: string; base: number; tips: number; bonus: number; fee: number; total: number };

export default function ShopperEarnings() {
  const { colors } = useTheme();
  const [period, setPeriod] = useState<Period>('Today');
  const [segment, setSegment] = useState<Segment>('Overview');
  const segUnderline = useRef(new Animated.Value(0)).current;

  const data = useMemo(() => ({
    Today: {
      summary: { total: 120.5, base: 90.0, tips: 18.5, bonus: 12.0, fees: 0, onlineHours: 5.6, orders: 8, distanceKm: 22 },
      series: [
        { ts: '9', base: 12, tips: 2, bonus: 0 },
        { ts: '10', base: 18, tips: 4, bonus: 2 },
        { ts: '11', base: 22, tips: 3, bonus: 2 },
        { ts: '12', base: 16, tips: 2, bonus: 3 },
        { ts: '13', base: 28, tips: 4, bonus: 6 },
        { ts: '14', base: 24, tips: 3, bonus: 4 },
      ] as TimePoint[],
      byHour: [4, 6, 7, 5, 9, 8, 1, 0],
      byWeekday: [0, 0, 0, 1, 1, 1, 0],
      byZone: [
        { zone: 'East Legon', value: 42 },
        { zone: 'Osu', value: 28 },
        { zone: 'Madina', value: 18 },
      ],
      payouts: [
        { id: 'p1', amount: 82.5, date: 'Today 5:00 PM', status: 'Scheduled' },
        { id: 'p0', amount: 620.0, date: 'Fri 5:02 PM', status: 'Paid' },
      ] as Payout[],
      orders: [
        { id: 'QK-1201', date: '12:10', store: 'FreshMart', base: 10, tips: 2, bonus: 1, fee: 0, total: 13 },
        { id: 'QK-1202', date: '12:40', store: 'Daily Needs', base: 14, tips: 3, bonus: 2, fee: 0, total: 19 },
        { id: 'QK-1203', date: '13:15', store: 'GreenGrocer', base: 12, tips: 2.5, bonus: 1, fee: 0, total: 15.5 },
      ] as OrderLite[],
    },
    Week: {
      summary: { total: 820, base: 610, tips: 120, bonus: 90, fees: 0, onlineHours: 38, orders: 62, distanceKm: 180 },
      series: [
        { ts: 'Mon', base: 120, tips: 20, bonus: 10 },
        { ts: 'Tue', base: 110, tips: 16, bonus: 10 },
        { ts: 'Wed', base: 90, tips: 18, bonus: 12 },
        { ts: 'Thu', base: 120, tips: 22, bonus: 12 },
        { ts: 'Fri', base: 160, tips: 28, bonus: 18 },
        { ts: 'Sat', base: 140, tips: 16, bonus: 20 },
        { ts: 'Sun', base: 120, tips: 20, bonus: 8 },
      ] as TimePoint[],
      byHour: [3, 4, 6, 5, 7, 9, 10, 8],
      byWeekday: [1, 1, 1, 1, 1, 1, 1],
      byZone: [
        { zone: 'East Legon', value: 200 },
        { zone: 'Osu', value: 160 },
        { zone: 'Airport', value: 140 },
      ],
      payouts: [
        { id: 'p1', amount: 650.0, date: 'Fri 5:00 PM', status: 'Scheduled' },
        { id: 'p0', amount: 720.0, date: 'Last Fri 5:03 PM', status: 'Paid' },
      ] as Payout[],
      orders: [
        { id: 'WK-2201', date: 'Mon', store: 'FreshMart', base: 12, tips: 3, bonus: 2, fee: 0, total: 17 },
        { id: 'WK-2202', date: 'Tue', store: 'Daily Needs', base: 14, tips: 2, bonus: 2, fee: 0, total: 18 },
        { id: 'WK-2203', date: 'Wed', store: 'MegaMart', base: 16, tips: 4, bonus: 3, fee: 0, total: 23 },
      ] as OrderLite[],
    },
    Month: {
      summary: { total: 3200, base: 2450, tips: 380, bonus: 370, fees: 0, onlineHours: 162, orders: 250, distanceKm: 730 },
      series: [
        { ts: 'W1', base: 820, tips: 120, bonus: 90 },
        { ts: 'W2', base: 760, tips: 110, bonus: 80 },
        { ts: 'W3', base: 820, tips: 120, bonus: 110 },
        { ts: 'W4', base: 820, tips: 130, bonus: 90 },
      ] as TimePoint[],
      byHour: [2, 4, 6, 6, 8, 9, 7, 5],
      byWeekday: [1, 1, 1, 1, 1, 1, 1],
      byZone: [
        { zone: 'East Legon', value: 800 },
        { zone: 'Osu', value: 620 },
        { zone: 'Madina', value: 410 },
      ],
      payouts: [
        { id: 'p2', amount: 650.0, date: 'Fri 5:00 PM', status: 'Scheduled' },
        { id: 'p1', amount: 720.0, date: 'Last Fri 5:03 PM', status: 'Paid' },
        { id: 'p0', amount: 680.0, date: '2 Fri ago 5:02 PM', status: 'Paid' },
      ] as Payout[],
      orders: [
        { id: 'MN-1001', date: 'W1', store: 'QuickShop', base: 12, tips: 3, bonus: 1, fee: 0, total: 16 },
      ] as OrderLite[],
    },
  }), []);

  const current = data[period];
  const hourlyRate = current.summary.onlineHours ? current.summary.total / current.summary.onlineHours : 0;
  const ordersPerHour = current.summary.onlineHours ? current.summary.orders / current.summary.onlineHours : 0;

  const switchSegment = (idx: number) => {
    setSegment(SEGMENTS[idx]);
    Animated.spring(segUnderline, { toValue: idx, useNativeDriver: true, stiffness: 180, damping: 18, mass: 0.7 } as any).start();
  };

  const chartMax = Math.max(
    ...current.series.map(p => p.base + p.tips + p.bonus),
    1
  );

  const exportCSV = async () => {
    const header = 'id,date,store,base,tips,bonus,fee,total\n';
    const rows = current.orders.map(o => `${o.id},${o.date},${o.store},${o.base},${o.tips},${o.bonus},${o.fee},${o.total}`).join('\n');
    const csv = header + rows;
    try {
      await Share.share({ message: csv });
    } catch (e) {
      Alert.alert('Export failed');
    }
  };

  return (
    <Screen style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        {/* Top segment: Overview | Breakdown | Activity | Payouts */}
        <View style={[styles.segmentRow, { borderColor: colors.primary + '22' }]}> 
          {SEGMENTS.map((s, i) => (
            <TouchableOpacity key={s} style={styles.seg} onPress={() => switchSegment(i)}>
              <Text style={[styles.segText, { color: segment === s ? colors.primary : '#6b7280' }]}>{s}</Text>
            </TouchableOpacity>
          ))}
          <Animated.View style={[styles.underline, { backgroundColor: colors.primary, transform: [{ translateX: segUnderline.interpolate({ inputRange: [0,1,2,3], outputRange: [0, 90, 180, 270] }) }] }]} />
        </View>

        {/* Period switch */}
        <View style={[styles.periodRow]}> 
          {PERIODS.map(p => (
            <TouchableOpacity key={p} onPress={() => setPeriod(p)} style={[styles.periodBtn, { backgroundColor: period === p ? colors.primary + '15' : '#f3f4f6', borderColor: period === p ? colors.primary : '#e5e7eb' }]}>
              <Text style={{ color: period === p ? colors.primary : '#6b7280', fontWeight: '800' }}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {segment === 'Overview' && (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          {/* Summary cards */}
          <View style={styles.summaryGrid}>
            <SummaryCard label="Total" value={`₵${current.summary.total.toFixed(2)}`} colors={colors} />
            <SummaryCard label="Base" value={`₵${current.summary.base.toFixed(2)}`} colors={colors} />
            <SummaryCard label="Tips" value={`₵${current.summary.tips.toFixed(2)}`} colors={colors} />
            <SummaryCard label="Bonus" value={`₵${current.summary.bonus.toFixed(2)}`} colors={colors} />
            <SummaryCard label="Hourly" value={`₵${hourlyRate.toFixed(2)}/h`} colors={colors} />
            <SummaryCard label="Orders/hr" value={ordersPerHour.toFixed(1)} colors={colors} />
          </View>

          {/* Trend (stacked bars) */}
          <Text style={[styles.sectionTitle, { color: '#111827' }]}>Earnings Trend</Text>
          <View style={[styles.stackedChart, { borderColor: colors.primary + '22' }]}> 
            {current.series.map((p, i) => {
              const total = p.base + p.tips + p.bonus;
              const totalH = Math.max(8, (total / chartMax) * 120);
              const baseH = (p.base / total) * totalH;
              const tipsH = (p.tips / total) * totalH;
              const bonusH = (p.bonus / total) * totalH;
              return (
                <View key={i} style={styles.stackBarWrapper}>
                  <View style={[styles.stackSegment, { height: bonusH, backgroundColor: '#fde68a' }]} />
                  <View style={[styles.stackSegment, { height: tipsH, backgroundColor: '#60a5fa' }]} />
                  <View style={[styles.stackSegment, { height: baseH, backgroundColor: colors.primary }]} />
                  <Text style={styles.stackLabel}>{p.ts}</Text>
                </View>
              );
            })}
          </View>

          {/* Actions */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
            <TouchableOpacity onPress={exportCSV} style={[styles.actionBtn, { backgroundColor: colors.primary }]}>
              <Text style={[styles.actionText, { color: colors.onPrimary }]}>Export CSV</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {segment === 'Breakdown' && (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          <BreakdownRow label="Base Fare" amount={current.summary.base} colors={colors} />
          <BreakdownRow label="Tips" amount={current.summary.tips} colors={colors} />
          <BreakdownRow label="Incentives" amount={current.summary.bonus} colors={colors} />
          <BreakdownRow label="Fees" amount={current.summary.fees} colors={colors} negative />

          <Text style={[styles.sectionTitle, { color: '#111827', marginTop: 12 }]}>Recent Orders</Text>
          {current.orders.map(o => (
            <View key={o.id} style={[styles.orderRow, { borderColor: colors.primary + '22', backgroundColor: colors.surface }]}> 
              <View style={{ flex: 1 }}>
                <Text style={[styles.orderId, { color: colors.onBackground }]}>{o.id} • {o.store}</Text>
                <Text style={[styles.orderSub, { color: colors.onSurface + '99' }]}>{o.date}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.orderTotal, { color: colors.primary }]}>₵{o.total.toFixed(2)}</Text>
                <Text style={[styles.orderBreakdown, { color: colors.onSurface + '99' }]}>B {o.base} / T {o.tips} / I {o.bonus}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {segment === 'Activity' && (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          <Text style={[styles.sectionTitle, { color: '#111827' }]}>Peak Hours</Text>
          <View style={[styles.barChart, { borderColor: colors.primary + '22' }]}> 
            {current.byHour.map((v, i) => {
              const h = Math.max(8, (v / Math.max(...current.byHour, 1)) * 120);
              return (
                <View key={i} style={styles.hourBarWrap}>
                  <View style={[styles.hourBar, { height: h, backgroundColor: colors.primary }]} />
                  <Text style={styles.hourLabel}>{i * 2}</Text>
                </View>
              );
            })}
          </View>

          <Text style={[styles.sectionTitle, { color: '#111827', marginTop: 12 }]}>By Zone</Text>
          {current.byZone.map(z => (
            <View key={z.zone} style={styles.zoneRow}>
              <Text style={{ flex: 1 }}>{z.zone}</Text>
              <View style={[styles.zoneBarBg, { backgroundColor: colors.primary + '22' }]}> 
                <View style={[styles.zoneBarFill, { width: `${Math.min(100, (z.value / (current.byZone[0].value || 1)) * 100)}%`, backgroundColor: colors.primary }]} />
              </View>
              <Text style={[styles.zoneValue, { color: colors.onBackground }]}>₵{z.value}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {segment === 'Payouts' && (
        <PayoutsView colors={colors} payouts={current.payouts} amountDue={current.summary.total * 0.8} />
      )}
    </Screen>
  );
}

function SummaryCard({ label, value, colors }: { label: string; value: string | number; colors: any }) {
  return (
    <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.primary + '22' }]}> 
      <Text style={[styles.summaryLabel, { color: '#6b7280' }]}>{label}</Text>
      <Text style={[styles.summaryValue, { color: '#111827' }]}>{value}</Text>
    </View>
  );
}

function BreakdownRow({ label, amount, colors, negative }: { label: string; amount: number; colors: any; negative?: boolean }) {
  return (
    <View style={[styles.breakdownRow, { borderColor: colors.primary + '22' }]}> 
      <Text style={styles.breakdownLabel}>{label}</Text>
      <Text style={[styles.breakdownAmount, { color: negative ? '#ef4444' : '#111827' }]}>₵{amount.toFixed(2)}</Text>
    </View>
  );
}

function PayoutsView({ colors, payouts, amountDue }: { colors: any; payouts: Payout[]; amountDue: number }) {
  const [visible, setVisible] = useState(false);
  const [amount, setAmount] = useState(() => amountDue.toFixed(2));
  const fee = Math.max(1, Math.round((parseFloat(amount || '0') * 0.01 + Number.EPSILON) * 100) / 100);

  const cashout = () => {
    setVisible(false);
    Alert.alert('Cashout requested', `₵${amount} • Fee ₵${fee.toFixed(2)}`);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
      <View style={[styles.payoutCard, { backgroundColor: colors.surface, borderColor: colors.primary + '22' }]}> 
        <Text style={[styles.payoutTitle, { color: colors.onBackground }]}>Next Payout</Text>
        <Text style={[styles.payoutAmount, { color: colors.primary }]}>₵{amountDue.toFixed(2)}</Text>
        <Text style={{ color: colors.onSurface + '99' }}>Scheduled: Fri, 5:00 PM</Text>
        <View style={{ height: 12 }} />
        <TouchableOpacity style={[styles.withdrawBtn, { backgroundColor: colors.primary }]} onPress={() => setVisible(true)}>
          <Text style={[styles.withdrawText, { color: colors.onPrimary }]}>Instant Cashout</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: '#111827', marginTop: 12 }]}>History</Text>
      {payouts.map(p => (
        <View key={p.id} style={[styles.payoutRow, { borderColor: colors.primary + '22', backgroundColor: colors.surface }]}> 
          <Text style={styles.payoutDate}>{p.date}</Text>
          <Text style={[styles.payoutStatus, { color: p.status === 'Paid' ? '#10b981' : p.status === 'Failed' ? '#ef4444' : '#6b7280' }]}>{p.status}</Text>
          <Text style={[styles.payoutValue, { color: colors.onBackground }]}>₵{p.amount.toFixed(2)}</Text>
        </View>
      ))}

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={styles.cashoutBackdrop}>
          <View style={[styles.cashoutCard, { backgroundColor: colors.surface }]}> 
            <Text style={styles.cashoutTitle}>Instant Cashout</Text>
            <TextInput value={amount} onChangeText={setAmount} keyboardType="decimal-pad" style={styles.cashoutInput} placeholder="Amount" />
            <Text style={styles.cashoutFee}>Fee: ₵{fee.toFixed(2)}</Text>
            <View style={styles.formActions}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#e5e7eb' }]} onPress={() => setVisible(false)}>
                <Text style={[styles.actionText, { color: '#111827' }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#111827' }]} onPress={cashout}>
                <Text style={[styles.actionText, { color: '#fff' }]}>Cashout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  segmentRow: { flexDirection: 'row', borderWidth: 1, borderRadius: 999, padding: 6, position: 'relative' },
  seg: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  segText: { fontSize: 14, fontWeight: '800' },
  underline: { position: 'absolute', height: 28, width: 80, borderRadius: 999, left: 6, top: 6 },
  periodRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  periodBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1 },

  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  summaryCard: { flexBasis: '47%', borderWidth: 1, borderRadius: 12, padding: 14 },
  summaryLabel: { fontSize: 12 },
  summaryValue: { fontSize: 18, fontWeight: '800', marginTop: 6 },

  sectionTitle: { fontSize: 16, fontWeight: '800', marginTop: 16, marginBottom: 8 },

  stackedChart: { flexDirection: 'row', alignItems: 'flex-end', borderWidth: 1, borderRadius: 12, padding: 12, gap: 14, height: 180 },
  stackBarWrapper: { alignItems: 'center', justifyContent: 'flex-end' },
  stackSegment: { width: 18, borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  stackLabel: { fontSize: 10, marginTop: 6 },

  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 8 },
  breakdownLabel: { fontSize: 14, fontWeight: '700' },
  breakdownAmount: { fontSize: 14, fontWeight: '800' },

  orderRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, padding: 12, marginTop: 8 },
  orderId: { fontSize: 14, fontWeight: '800' },
  orderSub: { fontSize: 12, marginTop: 2 },
  orderTotal: { fontSize: 16, fontWeight: '800' },
  orderBreakdown: { fontSize: 10, marginTop: 2 },

  barChart: { flexDirection: 'row', alignItems: 'flex-end', borderWidth: 1, borderRadius: 12, padding: 12, gap: 12, height: 180 },
  hourBarWrap: { alignItems: 'center', justifyContent: 'flex-end' },
  hourBar: { width: 20, borderRadius: 8 },
  hourLabel: { fontSize: 10, marginTop: 6 },

  zoneRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  zoneBarBg: { flex: 1, height: 12, borderRadius: 999, overflow: 'hidden' },
  zoneBarFill: { height: 12, borderRadius: 999 },
  zoneValue: { width: 64, textAlign: 'right', fontWeight: '700' },

  payoutCard: { borderWidth: 1, borderRadius: 12, padding: 14 },
  payoutTitle: { fontSize: 14, fontWeight: '800' },
  payoutAmount: { fontSize: 20, fontWeight: '800', marginVertical: 4 },
  withdrawBtn: { paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  withdrawText: { fontSize: 14, fontWeight: '800' },

  payoutRow: { flexDirection: 'row', borderWidth: 1, borderRadius: 12, padding: 12, marginTop: 8, alignItems: 'center' },
  payoutDate: { flex: 1, fontSize: 12 },
  payoutStatus: { width: 90, textAlign: 'center', fontWeight: '700' },
  payoutValue: { width: 80, textAlign: 'right', fontWeight: '800' },

  cashoutBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  cashoutCard: { width: '100%', maxWidth: 360, borderRadius: 16, padding: 16 },
  cashoutTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  cashoutInput: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  cashoutFee: { fontSize: 12, color: '#6b7280', marginTop: 8 },

  actionBtn: { paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  actionText: { fontSize: 14, fontWeight: '800' },
  formActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
});


