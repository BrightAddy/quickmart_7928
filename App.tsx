import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/theme/theme';
import { RootStackParamList } from './src/navigation/types';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import UserRoleSelection from './src/screens/UserRoleSelection';
import LoginScreen from './src/screens/LoginScreen';
import CustomerHome from './src/screens/CustomerHome';
import StoreBrowse from './src/screens/StoreBrowse';
import CartCheckout from './src/screens/CartCheckout';
import Orders from './src/screens/Orders';
import Profile from './src/screens/Profile';
import HelpCenter from './src/screens/HelpCenter';
import Referral from './src/screens/Referral';
import CustomerTabs from './src/navigation/CustomerTabs';
import ShopperStack from './src/navigation/ShopperStack';
import ShopperTabs from './src/navigation/ShopperTabs';
import StoreOwnerStack from './src/navigation/StoreOwnerStack';
import OrderTracking from './src/screens/OrderTracking';
import PaymentMethods from './src/screens/PaymentMethods';
import UserPreferencesScreen from './src/screens/UserPreferencesScreen';
import Notifications from './src/screens/Notifications';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              <Stack.Screen name="UserRoleSelection" component={UserRoleSelection} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="CustomerHome" component={CustomerHome} />
              <Stack.Screen name="StoreBrowse" component={StoreBrowse} />
              <Stack.Screen name="CartCheckout" component={CartCheckout} />
              <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
              <Stack.Screen name="HelpCenter" component={HelpCenter} />
              <Stack.Screen name="Referral" component={Referral} />
              <Stack.Screen name="ShopperHome" component={ShopperStack} />
              <Stack.Screen name="ShopperTabs" component={ShopperTabs} />
              <Stack.Screen name="StoreOwnerHome" component={StoreOwnerStack} />
              <Stack.Screen name="OrderTracking" component={OrderTracking} />
              <Stack.Screen name="PaymentMethods" component={PaymentMethods} />
              <Stack.Screen name="UserPreferences" component={UserPreferencesScreen} />
              <Stack.Screen name="Notifications" component={Notifications} />
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}


