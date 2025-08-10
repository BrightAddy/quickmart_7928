import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Gift,
  Smartphone,
  ChevronRight,
  Clock,
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

const { width } = Dimensions.get('window');

interface EarningsData {
  period: string;
  totalEarnings: number;
  basePayment: number;
  tips: number;
  bonuses: number;
  batches: number;
  hours: number;
}

const mockEarningsData: EarningsData[] = [
  {
    period: 'Today',
    totalEarnings: 82,
    basePayment: 65,
    tips: 12,
    bonuses: 5,
    batches: 3,
    hours: 4.5,
  },
  {
    period: 'Yesterday',
    totalEarnings: 156,
    basePayment: 120,
    tips: 28,
    bonuses: 8,
    batches: 6,
    hours: 7.2,
  },
  {
    period: 'This Week',
    totalEarnings: 456,
    basePayment: 350,
    tips: 86,
    bonuses: 20,
    batches: 18,
    hours: 28.5,
  },
];

const weeklyChart = [
  { day: 'Mon', amount: 45 },
  { day: 'Tue', amount: 78 },
  { day: 'Wed', amount: 92 },
  { day: 'Thu', amount: 156 },
  { day: 'Fri', amount: 134 },
  { day: 'Sat', amount: 89 },
  { day: 'Sun', amount: 67 },
];

