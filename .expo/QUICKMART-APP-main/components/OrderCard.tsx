import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin, Clock, ChevronRight, Package, ShoppingBag, Check, AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Order } from '@/types';
import Button from './Button';

interface OrderCardProps {
  order: Order;
  onPress: (order: Order) => void;
  showDeliveryButton?: boolean;
  onMarkDelivered?: (order: Order) => void;
  showConfirmButton?: boolean;
  onConfirmDelivery?: (order: Order) => void;
}

export default function OrderCard({ 
  order, 
  onPress, 
  showDeliveryButton = false,
  onMarkDelivered,
  showConfirmButton = false,
  onConfirmDelivery
}: OrderCardProps) {
  const getStatusColor = (status: Order['status']) => {
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
  
  const getStatusText = (status: Order['status']) => {
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
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatCurrency = (amount: number) => {
    return `GH₵ ${amount.toFixed(2)}`;
  };
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(order)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order #{order.id.slice(-8)}</Text>
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
        <Text style={styles.date}>{formatDate(order.createdAt)}</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.storeSection}>
          <ShoppingBag size={16} color={Colors.primary} />
          <Text style={styles.storeText} numberOfLines={1}>
            {order.items[0]?.product.name} {order.items.length > 1 ? `+ ${order.items.length - 1} more items` : ''}
          </Text>
        </View>
        
        <View style={styles.addressSection}>
          <MapPin size={16} color={Colors.subtext} />
          <Text style={styles.addressText} numberOfLines={1}>
            {order.address.name}: {order.address.address}
          </Text>
        </View>
        
        {order.estimatedDeliveryTime && (
          <View style={styles.timeSection}>
            <Clock size={16} color={Colors.subtext} />
            <Text style={styles.timeText}>
              Est. delivery: {formatDate(order.estimatedDeliveryTime)}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: {formatCurrency(order.total)}</Text>
        
        {showDeliveryButton && onMarkDelivered ? (
          <Button
            title="Mark Delivered"
            onPress={() => onMarkDelivered(order)}
            size="small"
            style={styles.actionButton}
            icon={<Check size={16} color={Colors.white} />}
          />
        ) : showConfirmButton && onConfirmDelivery ? (
          <Button
            title="Confirm Receipt"
            onPress={() => onConfirmDelivery(order)}
            size="small"
            style={styles.actionButton}
            icon={<Check size={16} color={Colors.white} />}
          />
        ) : (
          <ChevronRight size={20} color={Colors.subtext} />
        )}
      </View>
      
      {order.status === 'delivered_by_shopper' && (
        <View style={styles.confirmationBanner}>
          <AlertCircle size={16} color={Colors.primary} />
          <Text style={styles.confirmationText}>
            Shopper has marked this order as delivered. Please confirm receipt.
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  date: {
    fontSize: 12,
    color: Colors.subtext,
  },
  content: {
    marginBottom: 12,
  },
  storeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  storeText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
    flex: 1,
  },
  addressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: Colors.subtext,
    marginLeft: 8,
    flex: 1,
  },
  timeSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: Colors.subtext,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  actionButton: {
    paddingHorizontal: 12,
  },
  confirmationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightPrimary,
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  confirmationText: {
    flex: 1,
    fontSize: 12,
    color: Colors.primary,
    marginLeft: 8,
  },
});