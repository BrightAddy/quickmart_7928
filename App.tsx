import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/theme/theme';
import { RootStackParamList } from './src/navigation/types';
import SplashScreen from './src/screens/general/SplashScreen';
import OnboardingScreen from './src/screens/general/OnboardingScreen';
import WelcomeScreen from './src/screens/general/WelcomeScreen';
import UserRoleSelection from './src/screens/general/UserRoleSelection';
import CustomerLogin from './src/screens/customer/CustomerLogin';
import CustomerSignup from './src/screens/customer/CustomerSignup';
import ShopperLogin from './src/screens/shopper/ShopperLogin';
import ShopperSignup from './src/screens/shopper/ShopperSignup';
import StoreOwnerLogin from './src/screens/storeOwner/StoreOwnerLogin';
import StoreOwnerSignup from './src/screens/storeOwner/StoreOwnerSignup';
import CustomerHome from './src/screens/customer/CustomerHome';
import StoreBrowse from './src/screens/customer/StoreBrowse';
import CartCheckout from './src/screens/customer/CartCheckout';
import Orders from './src/screens/customer/Orders';
import Profile from './src/screens/customer/Profile';
import HelpCenter from './src/screens/general/HelpCenter';
import Referral from './src/screens/customer/Referral';
import CustomerTabs from './src/navigation/CustomerTabs';
import ShopperStack from './src/navigation/ShopperStack';
import ShopperTabs from './src/navigation/ShopperTabs';
import { withShopperTheme } from './src/navigation/withShopperTheme';
// wrap shopper screens with orange theme
const ShopperLoginThemed = withShopperTheme(ShopperLogin as any);
const ShopperSignupThemed = withShopperTheme(ShopperSignup as any);
const ShopperTabsThemed = withShopperTheme(ShopperTabs as any);
const ShopperHomeThemed = withShopperTheme(ShopperStack as any);
import StoreOwnerTabs from './src/navigation/StoreOwnerTabs';
import AddProduct from './src/screens/storeOwner/AddProduct';
import Restock from './src/screens/storeOwner/Restock';
import OrderTracking from './src/screens/customer/OrderTracking';
import PaymentMethods from './src/screens/customer/PaymentMethods';
import UserPreferencesScreen from './src/screens/general/UserPreferencesScreen';
import Notifications from './src/screens/general/Notifications';
import ProductDetails from './src/screens/customer/ProductDetails';
import { CartProvider } from './src/context/CartContext';
import { OrderProvider } from './src/context/OrderContext';
import Checkout from './src/screens/customer/Checkout';
import EditProfile from './src/screens/general/EditProfile';
import LoyaltyPoints from './src/screens/customer/LoyaltyPoints';
import ManageAddresses from './src/screens/customer/ManageAddresses';
import { ProductsProvider } from './src/context/ProductsContext';
import { ChatbotProvider } from './src/context/ChatbotContext';
import { ShopperChatProvider } from './src/context/ShopperChatContext';
import AllStores from './src/screens/customer/AllStores';
import Search from './src/screens/customer/Search';
import Deals from './src/screens/customer/Deals';
import ShopperChat from './src/screens/shopper/ShopperChat';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ChatbotProvider>
            <ShopperChatProvider>
              <ProductsProvider>
                <CartProvider>
                  <OrderProvider>
                  <NavigationContainer>
                    <StatusBar style="dark" />
                    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
                      <Stack.Screen name="Splash" component={SplashScreen} />
                      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                      <Stack.Screen name="Welcome" component={WelcomeScreen} />
                      <Stack.Screen name="UserRoleSelection" component={UserRoleSelection} />
                      <Stack.Screen name="CustomerLogin" component={CustomerLogin} />
                      <Stack.Screen name="CustomerSignup" component={CustomerSignup} />
                      <Stack.Screen name="ShopperLogin" component={ShopperLoginThemed} />
                      <Stack.Screen name="ShopperSignup" component={ShopperSignupThemed} />
                      <Stack.Screen name="StoreOwnerLogin" component={StoreOwnerLogin} />
                      <Stack.Screen name="StoreOwnerSignup" component={StoreOwnerSignup} />
                      <Stack.Screen name="CustomerHome" component={CustomerHome} />
                      <Stack.Screen name="StoreBrowse" component={StoreBrowse} />
                      <Stack.Screen name="CartCheckout" component={CartCheckout} />
                      <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
                      <Stack.Screen name="HelpCenter" component={HelpCenter} />
                      <Stack.Screen name="Referral" component={Referral} />
                      <Stack.Screen name="ShopperHome" component={ShopperHomeThemed} />
                      <Stack.Screen name="ShopperTabs" component={ShopperTabsThemed} />
                      <Stack.Screen name="StoreOwnerHome" component={StoreOwnerTabs} />
                      <Stack.Screen name="AddProduct" component={AddProduct} />
                      <Stack.Screen name="Restock" component={Restock} />
                      <Stack.Screen name="OrderTracking" component={OrderTracking} />
                      <Stack.Screen name="PaymentMethods" component={PaymentMethods} />
                      <Stack.Screen name="UserPreferences" component={UserPreferencesScreen} />
                      <Stack.Screen name="Notifications" component={Notifications} />
                      <Stack.Screen name="ProductDetails" component={ProductDetails} />
                      <Stack.Screen name="Checkout" component={Checkout} />
                      <Stack.Screen name="EditProfile" component={EditProfile} />
                      <Stack.Screen name="LoyaltyPoints" component={LoyaltyPoints} />
                      <Stack.Screen name="ManageAddresses" component={ManageAddresses} />
                      <Stack.Screen name="Search" component={Search} />
                      <Stack.Screen name="AllStores" component={AllStores} />
                      <Stack.Screen name="Deals" component={Deals} />
                      <Stack.Screen name="ShopperChat" component={ShopperChat} />
                    </Stack.Navigator>
                  </NavigationContainer>
                  </OrderProvider>
                </CartProvider>
              </ProductsProvider>
            </ShopperChatProvider>
          </ChatbotProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}


