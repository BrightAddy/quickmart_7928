import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Modal, Pressable, Animated, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'ShopperLogin'>;

function LanguageSelector({ selected, onChange }: { selected: string; onChange: (lang: string) => void }) {
  return (
    <TouchableOpacity style={styles.langSelector} onPress={() => onChange(selected === 'en' ? 'fr' : 'en')}>
      <Text style={styles.langText}>{selected === 'en' ? 'EN' : 'FR'}</Text>
    </TouchableOpacity>
  );
}

function SocialLogin({ onGoogle, onApple }: { onGoogle: () => void; onApple: () => void }) {
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

export default function ShopperLogin({ navigation }: Props) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;

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
      })
    ]).start();

    // Floating animation for delivery icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleLogin = () => {
    // Mock success: navigate to shopper home
    navigation.replace('ShopperTabs');
  };

  const floatingTransform = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

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
            <Animated.View style={{ transform: [{ translateY: floatingTransform }] }}>
              <View style={styles.logo}>
                <Text style={styles.logoIcon}>🚚</Text>
                <Text style={styles.logoLeaf}>⭐</Text>
              </View>
            </Animated.View>
            <Text style={styles.brandTitle}>QuickMart</Text>
            <Text style={styles.brandSubtitle}>
              {selectedLang === 'fr' 
                ? 'Livrez et gagnez de l\'argent' 
                : 'Deliver and earn money'
              }
            </Text>
          </View>
        </Animated.View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>
            {selectedLang === 'fr' ? 'Bon retour, Livreur !' : 'Welcome Back, Shopper!'}
          </Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              placeholder={selectedLang === 'fr' ? 'Téléphone ou Email' : 'Phone or Email'}
              value={identifier}
              onChangeText={setIdentifier}
              style={styles.input}
              autoCapitalize="none"
            />
            <TextInput
              placeholder={selectedLang === 'fr' ? 'Mot de passe' : 'Password'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
            
            <TouchableOpacity onPress={() => setShowForgot(true)} style={styles.forgotLink}>
              <Text style={styles.forgotText}>
                {selectedLang === 'fr' ? 'Mot de passe oublié ?' : 'Forgot password?'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
              <Text style={styles.loginButtonText}>
                {selectedLang === 'fr' ? 'Se connecter' : 'Login'}
              </Text>
            </TouchableOpacity>
          </View>

          <SocialLogin
            onGoogle={() => alert('Google login will be available soon')}
            onApple={() => alert('Apple login will be available soon')}
          />

          <View style={styles.signupSection}>
            <Text style={styles.signupText}>
              {selectedLang === 'fr' ? 'Nouveau livreur ? ' : 'New shopper? '}
              <Text 
                style={styles.signupLink} 
                onPress={() => navigation.navigate('ShopperSignup')}
              >
                {selectedLang === 'fr' ? 'S\'inscrire' : 'Sign Up'}
              </Text>
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Forgot Password Modal */}
      <Modal visible={showForgot} transparent animationType="slide">
        <Pressable style={styles.modalBg} onPress={() => setShowForgot(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedLang === 'fr' ? 'Réinitialiser le mot de passe' : 'Reset Password'}
            </Text>
            <Text style={styles.modalDescription}>
              {selectedLang === 'fr' 
                ? 'Nous vous enverrons un code de vérification pour réinitialiser votre mot de passe.'
                : 'We\'ll send you a verification code to reset your password.'
              }
            </Text>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => { 
                setShowForgot(false); 
                alert('Password reset link sent!'); 
              }}
            >
              <Text style={styles.modalButtonText}>
                {selectedLang === 'fr' ? 'Envoyer le code' : 'Send Reset Code'}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
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
    marginBottom: 40,
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
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    gap: 16,
    marginBottom: 24,
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
  forgotLink: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotText: {
    color: '#FF9800',
    fontWeight: '600',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
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
  signupSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  signupText: {
    color: '#666',
    fontSize: 16,
  },
  signupLink: {
    color: '#FF9800',
    fontWeight: 'bold',
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 12,
    color: '#000',
  },
  modalDescription: {
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
