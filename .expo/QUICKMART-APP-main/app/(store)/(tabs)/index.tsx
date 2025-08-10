import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ShoppingBag, DollarSign, TrendingUp, Clock, ChevronRight, Users, Package, ArrowUpRight, BarChart2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { StoreOwner } from '@/types';
import { mockStores } from '@/mocks/stores';
import { getOrdersByStore } from '@/mocks/orders';

export default function StoreDashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const storeOwner = user as StoreOwner;
  
  // Get store data
  const store = mockStores.find(s => s.id === storeOwner?.storeId);
  
  // Get store orders
  const storeOrders = getOrdersByStore(storeOwner?.storeId || '');
  
  // Calculate stats
  const totalSales = storeOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = storeOrders.filter(order => order.status === 'pending').length;
  const completedOrders = storeOrders.filter(order => order.status === 'delivered').length;
  const inProgressOrders = storeOrders.filter(order => 
    ['accepted', 'shopping', 'checkout_complete', 'in_delivery'].includes(order.status)
  ).length;
  
  // Get today's date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Get recent orders
  const recentOrders = storeOrders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar style="light" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.storeName}>{store?.name || storeOwner?.businessName}</Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
          
          {store?.logo && (
            <Image 
              source={{ uri: store.logo }} 
              style={styles.storeLogo}
            />
          )}
        </View>
      </View>
      
      {/* Key Metrics */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <View style={[styles.metricIconContainer, { backgroundColor: Colors.primary + '15' }]}>
            <DollarSign size={22} color={Colors.primary} />
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricValue}>₵{totalSales.toFixed(2)}</Text>
            <Text style={styles.metricLabel}>Total Sales</Text>
          </View>
        </View>
        
        <View style={styles.metricCard}>
          <View style={[styles.metricIconContainer, { backgroundColor: Colors.warning + '15' }]}>
            <Clock size={22} color={Colors.warning} />
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricValue}>{pendingOrders}</Text>
            <Text style={styles.metricLabel}>Pending</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <View style={[styles.metricIconContainer, { backgroundColor: Colors.info + '15' }]}>
            <ShoppingBag size={22} color={Colors.info} />
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricValue}>{inProgressOrders}</Text>
            <Text style={styles.metricLabel}>In Progress</Text>
          </View>
        </View>
        
        <View style={styles.metricCard}>
          <View style={[styles.metricIconContainer, { backgroundColor: Colors.success + '15' }]}>
            <TrendingUp size={22} color={Colors.success} />
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricValue}>{completedOrders}</Text>
            <Text style={styles.metricLabel}>Completed</Text>
          </View>
        </View>
      </View>
      
      {/* Recent Orders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push('/(store)/(tabs)/orders')}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <ChevronRight size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        
        {recentOrders.length > 0 ? (
          recentOrders.map((order, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.orderItem}
              onPress={() => router.push({
                pathname: '/(store)/order/[id]',
                params: { id: order.id }
              })}
            >
              <View style={styles.orderInfo}>
                <Text style={styles.orderId}>Order #{order.id.slice(-6)}</Text>
                <Text style={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </Text>
              </View>
              
              <View style={styles.orderDetails}>
                <Text style={styles.orderItems}>
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </Text>
                <Text style={styles.orderTotal}>₵{order.total.toFixed(2)}</Text>
              </View>
              
              <View style={[
                styles.orderStatus,
                { backgroundColor: getStatusColor(order.status) + '15' }
              ]}>
                <Text style={[
                  styles.orderStatusText,
                  { color: getStatusColor(order.status) }
                ]}>
                  {getStatusText(order.status)}
                </Text>
              </View>
              
              <ArrowUpRight size={18} color={Colors.subtext} />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No recent orders</Text>
          </View>
        )}
      </View>
      
      {/* Quick Actions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(store)/(tabs)/inventory')}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: Colors.primary + '10' }]}>
              <Package size={24} color={Colors.primary} />
            </View>
            <Text style={styles.actionText}>Manage Products</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(store)/(tabs)/orders')}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: Colors.secondary + '10' }]}>
              <ShoppingBag size={24} color={Colors.secondary} />
            </View>
            <Text style={styles.actionText}>View Orders</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(store)/customers')}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: Colors.success + '10' }]}>
              <Users size={24} color={Colors.success} />
            </View>
            <Text style={styles.actionText}>Customers</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(store)/(tabs)/analytics')}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: Colors.warning + '10' }]}>
              <BarChart2 size={24} color={Colors.warning} />
            </View>
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

// Helper functions
const getStatusText = (status: string): string => {
  switch (status) {
    case 'pending': return 'Pending';
    case 'accepted': return 'Accepted';
    case 'shopping': return 'Shopping';
    case 'checkout_complete': return 'Checkout Complete';
    case 'in_delivery': return 'In Delivery';
    case 'delivered': return 'Delivered';
    case 'cancelled': return 'Cancelled';
    default: return status;
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending': return Colors.warning;
    case 'accepted': 
    case 'shopping': 
    case 'checkout_complete': 
    case 'in_delivery': return Colors.info;
    case 'delivered': return Colors.success;
    case 'cancelled': return Colors.error;
    default: return Colors.subtext;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
  },
  storeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.8,
  },
  storeLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.white,
  },
  metricsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  metricIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  metricContent: {
    flex: 1,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 13,
    color: Colors.subtext,
  },
  section: {
    padding: 16,
    marginTop: 8,
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
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    marginRight: 4,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
    color: Colors.subtext,
  },
  orderDetails: {
    marginRight: 12,
  },
  orderItems: {
    fontSize: 13,
    color: Colors.subtext,
    textAlign: 'right',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'right',
  },
  orderStatus: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 10,
  },
  orderStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
  },
  emptyStateText: {
    color: Colors.subtext,
    fontSize: 14,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 40,
  },
});