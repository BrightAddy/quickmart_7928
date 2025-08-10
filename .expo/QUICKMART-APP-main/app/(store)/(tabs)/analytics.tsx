import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BarChart2, TrendingUp, DollarSign, ShoppingBag, Calendar, ChevronDown, ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { StoreOwner } from '@/types';
import { mockStores } from '@/mocks/stores';
import { getOrdersByStore } from '@/mocks/orders';

export default function StoreAnalyticsScreen() {
  const { user } = useAuthStore();
  const storeOwner = user as StoreOwner;
  const [timeRange, setTimeRange] = useState('week'); // 'day', 'week', 'month', 'year'
  
  // Get store data
  const store = mockStores.find(s => s.id === storeOwner?.storeId);
  
  // Get store orders
  const storeOrders = getOrdersByStore(storeOwner?.storeId || '');
  
  // Calculate stats
  const totalSales = storeOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = storeOrders.length;
  const completedOrders = storeOrders.filter(order => order.status === 'delivered').length;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  
  // Get time range text
  const getTimeRangeText = () => {
    switch (timeRange) {
      case 'day': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      default: return 'This Week';
    }
  };
  
  // Mock data for charts
  const salesData = [
    { day: 'Mon', amount: 120 },
    { day: 'Tue', amount: 180 },
    { day: 'Wed', amount: 150 },
    { day: 'Thu', amount: 250 },
    { day: 'Fri', amount: 300 },
    { day: 'Sat', amount: 280 },
    { day: 'Sun', amount: 220 },
  ];
  
  const ordersData = [
    { day: 'Mon', count: 5 },
    { day: 'Tue', count: 8 },
    { day: 'Wed', count: 6 },
    { day: 'Thu', count: 10 },
    { day: 'Fri', count: 12 },
    { day: 'Sat', count: 11 },
    { day: 'Sun', count: 9 },
  ];
  
  // Top selling products
  const topProducts = [
    { name: 'Rice (5kg)', sales: 28, revenue: 560 },
    { name: 'Cooking Oil (1L)', sales: 22, revenue: 440 },
    { name: 'Bread', sales: 20, revenue: 100 },
    { name: 'Eggs (Crate)', sales: 18, revenue: 360 },
    { name: 'Milk (1L)', sales: 15, revenue: 225 },
  ];
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <Text style={styles.headerSubtitle}>{store?.name || storeOwner?.businessName}</Text>
      </View>
      
      <View style={styles.timeRangeContainer}>
        <TouchableOpacity style={styles.timeRangeButton}>
          <Calendar size={18} color={Colors.primary} style={styles.timeRangeIcon} />
          <Text style={styles.timeRangeText}>{getTimeRangeText()}</Text>
          <ChevronDown size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: Colors.primary + '15' }]}>
            <DollarSign size={22} color={Colors.primary} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>₵{totalSales.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Sales</Text>
          </View>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: Colors.secondary + '15' }]}>
            <ShoppingBag size={22} color={Colors.secondary} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{totalOrders}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: Colors.success + '15' }]}>
            <TrendingUp size={22} color={Colors.success} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{completedOrders}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: Colors.info + '15' }]}>
            <BarChart2 size={22} color={Colors.info} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>₵{averageOrderValue.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Avg. Order</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sales Overview</Text>
        </View>
        
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Weekly Sales</Text>
            <Text style={styles.chartValue}>₵{totalSales.toFixed(2)}</Text>
          </View>
          
          <View style={styles.chartContainer}>
            {/* Simple bar chart visualization */}
            <View style={styles.barChart}>
              {salesData.map((item, index) => (
                <View key={index} style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: (item.amount / 300) * 150,
                        backgroundColor: index === 4 ? Colors.primary : Colors.primary + '70'
                      }
                    ]} 
                  />
                  <Text style={styles.barLabel}>{item.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Orders Overview</Text>
        </View>
        
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Weekly Orders</Text>
            <Text style={styles.chartValue}>{totalOrders} orders</Text>
          </View>
          
          <View style={styles.chartContainer}>
            {/* Simple bar chart visualization */}
            <View style={styles.barChart}>
              {ordersData.map((item, index) => (
                <View key={index} style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: (item.count / 12) * 150,
                        backgroundColor: index === 4 ? Colors.secondary : Colors.secondary + '70'
                      }
                    ]} 
                  />
                  <Text style={styles.barLabel}>{item.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Selling Products</Text>
        </View>
        
        <View style={styles.productsCard}>
          {topProducts.map((product, index) => (
            <View key={index} style={[
              styles.productItem,
              index < topProducts.length - 1 && styles.productItemBorder
            ]}>
              <View style={styles.productRank}>
                <Text style={styles.productRankText}>{index + 1}</Text>
              </View>
              
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productSales}>{product.sales} sold</Text>
              </View>
              
              <Text style={styles.productRevenue}>₵{product.revenue}</Text>
            </View>
          ))}
          
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Products</Text>
            <ArrowRight size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.bottomPadding} />
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
  timeRangeContainer: {
    padding: 16,
    alignItems: 'center',
  },
  timeRangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  timeRangeIcon: {
    marginRight: 8,
  },
  timeRangeText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginRight: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.subtext,
  },
  section: {
    padding: 16,
    marginTop: 8,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  chartCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  chartValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  chartContainer: {
    height: 200,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 180,
    paddingTop: 20,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: Colors.subtext,
  },
  productsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  productItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '30',
  },
  productRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productRankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  productSales: {
    fontSize: 14,
    color: Colors.subtext,
  },
  productRevenue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border + '30',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginRight: 8,
  },
  bottomPadding: {
    height: 40,
  },
});