import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Image } from 'react-native';
import { Screen } from '../../components/UI';
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
}

export default function EditProfile({ route, navigation }: any) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { profile } = route.params;
  
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    profilePicture: profile.profilePicture
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    
    Alert.alert(
      'Success',
      'Profile updated successfully!',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const handleChangeProfilePicture = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: () => {
          // In a real app, this would open camera
          Alert.alert('Camera', 'Camera functionality would be implemented here');
        }},
        { text: 'Choose from Gallery', onPress: () => {
          // In a real app, this would open image picker
          Alert.alert('Gallery', 'Image picker functionality would be implemented here');
        }}
      ]
    );
  };

  const handleVerifyEmail = () => {
    Alert.alert(
      'Verify Email',
      'We\'ll send a verification link to your email address.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Link', onPress: () => {
          Alert.alert('Link Sent', 'Verification link has been sent to your email.');
        }}
      ]
    );
  };

  const handleVerifyPhone = () => {
    Alert.alert(
      'Verify Phone Number',
      'We\'ll send a verification code to your phone number.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Code', onPress: () => {
          Alert.alert('Code Sent', 'Verification code has been sent to your phone.');
        }}
      ]
    );
  };

  return (
    <Screen style={{ flex: 1 }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.primary }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity 
          style={[styles.saveButton, { opacity: isLoading ? 0.6 : 1 }]} 
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>{isLoading ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Picture Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Profile Picture</Text>
          <View style={styles.profilePictureSection}>
            <TouchableOpacity style={styles.profilePictureContainer} onPress={handleChangeProfilePicture}>
              {formData.profilePicture ? (
                <Image source={{ uri: formData.profilePicture }} style={styles.profilePicture} />
              ) : (
                <View style={[styles.profilePicturePlaceholder, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.profilePictureText, { color: colors.primary }]}>
                    {formData.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={[styles.editPictureBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.editPictureText}>✏️</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.changePictureButton} onPress={handleChangeProfilePicture}>
              <Text style={[styles.changePictureText, { color: colors.primary }]}>Change Picture</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Personal Information</Text>
          
          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.onBackground }]}>Full Name *</Text>
            <TextInput
              style={[styles.textInput, { 
                borderColor: colors.primary + '44', 
                color: colors.onBackground,
                backgroundColor: colors.surface
              }]}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter your full name"
              placeholderTextColor={colors.onSurface + '66'}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <Text style={[styles.inputLabel, { color: colors.onBackground }]}>Email Address *</Text>
              <View style={styles.verificationStatus}>
                <Text style={styles.verificationIcon}>
                  {profile.isEmailVerified ? '✅' : '❌'}
                </Text>
                <Text style={[styles.verificationText, { color: colors.onSurface + '88' }]}>
                  {profile.isEmailVerified ? 'Verified' : 'Not Verified'}
                </Text>
              </View>
            </View>
            <TextInput
              style={[styles.textInput, { 
                borderColor: colors.primary + '44', 
                color: colors.onBackground,
                backgroundColor: colors.surface
              }]}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Enter your email address"
              placeholderTextColor={colors.onSurface + '66'}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {!profile.isEmailVerified && (
              <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyEmail}>
                <Text style={[styles.verifyButtonText, { color: colors.primary }]}>Verify Email</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <Text style={[styles.inputLabel, { color: colors.onBackground }]}>Phone Number *</Text>
              <View style={styles.verificationStatus}>
                <Text style={styles.verificationIcon}>
                  {profile.isPhoneVerified ? '✅' : '❌'}
                </Text>
                <Text style={[styles.verificationText, { color: colors.onSurface + '88' }]}>
                  {profile.isPhoneVerified ? 'Verified' : 'Not Verified'}
                </Text>
              </View>
            </View>
            <TextInput
              style={[styles.textInput, { 
                borderColor: colors.primary + '44', 
                color: colors.onBackground,
                backgroundColor: colors.surface
              }]}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.onSurface + '66'}
              keyboardType="phone-pad"
            />
            {!profile.isPhoneVerified && (
              <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyPhone}>
                <Text style={[styles.verifyButtonText, { color: colors.primary }]}>Verify Phone</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Account Security Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Account Security</Text>
          
          <TouchableOpacity 
            style={[styles.securityItem, { borderColor: colors.primary + '22' }]}
            onPress={() => navigation.navigate('ChangePassword')}
          >
            <View style={styles.securityItemLeft}>
              <Text style={styles.securityIcon}>🔒</Text>
              <View style={styles.securityText}>
                <Text style={[styles.securityTitle, { color: colors.onBackground }]}>Change Password</Text>
                <Text style={[styles.securitySubtitle, { color: colors.onSurface + '88' }]}>Update your account password</Text>
              </View>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.securityItem, { borderColor: colors.primary + '22' }]}
            onPress={() => navigation.navigate('TwoFactorAuth')}
          >
            <View style={styles.securityItemLeft}>
              <Text style={styles.securityIcon}>🔐</Text>
              <View style={styles.securityText}>
                <Text style={[styles.securityTitle, { color: colors.onBackground }]}>Two-Factor Authentication</Text>
                <Text style={[styles.securitySubtitle, { color: colors.onSurface + '88' }]}>Add an extra layer of security</Text>
              </View>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
  },
  saveButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#16a34a',
    fontWeight: '700',
    fontSize: 14,
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  profilePictureSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePicturePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePictureText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  editPictureBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  editPictureText: {
    fontSize: 14,
  },
  changePictureButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  changePictureText: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  verificationText: {
    fontSize: 12,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  verifyButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  verifyButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  securityItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  securityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  securityText: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  securitySubtitle: {
    fontSize: 14,
  },
  arrow: {
    fontSize: 18,
    color: '#9ca3af',
  },
});


