import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Search, Filter, Phone, Mail, MapPin, ShoppingBag } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { StoreOwner } from '@/types';
import { getOrdersByStore } from '@/mocks/orders';
import { mockUsers } from '@/mocks/users';

export default function StoreCustomersScreen() {
  const { user } = useAuthStore();
  const storeOwner = user as StoreOwner;
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'name', 'orders', 'spent'
  
  // Get store orders
  const storeOrders = getOrdersByStore(storeOwner?.storeId || '');
  
  // Extract unique customers from orders
  const customerIds = new Set(storeOrders.map(order => order.customerId));
  const storeCustomers = Array.from(customerIds).map(customerId => {
    const customerOrders = storeOrders.filter(order => order.customerId === customerId);
    const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);
    const lastOrderDate = new Date(Math.max(...customerOrders.map(order => new Date(order.createdAt).getTime())));
    
    // Find customer details from mock users
    const customerDetails = mockUsers.find(user => user.id === customerId);
    
    return {
      id: customerId,
      name: customerDetails?.name || 'Unknown Customer',
      email: customerDetails?.email || 'customer@example.com',
      phone: customerDetails?.phone || '+233 XX XXX XXXX',
      address: customerDetails?.role === 'customer' ? 
        (customerDetails as any).addresses?.[0]?.address || 'Accra, Ghana' : 
        'Accra, Ghana',
      avatar: `https://i.pravatar.cc/150?u=${customerId}`,
      ordersCount: customerOrders.length,
      totalSpent,
      lastOrderDate,
    };
  });
  
  // Filter customers based on search
  const filteredCustomers = storeCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortBy === 'recent') {
      return b.lastOrderDate.getTime() - a.lastOrderDate.getTime();
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'orders') {
      return b.ordersCount - a.ordersCount;
    } else if (sortBy === 'spent') {
      return b.totalSpent - a.totalSpent;
    }
    return 0;
  });
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Customers</Text>
        <Text style={styles.headerSubtitle}>Manage your customer relationships</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.subtext} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search customers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <TouchableOpacity 
          style={[styles.sortButton, sortBy === 'recent' && styles.activeSortButton]}
          onPress={() => setSortBy('recent')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'recent' && styles.activeSortButtonText]}>Recent</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.sortButton, sortBy === 'name' && styles.activeSortButton]}
          onPress={() => setSortBy('name')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'name' && styles.activeSortButtonText]}>Name</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.sortButton, sortBy === 'orders' && styles.activeSortButton]}
          onPress={() => setSortBy('orders')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'orders' && styles.activeSortButtonText]}>Orders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.sortButton, sortBy === 'spent' && styles.activeSortButton]}
          onPress={() => setSortBy('spent')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'spent' && styles.activeSortButtonText]}>Spent</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={sortedCustomers}
        renderItem={({ item: customer }) => (
          <View style={styles.customerCard}>
            <View style={styles.customerHeader}>
              <Image 
                source={{ uri: customer.avatar }} 
                style={styles.customerAvatar} 
              />
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{customer.name}</Text>
                <Text style={styles.customerSince}>
                  Customer since {customer.lastOrderDate.toLocaleDateString()}
                </Text>
              </View>
            </View>
            
            <View style={styles.customerStats}>
              <View style={styles.statItem}>
                <ShoppingBag size={16} color={Colors.primary} />
                <Text style={styles.statValue}>{customer.ordersCount}</Text>
                <Text style={styles.statLabel}>Orders</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>₵{customer.totalSpent.toFixed(2)}</Text>
                <Text style={styles.statLabel}>Total Spent</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>₵{(customer.totalSpent / customer.ordersCount).toFixed(2)}</Text>
                <Text style={styles.statLabel}>Avg. Order</Text>
              </View>
            </View>
            
            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <Phone size={16} color={Colors.subtext} />
                <Text style={styles.contactText}>{customer.phone}</Text>
              </View>
              
              <View style={styles.contactItem}>
                <Mail size={16} color={Colors.subtext} />
                <Text style={styles.contactText}>{customer.email}</Text>
              </View>
              
              <View style={styles.contactItem}>
                <MapPin size={16} color={Colors.subtext} />
                <Text style={styles.contactText}>{customer.address}</Text>
              </View>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>View Orders</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionButton, styles.secondaryActionButton]}>
                <Text style={styles.secondaryActionButtonText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.customersList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No customers found</Text>
          </View>
        }
      />
    </View>
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
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sortLabel: {
    fontSize: 14,
    color: Colors.subtext,
    marginRight: 12,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  activeSortButton: {
    backgroundColor: Colors.primary + '20',
  },
  sortButtonText: {
    fontSize: 14,
    color: Colors.text,
  },
  activeSortButtonText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  customersList: {
    padding: 16,
  },
  customerCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  customerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  customerSince: {
    fontSize: 14,
    color: Colors.subtext,
  },
  customerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.subtext,
  },
  contactInfo: {
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.white,
  },
  secondaryActionButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  secondaryActionButtonText: {
    color: Colors.primary,
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