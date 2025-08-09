import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ShopperDashboard from '@/screens/shopper/ShopperDashboard';
import ShopperActiveOrder from '@/screens/shopper/ShopperActiveOrder';
import ShopperEarnings from '@/screens/shopper/ShopperEarnings';
import ShopperSchedule from '@/screens/shopper/ShopperSchedule';

const Stack = createNativeStackNavigator();

export default function ShopperStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ShopperDashboard" component={ShopperDashboard} />
      <Stack.Screen name="ShopperActiveOrder" component={ShopperActiveOrder} />
      <Stack.Screen name="ShopperEarnings" component={ShopperEarnings} />
      <Stack.Screen name="ShopperSchedule" component={ShopperSchedule} />
    </Stack.Navigator>
  );
}


