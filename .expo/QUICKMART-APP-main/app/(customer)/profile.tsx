import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, useWindowDimensions, Modal, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogOut, MapPin, CreditCard, Settings, ChevronRight, ShoppingBag, Bell, Plus, Edit, Trash, Mail, Phone, Globe, Heart, Shield, Truck, Lock, Eye, HelpCircle, Info, Tag, Clock, CheckCircle, User, Camera } from 'lucide-react-native';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { getColors } from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';
import Layout from '@/constants/layout';
import { useAuthStore } from '@/store/auth-store';
import { Customer, Address, PaymentMethod } from '@/types';

// Edit Profile Form Component
interface EditProfileFormProps {
  user: Customer;
  onSave: (userData: Partial<Customer>) => void;
  onCancel: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ user, onSave, onCancel }) => {
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  const styles = createStyles(Colors);
  
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  
  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    // Basic phone validation
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    
    onSave({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      avatar: avatar || user.avatar
    });
  };
  
  const handleChangeProfilePicture = () => {
    Alert.alert(
      "Change Profile Picture",
      "Choose how you want to update your profile picture",
      [
        {
          text: "Use Default",
          onPress: () => setAvatar('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop')
        },
        {
          text: "Business Person",
          onPress: () => setAvatar('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop')
        },
        {
          text: "Professional",
          onPress: () => setAvatar('https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=200&auto=format&fit=crop')
        },
        {
          text: "Casual",
          onPress: () => setAvatar('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop')
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };
  
  return (
    <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.formTitle}>Edit Profile</Text>
      
      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={handleChangeProfilePicture} style={styles.avatarContainer}>
          <Image 
            source={{ 
              uri: avatar || user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' 
            }} 
            style={styles.editAvatar}
          />
          <View style={styles.avatarOverlay}>
            <Camera size={20} color={Colors.white} />
          </View>
        </TouchableOpacity>
        <Text style={styles.avatarLabel}>Tap to change profile picture</Text>
      </View>
      
      <Input
        label="Full Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter your full name"
        autoCapitalize="words"
        leftIcon={<User size={20} color={Colors.primary} />}
      />
      
      <Input
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email address"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon={<Mail size={20} color={Colors.primary} />}
      />
      
      <Input
        label="Phone Number"
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        leftIcon={<Phone size={20} color={Colors.primary} />}
      />
      
      <View style={styles.profileNote}>
        <Info size={16} color={Colors.info} />
        <Text style={styles.profileNoteText}>
          Your profile information will be used for order delivery and communication purposes.
        </Text>
      </View>
      
      <View style={styles.formButtons}>
        <Button
          title="Cancel"
          onPress={onCancel}
          variant="outline"
          style={styles.formButton}
        />
        <Button
          title="Save Changes"
          onPress={handleSave}
          style={styles.formButton}
        />
      </View>
    </ScrollView>
  );
};

// Address Form Component
interface AddressFormProps {
  address: Address | null;
  onSave: (address: Address) => void;
  onCancel: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ address, onSave, onCancel }) => {
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  const styles = createStyles(Colors);
  
  const [name, setName] = useState(address?.name || '');
  const [addressText, setAddressText] = useState(address?.address || '');
  const [details, setDetails] = useState(address?.details || '');
  const [isDefault, setIsDefault] = useState(address?.isDefault || false);
  
  const handleSave = () => {
    if (!name.trim() || !addressText.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    onSave({
      id: address?.id || `addr_${Date.now()}`,
      name,
      address: addressText,
      details,
      latitude: address?.latitude || 0,
      longitude: address?.longitude || 0,
      isDefault
    });
  };
  
  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>
        {address ? 'Edit Address' : 'Add New Address'}
      </Text>
      
      <Input
        label="Address Name (e.g. Home, Work)"
        value={name}
        onChangeText={setName}
        placeholder="Enter address name"
      />
      
      <Input
        label="Address"
        value={addressText}
        onChangeText={setAddressText}
        placeholder="Enter full address"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        style={{ height: 80 }}
      />
      
      <Input
        label="Additional Details (Optional)"
        value={details}
        onChangeText={setDetails}
        placeholder="Apartment number, floor, landmark, etc."
      />
      
      <TouchableOpacity 
        style={styles.checkboxContainer}
        onPress={() => setIsDefault(!isDefault)}
      >
        <View style={[styles.checkbox, isDefault && styles.checkboxChecked]}>
          {isDefault && <View style={styles.checkboxInner} />}
        </View>
        <Text style={styles.checkboxLabel}>Set as default address</Text>
      </TouchableOpacity>
      
      <View style={styles.formButtons}>
        <Button
          title="Cancel"
          onPress={onCancel}
          variant="outline"
          style={styles.formButton}
        />
        <Button
          title="Save"
          onPress={handleSave}
          style={styles.formButton}
        />
      </View>
    </View>
  );
};

