import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Animated, ScrollView, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Screen, Title, Body } from '../../components/UI';
import { useTheme } from '../../theme/theme';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

type RoleDef = {
  key: 'customer' | 'shopper' | 'store';
  title: { en: string; tw: string };
  description: { en: string; tw: string };
  icon: string;
  benefits: { en: string; tw: string }[];
  accent: string;
  route: 'CustomerLogin' | 'ShopperLogin' | 'StoreOwnerLogin';
};

const roles: RoleDef[] = [
  {
    key: 'customer',
    title: { en: 'Customer', tw: 'Odɔfoɔ' },
    description: { en: 'Shop groceries conveniently', tw: 'Tɔ wo nneɛma wɔ saa saa' },
    icon: '🛒',
    benefits: [
      { en: 'Browse local stores', tw: 'Hwɛ wo dɔɔni a ɛwɔ wo ha' },
      { en: 'Fast delivery', tw: 'Fa wo nneɛma akɔ wo fie wɔ saa saa' },
      { en: 'Secure payments', tw: 'Sika a wo tumi de wo werɛ so' },
      { en: 'Track orders', tw: 'Hwɛ wo nneɛma ba' }
    ],
    accent: '#2E7D32',
    route: 'CustomerLogin',
  },
  {
    key: 'shopper',
    title: { en: 'Shopper', tw: 'Akwantufoɔ' },
    description: { en: 'Earn money delivering orders', tw: 'Yɛ sika wɔ wo akwantu so' },
    icon: '🚚',
    benefits: [
      { en: 'Flexible hours', tw: 'Saa saa a wo tumi yɛ' },
      { en: 'Earn money', tw: 'Yɛ sika' },
      { en: 'Weekly payouts', tw: 'Fa wo sika wɔ dapaa so' },
      { en: 'GPS navigation', tw: 'GPS a ɛkyerɛ wo kwan' }
    ],
    accent: '#FF9800',
    route: 'ShopperLogin',
  },
  {
    key: 'store',
    title: { en: 'Store Owner', tw: 'Dɔɔni' },
    description: { en: 'Manage your business digitally', tw: 'Hwɛ wo adwuma wɔ computer so' },
    icon: '🏬',
    benefits: [
      { en: 'Inventory management', tw: 'Hwɛ wo nneɛma' },
      { en: 'Reach more customers', tw: 'Fa wo odɔfoɔ pii' },
      { en: 'Analytics dashboard', tw: 'Hwɛ wo adwuma yɛ' },
      { en: 'Automated orders', tw: 'Nneɛma a ɛyɛ wo so' }
    ],
    accent: '#388E3C',
    route: 'StoreOwnerLogin',
  },
];

function LanguageSelector({ selected, onChange }: { selected: 'en' | 'tw'; onChange: (lang: 'en' | 'tw') => void }) {
  return (
    <View style={styles.langRow}>
      <TouchableOpacity style={[styles.langBtn, selected === 'en' && styles.langBtnActive]} onPress={() => onChange('en')}>
        <Text style={[styles.langBtnText, selected === 'en' && styles.langBtnTextActive]}>EN</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.langBtn, selected === 'tw' && styles.langBtnActive]} onPress={() => onChange('tw')}>
        <Text style={[styles.langBtnText, selected === 'tw' && styles.langBtnTextActive]}>TW</Text>
      </TouchableOpacity>
    </View>
  );
}

function RoleCard({ role, lang, onPress }: { role: RoleDef; lang: 'en' | 'tw'; onPress: () => void }) {
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
          {role.benefits.map((b: { en: string; tw: string }, i: number) => (
            <Text key={i} style={styles.benefitItem}>• {b[lang]}</Text>
          ))}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function UserRoleSelection({ navigation }: NativeStackScreenProps<RootStackParamList, 'UserRoleSelection'>) {
  const { colors } = useTheme();
  const [lang, setLang] = useState<'en' | 'tw'>('en');
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
        <Title style={styles.mainTitle}>{lang === 'tw' ? 'Paw wo dwuma' : 'Choose your role'}</Title>
        <LanguageSelector selected={lang} onChange={setLang} />
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {roles.map((role) => (
            <RoleCard key={role.key} role={role} lang={lang} onPress={() => navigation.navigate(role.route)} />
          ))}
        </ScrollView>
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

});


