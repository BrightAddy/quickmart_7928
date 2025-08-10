import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Package, UserCheck, AlertCircle } from 'lucide-react-native';
import OrderCard from '@/components/OrderCard';
import EmptyState from '@/components/EmptyState';
import VerificationModal from '@/components/VerificationModal';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { Order } from '@/types';
import { useOrderStore } from '@/store/order-store';
import { useAuthStore } from '@/store/auth-store';
import { getPendingOrders } from '@/mocks/orders';

export default function AvailableOrdersScreen() {
  const router = useRouter();
  const { updateOrderStatus } = useOrderStore();
  const { user, verifyEmployee, isEmployeeVerifiedForToday } = useAuthStore();
  
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const isVerified = isEmployeeVerifiedForToday();
  
  useEffect(() => {
    // Get pending orders
    const pendingOrders = getPendingOrders();
    setAvailableOrders(pendingOrders);
    setIsLoading(false);
    
    // Check if verification is needed when the screen loads
    if (user?.role === 'employee' && !isVerified) {
      // Don't show modal immediately, let user see the screen first
    }
  }, []);
  
  const handleOrderPress = (order: Order) => {
    if (!user) return;
    
    if (user.role === 'employee' && !isVerified) {
      // Need verification first
      setSelectedOrder(order);
      setVerificationModalVisible(true);
    } else {
      // Already verified, proceed with order acceptance
      showAcceptOrderAlert(order);
    }
  };
  
  const showAcceptOrderAlert = (order: Order) => {
    Alert.alert(
      "Accept Order",
      "Would you like to accept this order?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Accept", 
          onPress: () => {
            if (user) {
              updateOrderStatus(order.id, 'accepted', user.id);
              router.push({
                pathname: '/(employee)/order/[id]',
                params: { id: order.id }
              });
            }
          }
        }
      ]
    );
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
        // If verification successful and there was a selected order, show accept dialog
        showAcceptOrderAlert(selectedOrder);
      }
      
      return success;
    } catch (error) {
      console.error('Verification error:', error);
      return false;
    }
  };
  
  const renderOrderItem = ({ item }: { item: Order }) => (
    <OrderCard order={item} onPress={handleOrderPress} />
  );
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {!isVerified && user?.role === 'employee' && (
        <View style={styles.verificationBanner}>
          <AlertCircle size={20} color={Colors.white} />
          <Text style={styles.verificationBannerText}>
            Identity verification required before accepting orders
          </Text>
          <TouchableOpacity 
            style={styles.verifyButton}
            onPress={() => setVerificationModalVisible(true)}
          >
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.header}>
        <Text style={styles.title}>Available Orders</Text>
        <Text style={styles.subtitle}>Accept orders to start shopping</Text>
        
        {isVerified && (
          <View style={styles.verifiedBadge}>
            <UserCheck size={16} color={Colors.white} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading orders...</Text>
        </View>
      ) : availableOrders.length === 0 ? (
        <EmptyState
          title="No Available Orders"
          message="There are no orders available at the moment. Check back later."
          icon={<Package size={64} color={Colors.subtext} />}
        />
      ) : (
        <FlatList
          data={availableOrders}
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
    </View>
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
    marginRight: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.subtext,
    width: '100%',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  verifiedText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
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