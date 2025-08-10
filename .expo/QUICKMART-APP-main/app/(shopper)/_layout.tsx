import React, { useEffect } from 'react';
import { Tabs } from "expo-router";
import { Home, Package, Clock, DollarSign, Star, User } from "lucide-react-native";
import { getColors } from "@/constants/colors";
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'expo-router';

export default function ShopperTabLayout() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  
  // Check if user is authenticated and has the correct role
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'shopper') {
      router.replace('/(auth)');
    }
  }, [isAuthenticated, user]);
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4464EB',
        tabBarInactiveTintColor: Colors.subtext,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 88,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: Colors.white,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
        },
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Home size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="batches"
        options={{
          title: "Batches",
          tabBarIcon: ({ color, focused }) => (
            <Package size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="in-progress"
        options={{
          title: "In Progress",
          tabBarIcon: ({ color, focused }) => (
            <Clock size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="earnings"
        options={{
          title: "Earnings",
          tabBarIcon: ({ color, focused }) => (
            <DollarSign size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="ratings"
        options={{
          title: "Ratings",
          tabBarIcon: ({ color, focused }) => (
            <Star size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, focused }) => (
            <User size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      
      {/* Hidden screens accessed from other tabs */}
      <Tabs.Screen
        name="delivery-zone"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="mobile-money"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="next-of-kin"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="training"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}