// Payment Method Form Component
interface PaymentFormProps {
  payment: PaymentMethod | null;
  onSave: (payment: PaymentMethod) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ payment, onSave, onCancel }) => {
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  const styles = createStyles(Colors);
  
  const [name, setName] = useState(payment?.name || '');
  const [type, setType] = useState<'momo' | 'card'>(payment?.type || 'momo');
  const [isDefault, setIsDefault] = useState(payment?.isDefault || false);
  
  // Mobile Money fields
  const [momoNumber, setMomoNumber] = useState(payment?.type === 'momo' ? payment.details.split('|')[0] || '' : '');
  const [momoProvider, setMomoProvider] = useState(payment?.type === 'momo' ? payment.details.split('|')[1] || '' : '');
  const [momoAccountName, setMomoAccountName] = useState(payment?.type === 'momo' ? payment.details.split('|')[2] || '' : '');
  
  // Card fields
  const [cardNumber, setCardNumber] = useState(payment?.type === 'card' ? payment.details.split('|')[0] || '' : '');
  const [cardholderName, setCardholderName] = useState(payment?.type === 'card' ? payment.details.split('|')[1] || '' : '');
  const [expiryDate, setExpiryDate] = useState(payment?.type === 'card' ? payment.details.split('|')[2] || '' : '');
  const [cvv, setCvv] = useState(payment?.type === 'card' ? payment.details.split('|')[3] || '' : '');
  const [cardType, setCardType] = useState('');
  
  const detectCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    
    if (/^4/.test(cleaned)) return 'Visa';
    if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
    if (/^3[47]/.test(cleaned)) return 'American Express';
    if (/^6/.test(cleaned)) return 'Discover';
    if (/^35/.test(cleaned)) return 'JCB';
    if (/^30[0-5]/.test(cleaned) || /^36/.test(cleaned) || /^38/.test(cleaned)) return 'Diners Club';
    
    return '';
  };
  
  const formatCardNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    
    // Detect card type
    const detectedType = detectCardType(cleaned);
    setCardType(detectedType);
    
    // Format based on card type
    if (detectedType === 'American Express') {
      // Amex format: 4-6-5
      return cleaned.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3').substring(0, 17);
    } else {
      // Standard format: 4-4-4-4
      return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ').substring(0, 19);
    }
  };
  
  const formatExpiryDate = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };
  
  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a payment name');
      return;
    }
    
    let details = '';
    
    if (type === 'momo') {
      if (!momoNumber.trim() || !momoProvider.trim() || !momoAccountName.trim()) {
        Alert.alert('Error', 'Please fill in all mobile money details');
        return;
      }
      
      // Validate mobile number format (basic check)
      const cleanMomoNumber = momoNumber.replace(/\D/g, '');
      if (cleanMomoNumber.length < 10 || cleanMomoNumber.length > 15) {
        Alert.alert('Error', 'Please enter a valid mobile number');
        return;
      }
      
      details = `${momoNumber}|${momoProvider}|${momoAccountName}`;
    } else {
      if (!cardNumber.trim() || !cardholderName.trim() || !expiryDate.trim() || !cvv.trim()) {
        Alert.alert('Error', 'Please fill in all card details');
        return;
      }
      
      // Validate card number
      const cleanCardNumber = cardNumber.replace(/\s/g, '');
      if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
        Alert.alert('Error', 'Please enter a valid card number');
        return;
      }
      
      // Validate expiry date is not in the past
      const [month, year] = expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        Alert.alert('Error', 'Card has expired. Please enter a valid expiry date');
        return;
      }
      
      // Validate expiry date format
      if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        Alert.alert('Error', 'Please enter expiry date in MM/YY format');
        return;
      }
      
      // Validate CVV
      if (cvv.length < 3 || cvv.length > 4) {
        Alert.alert('Error', 'Please enter a valid CVV');
        return;
      }
      
      details = `${cleanCardNumber}|${cardholderName}|${expiryDate}|${cvv}`;
    }
    
    onSave({
      id: payment?.id || `pay_${Date.now()}`,
      name,
      details,
      type,
      isDefault
    });
  };
  
  return (
    <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.formTitle}>
        {payment ? 'Edit Payment Method' : 'Add New Payment Method'}
      </Text>
      
      <Input
        label="Payment Name (e.g. My MTN MoMo, Personal Card)"
        value={name}
        onChangeText={setName}
        placeholder="Enter payment name"
      />
      
      <View style={styles.radioGroup}>
        <Text style={styles.radioLabel}>Payment Type</Text>
        <View style={styles.radioOptions}>
          <TouchableOpacity 
            style={styles.radioOption}
            onPress={() => setType('momo')}
          >
            <View style={[styles.radio, type === 'momo' && styles.radioSelected]}>
              {type === 'momo' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioText}>Mobile Money</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.radioOption}
            onPress={() => setType('card')}
          >
            <View style={[styles.radio, type === 'card' && styles.radioSelected]}>
              {type === 'card' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioText}>Card</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Mobile Money Fields */}
      {type === 'momo' && (
        <>
          <Input
            label="Mobile Money Number"
            value={momoNumber}
            onChangeText={setMomoNumber}
            placeholder="Enter mobile money number (e.g. 0241234567)"
            keyboardType="phone-pad"
            maxLength={15}
          />
          
          <View style={styles.providerSection}>
            <Text style={styles.providerLabel}>Mobile Money Provider</Text>
            <View style={styles.providerOptions}>
              {['MTN MoMo', 'Vodafone Cash', 'AirtelTigo Money', 'Zeepay', 'Other'].map((provider) => (
                <TouchableOpacity 
                  key={provider}
                  style={[styles.providerOption, momoProvider === provider && styles.providerOptionSelected]}
                  onPress={() => setMomoProvider(provider)}
                >
                  <Text style={[styles.providerOptionText, momoProvider === provider && styles.providerOptionTextSelected]}>
                    {provider}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <Input
            label="Account Holder Name"
            value={momoAccountName}
            onChangeText={setMomoAccountName}
            placeholder="Enter name on mobile money account"
            autoCapitalize="words"
          />
          
          <View style={styles.momoNote}>
            <Shield size={16} color={Colors.info} />
            <Text style={styles.momoNoteText}>
              Ensure the name matches exactly with your mobile money account for successful transactions.
            </Text>
          </View>
        </>
      )}
      
      {/* Card Fields */}
      {type === 'card' && (
        <>
          <View style={styles.cardNumberContainer}>
            <Input
              label="Card Number"
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              placeholder="1234 5678 9012 3456"
              keyboardType="number-pad"
              maxLength={cardType === 'American Express' ? 17 : 19}
            />
            {cardType && (
              <View style={styles.cardTypeIndicator}>
                <Text style={styles.cardTypeText}>{cardType}</Text>
              </View>
            )}
          </View>
          
          <Input
            label="Cardholder Name (as it appears on card)"
            value={cardholderName}
            onChangeText={setCardholderName}
            placeholder="Enter full name on card"
            autoCapitalize="words"
          />
          
          <View style={styles.cardRow}>
            <View style={styles.cardRowItem}>
              <Input
                label="Expiry Date"
                value={expiryDate}
                onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                placeholder="MM/YY"
                keyboardType="number-pad"
                maxLength={5}
                containerStyle={{ marginBottom: 0 }}
              />
            </View>
            
            <View style={styles.cardRowItem}>
              <Input
                label={cardType === 'American Express' ? 'CID' : 'CVV'}
                value={cvv}
                onChangeText={setCvv}
                placeholder={cardType === 'American Express' ? '1234' : '123'}
                keyboardType="number-pad"
                maxLength={cardType === 'American Express' ? 4 : 3}
                secureTextEntry
                containerStyle={{ marginBottom: 0 }}
              />
            </View>
          </View>
          
          <View style={styles.securityNote}>
            <Shield size={16} color={Colors.success} />
            <Text style={styles.securityNoteText}>
              Your card information is encrypted and secure. We never store your full card details.
            </Text>
          </View>
        </>
      )}
      
      <TouchableOpacity 
        style={styles.checkboxContainer}
        onPress={() => setIsDefault(!isDefault)}
      >
        <View style={[styles.checkbox, isDefault && styles.checkboxChecked]}>
          {isDefault && <View style={styles.checkboxInner} />}
        </View>
        <Text style={styles.checkboxLabel}>Set as default payment method</Text>
      </TouchableOpacity>
      
      <View style={styles.formButtons}>
        <Button
          title="Cancel"
          onPress={onCancel}
          variant="outline"
          style={styles.formButton}
        />
        <Button
          title="Save"
          onPress={handleSave}
          style={styles.formButton}
        />
      </View>
    </ScrollView>
  );
};

// Notifications Component
const NotificationsSection = () => {
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  const styles = createStyles(Colors);
  
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
    <View style={styles.embeddedSection}>
      <View style={styles.embeddedHeader}>
        <Text style={styles.embeddedHeaderTitle}>Notification Preferences</Text>
        <Text style={styles.embeddedHeaderSubtitle}>
          Manage how and when you receive notifications from QuickMart
        </Text>
      </View>
      
      <View style={styles.embeddedSubsection}>
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
      
      <View style={styles.embeddedSubsection}>
        <Text style={styles.embeddedSubsectionTitle}>Order Notifications</Text>
        
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
      
      <View style={styles.embeddedSubsection}>
        <Text style={styles.embeddedSubsectionTitle}>Marketing Notifications</Text>
        
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
      
      <View style={styles.embeddedSubsection}>
        <Text style={styles.embeddedSubsectionTitle}>System Notifications</Text>
        
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
    </View>
  );
};

