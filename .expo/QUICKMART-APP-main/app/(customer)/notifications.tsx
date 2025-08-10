import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Bell, ShoppingBag, Tag, Clock, Truck, Info } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Layout from '@/constants/layout';

export default function NotificationsScreen() {
  const router = useRouter();
  
  // Notification settings state
  const [settings, setSettings] = useState({
    orderUpdates: true,
    promotions: false,
    newProducts: true,
    deliveryUpdates: true,
    appUpdates: false,
  });
  
  const toggleSwitch = (key: keyof typeof settings) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: !prevSettings[key]
    }));
  };
  
  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notification Preferences</Text>
        <Text style={styles.headerSubtitle}>
          Manage how and when you receive notifications from QuickMart
        </Text>
      </View>
      
      <View style={styles.section}>
        <View style={styles.notificationItem}>
          <View style={styles.iconContainer}>
            <Bell size={22} color={Colors.primary} />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>All Notifications</Text>
            <Text style={styles.notificationDescription}>
              Master toggle for all notifications
            </Text>
          </View>
          <Switch
            trackColor={{ false: Colors.border, true: Colors.lightPrimary }}
            thumbColor={settings.orderUpdates && settings.deliveryUpdates ? Colors.primary : Colors.subtext}
            ios_backgroundColor={Colors.border}
            onValueChange={() => {
              const allOn = Object.values(settings).every(value => value);
              const newValue = !allOn;
              setSettings({
                orderUpdates: newValue,
                promotions: newValue,
                newProducts: newValue,
                deliveryUpdates: newValue,
                appUpdates: newValue,
              });
            }}
            value={Object.values(settings).every(value => value)}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Notifications</Text>
        
        <View style={styles.notificationItem}>
          <View style={styles.iconContainer}>
            <ShoppingBag size={22} color={Colors.primary} />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Order Updates</Text>
            <Text style={styles.notificationDescription}>
              Receive notifications about your order status
            </Text>
          </View>
          <Switch
            trackColor={{ false: Colors.border, true: Colors.lightPrimary }}
            thumbColor={settings.orderUpdates ? Colors.primary : Colors.subtext}
            ios_backgroundColor={Colors.border}
            onValueChange={() => toggleSwitch('orderUpdates')}
            value={settings.orderUpdates}
          />
        </View>
        
        <View style={styles.notificationItem}>
          <View style={styles.iconContainer}>
            <Truck size={22} color={Colors.primary} />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Delivery Updates</Text>
            <Text style={styles.notificationDescription}>
              Get notified when your order is out for delivery
            </Text>
          </View>
          <Switch
            trackColor={{ false: Colors.border, true: Colors.lightPrimary }}
            thumbColor={settings.deliveryUpdates ? Colors.primary : Colors.subtext}
            ios_backgroundColor={Colors.border}
            onValueChange={() => toggleSwitch('deliveryUpdates')}
            value={settings.deliveryUpdates}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Marketing Notifications</Text>
        
        <View style={styles.notificationItem}>
          <View style={styles.iconContainer}>
            <Tag size={22} color={Colors.primary} />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Promotions & Discounts</Text>
            <Text style={styles.notificationDescription}>
              Stay updated on special offers and discounts
            </Text>
          </View>
          <Switch
            trackColor={{ false: Colors.border, true: Colors.lightPrimary }}
            thumbColor={settings.promotions ? Colors.primary : Colors.subtext}
            ios_backgroundColor={Colors.border}
            onValueChange={() => toggleSwitch('promotions')}
            value={settings.promotions}
          />
        </View>
        
        <View style={styles.notificationItem}>
          <View style={styles.iconContainer}>
            <Clock size={22} color={Colors.primary} />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>New Products</Text>
            <Text style={styles.notificationDescription}>
              Get notified when new products are available
            </Text>
          </View>
          <Switch
            trackColor={{ false: Colors.border, true: Colors.lightPrimary }}
            thumbColor={settings.newProducts ? Colors.primary : Colors.subtext}
            ios_backgroundColor={Colors.border}
            onValueChange={() => toggleSwitch('newProducts')}
            value={settings.newProducts}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Notifications</Text>
        
        <View style={styles.notificationItem}>
          <View style={styles.iconContainer}>
            <Info size={22} color={Colors.primary} />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>App Updates</Text>
            <Text style={styles.notificationDescription}>
              Get notified about app updates and new features
            </Text>
          </View>
          <Switch
            trackColor={{ false: Colors.border, true: Colors.lightPrimary }}
            thumbColor={settings.appUpdates ? Colors.primary : Colors.subtext}
            ios_backgroundColor={Colors.border}
            onValueChange={() => toggleSwitch('appUpdates')}
            value={settings.appUpdates}
          />
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.unsubscribeButton}
        onPress={() => {
          // In a real app, this would unsubscribe the user from all notifications
          setSettings({
            orderUpdates: false,
            promotions: false,
            newProducts: false,
            deliveryUpdates: false,
            appUpdates: false,
          });
        }}
      >
        <Text style={styles.unsubscribeText}>Unsubscribe from all notifications</Text>
      </TouchableOpacity>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          You can change your notification preferences at any time.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    padding: Layout.padding,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.subtext,
    lineHeight: 20,
  },
  section: {
    padding: Layout.padding,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '50',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: Colors.subtext,
    lineHeight: 18,
  },
  unsubscribeButton: {
    margin: Layout.padding,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.error,
    alignItems: 'center',
  },
  unsubscribeText: {
    color: Colors.error,
    fontWeight: '500',
  },
  footer: {
    padding: Layout.padding,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'center',
  },
});