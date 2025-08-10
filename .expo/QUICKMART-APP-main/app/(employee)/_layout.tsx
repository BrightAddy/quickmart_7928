import React, { useEffect } from 'react';
import { Tabs } from "expo-router";
import { Home, Clock, User, DollarSign } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'expo-router';

export default function EmployeeTabLayout() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  // Check if user is authenticated and has the correct role
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'employee') {
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
          title: "Available",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="my-orders"
        options={{
          title: "My Orders",
          tabBarIcon: ({ color }) => <Clock size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="earnings"
        options={{
          title: "Earnings",
          tabBarIcon: ({ color }) => <DollarSign size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
      
      {/* Hide these screens from tab bar - they are accessed from profile */}
      <Tabs.Screen
        name="schedule"
        options={{
          href: null, // This hides the screen from the tab bar
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
    </Tabs>
  );
}