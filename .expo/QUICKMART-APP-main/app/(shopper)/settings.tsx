import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  Bell,
  Moon,
  Shield,
  FileText,
  Info,
  ChevronRight,
  Globe,
  Volume2,
  Vibrate,
  Eye,
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

interface SettingItem {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  type: 'toggle' | 'navigation' | 'info';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function Settings() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const Colors = getColors(isDarkMode);
  
  const [notifications, setNotifications] = useState({
    newBatches: true,
    orderUpdates: true,
    earnings: true,
    promotions: false,
  });
  
  const [privacy, setPrivacy] = useState({
    shareLocation: true,
    analytics: true,
    crashReports: true,
  });

  const [sounds, setSounds] = useState({
    soundEnabled: true,
    vibrationEnabled: true,
  });

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open link');
    });
  };

  const notificationSettings: SettingItem[] = [
    {
      icon: <Bell size={20} color="#4464EB" />,
      title: 'New Batch Notifications',
      subtitle: 'Get notified when new batches are available',
      type: 'toggle',
      value: notifications.newBatches,
      onToggle: (value) => setNotifications(prev => ({ ...prev, newBatches: value })),
    },
    {
      icon: <Bell size={20} color="#4CAF50" />,
      title: 'Order Updates',
      subtitle: 'Notifications about your active orders',
      type: 'toggle',
      value: notifications.orderUpdates,
      onToggle: (value) => setNotifications(prev => ({ ...prev, orderUpdates: value })),
    },
    {
      icon: <Bell size={20} color="#FF9800" />,
      title: 'Earnings Notifications',
      subtitle: 'Daily earnings and payout notifications',
      type: 'toggle',
      value: notifications.earnings,
      onToggle: (value) => setNotifications(prev => ({ ...prev, earnings: value })),
    },
    {
      icon: <Bell size={20} color="#9C27B0" />,
      title: 'Promotions & Tips',
      subtitle: 'Special offers and shopper tips',
      type: 'toggle',
      value: notifications.promotions,
      onToggle: (value) => setNotifications(prev => ({ ...prev, promotions: value })),
    },
  ];

  const soundSettings: SettingItem[] = [
    {
      icon: <Volume2 size={20} color="#2196F3" />,
      title: 'Sound Effects',
      subtitle: 'Play sounds for notifications',
      type: 'toggle',
      value: sounds.soundEnabled,
      onToggle: (value) => setSounds(prev => ({ ...prev, soundEnabled: value })),
    },
    {
      icon: <Vibrate size={20} color="#FF5722" />,
      title: 'Vibration',
      subtitle: 'Vibrate for important notifications',
      type: 'toggle',
      value: sounds.vibrationEnabled,
      onToggle: (value) => setSounds(prev => ({ ...prev, vibrationEnabled: value })),
    },
  ];

  const privacySettings: SettingItem[] = [
    {
      icon: <Shield size={20} color="#4CAF50" />,
      title: 'Share Location',
      subtitle: 'Allow location sharing for better batch matching',
      type: 'toggle',
      value: privacy.shareLocation,
      onToggle: (value) => setPrivacy(prev => ({ ...prev, shareLocation: value })),
    },
    {
      icon: <Eye size={20} color="#FF9800" />,
      title: 'Usage Analytics',
      subtitle: 'Help improve the app by sharing usage data',
      type: 'toggle',
      value: privacy.analytics,
      onToggle: (value) => setPrivacy(prev => ({ ...prev, analytics: value })),
    },
    {
      icon: <FileText size={20} color="#2196F3" />,
      title: 'Crash Reports',
      subtitle: 'Automatically send crash reports to help fix bugs',
      type: 'toggle',
      value: privacy.crashReports,
      onToggle: (value) => setPrivacy(prev => ({ ...prev, crashReports: value })),
    },
  ];

  const appSettings: SettingItem[] = [
    {
      icon: <Moon size={20} color="#6B46C1" />,
      title: 'Dark Mode',
      subtitle: isDarkMode ? 'Dark theme enabled' : 'Light theme enabled',
      type: 'toggle',
      value: isDarkMode,
      onToggle: toggleTheme,
    },
    {
      icon: <Globe size={20} color="#10B981" />,
      title: 'Language',
      subtitle: 'English',
      type: 'navigation',
      onPress: () => {
        Alert.alert(
          'Select Language',
          'Choose your preferred language',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'English' },
            { text: 'Twi' },
          ]
        );
      },
    },
  ];

  const aboutSettings: SettingItem[] = [
    {
      icon: <FileText size={20} color="#6B7280" />,
      title: 'Terms of Service',
      subtitle: 'Read our terms and conditions',
      type: 'navigation',
      onPress: () => handleOpenLink('https://shopgh.com/terms'),
    },
    {
      icon: <Shield size={20} color="#6B7280" />,
      title: 'Privacy Policy',
      subtitle: 'How we handle your data',
      type: 'navigation',
      onPress: () => handleOpenLink('https://shopgh.com/privacy'),
    },
    {
      icon: <FileText size={20} color="#6B7280" />,
      title: 'End User License Agreement',
      subtitle: 'Software license terms',
      type: 'navigation',
      onPress: () => handleOpenLink('https://shopgh.com/eula'),
    },
    {
      icon: <Info size={20} color="#6B7280" />,
      title: 'App Information',
      subtitle: 'Version 1.0.0 • Build 100',
      type: 'info',
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.title}
      style={styles.settingItem}
      onPress={item.onPress}
      disabled={item.type === 'info' || item.type === 'toggle'}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: Colors.background }]}>
          {item.icon}
        </View>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: Colors.text }]}>
            {item.title}
          </Text>
          {item.subtitle && (
            <Text style={[styles.settingSubtitle, { color: Colors.subtext }]}>
              {item.subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.settingRight}>
        {item.type === 'toggle' && (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: Colors.border, true: '#4464EB' }}
            thumbColor={Colors.white}
          />
        )}
        {item.type === 'navigation' && (
          <ChevronRight size={20} color={Colors.subtext} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerStyle: {
            backgroundColor: Colors.white,
          },
          headerTintColor: Colors.text,
        }}
      />
      
      <ScrollView style={[styles.container, { backgroundColor: Colors.background }]}>
        {/* Notifications */}
        <View style={[styles.settingSection, { backgroundColor: Colors.white }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>
            Notifications
          </Text>
          {notificationSettings.map(renderSettingItem)}
        </View>

        {/* Sound & Vibration */}
        <View style={[styles.settingSection, { backgroundColor: Colors.white }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>
            Sound & Vibration
          </Text>
          {soundSettings.map(renderSettingItem)}
        </View>

        {/* Privacy */}
        <View style={[styles.settingSection, { backgroundColor: Colors.white }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>
            Privacy & Data
          </Text>
          {privacySettings.map(renderSettingItem)}
        </View>

        {/* App Preferences */}
        <View style={[styles.settingSection, { backgroundColor: Colors.white }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>
            App Preferences
          </Text>
          {appSettings.map(renderSettingItem)}
        </View>

        {/* About */}
        <View style={[styles.settingSection, { backgroundColor: Colors.white }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>
            About
          </Text>
          {aboutSettings.map(renderSettingItem)}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: Colors.subtext }]}>
            ShopGH Shopper
          </Text>
          <Text style={[styles.footerText, { color: Colors.subtext }]}>
            Made with <Text>❤️</Text> in Ghana
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  settingSection: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    padding: 20,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
  },
});