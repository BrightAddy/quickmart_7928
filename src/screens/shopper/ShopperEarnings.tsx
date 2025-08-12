import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert, Share, LayoutChangeEvent } from 'react-native';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';

const PERIODS = ['Today', 'Week', 'Month'] as const;

type Period = typeof PERIODS[number];

type TimePoint = { ts: string; base: number; tips: number; bonus: number };
type Payout = { id: string; amount: number; date: string; status: 'Scheduled' | 'Paid' | 'Failed' };
type OrderLite = { id: string; date: string; store: string; base: number; tips: number; bonus: number; fee: number; total: number };

export default function ShopperEarnings() {
  const { colors } = useTheme();
  const [period, setPeriod] = useState<Period>('Today');
  // removed segmented tabs

  // Chart layout state (for responsive bars)
  const [chartWidth, setChartWidth] = useState(0);
  const chartInnerHeight = 140; // drawing height for bars/grid
  const [showCashInfo, setShowCashInfo] = useState(false);
  const [cashoutOpenKey, setCashoutOpenKey] = useState(0);

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

  // no segments to switch

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
        {/* Hero earnings card with period switch */}
        <View style={[styles.heroCard, { borderColor: colors.primary + '22', backgroundColor: colors.surface }]}>
          <View style={[styles.periodRow]}> 
            {PERIODS.map(p => (
              <TouchableOpacity key={p} onPress={() => setPeriod(p)} style={[styles.periodBtn, { backgroundColor: period === p ? colors.primary : '#eef2ff', borderColor: period === p ? colors.primary : '#e5e7eb' }]}>
                <Text style={{ color: period === p ? '#fff' : colors.primary, fontWeight: '800' }}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.heroLabel, { color: '#6b7280' }]}>Total Earnings</Text>
          <Text style={[styles.heroValue, { color: '#111827' }]}>₵{current.summary.total.toFixed(2)}</Text>

          <View style={styles.heroStatsRow}>
            <MiniStat label="Base Pay" value={`₵${current.summary.base.toFixed(2)}`} tint="#4464EB" />
            <MiniStat label="Tips" value={`₵${current.summary.tips.toFixed(2)}`} tint="#34d399" />
            <MiniStat label="Orders" value={`${current.summary.orders}`} tint="#6b7280" />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          {/* Available for Cashout */}
          <View style={[styles.cashoutCardLite, { borderColor: colors.primary + '22', backgroundColor: colors.surface }]}> 
            <Text style={[styles.cashoutTitleTop, { color: '#6b7280' }]}>Available for Cashout</Text>
            <Text style={[styles.cashoutBig, { color: colors.primary }]}>₵{(current.summary.total * 0).toFixed(2)}</Text>

            <TouchableOpacity onPress={() => setShowCashInfo(v => !v)} style={styles.cashInfoToggle}>
              <Text style={[styles.cashInfoText, { color: colors.primary }]}>Cashout Information</Text>
              <Text style={{ color: colors.primary }}>{showCashInfo ? '\u25B2' : '\u25BC'}</Text>
            </TouchableOpacity>

            {showCashInfo && (
              <View style={{ marginTop: 6, backgroundColor: '#f9fafb', borderRadius: 10, padding: 10 }}>
                <Text style={styles.infoLine}>• Cashouts arrive instantly to your mobile wallet.</Text>
                <Text style={styles.infoLine}>• A small fee may apply depending on amount.</Text>
                <Text style={styles.infoLine}>• Daily limit resets at 5:00 PM.</Text>
              </View>
            )}

            <TouchableOpacity onPress={() => { setCashoutOpenKey(k => k + 1); }} style={[styles.cashoutBtn, { backgroundColor: '#4464EB' }]}>
              <Text style={styles.cashoutBtnText}>Cash Out Now</Text>
            </TouchableOpacity>
          </View>

          {/* Trend (stacked bars) */}
          <Text style={[styles.sectionTitle, { color: '#111827' }]}>Earnings Trend</Text>
          <View
            style={[styles.stackedChart, { borderColor: colors.primary + '22' }]}
            onLayout={(e: LayoutChangeEvent) => setChartWidth(e.nativeEvent.layout.width - 34 /* left axis padding */)}
          >
            {/* Y-axis grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((t) => {
              const y = 12 + (1 - t) * chartInnerHeight; // 12 top padding inside chart
              const val = Math.round(chartMax * t);
              return (
                <View key={t} style={{ position: 'absolute', left: 34, right: 12, top: y, height: 1, backgroundColor: colors.primary + '15' }} />
              );
            })}

            {/* Y-axis labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((t) => {
              const y = 6 + (1 - t) * chartInnerHeight; // small offset
              const val = Math.round(chartMax * t);
              return (
                <Text key={`lbl-${t}`} style={{ position: 'absolute', left: 0, top: y - 6, width: 30, textAlign: 'right', fontSize: 10, color: '#6b7280' }}>₵{val}</Text>
              );
            })}

            {/* Bars */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: chartInnerHeight + 12, marginTop: 12, paddingLeft: 34, gap: 12 }}>
              {current.series.map((p, i) => {
                const total = p.base + p.tips + p.bonus;
                const totalH = Math.max(8, (total / chartMax) * chartInnerHeight);
                const baseH = (p.base / Math.max(total, 1)) * totalH;
                const tipsH = (p.tips / Math.max(total, 1)) * totalH;
                const bonusH = (p.bonus / Math.max(total, 1)) * totalH;
                // Bar width responsive to available space
                const count = current.series.length;
                const computedBarWidth = chartWidth ? Math.max(14, Math.min(28, (chartWidth - (count - 1) * 12) / count)) : 18;
                return (
                  <View key={i} style={[styles.stackBarWrapper, { width: computedBarWidth + 4 }]}> 
                    <View style={[styles.stackSegment, { height: bonusH, width: computedBarWidth, backgroundColor: '#fbbf24' }]} />
                    <View style={[styles.stackSegment, { height: tipsH, width: computedBarWidth, backgroundColor: '#34d399' }]} />
                    <View style={[styles.stackSegment, { height: baseH, width: computedBarWidth, backgroundColor: colors.primary }]} />
                    <Text style={styles.stackLabel}>{p.ts}</Text>
                  </View>
                );
              })}
            </View>

            {/* Legend */}
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8, paddingLeft: 34 }}>
              <LegendDot color={colors.primary} label="Base" />
              <LegendDot color="#34d399" label="Tips" />
              <LegendDot color="#fbbf24" label="Bonus" />
            </View>
          </View>

          {/* Actions */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
            <TouchableOpacity onPress={exportCSV} style={[styles.actionBtn, { backgroundColor: colors.primary }]}>
              <Text style={[styles.actionText, { color: colors.onPrimary }]}>Export CSV</Text>
            </TouchableOpacity>
          </View>
        {/* Payouts */}
        <Text style={[styles.sectionTitle, { color: '#111827', marginTop: 12 }]}>Payouts</Text>
        <PayoutsView colors={colors} payouts={current.payouts} amountDue={current.summary.total * 0.8} openKey={cashoutOpenKey} />
      </ScrollView>
    </Screen>
  );
}

