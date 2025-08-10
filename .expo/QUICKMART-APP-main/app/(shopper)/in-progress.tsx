import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  MapPin,
  Phone,
  MessageCircle,
  Camera,
  CheckCircle,
  Clock,
  Navigation,
  Package,
  ShoppingCart,
  AlertTriangle,
  Star,
  Calendar,
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';
import { ScrollableTab } from '@/components/ScrollableTab';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  found: boolean;
  substitution?: string;
  note?: string;
}

interface InProgressOrder {
  id: string;
  customerName: string;
  customerAddress: string;
  storeName: string;
  totalAmount: number;
  itemCount: number;
  foundItems: number;
  status: 'shopping' | 'checkout' | 'delivering';
  estimatedTime: string;
  items: ShoppingItem[];
}

interface CompletedOrder {
  id: string;
  customerName: string;
  storeName: string;
  totalAmount: number;
  tipAmount: number;
  completedAt: string;
  rating: number;
  itemCount: number;
}

const mockInProgressOrders: InProgressOrder[] = [
  {
    id: '1',
    customerName: 'Kwame A.',
    customerAddress: 'House 23, Labone Street, Accra',
    storeName: 'MaxMart Osu',
    totalAmount: 156.50,
    itemCount: 8,
    foundItems: 6,
    status: 'shopping',
    estimatedTime: '25 mins',
    items: [
      { id: '1', name: 'Bananas (6 pieces)', quantity: 1, found: true },
      { id: '2', name: 'Bread (Whole Wheat)', quantity: 2, found: true },
      { id: '3', name: 'Milk (1L)', quantity: 1, found: true },
      { id: '4', name: 'Chicken Breast (1kg)', quantity: 1, found: false },
      { id: '5', name: 'Rice (5kg bag)', quantity: 1, found: true },
      { id: '6', name: 'Tomatoes (2kg)', quantity: 1, found: false },
      { id: '7', name: 'Onions (1kg)', quantity: 1, found: true },
      { id: '8', name: 'Cooking Oil (1L)', quantity: 1, found: true },
    ],
  },
];

const mockCompletedOrders: CompletedOrder[] = [
  {
    id: '1',
    customerName: 'Ama K.',
    storeName: 'ShopRite East Legon',
    totalAmount: 89.25,
    tipAmount: 12.00,
    completedAt: '2 hours ago',
    rating: 5,
    itemCount: 12,
  },
  {
    id: '2',
    customerName: 'Kofi M.',
    storeName: 'MaxMart Osu',
    totalAmount: 234.80,
    tipAmount: 25.00,
    completedAt: '5 hours ago',
    rating: 4,
    itemCount: 18,
  },
  {
    id: '3',
    customerName: 'Akosua T.',
    storeName: 'Palace Mall',
    totalAmount: 67.40,
    tipAmount: 8.00,
    completedAt: 'Yesterday',
    rating: 5,
    itemCount: 6,
  },
];

