import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Alert } from 'react-native';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LoyaltyPoint {
  id: string;
  amount: number;
  type: 'earned' | 'redeemed' | 'expired';
  description: string;
  date: Date;
  orderId?: string;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  image: string;
  isAvailable: boolean;
  category: 'discount' | 'free_delivery' | 'free_item' | 'cashback';
}

export default function LoyaltyPoints({ navigation }: any) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [currentPoints, setCurrentPoints] = useState(1250);
  const [totalEarned, setTotalEarned] = useState(2800);
  const [totalRedeemed, setTotalRedeemed] = useState(1550);
  const [selectedTab, setSelectedTab] = useState<'rewards' | 'history'>('rewards');

  const [loyaltyHistory] = useState<LoyaltyPoint[]>([
    {
      id: '1',
      amount: 150,
      type: 'earned',
      description: 'Order #QKM-1234567',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      orderId: 'QKM-1234567'
    },
    {
      id: '2',
      amount: -500,
      type: 'redeemed',
      description: 'Redeemed: 10% Off Next Order',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
    {
      id: '3',
      amount: 200,
      type: 'earned',
      description: 'Order #QKM-1234566',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      orderId: 'QKM-1234566'
    },
    {
      id: '4',
      amount: -300,
      type: 'redeemed',
      description: 'Redeemed: Free Delivery',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    },
    {
      id: '5',
      amount: 300,
      type: 'earned',
      description: 'Order #QKM-1234565',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      orderId: 'QKM-1234565'
    },
  ]);

  const [availableRewards] = useState<Reward[]>([
    {
      id: '1',
      name: '10% Off Next Order',
      description: 'Get 10% discount on your next purchase',
      pointsRequired: 500,
      image: '🎉',
      isAvailable: true,
      category: 'discount'
    },
    {
      id: '2',
      name: 'Free Delivery',
      description: 'Free delivery on your next order',
      pointsRequired: 300,
      image: '🚚',
      isAvailable: true,
      category: 'free_delivery'
    },
    {
      id: '3',
      name: 'Free Fresh Fruits',
      description: 'Get a free basket of fresh fruits',
      pointsRequired: 800,
      image: '🍎',
      isAvailable: true,
      category: 'free_item'
    },
    {
      id: '4',
      name: '20% Off Next Order',
      description: 'Get 20% discount on your next purchase',
      pointsRequired: 1000,
      image: '🎊',
      isAvailable: true,
      category: 'discount'
    },
    {
      id: '5',
      name: 'GHS 50 Cashback',
      description: 'Get GHS 50 credited to your account',
      pointsRequired: 1500,
      image: '💰',
      isAvailable: false,
      category: 'cashback'
    },
    {
      id: '6',
      name: 'Free Grocery Bundle',
      description: 'Get a free bundle of essential groceries',
      pointsRequired: 1200,
      image: '🛒',
      isAvailable: true,
      category: 'free_item'
    },
  ]);

  const handleRedeemReward = (reward: Reward) => {
    if (currentPoints < reward.pointsRequired) {
      Alert.alert('Insufficient Points', 'You don\'t have enough points to redeem this reward.');
      return;
    }

    Alert.alert(
      'Redeem Reward',
      `Are you sure you want to redeem "${reward.name}" for ${reward.pointsRequired} points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem',
          onPress: () => {
            setCurrentPoints(currentPoints - reward.pointsRequired);
            setTotalRedeemed(totalRedeemed + reward.pointsRequired);
            Alert.alert(
              'Reward Redeemed!',
              `Your "${reward.name}" has been added to your account.`,
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const RewardCard = ({ reward }: { reward: Reward }) => (
    <View style={[
      styles.rewardCard,
      { 
        borderColor: reward.isAvailable ? colors.primary + '22' : '#e5e7eb',
        backgroundColor: reward.isAvailable ? 'white' : '#f8f9fa',
        opacity: reward.isAvailable ? 1 : 0.6
      }
    ]}>
      <View style={styles.rewardHeader}>
        <Text style={styles.rewardImage}>{reward.image}</Text>
        <View style={styles.rewardInfo}>
          <Text style={[styles.rewardName, { color: colors.onBackground }]}>{reward.name}</Text>
          <Text style={[styles.rewardDescription, { color: colors.onSurface + '88' }]}>
            {reward.description}
          </Text>
        </View>
        <View style={styles.rewardPoints}>
          <Text style={[styles.pointsRequired, { color: colors.primary }]}>
            {reward.pointsRequired}
          </Text>
          <Text style={[styles.pointsLabel, { color: colors.onSurface + '88' }]}>pts</Text>
        </View>
      </View>
      
      {reward.isAvailable ? (
        <TouchableOpacity 
          style={[
            styles.redeemButton,
            { 
              backgroundColor: currentPoints >= reward.pointsRequired ? colors.primary : '#e5e7eb'
            }
          ]}
          onPress={() => handleRedeemReward(reward)}
          disabled={currentPoints < reward.pointsRequired}
        >
          <Text style={[
            styles.redeemButtonText,
            { 
              color: currentPoints >= reward.pointsRequired ? colors.onPrimary : colors.onSurface + '66'
            }
          ]}>
            {currentPoints >= reward.pointsRequired ? 'Redeem' : 'Not Enough Points'}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.unavailableBadge}>
          <Text style={styles.unavailableText}>Coming Soon</Text>
        </View>
      )}
    </View>
  );

  const HistoryItem = ({ item }: { item: LoyaltyPoint }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyLeft}>
        <Text style={[
          styles.historyAmount,
          { 
            color: item.type === 'earned' ? colors.primary : 
                   item.type === 'redeemed' ? '#ef4444' : '#6b7280'
          }
        ]}>
          {item.type === 'earned' ? '+' : ''}{item.amount}
        </Text>
        <View style={styles.historyInfo}>
          <Text style={[styles.historyDescription, { color: colors.onBackground }]}>
            {item.description}
          </Text>
          <Text style={[styles.historyDate, { color: colors.onSurface + '88' }]}>
            {formatDate(item.date)}
          </Text>
        </View>
      </View>
      <View style={[
        styles.historyIcon,
        { 
          backgroundColor: item.type === 'earned' ? colors.primary + '20' : 
                          item.type === 'redeemed' ? '#ef444420' : '#6b728020'
        }
      ]}>
        <Text style={styles.historyIconText}>
          {item.type === 'earned' ? '➕' : item.type === 'redeemed' ? '➖' : '⏰'}
        </Text>
      </View>
    </View>
  );

  return (
    <Screen style={{ flex: 1 }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.primary }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loyalty Points</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Points Summary */}
        <View style={[styles.pointsSummary, { backgroundColor: colors.surface }]}>
          <View style={styles.currentPointsContainer}>
            <Text style={[styles.currentPointsLabel, { color: colors.onSurface + '88' }]}>
              Current Balance
            </Text>
            <Text style={[styles.currentPoints, { color: colors.primary }]}>
              {currentPoints.toLocaleString()}
            </Text>
            <Text style={[styles.pointsUnit, { color: colors.onSurface + '88' }]}>points</Text>
          </View>
          
          <View style={styles.pointsStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{totalEarned}</Text>
              <Text style={[styles.statLabel, { color: colors.onSurface + '88' }]}>Total Earned</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#ef4444' }]}>{totalRedeemed}</Text>
              <Text style={[styles.statLabel, { color: colors.onSurface + '88' }]}>Total Redeemed</Text>
            </View>
          </View>
        </View>

        {/* How to Earn */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>How to Earn Points</Text>
          <View style={styles.earnPointsContainer}>
            <View style={styles.earnPointItem}>
              <Text style={styles.earnPointIcon}>🛒</Text>
              <Text style={[styles.earnPointText, { color: colors.onBackground }]}>
                GHS 1 = 1 point
              </Text>
            </View>
            <View style={styles.earnPointItem}>
              <Text style={styles.earnPointIcon}>⭐</Text>
              <Text style={[styles.earnPointText, { color: colors.onBackground }]}>
                Rate orders = 50 points
              </Text>
            </View>
            <View style={styles.earnPointItem}>
              <Text style={styles.earnPointIcon}>👥</Text>
              <Text style={[styles.earnPointText, { color: colors.onBackground }]}>
                Refer friends = 200 points
              </Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[
              styles.tab,
              { 
                backgroundColor: selectedTab === 'rewards' ? colors.primary : colors.background,
                borderColor: colors.primary + '44'
              }
            ]}
            onPress={() => setSelectedTab('rewards')}
          >
            <Text style={[
              styles.tabText,
              { color: selectedTab === 'rewards' ? colors.onPrimary : colors.onBackground }
            ]}>
              Available Rewards
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab,
              { 
                backgroundColor: selectedTab === 'history' ? colors.primary : colors.background,
                borderColor: colors.primary + '44'
              }
            ]}
            onPress={() => setSelectedTab('history')}
          >
            <Text style={[
              styles.tabText,
              { color: selectedTab === 'history' ? colors.onPrimary : colors.onBackground }
            ]}>
              Points History
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {selectedTab === 'rewards' ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
              Available Rewards ({availableRewards.filter(r => r.isAvailable).length})
            </Text>
            {availableRewards.map(reward => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
              Points History
            </Text>
            {loyaltyHistory.map(item => (
              <HistoryItem key={item.id} item={item} />
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
  },
  pointsSummary: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentPointsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  currentPointsLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  currentPoints: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  pointsUnit: {
    fontSize: 14,
  },
  pointsStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 20,
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  earnPointsContainer: {
    gap: 12,
  },
  earnPointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  earnPointIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  earnPointText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  rewardCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardImage: {
    fontSize: 24,
    marginRight: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  rewardDescription: {
    fontSize: 14,
  },
  rewardPoints: {
    alignItems: 'center',
  },
  pointsRequired: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pointsLabel: {
    fontSize: 12,
  },
  redeemButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  redeemButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  unavailableBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
  },
  unavailableText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 12,
    minWidth: 60,
  },
  historyInfo: {
    flex: 1,
  },
  historyDescription: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 12,
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyIconText: {
    fontSize: 14,
  },
});