// deprecated helper components removed (summary/breakdown)

function PayoutsView({ colors, payouts, amountDue, openKey }: { colors: any; payouts: Payout[]; amountDue: number; openKey?: number }) {
  const [visible, setVisible] = useState(false);
  const [amount, setAmount] = useState(() => amountDue.toFixed(2));
  const fee = Math.max(1, Math.round((parseFloat(amount || '0') * 0.01 + Number.EPSILON) * 100) / 100);

  useEffect(() => {
    if (openKey && openKey > 0) {
      setVisible(true);
    }
  }, [openKey]);

  const cashout = () => {
    setVisible(false);
    Alert.alert('Cashout requested', `₵${amount} • Fee ₵${fee.toFixed(2)}`);
  };

  const max = Math.max(0, amountDue);
  const parsed = parseFloat(amount || '0') || 0;
  const disabled = parsed <= 0 || parsed > max;

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
            <View style={styles.cashoutHeader}>
              <Text style={styles.cashoutTitle}>Instant Cashout</Text>
              <TouchableOpacity onPress={() => setVisible(false)} style={[styles.closeBtn, { backgroundColor: colors.primary + '12' }]}> 
                <Text style={[styles.closeBtnText, { color: colors.primary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.amountRow, { borderColor: colors.primary + '33' }]}>
              <View style={[styles.currencyBadge, { backgroundColor: colors.primary + '15' }]}> 
                <Text style={[styles.currencyText, { color: colors.primary }]}>₵</Text>
              </View>
              <TextInput value={amount} onChangeText={setAmount} keyboardType="decimal-pad" style={styles.amountInput} placeholder="0.00" />
            </View>
            <Text style={styles.cashoutFee}>Fee: ₵{fee.toFixed(2)}</Text>

            <View style={styles.quickChips}>
              {[0.25, 0.5, 0.75, 1].map((p) => (
                <TouchableOpacity key={p} onPress={() => setAmount((max * p).toFixed(2))} style={[styles.chip, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '33' }]}>
                  <Text style={[styles.chipText, { color: colors.primary }]}>{Math.round(p * 100)}%</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity style={[styles.ghostBtn, { borderColor: '#e5e7eb' }]} onPress={() => setVisible(false)}>
                <Text style={[styles.ghostBtnText, { color: '#111827' }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity disabled={disabled} style={[styles.primaryBtn, { backgroundColor: colors.primary, opacity: disabled ? 0.5 : 1 }]} onPress={cashout}>
                <Text style={[styles.primaryBtnText, { color: colors.onPrimary }]}>Cashout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color }} />
      <Text style={{ fontSize: 12, color: '#6b7280' }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // segmented control removed
  periodRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  periodBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1 },
  heroCard: { borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 12 },
  heroLabel: { fontSize: 12, marginTop: 8, textAlign: 'center' },
  heroValue: { fontSize: 28, fontWeight: '900', textAlign: 'center', marginTop: 4 },
  heroStatsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },

  sectionTitle: { fontSize: 16, fontWeight: '800', marginTop: 16, marginBottom: 8 },

  stackedChart: { borderWidth: 1, borderRadius: 12, padding: 12, paddingLeft: 12, height: 220 },
  stackBarWrapper: { alignItems: 'center', justifyContent: 'flex-end' },
  stackSegment: { borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  stackLabel: { fontSize: 10, marginTop: 6 },

  // removed unused styles from old sections

  payoutCard: { borderWidth: 1, borderRadius: 12, padding: 14 },
  payoutTitle: { fontSize: 14, fontWeight: '800' },
  payoutAmount: { fontSize: 20, fontWeight: '800', marginVertical: 4 },
  withdrawBtn: { paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  withdrawText: { fontSize: 14, fontWeight: '800' },
  cashoutCardLite: { borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 6 },
  cashoutTitleTop: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
  cashoutBig: { fontSize: 22, fontWeight: '900', textAlign: 'center', marginTop: 2 },
  cashInfoToggle: { marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cashInfoText: { fontSize: 12, fontWeight: '800' },
  infoLine: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  cashoutBtn: { marginTop: 12, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  cashoutBtnText: { color: '#fff', fontWeight: '800' },

  payoutRow: { flexDirection: 'row', borderWidth: 1, borderRadius: 12, padding: 12, marginTop: 8, alignItems: 'center' },
  payoutDate: { flex: 1, fontSize: 12 },
  payoutStatus: { width: 90, textAlign: 'center', fontWeight: '700' },
  payoutValue: { width: 80, textAlign: 'right', fontWeight: '800' },

  cashoutBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  cashoutCard: { width: '100%', maxWidth: 380, borderRadius: 20, padding: 16, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 },
  cashoutHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  cashoutTitle: { fontSize: 18, fontWeight: '900' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  closeBtnText: { fontSize: 16, fontWeight: '900' },
  amountRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, marginTop: 8 },
  currencyBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  currencyText: { fontSize: 14, fontWeight: '900' },
  amountInput: { flex: 1, fontSize: 18, fontWeight: '800', paddingVertical: 8 },
  cashoutFee: { fontSize: 12, color: '#6b7280', marginTop: 6 },
  quickChips: { flexDirection: 'row', gap: 8, marginTop: 10 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  chipText: { fontSize: 12, fontWeight: '800' },

  formActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  ghostBtn: { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  ghostBtnText: { fontSize: 14, fontWeight: '800' },
  primaryBtn: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  primaryBtnText: { fontSize: 14, fontWeight: '800' },
  actionBtn: { paddingVertical: 10, borderRadius: 10, alignItems: 'center', paddingHorizontal: 12 },
  actionText: { fontSize: 14, fontWeight: '800' },
});


function MiniStat({ label, value, tint }: { label: string; value: string; tint: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: tint + '22' as any, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: tint, fontWeight: '900' }}>•</Text>
      </View>
      <Text style={{ fontSize: 10, color: '#6b7280', marginTop: 6 }}>{label}</Text>
      <Text style={{ fontSize: 12, fontWeight: '800', marginTop: 2 }}>{value}</Text>
    </View>
  );
}


