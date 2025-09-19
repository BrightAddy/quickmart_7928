import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ShopperTabs from './ShopperTabs';
import ShopperChat from '../screens/shopper/ShopperChat';
import { ThemeOverrideProvider, shopperOrangeTheme } from '../theme/theme';

const Stack = createNativeStackNavigator();

export default function ShopperStack() {
  return (
    <ThemeOverrideProvider theme={shopperOrangeTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ShopperTabs" component={ShopperTabs} />
        <Stack.Screen name="ShopperChat" component={ShopperChat} />
      </Stack.Navigator>
    </ThemeOverrideProvider>
  );
}