// Settings Component
const SettingsSection = () => {
  const { user } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  const styles = createStyles(Colors);
  
  // Settings state
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
  
  const handleHelpPress = () => {
    Alert.alert(
      "Help & Support",
      "For any assistance, please contact our support team at support@quickmart.com or call +1-800-QUICKMART.",
      [{ text: "OK" }]
    );
  };
  
  return (
    <View style={styles.embeddedSection}>
      <View style={styles.embeddedHeader}>
        <Text style={styles.embeddedHeaderTitle}>Settings</Text>
        <Text style={styles.embeddedHeaderSubtitle}>
          Customize your app experience
        </Text>
      </View>
      
      <View style={styles.embeddedSubsection}>
        <Text style={styles.embeddedSubsectionTitle}>Appearance</Text>
        
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
      
      <View style={styles.embeddedSubsection}>
        <Text style={styles.embeddedSubsectionTitle}>Privacy & Security</Text>
        
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
      
      <View style={styles.embeddedSubsection}>
        <Text style={styles.embeddedSubsectionTitle}>Support</Text>
        
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
      
      <View style={styles.embeddedSubsection}>
        <Text style={styles.embeddedSubsectionTitle}>Account</Text>
        
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
    </View>
  );
};

// About Component
const AboutSection = () => {
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  const styles = createStyles(Colors);
  
  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };
  
  const openEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(err => console.error("Couldn't open email client", err));
  };
  
  const openPhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(err => console.error("Couldn't open phone app", err));
  };
  
  return (
    <View style={styles.embeddedSection}>
      <View style={styles.aboutHeader}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop' }}
          style={styles.aboutHeaderImage}
        />
        <View style={styles.aboutOverlay} />
        <View style={styles.aboutHeaderContent}>
          <Text style={styles.aboutHeaderTitle}>About QuickMart</Text>
          <Text style={styles.aboutHeaderSubtitle}>
            Your trusted grocery delivery platform
          </Text>
        </View>
      </View>
      
      <View style={styles.embeddedSubsection}>
        <Text style={styles.embeddedSubsectionTitle}>Our Mission</Text>
        <Text style={styles.paragraph}>
          At QuickMart, we are on a mission to revolutionize how people shop for groceries. 
          We believe that everyone deserves access to fresh, quality products without the hassle 
          of traditional shopping. Our platform connects customers with local stores for fast, 
          reliable delivery right to your doorstep.
        </Text>
      </View>
      
      <View style={styles.featuresSection}>
        <Text style={styles.embeddedSubsectionTitle}>Why Choose QuickMart</Text>
        
        <View style={styles.featureRow}>
          <View style={styles.feature}>
            <View style={styles.featureIconContainer}>
              <Truck size={24} color={Colors.primary} />
            </View>
            <Text style={styles.featureTitle}>Fast Delivery</Text>
            <Text style={styles.featureDescription}>
              Get your groceries delivered in as little as 1 hour
            </Text>
          </View>
          
          <View style={styles.feature}>
            <View style={styles.featureIconContainer}>
              <ShoppingBag size={24} color={Colors.primary} />
            </View>
            <Text style={styles.featureTitle}>Wide Selection</Text>
            <Text style={styles.featureDescription}>
              Shop from thousands of products across multiple stores
            </Text>
          </View>
        </View>
        
        <View style={styles.featureRow}>
          <View style={styles.feature}>
            <View style={styles.featureIconContainer}>
              <Shield size={24} color={Colors.primary} />
            </View>
            <Text style={styles.featureTitle}>Secure Payments</Text>
            <Text style={styles.featureDescription}>
              Multiple payment options with secure transactions
            </Text>
          </View>
          
          <View style={styles.feature}>
            <View style={styles.featureIconContainer}>
              <Heart size={24} color={Colors.primary} />
            </View>
            <Text style={styles.featureTitle}>Customer First</Text>
            <Text style={styles.featureDescription}>
              Dedicated support team to assist you every step of the way
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.embeddedSubsection}>
        <Text style={styles.embeddedSubsectionTitle}>Our Story</Text>
        <Text style={styles.paragraph}>
          QuickMart was founded in 2023 with a simple idea: make grocery shopping easier for everyone. 
          What started as a small operation in one city has quickly grown into a platform serving 
          multiple regions, connecting thousands of customers with their favorite local stores.
        </Text>
      </View>
      
      <View style={styles.embeddedSubsection}>
        <Text style={styles.embeddedSubsectionTitle}>Contact Us</Text>
        
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => openEmail('support@quickmart.com')}
        >
          <View style={styles.contactIconContainer}>
            <Mail size={20} color={Colors.primary} />
          </View>
          <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>Email</Text>
            <Text style={styles.contactValue}>support@quickmart.com</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => openPhone('+18001234567')}
        >
          <View style={styles.contactIconContainer}>
            <Phone size={20} color={Colors.primary} />
          </View>
          <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>Phone</Text>
            <Text style={styles.contactValue}>+1 (800) 123-4567</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => openLink('https://quickmart.com')}
        >
          <View style={styles.contactIconContainer}>
            <Globe size={20} color={Colors.primary} />
          </View>
          <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>Website</Text>
            <Text style={styles.contactValue}>www.quickmart.com</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => openLink('https://maps.google.com')}
        >
          <View style={styles.contactIconContainer}>
            <MapPin size={20} color={Colors.primary} />
          </View>
          <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>Headquarters</Text>
            <Text style={styles.contactValue}>123 Delivery Street, San Francisco, CA 94107</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.aboutFooter}>
        <Text style={styles.aboutFooterText}>
          © 2023-2025 QuickMart. All rights reserved.
        </Text>
        <View style={styles.aboutFooterLinks}>
          <TouchableOpacity onPress={() => openLink('https://quickmart.com/terms')}>
            <Text style={styles.aboutFooterLink}>Terms of Service</Text>
          </TouchableOpacity>
          <Text style={styles.aboutFooterDivider}>•</Text>
          <TouchableOpacity onPress={() => openLink('https://quickmart.com/privacy')}>
            <Text style={styles.aboutFooterLink}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

