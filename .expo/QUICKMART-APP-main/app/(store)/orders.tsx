import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Search, Filter, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { StoreOwner } from '@/types';
import { getOrdersByStore } from '@/mocks/orders';
import { mockUsers } from '@/mocks/users';

export default function StoreOrdersScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const storeOwner = user as StoreOwner;
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'in-progress', 'completed', 'cancelled'
  
  // Get store orders
  const storeOrders = getOrdersByStore(storeOwner?.storeId || '');
  
  // Filter orders based on search and status
  const filteredOrders = storeOrders.filter(order => {
    // Get customer name from mockUsers
    const customer = mockUsers.find(user => user.id === order.customerId);
    const customerName = customer?.name || 'Unknown Customer';
    
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         customerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'pending') return matchesSearch && order.status === 'pending';
    if (filterStatus === 'in-progress') return matchesSearch && ['accepted', 'shopping', 'checkout_complete', 'in_delivery'].includes(order.status);
    if (filterStatus === 'completed') return matchesSearch && order.status === 'delivered';
    if (filterStatus === 'cancelled') return matchesSearch && order.status === 'cancelled';
    
    return matchesSearch;
  });
  
  // Calculate order stats
  const pendingOrders = storeOrders.filter(order => order.status === 'pending').length;
  const inProgressOrders = storeOrders.filter(order => ['accepted', 'shopping', 'checkout_complete', 'in_delivery'].includes(order.status)).length;
  const completedOrders = storeOrders.filter(order => order.status === 'delivered').length;
  const cancelledOrders = storeOrders.filter(order => order.status === 'cancelled').length;
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
        <Text style={styles.headerSubtitle}>Manage your store orders</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.subtext} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search orders..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsContainer}>
        <TouchableOpacity 
          style={[styles.statTab, filterStatus === 'all' && styles.activeStatTab]}
          onPress={() => setFilterStatus('all')}
        >
          <Text style={styles.statValue}>{storeOrders.length}</Text>
          <Text style={[styles.statLabel, filterStatus === 'all' && styles.activeStatLabel]}>All</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.statTab, filterStatus === 'pending' && styles.activeStatTab]}
          onPress={() => setFilterStatus('pending')}
        >
          <Text style={styles.statValue}>{pendingOrders}</Text>
          <Text style={[styles.statLabel, filterStatus === 'pending' && styles.activeStatLabel]}>Pending</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.statTab, filterStatus === 'in-progress' && styles.activeStatTab]}
          onPress={() => setFilterStatus('in-progress')}
        >
          <Text style={styles.statValue}>{inProgressOrders}</Text>
          <Text style={[styles.statLabel, filterStatus === 'in-progress' && styles.activeStatLabel]}>In Progress</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.statTab, filterStatus === 'completed' && styles.activeStatTab]}
          onPress={() => setFilterStatus('completed')}
        >
          <Text style={styles.statValue}>{completedOrders}</Text>
          <Text style={[styles.statLabel, filterStatus === 'completed' && styles.activeStatLabel]}>Completed</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.statTab, filterStatus === 'cancelled' && styles.activeStatTab]}
          onPress={() => setFilterStatus('cancelled')}
        >
          <Text style={styles.statValue}>{cancelledOrders}</Text>
          <Text style={[styles.statLabel, filterStatus === 'cancelled' && styles.activeStatLabel]}>Cancelled</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredOrders}
        renderItem={({ item: order }) => {
          // Get customer name from mockUsers
          const customer = mockUsers.find(user => user.id === order.customerId);
          const customerName = customer?.name || 'Unknown Customer';
          
          return (
            <TouchableOpacity 
              style={styles.orderItem}
              onPress={() => router.push({
                pathname: '/order/[id]',
                params: { id: order.id }
              })}
            >
              <View style={styles.orderInfo}>
                <Text style={styles.orderId}>Order #{order.id.slice(-6)}</Text>
                <Text style={styles.orderCustomer}>{customerName}</Text>
                <Text style={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
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
                { backgroundColor: getStatusColor(order.status) + '20' }
              ]}>
                <Text style={[
                  styles.orderStatusText,
                  { color: getStatusColor(order.status) }
                ]}>
                  {getStatusText(order.status)}
                </Text>
              </View>
              
              <ChevronRight size={20} color={Colors.subtext} />
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.ordersList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No orders found</Text>
          </View>
        }
      />
    </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: Colors.text,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeStatTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.subtext,
  },
  activeStatLabel: {
    color: Colors.primary,
    fontWeight: '500',
  },
  ordersList: {
    padding: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  orderCustomer: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: Colors.subtext,
  },
  orderDetails: {
    marginRight: 12,
  },
  orderItems: {
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'right',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'right',
  },
  orderStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  orderStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.subtext,
  },
});