import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { 
  LogOut, 
  User, 
  MapPin, 
  CreditCard, 
  Settings, 
  ChevronRight, 
  Star, 
  Truck, 
  HelpCircle, 
  Clock, 
  BookOpen,
  UserCheck,
  Shield,
  Heart
} from 'lucide-react-native';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { Employee } from '@/types';
import VerificationModal from '@/components/VerificationModal';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, verifyEmployee, isEmployeeVerifiedForToday } = useAuthStore();
  const employee = user as Employee;
  
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  
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
  
  const handleVerify = async (selfieImage: string) => {
    try {
      // Get current location (would use actual geolocation in a real app)
      const location = {
        latitude: 5.6037,
        longitude: -0.1870
      };
      
      return await verifyEmployee(selfieImage, location);
    } catch (error) {
      console.error('Verification error:', error);
      return false;
    }
  };
  
  const handleVehicleInfoPress = () => {
    Alert.alert("Vehicle Information", "Vehicle information screen will be available soon!");
    // In a real app, you would navigate to the vehicle info screen
    // router.push('/(employee)/vehicle-info');
  };
  
  const handleDeliveryZonePress = () => {
    router.push('/(employee)/delivery-zone');
  };
  
  const handleMobileMoneyPress = () => {
    router.push('/(employee)/mobile-money');
  };
  
  const handleNextOfKinPress = () => {
    router.push('/(employee)/next-of-kin');
  };
  
  const handleSchedulePress = () => {
    router.push('/(employee)/schedule');
  };
  
  const handleTrainingPress = () => {
    router.push('/(employee)/training');
  };
  
  const handleSupportPress = () => {
    router.push('/(employee)/support');
  };
  
  const handleSettingsPress = () => {
    router.push('/(employee)/settings');
  };
  
  if (!employee) {
    return null;
  }
  
  const isVerified = isEmployeeVerifiedForToday();
  const lastVerifiedDate = employee.lastVerifiedAt 
    ? new Date(employee.lastVerifiedAt).toLocaleString() 
    : 'Not verified yet';
  
  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Image 
            source={{ uri: employee.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' }} 
            style={styles.avatar}
          />
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{employee.name}</Text>
            <Text style={styles.userEmail}>{employee.email}</Text>
            <Text style={styles.userPhone}>{employee.phone}</Text>
            
            <View style={styles.ratingContainer}>
              <Star size={16} color={Colors.secondary} fill={Colors.secondary} />
              <Text style={styles.ratingText}>{employee.rating.toFixed(1)} Rating</Text>
            </View>
          </View>
        </View>
        
        <Button
          title="Edit Profile"
          onPress={() => {}}
          variant="outline"
          size="small"
          style={styles.editButton}
        />
      </View>
      
      <View style={styles.verificationSection}>
        <View style={styles.verificationHeader}>
          <View style={styles.verificationTitleContainer}>
            <Shield size={20} color={Colors.primary} />
            <Text style={styles.verificationTitle}>Identity Verification</Text>
          </View>
          
          <View style={[
            styles.verificationStatus,
            isVerified ? styles.verificationStatusActive : styles.verificationStatusInactive
          ]}>
            <Text style={[
              styles.verificationStatusText,
              isVerified ? styles.verificationStatusTextActive : styles.verificationStatusTextInactive
            ]}>
              {isVerified ? 'Verified' : 'Verification Required'}
            </Text>
          </View>
        </View>
        
        <View style={styles.verificationDetails}>
          <Text style={styles.verificationLabel}>Ghana Card ID:</Text>
          <Text style={styles.verificationValue}>{employee.ghanaCardId}</Text>
        </View>
        
        <View style={styles.verificationDetails}>
          <Text style={styles.verificationLabel}>Last Verified:</Text>
          <Text style={styles.verificationValue}>{lastVerifiedDate}</Text>
        </View>
        
        <Button
          title={isVerified ? "Re-verify Identity" : "Verify Identity Now"}
          onPress={() => setVerificationModalVisible(true)}
          variant={isVerified ? "outline" : "primary"}
          style={styles.verifyButton}
          icon={<UserCheck size={20} color={isVerified ? Colors.primary : Colors.white} />}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleVehicleInfoPress}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconContainer}>
            <Truck size={20} color={Colors.primary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Vehicle Information</Text>
            <Text style={styles.menuSubtitle}>
              {employee.vehicleInfo || 'Add your vehicle details'}
            </Text>
          </View>
          <ChevronRight size={20} color={Colors.subtext} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleDeliveryZonePress}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconContainer}>
            <MapPin size={20} color={Colors.primary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Delivery Zone</Text>
            <Text style={styles.menuSubtitle}>Set your preferred delivery area</Text>
          </View>
          <ChevronRight size={20} color={Colors.subtext} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleMobileMoneyPress}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconContainer}>
            <CreditCard size={20} color={Colors.primary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Mobile Money</Text>
            <Text style={styles.menuSubtitle}>{employee.momoNumber}</Text>
          </View>
          <ChevronRight size={20} color={Colors.subtext} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleNextOfKinPress}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconContainer}>
            <Heart size={20} color={Colors.primary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Next of Kin</Text>
            <Text style={styles.menuSubtitle}>{employee.nextOfKin.name} ({employee.nextOfKin.relationship})</Text>
          </View>
          <ChevronRight size={20} color={Colors.subtext} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleSchedulePress}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconContainer}>
            <Clock size={20} color={Colors.primary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Availability</Text>
            <Text style={styles.menuSubtitle}>Manage when you're available to work</Text>
          </View>
          <ChevronRight size={20} color={Colors.subtext} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleTrainingPress}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconContainer}>
            <BookOpen size={20} color={Colors.primary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Training</Text>
            <Text style={styles.menuSubtitle}>View training materials</Text>
          </View>
          <ChevronRight size={20} color={Colors.subtext} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleSupportPress}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconContainer}>
            <HelpCircle size={20} color={Colors.primary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Support</Text>
            <Text style={styles.menuSubtitle}>Get help and support</Text>
          </View>
          <ChevronRight size={20} color={Colors.subtext} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleSettingsPress}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconContainer}>
            <Settings size={20} color={Colors.primary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Settings</Text>
            <Text style={styles.menuSubtitle}>App preferences and settings</Text>
          </View>
          <ChevronRight size={20} color={Colors.subtext} />
        </TouchableOpacity>
      </View>
      
      <Button
        title="Logout"
        onPress={handleLogout}
        variant="outline"
        style={styles.logoutButton}
        textStyle={{ color: Colors.error }}
        icon={<LogOut size={20} color={Colors.error} />}
      />
      
      <VerificationModal
        visible={verificationModalVisible}
        onClose={() => setVerificationModalVisible(false)}
        onVerify={handleVerify}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginLeft: 4,
  },
  editButton: {
    alignSelf: 'flex-start',
  },
  verificationSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.lightGray,
  },
  verificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  verificationTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 8,
  },
  verificationStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  verificationStatusActive: {
    backgroundColor: Colors.success + '20',
  },
  verificationStatusInactive: {
    backgroundColor: Colors.error + '20',
  },
  verificationStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  verificationStatusTextActive: {
    color: Colors.success,
  },
  verificationStatusTextInactive: {
    color: Colors.error,
  },
  verificationDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  verificationLabel: {
    width: 120,
    fontSize: 14,
    color: Colors.subtext,
    fontWeight: '500',
  },
  verificationValue: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  verifyButton: {
    marginTop: 16,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: Colors.subtext,
  },
  logoutButton: {
    margin: 20,
    borderColor: Colors.error,
  },
});