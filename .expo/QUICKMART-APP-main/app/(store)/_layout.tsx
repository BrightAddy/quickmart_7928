import React from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';

export default function StoreLayout() {
  const { user } = useAuthStore();

  // Redirect if not a store owner
  if (!user || user.role !== 'store_owner') {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="order/[id]" 
        options={{ 
          headerShown: true,
          headerTitle: "Order Details",
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#4F46E5",
          }
        }} 
      />
      <Stack.Screen 
        name="customers" 
        options={{ 
          headerShown: true,
          headerTitle: "Customers",
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#4F46E5",
          }
        }} 
      />
    </Stack>
  );
}