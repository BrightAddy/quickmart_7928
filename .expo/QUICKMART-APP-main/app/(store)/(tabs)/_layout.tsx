import React from 'react';
import { Tabs } from "expo-router";
import { View, StyleSheet, Platform } from 'react-native';
import { Home, ShoppingBag, BarChart2, Package, Settings } from "lucide-react-native";
import Colors from "@/constants/colors";

export default function StoreTabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.subtext,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: Colors.white,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: -4,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
        headerStyle: {
          backgroundColor: Colors.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarItemStyle: {
          paddingTop: 6,
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Home size={24} color={color} />
            </View>
          ),
          headerShown: false,
        }}
      />
      
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <ShoppingBag size={24} color={color} />
            </View>
          ),
          headerShown: false,
        }}
      />
      
      <Tabs.Screen
        name="inventory"
        options={{
          title: "Inventory",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Package size={24} color={color} />
            </View>
          ),
          headerShown: false,
        }}
      />
      
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <BarChart2 size={24} color={color} />
            </View>
          ),
          headerShown: false,
        }}
      />
      
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Settings size={24} color={color} />
            </View>
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeIconContainer: {
    backgroundColor: Colors.lightPrimary || Colors.primary + '15',
    borderRadius: 8,
    padding: 6,
    marginTop: -6,
  },
});