import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { 
  MapPin, 
  Clock, 
  CreditCard, 
  Package, 
  ChevronLeft,
  Phone,
  MessageCircle,
  Check,
  AlertCircle
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useOrderStore } from '@/store/order-store';
import { useAuthStore } from '@/store/auth-store';
import Button from '@/components/Button';
import DeliveryConfirmationModal from '@/components/DeliveryConfirmationModal';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getOrderById, confirmDeliveryByCustomer } = useOrderStore();
  const { user } = useAuthStore();
  
  const [order, setOrder] = useState(getOrderById(id as string));
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  
  useEffect(() => {
    // Refresh order data when the component mounts
    setOrder(getOrderById(id as string));
  }, [id]);
  
  if (!order) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatCurrency = (amount: number) => {
    return `GH₵ ${amount.toFixed(2)}`;
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return Colors.warning;
      case 'accepted':
      case 'shopping':
      case 'checkout_complete':
      case 'in_delivery':
        return Colors.primary;
      case 'delivered':
      case 'delivered_by_shopper':
      case 'confirmed_by_customer':
      case 'completed':
        return Colors.success;
      case 'cancelled':
        return Colors.error;
      default:
        return Colors.subtext;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'shopping':
        return 'Shopping';
      case 'checkout_complete':
        return 'Checkout Complete';
      case 'in_delivery':
        return 'In Delivery';
      case 'delivered':
        return 'Delivered';
      case 'delivered_by_shopper':
        return 'Awaiting Confirmation';
      case 'confirmed_by_customer':
        return 'Customer Confirmed';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const handleConfirmDelivery = async () => {
    setConfirmationModalVisible(true);
  };

  const confirmDelivery = async () => {
    try {
      setIsLoading(true);
      confirmDeliveryByCustomer(order.id);
      
      // Refresh order data
      setOrder(getOrderById(id as string));
      
      Alert.alert(
        "Delivery Confirmed",
        "Thank you for confirming your delivery. Your order is now complete.",
        [{ text: "OK" }]
      );
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error confirming delivery:', error);
      setIsLoading(false);
      return false;
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: `Order #${order.id.slice(-8)}`,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ChevronLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <View style={styles.statusSection}>
            <View style={styles.statusHeader}>
              <Text style={styles.sectionTitle}>Order Status</Text>
              <View style={styles.statusContainer}>
                <View 
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(order.status) }
                  ]} 
                />
                <Text 
                  style={[
                    styles.statusText,
                    { color: getStatusColor(order.status) }
                  ]}
                >
                  {getStatusText(order.status)}
                </Text>
              </View>
            </View>
            
            <View style={styles.timelineContainer}>
              {/* Timeline visualization would go here */}
              <Text style={styles.timelineText}>
                Order placed on {formatDate(order.createdAt)}
              </Text>
              
              {order.status === 'delivered_by_shopper' && user?.role === 'customer' && (
                <View style={styles.confirmationBanner}>
                  <AlertCircle size={20} color={Colors.primary} />
                  <Text style={styles.confirmationText}>
                    Your shopper has marked this order as delivered. Please confirm receipt.
                  </Text>
                </View>
              )}

              {order.deliveryPhoto && (
                <View style={styles.deliveryPhotoContainer}>
                  <Text style={styles.deliveryPhotoTitle}>Delivery Photo</Text>
                  <Image 
                    source={{ uri: order.deliveryPhoto }} 
                    style={styles.deliveryPhoto}
                    resizeMode="cover"
                  />
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Items</Text>
            {order.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Image 
                  source={{ uri: item.product.image }} 
                  style={styles.itemImage}
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.product.name}</Text>
                  <Text style={styles.itemQuantity}>
                    {item.quantity} x {formatCurrency(item.product.discountPrice || item.product.price)}
                  </Text>
                </View>
                <Text style={styles.itemPrice}>
                  {formatCurrency((item.product.discountPrice || item.product.price) * item.quantity)}
                </Text>
              </View>
            ))}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Details</Text>
            <View style={styles.detailRow}>
              <MapPin size={20} color={Colors.primary} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Delivery Address</Text>
                <Text style={styles.detailText}>
                  {order.address.name}: {order.address.address}
                </Text>
              </View>
            </View>
            
            {order.estimatedDeliveryTime && (
              <View style={styles.detailRow}>
                <Clock size={20} color={Colors.primary} />
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Estimated Delivery</Text>
                  <Text style={styles.detailText}>
                    {formatDate(order.estimatedDeliveryTime)}
                  </Text>
                </View>
              </View>
            )}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            <View style={styles.detailRow}>
              <CreditCard size={20} color={Colors.primary} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Payment Method</Text>
                <Text style={styles.detailText}>
                  {order.paymentMethod.type === 'momo' ? 'Mobile Money' : 'Card'}: {order.paymentMethod.details}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(order.total - order.deliveryFee)}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(order.deliveryFee)}
              </Text>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(order.total)}
              </Text>
            </View>
          </View>
        </View>
        
        {user?.role === 'customer' && order.status === 'delivered_by_shopper' && (
          <Button
            title="Confirm Delivery"
            onPress={handleConfirmDelivery}
            style={styles.confirmButton}
            icon={<Check size={20} color={Colors.white} />}
            isLoading={isLoading}
          />
        )}
        
        <DeliveryConfirmationModal
          visible={confirmationModalVisible}
          onClose={() => setConfirmationModalVisible(false)}
          onConfirm={confirmDelivery}
          title="Confirm Delivery"
          description="Please confirm that you have received your order. This will complete the delivery process."
          isCustomer={true}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  backButton: {
    padding: 8,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  section: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 16,
  },
  statusSection: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  timelineContainer: {
    marginTop: 8,
  },
  timelineText: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: Colors.subtext,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 16,
    color: Colors.text,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.subtext,
  },
  summaryValue: {
    fontSize: 16,
    color: Colors.text,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.subtext,
  },
  confirmButton: {
    marginTop: 8,
  },
  confirmationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightPrimary,
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  confirmationText: {
    flex: 1,
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 12,
  },
  deliveryPhotoContainer: {
    marginTop: 16,
  },
  deliveryPhotoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  deliveryPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
});