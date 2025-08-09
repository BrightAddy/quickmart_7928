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
import UserRoleSelection from './src/screens/UserRoleSelection';
import LoginScreen from './src/screens/LoginScreen';
import CustomerHome from './src/screens/CustomerHome';
import StoreBrowse from './src/screens/StoreBrowse';
import CartCheckout from './src/screens/CartCheckout';

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
              <Stack.Screen name="UserRoleSelection" component={UserRoleSelection} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="CustomerHome" component={CustomerHome} />
              <Stack.Screen name="StoreBrowse" component={StoreBrowse} />
              <Stack.Screen name="CartCheckout" component={CartCheckout} />
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}


