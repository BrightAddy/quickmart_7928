import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import ShopperDashboard from '../screens/shopper/ShopperDashboard';
import ShopperOrders from '../screens/shopper/ShopperOrders';
import ShopperEarnings from '../screens/shopper/ShopperEarnings';
import Profile from '../screens/Profile';
import { useTheme } from '../theme/theme';

const Tab = createBottomTabNavigator();

export default function ShopperTabs() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: colors.primary + '22' },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#777',
      }}
    >
      <Tab.Screen name="Available" component={ShopperDashboard} options={{ tabBarIcon: () => <Text>🧺</Text> }} />
      <Tab.Screen name="Orders" component={ShopperOrders} options={{ tabBarIcon: () => <Text>📋</Text> }} />
      <Tab.Screen name="Earnings" component={ShopperEarnings} options={{ tabBarIcon: () => <Text>💰</Text> }} />
      <Tab.Screen name="Profile" component={Profile} options={{ tabBarIcon: () => <Text>👤</Text> }} />
    </Tab.Navigator>
  );
}


