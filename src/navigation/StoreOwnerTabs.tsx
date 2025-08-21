import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useTheme } from '../theme/theme';
import Dashboard from '../screens/storeOwner/Dashboard';
import Orders from '../screens/storeOwner/Orders';
import Products from '../screens/storeOwner/Products';
import Settings from '../screens/storeOwner/Settings';

const Tab = createBottomTabNavigator();
const ORANGE = '#FF7A00';

export default function StoreOwnerTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: ORANGE + '33',
        },
        tabBarActiveTintColor: ORANGE,
        tabBarInactiveTintColor: '#777',
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ tabBarIcon: () => <Text>📊</Text> }}
      />
      <Tab.Screen
        name="Orders"
        component={Orders}
        options={{ tabBarIcon: () => <Text>🧾</Text> }}
      />
      <Tab.Screen
        name="Products"
        component={Products}
        options={{ tabBarIcon: () => <Text>🛍️</Text> }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{ tabBarIcon: () => <Text>⚙️</Text> }}
      />
    </Tab.Navigator>
  );
}


