import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  User,
  MapPin,
  Smartphone,
  Users,
  Bell,
  Globe,
  HelpCircle,
  BookOpen,
  MessageCircle,
  LogOut,
  ChevronRight,
  Shield,
  Settings,
  Star,
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';

interface MenuItem {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  rightElement?: React.ReactNode;
}

export default function ShopperAccount() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const Colors = getColors(isDarkMode);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState('English');

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)');
          },
        },
      ]
    );
  };

  const profileMenuItems: MenuItem[] = [
    {
      icon: <MapPin size={20} color="#4464EB" />,
      title: 'Delivery Zone',
      subtitle: 'Accra, Osu, East Legon',
      onPress: () => router.push('/delivery-zone'),
      showChevron: true,
    },
    {
      icon: <Smartphone size={20} color="#4CAF50" />,
      title: 'Mobile Money',
      subtitle: 'MTN - *****1234',
      onPress: () => router.push('/mobile-money'),
      showChevron: true,
    },
    {
      icon: <Users size={20} color="#FF9800" />,
      title: 'Next of Kin',
      subtitle: 'Emergency contact info',
      onPress: () => router.push('/next-of-kin'),
      showChevron: true,
    },
  ];

  const appMenuItems: MenuItem[] = [
    {
      icon: <Bell size={20} color="#2196F3" />,
      title: 'Notifications',
      subtitle: 'Push notifications for new batches',
      onPress: () => {},
      rightElement: (
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: Colors.border, true: '#4464EB' }}
          thumbColor={Colors.white}
        />
      ),
    },
    {
      icon: <Globe size={20} color="#9C27B0" />,
      title: 'Language',
      subtitle: language,
      onPress: () => {
        Alert.alert(
          'Select Language',
          'Choose your preferred language',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'English', onPress: () => setLanguage('English') },
            { text: 'Twi', onPress: () => setLanguage('Twi') },
          ]
        );
      },
      showChevron: true,
    },
    {
      icon: <Settings size={20} color="#607D8B" />,
      title: 'App Settings',
      subtitle: 'Theme, privacy, and more',
      onPress: () => router.push('/settings'),
      showChevron: true,
    },
  ];

  const helpMenuItems: MenuItem[] = [
    {
      icon: <BookOpen size={20} color="#4CAF50" />,
      title: 'Training Materials',
      subtitle: 'How to shop, best practices',
      onPress: () => router.push('/training'),
      showChevron: true,
    },
    {
      icon: <HelpCircle size={20} color="#2196F3" />,
      title: 'Help & FAQs',
      subtitle: 'Common questions and answers',
      onPress: () => router.push('/support'),
      showChevron: true,
    },
    {
      icon: <MessageCircle size={20} color="#FF9800" />,
      title: 'Contact Support',
      subtitle: 'Get help from our team',
      onPress: () => {
        Alert.alert(
          'Contact Support',
          'How would you like to contact us?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'WhatsApp', onPress: () => {} },
            { text: 'Email', onPress: () => {} },
          ]
        );
      },
      showChevron: true,
    },
  ];

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.title}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIcon, { backgroundColor: Colors.background }]}>
          {item.icon}
        </View>
        <View style={styles.menuContent}>
          <Text style={[styles.menuTitle, { color: Colors.text }]}>
            {item.title}
          </Text>
          {item.subtitle && (
            <Text style={[styles.menuSubtitle, { color: Colors.subtext }]}>
              {item.subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.menuItemRight}>
        {item.rightElement}
        {item.showChevron && (
          <ChevronRight size={20} color={Colors.subtext} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Account',
        }}
      />
      
      <ScrollView style={[styles.container, { backgroundColor: Colors.background }]}>
        {/* Profile Header */}
        <View style={[styles.profileCard, { backgroundColor: Colors.white }]}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: '#4464EB' }]}>
              <User size={32} color={Colors.white} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: Colors.text }]}>
                {user?.name || 'Shopper Name'}
              </Text>
              <Text style={[styles.profileEmail, { color: Colors.subtext }]}>
                {user?.email || 'shopper@example.com'}
              </Text>
              <View style={styles.profileStats}>
                <View style={styles.statItem}>
                  <Star size={16} color="#FFD700" fill="#FFD700" />
                  <Text style={[styles.statText, { color: Colors.text }]}>4.8</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={[styles.statText, { color: Colors.text }]}>127 orders</Text>
                </View>
              </View>
            </View>
          </View>
          
          {!user?.isVerified && (
            <View style={[styles.verificationBanner, { backgroundColor: '#FFF3CD' }]}>
              <Shield size={16} color="#856404" />
              <Text style={[styles.verificationText, { color: '#856404' }]}>
                Complete verification to unlock all features
              </Text>
              <TouchableOpacity>
                <Text style={[styles.verifyButton, { color: '#856404' }]}>Verify</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Profile Settings */}
        <View style={[styles.menuSection, { backgroundColor: Colors.white }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>Profile</Text>
          {profileMenuItems.map(renderMenuItem)}
        </View>

        {/* App Preferences */}
        <View style={[styles.menuSection, { backgroundColor: Colors.white }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>App Preferences</Text>
          {appMenuItems.map(renderMenuItem)}
        </View>

        {/* Help & Support */}
        <View style={[styles.menuSection, { backgroundColor: Colors.white }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>Help & Support</Text>
          {helpMenuItems.map(renderMenuItem)}
        </View>

        {/* Sign Out */}
        <View style={[styles.menuSection, { backgroundColor: Colors.white }]}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#F44336" />
            <Text style={[styles.logoutText, { color: '#F44336' }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appInfoText, { color: Colors.subtext }]}>
            ShopGH Shopper v1.0.0
          </Text>
          <Text style={[styles.appInfoText, { color: Colors.subtext }]}>
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
  profileCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#E0E0E0',
  },
  verificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  verificationText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  verifyButton: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  menuSection: {
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 4,
  },
  appInfoText: {
    fontSize: 12,
  },
});