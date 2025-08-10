import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, RotateCcw, Star, ChevronRight, Filter, Calendar } from 'lucide-react-native';
import Button from '@/components/Button';
import { getColors } from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';
import Layout from '@/constants/layout';
import { Order } from '@/types';

// Mock order history data
const mockOrderHistory: Order[] = [
  {
    id: 'order_001',
    customerId: 'customer1',
    storeId: 'store1',
    storeName: 'Fresh Market',
    items: [
      {
        id: '1',
        name: 'Organic Bananas',
        price: 2.99,
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=400&auto=format&fit=crop',
        quantity: 2,
        storeId: 'store1'
      },
      {
        id: '2',
        name: 'Greek Yogurt',
        price: 4.29,
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=400&auto=format&fit=crop',
        quantity: 1,
        storeId: 'store1'
      }
    ],
    total: 10.27,
    status: 'delivered',
    createdAt: new Date('2024-01-15T10:30:00'),
    deliveredAt: new Date('2024-01-15T11:15:00'),
    deliveryAddress: '123 Main St, Apt 4B',
    paymentMethod: 'Credit Card',
    deliveryFee: 2.99,
    rating: 5
  },
  {
    id: 'order_002',
    customerId: 'customer1',
    storeId: 'store2',
    storeName: 'Corner Grocery',
    items: [
      {
        id: '3',
        name: 'Premium Coffee Beans',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=400&auto=format&fit=crop',
        quantity: 1,
        storeId: 'store2'
      }
    ],
    total: 15.98,
    status: 'preparing',
    createdAt: new Date('2024-01-16T14:20:00'),
    deliveryAddress: '123 Main St, Apt 4B',
    paymentMethod: 'Mobile Money',
    deliveryFee: 2.99
  },
  {
    id: 'order_003',
    customerId: 'customer1',
    storeId: 'store1',
    storeName: 'Fresh Market',
    items: [
      {
        id: '4',
        name: 'Avocados',
        price: 1.99,
        image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=400&auto=format&fit=crop',
        quantity: 3,
        storeId: 'store1'
      },
      {
        id: '5',
        name: 'Sourdough Bread',
        price: 5.49,
        image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=400&auto=format&fit=crop',
        quantity: 1,
        storeId: 'store1'
      }
    ],
    total: 14.46,
    status: 'cancelled',
    createdAt: new Date('2024-01-14T16:45:00'),
    deliveryAddress: '123 Main St, Apt 4B',
    paymentMethod: 'Credit Card',
    deliveryFee: 2.99,
    cancelledAt: new Date('2024-01-14T16:50:00')
  },
  {
    id: 'order_004',
    customerId: 'customer1',
    storeId: 'store3',
    storeName: 'Organic Plus',
    items: [
      {
        id: '6',
        name: 'Organic Spinach',
        price: 3.49,
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=400&auto=format&fit=crop',
        quantity: 2,
        storeId: 'store3'
      }
    ],
    total: 9.97,
    status: 'delivered',
    createdAt: new Date('2024-01-13T09:15:00'),
    deliveredAt: new Date('2024-01-13T10:00:00'),
    deliveryAddress: '123 Main St, Apt 4B',
    paymentMethod: 'Mobile Money',
    deliveryFee: 2.99,
    rating: 4
  }
];

