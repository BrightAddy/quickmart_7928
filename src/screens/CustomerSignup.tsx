import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, ScrollView, Animated, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'CustomerSignup'>;

function LanguageSelector({ selected, onChange }: { selected: string; onChange: (lang: string) => void }) {
  return (
    <TouchableOpacity style={styles.langSelector} onPress={() => onChange(selected === 'en' ? 'fr' : 'en')}>
      <Text style={styles.langText}>{selected === 'en' ? 'EN' : 'FR'}</Text>
    </TouchableOpacity>
  );
}

function SocialSignup({ onGoogle, onApple }: { onGoogle: () => void; onApple: () => void }) {
  return (
    <View style={styles.socialRow}>
      <TouchableOpacity style={styles.socialBtn} onPress={onGoogle}>
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialBtn} onPress={onApple}>
        <Text style={styles.socialText}>Continue with Apple</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function CustomerSignup({ navigation }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSignup();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSignup = () => {
    // Mock success: navigate to customer home
    navigation.replace('CustomerHome');
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

  const renderStep3 = () => (
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
      default: return renderStep1();
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#E8F5E8', '#F0F8F0', '#F8FCF8']}
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
              <Text style={styles.logoIcon}>🛒</Text>
              <Text style={styles.logoLeaf}>🌿</Text>
            </View>
            <Text style={styles.brandTitle}>QuickMart</Text>
            <Text style={styles.brandSubtitle}>
              {selectedLang === 'fr' ? 'Rejoignez notre communauté' : 'Join our community'}
            </Text>
          </View>
        </Animated.View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          {[1, 2, 3].map((step) => (
            <View
              key={step}
              style={[
                styles.progressDot,
                {
                  backgroundColor: step <= currentStep ? '#2E7D32' : '#E0E0E0',
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
              {currentStep === 3 
                ? (selectedLang === 'fr' ? 'Créer le compte' : 'Create Account')
                : (selectedLang === 'fr' ? 'Suivant' : 'Next')
              }
            </Text>
          </TouchableOpacity>
        </View>

        {/* Social Signup */}
        <View style={styles.socialSection}>
          <Text style={styles.socialDivider}>
            {selectedLang === 'fr' ? 'ou' : 'or'}
          </Text>
          <SocialSignup
            onGoogle={() => alert('Google signup will be available soon')}
            onApple={() => alert('Apple signup will be available soon')}
          />
        </View>

        {/* Login Link */}
        <View style={styles.loginSection}>
          <Text style={styles.loginText}>
            {selectedLang === 'fr' ? 'Déjà un compte ? ' : 'Already have an account? '}
            <Text 
              style={styles.loginLink} 
              onPress={() => navigation.navigate('CustomerLogin')}
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
    color: '#2E7D32',
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
    color: '#2E7D32',
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
    color: '#2E7D32',
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
    borderColor: 'rgba(46, 125, 50, 0.2)',
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
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#2E7D32',
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
    borderColor: '#2E7D32',
  },
  secondaryButtonText: {
    color: '#2E7D32',
    fontWeight: '600',
    fontSize: 16,
  },
  socialSection: {
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  socialDivider: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginBottom: 20,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  socialBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  socialText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
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
    color: '#2E7D32',
    fontWeight: 'bold',
  },
});
