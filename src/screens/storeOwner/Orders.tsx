import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { useTheme } from '@/theme/theme';

const ORANGE = '#FF7A00';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Orders() {
  const { colors } = useTheme();
  const [selectedTab, setSelectedTab] = useState('All');

  const orderStats = {
    total: 6,
    pending: 2,
    inProgress: 1,
    ready: 1,
    done: 1,
    cancelled: 1,
    revenue: 67.80
  };

  const handleTabPress = (tab: string) => {
    setSelectedTab(tab);
    Alert.alert('Filter Applied', `Showing ${tab} orders`);
  };

  const handleOrderPress = (orderId: string) => {
    Alert.alert('Order Details', `Opening order ${orderId}`);
  };

  const handleSearch = () => {
    Alert.alert('Search', 'Opening order search...');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.onBackground }]}>Orders</Text>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearch}
          activeOpacity={0.7}
        >
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Order Statistics */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}>
            <Text style={styles.statIcon}>🛒</Text>
            <Text style={[styles.statValue, { color: colors.onBackground }]}>{orderStats.total}</Text>
            <Text style={[styles.statLabel, { color: colors.onSurface + '88' }]}>Total Orders</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}>
            <Text style={styles.statIcon}>⏰</Text>
            <Text style={[styles.statValue, { color: colors.onBackground }]}>{orderStats.pending}</Text>
            <Text style={[styles.statLabel, { color: colors.onSurface + '88' }]}>Pending</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}>
            <Text style={styles.statIcon}>$</Text>
            <Text style={[styles.statValue, { color: colors.onBackground }]}>GHC {orderStats.revenue}</Text>
            <Text style={[styles.statLabel, { color: colors.onSurface + '88' }]}>Today's Revenue</Text>
          </View>
        </View>

        {/* Status Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={styles.scrollArrow}
            onPress={() => Alert.alert('Scroll Left', 'Scrolling tabs left')}
            activeOpacity={0.7}
          >
            <Text style={styles.arrowIcon}>◀</Text>
          </TouchableOpacity>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScrollContent}
          >
            <TouchableOpacity 
              style={[
                styles.tab, 
                selectedTab === 'All' && styles.activeTab,
                { backgroundColor: selectedTab === 'All' ? ORANGE : colors.surface }
              ]}
              onPress={() => handleTabPress('All')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.tabText, 
                { color: selectedTab === 'All' ? '#fff' : colors.onBackground }
              ]}>All</Text>
              <View style={[
                styles.tabBadge, 
                { backgroundColor: selectedTab === 'All' ? '#fff' : ORANGE }
              ]}>
                <Text style={[
                  styles.badgeText, 
                  { color: selectedTab === 'All' ? ORANGE : '#fff' }
                ]}>{orderStats.total}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.tab, 
                selectedTab === 'Pending' && styles.activeTab,
                { backgroundColor: selectedTab === 'Pending' ? ORANGE : colors.surface }
              ]}
              onPress={() => handleTabPress('Pending')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.tabText, 
                { color: selectedTab === 'Pending' ? '#fff' : colors.onBackground }
              ]}>Pending</Text>
              <View style={[
                styles.tabBadge, 
                { backgroundColor: selectedTab === 'Pending' ? '#fff' : ORANGE }
              ]}>
                <Text style={[
                  styles.badgeText, 
                  { color: selectedTab === 'Pending' ? ORANGE : '#fff' }
                ]}>{orderStats.pending}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.tab, 
                selectedTab === 'Progress' && styles.activeTab,
                { backgroundColor: selectedTab === 'Progress' ? ORANGE : colors.surface }
              ]}
              onPress={() => handleTabPress('Progress')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.tabText, 
                { color: selectedTab === 'Progress' ? '#fff' : colors.onBackground }
              ]}>Progress</Text>
              <View style={[
                styles.tabBadge, 
                { backgroundColor: selectedTab === 'Progress' ? '#fff' : ORANGE }
              ]}>
                <Text style={[
                  styles.badgeText, 
                  { color: selectedTab === 'Progress' ? ORANGE : '#fff' }
                ]}>{orderStats.inProgress}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.tab, 
                selectedTab === 'Ready' && styles.activeTab,
                { backgroundColor: selectedTab === 'Ready' ? ORANGE : colors.surface }
              ]}
              onPress={() => handleTabPress('Ready')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.tabText, 
                { color: selectedTab === 'Ready' ? '#fff' : colors.onBackground }
              ]}>Ready</Text>
              <View style={[
                styles.tabBadge, 
                { backgroundColor: selectedTab === 'Ready' ? '#fff' : ORANGE }
              ]}>
                <Text style={[
                  styles.badgeText, 
                  { color: selectedTab === 'Ready' ? ORANGE : '#fff' }
                ]}>{orderStats.ready}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.tab, 
                selectedTab === 'Done' && styles.activeTab,
                { backgroundColor: selectedTab === 'Done' ? ORANGE : colors.surface }
              ]}
              onPress={() => handleTabPress('Done')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.tabText, 
                { color: selectedTab === 'Done' ? '#fff' : colors.onBackground }
              ]}>Done</Text>
              <View style={[
                styles.tabBadge, 
                { backgroundColor: selectedTab === 'Done' ? '#fff' : ORANGE }
              ]}>
                <Text style={[
                  styles.badgeText, 
                  { color: selectedTab === 'Done' ? ORANGE : '#fff' }
                ]}>{orderStats.done}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.tab, 
                selectedTab === 'Cancelled' && styles.activeTab,
                { backgroundColor: selectedTab === 'Cancelled' ? ORANGE : colors.surface }
              ]}
              onPress={() => handleTabPress('Cancelled')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.tabText, 
                { color: selectedTab === 'Cancelled' ? '#fff' : colors.onBackground }
              ]}>Cancelled</Text>
              <View style={[
                styles.tabBadge, 
                { backgroundColor: selectedTab === 'Cancelled' ? '#fff' : ORANGE }
              ]}>
                <Text style={[
                  styles.badgeText, 
                  { color: selectedTab === 'Cancelled' ? ORANGE : '#fff' }
                ]}>{orderStats.cancelled}</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity 
            style={styles.scrollArrow}
            onPress={() => Alert.alert('Scroll Right', 'Scrolling tabs right')}
            activeOpacity={0.7}
          >
            <Text style={styles.arrowIcon}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Scroll Indicator */}
        <View style={styles.scrollIndicator} />

        {/* Order Cards */}
        <View style={styles.ordersContainer}>
          {/* Order #ORD-001 - Pending */}
          <TouchableOpacity 
            style={[styles.orderCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}
            onPress={() => handleOrderPress('#ORD-001')}
            activeOpacity={0.7}
          >
            <View style={styles.orderHeader}>
              <View style={styles.orderIdSection}>
                <Text style={[styles.orderId, { color: colors.onBackground }]}>#ORD-001</Text>
                <Text style={[styles.orderDate, { color: colors.onSurface + '88' }]}>12/01/2025 • 14:30</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: ORANGE }]}>
                <Text style={styles.statusText}>Pending</Text>
              </View>
            </View>

            <View style={styles.customerInfo}>
              <View style={styles.customerRow}>
                <Text style={styles.customerIcon}>👤</Text>
                <Text style={[styles.customerName, { color: colors.onBackground }]}>Kwame Asante</Text>
              </View>
              <Text style={[styles.customerAddress, { color: colors.onSurface + '88' }]}>
                123 Osu Street, Accra, Greater Accra Region
              </Text>
            </View>

            <View style={styles.orderDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>📦</Text>
                <Text style={[styles.detailText, { color: colors.onBackground }]}>3 items</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>🚚</Text>
                <Text style={[styles.detailText, { color: colors.onBackground }]}>Home Delivery</Text>
              </View>
            </View>

            <View style={styles.orderTotal}>
              <Text style={[styles.totalAmount, { color: colors.onBackground }]}>GHC 85.50</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.callButton]}
                onPress={() => Alert.alert('Call Customer', 'Calling Kwame Asante...')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonIcon}>📞</Text>
                <Text style={styles.actionButtonText}>Call</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.viewButton]}
                onPress={() => Alert.alert('View Order', 'Opening order #ORD-001 details...')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonIcon}>👁️</Text>
                <Text style={styles.actionButtonText}>View</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.acceptButton]}
                onPress={() => Alert.alert('Accept Order', 'Order #ORD-001 accepted!')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonIcon}>✔️</Text>
                <Text style={styles.actionButtonText}>Accept</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.declineButton]}
                onPress={() => Alert.alert('Decline Order', 'Order #ORD-001 declined!')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonIcon}>❌</Text>
                <Text style={styles.actionButtonText}>Decline</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          {/* Order #ORD-003 - Ready */}
          <TouchableOpacity 
            style={[styles.orderCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}
            onPress={() => handleOrderPress('#ORD-003')}
            activeOpacity={0.7}
          >
            <View style={styles.orderHeader}>
              <View style={styles.orderIdSection}>
                <Text style={[styles.orderId, { color: colors.onBackground }]}>#ORD-003</Text>
                <Text style={[styles.orderDate, { color: colors.onSurface + '88' }]}>12/01/2025 • 12:15</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: '#4CAF50' }]}>
                <Text style={styles.statusText}>Ready</Text>
              </View>
            </View>

            <View style={styles.customerInfo}>
              <View style={styles.customerRow}>
                <Text style={styles.customerIcon}>👤</Text>
                <Text style={[styles.customerName, { color: colors.onBackground }]}>Kofi Mensah</Text>
              </View>
              <Text style={[styles.customerAddress, { color: colors.onSurface + '88' }]}>
                789 Kumasi Central Market, Kumasi, Ashanti Region
              </Text>
            </View>

            <View style={styles.orderDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>📦</Text>
                <Text style={[styles.detailText, { color: colors.onBackground }]}>4 items</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>🚚</Text>
                <Text style={[styles.detailText, { color: colors.onBackground }]}>Home Delivery</Text>
              </View>
            </View>

            <View style={styles.orderTotal}>
              <Text style={[styles.totalAmount, { color: colors.onBackground }]}>GHC 95.25</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.callButton]}
                onPress={() => Alert.alert('Call Customer', 'Calling Kofi Mensah...')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonIcon}>📞</Text>
                <Text style={styles.actionButtonText}>Call</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.viewButton]}
                onPress={() => Alert.alert('View Order', 'Opening order #ORD-003 details...')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonIcon}>👁️</Text>
                <Text style={styles.actionButtonText}>View</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.completeButton]}
                onPress={() => Alert.alert('Complete Order', 'Order #ORD-003 completed!')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonIcon}>✅</Text>
                <Text style={styles.actionButtonText}>Complete</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.trackButton]}
                onPress={() => Alert.alert('Track Delivery', 'Opening delivery tracking...')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonIcon}>📍</Text>
                <Text style={styles.actionButtonText}>Track</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          {/* Order #ORD-002 - In Progress */}
          <TouchableOpacity 
            style={[styles.orderCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}
            onPress={() => handleOrderPress('#ORD-002')}
            activeOpacity={0.7}
          >
            <View style={styles.orderHeader}>
              <View style={styles.orderIdSection}>
                <Text style={[styles.orderId, { color: colors.onBackground }]}>#ORD-002</Text>
                <Text style={[styles.orderDate, { color: colors.onSurface + '88' }]}>12/01/2025 • 13:45</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: '#2196F3' }]}>
                <Text style={styles.statusText}>In Progress</Text>
              </View>
            </View>

            <View style={styles.customerInfo}>
              <View style={styles.customerRow}>
                <Text style={styles.customerIcon}>👤</Text>
                <Text style={[styles.customerName, { color: colors.onBackground }]}>Ama Osei</Text>
              </View>
              <Text style={[styles.customerAddress, { color: colors.onSurface + '88' }]}>
                456 Tema Industrial Area, Tema, Greater Accra
              </Text>
            </View>

            <View style={styles.orderDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>📦</Text>
                <Text style={[styles.detailText, { color: colors.onBackground }]}>2 items</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>🚚</Text>
                <Text style={[styles.detailText, { color: colors.onBackground }]}>Pickup</Text>
              </View>
            </View>

            <View style={styles.orderTotal}>
              <Text style={[styles.totalAmount, { color: colors.onBackground }]}>GHC 45.75</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.callButton]}
                onPress={() => Alert.alert('Call Customer', 'Calling Ama Osei...')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonIcon}>📞</Text>
                <Text style={styles.actionButtonText}>Call</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.viewButton]}
                onPress={() => Alert.alert('View Order', 'Opening order #ORD-002 details...')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonIcon}>👁️</Text>
                <Text style={styles.actionButtonText}>View</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.readyButton]}
                onPress={() => Alert.alert('Mark Ready', 'Order #ORD-002 marked as ready!')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonIcon}>⏰</Text>
                <Text style={styles.actionButtonText}>Ready</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.assignButton]}
                onPress={() => Alert.alert('Assign Staff', 'Opening staff assignment...')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonIcon}>👥</Text>
                <Text style={styles.actionButtonText}>Assign</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          {/* Order #ORD-005 - Cancelled */}
          <TouchableOpacity 
            style={[styles.orderCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}
            onPress={() => handleOrderPress('#ORD-005')}
            activeOpacity={0.7}
          >
            <View style={styles.orderHeader}>
              <View style={styles.orderIdSection}>
                <Text style={[styles.orderId, { color: colors.onBackground }]}>#ORD-005</Text>
                <Text style={[styles.orderDate, { color: colors.onSurface + '88' }]}>12/01/2025 • 10:45</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: '#FF4444' }]}>
                <Text style={styles.statusText}>Cancelled</Text>
              </View>
            </View>

            <View style={styles.customerInfo}>
              <View style={styles.customerRow}>
                <Text style={styles.customerIcon}>👤</Text>
                <Text style={[styles.customerName, { color: colors.onBackground }]}>Yaw Adjei</Text>
              </View>
              <Text style={[styles.customerAddress, { color: colors.onSurface + '88' }]}>
                654 Ho Market Square, Ho, Volta Region
              </Text>
            </View>

            <View style={styles.orderDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>📦</Text>
                <Text style={[styles.detailText, { color: colors.onBackground }]}>1 items</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>🚚</Text>
                <Text style={[styles.detailText, { color: colors.onBackground }]}>Home Delivery</Text>
              </View>
            </View>

            <View style={styles.orderTotal}>
              <Text style={[styles.totalAmount, { color: colors.onBackground }]}>GHC 45.60</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.callButton]}
                onPress={() => Alert.alert('Call Customer', 'Calling Yaw Adjei...')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonIcon}>📞</Text>
                <Text style={styles.actionButtonText}>Call</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.viewButton]}
                onPress={() => Alert.alert('View Order', 'Opening order #ORD-005 details...')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonIcon}>👁️</Text>
                <Text style={styles.actionButtonText}>View</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.restoreButton]}
                onPress={() => Alert.alert('Restore Order', 'Order #ORD-005 restored!')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonIcon}>🔄</Text>
                <Text style={styles.actionButtonText}>Restore</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => Alert.alert('Delete Order', 'Order #ORD-005 deleted permanently!')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonIcon}>🗑️</Text>
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          {/* Order #ORD-006 - Pending */}
          <TouchableOpacity 
            style={[styles.orderCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}
            onPress={() => handleOrderPress('#ORD-006')}
            activeOpacity={0.7}
          >
            <View style={styles.orderHeader}>
              <View style={styles.orderIdSection}>
                <Text style={[styles.orderId, { color: colors.onBackground }]}>#ORD-006</Text>
                <Text style={[styles.orderDate, { color: colors.onSurface + '88' }]}>12/01/2025 • 09:20</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: ORANGE }]}>
                <Text style={styles.statusText}>Pending</Text>
              </View>
            </View>

            <View style={styles.customerInfo}>
              <View style={styles.customerRow}>
                <Text style={styles.customerIcon}>👤</Text>
                <Text style={[styles.customerName, { color: colors.onBackground }]}>Efua Darko</Text>
              </View>
              <Text style={[styles.customerAddress, { color: colors.onSurface + '88' }]}>
                987 Takoradi Market Circle, Takoradi, Western Region
              </Text>
            </View>

            <View style={styles.orderDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>📦</Text>
                <Text style={[styles.detailText, { color: colors.onBackground }]}>6 items</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>🚚</Text>
                <Text style={[styles.detailText, { color: colors.onBackground }]}>Home Delivery</Text>
              </View>
            </View>

            <View style={styles.orderTotal}>
              <Text style={[styles.totalAmount, { color: colors.onBackground }]}>GHC 110.40</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.callButton]}
                onPress={() => Alert.alert('Call Customer', 'Calling Efua Darko...')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonIcon}>📞</Text>
                <Text style={styles.actionButtonText}>Call</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.viewButton]}
                onPress={() => Alert.alert('View Order', 'Opening order #ORD-006 details...')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonIcon}>👁️</Text>
                <Text style={styles.actionButtonText}>View</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.acceptButton]}
                onPress={() => Alert.alert('Accept Order', 'Order #ORD-006 accepted!')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonIcon}>✔️</Text>
                <Text style={styles.actionButtonText}>Accept</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.declineButton]}
                onPress={() => Alert.alert('Decline Order', 'Order #ORD-006 declined!')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonIcon}>❌</Text>
                <Text style={styles.actionButtonText}>Decline</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Math.max(16, screenWidth * 0.04),
    gap: Math.max(20, screenWidth * 0.05),
    paddingBottom: Math.max(32, screenHeight * 0.04),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    paddingTop: Math.max(50, screenHeight * 0.06),
    paddingBottom: Math.max(16, screenHeight * 0.02),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: Math.max(24, screenWidth * 0.06),
    fontWeight: 'bold',
  },
  searchButton: {
    padding: Math.max(8, screenWidth * 0.02),
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    fontSize: Math.max(20, screenWidth * 0.05),
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Math.max(12, screenWidth * 0.03),
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Math.max(16, screenWidth * 0.04),
    borderRadius: Math.max(12, screenWidth * 0.03),
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: Math.max(24, screenWidth * 0.06),
    marginBottom: Math.max(8, screenHeight * 0.01),
  },
  statValue: {
    fontSize: Math.max(20, screenWidth * 0.05),
    fontWeight: 'bold',
    marginBottom: Math.max(4, screenHeight * 0.005),
  },
  statLabel: {
    fontSize: Math.max(12, screenWidth * 0.03),
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Math.max(8, screenWidth * 0.02),
  },
  scrollArrow: {
    padding: Math.max(8, screenWidth * 0.02),
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    fontSize: Math.max(18, screenWidth * 0.045),
    color: '#666',
  },
  tabsScrollContent: {
    gap: Math.max(8, screenWidth * 0.02),
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Math.max(6, screenWidth * 0.015),
    paddingVertical: Math.max(8, screenHeight * 0.01),
    paddingHorizontal: Math.max(12, screenWidth * 0.03),
    borderRadius: Math.max(20, screenWidth * 0.05),
    minWidth: Math.max(80, screenWidth * 0.2),
    justifyContent: 'center',
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    fontSize: Math.max(14, screenWidth * 0.035),
    fontWeight: '500',
  },
  tabBadge: {
    width: Math.max(20, screenWidth * 0.05),
    height: Math.max(20, screenWidth * 0.05),
    borderRadius: Math.max(10, screenWidth * 0.025),
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: Math.max(12, screenWidth * 0.03),
    fontWeight: 'bold',
  },
  scrollIndicator: {
    height: 2,
    backgroundColor: '#e0e0e0',
    borderRadius: 1,
    marginTop: Math.max(8, screenHeight * 0.01),
  },
  ordersContainer: {
    gap: Math.max(16, screenWidth * 0.04),
  },
  orderCard: {
    borderRadius: Math.max(16, screenWidth * 0.04),
    padding: Math.max(20, screenWidth * 0.05),
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Math.max(16, screenHeight * 0.02),
  },
  orderIdSection: {
    flex: 1,
  },
  orderId: {
    fontSize: Math.max(18, screenWidth * 0.045),
    fontWeight: 'bold',
    marginBottom: Math.max(4, screenHeight * 0.005),
  },
  orderDate: {
    fontSize: Math.max(13, screenWidth * 0.033),
  },
  statusBadge: {
    paddingVertical: Math.max(6, screenHeight * 0.008),
    paddingHorizontal: Math.max(12, screenWidth * 0.03),
    borderRadius: Math.max(20, screenWidth * 0.05),
  },
  statusText: {
    fontSize: Math.max(12, screenWidth * 0.03),
    fontWeight: '600',
    color: '#fff',
  },
  customerInfo: {
    marginBottom: Math.max(16, screenHeight * 0.02),
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Math.max(8, screenWidth * 0.02),
    marginBottom: Math.max(6, screenHeight * 0.008),
  },
  customerIcon: {
    fontSize: Math.max(16, screenWidth * 0.04),
  },
  customerName: {
    fontSize: Math.max(16, screenWidth * 0.04),
    fontWeight: '600',
  },
  customerAddress: {
    fontSize: Math.max(13, screenWidth * 0.033),
    lineHeight: Math.max(18, screenHeight * 0.022),
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Math.max(16, screenHeight * 0.02),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Math.max(6, screenWidth * 0.015),
  },
  detailIcon: {
    fontSize: Math.max(16, screenWidth * 0.04),
  },
  detailText: {
    fontSize: Math.max(14, screenWidth * 0.035),
    fontWeight: '500',
  },
  orderTotal: {
    alignItems: 'flex-end',
  },
  totalAmount: {
    fontSize: Math.max(20, screenWidth * 0.05),
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Math.max(20, screenHeight * 0.025),
    paddingHorizontal: Math.max(8, screenWidth * 0.02),
    gap: Math.max(8, screenWidth * 0.02),
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Math.max(12, screenHeight * 0.015),
    paddingHorizontal: Math.max(8, screenWidth * 0.02),
    borderRadius: Math.max(8, screenWidth * 0.02),
    minHeight: Math.max(48, screenHeight * 0.06),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 0,
  },
  callButton: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  viewButton: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  acceptButton: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  declineButton: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  completeButton: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  readyButton: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  assignButton: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  trackButton: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C',
  },
  restoreButton: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  deleteButton: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  actionButtonIcon: {
    fontSize: Math.max(16, screenWidth * 0.04),
    marginBottom: Math.max(4, screenHeight * 0.005),
  },
  actionButtonText: {
    fontSize: Math.max(12, screenWidth * 0.03),
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});