export default function ShopperEarnings() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  const currentData = mockEarningsData[0]; // Today's data
  const weeklyData = mockEarningsData[2]; // This week's data

  const maxAmount = Math.max(...weeklyChart.map(item => item.amount));

  const renderBarChart = () => (
    <View style={styles.chartContainer}>
      <Text style={[styles.chartTitle, { color: Colors.text }]}>This Week</Text>
      <View style={styles.chart}>
        {weeklyChart.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                {
                  height: (item.amount / maxAmount) * 100,
                  backgroundColor: item.day === 'Thu' ? '#4464EB' : Colors.border,
                },
              ]}
            />
            <Text style={[styles.barLabel, { color: Colors.subtext }]}>{item.day}</Text>
            <Text style={[styles.barAmount, { color: Colors.text }]}>₵{item.amount}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Earnings',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/mobile-money')}>
              <Smartphone size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={[styles.container, { backgroundColor: Colors.background }]}>
        {/* Period Selector */}
        <View style={[styles.periodSelector, { backgroundColor: Colors.white }]}>
          {(['today', 'week', 'month'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && { backgroundColor: '#4464EB' },
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  { color: selectedPeriod === period ? Colors.white : Colors.subtext },
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Total Earnings Card */}
        <View style={[styles.totalCard, { backgroundColor: '#4464EB' }]}>
          <View style={styles.totalHeader}>
            <Text style={[styles.totalLabel, { color: Colors.white }]}>
              {selectedPeriod === 'today' ? 'Today\'s Earnings' : 
               selectedPeriod === 'week' ? 'This Week\'s Earnings' : 
               'This Month\'s Earnings'}
            </Text>
            <TrendingUp size={24} color={Colors.white} />
          </View>
          <Text style={[styles.totalAmount, { color: Colors.white }]}>
            GH₵{selectedPeriod === 'today' ? currentData.totalEarnings : weeklyData.totalEarnings}
          </Text>
          <View style={styles.totalStats}>
            <View style={styles.totalStat}>
              <Text style={[styles.totalStatValue, { color: Colors.white }]}>
                {selectedPeriod === 'today' ? currentData.batches : weeklyData.batches}
              </Text>
              <Text style={[styles.totalStatLabel, { color: Colors.white }]}>Batches</Text>
            </View>
            <View style={styles.totalStat}>
              <Text style={[styles.totalStatValue, { color: Colors.white }]}>
                {selectedPeriod === 'today' ? currentData.hours : weeklyData.hours}h
              </Text>
              <Text style={[styles.totalStatLabel, { color: Colors.white }]}>Hours</Text>
            </View>
            <View style={styles.totalStat}>
              <Text style={[styles.totalStatValue, { color: Colors.white }]}>
                GH₵{selectedPeriod === 'today' ? 
                  Math.round(currentData.totalEarnings / currentData.hours) : 
                  Math.round(weeklyData.totalEarnings / weeklyData.hours)}
              </Text>
              <Text style={[styles.totalStatLabel, { color: Colors.white }]}>Per Hour</Text>
            </View>
          </View>
        </View>

        {/* Earnings Breakdown */}
        <View style={[styles.breakdownCard, { backgroundColor: Colors.white }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>Earnings Breakdown</Text>
          
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <DollarSign size={20} color="#4CAF50" />
              <Text style={[styles.breakdownLabel, { color: Colors.text }]}>Base Payment</Text>
            </View>
            <Text style={[styles.breakdownAmount, { color: Colors.text }]}>
              GH₵{selectedPeriod === 'today' ? currentData.basePayment : weeklyData.basePayment}
            </Text>
          </View>

          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <Gift size={20} color="#FF9800" />
              <Text style={[styles.breakdownLabel, { color: Colors.text }]}>Customer Tips</Text>
            </View>
            <Text style={[styles.breakdownAmount, { color: Colors.text }]}>
              GH₵{selectedPeriod === 'today' ? currentData.tips : weeklyData.tips}
            </Text>
          </View>

          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <TrendingUp size={20} color="#2196F3" />
              <Text style={[styles.breakdownLabel, { color: Colors.text }]}>Bonuses</Text>
            </View>
            <Text style={[styles.breakdownAmount, { color: Colors.text }]}>
              GH₵{selectedPeriod === 'today' ? currentData.bonuses : weeklyData.bonuses}
            </Text>
          </View>
        </View>

        {/* Weekly Chart */}
        {selectedPeriod === 'week' && (
          <View style={[styles.chartCard, { backgroundColor: Colors.white }]}>
            {renderBarChart()}
          </View>
        )}

        {/* Mobile Money Payout */}
        <View style={[styles.payoutCard, { backgroundColor: Colors.white }]}>
          <View style={styles.payoutHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: Colors.text }]}>Mobile Money Payout</Text>
              <Text style={[styles.payoutSubtitle, { color: Colors.subtext }]}>
                Next payout: Tomorrow at 6:00 AM
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/mobile-money')}>
              <ChevronRight size={20} color={Colors.subtext} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.payoutDetails}>
            <View style={styles.payoutMethod}>
              <Smartphone size={20} color="#4464EB" />
              <Text style={[styles.payoutMethodText, { color: Colors.text }]}>
                MTN Mobile Money
              </Text>
            </View>
            <Text style={[styles.payoutAmount, { color: '#4CAF50' }]}>
              GH₵{currentData.totalEarnings}
            </Text>
          </View>
        </View>

        {/* Performance Insights */}
        <View style={[styles.insightsCard, { backgroundColor: Colors.white }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>Performance Insights</Text>
          
          <View style={styles.insightItem}>
            <View style={[styles.insightIcon, { backgroundColor: '#E8F5E8' }]}>
              <TrendingUp size={20} color="#4CAF50" />
            </View>
            <View style={styles.insightContent}>
              <Text style={[styles.insightTitle, { color: Colors.text }]}>
                Great week!
              </Text>
              <Text style={[styles.insightDescription, { color: Colors.subtext }]}>
                You earned 23% more than last week
              </Text>
            </View>
          </View>

          <View style={styles.insightItem}>
            <View style={[styles.insightIcon, { backgroundColor: '#FFF3E0' }]}>
              <Clock size={20} color="#FF9800" />
            </View>
            <View style={styles.insightContent}>
              <Text style={[styles.insightTitle, { color: Colors.text }]}>
                Peak hours: 6-8 PM
              </Text>
              <Text style={[styles.insightDescription, { color: Colors.subtext }]}>
                Higher tips during evening hours
              </Text>
            </View>
          </View>

          <View style={styles.insightItem}>
            <View style={[styles.insightIcon, { backgroundColor: '#E3F2FD' }]}>
              <Gift size={20} color="#2196F3" />
            </View>
            <View style={styles.insightContent}>
              <Text style={[styles.insightTitle, { color: Colors.text }]}>
                Bonus opportunity
              </Text>
              <Text style={[styles.insightDescription, { color: Colors.subtext }]}>
                Complete 2 more batches for GH₵10 bonus
              </Text>
            </View>
          </View>
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
  periodSelector: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalCard: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  totalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.9,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 20,
  },
  totalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalStat: {
    alignItems: 'center',
  },
  totalStatValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  totalStatLabel: {
    fontSize: 12,
    opacity: 0.8,
  },
  breakdownCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  breakdownLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  breakdownAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  chartCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 20,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    height: 120,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 24,
    borderRadius: 12,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  barAmount: {
    fontSize: 10,
    fontWeight: '600',
  },
  payoutCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  payoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  payoutSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  payoutDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payoutMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  payoutMethodText: {
    fontSize: 16,
    fontWeight: '600',
  },
  payoutAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  insightsCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  insightDescription: {
    fontSize: 14,
  },
});