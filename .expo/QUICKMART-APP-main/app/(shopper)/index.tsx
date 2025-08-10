import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  MapPin,
  Clock,
  DollarSign,
  Star,
  ChevronRight,
  AlertCircle,
  Gift,
  TrendingUp,
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';

interface AvailableBatch {
  id: string;
  storeName: string;
  location: string;
  distance: string;
  items: number;
  payment: number;
  tip: number;
  estimatedTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const mockBatches: AvailableBatch[] = [
  {
    id: '1',
    storeName: 'MaxMart Osu',
    location: 'Osu, Accra',
    distance: '2.1 km',
    items: 12,
    payment: 45,
    tip: 8,
    estimatedTime: '45 min',
    difficulty: 'Easy',
  },
  {
    id: '2',
    storeName: 'ShopRite East Legon',
    location: 'East Legon, Accra',
    distance: '3.8 km',
    items: 24,
    payment: 65,
    tip: 12,
    estimatedTime: '1h 15min',
    difficulty: 'Medium',
  },
  {
    id: '3',
    storeName: 'Palace Hypermarket',
    location: 'Spintex, Accra',
    distance: '5.2 km',
    items: 8,
    payment: 35,
    tip: 5,
    estimatedTime: '35 min',
    difficulty: 'Easy',
  },
];

export default function ShopperHome() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const Colors = getColors(isDarkMode);
  const [isOnline, setIsOnline] = useState(false);
  const [todayEarnings] = useState(82);
  const [weeklyEarnings] = useState(456);

  const handleGoOnline = () => {
    setIsOnline(!isOnline);
    if (!isOnline) {
      Alert.alert(
        'You\'re now online!',
        'You\'ll start receiving batch notifications.',
        [{ text: 'Got it', style: 'default' }]
      );
    }
  };

