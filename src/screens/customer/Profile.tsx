import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Screen, FloatingChatbotButton, ChatbotModal, KenteAccent } from '../../components/UI';
import { useTheme } from '../../theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePicture: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  addresses: Address[];
  defaultAddressId: string | null;
}

interface Address {
  id: string;
  name: string;
  address: string;
  isDefault: boolean;
}

export default function Profile({ navigation }: any) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    name: 'Kwame Asante',
    email: 'kwame.asante@example.com',
    phone: '+233 24 123 4567',
    profilePicture: null,
    isEmailVerified: true,
    isPhoneVerified: false,
    addresses: [
      {
        id: '1',
        name: 'Home',
        address: 'House 10, Road 5, Block J, Baridhara, Dhaka, 1212',
        isDefault: true
      },
      {
        id: '2',
        name: 'Office',
        address: 'Apartment B3, House 25, Road 10, Banani, Dhaka, 1213',
        isDefault: false
      }
    ],
    defaultAddressId: '1'
  });

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { profile: userProfile });
  };

  const handleManageAddresses = () => {
    navigation.navigate('ManageAddresses', { addresses: userProfile.addresses });
  };

  const handleVerifyPhone = () => {
    Alert.alert(
      'Verify Phone Number',
      'We\'ll send a verification code to your phone number.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Code', onPress: () => {
          // In a real app, this would send verification code
          Alert.alert('Code Sent', 'Verification code has been sent to your phone.');
        }}
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {
          // In a real app, this would clear user session
          navigation.replace('UserRoleSelection');
        }}
      ]
    );
  };

  const ProfileSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>{title}</Text>
      {children}
    </View>
  );

  const ProfileItem = ({ 
    title, 
    subtitle, 
    icon, 
    onPress, 
    showArrow = true,
    badge,
    badgeColor = colors.primary 
  }: {
    title: string;
    subtitle?: string;
    icon: string;
    onPress?: () => void;
    showArrow?: boolean;
    badge?: string;
    badgeColor?: string;
  }) => (
    <TouchableOpacity 
      style={[styles.profileItem, { borderColor: colors.primary + '22' }]} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.profileItemLeft}>
        <Text style={styles.profileItemIcon}>{icon}</Text>
        <View style={styles.profileItemText}>
          <Text style={[styles.profileItemTitle, { color: colors.onBackground }]}>{title}</Text>
          {subtitle && <Text style={[styles.profileItemSubtitle, { color: colors.onSurface + '88' }]}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.profileItemRight}>
        {badge && (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        {showArrow && <Text style={styles.arrow}>›</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <Screen style={{ flex: 1, paddingTop: Math.max(12, insets.top), paddingBottom: Math.max(12, insets.bottom) }}>
      <KenteAccent style={{ top: 10, right: 10 }} animated />
      
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: Math.max(24, insets.bottom + 24) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: colors.primary }]}>
          <View style={styles.profileInfo}>
            <TouchableOpacity style={styles.profilePictureContainer} onPress={handleEditProfile}>
              {userProfile.profilePicture ? (
                <Image source={{ uri: userProfile.profilePicture }} style={styles.profilePicture} />
              ) : (
                <View style={[styles.profilePicturePlaceholder, { backgroundColor: colors.onPrimary + '20' }]}>
                  <Text style={[styles.profilePictureText, { color: colors.onPrimary }]}>
                    {userProfile.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={[styles.editPictureBadge, { backgroundColor: colors.onPrimary }]}>
                <Text style={[styles.editPictureText, { color: colors.primary }]}>✏️</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.profileDetails}>
              <Text style={[styles.profileName, { color: colors.onPrimary }]}>{userProfile.name}</Text>
              <Text style={[styles.profileEmail, { color: colors.onPrimary + 'CC' }]}>{userProfile.email}</Text>
              <View style={styles.verificationStatus}>
                <View style={styles.verificationItem}>
                  <Text style={styles.verificationIcon}>
                    {userProfile.isEmailVerified ? '✅' : '❌'}
                  </Text>
                  <Text style={[styles.verificationText, { color: colors.onPrimary + 'CC' }]}>
                    Email {userProfile.isEmailVerified ? 'Verified' : 'Not Verified'}
                  </Text>
                </View>
                <View style={styles.verificationItem}>
                  <Text style={styles.verificationIcon}>
                    {userProfile.isPhoneVerified ? '✅' : '❌'}
                  </Text>
                  <Text style={[styles.verificationText, { color: colors.onPrimary + 'CC' }]}>
                    Phone {userProfile.isPhoneVerified ? 'Verified' : 'Not Verified'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editProfileBtn} onPress={handleEditProfile}>
            <Text style={[styles.editProfileText, { color: colors.primary }]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Sections */}
        <View style={{ padding: 16 }}>
          {/* Account Management */}
          <ProfileSection title="Account Management">
            <ProfileItem
              title="Personal Information"
              subtitle="Name, email, phone number"
              icon="👤"
              onPress={handleEditProfile}
            />
            <ProfileItem
              title="Addresses"
              subtitle={`${userProfile.addresses.length} saved addresses`}
              icon="📍"
              onPress={handleManageAddresses}
              badge={userProfile.addresses.length.toString()}
            />
            <ProfileItem
              title="Payment Methods"
              subtitle="Cards, mobile money"
              icon="💳"
              onPress={() => navigation.navigate('PaymentMethods')}
            />
            <ProfileItem
              title="Security Settings"
              subtitle="Password, 2FA, privacy"
              icon="🔒"
              onPress={() => navigation.navigate('SecuritySettings')}
            />
          </ProfileSection>

          {/* Orders & Shopping */}
          <ProfileSection title="Orders & Shopping">
            <ProfileItem
              title="Order History"
              subtitle="View all your orders"
              icon="📦"
              onPress={() => navigation.navigate('CustomerTabs', { screen: 'Orders' })}
            />
            <ProfileItem
              title="Loyalty Points"
              subtitle="Earn and redeem rewards"
              icon="⭐"
              onPress={() => navigation.navigate('LoyaltyPoints')}
              badge="1,250"
            />
            <ProfileItem
              title="Favorite Stores"
              subtitle="Your preferred shops"
              icon="❤️"
              onPress={() => navigation.navigate('FavoriteStores')}
            />
            <ProfileItem
              title="Shopping Lists"
              subtitle="Save items for later"
              icon="📝"
              onPress={() => navigation.navigate('ShoppingLists')}
            />
            <ProfileItem
              title="Recently Viewed"
              subtitle="Products you've browsed"
              icon="👁️"
              onPress={() => navigation.navigate('RecentlyViewed')}
            />
          </ProfileSection>

          {/* Support & Settings */}
          <ProfileSection title="Support & Settings">
            <ProfileItem
              title="Preferences"
              subtitle="Language, notifications, theme"
              icon="⚙️"
              onPress={() => navigation.navigate('UserPreferences')}
            />
            <ProfileItem
              title="Help Center"
              subtitle="Get help and support"
              icon="❓"
              onPress={() => navigation.navigate('HelpCenter')}
            />
            <ProfileItem
              title="Referral Program"
              subtitle="Earn rewards by referring friends"
              icon="🎁"
              onPress={() => navigation.navigate('Referral')}
            />
            <ProfileItem
              title="Notifications"
              subtitle="Manage your notifications"
              icon="🔔"
              onPress={() => navigation.navigate('Notifications')}
            />
          </ProfileSection>

          {/* Account Actions */}
          <ProfileSection title="Account Actions">
            <ProfileItem
              title="Logout"
              subtitle="Sign out of your account"
              icon="🚪"
              onPress={handleLogout}
              showArrow={false}
            />
          </ProfileSection>
        </View>
      </ScrollView>

      <FloatingChatbotButton onPress={() => setChatbotVisible(true)} />
      <ChatbotModal visible={chatbotVisible} onClose={() => setChatbotVisible(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profilePictureContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profilePicturePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePictureText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  editPictureBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  editPictureText: {
    fontSize: 12,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    marginBottom: 8,
  },
  verificationStatus: {
    gap: 4,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  verificationText: {
    fontSize: 12,
  },
  editProfileBtn: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileItemIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  profileItemText: {
    flex: 1,
  },
  profileItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  profileItemSubtitle: {
    fontSize: 14,
  },
  profileItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  arrow: {
    fontSize: 18,
    color: '#9ca3af',
  },
});


