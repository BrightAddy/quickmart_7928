import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MapPin, Phone, Clock, CheckCircle, XCircle, User, DollarSign, ShoppingBag, Package } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { getOrderById } from '@/mocks/orders';
import { mockUsers } from '@/mocks/users';
import { CartItem, OrderStatus } from '@/types';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<OrderStatus | ''>('');
  
  // Get order details
  const order = getOrderById(id || '');
  
  if (!order) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Order Not Found</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>The order you are looking for does not exist.</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  // Find customer details
  const customer = mockUsers.find(user => user.id === order.customerId);
  
  // Set current status if not set
  if (!currentStatus) {
    setCurrentStatus(order.status);
  }
  
  // Calculate subtotal
  const subtotal = order.total - order.deliveryFee;
  const discount = 0; // Assuming no discount for now
  
  // Handle status update
  const updateOrderStatus = (newStatus: OrderStatus) => {
    Alert.alert(
      "Update Order Status",
      `Are you sure you want to change the order status to ${getStatusText(newStatus)}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Update", 
          onPress: () => {
            // In a real app, this would call an API to update the order status
            setCurrentStatus(newStatus);
            Alert.alert("Status Updated", `Order status has been updated to ${getStatusText(newStatus)}`);
          }
        }
      ]
    );
  };
  
  // Get next possible statuses based on current status
  const getNextStatuses = () => {
    switch (currentStatus) {
      case 'pending':
        return ['accepted', 'cancelled'] as OrderStatus[];
      case 'accepted':
        return ['shopping', 'cancelled'] as OrderStatus[];
      case 'shopping':
        return ['checkout_complete', 'cancelled'] as OrderStatus[];
      case 'checkout_complete':
        return ['in_delivery', 'cancelled'] as OrderStatus[];
      case 'in_delivery':
        return ['delivered', 'cancelled'] as OrderStatus[];
      default:
        return [] as OrderStatus[];
    }
  };
  
  const nextStatuses = getNextStatuses();
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order #{order.id.slice(-6)}</Text>
        <Text style={styles.headerSubtitle}>
          {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </Text>
      </View>
      
      <View style={styles.orderStatusCard}>
        <View style={styles.orderStatusHeader}>
          <Text style={styles.sectionTitle}>Order Status</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(currentStatus) + '15' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: getStatusColor(currentStatus) }
            ]}>
              {getStatusText(currentStatus)}
            </Text>
          </View>
        </View>
        
        {nextStatuses.length > 0 && (
          <View style={styles.statusActions}>
            <Text style={styles.statusActionsTitle}>Update Status:</Text>
            <View style={styles.statusButtons}>
              {nextStatuses.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusButton,
                    { 
                      backgroundColor: status === 'cancelled' ? Colors.error + '15' : Colors.primary + '15',
                    }
                  ]}
                  onPress={() => updateOrderStatus(status)}
                >
                  {status === 'cancelled' ? (
                    <XCircle size={16} color={Colors.error} style={styles.statusButtonIcon} />
                  ) : (
                    <CheckCircle size={16} color={Colors.primary} style={styles.statusButtonIcon} />
                  )}
                  <Text style={[
                    styles.statusButtonText,
                    { color: status === 'cancelled' ? Colors.error : Colors.primary }
                  ]}>
                    {getStatusText(status)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <User size={18} color={Colors.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Customer Information</Text>
          </View>
        </View>
        
        <View style={styles.customerCard}>
          <View style={styles.customerHeader}>
            <View style={styles.customerAvatar}>
              <Text style={styles.customerInitial}>{customer?.name.charAt(0) || 'U'}</Text>
            </View>
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{customer?.name || 'Unknown Customer'}</Text>
              <Text style={styles.customerType}>Regular Customer</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Phone size={16} color={Colors.subtext} style={styles.contactIcon} />
              <Text style={styles.contactText}>{customer?.phone || '+233 XX XXX XXXX'}</Text>
            </View>
            
            <View style={styles.contactItem}>
              <MapPin size={16} color={Colors.subtext} style={styles.contactIcon} />
              <Text style={styles.contactText}>{order.address.address}</Text>
            </View>
            
            <View style={styles.contactItem}>
              <Clock size={16} color={Colors.subtext} style={styles.contactIcon} />
              <Text style={styles.contactText}>
                Delivery Time: {order.estimatedDeliveryTime ? new Date(order.estimatedDeliveryTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'As soon as possible'}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <ShoppingBag size={18} color={Colors.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Order Items</Text>
          </View>
        </View>
        
        <View style={styles.orderItemsCard}>
          {order.items.map((item: CartItem, index: number) => (
            <View key={index} style={[
              styles.orderItem,
              index < order.items.length - 1 && styles.orderItemBorder
            ]}>
              <View style={styles.itemImageContainer}>
                {item.product.image ? (
                  <Image 
                    source={{ uri: item.product.image }} 
                    style={styles.itemImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.itemImagePlaceholder}>
                    <Package size={20} color={Colors.subtext} />
                  </View>
                )}
              </View>
              
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.product.name}</Text>
                <Text style={styles.itemVariant}>
                  {item.product.unit}
                </Text>
              </View>
              
              <View style={styles.itemQuantity}>
                <Text style={styles.quantityText}>{item.quantity}x</Text>
              </View>
              
              <View style={styles.itemPrice}>
                <Text style={styles.priceText}>₵{(item.product.price * item.quantity).toFixed(2)}</Text>
              </View>
            </View>
          ))}
          
          <View style={styles.orderSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₵{subtotal.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>₵{order.deliveryFee.toFixed(2)}</Text>
            </View>
            
            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={[styles.summaryValue, { color: Colors.success }]}>
                  -₵{discount.toFixed(2)}
                </Text>
              </View>
            )}
            
            <View style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₵{order.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <DollarSign size={18} color={Colors.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Payment Information</Text>
          </View>
        </View>
        
        <View style={styles.paymentCard}>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Payment Method</Text>
            <Text style={styles.paymentValue}>{order.paymentMethod.name}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Payment Status</Text>
            <View style={[
              styles.paymentStatus,
              { 
                backgroundColor: Colors.warning + '15' 
              }
            ]}>
              <Text style={[
                styles.paymentStatusText,
                { color: Colors.warning }
              ]}>
                Pending
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => {
            // In a real app, this would print the order receipt
            Alert.alert("Print Receipt", "Printing order receipt...");
          }}
        >
          <Text style={styles.primaryButtonText}>Print Receipt</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => {
            // In a real app, this would contact the customer
            Alert.alert("Contact Customer", "Contacting customer...");
          }}
        >
          <Text style={styles.secondaryButtonText}>Contact Customer</Text>
        </TouchableOpacity>
      </View>
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
  orderStatusCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    margin: 16,
    marginTop: -20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  orderStatusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusActions: {
    marginTop: 8,
  },
  statusActionsTitle: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 12,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  statusButtonIcon: {
    marginRight: 4,
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  customerCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  customerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  customerInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
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
  customerType: {
    fontSize: 14,
    color: Colors.subtext,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border + '30',
  },
  contactInfo: {
    padding: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactIcon: {
    marginRight: 12,
  },
  contactText: {
    fontSize: 14,
    color: Colors.text,
  },
  orderItemsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  orderItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '30',
  },
  itemImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  itemVariant: {
    fontSize: 14,
    color: Colors.subtext,
  },
  itemQuantity: {
    marginRight: 16,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  itemPrice: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  orderSummary: {
    padding: 16,
    backgroundColor: Colors.background + '50',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.subtext,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.text,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  paymentCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  paymentLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  paymentStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  secondaryButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.subtext,
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
});