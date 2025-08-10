import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { 
  User, Store, CreditCard, Bell, HelpCircle, LogOut, 
  ChevronRight, Shield, Truck, Clock, MapPin
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';
import { StoreOwner } from '@/types';
import { mockStores } from '@/mocks/stores';

export default function StoreSettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  const styles = createStyles(Colors);
  const storeOwner = user as StoreOwner;
  
  // Get store data
  const store = mockStores.find(s => s.id === storeOwner?.storeId);
  
  // Use the store's logo if available, otherwise use a default QuickMart-style logo
  const logoUri = store?.logo || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200&auto=format&fit=crop';
  
  const handleLogout = () => {
    logout();
    router.replace('/(auth)');
  };
  
  const handlePersonalInfoPress = () => {
    Alert.alert("Personal Information", "Personal information screen will be available soon!");
    // In a real app, you would navigate to the personal info screen
    // router.push('/(store)/personal-info');
  };
  
  const handleStoreDetailsPress = () => {
    Alert.alert("Store Details", "Store details screen will be available soon!");
    // In a real app, you would navigate to the store details screen
    // router.push('/(store)/store-details');
  };
  
  const handlePaymentMethodsPress = () => {
    Alert.alert("Payment Methods", "Payment methods screen will be available soon!");
    // In a real app, you would navigate to the payment methods screen
    // router.push('/(store)/payment-methods');
  };
  
  const handleBusinessHoursPress = () => {
    Alert.alert("Business Hours", "Business hours screen will be available soon!");
    // In a real app, you would navigate to the business hours screen
    // router.push('/(store)/business-hours');
  };
  
  const handleNotificationsPress = () => {
    Alert.alert("Notifications", "Notifications screen will be available soon!");
    // In a real app, you would navigate to the notifications screen
    // router.push('/(store)/notifications');
  };
  
  const handleHelpCenterPress = () => {
    Alert.alert("Help Center", "Help center will be available soon!");
    // In a real app, you would navigate to the help center screen
    // router.push('/(store)/help-center');
  };
  
  const handlePrivacyPolicyPress = () => {
    Alert.alert("Privacy Policy", "Privacy policy will be available soon!");
    // In a real app, you would navigate to the privacy policy screen
    // router.push('/(store)/privacy-policy');
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>{store?.name || storeOwner?.businessName}</Text>
      </View>
      
      <View style={styles.profileSection}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: logoUri }} style={styles.profileImage} />
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{store?.name || storeOwner?.businessName}</Text>
            <Text style={styles.profileEmail}>{storeOwner?.email}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleStoreDetailsPress}
            activeOpacity={0.7}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.storeStatus}>
          <View style={[styles.statusBadge, { backgroundColor: Colors.success + '15' }]}>
            <Text style={[styles.statusText, { color: Colors.success }]}>Open</Text>
          </View>
          
          <View style={styles.storeHours}>
            <Clock size={16} color={Colors.subtext} style={styles.storeHoursIcon} />
            <Text style={styles.storeHoursText}>8:00 AM - 8:00 PM</Text>
          </View>
        </View>
        
        <View style={styles.storeAddress}>
          <MapPin size={16} color={Colors.subtext} style={styles.storeAddressIcon} />
          <Text style={styles.storeAddressText}>{store?.address || "123 Main Street, Accra, Ghana"}</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <View style={styles.settingsCard}>
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={handlePersonalInfoPress}
            activeOpacity={0.7}
          >
            <View style={[styles.settingsIconContainer, { backgroundColor: Colors.primary + '15' }]}>
              <User size={20} color={Colors.primary} />
            </View>
            <Text style={styles.settingsItemText}>Personal Information</Text>
            <ChevronRight size={20} color={Colors.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={handleStoreDetailsPress}
            activeOpacity={0.7}
          >
            <View style={[styles.settingsIconContainer, { backgroundColor: Colors.secondary + '15' }]}>
              <Store size={20} color={Colors.secondary} />
            </View>
            <Text style={styles.settingsItemText}>Store Details</Text>
            <ChevronRight size={20} color={Colors.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={handlePaymentMethodsPress}
            activeOpacity={0.7}
          >
            <View style={[styles.settingsIconContainer, { backgroundColor: Colors.info + '15' }]}>
              <CreditCard size={20} color={Colors.info} />
            </View>
            <Text style={styles.settingsItemText}>Payment Methods</Text>
            <ChevronRight size={20} color={Colors.subtext} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Store Settings</Text>
        
        <View style={styles.settingsCard}>
          <View style={styles.settingsItem}>
            <View style={[styles.settingsIconContainer, { backgroundColor: Colors.success + '15' }]}>
              <Truck size={20} color={Colors.success} />
            </View>
            <View style={styles.settingsItemContent}>
              <Text style={styles.settingsItemText}>Store Availability</Text>
              <Text style={styles.settingsItemDescription}>Allow customers to place orders</Text>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: Colors.border, true: Colors.primary + '70' }}
              thumbColor={true ? Colors.primary : Colors.subtext}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={handleBusinessHoursPress}
            activeOpacity={0.7}
          >
            <View style={[styles.settingsIconContainer, { backgroundColor: Colors.warning + '15' }]}>
              <Clock size={20} color={Colors.warning} />
            </View>
            <View style={styles.settingsItemContent}>
              <Text style={styles.settingsItemText}>Business Hours</Text>
              <Text style={styles.settingsItemDescription}>Set your store's operating hours</Text>
            </View>
            <ChevronRight size={20} color={Colors.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={handleNotificationsPress}
            activeOpacity={0.7}
          >
            <View style={[styles.settingsIconContainer, { backgroundColor: Colors.error + '15' }]}>
              <Bell size={20} color={Colors.error} />
            </View>
            <View style={styles.settingsItemContent}>
              <Text style={styles.settingsItemText}>Notifications</Text>
              <Text style={styles.settingsItemDescription}>Manage notification preferences</Text>
            </View>
            <ChevronRight size={20} color={Colors.subtext} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <View style={styles.settingsCard}>
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={handleHelpCenterPress}
            activeOpacity={0.7}
          >
            <View style={[styles.settingsIconContainer, { backgroundColor: Colors.info + '15' }]}>
              <HelpCircle size={20} color={Colors.info} />
            </View>
            <Text style={styles.settingsItemText}>Help Center</Text>
            <ChevronRight size={20} color={Colors.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={handlePrivacyPolicyPress}
            activeOpacity={0.7}
          >
            <View style={[styles.settingsIconContainer, { backgroundColor: Colors.secondary + '15' }]}>
              <Shield size={20} color={Colors.secondary} />
            </View>
            <Text style={styles.settingsItemText}>Privacy Policy</Text>
            <ChevronRight size={20} color={Colors.subtext} />
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <LogOut size={20} color={Colors.error} style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
      
      <View style={styles.versionInfo}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const createStyles = (Colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.8,
  },
  profileSection: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    margin: 16,
    marginTop: -20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    marginRight: 16,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.subtext,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primary + '15',
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  storeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  storeHours: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeHoursIcon: {
    marginRight: 6,
  },
  storeHoursText: {
    fontSize: 14,
    color: Colors.subtext,
  },
  storeAddress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeAddressIcon: {
    marginRight: 6,
  },
  storeAddressText: {
    fontSize: 14,
    color: Colors.subtext,
    flex: 1,
  },
  section: {
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  settingsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '30',
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingsItemContent: {
    flex: 1,
  },
  settingsItemText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  settingsItemDescription: {
    fontSize: 14,
    color: Colors.subtext,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error + '10',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
  },
  versionInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  versionText: {
    fontSize: 14,
    color: Colors.subtext,
  },
});