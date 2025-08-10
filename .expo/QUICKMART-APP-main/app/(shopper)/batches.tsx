import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  Clock,
  CheckCircle,
  MapPin,
  Package,
  DollarSign,
  ChevronRight,
  AlertCircle,
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

interface Order {
  id: string;
  storeName: string;
  customerName: string;
  address: string;
  items: number;
  payment: number;
  tip: number;
  status: 'in-progress' | 'completed';
  date: string;
  progress?: {
    current: number;
    total: number;
    stage: 'shopping' | 'checkout' | 'delivering';
  };
}

const mockOrders: Order[] = [
  {
    id: '1',
    storeName: 'MaxMart Osu',
    customerName: 'Kwame A.',
    address: 'Labone, Accra',
    items: 12,
    payment: 45,
    tip: 8,
    status: 'in-progress',
    date: 'Today',
    progress: {
      current: 8,
      total: 12,
      stage: 'shopping',
    },
  },
  {
    id: '2',
    storeName: 'ShopRite East Legon',
    customerName: 'Ama K.',
    address: 'East Legon, Accra',
    items: 24,
    payment: 65,
    tip: 12,
    status: 'completed',
    date: 'Yesterday',
  },
  {
    id: '3',
    storeName: 'Palace Hypermarket',
    customerName: 'John D.',
    address: 'Spintex, Accra',
    items: 8,
    payment: 35,
    tip: 5,
    status: 'completed',
    date: '2 days ago',
  },
];

export default function ShopperBatches() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  const [activeTab, setActiveTab] = useState<'in-progress' | 'completed'>('in-progress');

  const inProgressOrders = mockOrders.filter(order => order.status === 'in-progress');
  const completedOrders = mockOrders.filter(order => order.status === 'completed');

  const getStageText = (stage: string) => {
    switch (stage) {
      case 'shopping':
        return 'Shopping';
      case 'checkout':
        return 'At Checkout';
      case 'delivering':
        return 'Delivering';
      default:
        return 'In Progress';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'shopping':
        return '#FF9800';
      case 'checkout':
        return '#2196F3';
      case 'delivering':
        return '#4CAF50';
      default:
        return Colors.gray;
    }
  };

  const renderInProgressOrder = (order: Order) => (
    <TouchableOpacity
      key={order.id}
      style={[styles.orderCard, { backgroundColor: Colors.white, borderLeftColor: '#4464EB' }]}
      onPress={() => router.push('/in-progress')}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={[styles.storeName, { color: Colors.text }]}>{order.storeName}</Text>
          <Text style={[styles.customerName, { color: Colors.subtext }]}>
            For {order.customerName}
          </Text>
          <View style={styles.addressRow}>
            <MapPin size={14} color={Colors.subtext} />
            <Text style={[styles.addressText, { color: Colors.subtext }]}>{order.address}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStageColor(order.progress?.stage || '') + '20' }]}>
          <Text style={[styles.statusText, { color: getStageColor(order.progress?.stage || '') }]}>
            {getStageText(order.progress?.stage || '')}
          </Text>
        </View>
      </View>

      {order.progress && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressText, { color: Colors.text }]}>
              {order.progress.current} of {order.progress.total} items found
            </Text>
            <Text style={[styles.progressPercentage, { color: '#4464EB' }]}>
              {Math.round((order.progress.current / order.progress.total) * 100)}%
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: Colors.border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: '#4464EB',
                  width: `${(order.progress.current / order.progress.total) * 100}%`,
                },
              ]}
            />
          </View>
        </View>
      )}

      <View style={styles.orderFooter}>
        <View style={styles.orderStats}>
          <View style={styles.stat}>
            <Package size={16} color={Colors.subtext} />
            <Text style={[styles.statText, { color: Colors.subtext }]}>{order.items} items</Text>
          </View>
          <View style={styles.stat}>
            <DollarSign size={16} color="#4CAF50" />
            <Text style={[styles.paymentText, { color: '#4CAF50' }]}>
              GH₵{order.payment + order.tip}
            </Text>
          </View>
        </View>
        <ChevronRight size={20} color={Colors.subtext} />
      </View>
    </TouchableOpacity>
  );

  const renderCompletedOrder = (order: Order) => (
    <TouchableOpacity
      key={order.id}
      style={[styles.orderCard, { backgroundColor: Colors.white }]}
      onPress={() => {/* Navigate to order details */}}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={[styles.storeName, { color: Colors.text }]}>{order.storeName}</Text>
          <Text style={[styles.customerName, { color: Colors.subtext }]}>
            For {order.customerName}
          </Text>
          <View style={styles.addressRow}>
            <MapPin size={14} color={Colors.subtext} />
            <Text style={[styles.addressText, { color: Colors.subtext }]}>{order.address}</Text>
          </View>
        </View>
        <View style={styles.completedBadge}>
          <CheckCircle size={20} color="#4CAF50" />
        </View>
      </View>

      <View style={styles.orderFooter}>
        <View style={styles.orderStats}>
          <View style={styles.stat}>
            <Package size={16} color={Colors.subtext} />
            <Text style={[styles.statText, { color: Colors.subtext }]}>{order.items} items</Text>
          </View>
          <View style={styles.stat}>
            <DollarSign size={16} color="#4CAF50" />
            <Text style={[styles.paymentText, { color: '#4CAF50' }]}>
              GH₵{order.payment + order.tip}
            </Text>
          </View>
          <Text style={[styles.dateText, { color: Colors.subtext }]}>{order.date}</Text>
        </View>
        <ChevronRight size={20} color={Colors.subtext} />
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'My Batches',
        }}
      />
      
      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        {/* Tab Navigation */}
        <View style={[styles.tabContainer, { backgroundColor: Colors.white }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'in-progress' && { backgroundColor: '#4464EB' },
            ]}
            onPress={() => setActiveTab('in-progress')}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'in-progress' ? Colors.white : Colors.subtext },
              ]}
            >
              In Progress ({inProgressOrders.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'completed' && { backgroundColor: '#4464EB' },
            ]}
            onPress={() => setActiveTab('completed')}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'completed' ? Colors.white : Colors.subtext },
              ]}
            >
              Completed ({completedOrders.length})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {activeTab === 'in-progress' ? (
            <>
              {inProgressOrders.length > 0 ? (
                inProgressOrders.map(renderInProgressOrder)
              ) : (
                <View style={styles.emptyState}>
                  <Clock size={48} color={Colors.subtext} />
                  <Text style={[styles.emptyTitle, { color: Colors.text }]}>
                    No active batches
                  </Text>
                  <Text style={[styles.emptySubtitle, { color: Colors.subtext }]}>
                    Go online to start receiving batch notifications
                  </Text>
                  <TouchableOpacity
                    style={[styles.goOnlineButton, { backgroundColor: '#4464EB' }]}
                    onPress={() => router.push('/')}
                  >
                    <Text style={[styles.goOnlineText, { color: Colors.white }]}>
                      Go to Home
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : (
            <>
              {completedOrders.length > 0 ? (
                completedOrders.map(renderCompletedOrder)
              ) : (
                <View style={styles.emptyState}>
                  <CheckCircle size={48} color={Colors.subtext} />
                  <Text style={[styles.emptyTitle, { color: Colors.text }]}>
                    No completed batches
                  </Text>
                  <Text style={[styles.emptySubtitle, { color: Colors.subtext }]}>
                    Your completed orders will appear here
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 4,
    margin: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  orderCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
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
  storeName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addressText: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  completedBadge: {
    padding: 4,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '700',
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
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  goOnlineButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  goOnlineText: {
    fontSize: 16,
    fontWeight: '600',
  },
});