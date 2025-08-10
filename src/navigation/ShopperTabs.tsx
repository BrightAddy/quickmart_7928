import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ShopperDashboard from '../screens/shopper/ShopperDashboard';

const Tab = createBottomTabNavigator();

export default function ShopperTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Shopper" component={ShopperDashboard} />
    </Tab.Navigator>
  );
}




