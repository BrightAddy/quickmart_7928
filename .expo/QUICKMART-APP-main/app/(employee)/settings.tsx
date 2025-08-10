import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Volume2, 
  Vibrate,
  ChevronRight,
  Info
} from 'lucide-react-native';
import Colors from '@/constants/colors';

type SettingsType = {
  [key: string]: any;
};

export default function SettingsScreen() {
  const [settings, setSettings] = useState<SettingsType>({
    notifications: {
      orderAlerts: true,
      promotions: false,
      systemUpdates: true,
      sound: true,
      vibration: true,
    },
    privacy: {
      shareLocation: true,
      shareEarnings: false,
      profileVisibility: true,
    },
    preferences: {
      darkMode: false,
      language: 'English',
      autoAcceptOrders: false,
    }
  });

  const updateSetting = (category: keyof typeof settings, setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as any),
        [setting]: value
      }
    }));
  };

  const handleLanguagePress = () => {
    Alert.alert(
      'Language Settings',
      'Language selection will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const handleAboutPress = () => {
    Alert.alert(
      'About',
      'Delivery App v1.0.0\nBuilt with React Native\n\n© 2024 Delivery Company',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen 
        options={{ 
          title: 'Settings',
          headerStyle: { backgroundColor: Colors.white },
          headerTintColor: Colors.text,
        }} 
      />

      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <SettingsIcon size={24} color={Colors.primary} />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>App Settings</Text>
          <Text style={styles.headerSubtitle}>Customize your app experience</Text>
        </View>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Bell size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Notifications</Text>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Order Alerts</Text>
            <Text style={styles.settingSubtitle}>Get notified about new delivery requests</Text>
          </View>
          <Switch
            value={settings.notifications.orderAlerts}
            onValueChange={(value) => updateSetting('notifications', 'orderAlerts', value)}
            trackColor={{ false: Colors.lightGray, true: Colors.primary + '30' }}
            thumbColor={settings.notifications.orderAlerts ? Colors.primary : Colors.lightGray}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Promotions</Text>
            <Text style={styles.settingSubtitle}>Receive promotional offers and bonuses</Text>
          </View>
          <Switch
            value={settings.notifications.promotions}
            onValueChange={(value) => updateSetting('notifications', 'promotions', value)}
            trackColor={{ false: Colors.lightGray, true: Colors.primary + '30' }}
            thumbColor={settings.notifications.promotions ? Colors.primary : Colors.lightGray}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>System Updates</Text>
            <Text style={styles.settingSubtitle}>Important app and system notifications</Text>
          </View>
          <Switch
            value={settings.notifications.systemUpdates}
            onValueChange={(value) => updateSetting('notifications', 'systemUpdates', value)}
            trackColor={{ false: Colors.lightGray, true: Colors.primary + '30' }}
            thumbColor={settings.notifications.systemUpdates ? Colors.primary : Colors.lightGray}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Sound</Text>
            <Text style={styles.settingSubtitle}>Play notification sounds</Text>
          </View>
          <Switch
            value={settings.notifications.sound}
            onValueChange={(value) => updateSetting('notifications', 'sound', value)}
            trackColor={{ false: Colors.lightGray, true: Colors.primary + '30' }}
            thumbColor={settings.notifications.sound ? Colors.primary : Colors.lightGray}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Vibration</Text>
            <Text style={styles.settingSubtitle}>Vibrate for notifications</Text>
          </View>
          <Switch
            value={settings.notifications.vibration}
            onValueChange={(value) => updateSetting('notifications', 'vibration', value)}
            trackColor={{ false: Colors.lightGray, true: Colors.primary + '30' }}
            thumbColor={settings.notifications.vibration ? Colors.primary : Colors.lightGray}
          />
        </View>
      </View>

      {/* Privacy Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Shield size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Privacy</Text>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Share Location</Text>
            <Text style={styles.settingSubtitle}>Allow location sharing for deliveries</Text>
          </View>
          <Switch
            value={settings.privacy.shareLocation}
            onValueChange={(value) => updateSetting('privacy', 'shareLocation', value)}
            trackColor={{ false: Colors.lightGray, true: Colors.primary + '30' }}
            thumbColor={settings.privacy.shareLocation ? Colors.primary : Colors.lightGray}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Share Earnings</Text>
            <Text style={styles.settingSubtitle}>Show earnings in leaderboards</Text>
          </View>
          <Switch
            value={settings.privacy.shareEarnings}
            onValueChange={(value) => updateSetting('privacy', 'shareEarnings', value)}
            trackColor={{ false: Colors.lightGray, true: Colors.primary + '30' }}
            thumbColor={settings.privacy.shareEarnings ? Colors.primary : Colors.lightGray}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Profile Visibility</Text>
            <Text style={styles.settingSubtitle}>Make profile visible to customers</Text>
          </View>
          <Switch
            value={settings.privacy.profileVisibility}
            onValueChange={(value) => updateSetting('privacy', 'profileVisibility', value)}
            trackColor={{ false: Colors.lightGray, true: Colors.primary + '30' }}
            thumbColor={settings.privacy.profileVisibility ? Colors.primary : Colors.lightGray}
          />
        </View>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Globe size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Preferences</Text>
        </View>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleLanguagePress}
          activeOpacity={0.7}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Language</Text>
            <Text style={styles.settingSubtitle}>{settings.preferences.language}</Text>
          </View>
          <ChevronRight size={20} color={Colors.subtext} />
        </TouchableOpacity>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Auto Accept Orders</Text>
            <Text style={styles.settingSubtitle}>Automatically accept suitable orders</Text>
          </View>
          <Switch
            value={settings.preferences.autoAcceptOrders}
            onValueChange={(value) => updateSetting('preferences', 'autoAcceptOrders', value)}
            trackColor={{ false: Colors.lightGray, true: Colors.primary + '30' }}
            thumbColor={settings.preferences.autoAcceptOrders ? Colors.primary : Colors.lightGray}
          />
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Info size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>About</Text>
        </View>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleAboutPress}
          activeOpacity={0.7}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>App Information</Text>
            <Text style={styles.settingSubtitle}>Version, terms, and privacy policy</Text>
          </View>
          <ChevronRight size={20} color={Colors.subtext} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Changes are saved automatically
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.lightGray,
  },
  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.subtext,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.subtext,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: Colors.subtext,
    fontStyle: 'italic',
  },
});