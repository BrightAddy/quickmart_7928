import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ShopperDashboard from '../screens/shopper/ShopperDashboard';
import { ThemeOverrideProvider, shopperOrangeTheme } from '../theme/theme';

const Stack = createNativeStackNavigator();

export default function ShopperStack() {
  return (
    <ThemeOverrideProvider theme={shopperOrangeTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ShopperDashboard" component={ShopperDashboard} />
      </Stack.Navigator>
    </ThemeOverrideProvider>
  );
}


