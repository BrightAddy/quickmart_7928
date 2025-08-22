import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Animated, ScrollView, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Screen, Title, Body } from '../components/UI';
import { useTheme } from '../theme/theme';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

type RoleDef = {
  key: 'customer' | 'shopper' | 'store';
  title: { en: string; fr: string };
  description: { en: string; fr: string };
  icon: string;
  benefits: string[];
  accent: string;
  route: keyof RootStackParamList;
};

const roles: RoleDef[] = [
  {
    key: 'customer',
    title: { en: 'Customer', fr: 'Client' },
    description: { en: 'Shop groceries conveniently', fr: 'Achetez des produits facilement' },
    icon: '🛒',
    benefits: ['Browse local stores', 'Fast delivery', 'Secure payments', 'Track orders'],
    accent: '#2E7D32',
    route: 'CustomerTabs',
  },
  {
    key: 'shopper',
    title: { en: 'Shopper', fr: 'Livreur' },
    description: { en: 'Earn money delivering orders', fr: 'Gagnez de l\'argent en livrant' },
    icon: '🚚',
    benefits: ['Flexible hours', 'Earn money', 'Weekly payouts', 'GPS navigation'],
    accent: '#FF9800',
    route: 'ShopperTabs',
  },
  {
    key: 'store',
    title: { en: 'Store Owner', fr: 'Commerçant' },
    description: { en: 'Manage your business digitally', fr: 'Gérez votre commerce en ligne' },
    icon: '🏬',
    benefits: ['Inventory management', 'Reach more customers', 'Analytics dashboard', 'Automated orders'],
    accent: '#388E3C',
    route: 'StoreOwnerHome',
  },
];

function LanguageSelector({ selected, onChange }: { selected: string; onChange: (lang: string) => void }) {
  return (
    <View style={styles.langRow}>
      <TouchableOpacity style={[styles.langBtn, selected === 'en' && styles.langBtnActive]} onPress={() => onChange('en')}>
        <Text style={[styles.langBtnText, selected === 'en' && styles.langBtnTextActive]}>EN</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.langBtn, selected === 'fr' && styles.langBtnActive]} onPress={() => onChange('fr')}>
        <Text style={[styles.langBtnText, selected === 'fr' && styles.langBtnTextActive]}>FR</Text>
      </TouchableOpacity>
    </View>
  );
}

function RoleCard({ role, lang, onPress }: any) {
  const cardAnim = useRef(new Animated.Value(0)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance animation
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(cardAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
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
        )
      ]).start();
    }, role.key === 'customer' ? 0 : role.key === 'shopper' ? 200 : 400);

    return () => clearTimeout(timer);
  }, []);

  const floatingTransform = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <Animated.View
      style={[
        styles.roleCardContainer,
        {
          opacity: cardAnim,
          transform: [
            { translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) },
            { scale: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }
          ]
        }
      ]}
    >
      <TouchableOpacity style={[styles.roleCard, { borderColor: role.accent }]} onPress={onPress}>
        <Animated.View style={{ transform: [{ translateY: floatingTransform }] }}>
          <Text style={styles.roleIcon}>{role.icon}</Text>
        </Animated.View>
        <Text style={[styles.roleTitle, { color: role.accent }]}>{role.title[lang]}</Text>
        <Text style={styles.roleDesc}>{role.description[lang]}</Text>
        <View style={styles.benefitsList}>
          {role.benefits.map((b: string, i: number) => (
            <Text key={i} style={styles.benefitItem}>• {b}</Text>
          ))}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function UserRoleSelection({ navigation }: NativeStackScreenProps<RootStackParamList, 'UserRoleSelection'>) {
  const { colors } = useTheme();
  const [lang, setLang] = useState('en');
  const slideAnim = useRef(new Animated.Value(60)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#E8F5E8', '#F0F8F0', '#F8FCF8']}
        style={styles.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>🚚</Text>
            <Text style={styles.logoLeaf}>🌿</Text>
          </View>
          <Text style={styles.appName}>QuickMart</Text>
        </View>
      </View>

      <Animated.View style={{ 
        flex: 1,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }] 
      }}>
        <Title style={styles.mainTitle}>Choose your role</Title>
        <LanguageSelector selected={lang} onChange={setLang} />
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {roles.map((role) => (
            <RoleCard key={role.key} role={role} lang={lang} onPress={() => navigation.replace(role.route)} />
          ))}
        </ScrollView>
        
        <View style={styles.loginSection}>
          <Text style={styles.loginText}>
            {lang === 'fr' ? 'Déjà inscrit ? ' : 'Already have account? '}
            <Text style={styles.loginLink} onPress={() => navigation.navigate('CustomerLogin')}>
              {lang === 'fr' ? 'Connexion Client' : 'Customer Login'}
            </Text>
            {' | '}
            <Text style={styles.loginLink} onPress={() => navigation.navigate('ShopperLogin')}>
              {lang === 'fr' ? 'Livreur' : 'Shopper'}
            </Text>
            {' | '}
            <Text style={styles.loginLink} onPress={() => navigation.navigate('StoreOwnerLogin')}>
              {lang === 'fr' ? 'Commerçant' : 'Store Owner'}
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
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    position: 'relative',
    marginRight: 8,
  },
  logoIcon: {
    fontSize: 24,
  },
  logoLeaf: {
    position: 'absolute',
    top: -2,
    right: -2,
    fontSize: 12,
  },
  appName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF8C00',
  },
  mainTitle: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  langRow: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 8, 
    marginTop: 12,
    marginBottom: 20,
  },
  langBtn: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  langBtnActive: { 
    backgroundColor: '#2E7D32',
    transform: [{ scale: 1.05 }],
  },
  langBtnText: { 
    color: '#666', 
    fontWeight: '600',
    fontSize: 14,
  },
  langBtnTextActive: {
    color: '#fff',
  },
  scrollContent: { 
    gap: 20, 
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  roleCardContainer: {
    marginBottom: 8,
  },
  roleCard: { 
    backgroundColor: 'white', 
    borderRadius: 24, 
    borderWidth: 2, 
    padding: 24, 
    alignItems: 'center', 
    elevation: 8, 
    shadowColor: '#000', 
    shadowOpacity: 0.12, 
    shadowRadius: 16, 
    shadowOffset: { width: 0, height: 8 },
    transform: [{ scale: 1 }],
  },
  roleIcon: { 
    fontSize: 48, 
    marginBottom: 12,
  },
  roleTitle: { 
    fontWeight: 'bold', 
    fontSize: 22, 
    marginBottom: 4, 
    textAlign: 'center',
  },
  roleDesc: { 
    color: '#666', 
    fontSize: 15, 
    marginBottom: 16, 
    textAlign: 'center',
    lineHeight: 22,
  },
  benefitsList: { 
    alignItems: 'flex-start', 
    width: '100%', 
    marginTop: 8,
  },
  benefitItem: { 
    color: '#2E7D32', 
    fontSize: 14, 
    marginBottom: 6,
    lineHeight: 20,
  },
  loginSection: { 
    marginTop: 20, 
    marginBottom: 30,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
  },
  loginText: { 
    color: '#666', 
    textAlign: 'center', 
    fontSize: 16,
  },
  loginLink: { 
    color: '#2E7D32', 
    fontWeight: 'bold',
  },
});


