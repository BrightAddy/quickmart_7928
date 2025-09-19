import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, ScrollView, Animated, Dimensions, Image, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'ShopperSignup'>;

function LanguageSelector({ selected, onChange }: { selected: string; onChange: (lang: string) => void }) {
  return (
    <TouchableOpacity style={styles.langSelector} onPress={() => onChange(selected === 'en' ? 'fr' : 'en')}>
      <Text style={styles.langText}>{selected === 'en' ? 'EN' : 'FR'}</Text>
    </TouchableOpacity>
  );
}

// Social signup removed as per security requirements

export default function ShopperSignup({ navigation }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [ghanaCardNumber, setGhanaCardNumber] = useState('');
  const [ghanaCardExpiry, setGhanaCardExpiry] = useState('');
  const [ghanaCardFront, setGhanaCardFront] = useState<string | null>(null);
  const [ghanaCardBack, setGhanaCardBack] = useState<string | null>(null);
  const [passportPhoto, setPassportPhoto] = useState<string | null>(null);
  const [payoutMethod, setPayoutMethod] = useState<'momo' | 'bank'>('momo');
  const [momoProvider, setMomoProvider] = useState('');
  const [momoNumber, setMomoNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedLang, setSelectedLang] = useState('en');
  const [currentStep, setCurrentStep] = useState(1);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 1200,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(formAnim, {
        toValue: 1,
        duration: 1000,
        delay: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Close dropdown when step changes
  useEffect(() => {
    setShowVehicleDropdown(false);
  }, [currentStep]);

  const nextStep = () => {
    // Step-by-step validation gate
    switch (currentStep) {
      case 1: {
        if (!firstName.trim() || !lastName.trim() || !address.trim()) {
          Alert.alert(
            selectedLang === 'fr' ? 'Champs requis' : 'Required fields',
            selectedLang === 'fr'
              ? 'Veuillez saisir le prénom, le nom et l\'adresse.'
              : 'Please enter first name, last name, and residential address.'
          );
          return;
        }
        break;
      }
      case 2: {
        const emailOk = /.+@.+\..+/.test(email.trim());
        const phoneOk = phone.trim().length >= 7;
        if (!emailOk || !phoneOk) {
          Alert.alert(
            selectedLang === 'fr' ? 'Informations de contact invalides' : 'Invalid contact information',
            selectedLang === 'fr'
              ? 'Vérifiez votre email et votre numéro de téléphone.'
              : 'Please check your email and phone number.'
          );
          return;
        }
        break;
      }
      case 3: {
        if (!vehicleType.trim()) {
          Alert.alert(
            selectedLang === 'fr' ? 'Type de véhicule requis' : 'Vehicle type required',
            selectedLang === 'fr'
              ? 'Veuillez sélectionner un type de véhicule.'
              : 'Please select a vehicle type.'
          );
          return;
        }
        // Only require license number for vehicles that need it
        if (vehicleType !== 'No Vehicle' && !licenseNumber.trim()) {
          Alert.alert(
            selectedLang === 'fr' ? 'Numéro de permis requis' : 'License number required',
            selectedLang === 'fr'
              ? 'Veuillez saisir le numéro de permis pour ce type de véhicule.'
              : 'Please enter license number for this vehicle type.'
          );
          return;
        }
        break;
      }
      case 4: {
        if (!ghanaCardNumber.trim() || !ghanaCardFront || !ghanaCardBack) {
          Alert.alert(
            selectedLang === 'fr' ? 'Informations manquantes' : 'Missing information',
            selectedLang === 'fr'
              ? "Veuillez fournir le numéro de la Ghana Card, la photo recto et verso."
              : 'Please provide the Ghana Card number, and upload both front and back photos.'
          );
          return;
        }
        break;
      }
      case 5: {
        if (!passportPhoto) {
          Alert.alert(
            selectedLang === 'fr' ? 'Photo requise' : 'Photo required',
            selectedLang === 'fr'
              ? 'Veuillez prendre une photo de type passeport (selfie).'
              : 'Please take a passport-style live selfie photo.'
          );
          return;
        }
        break;
      }
      case 6: {
        if (payoutMethod === 'momo') {
          if (!momoProvider.trim() || !momoNumber.trim()) {
            Alert.alert(
              selectedLang === 'fr' ? 'Paiement mobile requis' : 'Mobile money required',
              selectedLang === 'fr'
                ? 'Fournissez un opérateur MoMo et un numéro.'
                : 'Please provide a MoMo provider and a phone number.'
            );
            return;
          }
    } else {
          if (!bankName.trim() || !bankAccountName.trim() || !bankAccountNumber.trim()) {
            Alert.alert(
              selectedLang === 'fr' ? 'Détails bancaires requis' : 'Bank details required',
              selectedLang === 'fr'
                ? 'Fournissez la banque, le nom du compte et le numéro de compte.'
                : 'Please provide bank name, account name, and account number.'
            );
            return;
          }
        }
        break;
      }
      case 7: {
        const strong = password.length >= 8;
        const match = password === confirmPassword && confirmPassword.length > 0;
        if (!strong || !match) {
          Alert.alert(
            selectedLang === 'fr' ? 'Mot de passe invalide' : 'Invalid password',
            selectedLang === 'fr'
              ? 'Le mot de passe doit contenir au moins 8 caractères et correspondre.'
              : 'Password must be at least 8 characters and match confirmation.'
          );
          return;
        }
        // All validations passed on last step
      handleSignup();
        return;
      }
    }

    // Advance to the next step if validation passed
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSignup = () => {
    // Mock success: navigate to shopper home
    navigation.replace('ShopperTabs');
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>
        {selectedLang === 'fr' ? 'Informations personnelles' : 'Personal Information'}
      </Text>
      <Text style={styles.stepDescription}>
        {selectedLang === 'fr' 
          ? 'Commençons par vos informations de base'
          : 'Let\'s start with your basic information'
        }
      </Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={selectedLang === 'fr' ? 'Prénom' : 'First Name'}
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
        <TextInput
          placeholder={selectedLang === 'fr' ? 'Nom de famille' : 'Last Name'}
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />
        <TextInput
          placeholder={selectedLang === 'fr' ? 'Adresse résidentielle' : 'Residential Address'}
          value={address}
          onChangeText={setAddress}
          style={styles.input}
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>
        {selectedLang === 'fr' ? 'Coordonnées' : 'Contact Information'}
      </Text>
      <Text style={styles.stepDescription}>
        {selectedLang === 'fr' 
          ? 'Comment pouvons-nous vous contacter ?'
          : 'How can we reach you?'
        }
      </Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={selectedLang === 'fr' ? 'Email' : 'Email'}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder={selectedLang === 'fr' ? 'Téléphone' : 'Phone Number'}
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          keyboardType="phone-pad"
        />
      </View>
    </View>
  );

  const vehicleOptions = [
    { value: 'Car', label: selectedLang === 'fr' ? 'Voiture' : 'Car' },
    { value: 'Motorcycle', label: selectedLang === 'fr' ? 'Moto' : 'Motorcycle' },
    { value: 'No Vehicle', label: selectedLang === 'fr' ? 'Aucun véhicule' : 'No Vehicle' },
  ];

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>
        {selectedLang === 'fr' ? 'Informations de livraison' : 'Delivery Information'}
      </Text>
      <Text style={styles.stepDescription}>
        {selectedLang === 'fr' 
          ? 'Détails sur votre véhicule de livraison'
          : 'Details about your delivery vehicle'
        }
      </Text>
      
      <View style={styles.inputContainer}>
        {/* Vehicle Type Dropdown */}
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={[styles.dropdownButton, showVehicleDropdown && styles.dropdownButtonOpen]}
            onPress={() => setShowVehicleDropdown(!showVehicleDropdown)}
          >
            <Text style={[styles.dropdownButtonText, !vehicleType && styles.placeholderText]}>
              {vehicleType 
                ? vehicleOptions.find(option => option.value === vehicleType)?.label
                : (selectedLang === 'fr' ? 'Sélectionner le type de véhicule' : 'Select Vehicle Type')
              }
            </Text>
            <Text style={styles.dropdownArrow}>{showVehicleDropdown ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          
          {showVehicleDropdown && (
            <View style={styles.dropdownList}>
              {vehicleOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.dropdownItem,
                    vehicleType === option.value && styles.dropdownItemSelected
                  ]}
                  onPress={() => {
                    setVehicleType(option.value);
                    setShowVehicleDropdown(false);
                    // Clear license number if no vehicle is selected
                    if (option.value === 'No Vehicle') {
                      setLicenseNumber('');
                    }
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    vehicleType === option.value && styles.dropdownItemTextSelected
                  ]}>
                    {option.label}
                  </Text>
                  {vehicleType === option.value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* License Number - Only show for vehicles that require it */}
        {(vehicleType && vehicleType !== 'No Vehicle') && (
          <TextInput
            placeholder={selectedLang === 'fr' ? 'Numéro de licence' : 'License Number'}
            value={licenseNumber}
            onChangeText={setLicenseNumber}
            style={styles.input}
          />
        )}

        {/* Info text for no vehicle option */}
        {vehicleType === 'No Vehicle' && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={styles.infoText}>
              {selectedLang === 'fr' 
                ? 'Aucun numéro de licence requis pour cette option.'
                : 'No license number required for this option.'
              }
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const requestMediaPermissions = async () => {
    const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (lib.status !== 'granted') {
      Alert.alert(
        selectedLang === 'fr' ? 'Permission requise' : 'Permission required',
        selectedLang === 'fr' ? "Autorisez l'accès à la galerie pour continuer." : 'Please allow gallery access to continue.'
      );
      return false;
    }
    return true;
  };

  const requestCameraPermissions = async () => {
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    if (cam.status !== 'granted') {
      Alert.alert(
        selectedLang === 'fr' ? 'Permission requise' : 'Permission required',
        selectedLang === 'fr' ? "Autorisez l'appareil photo pour continuer." : 'Please allow camera access to continue.'
      );
      return false;
    }
    return true;
  };

  const chooseImage = async (side: 'front' | 'back') => {
    Alert.alert(
      selectedLang === 'fr' ? 'Ajouter une photo' : 'Add Photo',
      selectedLang === 'fr' ? 'Choisissez une source' : 'Choose a source',
      [
        {
          text: selectedLang === 'fr' ? 'Caméra' : 'Camera',
          onPress: async () => {
            const ok = await requestCameraPermissions();
            if (!ok) return;
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.7,
            });
            if (!result.canceled && result.assets && result.assets[0]) {
              const uri = result.assets[0].uri;
              side === 'front' ? setGhanaCardFront(uri) : setGhanaCardBack(uri);
            }
          }
        },
        {
          text: selectedLang === 'fr' ? 'Galerie' : 'Gallery',
          onPress: async () => {
            const ok = await requestMediaPermissions();
            if (!ok) return;
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.7,
            });
            if (!result.canceled && result.assets && result.assets[0]) {
              const uri = result.assets[0].uri;
              side === 'front' ? setGhanaCardFront(uri) : setGhanaCardBack(uri);
            }
          }
        },
        { text: selectedLang === 'fr' ? 'Annuler' : 'Cancel', style: 'cancel' }
      ]
    );
  };

  const captureSelfie = async () => {
    const ok = await requestCameraPermissions();
    if (!ok) return;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      cameraType: ImagePicker.CameraType.front,
    });
    if (!result.canceled && result.assets && result.assets[0]) {
      setPassportPhoto(result.assets[0].uri);
    }
  };

  const renderStep4GhanaCard = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>
        {selectedLang === 'fr' ? 'Informations de la Ghana Card' : 'Ghana Card Information'}
      </Text>
      <Text style={styles.stepDescription}>
        {selectedLang === 'fr' 
          ? "Entrez les détails de votre Ghana Card pour vérification"
          : 'Enter your Ghana Card details for verification'
        }
      </Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={selectedLang === 'fr' ? 'Numéro de Ghana Card' : 'Ghana Card Number (e.g., GHA-123456789-0)'}
          value={ghanaCardNumber}
          onChangeText={setGhanaCardNumber}
          style={styles.input}
          autoCapitalize="characters"
        />
        <TextInput
          placeholder={selectedLang === 'fr' ? 'Date d\'expiration (AAAA-MM)' : 'Expiry Date (YYYY-MM)'}
          value={ghanaCardExpiry}
          onChangeText={setGhanaCardExpiry}
          style={styles.input}
          keyboardType="numbers-and-punctuation"
        />
        <View style={styles.uploadRow}>
          <TouchableOpacity style={styles.uploadBox} onPress={() => chooseImage('front')}>
            {ghanaCardFront ? (
              <Image source={{ uri: ghanaCardFront }} style={styles.uploadPreview} />
            ) : (
              <Text style={styles.uploadText}>
                {selectedLang === 'fr' ? 'Recto Ghana Card' : 'Front of Ghana Card'}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadBox} onPress={() => chooseImage('back')}>
            {ghanaCardBack ? (
              <Image source={{ uri: ghanaCardBack }} style={styles.uploadPreview} />
            ) : (
              <Text style={styles.uploadText}>
                {selectedLang === 'fr' ? 'Verso Ghana Card' : 'Back of Ghana Card'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderStep5Passport = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>
        {selectedLang === 'fr' ? 'Photo de passeport en direct' : 'Live Passport Photo'}
      </Text>
      <Text style={styles.stepDescription}>
        {selectedLang === 'fr' 
          ? "Prenez un selfie clair, bien éclairé, visage centré, sans chapeau."
          : 'Take a clear, well‑lit selfie with your face centered. No hats or sunglasses.'
        }
      </Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.uploadBox} onPress={captureSelfie}>
          {passportPhoto ? (
            <Image source={{ uri: passportPhoto }} style={styles.uploadPreview} />
          ) : (
            <Text style={styles.uploadText}>
              {selectedLang === 'fr' ? 'Touchez pour capturer un selfie' : 'Tap to capture selfie'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep6 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>
        {selectedLang === 'fr' ? 'Coordonnées de paiement' : 'Payout Details'}
      </Text>
      <Text style={styles.stepDescription}>
        {selectedLang === 'fr'
          ? 'Choisissez un mode de paiement pour recevoir vos gains.'
          : 'Choose how you want to receive your earnings.'}
      </Text>
      <View style={styles.inputContainer}>
        <View style={styles.segmentedRow}>
          <TouchableOpacity
            onPress={() => setPayoutMethod('momo')}
            style={[styles.segmentBtn, payoutMethod === 'momo' && styles.segmentBtnActive]}
          >
            <Text style={[styles.segmentText, payoutMethod === 'momo' && styles.segmentTextActive]}>
              {selectedLang === 'fr' ? 'Mobile Money' : 'Mobile Money'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPayoutMethod('bank')}
            style={[styles.segmentBtn, payoutMethod === 'bank' && styles.segmentBtnActive]}
          >
            <Text style={[styles.segmentText, payoutMethod === 'bank' && styles.segmentTextActive]}>
              {selectedLang === 'fr' ? 'Banque' : 'Bank'}
            </Text>
          </TouchableOpacity>
        </View>

        {payoutMethod === 'momo' ? (
          <View style={{ gap: 16 }}>
            <TextInput
              placeholder={selectedLang === 'fr' ? 'Opérateur (MTN, AirtelTigo, Vodafone)' : 'Provider (MTN, AirtelTigo, Vodafone)'}
              value={momoProvider}
              onChangeText={setMomoProvider}
              style={styles.input}
            />
            <TextInput
              placeholder={selectedLang === 'fr' ? 'Numéro Mobile Money' : 'Mobile Money Number'}
              value={momoNumber}
              onChangeText={setMomoNumber}
              style={styles.input}
              keyboardType="phone-pad"
            />
          </View>
        ) : (
          <View style={{ gap: 16 }}>
            <TextInput
              placeholder={selectedLang === 'fr' ? 'Nom de la banque' : 'Bank Name'}
              value={bankName}
              onChangeText={setBankName}
              style={styles.input}
            />
            <TextInput
              placeholder={selectedLang === 'fr' ? 'Nom du titulaire du compte' : 'Account Name'}
              value={bankAccountName}
              onChangeText={setBankAccountName}
              style={styles.input}
            />
            <TextInput
              placeholder={selectedLang === 'fr' ? 'Numéro de compte' : 'Account Number'}
              value={bankAccountNumber}
              onChangeText={setBankAccountNumber}
              style={styles.input}
              keyboardType="number-pad"
            />
          </View>
        )}
      </View>
    </View>
  );

  const renderStep7 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>
        {selectedLang === 'fr' ? 'Sécurité' : 'Security'}
      </Text>
      <Text style={styles.stepDescription}>
        {selectedLang === 'fr' 
          ? 'Créez un mot de passe sécurisé'
          : 'Create a secure password'
        }
      </Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={selectedLang === 'fr' ? 'Mot de passe' : 'Password'}
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        <TextInput
          placeholder={selectedLang === 'fr' ? 'Confirmer le mot de passe' : 'Confirm Password'}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          secureTextEntry
        />
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4GhanaCard();
      case 5: return renderStep5Passport();
      case 6: return renderStep6();
      case 7: return renderStep7();
      default: return renderStep1();
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#FFF8E1', '#FFF3E0', '#FFECB3']}
        style={styles.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <LanguageSelector selected={selectedLang} onChange={setSelectedLang} />
      </View>

      <Animated.View style={{ 
        flex: 1,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }] 
      }}>
        {/* Logo Section */}
        <Animated.View style={[styles.logoSection, { opacity: logoAnim }]}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoIcon}>🚚</Text>
              <Text style={styles.logoLeaf}>⭐</Text>
            </View>
            <Text style={styles.brandTitle}>QuickMart</Text>
            <Text style={styles.brandSubtitle}>
              {selectedLang === 'fr' ? 'Rejoignez notre équipe de livraison' : 'Join our delivery team'}
            </Text>
          </View>
        </Animated.View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4, 5, 6, 7].map((step) => (
            <View
              key={step}
              style={[
                styles.progressDot,
                {
                  backgroundColor: step <= currentStep ? '#FF9800' : '#E0E0E0',
                  transform: [{ scale: step === currentStep ? 1.2 : 1 }]
                }
              ]}
            />
          ))}
        </View>

        {/* Form Content */}
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: formAnim }}>
            {renderCurrentStep()}
          </Animated.View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          {currentStep > 1 && (
            <TouchableOpacity onPress={prevStep} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>
                {selectedLang === 'fr' ? 'Précédent' : 'Previous'}
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity onPress={nextStep} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>
              {currentStep === 7 
                ? (selectedLang === 'fr' ? 'Créer le compte' : 'Create Account')
                : (selectedLang === 'fr' ? 'Suivant' : 'Next')
              }
            </Text>
          </TouchableOpacity>
        </View>

        {/* Social signup intentionally removed */}

        {/* Login Link */}
        <View style={styles.loginSection}>
          <Text style={styles.loginText}>
            {selectedLang === 'fr' ? 'Déjà un compte ? ' : 'Already have an account? '}
            <Text 
              style={styles.loginLink} 
              onPress={() => navigation.navigate('ShopperLogin')}
            >
              {selectedLang === 'fr' ? 'Se connecter' : 'Login'}
            </Text>
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  backText: {
    fontSize: 20,
    color: '#FF9800',
    fontWeight: 'bold',
  },
  langSelector: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  langText: {
    color: '#FF9800',
    fontWeight: '600',
    fontSize: 14,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    position: 'relative',
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 48,
  },
  logoLeaf: {
    position: 'absolute',
    top: -4,
    right: -4,
    fontSize: 20,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF9800',
    marginBottom: 8,
  },
  brandSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    gap: 12,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  stepContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  inputContainer: {
    gap: 16,
    width: '100%',
  },
  input: {
    borderWidth: 2,
    borderColor: 'rgba(255, 152, 0, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingBottom: 20,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  secondaryButtonText: {
    color: '#FF9800',
    fontWeight: '600',
    fontSize: 16,
  },
  // Social styles removed
  segmentedRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,152,0,0.08)',
    borderRadius: 12,
    padding: 6,
    gap: 6,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  segmentBtnActive: {
    backgroundColor: '#FF9800',
  },
  segmentText: {
    color: '#FF9800',
    fontWeight: '600',
  },
  segmentTextActive: {
    color: 'white',
  },
  loginSection: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  loginText: {
    color: '#666',
    fontSize: 16,
  },
  loginLink: {
    color: '#FF9800',
    fontWeight: 'bold',
  },
  uploadRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  uploadBox: {
    flex: 1,
    height: 120,
    borderWidth: 2,
    borderColor: 'rgba(255, 152, 0, 0.3)',
    borderStyle: 'dashed',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  uploadText: {
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  uploadPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  selfieHelp: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  // Dropdown styles
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  dropdownButton: {
    borderWidth: 2,
    borderColor: 'rgba(255, 152, 0, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dropdownButtonOpen: {
    borderColor: '#FF9800',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  placeholderText: {
    color: '#999',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#FF9800',
    marginLeft: 8,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#FF9800',
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1001,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 152, 0, 0.1)',
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(255, 152, 0, 0.05)',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  dropdownItemTextSelected: {
    color: '#FF9800',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 16,
    color: '#FF9800',
    fontWeight: 'bold',
  },
  // Info container styles
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    flex: 1,
    lineHeight: 20,
  },
});
