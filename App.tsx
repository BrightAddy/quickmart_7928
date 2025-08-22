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
import CustomerLogin from './src/screens/CustomerLogin';
import CustomerSignup from './src/screens/CustomerSignup';
import ShopperLogin from './src/screens/ShopperLogin';
import ShopperSignup from './src/screens/ShopperSignup';
import StoreOwnerLogin from './src/screens/StoreOwnerLogin';
import StoreOwnerSignup from './src/screens/StoreOwnerSignup';
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
import StoreOwnerTabs from './src/navigation/StoreOwnerTabs';
import OrderTracking from './src/screens/OrderTracking';
import PaymentMethods from './src/screens/PaymentMethods';
import UserPreferencesScreen from './src/screens/UserPreferencesScreen';
import Notifications from './src/screens/Notifications';
import ProductDetails from './src/screens/ProductDetails';
import { CartProvider } from './src/context/CartContext';
import { OrderProvider } from './src/context/OrderContext';
import Checkout from './src/screens/Checkout';
import EditProfile from './src/screens/EditProfile';
import LoyaltyPoints from './src/screens/LoyaltyPoints';
import ManageAddresses from './src/screens/ManageAddresses';
import { ProductsProvider } from './src/context/ProductsContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ProductsProvider>
            <CartProvider>
              <OrderProvider>
                <NavigationContainer>
                  <StatusBar style="dark" />
                  <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Splash" component={SplashScreen} />
                    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                    <Stack.Screen name="UserRoleSelection" component={UserRoleSelection} />
                    <Stack.Screen name="CustomerLogin" component={CustomerLogin} />
                    <Stack.Screen name="CustomerSignup" component={CustomerSignup} />
                    <Stack.Screen name="ShopperLogin" component={ShopperLogin} />
                    <Stack.Screen name="ShopperSignup" component={ShopperSignup} />
                    <Stack.Screen name="StoreOwnerLogin" component={StoreOwnerLogin} />
                    <Stack.Screen name="StoreOwnerSignup" component={StoreOwnerSignup} />
                    <Stack.Screen name="CustomerHome" component={CustomerHome} />
                    <Stack.Screen name="StoreBrowse" component={StoreBrowse} />
                    <Stack.Screen name="CartCheckout" component={CartCheckout} />
                    <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
                    <Stack.Screen name="HelpCenter" component={HelpCenter} />
                    <Stack.Screen name="Referral" component={Referral} />
                    <Stack.Screen name="ShopperHome" component={ShopperStack} />
                    <Stack.Screen name="ShopperTabs" component={ShopperTabs} />
                    <Stack.Screen name="StoreOwnerHome" component={StoreOwnerTabs} />
                    <Stack.Screen name="OrderTracking" component={OrderTracking} />
                    <Stack.Screen name="PaymentMethods" component={PaymentMethods} />
                    <Stack.Screen name="UserPreferences" component={UserPreferencesScreen} />
                    <Stack.Screen name="Notifications" component={Notifications} />
                    <Stack.Screen name="ProductDetails" component={ProductDetails} />
                    <Stack.Screen name="Checkout" component={Checkout} />
                    <Stack.Screen name="EditProfile" component={EditProfile} />
                    <Stack.Screen name="LoyaltyPoints" component={LoyaltyPoints} />
                    <Stack.Screen name="ManageAddresses" component={ManageAddresses} />
                  </Stack.Navigator>
                </NavigationContainer>
              </OrderProvider>
            </CartProvider>
          </ProductsProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}


