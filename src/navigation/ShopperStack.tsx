import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ShopperDashboard from '@/screens/shopper/ShopperDashboard';

const Stack = createNativeStackNavigator();

export default function ShopperStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ShopperDashboard" component={ShopperDashboard} />
    </Stack.Navigator>
  );
}


