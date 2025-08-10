import React, { useEffect } from 'react';
import { Tabs } from "expo-router";
import { Home, ShoppingCart, Clock, User } from "lucide-react-native";
import { getColors } from "@/constants/colors";
import { useThemeStore } from "@/store/theme-store";
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'expo-router';
import { useCartStore } from '@/store/cart-store';

export default function CustomerTabLayout() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { getItemCount } = useCartStore();
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'customer') {
      router.replace('/(auth)');
    }
  }, [isAuthenticated, user]);
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.subtext,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: Colors.border,
        },
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          headerShown: false,
        }}
      />
      
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => <ShoppingCart size={24} color={color} />,
          tabBarBadge: getItemCount() > 0 ? getItemCount() : undefined,
        }}
      />
      
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => <Clock size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}