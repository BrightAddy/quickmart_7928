import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { useTheme } from '../../theme/theme';

const ORANGE = '#FF7A00';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Dashboard({ navigation }: any) {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [storeStatus, setStoreStatus] = useState('Open');

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Success', 'Dashboard refreshed successfully!');
    }, 1000);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'Add Product':
        navigation.navigate('AddProduct');
        break;
      case 'Restock':
        navigation.navigate('Restock');
        break;
      case 'Update Hours':
        Alert.alert('Update Hours', 'Opening store hours settings...');
        break;
      default:
        Alert.alert('Quick Action', `${action} action triggered!`);
    }
  };

  const handleOrderAction = (orderId: string, action: string) => {
    Alert.alert('Order Action', `${action} for ${orderId}`);
  };

  const handleStoreManage = () => {
    Alert.alert('Store Management', 'Opening store settings...');
  };

  const handleViewAll = (section: string) => {
    Alert.alert('View All', `Opening ${section}...`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Navigation Bar */}
      <View style={styles.topNav}>
        <View style={styles.logoSection}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoText}>🏪</Text>
          </View>
          <View>
            <Text style={styles.brandName}>QuickMart</Text>
            <Text style={styles.brandSubtitle}>Store Manager</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => Alert.alert('Menu', 'Opening menu...')}
          activeOpacity={0.7}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Dashboard Header */}
      <View style={styles.dashboardHeader}>
        <View>
          <Text style={[styles.dashboardTitle, { color: colors.onBackground }]}>Dashboard</Text>
          <Text style={[styles.lastUpdated, { color: colors.onSurface + '88' }]}>
            Last updated: {new Date().toLocaleTimeString()}
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.refreshButton, refreshing && styles.refreshButtonActive]}
          onPress={handleRefresh}
          disabled={refreshing}
          activeOpacity={0.7}
        >
          <Text style={[styles.refreshIcon, refreshing && styles.refreshIconActive]}>
            {refreshing ? '⏳' : '↻'}
          </Text>
          <Text style={[styles.refreshText, { color: colors.onSurface }]}>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Metric Cards */}
        <View style={styles.metricCardsContainer}>
          <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Text style={styles.salesIcon}>💰</Text>
              </View>
              <View style={styles.trendSection}>
                <Text style={styles.trendIcon}>📈</Text>
                <Text style={styles.trendText}>+12.5%</Text>
              </View>
            </View>
            <Text style={[styles.metricValue, { color: colors.onBackground }]}>₵2,450.75</Text>
            <Text style={[styles.metricLabel, { color: colors.onSurface + '88' }]}>Today's Sales</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Text style={styles.cartIcon}>🛒</Text>
              </View>
              <View style={styles.trendSection}>
                <Text style={styles.trendIcon}>📈</Text>
                <Text style={styles.trendText}>+8</Text>
              </View>
            </View>
            <Text style={[styles.metricValue, { color: colors.onBackground }]}>47</Text>
            <Text style={[styles.metricLabel, { color: colors.onSurface + '88' }]}>Total Orders</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Text style={styles.clockIcon}>⏰</Text>
              </View>
              <View style={styles.trendSection}>
                <Text style={styles.trendIcon}>📉</Text>
                <Text style={[styles.trendText, { color: '#FF4444' }]}>-3</Text>
              </View>
            </View>
            <Text style={[styles.metricValue, { color: colors.onBackground }]}>12</Text>
            <Text style={[styles.metricLabel, { color: colors.onSurface + '88' }]}>Pending Orders</Text>
          </View>
        </View>

        {/* Critical Alerts Section */}
        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.warningIcon}>⚠️</Text>
              <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Critical Alerts</Text>
            </View>
            <TouchableOpacity 
              onPress={() => handleViewAll('alerts')}
              activeOpacity={0.7}
            >
              <Text style={[styles.viewAllText, { color: ORANGE }]}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.alertContainer}>
            <TouchableOpacity 
              style={[styles.alertItem, { backgroundColor: '#fff', borderColor: '#f0f0f0' }]}
              onPress={() => Alert.alert('Low Stock', 'Coca Cola 500ml needs restocking')}
              activeOpacity={0.8}
            >
              <View style={styles.alertIconContainer}>
                <Text style={styles.boxIcon}>📦</Text>
              </View>
              <View style={styles.alertContent}>
                <Text style={[styles.alertTitle, { color: colors.onBackground }]}>Low Stock Alert</Text>
                <Text style={[styles.alertDescription, { color: colors.onSurface + '88' }]}>Coca Cola 500ml has only 5 units left</Text>
              </View>
              <Text style={[styles.alertTime, { color: colors.onSurface + '66' }]}>2 min ago</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.alertItem, { backgroundColor: '#fff', borderColor: '#f0f0f0' }]}
              onPress={() => Alert.alert('Unassigned Order', 'Order needs staff assignment')}
              activeOpacity={0.8}
            >
              <View style={styles.alertIconContainer}>
                <Text style={styles.clockIcon}>⏰</Text>
              </View>
              <View style={styles.alertContent}>
                <Text style={[styles.alertTitle, { color: colors.onBackground }]}>Unassigned Order</Text>
                <Text style={[styles.alertDescription, { color: colors.onSurface + '88' }]}>Order #ORD-2024-0156 needs staff assignment</Text>
              </View>
              <Text style={[styles.alertTime, { color: colors.onSurface + '66' }]}>5 min ago</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.moreAlertsButton}
            onPress={() => handleViewAll('more alerts')}
            activeOpacity={0.7}
          >
            <Text style={[styles.moreAlertsText, { color: ORANGE }]}>+1 more alerts</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions Section */}
        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: ORANGE }]}
              onPress={() => handleQuickAction('Add Product')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionIcon}>+</Text>
              <Text style={styles.actionText}>Add Product</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
              onPress={() => handleQuickAction('Restock')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionIcon}>📦</Text>
              <Text style={styles.actionText}>Restock</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#fff', borderColor: '#ddd' }]}
              onPress={() => handleQuickAction('Update Hours')}
              activeOpacity={0.8}
            >
              <Text style={[styles.actionIcon, { color: '#333' }]}>🕐</Text>
              <Text style={[styles.actionText, { color: '#333' }]}>Update Hours</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Orders Section */}
        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Recent Orders</Text>
            <TouchableOpacity 
              onPress={() => handleViewAll('orders')}
              activeOpacity={0.7}
            >
              <Text style={[styles.viewAllText, { color: ORANGE }]}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Order Cards */}
          <View style={styles.ordersContainer}>
            {/* Order #ORD-2024-0156 - Pending */}
            <TouchableOpacity 
              style={[styles.orderCard, { backgroundColor: '#fff', borderColor: '#f0f0f0' }]}
              onPress={() => Alert.alert('Order Details', 'Opening order #ORD-2024-0156')}
              activeOpacity={0.9}
            >
              <View style={styles.orderHeader}>
                <View style={styles.orderIdSection}>
                  <Text style={[styles.orderId, { color: colors.onBackground }]}>#ORD-2024-0156</Text>
                </View>
                <View style={styles.orderAmountSection}>
                  <Text style={[styles.orderAmount, { color: colors.onBackground }]}>₵85.50</Text>
                  <Text style={[styles.orderTime, { color: colors.onSurface + '66' }]}>2 min ago</Text>
                </View>
              </View>
              <View style={styles.orderStatusRow}>
                <Text style={[styles.orderStatus, { color: ORANGE }]}>Pending</Text>
              </View>
              
              <View style={styles.customerInfo}>
                <Text style={[styles.customerName, { color: colors.onBackground }]}>Kwame Asante</Text>
                <View style={styles.locationRow}>
                  <Text style={styles.locationIcon}>📍</Text>
                  <Text style={[styles.locationText, { color: colors.onSurface + '88' }]}>East Legon, Accra</Text>
                </View>
              </View>

              <View style={styles.itemsContainer}>
                <View style={[styles.itemTag, { backgroundColor: '#f0f0f0' }]}>
                  <Text style={[styles.itemText, { color: colors.onBackground }]}>2x Coca Cola</Text>
                </View>
                <View style={[styles.itemTag, { backgroundColor: '#f0f0f0' }]}>
                  <Text style={[styles.itemText, { color: colors.onBackground }]}>1x Bread</Text>
                </View>
                <View style={[styles.itemTag, { backgroundColor: '#f0f0f0' }]}>
                  <Text style={[styles.itemText, { color: colors.onBackground }]}>1x Milk</Text>
                </View>
              </View>

              <View style={styles.orderActions}>
                <TouchableOpacity 
                  style={[styles.actionBtn, { backgroundColor: '#4CAF50' }]}
                  onPress={() => handleOrderAction('#ORD-2024-0156', 'Accept')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionBtnText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionBtn, { backgroundColor: '#fff', borderColor: '#ddd' }]}
                  onPress={() => handleOrderAction('#ORD-2024-0156', 'Assign')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.actionBtnText, { color: '#333' }]}>Assign</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* Order #ORD-2024-0155 - In Progress */}
            <TouchableOpacity 
              style={[styles.orderCard, { backgroundColor: '#fff', borderColor: '#f0f0f0' }]}
              onPress={() => Alert.alert('Order Details', 'Opening order #ORD-2024-0155')}
              activeOpacity={0.9}
            >
              <View style={styles.orderHeader}>
                <View style={styles.orderIdSection}>
                  <Text style={[styles.orderId, { color: colors.onBackground }]}>#ORD-2024-0155</Text>
                </View>
                <View style={styles.orderAmountSection}>
                  <Text style={[styles.orderAmount, { color: colors.onBackground }]}>₵125.75</Text>
                  <Text style={[styles.orderTime, { color: colors.onSurface + '66' }]}>8 min ago</Text>
                </View>
              </View>
              <View style={styles.orderStatusRow}>
                <Text style={[styles.orderStatus, { color: '#2196F3' }]}>In Progress</Text>
              </View>
              
              <View style={styles.customerInfo}>
                <Text style={[styles.customerName, { color: colors.onBackground }]}>Ama Osei</Text>
                <View style={styles.locationRow}>
                  <Text style={styles.locationIcon}>📍</Text>
                  <Text style={[styles.locationText, { color: colors.onSurface + '88' }]}>Tema, Greater Accra</Text>
                </View>
              </View>

              <View style={styles.itemsContainer}>
                <View style={[styles.itemTag, { backgroundColor: '#f0f0f0' }]}>
                  <Text style={[styles.itemText, { color: colors.onBackground }]}>2x Rice</Text>
                </View>
                <View style={[styles.itemTag, { backgroundColor: '#f0f0f0' }]}>
                  <Text style={[styles.itemText, { color: colors.onBackground }]}>1x Chicken</Text>
                </View>
                <View style={[styles.itemTag, { backgroundColor: '#f0f0f0' }]}>
                  <Text style={[styles.itemText, { color: colors.onBackground }]}>3x Vegetables</Text>
                </View>
              </View>

              <View style={styles.orderActions}>
                <TouchableOpacity 
                  style={[styles.actionBtn, { backgroundColor: ORANGE }]}
                  onPress={() => handleOrderAction('#ORD-2024-0155', 'Mark Ready')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionBtnText}>Mark Ready</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* Order #ORD-2024-0154 - Ready */}
            <TouchableOpacity 
              style={[styles.orderCard, { backgroundColor: '#fff', borderColor: '#f0f0f0' }]}
              onPress={() => Alert.alert('Order Details', 'Opening order #ORD-2024-0154')}
              activeOpacity={0.9}
            >
              <View style={styles.orderHeader}>
                <View style={styles.orderIdSection}>
                  <Text style={[styles.orderId, { color: colors.onBackground }]}>#ORD-2024-0154</Text>
                </View>
                <View style={styles.orderAmountSection}>
                  <Text style={[styles.orderAmount, { color: colors.onBackground }]}>₵67.25</Text>
                  <Text style={[styles.orderTime, { color: colors.onSurface + '66' }]}>15 min ago</Text>
                </View>
              </View>
              <View style={styles.orderStatusRow}>
                <Text style={[styles.orderStatus, { color: '#4CAF50' }]}>Ready</Text>
              </View>
              
              <View style={styles.customerInfo}>
                <Text style={[styles.customerName, { color: colors.onBackground }]}>Kofi Mensah</Text>
                <View style={styles.locationRow}>
                  <Text style={styles.locationIcon}>📍</Text>
                  <Text style={[styles.locationText, { color: colors.onSurface + '88' }]}>Kumasi, Ashanti Region</Text>
                </View>
              </View>

              <View style={styles.itemsContainer}>
                <View style={[styles.itemTag, { backgroundColor: '#f0f0f0' }]}>
                  <Text style={[styles.itemText, { color: colors.onBackground }]}>5x Bananas</Text>
                </View>
                <View style={[styles.itemTag, { backgroundColor: '#f0f0f0' }]}>
                  <Text style={[styles.itemText, { color: colors.onBackground }]}>2x Apples</Text>
                </View>
              </View>

              <View style={styles.orderActions}>
                <TouchableOpacity 
                  style={[styles.actionBtn, { backgroundColor: '#4CAF50' }]}
                  onPress={() => handleOrderAction('#ORD-2024-0154', 'Complete')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionBtnText}>Complete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* Order #ORD-2024-0153 - Done */}
            <TouchableOpacity 
              style={[styles.orderCard, { backgroundColor: '#fff', borderColor: '#f0f0f0' }]}
              onPress={() => Alert.alert('Order Details', 'Opening order #ORD-2024-0153')}
              activeOpacity={0.9}
            >
              <View style={styles.orderHeader}>
                <View style={styles.orderIdSection}>
                  <Text style={[styles.orderId, { color: colors.onBackground }]}>#ORD-2024-0153</Text>
                </View>
                <View style={styles.orderAmountSection}>
                  <Text style={[styles.orderAmount, { color: colors.onBackground }]}>₵156.00</Text>
                  <Text style={[styles.orderTime, { color: colors.onSurface + '66' }]}>1 hour ago</Text>
                </View>
              </View>
              <View style={styles.orderStatusRow}>
                <View style={[styles.statusPill, { backgroundColor: '#f0f0f0' }]}>
                  <Text style={[styles.statusPillText, { color: '#666' }]}>Done</Text>
                </View>
              </View>
              
              <View style={styles.customerInfo}>
                <Text style={[styles.customerName, { color: colors.onBackground }]}>Akosua Boateng</Text>
                <View style={styles.locationRow}>
                  <Text style={styles.locationIcon}>📍</Text>
                  <Text style={[styles.locationText, { color: colors.onSurface + '88' }]}>Cape Coast, Central Region</Text>
                </View>
              </View>

              <View style={styles.itemsContainer}>
                <View style={[styles.itemTag, { backgroundColor: '#f0f0f0' }]}>
                  <Text style={[styles.itemText, { color: colors.onBackground }]}>2x Fish</Text>
                </View>
                <View style={[styles.itemTag, { backgroundColor: '#f0f0f0' }]}>
                  <Text style={[styles.itemText, { color: colors.onBackground }]}>3x Tomatoes</Text>
                </View>
                <View style={[styles.itemTag, { backgroundColor: '#f0f0f0' }]}>
                  <Text style={[styles.itemText, { color: colors.onBackground }]}>2x Onions</Text>
                </View>
                <View style={[styles.itemTag, { backgroundColor: '#f0f0f0' }]}>
                  <Text style={[styles.itemText, { color: colors.onBackground }]}>+1 more</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Order #ORD-2024-0152 - Cancelled */}
            <TouchableOpacity 
              style={[styles.orderCard, { backgroundColor: '#fff', borderColor: '#f0f0f0' }]}
              onPress={() => Alert.alert('Order Details', 'Opening order #ORD-2024-0152')}
              activeOpacity={0.9}
            >
              <View style={styles.orderHeader}>
                <View style={styles.orderIdSection}>
                  <Text style={[styles.orderId, { color: colors.onBackground }]}>#ORD-2024-0152</Text>
                </View>
                <View style={styles.orderAmountSection}>
                  <Text style={[styles.orderAmount, { color: colors.onBackground }]}>₵89.50</Text>
                  <Text style={[styles.orderTime, { color: colors.onSurface + '66' }]}>2 hours ago</Text>
                </View>
              </View>
              <View style={styles.orderStatusRow}>
                <Text style={[styles.orderStatus, { color: '#FF4444' }]}>Cancelled</Text>
              </View>
              
              <View style={styles.customerInfo}>
                <Text style={[styles.customerName, { color: colors.onBackground }]}>Yaw Owusu</Text>
                <View style={styles.locationRow}>
                  <Text style={styles.locationIcon}>📍</Text>
                  <Text style={[styles.locationText, { color: colors.onSurface + '88' }]}>Takoradi, Western Region</Text>
                </View>
              </View>

              <View style={styles.itemsContainer}>
                <View style={[styles.itemTag, { backgroundColor: '#f0f0f0' }]}>
                  <Text style={[styles.itemText, { color: colors.onBackground }]}>3x Soap</Text>
                </View>
                <View style={[styles.itemTag, { backgroundColor: '#f0f0f0' }]}>
                  <Text style={[styles.itemText, { color: colors.onBackground }]}>1x Detergent</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Store Status Section */}
        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}>
          <View style={styles.storeStatusRow}>
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot, { backgroundColor: storeStatus === 'Open' ? '#4CAF50' : '#FF4444' }]} />
              <Text style={[styles.storeStatusText, { color: colors.onBackground }]}>
                Store Status: {storeStatus}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.manageButton}
              onPress={handleStoreManage}
              activeOpacity={0.7}
            >
              <Text style={styles.manageIcon}>⚙️</Text>
              <Text style={[styles.manageText, { color: ORANGE }]}>Manage</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.operatingHours, { color: colors.onSurface + '88' }]}>
            Open until 10:00 PM today
          </Text>
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
    gap: Math.max(16, screenWidth * 0.04),
    paddingBottom: Math.max(32, screenHeight * 0.04),
  },
  metricCardsContainer: {
    gap: Math.max(16, screenWidth * 0.04),
  },
  refreshButtonActive: {
    backgroundColor: '#f0f0f0',
  },
  refreshIconActive: {
    color: ORANGE,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    paddingTop: Math.max(50, screenHeight * 0.06),
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Math.max(12, screenWidth * 0.03),
  },
  logoIcon: {
    width: Math.max(40, screenWidth * 0.1),
    height: Math.max(40, screenWidth * 0.1),
    backgroundColor: ORANGE,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  logoText: {
    fontSize: Math.max(20, screenWidth * 0.05),
    color: '#fff',
  },
  brandName: {
    fontSize: Math.max(18, screenWidth * 0.045),
    fontWeight: 'bold',
    color: '#333',
  },
  brandSubtitle: {
    fontSize: Math.max(12, screenWidth * 0.03),
    color: '#666',
    marginTop: -2,
  },
  menuButton: {
    padding: Math.max(8, screenWidth * 0.02),
  },
  menuIcon: {
    fontSize: Math.max(20, screenWidth * 0.05),
    color: '#333',
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dashboardTitle: {
    fontSize: Math.max(24, screenWidth * 0.06),
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: Math.max(12, screenWidth * 0.03),
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 8,
  },
  refreshIcon: {
    fontSize: Math.max(16, screenWidth * 0.04),
    color: '#333',
  },
  refreshText: {
    fontSize: Math.max(14, screenWidth * 0.035),
    fontWeight: '500',
  },
  metricCard: {
    borderRadius: Math.max(16, screenWidth * 0.04),
    padding: Math.max(20, screenWidth * 0.05),
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    width: Math.max(40, screenWidth * 0.1),
    height: Math.max(40, screenWidth * 0.1),
    borderRadius: Math.max(20, screenWidth * 0.05),
    alignItems: 'center',
    justifyContent: 'center',
  },
  salesIcon: {
    fontSize: Math.max(20, screenWidth * 0.05),
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  cartIcon: {
    fontSize: Math.max(20, screenWidth * 0.05),
    color: ORANGE,
  },
  clockIcon: {
    fontSize: Math.max(20, screenWidth * 0.05),
    color: ORANGE,
  },
  boxIcon: {
    fontSize: Math.max(20, screenWidth * 0.05),
    color: '#FF4444',
  },
  trendSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendIcon: {
    fontSize: Math.max(16, screenWidth * 0.04),
  },
  trendText: {
    fontSize: Math.max(14, screenWidth * 0.035),
    fontWeight: '600',
    color: '#4CAF50',
  },
  metricValue: {
    fontSize: Math.max(28, screenWidth * 0.07),
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: Math.max(14, screenWidth * 0.035),
    fontWeight: '500',
  },
  sectionCard: {
    borderRadius: Math.max(16, screenWidth * 0.04),
    padding: Math.max(20, screenWidth * 0.05),
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warningIcon: {
    fontSize: Math.max(20, screenWidth * 0.05),
    color: ORANGE,
  },
  sectionTitle: {
    fontSize: Math.max(20, screenWidth * 0.05),
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: Math.max(14, screenWidth * 0.035),
    fontWeight: '500',
  },
  alertContainer: {
    gap: 12,
    marginBottom: 16,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  alertIconContainer: {
    width: Math.max(40, screenWidth * 0.1),
    height: Math.max(40, screenWidth * 0.1),
    borderRadius: Math.max(20, screenWidth * 0.05),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: Math.max(16, screenWidth * 0.04),
    fontWeight: '600',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: Math.max(13, screenWidth * 0.033),
  },
  alertTime: {
    fontSize: Math.max(12, screenWidth * 0.03),
    marginTop: 8,
  },
  moreAlertsButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ORANGE,
  },
  moreAlertsText: {
    fontSize: Math.max(14, screenWidth * 0.035),
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: Math.max(10, screenWidth * 0.025),
  },
  actionButton: {
    flex: 1,
    paddingVertical: Math.max(15, screenHeight * 0.02),
    paddingHorizontal: Math.max(10, screenWidth * 0.025),
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Math.max(80, screenHeight * 0.1),
  },
  actionIcon: {
    fontSize: Math.max(24, screenWidth * 0.06),
    marginBottom: 8,
  },
  actionText: {
    fontSize: Math.max(12, screenWidth * 0.03),
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
  },
  ordersContainer: {
    gap: 16,
  },
  orderCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderIdSection: {
    flex: 1,
  },
  orderId: {
    fontSize: Math.max(16, screenWidth * 0.04),
    fontWeight: '600',
  },
  orderStatusRow: {
    marginBottom: 12,
  },
  orderStatus: {
    fontSize: Math.max(14, screenWidth * 0.035),
    fontWeight: '500',
  },
  orderAmountSection: {
    alignItems: 'flex-end',
    gap: 4,
    minWidth: 80,
  },
  orderAmount: {
    fontSize: Math.max(18, screenWidth * 0.045),
    fontWeight: 'bold',
    textAlign: 'right',
  },
  orderTime: {
    fontSize: Math.max(12, screenWidth * 0.03),
    textAlign: 'right',
  },
  customerInfo: {
    marginBottom: 16,
  },
  customerName: {
    fontSize: Math.max(15, screenWidth * 0.038),
    fontWeight: '600',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationIcon: {
    fontSize: Math.max(16, screenWidth * 0.04),
  },
  locationText: {
    fontSize: Math.max(13, screenWidth * 0.033),
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  itemTag: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f8f8',
  },
  itemText: {
    fontSize: Math.max(12, screenWidth * 0.03),
    fontWeight: '500',
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  actionBtnText: {
    fontSize: Math.max(13, screenWidth * 0.033),
    fontWeight: '600',
    color: '#fff',
  },
  statusPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  statusPillText: {
    fontSize: Math.max(12, screenWidth * 0.03),
    fontWeight: '500',
  },
  storeStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: Math.max(10, screenWidth * 0.025),
    height: Math.max(10, screenWidth * 0.025),
    borderRadius: Math.max(5, screenWidth * 0.0125),
    backgroundColor: '#4CAF50',
  },
  storeStatusText: {
    fontSize: Math.max(14, screenWidth * 0.035),
    fontWeight: '500',
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ORANGE,
  },
  manageIcon: {
    fontSize: Math.max(18, screenWidth * 0.045),
  },
  manageText: {
    fontSize: Math.max(14, screenWidth * 0.035),
    fontWeight: '500',
  },
  operatingHours: {
    fontSize: Math.max(13, screenWidth * 0.033),
  },
});