export default function InProgressTab() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  const [activeTab, setActiveTab] = useState(0);
  const [inProgressOrders] = useState(mockInProgressOrders);
  const [completedOrders] = useState(mockCompletedOrders);

  const tabs = [
    { id: 0, title: 'In Progress', count: inProgressOrders.length },
    { id: 1, title: 'Completed', count: completedOrders.length },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shopping':
        return '#FF9800';
      case 'checkout':
        return '#2196F3';
      case 'delivering':
        return '#4CAF50';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'shopping':
        return 'Shopping';
      case 'checkout':
        return 'Checkout';
      case 'delivering':
        return 'Delivering';
      default:
        return 'Unknown';
    }
  };

  const handleOrderPress = (orderId: string) => {
    // Navigate to detailed order view
    router.push(`/order/${orderId}`);
  };

  const renderInProgressOrder = ({ item }: { item: InProgressOrder }) => {
    const progressPercentage = Math.round((item.foundItems / item.itemCount) * 100);
    
    return (
      <TouchableOpacity
        style={[styles.orderCard, { backgroundColor: Colors.white }]}
        onPress={() => handleOrderPress(item.id)}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={[styles.customerName, { color: Colors.text }]}>
              {item.customerName}
            </Text>
            <Text style={[styles.storeName, { color: Colors.subtext }]}>
              {item.storeName}
            </Text>
          </View>
          <View style={styles.orderMeta}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={[styles.statusText, { color: Colors.white }]}>
                {getStatusText(item.status)}
              </Text>
            </View>
            <Text style={[styles.orderAmount, { color: Colors.text }]}>
              GH₵{item.totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>
        
        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={[styles.progressLabel, { color: Colors.subtext }]}>
              Progress: {item.foundItems}/{item.itemCount} items
            </Text>
            <Text style={[styles.estimatedTime, { color: '#4464EB' }]}>
              {item.estimatedTime} left
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: Colors.border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: '#4464EB',
                  width: `${progressPercentage}%`,
                },
              ]}
            />
          </View>
        </View>
        
        <View style={styles.addressSection}>
          <MapPin size={14} color={Colors.subtext} />
          <Text style={[styles.addressText, { color: Colors.subtext }]}>
            {item.customerAddress}
          </Text>
        </View>
        
        <View style={styles.orderActions}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#4464EB' }]}>
            <MessageCircle size={16} color={Colors.white} />
            <Text style={[styles.actionButtonText, { color: Colors.white }]}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}>
            <Phone size={16} color={Colors.white} />
            <Text style={[styles.actionButtonText, { color: Colors.white }]}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.continueButton, { backgroundColor: '#FF9800' }]}>
            <Text style={[styles.continueButtonText, { color: Colors.white }]}>Continue</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCompletedOrder = ({ item }: { item: CompletedOrder }) => {
    return (
      <TouchableOpacity
        style={[styles.orderCard, { backgroundColor: Colors.white }]}
        onPress={() => handleOrderPress(item.id)}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={[styles.customerName, { color: Colors.text }]}>
              {item.customerName}
            </Text>
            <Text style={[styles.storeName, { color: Colors.subtext }]}>
              {item.storeName}
            </Text>
          </View>
          <View style={styles.orderMeta}>
            <View style={styles.ratingSection}>
              <Star size={14} color="#FFD700" fill="#FFD700" />
              <Text style={[styles.ratingText, { color: Colors.text }]}>
                {item.rating}.0
              </Text>
            </View>
            <Text style={[styles.orderAmount, { color: Colors.text }]}>
              GH₵{item.totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>
        
        <View style={styles.completedInfo}>
          <View style={styles.completedDetail}>
            <Package size={14} color={Colors.subtext} />
            <Text style={[styles.completedText, { color: Colors.subtext }]}>
              {item.itemCount} items
            </Text>
          </View>
          <View style={styles.completedDetail}>
            <Clock size={14} color={Colors.subtext} />
            <Text style={[styles.completedText, { color: Colors.subtext }]}>
              {item.completedAt}
            </Text>
          </View>
          {item.tipAmount > 0 && (
            <View style={styles.tipSection}>
              <Text style={[styles.tipText, { color: '#4CAF50' }]}>
                +GH₵{item.tipAmount.toFixed(2)} tip
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'In Progress Orders',
        }}
      />
      
      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        {/* Tab Navigation */}
        <ScrollableTab
          tabs={tabs}
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />
        
        {/* Content */}
        {activeTab === 0 ? (
          inProgressOrders.length > 0 ? (
            <FlatList
              data={inProgressOrders}
              renderItem={renderInProgressOrder}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <View style={styles.emptyState}>
              <Clock size={64} color={Colors.subtext} />
              <Text style={[styles.emptyTitle, { color: Colors.text }]}>
                No Active Orders
              </Text>
              <Text style={[styles.emptySubtitle, { color: Colors.subtext }]}>
                When you accept a batch, it will appear here
              </Text>
            </View>
          )
        ) : (
          completedOrders.length > 0 ? (
            <FlatList
              data={completedOrders}
              renderItem={renderCompletedOrder}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <View style={styles.emptyState}>
              <CheckCircle size={64} color={Colors.subtext} />
              <Text style={[styles.emptyTitle, { color: Colors.text }]}>
                No Completed Orders
              </Text>
              <Text style={[styles.emptySubtitle, { color: Colors.subtext }]}>
                Your completed orders will appear here
              </Text>
            </View>
          )
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  orderCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  storeName: {
    fontSize: 14,
    marginBottom: 4,
  },
  orderMeta: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressSection: {
    marginBottom: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
  },
  estimatedTime: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  addressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  addressText: {
    fontSize: 14,
    flex: 1,
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  continueButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  completedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  completedDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  completedText: {
    fontSize: 14,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tipSection: {
    marginLeft: 'auto',
  },
  tipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});