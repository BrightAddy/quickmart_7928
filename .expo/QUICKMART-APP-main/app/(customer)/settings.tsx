import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Settings, Globe, Moon, Lock, Eye, Bell, HelpCircle, Trash } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Layout from '@/constants/layout';
import { useAuthStore } from '@/store/auth-store';

export default function SettingsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  // Settings state
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [biometricLogin, setBiometricLogin] = useState(false);
  const [showOrderAmount, setShowOrderAmount] = useState(true);
  
  const handleLanguagePress = () => {
    Alert.alert(
      "Select Language",
      "Choose your preferred language",
      [
        { text: "English", onPress: () => setLanguage("English") },
        { text: "French", onPress: () => setLanguage("French") },
        { text: "Spanish", onPress: () => setLanguage("Spanish") },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };
  
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Account Deletion Request",
              "Your account deletion request has been submitted. Our team will process it within 24 hours.",
              [{ text: "OK" }]
            );
          }
        }
      ]
    );
  };
  
  const handleNotificationsPress = () => {
    router.push('/(customer)/notifications');
  };
  
  const handleHelpPress = () => {
    Alert.alert(
      "Help & Support",
      "For any assistance, please contact our support team at support@quickmart.com or call +1-800-QUICKMART.",
      [{ text: "OK" }]
    );
  };
  
  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>
          Customize your app experience
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.iconContainer}>
            <Moon size={22} color={Colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Dark Mode</Text>
            <Text style={styles.settingDescription}>
              Switch between light and dark themes
            </Text>
          </View>
          <Switch
            trackColor={{ false: Colors.border, true: Colors.lightPrimary }}
            thumbColor={darkMode ? Colors.primary : Colors.subtext}
            ios_backgroundColor={Colors.border}
            onValueChange={() => setDarkMode(!darkMode)}
            value={darkMode}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={handleLanguagePress}
        >
          <View style={styles.iconContainer}>
            <Globe size={22} color={Colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Language</Text>
            <Text style={styles.settingDescription}>
              {language}
            </Text>
          </View>
          <Text style={styles.settingAction}>Change</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.iconContainer}>
            <Lock size={22} color={Colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Biometric Login</Text>
            <Text style={styles.settingDescription}>
              Use Face ID or Touch ID to login
            </Text>
          </View>
          <Switch
            trackColor={{ false: Colors.border, true: Colors.lightPrimary }}
            thumbColor={biometricLogin ? Colors.primary : Colors.subtext}
            ios_backgroundColor={Colors.border}
            onValueChange={() => setBiometricLogin(!biometricLogin)}
            value={biometricLogin}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.iconContainer}>
            <Eye size={22} color={Colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Show Order Amount</Text>
            <Text style={styles.settingDescription}>
              Display order amounts in order history
            </Text>
          </View>
          <Switch
            trackColor={{ false: Colors.border, true: Colors.lightPrimary }}
            thumbColor={showOrderAmount ? Colors.primary : Colors.subtext}
            ios_backgroundColor={Colors.border}
            onValueChange={() => setShowOrderAmount(!showOrderAmount)}
            value={showOrderAmount}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={handleNotificationsPress}
        >
          <View style={styles.iconContainer}>
            <Bell size={22} color={Colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Notifications</Text>
            <Text style={styles.settingDescription}>
              Manage notification preferences
            </Text>
          </View>
          <Text style={styles.settingAction}>Manage</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={handleHelpPress}
        >
          <View style={styles.iconContainer}>
            <HelpCircle size={22} color={Colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Help & Support</Text>
            <Text style={styles.settingDescription}>
              Get help with your account or orders
            </Text>
          </View>
          <Text style={styles.settingAction}>Contact</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity 
          style={styles.dangerItem}
          onPress={handleDeleteAccount}
        >
          <View style={styles.dangerIconContainer}>
            <Trash size={22} color={Colors.error} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.dangerTitle}>Delete Account</Text>
            <Text style={styles.settingDescription}>
              Permanently delete your account and data
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          QuickMart v1.0.0
        </Text>
        <Text style={styles.footerSubtext}>
          Account: {user?.email}
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
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
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.subtext,
    lineHeight: 18,
  },
  settingAction: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  dangerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.error + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.error,
    marginBottom: 4,
  },
  footer: {
    padding: Layout.padding,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: Colors.subtext,
  },
});