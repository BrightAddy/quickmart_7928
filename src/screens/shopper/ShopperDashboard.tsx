import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Animated, ScrollView, TextInput, Modal, Alert } from 'react-native';
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
  const vehicleOpacity = useRef(new Animated.Value(1)).current;
  const [vehicleIndex, setVehicleIndex] = useState(0); // 0: bike, 1: car
  const [locationText, setLocationText] = useState('Spintex Rd, Accra');
  const [todayEarnings] = useState('₵120.50');
  const [showLocationEdit, setShowLocationEdit] = useState(false);
  const [tempLocation, setTempLocation] = useState(locationText);

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

    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(tickerOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
        Animated.timing(tickerOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
      ]).start();
      setTickerIndex((i) => (i + 1) % 4);
    }, 2600);
    Animated.timing(tickerOpacity, { toValue: 1, duration: 600, useNativeDriver: true, delay: 500 }).start();

    const vehicleTimer = setInterval(() => {
      Animated.timing(vehicleOpacity, { toValue: 0, duration: 600, useNativeDriver: true }).start(({ finished }) => {
        if (finished) {
          setVehicleIndex((i) => (i + 1) % 2);
          Animated.timing(vehicleOpacity, { toValue: 1, duration: 800, useNativeDriver: true }).start();
        }
      });
    }, 6000);

    return () => { clearInterval(interval); clearInterval(vehicleTimer); };
  }, []);

  const handleLocationPress = () => {
    setShowLocationEdit(true);
    setTempLocation(locationText);
  };

  const handleLocationSave = () => {
    if (tempLocation.trim()) {
      setLocationText(tempLocation.trim());
      setShowLocationEdit(false);
    } else {
      Alert.alert('Invalid Location', 'Please enter a valid location');
    }
  };

  const handleLocationCancel = () => {
    setTempLocation(locationText);
    setShowLocationEdit(false);
  };

  const handleProfilePress = () => {
    Alert.alert('Profile', 'Profile settings will be available soon');
  };

  const handleNotificationPress = () => {
    Alert.alert('Notifications', 'You have 3 new notifications');
  };

  useEffect(() => {
    Animated.timing(bannerHeight, {
      toValue: isOnline ? 52 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isOnline]);

  return (
    <Screen style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Delivery status card moved into hero below */}
      <Animated.View style={[styles.banner, { backgroundColor: isOnline ? '#DCFCE7' : '#F3F4F6', height: bannerHeight }]}> 
        {isOnline && <Text style={[styles.bannerText, { color: '#065F46' }]}>You are Online</Text>}
      </Animated.View>

      {/* Hero Card with location, profile, notifications */}
      <Animated.View style={{ opacity: heroOpacity, transform: [{ translateY: heroTranslate }] }}>
        <LinearGradient colors={[colors.primary + '1A', '#FFFFFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.hero, { borderColor: colors.primary + '33' }]}> 
          {/* Header row inside hero */}
          <View style={styles.heroHeader}>
            <TouchableOpacity onPress={handleLocationPress} style={styles.locationContainer}>
              <Text style={[styles.locationText, { color: colors.onSurface }]}>📍 {locationText}</Text>
            </TouchableOpacity>
            <View style={styles.topRight}>
              <TouchableOpacity onPress={handleProfilePress} style={[styles.avatar, { backgroundColor: colors.surface, borderColor: colors.primary + '22' }]}>
                <Text style={{ fontSize: 14, color: colors.onSurface }}>👤</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNotificationPress}>
                <Text style={[styles.bell, { color: colors.onSurface }]}>🔔</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.heroContent}>
            <View style={styles.heroLeft}>
              <Text style={[styles.heroTitle, { color: colors.onBackground }]}>Deliver. Earn. Grow.</Text>
              <Animated.Text style={[styles.ticker, { color: colors.onSurface + 'CC', opacity: tickerOpacity }]}>
                {['Earn weekly payouts', 'Flexible shifts', '24/7 support', 'Secure payments'][tickerIndex]}
              </Animated.Text>
              <View style={styles.inlineStatusRow}>
                <Text style={[styles.statusTitle, { color: colors.onSurface }]}>Open to delivery</Text>
                <View style={styles.switchRow}>
                  <Text style={[styles.switchLabel, { color: colors.onSurface }]}>{isOnline ? 'Online' : 'Offline'}</Text>
                  <Switch value={isOnline} onValueChange={setIsOnline} thumbColor={'#fff'} trackColor={{ false: '#d1d5db', true: colors.primary }} />
                </View>
              </View>
              <View style={{ marginTop: 10 }}>
                <Text style={[styles.earningsLabel, { color: colors.onSurface + 'CC' }]}>Today's Earnings</Text>
                <Text style={[styles.earningsAmount, { color: colors.primary }]}>{todayEarnings}</Text>
              </View>
            </View>
          </View>
          
          {/* Vehicle positioned at bottom right */}
          <View style={styles.vehicleContainer}>
            <Animated.Text style={[styles.heroEmoji, { opacity: vehicleOpacity }]}>
              {vehicleIndex === 0 ? '🛵' : '🚗'}
            </Animated.Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Location Edit Modal */}
      <Modal visible={showLocationEdit} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.onSurface }]}>Update Location</Text>
            <TextInput
              style={[styles.modalInput, { borderColor: colors.primary + '33', color: colors.onSurface }]}
              value={tempLocation}
              onChangeText={setTempLocation}
              placeholder="Enter your location"
              placeholderTextColor={colors.onSurface + '66'}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleLocationCancel} style={[styles.modalButton, { backgroundColor: colors.onSurface + '22' }]}>
                <Text style={[styles.modalButtonText, { color: colors.onSurface }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLocationSave} style={[styles.modalButton, { backgroundColor: colors.primary }]}>
                <Text style={[styles.modalButtonText, { color: 'white' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  // Header removed
  kpiRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginTop: 16 },
  kpiCard: { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 12 },
  kpiValue: { fontSize: 18, fontWeight: '800' },
  kpiLabel: { fontSize: 12, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginTop: 8, paddingHorizontal: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 16, marginTop: 12 },
  tile: { width: '47%', borderWidth: 1, borderRadius: 12, padding: 16, alignItems: 'center' },
  tileIcon: { fontSize: 22, marginBottom: 8 },
  tileLabel: { fontSize: 14, fontWeight: '700' },
   hero: { marginTop: 12, borderRadius: 16, padding: 16, borderWidth: 1, flexDirection: 'column', position: 'relative' },
   heroHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
   heroContent: { flexDirection: 'row', alignItems: 'center' },
   heroLeft: { flex: 1 },
   heroRight: { paddingLeft: 12 },
   vehicleContainer: { position: 'absolute', bottom: 16, right: 16 },
   heroEmoji: { fontSize: 44 },
   heroTitle: { fontSize: 20, fontWeight: '900' },
   ticker: { marginTop: 4 },
   heroCta: { marginTop: 12, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, alignItems: 'center', alignSelf: 'flex-start', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
   heroCtaText: { color: 'white', fontWeight: '800' },
   topRow: { paddingHorizontal: 16, paddingTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
   topCard: { marginHorizontal: 16, marginTop: 12, borderRadius: 14, borderWidth: 1, paddingVertical: 10 },
   locationContainer: { flex: 1 },
   locationText: { fontSize: 12, fontWeight: '700' },
   topRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
   avatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#eee' },
   bell: { fontSize: 18 },
   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
   modalContent: { backgroundColor: 'white', borderRadius: 16, padding: 20, width: 300, alignItems: 'center' },
   modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
   modalInput: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, width: '100%', marginBottom: 20 },
   modalButtons: { flexDirection: 'row', gap: 12 },
   modalButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, minWidth: 80, alignItems: 'center' },
   modalButtonText: { fontSize: 16, fontWeight: '600' },
  // statusCard removed
  statusTitle: { fontSize: 12, fontWeight: '700' },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  switchLabel: { fontSize: 12, fontWeight: '700' },
  earningsLabel: { fontSize: 12, fontWeight: '700' },
  earningsAmount: { fontSize: 24, fontWeight: '900' },
  inlineStatusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
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



