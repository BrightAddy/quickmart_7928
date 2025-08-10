import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DollarSign, TrendingUp, Calendar, ChevronDown, ChevronUp } from 'lucide-react-native';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { Employee } from '@/types';

const earningsHistory = [
  { id: '1', date: '2023-06-15', amount: 45.00, orders: 3, tips: 15.00 },
  { id: '2', date: '2023-06-14', amount: 60.00, orders: 4, tips: 20.00 },
  { id: '3', date: '2023-06-13', amount: 30.00, orders: 2, tips: 10.00 },
  { id: '4', date: '2023-06-12', amount: 75.00, orders: 5, tips: 25.00 },
  { id: '5', date: '2023-06-11', amount: 45.00, orders: 3, tips: 15.00 },
  { id: '6', date: '2023-06-10', amount: 60.00, orders: 4, tips: 20.00 },
  { id: '7', date: '2023-06-09', amount: 30.00, orders: 2, tips: 10.00 },
];

export default function EarningsScreen() {
  const { user } = useAuthStore();
  const employee = user as Employee;
  
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('week');
  const [showCashoutInfo, setShowCashoutInfo] = useState(false);
  
  const getEarningsByTimeframe = () => {
    // In a real app, this would filter based on actual dates
    switch (timeframe) {
      case 'today':
        return earningsHistory.slice(0, 1);
      case 'week':
        return earningsHistory.slice(0, 7);
      case 'month':
        return earningsHistory;
      default:
        return earningsHistory;
    }
  };
  
  const calculateTotalEarnings = () => {
    const filteredEarnings = getEarningsByTimeframe();
    return filteredEarnings.reduce((sum, item) => sum + item.amount, 0);
  };
  
  const calculateTotalTips = () => {
    const filteredEarnings = getEarningsByTimeframe();
    return filteredEarnings.reduce((sum, item) => sum + item.tips, 0);
  };
  
  const calculateTotalOrders = () => {
    const filteredEarnings = getEarningsByTimeframe();
    return filteredEarnings.reduce((sum, item) => sum + item.orders, 0);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const handleCashout = () => {
    alert('Cashout request submitted! Funds will be sent to your Mobile Money account.');
  };
  
  return (
    <ScrollView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Earnings</Text>
        <Text style={styles.subtitle}>Track your income and cashouts</Text>
      </View>
      
      <View style={styles.earningsCard}>
        <View style={styles.timeframeSelector}>
          <TouchableOpacity 
            style={[styles.timeframeButton, timeframe === 'today' && styles.activeTimeframe]}
            onPress={() => setTimeframe('today')}
          >
            <Text style={[styles.timeframeText, timeframe === 'today' && styles.activeTimeframeText]}>
              Today
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.timeframeButton, timeframe === 'week' && styles.activeTimeframe]}
            onPress={() => setTimeframe('week')}
          >
            <Text style={[styles.timeframeText, timeframe === 'week' && styles.activeTimeframeText]}>
              This Week
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.timeframeButton, timeframe === 'month' && styles.activeTimeframe]}
            onPress={() => setTimeframe('month')}
          >
            <Text style={[styles.timeframeText, timeframe === 'month' && styles.activeTimeframeText]}>
              This Month
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.totalEarnings}>
          <Text style={styles.totalEarningsLabel}>Total Earnings</Text>
          <Text style={styles.totalEarningsValue}>₵{calculateTotalEarnings().toFixed(2)}</Text>
        </View>
        
        <View style={styles.earningsBreakdown}>
          <View style={styles.breakdownItem}>
            <View style={[styles.iconContainer, { backgroundColor: Colors.primary + '20' }]}>
              <DollarSign size={20} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.breakdownLabel}>Base Pay</Text>
              <Text style={styles.breakdownValue}>
                ₵{(calculateTotalEarnings() - calculateTotalTips()).toFixed(2)}
              </Text>
            </View>
          </View>
          
          <View style={styles.breakdownItem}>
            <View style={[styles.iconContainer, { backgroundColor: Colors.secondary + '20' }]}>
              <TrendingUp size={20} color={Colors.secondary} />
            </View>
            <View>
              <Text style={styles.breakdownLabel}>Tips</Text>
              <Text style={styles.breakdownValue}>
                ₵{calculateTotalTips().toFixed(2)}
              </Text>
            </View>
          </View>
          
          <View style={styles.breakdownItem}>
            <View style={[styles.iconContainer, { backgroundColor: Colors.info + '20' }]}>
              <Calendar size={20} color={Colors.info} />
            </View>
            <View>
              <Text style={styles.breakdownLabel}>Orders</Text>
              <Text style={styles.breakdownValue}>
                {calculateTotalOrders()}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.cashoutSection}>
        <View style={styles.cashoutCard}>
          <View style={styles.cashoutHeader}>
            <Text style={styles.cashoutTitle}>Available for Cashout</Text>
            <Text style={styles.cashoutAmount}>₵{employee?.earnings.toFixed(2) || '0.00'}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.cashoutInfoToggle}
            onPress={() => setShowCashoutInfo(!showCashoutInfo)}
          >
            <Text style={styles.cashoutInfoText}>Cashout Information</Text>
            {showCashoutInfo ? (
              <ChevronUp size={20} color={Colors.primary} />
            ) : (
              <ChevronDown size={20} color={Colors.primary} />
            )}
          </TouchableOpacity>
          
          {showCashoutInfo && (
            <View style={styles.cashoutInfo}>
              <Text style={styles.cashoutInfoItem}>
                • Cashouts are processed instantly to your Mobile Money account
              </Text>
              <Text style={styles.cashoutInfoItem}>
                • Minimum cashout amount: ₵10.00
              </Text>
              <Text style={styles.cashoutInfoItem}>
                • Maximum daily cashout: ₵1,000.00
              </Text>
              <Text style={styles.cashoutInfoItem}>
                • Mobile Money number: {employee?.momoNumber || 'Not set'}
              </Text>
            </View>
          )}
          
          <Button
            title="Cash Out Now"
            onPress={handleCashout}
            style={styles.cashoutButton}
            disabled={!employee?.earnings || employee.earnings < 10}
          />
        </View>
      </View>
      
      <View style={styles.historySection}>
        <Text style={styles.historyTitle}>Earnings History</Text>
        
        {getEarningsByTimeframe().map((item) => (
          <View key={item.id} style={styles.historyItem}>
            <View style={styles.historyDate}>
              <Calendar size={16} color={Colors.subtext} />
              <Text style={styles.dateText}>{formatDate(item.date)}</Text>
            </View>
            
            <View style={styles.historyDetails}>
              <Text style={styles.historyOrders}>{item.orders} orders</Text>
              <Text style={styles.historyAmount}>₵{item.amount.toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.subtext,
  },
  earningsCard: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeframeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 4,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTimeframe: {
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  timeframeText: {
    fontSize: 14,
    color: Colors.subtext,
  },
  activeTimeframeText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  totalEarnings: {
    alignItems: 'center',
    marginBottom: 24,
  },
  totalEarningsLabel: {
    fontSize: 16,
    color: Colors.subtext,
    marginBottom: 4,
  },
  totalEarningsValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.text,
  },
  earningsBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownItem: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 12,
    color: Colors.subtext,
    textAlign: 'center',
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  cashoutSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cashoutCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cashoutHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  cashoutTitle: {
    fontSize: 16,
    color: Colors.subtext,
    marginBottom: 4,
  },
  cashoutAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.success,
  },
  cashoutInfoToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 12,
  },
  cashoutInfoText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  cashoutInfo: {
    marginBottom: 16,
  },
  cashoutInfoItem: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 4,
    lineHeight: 20,
  },
  cashoutButton: {
    marginTop: 8,
  },
  historySection: {
    margin: 16,
    marginTop: 0,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  historyItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  historyDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: Colors.subtext,
    marginLeft: 6,
  },
  historyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyOrders: {
    fontSize: 14,
    color: Colors.text,
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
});