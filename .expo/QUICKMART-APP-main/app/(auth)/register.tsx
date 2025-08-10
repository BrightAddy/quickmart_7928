import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  Animated,
  Alert,
  Platform,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Briefcase, 
  ChevronLeft, 
  ChevronRight,
  Camera,
  Check,
  AlertCircle,
  MapPin,
  CreditCard,
  Truck,
  Heart,
  Upload,
  FileText,
  UserCheck
} from 'lucide-react-native';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { UserRole, NextOfKin } from '@/types';
import PasswordStrength from '@/components/PasswordStrength';
import StepIndicator from '@/components/StepIndicator';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9]{10,15}$/;
const GHANA_CARD_REGEX = /^GHA-\d{9}-\d$/;

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error } = useAuthStore();
  const scrollViewRef = useRef(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  // Form state
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  // Form validation errors
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: '',
    verificationCode: '',
  });
  
  // Additional fields for specific roles
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [ghanaCardId, setGhanaCardId] = useState('');
  const [ghanaCardFrontImage, setGhanaCardFrontImage] = useState('');
  const [ghanaCardBackImage, setGhanaCardBackImage] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [momoNumber, setMomoNumber] = useState('');
  
  // Next of kin information (for employees)
  const [nextOfKin, setNextOfKin] = useState<NextOfKin>({
    name: '',
    relationship: '',
    phone: '',
    address: ''
  });
  
  // Additional validation errors for role-specific fields
  const [roleErrors, setRoleErrors] = useState({
    businessName: '',
    businessAddress: '',
    ghanaCardId: '',
    ghanaCardFrontImage: '',
    ghanaCardBackImage: '',
    vehicleInfo: '',
    momoNumber: '',
    nextOfKinName: '',
    nextOfKinRelationship: '',
    nextOfKinPhone: '',
  });
  
  // Steps configuration
  const getSteps = () => {
    const baseSteps = [
      { title: 'Account Type', description: 'Select your role' },
      { title: 'Basic Info', description: 'Enter your details' },
      { title: 'Security', description: 'Create password' },
    ];
    
    if (role === 'customer') {
      return [
        ...baseSteps,
        { title: 'Verification', description: 'Verify your account' },
        { title: 'Complete', description: 'Review and finish' }
      ];
    } else if (role === 'employee') {
      return [
        ...baseSteps,
        { title: 'ID Verification', description: 'Ghana Card details' },
        { title: 'Next of Kin', description: 'Emergency contact' },
        { title: 'Additional Info', description: 'Vehicle details' },
        { title: 'Complete', description: 'Review and finish' }
      ];
    } else {
      return [
        ...baseSteps,
        { title: 'Additional Info', description: 'Business details' },
        { title: 'Complete', description: 'Review and finish' }
      ];
    }
  };
  
  const steps = getSteps();
  
  // Sample profile images
  const sampleProfileImages = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop',
  ];
  
  // Sample Ghana Card images
  const sampleGhanaCardImages = [
    'https://images.unsplash.com/photo-1586769852836-bc069f19e1be?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1586769852836-bc069f19e1be?q=80&w=1000&auto=format&fit=crop',
  ];
  
  // Animate between steps
  const animateToNextStep = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentStep(currentStep + 1);
      slideAnim.setValue(50);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };
  
  const animateToPrevStep = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentStep(currentStep - 1);
      slideAnim.setValue(-50);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };
  
  // Validation functions
  const validateStep = (step: number) => {
    let isValid = true;
    const newErrors = { ...errors };
    const newRoleErrors = { ...roleErrors };
    
    switch (step) {
      case 0: // Account Type
        // No validation needed for role selection
        break;
        
      case 1: // Basic Info
        if (!name.trim()) {
          newErrors.name = 'Name is required';
          isValid = false;
        } else if (name.length < 3) {
          newErrors.name = 'Name must be at least 3 characters';
          isValid = false;
        } else {
          newErrors.name = '';
        }
        
        if (!email.trim()) {
          newErrors.email = 'Email is required';
          isValid = false;
        } else if (!EMAIL_REGEX.test(email)) {
          newErrors.email = 'Please enter a valid email';
          isValid = false;
        } else {
          newErrors.email = '';
        }
        
        if (!phone.trim()) {
          newErrors.phone = 'Phone number is required';
          isValid = false;
        } else if (!PHONE_REGEX.test(phone)) {
          newErrors.phone = 'Please enter a valid phone number';
          isValid = false;
        } else {
          newErrors.phone = '';
        }
        break;
        
      case 2: // Security
        if (!password) {
          newErrors.password = 'Password is required';
          isValid = false;
        } else if (password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
          isValid = false;
        } else {
          newErrors.password = '';
        }
        
        if (!confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
          isValid = false;
        } else if (password !== confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
          isValid = false;
        } else {
          newErrors.confirmPassword = '';
        }
        
        if (!acceptedTerms) {
          newErrors.terms = 'You must accept the terms and conditions';
          isValid = false;
        } else {
          newErrors.terms = '';
        }
        break;
        
      case 3: // Role-specific or Verification
        if (role === 'customer') {
          // Verification code validation for customers
          if (!verificationCode.trim()) {
            newErrors.verificationCode = 'Verification code is required';
            isValid = false;
          } else if (verificationCode.length !== 6) {
            newErrors.verificationCode = 'Verification code must be 6 digits';
            isValid = false;
          } else {
            newErrors.verificationCode = '';
          }
        } else if (role === 'employee') {
          // Ghana Card validation for employees
          if (!ghanaCardId.trim()) {
            newRoleErrors.ghanaCardId = 'Ghana Card ID is required';
            isValid = false;
          } else if (!GHANA_CARD_REGEX.test(ghanaCardId)) {
            newRoleErrors.ghanaCardId = 'Please enter a valid Ghana Card ID (format: GHA-123456789-0)';
            isValid = false;
          } else {
            newRoleErrors.ghanaCardId = '';
          }
          
          if (!ghanaCardFrontImage) {
            newRoleErrors.ghanaCardFrontImage = 'Front image of Ghana Card is required';
            isValid = false;
          } else {
            newRoleErrors.ghanaCardFrontImage = '';
          }
          
          if (!ghanaCardBackImage) {
            newRoleErrors.ghanaCardBackImage = 'Back image of Ghana Card is required';
            isValid = false;
          } else {
            newRoleErrors.ghanaCardBackImage = '';
          }
        } else if (role === 'store_owner') {
          // Store owner specific validation
          if (!businessName.trim()) {
            newRoleErrors.businessName = 'Business name is required';
            isValid = false;
          } else {
            newRoleErrors.businessName = '';
          }
          
          if (!businessAddress.trim()) {
            newRoleErrors.businessAddress = 'Business address is required';
            isValid = false;
          } else {
            newRoleErrors.businessAddress = '';
          }
          
          if (!momoNumber.trim()) {
            newRoleErrors.momoNumber = 'Mobile Money number is required';
            isValid = false;
          } else if (!PHONE_REGEX.test(momoNumber)) {
            newRoleErrors.momoNumber = 'Please enter a valid Mobile Money number';
            isValid = false;
          } else {
            newRoleErrors.momoNumber = '';
          }
        }
        break;
        
      case 4: // Next of Kin (for employees) or Complete (for customers)
        if (role === 'employee') {
          if (!nextOfKin.name.trim()) {
            newRoleErrors.nextOfKinName = 'Next of kin name is required';
            isValid = false;
          } else {
            newRoleErrors.nextOfKinName = '';
          }
          
          if (!nextOfKin.relationship.trim()) {
            newRoleErrors.nextOfKinRelationship = 'Relationship is required';
            isValid = false;
          } else {
            newRoleErrors.nextOfKinRelationship = '';
          }
          
          if (!nextOfKin.phone.trim()) {
            newRoleErrors.nextOfKinPhone = 'Next of kin phone number is required';
            isValid = false;
          } else if (!PHONE_REGEX.test(nextOfKin.phone)) {
            newRoleErrors.nextOfKinPhone = 'Please enter a valid phone number';
            isValid = false;
          } else {
            newRoleErrors.nextOfKinPhone = '';
          }
        }
        break;
        
      case 5: // Additional Info (for employees)
        if (role === 'employee') {
          if (!vehicleInfo.trim()) {
            newRoleErrors.vehicleInfo = 'Vehicle information is required';
            isValid = false;
          } else {
            newRoleErrors.vehicleInfo = '';
          }
          
          if (!momoNumber.trim()) {
            newRoleErrors.momoNumber = 'Mobile Money number is required';
            isValid = false;
          } else if (!PHONE_REGEX.test(momoNumber)) {
            newRoleErrors.momoNumber = 'Please enter a valid Mobile Money number';
            isValid = false;
          } else {
            newRoleErrors.momoNumber = '';
          }
        }
        break;
    }
    
    setErrors(newErrors);
    setRoleErrors(newRoleErrors);
    return isValid;
  };
  
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 3 && role === 'customer') {
        // Simulate verification code check for customers
        if (verificationCode === '123456') {
          animateToNextStep();
        } else {
          setErrors({
            ...errors,
            verificationCode: 'Invalid verification code. Try 123456'
          });
        }
      } else {
        animateToNextStep();
      }
    }
  };
  
  const handlePrev = () => {
    animateToPrevStep();
  };
  
  const handleRegister = async () => {
    try {
      const userData: any = {
        name,
        email,
        phone,
        avatar: profileImage || sampleProfileImages[Math.floor(Math.random() * sampleProfileImages.length)],
      };
      
      // Add role-specific fields
      if (role === 'store_owner') {
        userData.businessName = businessName;
        userData.businessAddress = businessAddress;
        userData.momoNumber = momoNumber || phone;
        userData.storeId = `s${Date.now()}`;
      } else if (role === 'employee') {
        userData.ghanaCardId = ghanaCardId;
        userData.ghanaCardFrontImage = ghanaCardFrontImage;
        userData.ghanaCardBackImage = ghanaCardBackImage;
        userData.vehicleInfo = vehicleInfo;
        userData.momoNumber = momoNumber || phone;
        userData.rating = 5.0;
        userData.earnings = 0;
        userData.nextOfKin = nextOfKin;
        userData.verificationStatus = {
          isVerified: false,
          ghanaCardVerified: true,
          selfieVerified: false,
          documentationComplete: true
        };
      } else if (role === 'customer') {
        userData.addresses = [];
        userData.paymentMethods = [];
      }
      
      await register(userData, role);
      
      // Navigate based on role
      if (role === 'customer') {
        router.replace('/(customer)');
      } else if (role === 'employee') {
        router.replace('/(employee)');
      } else if (role === 'store_owner') {
        router.replace('/(store)');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Registration Failed', 'Please try again later.');
    }
  };
  
  // Simulate sending verification code
  const sendVerificationCode = () => {
    if (validateStep(1) && validateStep(2)) {
      Alert.alert(
        'Verification Code Sent',
        'We have sent a verification code to your email and phone. Use code 123456 for this demo.',
        [{ text: 'OK' }]
      );
    }
  };
  
  // Calculate password strength
  const getPasswordStrength = () => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return Math.min(strength, 5);
  };
  
  // Select a profile image
  const handleSelectProfileImage = (imageUrl: string) => {
    setProfileImage(imageUrl);
  };
  
  // Select Ghana Card images
  const handleSelectGhanaCardImage = (imageUrl: string, side: 'front' | 'back') => {
    if (side === 'front') {
      setGhanaCardFrontImage(imageUrl);
    } else {
      setGhanaCardBackImage(imageUrl);
    }
  };
  
  // Update next of kin information
  const updateNextOfKin = (field: keyof NextOfKin, value: string) => {
    setNextOfKin(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Account Type
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Choose Account Type</Text>
            <Text style={styles.stepDescription}>Select the type of account you want to create</Text>
            
            <View style={styles.roleCards}>
              <TouchableOpacity
                style={[
                  styles.roleCard,
                  role === 'customer' && styles.roleCardActive
                ]}
                onPress={() => setRole('customer')}
              >
                <View style={[styles.roleIconContainer, role === 'customer' && styles.roleIconContainerActive]}>
                  <User size={28} color={role === 'customer' ? Colors.white : Colors.primary} />
                </View>
                <Text style={styles.roleCardTitle}>Customer</Text>
                <Text style={styles.roleCardDescription}>
                  Shop from local stores and get items delivered to your doorstep
                </Text>
                {role === 'customer' && (
                  <View style={styles.selectedIndicator}>
                    <Check size={16} color={Colors.white} />
                  </View>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.roleCard,
                  role === 'employee' && styles.roleCardActive
                ]}
                onPress={() => setRole('employee')}
              >
                <View style={[styles.roleIconContainer, role === 'employee' && styles.roleIconContainerActive]}>
                  <Truck size={28} color={role === 'employee' ? Colors.white : Colors.primary} />
                </View>
                <Text style={styles.roleCardTitle}>Employee</Text>
                <Text style={styles.roleCardDescription}>
                  Deliver orders and earn money with flexible working hours
                </Text>
                {role === 'employee' && (
                  <View style={styles.selectedIndicator}>
                    <Check size={16} color={Colors.white} />
                  </View>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.roleCard,
                  role === 'store_owner' && styles.roleCardActive
                ]}
                onPress={() => setRole('store_owner')}
              >
                <View style={[styles.roleIconContainer, role === 'store_owner' && styles.roleIconContainerActive]}>
                  <Briefcase size={28} color={role === 'store_owner' ? Colors.white : Colors.primary} />
                </View>
                <Text style={styles.roleCardTitle}>Store Owner</Text>
                <Text style={styles.roleCardDescription}>
                  List your store and products to reach more customers
                </Text>
                {role === 'store_owner' && (
                  <View style={styles.selectedIndicator}>
                    <Check size={16} color={Colors.white} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );
        
      case 1: // Basic Info
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Basic Information</Text>
            <Text style={styles.stepDescription}>Tell us about yourself</Text>
            
            <View style={styles.profileImageSection}>
              <Text style={styles.sectionLabel}>Profile Picture</Text>
              <View style={styles.profileImageGrid}>
                {sampleProfileImages.map((image, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.profileImageOption,
                      profileImage === image && styles.profileImageSelected
                    ]}
                    onPress={() => handleSelectProfileImage(image)}
                  >
                    <Image
                      source={{ uri: image }}
                      style={styles.profileImage}
                    />
                    {profileImage === image && (
                      <View style={styles.profileImageCheck}>
                        <Check size={16} color={Colors.white} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.profileImageOption}
                  onPress={() => Alert.alert('Camera', 'Camera functionality would be implemented here')}
                >
                  <View style={styles.cameraPlaceholder}>
                    <Camera size={24} color={Colors.primary} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              leftIcon={<User size={20} color={Colors.subtext} />}
              error={errors.name}
            />
            
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={20} color={Colors.subtext} />}
              error={errors.email}
            />
            
            <Input
              label="Phone Number"
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              leftIcon={<Phone size={20} color={Colors.subtext} />}
              error={errors.phone}
            />
          </View>
        );
        
      case 2: // Security
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Security</Text>
            <Text style={styles.stepDescription}>Create a secure password</Text>
            
            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              isPassword
              leftIcon={<Lock size={20} color={Colors.subtext} />}
              error={errors.password}
            />
            
            <PasswordStrength strength={getPasswordStrength()} />
            
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword
              leftIcon={<Lock size={20} color={Colors.subtext} />}
              error={errors.confirmPassword}
            />
            
            <View style={styles.termsContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setAcceptedTerms(!acceptedTerms)}
              >
                {acceptedTerms ? (
                  <View style={styles.checkedBox}>
                    <Check size={16} color={Colors.white} />
                  </View>
                ) : (
                  <View style={styles.uncheckedBox} />
                )}
              </TouchableOpacity>
              
              <View style={styles.termsTextContainer}>
                <Text style={styles.termsText}>
                  I agree to the{' '}
                  <Text 
                    style={styles.termsLink}
                    onPress={() => Alert.alert('Terms & Conditions', 'Terms and conditions would be displayed here')}
                  >
                    Terms & Conditions
                  </Text>
                  {' '}and{' '}
                  <Text 
                    style={styles.termsLink}
                    onPress={() => Alert.alert('Privacy Policy', 'Privacy policy would be displayed here')}
                  >
                    Privacy Policy
                  </Text>
                </Text>
              </View>
            </View>
            
            {errors.terms ? (
              <Text style={styles.errorText}>{errors.terms}</Text>
            ) : null}
          </View>
        );
        
      case 3: // Role-specific or Verification
        if (role === 'customer') {
          return (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Verify Your Account</Text>
              <Text style={styles.stepDescription}>
                Enter the verification code sent to your email and phone
              </Text>
              
              <View style={styles.verificationContainer}>
                <Input
                  label="Verification Code"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  keyboardType="number-pad"
                  maxLength={6}
                  error={errors.verificationCode}
                />
                
                <TouchableOpacity 
                  style={styles.resendButton}
                  onPress={sendVerificationCode}
                >
                  <Text style={styles.resendButtonText}>Resend Code</Text>
                </TouchableOpacity>
                
                <View style={styles.infoBox}>
                  <AlertCircle size={20} color={Colors.primary} />
                  <Text style={styles.infoText}>
                    For this demo, use code: 123456
                  </Text>
                </View>
              </View>
            </View>
          );
        } else if (role === 'employee') {
          return (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Ghana Card Verification</Text>
              <Text style={styles.stepDescription}>
                Provide your Ghana Card details for identity verification
              </Text>
              
              <Input
                label="Ghana Card ID"
                placeholder="Format: GHA-123456789-0"
                value={ghanaCardId}
                onChangeText={setGhanaCardId}
                leftIcon={<FileText size={20} color={Colors.subtext} />}
                error={roleErrors.ghanaCardId}
              />
              
              <Text style={styles.sectionLabel}>Upload Ghana Card Images</Text>
              
              <View style={styles.cardImagesContainer}>
                <View style={styles.cardImageSection}>
                  <Text style={styles.cardImageLabel}>Front Side</Text>
                  {ghanaCardFrontImage ? (
                    <TouchableOpacity 
                      onPress={() => handleSelectGhanaCardImage(sampleGhanaCardImages[0], 'front')}
                      style={styles.cardImagePreviewContainer}
                    >
                      <Image 
                        source={{ uri: ghanaCardFrontImage }} 
                        style={styles.cardImagePreview} 
                      />
                      <View style={styles.cardImageOverlay}>
                        <Text style={styles.cardImageOverlayText}>Change</Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity 
                      style={styles.cardImageUploadButton}
                      onPress={() => handleSelectGhanaCardImage(sampleGhanaCardImages[0], 'front')}
                    >
                      <Upload size={24} color={Colors.primary} />
                      <Text style={styles.cardImageUploadText}>Upload Front</Text>
                    </TouchableOpacity>
                  )}
                  {roleErrors.ghanaCardFrontImage ? (
                    <Text style={styles.errorText}>{roleErrors.ghanaCardFrontImage}</Text>
                  ) : null}
                </View>
                
                <View style={styles.cardImageSection}>
                  <Text style={styles.cardImageLabel}>Back Side</Text>
                  {ghanaCardBackImage ? (
                    <TouchableOpacity 
                      onPress={() => handleSelectGhanaCardImage(sampleGhanaCardImages[1], 'back')}
                      style={styles.cardImagePreviewContainer}
                    >
                      <Image 
                        source={{ uri: ghanaCardBackImage }} 
                        style={styles.cardImagePreview} 
                      />
                      <View style={styles.cardImageOverlay}>
                        <Text style={styles.cardImageOverlayText}>Change</Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity 
                      style={styles.cardImageUploadButton}
                      onPress={() => handleSelectGhanaCardImage(sampleGhanaCardImages[1], 'back')}
                    >
                      <Upload size={24} color={Colors.primary} />
                      <Text style={styles.cardImageUploadText}>Upload Back</Text>
                    </TouchableOpacity>
                  )}
                  {roleErrors.ghanaCardBackImage ? (
                    <Text style={styles.errorText}>{roleErrors.ghanaCardBackImage}</Text>
                  ) : null}
                </View>
              </View>
              
              <View style={styles.infoBox}>
                <AlertCircle size={20} color={Colors.primary} />
                <Text style={styles.infoText}>
                  Your Ghana Card details will be verified before you can start accepting orders.
                </Text>
              </View>
            </View>
          );
        } else if (role === 'store_owner') {
          return (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Store Information</Text>
              <Text style={styles.stepDescription}>Tell us about your business</Text>
              
              <Input
                label="Business Name"
                placeholder="Enter your business name"
                value={businessName}
                onChangeText={setBusinessName}
                leftIcon={<Briefcase size={20} color={Colors.subtext} />}
                error={roleErrors.businessName}
              />
              
              <Input
                label="Business Address"
                placeholder="Enter your business address"
                value={businessAddress}
                onChangeText={setBusinessAddress}
                leftIcon={<MapPin size={20} color={Colors.subtext} />}
                error={roleErrors.businessAddress}
              />
              
              <Input
                label="Mobile Money Number"
                placeholder="Enter your MoMo number"
                value={momoNumber}
                onChangeText={setMomoNumber}
                keyboardType="phone-pad"
                leftIcon={<CreditCard size={20} color={Colors.subtext} />}
                error={roleErrors.momoNumber}
              />
              
              <View style={styles.infoBox}>
                <AlertCircle size={20} color={Colors.primary} />
                <Text style={styles.infoText}>
                  Your store will need to be verified before you can start selling.
                </Text>
              </View>
            </View>
          );
        }
        return null;
        
      case 4: // Next of Kin (for employees) or Complete (for customers)
        if (role === 'employee') {
          return (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Next of Kin Information</Text>
              <Text style={styles.stepDescription}>
                Provide emergency contact details
              </Text>
              
              <Input
                label="Full Name"
                placeholder="Enter next of kin's full name"
                value={nextOfKin.name}
                onChangeText={(value) => updateNextOfKin('name', value)}
                leftIcon={<User size={20} color={Colors.subtext} />}
                error={roleErrors.nextOfKinName}
              />
              
              <Input
                label="Relationship"
                placeholder="E.g., Spouse, Parent, Sibling"
                value={nextOfKin.relationship}
                onChangeText={(value) => updateNextOfKin('relationship', value)}
                leftIcon={<Heart size={20} color={Colors.subtext} />}
                error={roleErrors.nextOfKinRelationship}
              />
              
              <Input
                label="Phone Number"
                placeholder="Enter next of kin's phone number"
                value={nextOfKin.phone}
                onChangeText={(value) => updateNextOfKin('phone', value)}
                keyboardType="phone-pad"
                leftIcon={<Phone size={20} color={Colors.subtext} />}
                error={roleErrors.nextOfKinPhone}
              />
              
              <Input
                label="Address (Optional)"
                placeholder="Enter next of kin's address"
                value={nextOfKin.address || ''}
                onChangeText={(value) => updateNextOfKin('address', value)}
                leftIcon={<MapPin size={20} color={Colors.subtext} />}
              />
              
              <View style={styles.infoBox}>
                <AlertCircle size={20} color={Colors.primary} />
                <Text style={styles.infoText}>
                  This information will only be used in case of emergency.
                </Text>
              </View>
            </View>
          );
        } else if (role === 'customer') {
          return (
            <View style={styles.stepContent}>
              <View style={styles.completeContainer}>
                <View style={styles.completeIconContainer}>
                  <Check size={40} color={Colors.white} />
                </View>
                
                <Text style={styles.completeTitle}>Almost Done!</Text>
                <Text style={styles.completeDescription}>
                  Please review your information before creating your account
                </Text>
                
                <View style={styles.summaryContainer}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Account Type:</Text>
                    <Text style={styles.summaryValue}>Customer</Text>
                  </View>
                  
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Name:</Text>
                    <Text style={styles.summaryValue}>{name}</Text>
                  </View>
                  
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Email:</Text>
                    <Text style={styles.summaryValue}>{email}</Text>
                  </View>
                  
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Phone:</Text>
                    <Text style={styles.summaryValue}>{phone}</Text>
                  </View>
                </View>
                
                {error && (
                  <View style={styles.errorContainer}>
                    <AlertCircle size={20} color={Colors.error} />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}
              </View>
            </View>
          );
        } else if (role === 'store_owner') {
          return (
            <View style={styles.stepContent}>
              <View style={styles.completeContainer}>
                <View style={styles.completeIconContainer}>
                  <Check size={40} color={Colors.white} />
                </View>
                
                <Text style={styles.completeTitle}>Almost Done!</Text>
                <Text style={styles.completeDescription}>
                  Please review your information before creating your account
                </Text>
                
                <View style={styles.summaryContainer}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Account Type:</Text>
                    <Text style={styles.summaryValue}>Store Owner</Text>
                  </View>
                  
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Name:</Text>
                    <Text style={styles.summaryValue}>{name}</Text>
                  </View>
                  
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Email:</Text>
                    <Text style={styles.summaryValue}>{email}</Text>
                  </View>
                  
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Phone:</Text>
                    <Text style={styles.summaryValue}>{phone}</Text>
                  </View>
                  
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Business:</Text>
                    <Text style={styles.summaryValue}>{businessName}</Text>
                  </View>
                  
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Address:</Text>
                    <Text style={styles.summaryValue}>{businessAddress}</Text>
                  </View>
                </View>
                
                {error && (
                  <View style={styles.errorContainer}>
                    <AlertCircle size={20} color={Colors.error} />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}
              </View>
            </View>
          );
        }
        return null;
        
      case 5: // Additional Info (for employees)
        if (role === 'employee') {
          return (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Additional Information</Text>
              <Text style={styles.stepDescription}>
                Provide details about your vehicle and payment
              </Text>
              
              <Input
                label="Vehicle Information"
                placeholder="E.g., Honda Motorcycle, Red, GR 1234-20"
                value={vehicleInfo}
                onChangeText={setVehicleInfo}
                leftIcon={<Truck size={20} color={Colors.subtext} />}
                error={roleErrors.vehicleInfo}
              />
              
              <Input
                label="Mobile Money Number"
                placeholder="Enter your MoMo number"
                value={momoNumber}
                onChangeText={setMomoNumber}
                keyboardType="phone-pad"
                leftIcon={<CreditCard size={20} color={Colors.subtext} />}
                error={roleErrors.momoNumber}
              />
              
              <View style={styles.infoBox}>
                <AlertCircle size={20} color={Colors.primary} />
                <Text style={styles.infoText}>
                  Your earnings will be sent to this Mobile Money number.
                </Text>
              </View>
            </View>
          );
        }
        return null;
        
      case 6: // Complete (for employees)
        if (role === 'employee') {
          return (
            <View style={styles.stepContent}>
              <View style={styles.completeContainer}>
                <View style={styles.completeIconContainer}>
                  <Check size={40} color={Colors.white} />
                </View>
                
                <Text style={styles.completeTitle}>Almost Done!</Text>
                <Text style={styles.completeDescription}>
                  Please review your information before creating your account
                </Text>
                
                <View style={styles.summaryContainer}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Account Type:</Text>
                    <Text style={styles.summaryValue}>Employee</Text>
                  </View>
                  
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Name:</Text>
                    <Text style={styles.summaryValue}>{name}</Text>
                  </View>
                  
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Email:</Text>
                    <Text style={styles.summaryValue}>{email}</Text>
                  </View>
                  
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Phone:</Text>
                    <Text style={styles.summaryValue}>{phone}</Text>
                  </View>
                  
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Ghana Card:</Text>
                    <Text style={styles.summaryValue}>{ghanaCardId}</Text>
                  </View>
                  
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Next of Kin:</Text>
                    <Text style={styles.summaryValue}>{nextOfKin.name}</Text>
                  </View>
                  
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Vehicle:</Text>
                    <Text style={styles.summaryValue}>{vehicleInfo}</Text>
                  </View>
                </View>
                
                <View style={styles.verificationStatusContainer}>
                  <UserCheck size={20} color={Colors.primary} />
                  <Text style={styles.verificationStatusText}>
                    Your identity verification is pending. You will need to complete a selfie verification before accepting orders.
                  </Text>
                </View>
                
                {error && (
                  <View style={styles.errorContainer}>
                    <AlertCircle size={20} color={Colors.error} />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}
              </View>
            </View>
          );
        }
        return null;
        
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        {currentStep > 0 && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handlePrev}
          >
            <ChevronLeft size={24} color={Colors.text} />
          </TouchableOpacity>
        )}
        
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join QuickMart today</Text>
        </View>
      </View>
      
      <StepIndicator 
        steps={steps} 
        currentStep={currentStep} 
      />
      
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {renderStepContent()}
        </Animated.View>
      </ScrollView>
      
      <View style={styles.footer}>
        {currentStep < steps.length - 1 ? (
          <Button
            title={
              currentStep === 3 && role === 'customer' 
                ? "Verify" 
                : currentStep === 3 && role === 'employee'
                ? "Verify Ghana Card"
                : "Continue"
            }
            onPress={handleNext}
            style={styles.footerButton}
            icon={<ChevronRight size={20} color={Colors.white} />}
            iconPosition="right"
          />
        ) : (
          <Button
            title="Create Account"
            onPress={handleRegister}
            isLoading={isLoading}
            style={styles.footerButton}
          />
        )}
        
        {currentStep === 0 && (
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.subtext,
    marginTop: 4,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  animatedContainer: {
    flex: 1,
  },
  stepContent: {
    flex: 1,
    paddingVertical: 16,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 24,
  },
  roleCards: {
    marginTop: 16,
  },
  roleCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: Colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  roleCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.lightPrimary,
  },
  roleIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.lightPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  roleIconContainerActive: {
    backgroundColor: Colors.primary,
  },
  roleCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  roleCardDescription: {
    fontSize: 14,
    color: Colors.subtext,
    lineHeight: 20,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 12,
  },
  profileImageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  profileImageOption: {
    width: '25%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  profileImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
  },
  profileImageSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 14,
  },
  profileImageCheck: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPlaceholder: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 8,
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  checkedBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uncheckedBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  termsTextContainer: {
    flex: 1,
  },
  termsText: {
    fontSize: 14,
    color: Colors.subtext,
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: '500',
  },
  verificationContainer: {
    marginTop: 16,
  },
  resendButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 16,
  },
  resendButtonText: {
    color: Colors.primary,
    fontWeight: '500',
    fontSize: 14,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightPrimary,
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  completeContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  completeIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  completeDescription: {
    fontSize: 16,
    color: Colors.subtext,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  summaryContainer: {
    width: '100%',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  summaryItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  summaryLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.subtext,
    fontWeight: '500',
  },
  summaryValue: {
    flex: 2,
    fontSize: 14,
    color: Colors.text,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  errorText: {
    color: Colors.error,
    marginLeft: 8,
    fontSize: 14,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  footerButton: {
    width: '100%',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
    color: Colors.subtext,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 4,
  },
  cardImagesContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  cardImageSection: {
    flex: 1,
    marginHorizontal: 8,
  },
  cardImageLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  cardImageUploadButton: {
    height: 120,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
  },
  cardImageUploadText: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 8,
  },
  cardImagePreviewContainer: {
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardImagePreview: {
    width: '100%',
    height: '100%',
  },
  cardImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImageOverlayText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  verificationStatusContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.lightPrimary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  verificationStatusText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
});