  const handleAcceptBatch = (batch: AvailableBatch) => {
    Alert.alert(
      'Accept Batch?',
      `Accept batch from ${batch.storeName} for GH₵${batch.payment + batch.tip}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          style: 'default',
          onPress: () => router.push('/in-progress'),
        },
      ]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return '#4CAF50';
      case 'Medium':
        return '#FF9800';
      case 'Hard':
        return '#F44336';
      default:
        return Colors.gray;
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Good morning, ' + (user?.name?.split(' ')[0] || 'Shopper'),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/settings')}>
              <AlertCircle size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={[styles.container, { backgroundColor: Colors.background }]}>
        {/* Verification Banner */}
        {!user?.isVerified && (
          <View style={[styles.verificationBanner, { backgroundColor: '#FFF3CD' }]}>
            <AlertCircle size={20} color="#856404" />
            <Text style={[styles.verificationText, { color: '#856404' }]}>
              Complete your verification to start shopping
            </Text>
            <TouchableOpacity onPress={() => router.push('/account')}>
              <ChevronRight size={20} color="#856404" />
            </TouchableOpacity>
          </View>
        )}

        {/* Online Status Toggle */}
        <View style={[styles.statusCard, { backgroundColor: Colors.white }]}>
          <View style={styles.statusHeader}>
            <View>
              <Text style={[styles.statusTitle, { color: Colors.text }]}>
                {isOnline ? 'You\'re Online' : 'You\'re Offline'}
              </Text>
              <Text style={[styles.statusSubtitle, { color: Colors.subtext }]}>
                {isOnline ? 'Ready to receive batches' : 'Go online to start shopping'}
              </Text>
            </View>
            <Switch
              value={isOnline}
              onValueChange={handleGoOnline}
              trackColor={{ false: Colors.border, true: '#4464EB' }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        {/* Earnings Summary */}
        <View style={[styles.earningsCard, { backgroundColor: Colors.white }]}>
          <View style={styles.earningsHeader}>
            <Text style={[styles.sectionTitle, { color: Colors.text }]}>Today's Earnings</Text>
            <TouchableOpacity onPress={() => router.push('/earnings')}>
              <TrendingUp size={20} color="#4464EB" />
            </TouchableOpacity>
          </View>
          <View style={styles.earningsRow}>
            <View style={styles.earningItem}>
              <Text style={[styles.earningAmount, { color: Colors.text }]}>GH₵{todayEarnings}</Text>
              <Text style={[styles.earningLabel, { color: Colors.subtext }]}>Today</Text>
            </View>
            <View style={styles.earningItem}>
              <Text style={[styles.earningAmount, { color: Colors.text }]}>GH₵{weeklyEarnings}</Text>
              <Text style={[styles.earningLabel, { color: Colors.subtext }]}>This Week</Text>
            </View>
          </View>
        </View>

        {/* Bonus Alert */}
        <View style={[styles.bonusCard, { backgroundColor: '#E8F5E8' }]}>
          <Gift size={20} color="#4CAF50" />
          <Text style={[styles.bonusText, { color: '#2E7D32' }]}>
            Complete 3 more batches to earn GH₵10 bonus!
          </Text>
        </View>

        {/* Available Batches */}
        <View style={styles.batchesSection}>
          <View style={styles.batchesHeader}>
            <Text style={[styles.sectionTitle, { color: Colors.text }]}>
              Available Batches ({mockBatches.length})
            </Text>
            <TouchableOpacity onPress={() => router.push('/batches')}>
              <Text style={[styles.viewAllText, { color: '#4464EB' }]}>View All</Text>
            </TouchableOpacity>
          </View>

          {mockBatches.slice(0, 3).map((batch) => (
            <TouchableOpacity
              key={batch.id}
              style={[styles.batchCard, { backgroundColor: Colors.white }]}
              onPress={() => handleAcceptBatch(batch)}
              disabled={!isOnline}
            >
              <View style={styles.batchHeader}>
                <View>
                  <Text style={[styles.storeName, { color: Colors.text }]}>
                    {batch.storeName}
                  </Text>
                  <View style={styles.locationRow}>
                    <MapPin size={14} color={Colors.subtext} />
                    <Text style={[styles.locationText, { color: Colors.subtext }]}>
                      {batch.location} • {batch.distance}
                    </Text>
                  </View>
                </View>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(batch.difficulty) + '20' }]}>
                  <Text style={[styles.difficultyText, { color: getDifficultyColor(batch.difficulty) }]}>
                    {batch.difficulty}
                  </Text>
                </View>
              </View>

              <View style={styles.batchDetails}>
                <View style={styles.batchStat}>
                  <Text style={[styles.statValue, { color: Colors.text }]}>{batch.items}</Text>
                  <Text style={[styles.statLabel, { color: Colors.subtext }]}>items</Text>
                </View>
                <View style={styles.batchStat}>
                  <Clock size={16} color={Colors.subtext} />
                  <Text style={[styles.statLabel, { color: Colors.subtext }]}>{batch.estimatedTime}</Text>
                </View>
                <View style={styles.batchStat}>
                  <Text style={[styles.paymentAmount, { color: '#4CAF50' }]}>
                    GH₵{batch.payment + batch.tip}
                  </Text>
                  <Text style={[styles.statLabel, { color: Colors.subtext }]}>
                    +GH₵{batch.tip} tip
                  </Text>
                </View>
              </View>

              {!isOnline && (
                <View style={styles.offlineOverlay}>
                  <Text style={[styles.offlineText, { color: Colors.subtext }]}>
                    Go online to accept batches
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  verificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  verificationText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  statusCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
  },
  earningsCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  earningItem: {
    alignItems: 'center',
  },
  earningAmount: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  earningLabel: {
    fontSize: 14,
  },
  bonusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  bonusText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  batchesSection: {
    marginBottom: 24,
  },
  batchesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  batchCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  batchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  batchDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  batchStat: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  offlineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  offlineText: {
    fontSize: 14,
    fontWeight: '600',
  },
});