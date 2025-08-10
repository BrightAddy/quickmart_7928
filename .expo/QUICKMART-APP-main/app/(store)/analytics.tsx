import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LineChart, BarChart, TrendingUp, DollarSign, ShoppingCart, Calendar } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { StoreOwner } from '@/types';
import { mockStores } from '@/mocks/stores';
import { getOrdersByStore } from '@/mocks/orders';

export default function StoreAnalyticsScreen() {
  const { user } = useAuthStore();
  const storeOwner = user as StoreOwner;
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week');
  
  // Get store data
  const store = mockStores.find(s => s.id === storeOwner?.storeId);
  
  // Get store orders
  const storeOrders = getOrdersByStore(storeOwner?.storeId || '');
  
  // Calculate stats
  const totalSales = storeOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = storeOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  
  // Calculate sales by day of week for the chart
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const salesByDay = daysOfWeek.map(day => {
    const dayIndex = daysOfWeek.indexOf(day);
    const ordersOnDay = storeOrders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getDay() === dayIndex;
    });
    return ordersOnDay.reduce((sum, order) => sum + order.total, 0);
  });
  
  // Calculate top selling products
  const productSales: Record<string, number> = {};
  storeOrders.forEach(order => {
    order.items.forEach(item => {
      const productName = item.product.name;
      if (productSales[productName]) {
        productSales[productName] += item.quantity;
      } else {
        productSales[productName] = item.quantity;
      }
    });
  });
  
  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, quantity]) => ({ name, quantity }));
  
  return (
    <ScrollView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics & Insights</Text>
        <Text style={styles.headerSubtitle}>{store?.name || storeOwner?.businessName}</Text>
      </View>
      
      <View style={styles.timeRangeSelector}>
        <TouchableOpacity 
          style={[styles.timeRangeButton, timeRange === 'day' && styles.activeTimeRange]}
          onPress={() => setTimeRange('day')}
        >
          <Text style={[styles.timeRangeText, timeRange === 'day' && styles.activeTimeRangeText]}>Day</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.timeRangeButton, timeRange === 'week' && styles.activeTimeRange]}
          onPress={() => setTimeRange('week')}
        >
          <Text style={[styles.timeRangeText, timeRange === 'week' && styles.activeTimeRangeText]}>Week</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.timeRangeButton, timeRange === 'month' && styles.activeTimeRange]}
          onPress={() => setTimeRange('month')}
        >
          <Text style={[styles.timeRangeText, timeRange === 'month' && styles.activeTimeRangeText]}>Month</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.timeRangeButton, timeRange === 'year' && styles.activeTimeRange]}
          onPress={() => setTimeRange('year')}
        >
          <Text style={[styles.timeRangeText, timeRange === 'year' && styles.activeTimeRangeText]}>Year</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: Colors.primary + '20' }]}>
            <DollarSign size={24} color={Colors.primary} />
          </View>
          <Text style={styles.statValue}>₵{totalSales.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: Colors.info + '20' }]}>
            <ShoppingCart size={24} color={Colors.info} />
          </View>
          <Text style={styles.statValue}>{totalOrders}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: Colors.success + '20' }]}>
            <TrendingUp size={24} color={Colors.success} />
          </View>
          <Text style={styles.statValue}>₵{averageOrderValue.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Avg. Order Value</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sales Trend</Text>
          <View style={styles.sectionIcon}>
            <LineChart size={20} color={Colors.primary} />
          </View>
        </View>
        
        <View style={styles.chartContainer}>
          {/* This would be a real chart component in a production app */}
          <View style={styles.mockChart}>
            {salesByDay.map((value, index) => (
              <View key={index} style={styles.chartColumn}>
                <View 
                  style={[
                    styles.chartBar, 
                    { 
                      height: `${Math.max(5, (value / Math.max(...salesByDay)) * 100)}%`,
                      backgroundColor: index === new Date().getDay() ? Colors.primary : Colors.primary + '80'
                    }
                  ]} 
                />
                <Text style={styles.chartLabel}>{daysOfWeek[index]}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Selling Products</Text>
          <View style={styles.sectionIcon}>
            <BarChart size={20} color={Colors.primary} />
          </View>
        </View>
        
        {topProducts.map((product, index) => (
          <View key={index} style={styles.productItem}>
            <Text style={styles.productRank}>{index + 1}</Text>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productQuantity}>{product.quantity} sold</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sales by Time</Text>
          <View style={styles.sectionIcon}>
            <Calendar size={20} color={Colors.primary} />
          </View>
        </View>
        
        <View style={styles.timeStats}>
          <View style={styles.timeStatItem}>
            <Text style={styles.timeStatLabel}>Morning (6AM-12PM)</Text>
            <Text style={styles.timeStatValue}>₵{(totalSales * 0.3).toFixed(2)}</Text>
          </View>
          
          <View style={styles.timeStatItem}>
            <Text style={styles.timeStatLabel}>Afternoon (12PM-6PM)</Text>
            <Text style={styles.timeStatValue}>₵{(totalSales * 0.4).toFixed(2)}</Text>
          </View>
          
          <View style={styles.timeStatItem}>
            <Text style={styles.timeStatLabel}>Evening (6PM-12AM)</Text>
            <Text style={styles.timeStatValue}>₵{(totalSales * 0.25).toFixed(2)}</Text>
          </View>
          
          <View style={styles.timeStatItem}>
            <Text style={styles.timeStatLabel}>Night (12AM-6AM)</Text>
            <Text style={styles.timeStatValue}>₵{(totalSales * 0.05).toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.8,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 8,
    margin: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTimeRange: {
    backgroundColor: Colors.primary,
  },
  timeRangeText: {
    fontSize: 14,
    color: Colors.text,
  },
  activeTimeRangeText: {
    color: Colors.white,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  statCard: {
    width: '33.33%',
    padding: 12,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.subtext,
    textAlign: 'center',
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    margin: 16,
    marginTop: 0,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    height: 200,
    marginTop: 16,
  },
  mockChart: {
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 24,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: 20,
    borderRadius: 4,
  },
  chartLabel: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.subtext,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  productRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: 'bold',
    marginRight: 12,
  },
  productName: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  productQuantity: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  timeStats: {
    marginTop: 8,
  },
  timeStatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  timeStatLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  timeStatValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
});