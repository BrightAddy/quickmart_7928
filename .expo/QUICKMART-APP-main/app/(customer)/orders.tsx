import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Package, ShoppingBag, Bell } from 'lucide-react-native';
import OrderCard from '@/components/OrderCard';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/colors';
import { Order } from '@/types';
import { useOrderStore } from '@/store/order-store';
import { useAuthStore } from '@/store/auth-store';
import DeliveryConfirmationModal from '@/components/DeliveryConfirmationModal';

export default function OrdersScreen() {
  const router = useRouter();
  const { orders, isLoading, fetchOrders, confirmDeliveryByCustomer } = useOrderStore();
  const { user } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  
  const loadOrders = async () => {
    if (user) {
      await fetchOrders(user.id, user.role);
    }
  };
  
  useEffect(() => {
    loadOrders();
  }, [user]);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };
  
  const getFilteredOrders = (): Order[] => {
    if (activeTab === 'active') {
      return orders.filter(order => 
        ['pending', 'accepted', 'shopping', 'checkout_complete', 'in_delivery', 'delivered_by_shopper'].includes(order.status)
      );
    } else {
      return orders.filter(order => 
        ['confirmed_by_customer', 'completed', 'delivered', 'cancelled'].includes(order.status)
      );
    }
  };
  
  const handleOrderPress = (order: Order) => {
    router.push({
      pathname: '/order/[id]',
      params: { id: order.id }
    });
  };

  const handleConfirmDelivery = (order: Order) => {
    setSelectedOrder(order);
    setConfirmationModalVisible(true);
  };

  const confirmDelivery = async () => {
    if (!selectedOrder) return false;

    try {
      confirmDeliveryByCustomer(selectedOrder.id);
      
      Alert.alert(
        "Delivery Confirmed",
        "Thank you for confirming your delivery. Your order is now complete.",
        [{ text: "OK" }]
      );
      
      // Refresh orders
      await loadOrders();
      
      return true;
    } catch (error) {
      console.error('Error confirming delivery:', error);
      return false;
    }
  };

  // Check if there are any orders that need customer confirmation
  const pendingConfirmationOrders = orders.filter(order => 
    order.status === 'delivered_by_shopper' && !order.customerConfirmedAt
  );
  
  const renderOrderItem = ({ item }: { item: Order }) => (
    <OrderCard 
      order={item} 
      onPress={handleOrderPress}
      showConfirmButton={item.status === 'delivered_by_shopper'}
      onConfirmDelivery={() => handleConfirmDelivery(item)}
    />
  );
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity 
          style={styles.shopButton}
          onPress={() => router.push('/(customer)')}
        >
          <ShoppingBag size={18} color={Colors.primary} />
          <Text style={styles.shopButtonText}>Shop</Text>
        </TouchableOpacity>
      </View>
      
      {pendingConfirmationOrders.length > 0 && (
        <View style={styles.notificationBanner}>
          <Bell size={20} color={Colors.white} />
          <Text style={styles.notificationText}>
            {pendingConfirmationOrders.length} {pendingConfirmationOrders.length === 1 ? 'order has' : 'orders have'} been delivered and {pendingConfirmationOrders.length === 1 ? 'needs' : 'need'} your confirmation
          </Text>
        </View>
      )}
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'active' && styles.activeTab
          ]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'active' && styles.activeTabText
          ]}>
            Active
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'completed' && styles.activeTab
          ]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'completed' && styles.activeTabText
          ]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : getFilteredOrders().length === 0 ? (
        <EmptyState
          title={`No ${activeTab === 'active' ? 'Active' : 'Completed'} Orders`}
          message={
            activeTab === 'active'
              ? "You don't have any active orders at the moment."
              : "You haven't completed any orders yet."
          }
          icon={<Package size={64} color={Colors.subtext} />}
          buttonText="Browse Stores"
          onButtonPress={() => router.push('/(customer)')}
        />
      ) : (
        <FlatList
          data={getFilteredOrders()}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
        />
      )}

      <DeliveryConfirmationModal
        visible={confirmationModalVisible}
        onClose={() => {
          setConfirmationModalVisible(false);
          setSelectedOrder(null);
        }}
        onConfirm={confirmDelivery}
        title="Confirm Delivery"
        description="Please confirm that you have received your order. This will complete the delivery process."
        isCustomer={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  shopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  shopButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  notificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    padding: 12,
  },
  notificationText: {
    flex: 1,
    color: Colors.white,
    fontSize: 14,
    marginLeft: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.subtext,
  },
  activeTabText: {
    color: Colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.subtext,
  },
  ordersList: {
    padding: 16,
  },
});