import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Animated, Easing, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';

export default function ShopperDashboard({ navigation }: any) {
  const { colors } = useTheme();
  const [isOnline, setIsOnline] = useState(false);
  const kpiFade = useRef(new Animated.Value(0)).current;
  const bannerHeight = useRef(new Animated.Value(0)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslate = useRef(new Animated.Value(16)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;
  const tickerOpacity = useRef(new Animated.Value(0)).current;
  const [tickerIndex, setTickerIndex] = useState(0);
  const blobs = useRef(Array.from({ length: 5 }, () => new Animated.Value(0))).current;

  const kpis = useMemo(() => ([
    { label: 'Earnings', value: '₵120.50' },
    { label: 'Orders', value: '8' },
    { label: 'On-time', value: '98%' },
  ]), []);

  useEffect(() => {
    Animated.timing(kpiFade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    Animated.parallel([
      Animated.timing(heroOpacity, { toValue: 1, duration: 600, useNativeDriver: true, delay: 150 }),
      Animated.timing(heroTranslate, { toValue: 0, duration: 600, useNativeDriver: true, delay: 150 }),
    ]).start();

    blobs.forEach((v, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, { toValue: 1, duration: 7000 + i * 500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(v, { toValue: 0, duration: 7000 + i * 500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ])
      ).start();
    });

    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(tickerOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
        Animated.timing(tickerOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
      ]).start();
      setTickerIndex((i) => (i + 1) % 4);
    }, 2600);
    Animated.timing(tickerOpacity, { toValue: 1, duration: 600, useNativeDriver: true, delay: 500 }).start();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.timing(bannerHeight, {
      toValue: isOnline ? 52 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isOnline]);

  return (
    <Screen style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Decorative Background Blobs */}
      <View pointerEvents="none" style={styles.blobsLayer}>
        {blobs.map((v, i) => {
          const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [10 * (i + 1), -12 * (i + 1)] });
          const translateX = v.interpolate({ inputRange: [0, 1], outputRange: [(-1) ** i * 8, (-1) ** (i + 1) * 8] });
          const scale = v.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1.1] });
          return (
            <Animated.View
              key={i}
              style={[styles.blob, { top: 40 + i * 90, left: 20 + (i % 3) * 110, transform: [{ translateY }, { translateX }, { scale }], backgroundColor: i % 2 ? colors.primary + '22' : '#FFE0B2' }]}
            />
          );
        })}
      </View>
      <Animated.View style={[styles.banner, { backgroundColor: isOnline ? '#DCFCE7' : '#F3F4F6', height: bannerHeight }]}> 
        {isOnline && <Text style={[styles.bannerText, { color: '#065F46' }]}>You are Online</Text>}
      </Animated.View>

      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.onBackground }]}>Welcome back</Text>
        <View style={styles.statusRow}>
          <Text style={[styles.statusLabel, { color: colors.onBackground }]}>{isOnline ? 'Online' : 'Offline'}</Text>
          <Switch value={isOnline} onValueChange={setIsOnline} thumbColor={'#fff'} trackColor={{ false: '#d1d5db', true: colors.primary }} />
        </View>
      </View>

      {/* Hero Card */}
      <Animated.View style={{ opacity: heroOpacity, transform: [{ translateY: heroTranslate }] }}>
        <LinearGradient colors={[colors.primary + '1A', '#FFFFFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.hero, { borderColor: colors.primary + '33' }]}> 
          <View style={styles.heroLeft}>
            <Text style={[styles.heroTitle, { color: colors.onBackground }]}>Deliver. Earn. Grow.</Text>
            <Animated.Text style={[styles.ticker, { color: colors.onSurface + 'CC', opacity: tickerOpacity }]}>
              {['Earn weekly payouts', 'Flexible shifts', '24/7 support', 'Secure payments'][tickerIndex]}
            </Animated.Text>
            <Animated.View style={{ transform: [{ scale: pulseScale }] }}>
              <TouchableOpacity
                onPressIn={() => Animated.spring(pulseScale, { toValue: 0.98, useNativeDriver: true }).start()}
                onPressOut={() => Animated.spring(pulseScale, { toValue: 1, useNativeDriver: true }).start()}
                onPress={() => setIsOnline(!isOnline)}
                style={[styles.heroCta, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.heroCtaText}>{isOnline ? 'Go Offline' : 'Go Online'}</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
          <View style={styles.heroRight}>
            <Text style={styles.heroEmoji}>🚚</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View style={{ opacity: kpiFade, transform: [{ translateY: kpiFade.interpolate({ inputRange: [0,1], outputRange: [10,0] }) }] }}>
        <View style={styles.kpiRow}>
          {kpis.map((k) => (
            <View key={k.label} style={[styles.kpiCard, { backgroundColor: colors.surface, borderColor: colors.primary + '22' }]}>
              <Text style={[styles.kpiValue, { color: colors.onBackground }]}>{k.value}</Text>
              <Text style={[styles.kpiLabel, { color: colors.onSurface + 'CC' }]}>{k.label}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Quick Actions</Text>
      <View style={styles.grid}>
        <QuickAction label="View Schedule" icon="🗓️" onPress={() => {}} colors={colors} />
        <QuickAction label="Performance" icon="📈" onPress={() => {}} colors={colors} />
        <QuickAction label="Support" icon="🆘" onPress={() => navigation.navigate('HelpCenter')} colors={colors} />
        <QuickAction label="Settings" icon="⚙️" onPress={() => {}} colors={colors} />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.onBackground, marginTop: 16 }]}>Next Task</Text>
      <View style={[styles.taskCard, { backgroundColor: colors.surface, borderColor: colors.primary + '22' }]}> 
        <View style={styles.taskLeft}>
          <Text style={[styles.taskTitle, { color: colors.onBackground }]}>Pickup: FreshMart</Text>
          <Text style={[styles.taskSub, { color: colors.onSurface + 'CC' }]}>2.1 km • ETA 12:30–12:40</Text>
          <View style={styles.badgeRow}>
            <Badge text="₵18.50" colors={colors} />
            <Badge text="4 items" colors={colors} />
          </View>
        </View>
        <View style={styles.taskActions}>
          <IconButton text="Chat" onPress={() => {}} colors={colors} />
          <IconButton text="Call" onPress={() => {}} colors={colors} />
          <IconButton text="Navigate" onPress={() => {}} colors={colors} />
        </View>
      </View>
    </Screen>
  );
}

function QuickAction({ label, icon, onPress, colors }: { label: string; icon: string; onPress: () => void; colors: any }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.tile, { borderColor: colors.primary + '22' }]}> 
      <Text style={styles.tileIcon}>{icon}</Text>
      <Text style={[styles.tileLabel, { color: '#374151' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function Badge({ text, colors }: { text: string; colors: any }) {
  return (
    <View style={[styles.badge, { backgroundColor: colors.primary + '22' }]}>
      <Text style={[styles.badgeText, { color: colors.primary }]}>{text}</Text>
    </View>
  );
}

function IconButton({ text, onPress, colors }: { text: string; onPress: () => void; colors: any }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.iconBtn, { backgroundColor: colors.primary }]}> 
      <Text style={[styles.iconBtnText, { color: colors.onPrimary }]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: { alignItems: 'center', justifyContent: 'center' },
  bannerText: { fontSize: 12, fontWeight: '700' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16 },
  title: { fontSize: 18, fontWeight: '800' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusLabel: { fontSize: 12, fontWeight: '700' },
  kpiRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginTop: 16 },
  kpiCard: { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 12 },
  kpiValue: { fontSize: 18, fontWeight: '800' },
  kpiLabel: { fontSize: 12, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginTop: 8, paddingHorizontal: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 16, marginTop: 12 },
  tile: { width: '47%', borderWidth: 1, borderRadius: 12, padding: 16, alignItems: 'center' },
  tileIcon: { fontSize: 22, marginBottom: 8 },
  tileLabel: { fontSize: 14, fontWeight: '700' },
  blobsLayer: { position: 'absolute', width: '100%', height: '100%' },
  blob: { position: 'absolute', width: 120, height: 120, borderRadius: 80, opacity: 0.6 },
  hero: { marginHorizontal: 16, marginTop: 12, borderRadius: 16, padding: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
  heroLeft: { flex: 1 },
  heroRight: { paddingLeft: 12 },
  heroEmoji: { fontSize: 44 },
  heroTitle: { fontSize: 20, fontWeight: '900' },
  ticker: { marginTop: 4 },
  heroCta: { marginTop: 12, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, alignItems: 'center', alignSelf: 'flex-start', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  heroCtaText: { color: 'white', fontWeight: '800' },
  taskCard: { flexDirection: 'row', borderWidth: 1, borderRadius: 14, marginHorizontal: 16, padding: 14, alignItems: 'center' },
  taskLeft: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: '800' },
  taskSub: { fontSize: 12, marginTop: 4 },
  badgeRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  taskActions: { gap: 8 },
  iconBtn: { borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, alignItems: 'center' },
  iconBtnText: { fontSize: 12, fontWeight: '800' },
});



