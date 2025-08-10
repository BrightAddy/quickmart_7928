import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomerHome from '../screens/CustomerHome';
import CartCheckout from '../screens/CartCheckout';
import Orders from '@/screens/Orders';
import Profile from '@/screens/Profile';
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


