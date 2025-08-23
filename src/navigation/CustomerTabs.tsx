import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomerHome from '../screens/customer/CustomerHome';
import CartCheckout from '../screens/customer/CartCheckout';
import Orders from '../screens/customer/Orders';
import Profile from '../screens/customer/Profile';
import { useTheme } from '../theme/theme';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

export default function CustomerTabs() {
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
      <Tab.Screen name="Home" component={CustomerHome} options={{ tabBarIcon: () => <Text>🏠</Text> }} />
      <Tab.Screen name="Orders" component={Orders} options={{ tabBarIcon: () => <Text>📦</Text> }} />
      <Tab.Screen name="Cart" component={CartCheckout} options={{ tabBarIcon: () => <Text>🛒</Text> }} />
      <Tab.Screen name="Profile" component={Profile} options={{ tabBarIcon: () => <Text>👤</Text> }} />
    </Tab.Navigator>
  );
}


