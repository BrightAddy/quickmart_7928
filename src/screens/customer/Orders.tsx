import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, Image, TextInput, ScrollView } from 'react-native';
import { Screen, FloatingChatbotButton, ChatbotModal, GhanaianLoader } from '../../components/UI';
import { useTheme } from '../../theme/theme';
import { useOrders } from '../../context/OrderContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return '#f59e0b';
    case 'confirmed': return '#3b82f6';
    case 'preparing': return '#8b5cf6';
    case 'on_the_way': return '#10b981';
    case 'delivered': return '#059669';
    case 'cancelled': return '#ef4444';
    default: return '#6b7280';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return 'Pending';
    case 'confirmed': return 'Confirmed';
    case 'preparing': return 'Preparing';
    case 'on_the_way': return 'On the way';
    case 'delivered': return 'Delivered';
    case 'cancelled': return 'Cancelled';
    default: return 'Unknown';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return '⏳';
    case 'confirmed': return '✅';
    case 'preparing': return '👨‍🍳';
    case 'on_the_way': return '🚚';
    case 'delivered': return '📦';
    case 'cancelled': return '❌';
    default: return '❓';
  }
};

export default function Orders({ navigation }: any) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { orders, updateOrderStatus } = useOrders();
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const trackOrder = (orderId: string) => {
    navigation.navigate('OrderTracking', { id: orderId });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getItemCount = (items: any[]) => {
    return items.reduce((total, item) => total + item.qty, 0);
  };

  const simulateOrderProgress = (orderId: string) => {
    const statuses: any[] = ['pending', 'confirmed', 'preparing', 'on_the_way', 'delivered'];
    const currentOrder = orders.find(order => order.id === orderId);
    
    if (currentOrder) {
      const currentIndex = statuses.indexOf(currentOrder.status);
      if (currentIndex < statuses.length - 1) {
        setTimeout(() => {
          updateOrderStatus(orderId, statuses[currentIndex + 1]);
        }, 5000); // Update every 5 seconds for demo
      }
    }
  };

  useEffect(() => {
    // Simulate order progress for pending orders
    orders.forEach(order => {
      if (order.status !== 'delivered' && order.status !== 'cancelled') {
        simulateOrderProgress(order.id);
      }
    });
  }, [orders]);

  // Filter and search orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const filterOptions = [
    { key: 'all', label: 'All Orders', icon: '📦' },
    { key: 'pending', label: 'Pending', icon: '⏳' },
    { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
    { key: 'on_the_way', label: 'On the Way', icon: '🚚' },
    { key: 'delivered', label: 'Delivered', icon: '✅' },
    { key: 'cancelled', label: 'Cancelled', icon: '❌' },
  ];

  const getOrderStats = () => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const preparing = orders.filter(o => o.status === 'preparing').length;
    const onTheWay = orders.filter(o => o.status === 'on_the_way').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    
    return { total, pending, preparing, onTheWay, delivered };
  };

  const renderOrderItem = ({ item }: { item: any }) => {
    const statusColor = getStatusColor(item.status);
    const statusText = getStatusText(item.status);
    const statusIcon = getStatusIcon(item.status);
    const itemCount = getItemCount(item.items);

    return (
      <View style={[styles.card, { backgroundColor: '#fff', borderColor: colors.primary + '22' }]}>
        {/* Order Header */}
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={[styles.orderId, { color: colors.primary }]}>{item.id}</Text>
            <Text style={[styles.orderDate, { color: colors.onSurface + '88' }]}>
              {formatDate(item.createdAt)}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
            <Text style={styles.statusIcon}>{statusIcon}</Text>
            <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
          </View>
        </View>

        {/* Store and Items */}
        <View style={styles.storeSection}>
          <Text style={[styles.storeName, { color: colors.onBackground }]}>{item.store}</Text>
          <Text style={[styles.itemCount, { color: colors.onSurface + '88' }]}>
            {itemCount} items • GHS {item.total.toFixed(2)}
          </Text>
        </View>

        {/* Order Items Preview */}
        <View style={styles.itemsPreview}>
          {item.items.slice(0, 2).map((orderItem: any, index: number) => (
            <View key={index} style={styles.itemPreview}>
              <Image 
                source={{ uri: orderItem.imageUrl }} 
                style={styles.itemImage}
                defaultSource={require('../../../assets/images/no-image.jpg')}
              />
              <View style={styles.itemDetails}>
                <Text style={[styles.itemName, { color: colors.onBackground }]} numberOfLines={1}>
                  {orderItem.name}
                </Text>
                <Text style={[styles.itemMeta, { color: colors.onSurface + '88' }]}>
                  {orderItem.qty} x GHS {orderItem.price.toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
          {item.items.length > 2 && (
            <Text style={[styles.moreItems, { color: colors.primary }]}>
              +{item.items.length - 2} more items
            </Text>
          )}
        </View>

        {/* Delivery Info */}
        <View style={styles.deliveryInfo}>
          <Text style={[styles.deliveryLabel, { color: colors.onSurface + '88' }]}>Delivery to:</Text>
          <Text style={[styles.deliveryAddress, { color: colors.onBackground }]} numberOfLines={1}>
            {item.address}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.primaryBtn, { backgroundColor: colors.primary }]} 
            onPress={() => trackOrder(item.id)}
          >
            <Text style={[styles.primaryBtnText, { color: colors.onPrimary }]}>
              {item.status === 'delivered' ? 'View Details' : 'Track Order'}
            </Text>
          </TouchableOpacity>
          
          {item.status === 'delivered' && (
            <TouchableOpacity 
              style={[styles.secondaryBtn, { borderColor: colors.primary }]} 
              onPress={() => {}}
            >
              <Text style={[styles.secondaryBtnText, { color: colors.primary }]}>Reorder</Text>
            </TouchableOpacity>
          )}
          
          {item.status === 'delivered' && (
            <TouchableOpacity 
              style={[styles.secondaryBtn, { borderColor: colors.primary }]} 
              onPress={() => {}}
            >
              <Text style={[styles.secondaryBtnText, { color: colors.primary }]}>Rate</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const orderStats = getOrderStats();

  return (
    <Screen style={{ flex: 1 }}>
      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
        <Text style={[styles.header, { color: colors.onBackground }]}>My Orders</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Search and Filters */}
      {showFilters && (
        <View style={[styles.filterContainer, { backgroundColor: colors.surface }]}>
          <TextInput
            style={[styles.searchInput, { 
              borderColor: colors.primary + '44', 
              color: colors.onBackground,
              backgroundColor: colors.background
            }]}
            placeholder="Search orders, stores, or items..."
            placeholderTextColor={colors.onSurface + '66'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {filterOptions.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterChip,
                  { 
                    backgroundColor: selectedFilter === filter.key ? colors.primary : colors.background,
                    borderColor: colors.primary + '44'
                  }
                ]}
                onPress={() => setSelectedFilter(filter.key)}
              >
                <Text style={[
                  styles.filterChipText,
                  { color: selectedFilter === filter.key ? colors.onPrimary : colors.onBackground }
                ]}>
                  {filter.icon} {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Order Stats */}
      <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{orderStats.total}</Text>
          <Text style={[styles.statLabel, { color: colors.onSurface + '88' }]}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#f59e0b' }]}>{orderStats.pending}</Text>
          <Text style={[styles.statLabel, { color: colors.onSurface + '88' }]}>Pending</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#8b5cf6' }]}>{orderStats.preparing}</Text>
          <Text style={[styles.statLabel, { color: colors.onSurface + '88' }]}>Preparing</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#10b981' }]}>{orderStats.onTheWay}</Text>
          <Text style={[styles.statLabel, { color: colors.onSurface + '88' }]}>On Way</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#059669' }]}>{orderStats.delivered}</Text>
          <Text style={[styles.statLabel, { color: colors.onSurface + '88' }]}>Delivered</Text>
        </View>
      </View>
      
      {loading ? (
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <GhanaianLoader size={48} />
          <Text style={{ marginTop: 8, color: colors.onSurface + '88' }}>Fetching live status...</Text>
        </View>
      ) : filteredOrders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>🔍</Text>
          <Text style={[styles.emptyTitle, { color: colors.onBackground }]}>
            {orders.length === 0 ? 'No Orders Yet' : 'No Orders Found'}
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.onSurface + '88' }]}>
            {orders.length === 0 
              ? 'Start shopping to see your orders here'
              : 'Try adjusting your search or filters'
            }
          </Text>
          {orders.length === 0 && (
            <TouchableOpacity 
              style={[styles.shopNowBtn, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('CustomerTabs', { screen: 'Home' })}
            >
              <Text style={[styles.shopNowText, { color: colors.onPrimary }]}>Start Shopping</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: insets.bottom + 100 }}
          renderItem={renderOrderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      <FloatingChatbotButton onPress={() => setChatbotVisible(true)} />
      <ChatbotModal visible={chatbotVisible} onClose={() => setChatbotVisible(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  header: { 
    fontSize: 24, 
    fontWeight: '800',
    flex: 1
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonText: {
    fontSize: 18,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  filterScroll: {
    paddingHorizontal: 4,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  card: { 
    borderRadius: 16, 
    padding: 16, 
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  orderInfo: {
    flex: 1
  },
  orderId: { 
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 2
  },
  orderDate: {
    fontSize: 12
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4
  },
  statusIcon: {
    fontSize: 12
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600'
  },
  storeSection: {
    marginBottom: 12
  },
  storeName: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2
  },
  itemCount: {
    fontSize: 12
  },
  itemsPreview: {
    marginBottom: 12
  },
  itemPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  itemImage: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 8
  },
  itemDetails: {
    flex: 1
  },
  itemName: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2
  },
  itemMeta: {
    fontSize: 11
  },
  moreItems: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4
  },
  deliveryInfo: {
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6'
  },
  deliveryLabel: {
    fontSize: 11,
    marginBottom: 2
  },
  deliveryAddress: {
    fontSize: 12,
    fontWeight: '500'
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8
  },
  primaryBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '700'
  },
  secondaryBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: 'white'
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600'
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center'
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22
  },
  shopNowBtn: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  shopNowText: {
    fontSize: 16,
    fontWeight: '700'
  }
});


