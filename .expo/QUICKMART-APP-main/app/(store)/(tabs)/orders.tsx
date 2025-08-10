import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Search, Filter, ArrowUpRight, AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { StoreOwner } from '@/types';
import { getOrdersByStore } from '@/mocks/orders';
import { mockUsers } from '@/mocks/users';
import ScrollableTab, { TabItem } from '@/components/ScrollableTab';

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
  
  // Define tabs
  const tabs: TabItem[] = [
    { id: 'all', label: 'All', count: storeOrders.length },
    { id: 'pending', label: 'Pending', count: pendingOrders },
    { id: 'in-progress', label: 'In Progress', count: inProgressOrders },
    { id: 'completed', label: 'Completed', count: completedOrders },
    { id: 'cancelled', label: 'Cancelled', count: cancelledOrders }
  ];
  
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
            placeholderTextColor={Colors.subtext}
          />
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabsContainer}>
        <ScrollableTab 
          tabs={tabs}
          activeTab={filterStatus}
          onTabChange={setFilterStatus}
        />
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
                pathname: '/(store)/order/[id]',
                params: { id: order.id }
              })}
            >
              <View style={styles.orderHeader}>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderId}>Order #{order.id.slice(-6)}</Text>
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
                </View>
                <Text style={styles.orderTotal}>₵{order.total.toFixed(2)}</Text>
              </View>
              
              <View style={styles.customerInfo}>
                <View style={styles.customerAvatar}>
                  <Text style={styles.customerInitial}>{customerName.charAt(0)}</Text>
                </View>
                <View style={styles.customerDetails}>
                  <Text style={styles.customerName}>{customerName}</Text>
                  <Text style={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Text>
                </View>
                <View style={styles.orderItems}>
                  <Text style={styles.orderItemsText}>
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </Text>
                </View>
                <ArrowUpRight size={18} color={Colors.subtext} />
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.ordersList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <AlertCircle size={40} color={Colors.subtext} style={styles.emptyStateIcon} />
            <Text style={styles.emptyStateTitle}>No orders found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery ? "Try adjusting your search" : "Orders will appear here when customers place them"}
            </Text>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  tabsContainer: {
    backgroundColor: Colors.white,
  },
  ordersList: {
    padding: 16,
  },
  orderItem: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '50',
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 10,
  },
  orderStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  orderStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  customerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  customerInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: Colors.subtext,
  },
  orderItems: {
    marginRight: 12,
  },
  orderItemsText: {
    fontSize: 13,
    color: Colors.subtext,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginTop: 20,
  },
  emptyStateIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'center',
  },
});