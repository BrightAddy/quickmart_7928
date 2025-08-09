import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Inventory from '@/screens/store/Inventory';
import StoreOrders from '@/screens/store/StoreOrders';
import StoreAnalytics from '@/screens/store/StoreAnalytics';
import Promotions from '@/screens/store/Promotions';

const Stack = createNativeStackNavigator();

export default function StoreOwnerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Inventory" component={Inventory} />
      <Stack.Screen name="StoreOrders" component={StoreOrders} />
      <Stack.Screen name="StoreAnalytics" component={StoreAnalytics} />
      <Stack.Screen name="Promotions" component={Promotions} />
    </Stack.Navigator>
  );
}