import { Switch, Linking } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  const styles = createStyles(Colors);
  const customer = user as Customer;
  const { width } = useWindowDimensions();
  
  // Responsive breakpoints
  const isSmallScreen = width < 380;
  const isMediumScreen = width >= 380 && width < 768;
  const isLargeScreen = width >= 768;
  
  // State for modals
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);
  
  // State for active section
  const [activeSection, setActiveSection] = useState<'profile' | 'notifications' | 'settings' | 'about'>('profile');
  
  // Initialize customer data if empty
  useEffect(() => {
    if (customer && (!customer.addresses || !customer.paymentMethods)) {
      updateUser({
        ...customer,
        addresses: customer.addresses || [],
        paymentMethods: customer.paymentMethods || []
      });
    }
  }, [customer]);
  
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: () => {
            logout();
            router.replace('/(auth)');
          }
        }
      ]
    );
  };
  
  const handleEditProfile = () => {
    setShowEditProfileModal(true);
  };
  
  const handleSaveProfile = (userData: Partial<Customer>) => {
    if (!customer) return;
    
    updateUser({
      ...customer,
      ...userData
    });
    
    setShowEditProfileModal(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };
  
  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };
  
  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };
  
  const handleDeleteAddress = (addressId: string) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            if (!customer) return;
            
            const updatedAddresses = customer.addresses.filter(addr => addr.id !== addressId);
            
            // If we're deleting the default address, make the first one default
            if (updatedAddresses.length > 0 && customer.addresses.find(addr => addr.id === addressId)?.isDefault) {
              updatedAddresses[0].isDefault = true;
            }
            
            updateUser({
              ...customer,
              addresses: updatedAddresses
            });
          }
        }
      ]
    );
  };
  
  const handleSaveAddress = (address: Address) => {
    if (!customer) return;
    
    let updatedAddresses: Address[];
    
    // If setting as default, unset default for all others
    if (address.isDefault) {
      updatedAddresses = customer.addresses.map(addr => ({
        ...addr,
        isDefault: false
      }));
    } else {
      updatedAddresses = [...customer.addresses];
      
      // If this is the only address, force it to be default
      if (updatedAddresses.length === 0 || (updatedAddresses.length === 1 && updatedAddresses[0].id === address.id)) {
        address.isDefault = true;
      }
    }
    
    // Update or add the address
    const existingIndex = updatedAddresses.findIndex(addr => addr.id === address.id);
    if (existingIndex >= 0) {
      updatedAddresses[existingIndex] = address;
    } else {
      updatedAddresses.push(address);
    }
    
    updateUser({
      ...customer,
      addresses: updatedAddresses
    });
    
    setShowAddressModal(false);
  };
  
  const handleAddPayment = () => {
    setEditingPayment(null);
    setShowPaymentModal(true);
  };
  
  const handleEditPayment = (payment: PaymentMethod) => {
    setEditingPayment(payment);
    setShowPaymentModal(true);
  };
  
  const handleDeletePayment = (paymentId: string) => {
    Alert.alert(
      "Delete Payment Method",
      "Are you sure you want to delete this payment method?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            if (!customer) return;
            
            const updatedPayments = customer.paymentMethods.filter(pm => pm.id !== paymentId);
            
            // If we're deleting the default payment, make the first one default
            if (updatedPayments.length > 0 && customer.paymentMethods.find(pm => pm.id === paymentId)?.isDefault) {
              updatedPayments[0].isDefault = true;
            }
            
            updateUser({
              ...customer,
              paymentMethods: updatedPayments
            });
          }
        }
      ]
    );
  };
  
  const handleSavePayment = (payment: PaymentMethod) => {
    if (!customer) return;
    
    let updatedPayments: PaymentMethod[];
    
    // If setting as default, unset default for all others
    if (payment.isDefault) {
      updatedPayments = customer.paymentMethods.map(pm => ({
        ...pm,
        isDefault: false
      }));
    } else {
      updatedPayments = [...customer.paymentMethods];
      
      // If this is the only payment method, force it to be default
      if (updatedPayments.length === 0 || (updatedPayments.length === 1 && updatedPayments[0].id === payment.id)) {
        payment.isDefault = true;
      }
    }
    
    // Update or add the payment method
    const existingIndex = updatedPayments.findIndex(pm => pm.id === payment.id);
    if (existingIndex >= 0) {
      updatedPayments[existingIndex] = payment;
    } else {
      updatedPayments.push(payment);
    }
    
    updateUser({
      ...customer,
      paymentMethods: updatedPayments
    });
    
    setShowPaymentModal(false);
  };
  
  // Helper function to display payment method details
  const getPaymentDisplayText = (payment: PaymentMethod) => {
    if (payment.type === 'momo') {
      const momoDetails = payment.details.split('|');
      return momoDetails[0] || payment.details; // Return just the number
    } else {
      // For cards, extract the card number (first part before |)
      const cardNumber = payment.details.split('|')[0];
      if (cardNumber) {
        // Show only last 4 digits
        return `**** **** **** ${cardNumber.slice(-4)}`;
      }
      return payment.details;
    }
  };
  
  // Helper function to get card type from stored details
  const getStoredCardType = (payment: PaymentMethod) => {
    if (payment.type === 'momo') {
      const momoDetails = payment.details.split('|');
      return momoDetails[1] || 'Mobile Money'; // Return provider or default
    }
    
    if (payment.type !== 'card') return '';
    const cardNumber = payment.details.split('|')[0];
    if (!cardNumber) return '';
    
    if (/^4/.test(cardNumber)) return 'Visa';
    if (/^5[1-5]/.test(cardNumber)) return 'Mastercard';
    if (/^3[47]/.test(cardNumber)) return 'American Express';
    if (/^6/.test(cardNumber)) return 'Discover';
    if (/^35/.test(cardNumber)) return 'JCB';
    if (/^30[0-5]/.test(cardNumber) || /^36/.test(cardNumber) || /^38/.test(cardNumber)) return 'Diners Club';
    
    return 'Card';
  };
  
  if (!customer) {
    return null;
  }
  
  // Render the profile section
  const renderProfileSection = () => (
    <>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Delivery Addresses</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddAddress}
          >
            <Plus size={isSmallScreen ? 16 : 20} color={Colors.primary} />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        
        {!customer.addresses || customer.addresses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No addresses saved yet</Text>
            <Button
              title="Add Address"
              onPress={handleAddAddress}
              variant="outline"
              size="small"
              style={styles.emptyStateButton}
            />
          </View>
        ) : (
          <View style={[
            styles.addressList,
            isLargeScreen && styles.addressListLarge
          ]}>
            {customer.addresses.map((address) => (
              <View key={address.id} style={[
                styles.addressItem,
                isLargeScreen && styles.addressItemLarge
              ]}>
                <View style={styles.addressItemContent}>
                  <View style={[styles.addressIconContainer, address.isDefault && styles.defaultIconContainer]}>
                    <MapPin size={isSmallScreen ? 16 : 20} color={address.isDefault ? Colors.white : Colors.primary} />
                  </View>
                  
                  <View style={styles.addressInfo}>
                    <View style={styles.addressNameRow}>
                      <Text style={styles.addressName}>{address.name}</Text>
                      {address.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultBadgeText}>Default</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.addressText}>{address.address}</Text>
                    {address.details && (
                      <Text style={styles.addressDetails}>{address.details}</Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.addressActions}>
                  <TouchableOpacity 
                    style={styles.addressAction}
                    onPress={() => handleEditAddress(address)}
                  >
                    <Edit size={isSmallScreen ? 16 : 18} color={Colors.primary} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.addressAction}
                    onPress={() => handleDeleteAddress(address.id)}
                  >
                    <Trash size={isSmallScreen ? 16 : 18} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddPayment}
          >
            <Plus size={isSmallScreen ? 16 : 20} color={Colors.primary} />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        
        {!customer.paymentMethods || customer.paymentMethods.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No payment methods saved yet</Text>
            <Button
              title="Add Payment Method"
              onPress={handleAddPayment}
              variant="outline"
              size="small"
              style={styles.emptyStateButton}
            />
          </View>
        ) : (
          <View style={[
            styles.paymentList,
            isLargeScreen && styles.paymentListLarge
          ]}>
            {customer.paymentMethods.map((payment) => (
              <View key={payment.id} style={[
                styles.paymentItem,
                isLargeScreen && styles.paymentItemLarge
              ]}>
                <View style={styles.paymentItemContent}>
                  <View style={[styles.paymentIconContainer, payment.isDefault && styles.defaultIconContainer]}>
                    <CreditCard size={isSmallScreen ? 16 : 20} color={payment.isDefault ? Colors.white : Colors.primary} />
                  </View>
                  
                  <View style={styles.paymentInfo}>
                    <View style={styles.paymentNameRow}>
                      <Text style={styles.paymentName}>{payment.name}</Text>
                      {payment.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultBadgeText}>Default</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.paymentText}>{getPaymentDisplayText(payment)}</Text>
                    <Text style={styles.paymentType}>
                      {getStoredCardType(payment)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.paymentActions}>
                  <TouchableOpacity 
                    style={styles.paymentAction}
                    onPress={() => handleEditPayment(payment)}
                  >
                    <Edit size={isSmallScreen ? 16 : 18} color={Colors.primary} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.paymentAction}
                    onPress={() => handleDeletePayment(payment.id)}
                  >
                    <Trash size={isSmallScreen ? 16 : 18} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </>
  );
  
  // Render the appropriate section based on activeSection
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'notifications':
        return <NotificationsSection />;
      case 'settings':
        return <SettingsSection />;
      case 'about':
        return <AboutSection />;
      case 'profile':
      default:
        return renderProfileSection();
    }
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      <View style={styles.header}>
        <View style={[
          styles.profileInfo, 
          isSmallScreen && styles.profileInfoSmall,
          isLargeScreen && styles.profileInfoLarge
        ]}>
          <Image 
            source={{ uri: customer.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' }} 
            style={[
              styles.avatar, 
              isSmallScreen && styles.avatarSmall,
              isLargeScreen && styles.avatarLarge
            ]}
          />
          
          <View style={[
            styles.userInfo,
            isSmallScreen && styles.userInfoSmall,
            isLargeScreen && styles.userInfoLarge
          ]}>
            <Text style={[
              styles.userName, 
              isSmallScreen && styles.userNameSmall,
              isLargeScreen && styles.userNameLarge
            ]} numberOfLines={1}>
              {customer.name}
            </Text>
            <Text style={[
              styles.userEmail,
              isLargeScreen && styles.userEmailLarge
            ]} numberOfLines={1}>{customer.email}</Text>
            <Text style={[
              styles.userPhone,
              isLargeScreen && styles.userPhoneLarge
            ]} numberOfLines={1}>{customer.phone}</Text>
          </View>
        </View>
        
        <Button
          title="Edit Profile"
          onPress={handleEditProfile}
          variant="outline"
          size={isSmallScreen ? "small" : "medium"}
          style={styles.editButton}
        />
      </View>
      
      {/* Section Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeSection === 'profile' && styles.activeTab]}
          onPress={() => setActiveSection('profile')}
        >
          <Text style={[styles.tabText, activeSection === 'profile' && styles.activeTabText]}>Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeSection === 'notifications' && styles.activeTab]}
          onPress={() => setActiveSection('notifications')}
        >
          <Text style={[styles.tabText, activeSection === 'notifications' && styles.activeTabText]}>Notifications</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeSection === 'settings' && styles.activeTab]}
          onPress={() => setActiveSection('settings')}
        >
          <Text style={[styles.tabText, activeSection === 'settings' && styles.activeTabText]}>Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeSection === 'about' && styles.activeTab]}
          onPress={() => setActiveSection('about')}
        >
          <Text style={[styles.tabText, activeSection === 'about' && styles.activeTabText]}>About</Text>
        </TouchableOpacity>
      </View>
      
      {/* Active Section Content */}
      {renderActiveSection()}
      
      {activeSection === 'profile' && (
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
          textStyle={{ color: Colors.error }}
          icon={<LogOut size={isSmallScreen ? 16 : 20} color={Colors.error} />}
        />
      )}
      
      {/* Edit Profile Modal */}
      <Modal
        visible={showEditProfileModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditProfileModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent,
            isLargeScreen && styles.modalContentLarge
          ]}>
            <EditProfileForm
              user={customer}
              onSave={handleSaveProfile}
              onCancel={() => setShowEditProfileModal(false)}
            />
          </View>
        </View>
      </Modal>
      
      {/* Address Modal */}
      <Modal
        visible={showAddressModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent,
            isLargeScreen && styles.modalContentLarge
          ]}>
            <AddressForm
              address={editingAddress}
              onSave={handleSaveAddress}
              onCancel={() => setShowAddressModal(false)}
            />
          </View>
        </View>
      </Modal>
      
      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent,
            isLargeScreen && styles.modalContentLarge
          ]}>
            <PaymentForm
              payment={editingPayment}
              onSave={handleSavePayment}
              onCancel={() => setShowPaymentModal(false)}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const createStyles = (Colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingBottom: Layout.padding * 2,
  },
  header: {
    padding: Layout.padding,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfoSmall: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  profileInfoLarge: {
    paddingHorizontal: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarSmall: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 12,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userInfoSmall: {
    marginLeft: 0,
    alignItems: 'center',
  },
  userInfoLarge: {
    marginLeft: 24,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  userNameSmall: {
    fontSize: 18,
    textAlign: 'center',
  },
  userNameLarge: {
    fontSize: 24,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 2,
  },
  userEmailLarge: {
    fontSize: 16,
  },
  userPhone: {
    fontSize: 14,
    color: Colors.subtext,
  },
  userPhoneLarge: {
    fontSize: 16,
  },
  editButton: {
    alignSelf: 'center',
    marginTop: 12,
  },
  // Tab styles
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.subtext,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  section: {
    padding: Layout.padding,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  addButtonText: {
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.card,
    borderRadius: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 12,
  },
  emptyStateButton: {
    minWidth: 120,
  },
  addressList: {
    width: '100%',
  },
  addressListLarge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  addressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.card,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addressItemLarge: {
    width: '48%',
  },
  addressItemContent: {
    flexDirection: 'row',
    flex: 1,
  },
  addressIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  defaultIconContainer: {
    backgroundColor: Colors.primary,
  },
  addressInfo: {
    flex: 1,
  },
  addressNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: Colors.lightPrimary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '500',
  },
  addressText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 2,
  },
  addressDetails: {
    fontSize: 12,
    color: Colors.subtext,
  },
  addressActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressAction: {
    padding: 8,
    marginLeft: 4,
  },
  paymentList: {
    width: '100%',
  },
  paymentListLarge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.card,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  paymentItemLarge: {
    width: '48%',
  },
  paymentItemContent: {
    flexDirection: 'row',
    flex: 1,
  },
  paymentIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginRight: 8,
  },
  paymentText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 2,
  },
  paymentType: {
    fontSize: 12,
    color: Colors.subtext,
  },
  paymentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentAction: {
    padding: 8,
    marginLeft: 4,
  },
  logoutButton: {
    marginHorizontal: Layout.padding,
    marginTop: Layout.padding,
    borderColor: Colors.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContentLarge: {
    maxWidth: 600,
    padding: 24,
  },
  formContainer: {
    width: '100%',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.text,
    textAlign: 'center',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  formButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: Colors.white,
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  radioGroup: {
    marginBottom: 16,
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: Colors.text,
  },
  radioOptions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    backgroundColor: Colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    backgroundColor: Colors.white,
    borderRadius: 5,
  },
  radioText: {
    fontSize: 14,
    color: Colors.text,
  },
  // Card form specific styles
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardRowItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  cardNumberContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  cardTypeIndicator: {
    position: 'absolute',
    right: 12,
    top: 38,
    backgroundColor: Colors.lightPrimary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  cardTypeText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '10',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  securityNoteText: {
    fontSize: 12,
    color: Colors.success,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  providerSection: {
    marginBottom: 16,
  },
  providerLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: Colors.text,
  },
  providerOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  providerOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  providerOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  providerOptionText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  providerOptionTextSelected: {
    color: Colors.white,
  },
  momoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.info + '10',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  momoNoteText: {
    fontSize: 12,
    color: Colors.info,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  // Edit Profile Form specific styles
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  editAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  avatarLabel: {
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'center',
  },
  profileNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.info + '10',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  profileNoteText: {
    fontSize: 12,
    color: Colors.info,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  // Embedded section styles
  embeddedSection: {
    padding: Layout.padding,
    backgroundColor: Colors.white,
  },
  embeddedHeader: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 12,
  },
  embeddedHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  embeddedHeaderSubtitle: {
    fontSize: 14,
    color: Colors.subtext,
    lineHeight: 20,
  },
  embeddedSubsection: {
    marginBottom: 20,
  },
  embeddedSubsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  // Notification styles
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '50',
    marginBottom: 8,
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
  // Settings styles
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
  // About styles
  aboutHeader: {
    height: 150,
    position: 'relative',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  aboutHeaderImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  aboutOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  aboutHeaderContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Layout.padding,
  },
  aboutHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
  },
  aboutHeaderSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.text,
    marginBottom: 16,
  },
  featuresSection: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  feature: {
    width: '48%',
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'center',
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    color: Colors.primary,
  },
  aboutFooter: {
    marginTop: 20,
    alignItems: 'center',
  },
  aboutFooterText: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 12,
  },
  aboutFooterLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aboutFooterLink: {
    fontSize: 14,
    color: Colors.primary,
  },
  aboutFooterDivider: {
    marginHorizontal: 8,
    color: Colors.subtext,
  },
});