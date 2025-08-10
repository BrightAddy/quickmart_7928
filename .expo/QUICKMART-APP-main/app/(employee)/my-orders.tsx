import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Package, AlertCircle } from 'lucide-react-native';
import OrderCard from '@/components/OrderCard';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/colors';
import { Order } from '@/types';
import { useOrderStore } from '@/store/order-store';
import { useAuthStore } from '@/store/auth-store';
import VerificationModal from '@/components/VerificationModal';
import DeliveryConfirmationModal from '@/components/DeliveryConfirmationModal';

export default function MyOrdersScreen() {
  const router = useRouter();
  const { orders, isLoading, fetchOrders, markDeliveredByShopper } = useOrderStore();
  const { user, isEmployeeVerifiedForToday, verifyEmployee } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [deliveryConfirmationVisible, setDeliveryConfirmationVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const isVerified = isEmployeeVerifiedForToday();
  
  useEffect(() => {
    if (user) {
      fetchOrders(user.id, user.role);
    }
  }, [user]);
  
  const getFilteredOrders = (): Order[] => {
    if (activeTab === 'active') {
      return orders.filter(order => 
        ['accepted', 'shopping', 'checkout_complete', 'in_delivery'].includes(order.status)
      );
    } else {
      return orders.filter(order => 
        ['delivered', 'delivered_by_shopper', 'confirmed_by_customer', 'completed', 'cancelled'].includes(order.status)
      );
    }
  };
  
  const handleOrderPress = (order: Order) => {
    if (!user) return;
    
    if (user.role === 'employee' && !isVerified) {
      // Need verification first
      setSelectedOrder(order);
      setVerificationModalVisible(true);
    } else {
      // Already verified, proceed to order details
      navigateToOrderDetails(order);
    }
  };
  
  const navigateToOrderDetails = (order: Order) => {
    router.push({
      pathname: '/(employee)/order/[id]',
      params: { id: order.id }
    });
  };
  
  const handleVerify = async (selfieImage: string) => {
    try {
      // Get current location (would use actual geolocation in a real app)
      const location = {
        latitude: 5.6037,
        longitude: -0.1870
      };
      
      const success = await verifyEmployee(selfieImage, location);
      
      if (success && selectedOrder) {
        // If verification successful and there was a selected order, navigate to it
        navigateToOrderDetails(selectedOrder);
      }
      
      return success;
    } catch (error) {
      console.error('Verification error:', error);
      return false;
    }
  };

  const handleMarkDelivered = (order: Order) => {
    if (!isVerified) {
      setSelectedOrder(order);
      setVerificationModalVisible(true);
      return;
    }

    setSelectedOrder(order);
    setDeliveryConfirmationVisible(true);
  };

  const confirmDelivery = async (photoUri?: string) => {
    if (!selectedOrder) return false;

    try {
      markDeliveredByShopper(selectedOrder.id, photoUri);
      
      Alert.alert(
        "Delivery Confirmed",
        "You have marked this order as delivered. The customer will be notified to confirm receipt.",
        [{ text: "OK" }]
      );
      
      // Refresh orders
      if (user) {
        fetchOrders(user.id, user.role);
      }
      
      return true;
    } catch (error) {
      console.error('Error confirming delivery:', error);
      return false;
    }
  };
  
  const renderOrderItem = ({ item }: { item: Order }) => (
    <OrderCard 
      order={item} 
      onPress={handleOrderPress}
      showDeliveryButton={item.status === 'in_delivery'}
      onMarkDelivered={() => handleMarkDelivered(item)}
    />
  );
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {!isVerified && user?.role === 'employee' && (
        <View style={styles.verificationBanner}>
          <AlertCircle size={20} color={Colors.white} />
          <Text style={styles.verificationBannerText}>
            Identity verification required to manage orders
          </Text>
          <TouchableOpacity 
            style={styles.verifyButton}
            onPress={() => setVerificationModalVisible(true)}
          >
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>
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
          <Text>Loading orders...</Text>
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
          buttonText="Find Orders"
          onButtonPress={() => router.push('/(employee)')}
        />
      ) : (
        <FlatList
          data={getFilteredOrders()}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      <VerificationModal
        visible={verificationModalVisible}
        onClose={() => {
          setVerificationModalVisible(false);
          setSelectedOrder(null);
        }}
        onVerify={handleVerify}
      />

      <DeliveryConfirmationModal
        visible={deliveryConfirmationVisible}
        onClose={() => {
          setDeliveryConfirmationVisible(false);
          setSelectedOrder(null);
        }}
        onConfirm={confirmDelivery}
        title="Confirm Delivery"
        description="Please confirm that you have delivered this order to the customer. Take a photo as proof of delivery."
        requirePhoto={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
  ordersList: {
    padding: 16,
  },
  verificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    padding: 12,
  },
  verificationBannerText: {
    flex: 1,
    color: Colors.white,
    fontSize: 14,
    marginLeft: 8,
  },
  verifyButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  verifyButtonText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
});