export default function OrderHistoryScreen() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  const styles = createStyles(Colors);
  
  const [orders, setOrders] = useState<Order[]>(mockOrderHistory);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  const filterOptions = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
    { id: 'preparing', label: 'Active', count: orders.filter(o => ['preparing', 'ready', 'delivering'].includes(o.status)).length },
    { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
  ];\n  \n  const filteredOrders = selectedFilter === 'all' \n    ? orders \n    : selectedFilter === 'preparing'\n      ? orders.filter(order => ['preparing', 'ready', 'delivering'].includes(order.status))\n      : orders.filter(order => order.status === selectedFilter);\n  \n  const getStatusIcon = (status: string) => {\n    switch (status) {\n      case 'delivered':\n        return <CheckCircle size={20} color={Colors.success} />;\n      case 'cancelled':\n        return <XCircle size={20} color={Colors.error} />;\n      case 'preparing':\n      case 'ready':\n      case 'delivering':\n        return <Clock size={20} color={Colors.warning} />;\n      default:\n        return <Package size={20} color={Colors.subtext} />;\n    }\n  };\n  \n  const getStatusText = (status: string) => {\n    switch (status) {\n      case 'delivered':\n        return 'Delivered';\n      case 'cancelled':\n        return 'Cancelled';\n      case 'preparing':\n        return 'Preparing';\n      case 'ready':\n        return 'Ready for Pickup';\n      case 'delivering':\n        return 'Out for Delivery';\n      default:\n        return status;\n    }\n  };\n  \n  const getStatusColor = (status: string) => {\n    switch (status) {\n      case 'delivered':\n        return Colors.success;\n      case 'cancelled':\n        return Colors.error;\n      case 'preparing':\n      case 'ready':\n      case 'delivering':\n        return Colors.warning;\n      default:\n        return Colors.subtext;\n    }\n  };\n  \n  const handleReorder = (order: Order) => {\n    Alert.alert(\n      'Reorder Items',\n      `Add all items from this order to your cart?`,\n      [\n        {\n          text: 'Cancel',\n          style: 'cancel'\n        },\n        {\n          text: 'Add to Cart',\n          onPress: () => {\n            // In a real app, this would add items to cart\n            Alert.alert('Success', 'Items added to cart!');\n          }\n        }\n      ]\n    );\n  };\n  \n  const handleRateOrder = (order: Order) => {\n    Alert.alert(\n      'Rate Your Order',\n      'How was your experience with this order?',\n      [\n        { text: 'Cancel', style: 'cancel' },\n        { text: '⭐', onPress: () => updateRating(order.id, 1) },\n        { text: '⭐⭐', onPress: () => updateRating(order.id, 2) },\n        { text: '⭐⭐⭐', onPress: () => updateRating(order.id, 3) },\n        { text: '⭐⭐⭐⭐', onPress: () => updateRating(order.id, 4) },\n        { text: '⭐⭐⭐⭐⭐', onPress: () => updateRating(order.id, 5) }\n      ]\n    );\n  };\n  \n  const updateRating = (orderId: string, rating: number) => {\n    setOrders(prev => prev.map(order => \n      order.id === orderId ? { ...order, rating } : order\n    ));\n    Alert.alert('Thank you!', 'Your rating has been submitted.');\n  };\n  \n  const formatDate = (date: Date) => {\n    return date.toLocaleDateString('en-US', {\n      month: 'short',\n      day: 'numeric',\n      year: 'numeric',\n      hour: '2-digit',\n      minute: '2-digit'\n    });\n  };\n  \n  const renderOrderItem = (order: Order) => (\n    <TouchableOpacity\n      key={order.id}\n      style={styles.orderItem}\n      onPress={() => router.push(`/order/${order.id}`)}\n    >\n      <View style={styles.orderHeader}>\n        <View style={styles.orderInfo}>\n          <Text style={styles.orderNumber}>Order #{order.id.slice(-6).toUpperCase()}</Text>\n          <Text style={styles.storeName}>{order.storeName}</Text>\n          <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>\n        </View>\n        \n        <View style={styles.orderStatus}>\n          {getStatusIcon(order.status)}\n          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>\n            {getStatusText(order.status)}\n          </Text>\n        </View>\n      </View>\n      \n      <View style={styles.orderItems}>\n        <View style={styles.itemImages}>\n          {order.items.slice(0, 3).map((item, index) => (\n            <Image\n              key={item.id}\n              source={{ uri: item.image }}\n              style={[styles.itemImage, { marginLeft: index > 0 ? -8 : 0 }]}\n            />\n          ))}\n          {order.items.length > 3 && (\n            <View style={[styles.itemImage, styles.moreItems, { marginLeft: -8 }]}>\n              <Text style={styles.moreItemsText}>+{order.items.length - 3}</Text>\n            </View>\n          )}\n        </View>\n        \n        <View style={styles.itemDetails}>\n          <Text style={styles.itemCount}>\n            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}\n          </Text>\n          <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>\n        </View>\n      </View>\n      \n      {order.status === 'delivered' && (\n        <View style={styles.orderActions}>\n          {order.rating ? (\n            <View style={styles.ratingDisplay}>\n              <Star size={16} color={Colors.warning} fill={Colors.warning} />\n              <Text style={styles.ratingText}>{order.rating}/5</Text>\n            </View>\n          ) : (\n            <TouchableOpacity\n              style={styles.actionButton}\n              onPress={() => handleRateOrder(order)}\n            >\n              <Star size={16} color={Colors.primary} />\n              <Text style={styles.actionButtonText}>Rate</Text>\n            </TouchableOpacity>\n          )}\n          \n          <TouchableOpacity\n            style={styles.actionButton}\n            onPress={() => handleReorder(order)}\n          >\n            <RotateCcw size={16} color={Colors.primary} />\n            <Text style={styles.actionButtonText}>Reorder</Text>\n          </TouchableOpacity>\n        </View>\n      )}\n      \n      <View style={styles.orderFooter}>\n        <Text style={styles.viewDetailsText}>Tap to view details</Text>\n        <ChevronRight size={16} color={Colors.subtext} />\n      </View>\n    </TouchableOpacity>\n  );\n  \n  return (\n    <View style={styles.container}>\n      <StatusBar style={isDarkMode ? \"light\" : \"dark\"} />\n      \n      {/* Header */}\n      <View style={styles.header}>\n        <TouchableOpacity\n          style={styles.backButton}\n          onPress={() => router.back()}\n        >\n          <ArrowLeft size={24} color={Colors.text} />\n        </TouchableOpacity>\n        \n        <View style={styles.headerContent}>\n          <Text style={styles.headerTitle}>Order History</Text>\n          <Text style={styles.headerSubtitle}>\n            {orders.length} {orders.length === 1 ? 'order' : 'orders'} total\n          </Text>\n        </View>\n        \n        <TouchableOpacity style={styles.headerAction}>\n          <Calendar size={24} color={Colors.text} />\n        </TouchableOpacity>\n      </View>\n      \n      {orders.length === 0 ? (\n        <View style={styles.emptyState}>\n          <Package size={80} color={Colors.border} />\n          <Text style={styles.emptyTitle}>No orders yet</Text>\n          <Text style={styles.emptyDescription}>\n            When you place your first order, it will appear here.\n          </Text>\n          <Button\n            title=\"Start Shopping\"\n            onPress={() => router.push('/(customer)')}\n            style={styles.emptyButton}\n          />\n        </View>\n      ) : (\n        <>\n          {/* Filter Tabs */}\n          <View style={styles.filterContainer}>\n            <ScrollView \n              horizontal \n              showsHorizontalScrollIndicator={false}\n              contentContainerStyle={styles.filterList}\n            >\n              {filterOptions.map((filter) => (\n                <TouchableOpacity\n                  key={filter.id}\n                  style={[\n                    styles.filterChip,\n                    selectedFilter === filter.id && styles.selectedFilterChip\n                  ]}\n                  onPress={() => setSelectedFilter(filter.id)}\n                >\n                  <Text style={[\n                    styles.filterChipText,\n                    selectedFilter === filter.id && styles.selectedFilterChipText\n                  ]}>\n                    {filter.label}\n                  </Text>\n                  <View style={[\n                    styles.filterCount,\n                    selectedFilter === filter.id && styles.selectedFilterCount\n                  ]}>\n                    <Text style={[\n                      styles.filterCountText,\n                      selectedFilter === filter.id && styles.selectedFilterCountText\n                    ]}>\n                      {filter.count}\n                    </Text>\n                  </View>\n                </TouchableOpacity>\n              ))}\n            </ScrollView>\n          </View>\n          \n          {/* Orders List */}\n          <ScrollView \n            style={styles.content}\n            contentContainerStyle={styles.contentContainer}\n            showsVerticalScrollIndicator={false}\n          >\n            {filteredOrders.length === 0 ? (\n              <View style={styles.noResultsState}>\n                <Filter size={60} color={Colors.border} />\n                <Text style={styles.noResultsTitle}>No orders found</Text>\n                <Text style={styles.noResultsDescription}>\n                  No orders match the selected filter.\n                </Text>\n              </View>\n            ) : (\n              filteredOrders.map(renderOrderItem)\n            )}\n            \n            <View style={styles.bottomSpacing} />\n          </ScrollView>\n        </>\n      )}\n    </View>\n  );\n}\n\nconst createStyles = (Colors: any) => StyleSheet.create({\n  container: {\n    flex: 1,\n    backgroundColor: Colors.background,\n  },\n  header: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    padding: Layout.padding,\n    backgroundColor: Colors.white,\n    borderBottomWidth: 1,\n    borderBottomColor: Colors.border,\n  },\n  backButton: {\n    padding: 8,\n    marginRight: 8,\n  },\n  headerContent: {\n    flex: 1,\n  },\n  headerTitle: {\n    fontSize: 20,\n    fontWeight: 'bold',\n    color: Colors.text,\n  },\n  headerSubtitle: {\n    fontSize: 14,\n    color: Colors.subtext,\n    marginTop: 2,\n  },\n  headerAction: {\n    padding: 8,\n    marginLeft: 8,\n  },\n  emptyState: {\n    flex: 1,\n    justifyContent: 'center',\n    alignItems: 'center',\n    padding: Layout.padding * 2,\n  },\n  emptyTitle: {\n    fontSize: 24,\n    fontWeight: 'bold',\n    color: Colors.text,\n    marginTop: 24,\n    marginBottom: 12,\n  },\n  emptyDescription: {\n    fontSize: 16,\n    color: Colors.subtext,\n    textAlign: 'center',\n    lineHeight: 24,\n    marginBottom: 32,\n  },\n  emptyButton: {\n    minWidth: 200,\n  },\n  filterContainer: {\n    backgroundColor: Colors.white,\n    borderBottomWidth: 1,\n    borderBottomColor: Colors.border,\n    paddingVertical: 12,\n  },\n  filterList: {\n    paddingHorizontal: Layout.padding,\n  },\n  filterChip: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    paddingHorizontal: 16,\n    paddingVertical: 8,\n    borderRadius: 20,\n    backgroundColor: Colors.card,\n    borderWidth: 1,\n    borderColor: Colors.border,\n    marginRight: 8,\n  },\n  selectedFilterChip: {\n    backgroundColor: Colors.primary,\n    borderColor: Colors.primary,\n  },\n  filterChipText: {\n    fontSize: 14,\n    fontWeight: '500',\n    color: Colors.text,\n    marginRight: 6,\n  },\n  selectedFilterChipText: {\n    color: Colors.white,\n  },\n  filterCount: {\n    backgroundColor: Colors.border,\n    borderRadius: 10,\n    minWidth: 20,\n    height: 20,\n    justifyContent: 'center',\n    alignItems: 'center',\n  },\n  selectedFilterCount: {\n    backgroundColor: Colors.white,\n  },\n  filterCountText: {\n    fontSize: 12,\n    fontWeight: '600',\n    color: Colors.text,\n  },\n  selectedFilterCountText: {\n    color: Colors.primary,\n  },\n  content: {\n    flex: 1,\n  },\n  contentContainer: {\n    padding: Layout.padding,\n  },\n  noResultsState: {\n    alignItems: 'center',\n    padding: Layout.padding * 2,\n  },\n  noResultsTitle: {\n    fontSize: 20,\n    fontWeight: 'bold',\n    color: Colors.text,\n    marginTop: 16,\n    marginBottom: 8,\n  },\n  noResultsDescription: {\n    fontSize: 14,\n    color: Colors.subtext,\n    textAlign: 'center',\n  },\n  orderItem: {\n    backgroundColor: Colors.white,\n    borderRadius: 12,\n    padding: 16,\n    marginBottom: 16,\n    shadowColor: '#000',\n    shadowOffset: { width: 0, height: 2 },\n    shadowOpacity: 0.1,\n    shadowRadius: 4,\n    elevation: 3,\n  },\n  orderHeader: {\n    flexDirection: 'row',\n    justifyContent: 'space-between',\n    alignItems: 'flex-start',\n    marginBottom: 12,\n  },\n  orderInfo: {\n    flex: 1,\n  },\n  orderNumber: {\n    fontSize: 16,\n    fontWeight: 'bold',\n    color: Colors.text,\n    marginBottom: 2,\n  },\n  storeName: {\n    fontSize: 14,\n    color: Colors.primary,\n    fontWeight: '500',\n    marginBottom: 2,\n  },\n  orderDate: {\n    fontSize: 12,\n    color: Colors.subtext,\n  },\n  orderStatus: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    backgroundColor: Colors.card,\n    paddingHorizontal: 8,\n    paddingVertical: 4,\n    borderRadius: 6,\n  },\n  statusText: {\n    fontSize: 12,\n    fontWeight: '600',\n    marginLeft: 4,\n  },\n  orderItems: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    marginBottom: 12,\n  },\n  itemImages: {\n    flexDirection: 'row',\n    marginRight: 12,\n  },\n  itemImage: {\n    width: 32,\n    height: 32,\n    borderRadius: 16,\n    borderWidth: 2,\n    borderColor: Colors.white,\n  },\n  moreItems: {\n    backgroundColor: Colors.border,\n    justifyContent: 'center',\n    alignItems: 'center',\n  },\n  moreItemsText: {\n    fontSize: 10,\n    fontWeight: '600',\n    color: Colors.text,\n  },\n  itemDetails: {\n    flex: 1,\n  },\n  itemCount: {\n    fontSize: 14,\n    color: Colors.text,\n    marginBottom: 2,\n  },\n  orderTotal: {\n    fontSize: 18,\n    fontWeight: 'bold',\n    color: Colors.primary,\n  },\n  orderActions: {\n    flexDirection: 'row',\n    justifyContent: 'space-between',\n    alignItems: 'center',\n    marginBottom: 12,\n    paddingTop: 12,\n    borderTopWidth: 1,\n    borderTopColor: Colors.border,\n  },\n  ratingDisplay: {\n    flexDirection: 'row',\n    alignItems: 'center',\n  },\n  ratingText: {\n    fontSize: 14,\n    fontWeight: '500',\n    color: Colors.text,\n    marginLeft: 4,\n  },\n  actionButton: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    paddingHorizontal: 12,\n    paddingVertical: 6,\n    backgroundColor: Colors.lightPrimary,\n    borderRadius: 6,\n  },\n  actionButtonText: {\n    fontSize: 14,\n    fontWeight: '500',\n    color: Colors.primary,\n    marginLeft: 4,\n  },\n  orderFooter: {\n    flexDirection: 'row',\n    justifyContent: 'space-between',\n    alignItems: 'center',\n    paddingTop: 8,\n    borderTopWidth: 1,\n    borderTopColor: Colors.border,\n  },\n  viewDetailsText: {\n    fontSize: 12,\n    color: Colors.subtext,\n  },\n  bottomSpacing: {\n    height: 20,\n  },\n});