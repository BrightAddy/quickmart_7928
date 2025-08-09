import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Modal, Pressable, Animated, Easing } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Screen, Title, Body } from '../components/UI';
import { useTheme } from '../theme/theme';

// Placeholder for language selector
function LanguageSelector({ selected, onChange }: { selected: string; onChange: (lang: string) => void }) {
  return (
    <TouchableOpacity style={styles.langSelector} onPress={() => onChange(selected === 'en' ? 'fr' : 'en')}>
      <Text style={{ color: '#2E7D32', fontWeight: 'bold' }}>{selected === 'en' ? 'EN' : 'FR'}</Text>
    </TouchableOpacity>
  );
}

// Placeholder for social login
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

export default function LoginScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Login'>) {
  const { colors } = useTheme();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = () => {
    // Mock success: navigate to home
    navigation.replace('CustomerHome');
  };

  return (
    <Screen>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <View style={{ alignItems: 'center', marginTop: 32, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: 60 }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Title style={{ fontSize: 26, fontWeight: '700' }}>Welcome Back</Title>
          </View>
          <LanguageSelector selected={selectedLang} onChange={setSelectedLang} />
        </View>
        <View style={{ alignItems: 'center', marginBottom: 8 }}>
          <View style={styles.logoBox}><Text style={styles.logoText}>QM</Text></View>
          <Text style={styles.brandTitle}>QuickMart</Text>
          <Text style={styles.brandSubtitle}>Your favorite groceries, delivered fast</Text>
        </View>
        <View style={{ marginTop: 18, gap: 12 }}>
          <TextInput
            placeholder="Phone or Email"
            value={identifier}
            onChangeText={setIdentifier}
            style={[styles.input, { borderColor: colors.onSurface + '33' }]}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={[styles.input, { borderColor: colors.onSurface + '33' }]}
          />
          <TouchableOpacity onPress={() => setShowForgot(true)}>
            <Text style={{ color: colors.primary, textAlign: 'right', marginBottom: 4 }}>Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogin} style={[styles.btn, { backgroundColor: colors.primary }]}> 
            <Body style={{ color: colors.onPrimary, textAlign: 'center', fontWeight: '700' }}>Login</Body>
          </TouchableOpacity>
        </View>
        <SocialLogin
          onGoogle={() => alert('Google login will be available soon')}
          onApple={() => alert('Apple login will be available soon')}
        />
        <View style={{ alignItems: 'center', marginTop: 18 }}>
          <Text style={{ color: colors.onSurface + '99' }}>New user?{' '}
            <Text style={{ color: colors.primary, fontWeight: 'bold' }} onPress={() => navigation.navigate('UserRoleSelection')}>Sign Up</Text>
          </Text>
        </View>
        <Modal visible={showForgot} transparent animationType="slide">
          <Pressable style={styles.modalBg} onPress={() => setShowForgot(false)}>
            <View style={styles.modalContent}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>Reset Password</Text>
              <Text style={{ color: '#666', marginBottom: 16 }}>We'll send you a verification code to reset your password.</Text>
              <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={() => { setShowForgot(false); alert('Password reset link sent!'); }}>
                <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Send Reset Code</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 4,
    fontSize: 16,
  },
  btn: { paddingVertical: 14, borderRadius: 10, marginHorizontal: 16, marginTop: 8 },
  logoBox: {
    width: 70, height: 70, borderRadius: 20, backgroundColor: '#2E7D32', alignItems: 'center', justifyContent: 'center', marginBottom: 8,
    shadowColor: '#2E7D32', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
  },
  logoText: { color: 'white', fontWeight: '800', fontSize: 32 },
  brandTitle: { fontSize: 22, fontWeight: '700', color: '#2E7D32', marginBottom: 2 },
  brandSubtitle: { fontSize: 14, color: '#888', marginBottom: 8 },
  langSelector: { padding: 8, borderRadius: 8, backgroundColor: '#E8F5E8', marginRight: 16 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 18 },
  socialBtn: { backgroundColor: '#f5f5f5', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, marginHorizontal: 4 },
  socialText: { color: '#222', fontWeight: 'bold' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', borderRadius: 16, padding: 24, width: 320, alignItems: 'center' },
});


