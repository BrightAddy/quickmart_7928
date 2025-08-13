import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Dimensions, Alert } from 'react-native';
import { useTheme } from '@/theme/theme';

const ORANGE = '#FF7A00';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Settings() {
  const { colors } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  const handleSettingPress = (setting: string, action: string) => {
    Alert.alert(`${action} ${setting}`, `Opening ${setting.toLowerCase()} settings...`);
  };

  const handleToggle = (setting: string, value: boolean, setter: (value: boolean) => void) => {
    setter(value);
    Alert.alert('Setting Updated', `${setting} has been ${value ? 'enabled' : 'disabled'}`);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => Alert.alert('Logged Out', 'You have been successfully logged out') }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Account Deleted', 'Your account has been permanently deleted') }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.onBackground }]}>Settings</Text>
        <Text style={[styles.headerSubtitle, { color: colors.onSurface + '88' }]}>Manage your store preferences</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Quick Stats */}
        <View style={styles.quickStatsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}>
            <Text style={styles.statIcon}>🏪</Text>
            <Text style={[styles.statValue, { color: colors.onBackground }]}>3</Text>
            <Text style={[styles.statLabel, { color: colors.onSurface + '88' }]}>Active Stores</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}>
            <Text style={styles.statIcon}>👥</Text>
            <Text style={[styles.statValue, { color: colors.onBackground }]}>8</Text>
            <Text style={[styles.statLabel, { color: colors.onSurface + '88' }]}>Staff Members</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}>
            <Text style={styles.statIcon}>🔒</Text>
            <Text style={[styles.statValue, { color: colors.onBackground }]}>100%</Text>
            <Text style={[styles.statLabel, { color: colors.onSurface + '88' }]}>Verified</Text>
          </View>
        </View>

        {/* Store Profile Section */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeader, { color: colors.onBackground }]}>Store Profile</Text>
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}>
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => handleSettingPress('Store Information', 'Edit')}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🏪</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.onBackground }]}>Store Information</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.onSurface + '88' }]}>Name, logo, and basic details</Text>
                </View>
              </View>
              <Text style={styles.settingAction}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => handleSettingPress('Address & Hours', 'Edit')}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>📍</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.onBackground }]}>Address & Hours</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.onSurface + '88' }]}>Location and operating schedule</Text>
                </View>
              </View>
              <Text style={styles.settingAction}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => handleSettingPress('Store Categories', 'Edit')}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🏷️</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.onBackground }]}>Store Categories</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.onSurface + '88' }]}>Product categories and tags</Text>
                </View>
              </View>
              <Text style={styles.settingAction}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Business & Payments Section */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeader, { color: colors.onBackground }]}>Business & Payments</Text>
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}>
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => handleSettingPress('Payment Methods', 'Configure')}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>💳</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.onBackground }]}>Payment Methods</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.onSurface + '88' }]}>MoMo, bank accounts, cards</Text>
                </View>
              </View>
              <Text style={styles.settingAction}>Configure</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => handleSettingPress('Payout Settings', 'Manage')}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>💰</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.onBackground }]}>Payout Settings</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.onSurface + '88' }]}>Withdrawal frequency and limits</Text>
                </View>
              </View>
              <Text style={styles.settingAction}>Manage</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => handleSettingPress('Tax Settings', 'Configure')}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🧾</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.onBackground }]}>Tax Settings</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.onSurface + '88' }]}>VAT, tax rates, and exemptions</Text>
                </View>
              </View>
              <Text style={styles.settingAction}>Configure</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => handleSettingPress('Transaction History', 'View')}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>📊</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.onBackground }]}>Transaction History</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.onSurface + '88' }]}>All payment and payout records</Text>
                </View>
              </View>
              <Text style={styles.settingAction}>View</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Staff & Security Section */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeader, { color: colors.onBackground }]}>Staff & Security</Text>
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}>
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => handleSettingPress('Staff Management', 'Manage')}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>👥</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.onBackground }]}>Staff Management</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.onSurface + '88' }]}>Add, remove, and manage staff</Text>
                </View>
              </View>
              <Text style={styles.settingAction}>Manage</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => handleSettingPress('Role Permissions', 'Configure')}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🔐</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.onBackground }]}>Role Permissions</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.onSurface + '88' }]}>Access control and permissions</Text>
                </View>
              </View>
              <Text style={styles.settingAction}>Configure</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => handleSettingPress('Activity Log', 'View')}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>📝</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.onBackground }]}>Activity Log</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.onSurface + '88' }]}>Staff actions and system logs</Text>
                </View>
              </View>
              <Text style={styles.settingAction}>View</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => handleSettingPress('Two-Factor Auth', 'Setup')}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🔒</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.onBackground }]}>Two-Factor Authentication</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.onSurface + '88' }]}>Enhanced account security</Text>
                </View>
              </View>
              <Text style={styles.settingAction}>Setup</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences & Notifications Section */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeader, { color: colors.onBackground }]}>Preferences & Notifications</Text>
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🔔</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.onBackground }]}>Push Notifications</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.onSurface + '88' }]}>Order updates and alerts</Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={(value) => handleToggle('Push Notifications', value, setNotificationsEnabled)}
                trackColor={{ false: '#767577', true: ORANGE }}
                thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🌙</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.onBackground }]}>Dark Mode</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.onSurface + '88' }]}>Switch to dark theme</Text>
                </View>
              </View>
              <Switch
                value={darkModeEnabled}
                onValueChange={(value) => handleToggle('Dark Mode', value, setDarkModeEnabled)}
                trackColor={{ false: '#767577', true: ORANGE }}
                thumbColor={darkModeEnabled ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>💾</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.onBackground }]}>Auto Backup</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.onSurface + '88' }]}>Automatic data backup</Text>
                </View>
              </View>
              <Switch
                value={autoBackupEnabled}
                onValueChange={(value) => handleToggle('Auto Backup', value, setAutoBackupEnabled)}
                trackColor={{ false: '#767577', true: ORANGE }}
                thumbColor={autoBackupEnabled ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>📈</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.onBackground }]}>Analytics & Insights</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.onSurface + '88' }]}>Performance tracking</Text>
                </View>
              </View>
              <Switch
                value={analyticsEnabled}
                onValueChange={(value) => handleToggle('Analytics', value, setAnalyticsEnabled)}
                trackColor={{ false: '#767577', true: ORANGE }}
                thumbColor={analyticsEnabled ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* Advanced Settings Section */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeader, { color: colors.onBackground }]}>Advanced Settings</Text>
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}>
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => handleSettingPress('API Integration', 'Configure')}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🔌</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.onBackground }]}>API Integration</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.onSurface + '88' }]}>Connect with external services</Text>
                </View>
              </View>
              <Text style={styles.settingAction}>Configure</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => handleSettingPress('Data Export', 'Export')}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>📤</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.onBackground }]}>Data Export</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.onSurface + '88' }]}>Export store data and reports</Text>
                </View>
              </View>
              <Text style={styles.settingAction}>Export</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => handleSettingPress('Language & Region', 'Change')}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🌍</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.onBackground }]}>Language & Region</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.onSurface + '88' }]}>App language and currency</Text>
                </View>
              </View>
              <Text style={styles.settingAction}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support & Help Section */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeader, { color: colors.onBackground }]}>Support & Help</Text>
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}>
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => handleSettingPress('Help Center', 'Open')}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>❓</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.onBackground }]}>Help Center</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.onSurface + '88' }]}>FAQs and tutorials</Text>
                </View>
              </View>
              <Text style={styles.settingAction}>Open</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => handleSettingPress('Contact Support', 'Contact')}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>📞</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.onBackground }]}>Contact Support</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.onSurface + '88' }]}>Get help from our team</Text>
                </View>
              </View>
              <Text style={styles.settingAction}>Contact</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => handleSettingPress('Feedback', 'Send')}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>💬</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.onBackground }]}>Send Feedback</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.onSurface + '88' }]}>Help us improve the app</Text>
                </View>
              </View>
              <Text style={styles.settingAction}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Actions Section */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeader, { color: colors.onBackground }]}>Account Actions</Text>
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}>
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => handleSettingPress('Change Password', 'Change')}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🔑</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.onBackground }]}>Change Password</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.onSurface + '88' }]}>Update your login password</Text>
                </View>
              </View>
              <Text style={styles.settingAction}>Change</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => handleSettingPress('Privacy Policy', 'View')}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>📋</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.onBackground }]}>Privacy Policy</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.onSurface + '88' }]}>Data protection and privacy</Text>
                </View>
              </View>
              <Text style={styles.settingAction}>View</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => handleSettingPress('Terms of Service', 'View')}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>📜</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.onBackground }]}>Terms of Service</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.onSurface + '88' }]}>App usage terms and conditions</Text>
                </View>
              </View>
              <Text style={styles.settingAction}>View</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeader, { color: '#DC2626' }]}>Danger Zone</Text>
          <View style={[styles.dangerSection, { backgroundColor: '#FEF2F2', borderColor: '#DC2626' }]}>
            <TouchableOpacity 
              style={styles.dangerRow}
              onPress={handleLogout}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🚪</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: '#DC2626' }]}>Logout</Text>
                  <Text style={[styles.settingSubtitle, { color: '#DC2626' + '88' }]}>Sign out of your account</Text>
                </View>
              </View>
              <Text style={[styles.settingAction, { color: '#DC2626' }]}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dangerRow}
              onPress={handleDeleteAccount}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🗑️</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: '#DC2626' }]}>Delete Account</Text>
                  <Text style={[styles.settingSubtitle, { color: '#DC2626' + '88' }]}>Permanently delete your account</Text>
                </View>
              </View>
              <Text style={[styles.settingAction, { color: '#DC2626' }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Version Info */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.onSurface + '66' }]}>QuickMart Store Owner v2.1.0</Text>
          <Text style={[styles.versionText, { color: colors.onSurface + '66' }]}>© 2025 QuickMart. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    paddingTop: Math.max(50, screenHeight * 0.06),
    paddingBottom: Math.max(20, screenHeight * 0.025),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: Math.max(28, screenWidth * 0.07),
    fontWeight: 'bold',
    marginBottom: Math.max(4, screenHeight * 0.005),
  },
  headerSubtitle: {
    fontSize: Math.max(16, screenWidth * 0.04),
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Math.max(32, screenHeight * 0.04),
  },
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    paddingVertical: Math.max(20, screenHeight * 0.025),
    gap: Math.max(12, screenWidth * 0.03),
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Math.max(16, screenHeight * 0.02),
    paddingHorizontal: Math.max(12, screenWidth * 0.03),
    borderRadius: Math.max(12, screenWidth * 0.03),
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: Math.max(24, screenWidth * 0.06),
    marginBottom: Math.max(8, screenHeight * 0.01),
  },
  statValue: {
    fontSize: Math.max(18, screenWidth * 0.045),
    fontWeight: 'bold',
    marginBottom: Math.max(4, screenHeight * 0.005),
  },
  statLabel: {
    fontSize: Math.max(12, screenWidth * 0.03),
    textAlign: 'center',
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: Math.max(24, screenHeight * 0.03),
  },
  sectionHeader: {
    fontSize: Math.max(18, screenWidth * 0.045),
    fontWeight: '700',
    marginBottom: Math.max(12, screenHeight * 0.015),
    marginHorizontal: Math.max(16, screenWidth * 0.04),
  },
  section: {
    marginHorizontal: Math.max(16, screenWidth * 0.04),
    borderRadius: Math.max(16, screenWidth * 0.04),
    borderWidth: 1,
    padding: Math.max(16, screenWidth * 0.04),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Math.max(16, screenHeight * 0.02),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dangerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Math.max(16, screenHeight * 0.02),
    borderBottomWidth: 1,
    borderBottomColor: '#FEE2E2',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: Math.max(24, screenWidth * 0.06),
    marginRight: Math.max(16, screenWidth * 0.04),
    width: Math.max(32, screenWidth * 0.08),
    textAlign: 'center',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: Math.max(16, screenWidth * 0.04),
    fontWeight: '600',
    marginBottom: Math.max(4, screenHeight * 0.005),
  },
  settingSubtitle: {
    fontSize: Math.max(14, screenWidth * 0.035),
    fontWeight: '400',
    lineHeight: Math.max(18, screenHeight * 0.022),
  },
  settingAction: {
    fontSize: Math.max(14, screenWidth * 0.035),
    fontWeight: '600',
    color: ORANGE,
    paddingHorizontal: Math.max(12, screenWidth * 0.03),
    paddingVertical: Math.max(6, screenHeight * 0.008),
    borderRadius: Math.max(8, screenWidth * 0.02),
    backgroundColor: ORANGE + '15',
  },
  dangerSection: {
    marginHorizontal: Math.max(16, screenWidth * 0.04),
    borderRadius: Math.max(16, screenWidth * 0.04),
    borderWidth: 1,
    padding: Math.max(16, screenWidth * 0.04),
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: Math.max(32, screenHeight * 0.04),
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
  },
  versionText: {
    fontSize: Math.max(12, screenWidth * 0.03),
    fontWeight: '400',
    marginBottom: Math.max(4, screenHeight * 0.005),
  },
});


