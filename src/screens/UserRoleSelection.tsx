import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Animated, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Screen, Title, Body, FloatingChatbotButton, ChatbotModal } from '../components/UI';
import { useTheme } from '../theme/theme';

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
    description: { en: 'Earn money delivering orders', fr: 'Gagnez de l’argent en livrant' },
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
      <TouchableOpacity style={[styles.langBtn, selected === 'en' && styles.langBtnActive]} onPress={() => onChange('en')}><Text style={styles.langBtnText}>EN</Text></TouchableOpacity>
      <TouchableOpacity style={[styles.langBtn, selected === 'fr' && styles.langBtnActive]} onPress={() => onChange('fr')}><Text style={styles.langBtnText}>FR</Text></TouchableOpacity>
    </View>
  );
}

function RoleCard({ role, lang, onPress }: any) {
  return (
    <TouchableOpacity style={[styles.roleCard, { borderColor: role.accent }]} onPress={onPress}>
      <Text style={styles.roleIcon}>{role.icon}</Text>
      <Text style={[styles.roleTitle, { color: role.accent }]}>{role.title[lang]}</Text>
      <Text style={styles.roleDesc}>{role.description[lang]}</Text>
      <View style={styles.benefitsList}>
        {role.benefits.map((b: string, i: number) => (
          <Text key={i} style={styles.benefitItem}>• {b}</Text>
        ))}
      </View>
    </TouchableOpacity>
  );
}

export default function UserRoleSelection({ navigation }: NativeStackScreenProps<RootStackParamList, 'UserRoleSelection'>) {
  const { colors } = useTheme();
  const [lang, setLang] = useState('en');
  const [chatbotVisible, setChatbotVisible] = React.useState(false);
  const slideAnim = useRef(new Animated.Value(60)).current;
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Screen>
      <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
        <Title style={{ textAlign: 'center', marginTop: 8 }}>Choose your role</Title>
        <LanguageSelector selected={lang} onChange={setLang} />
        <ScrollView contentContainerStyle={{ gap: 18, marginTop: 18, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          {roles.map((role) => (
            <RoleCard key={role.key} role={role} lang={lang} onPress={() => navigation.replace(role.route)} />
          ))}
        </ScrollView>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
          <Body style={{ color: colors.primary, textAlign: 'center', fontWeight: 'bold' }}>{lang === 'fr' ? 'Déjà inscrit ? Connexion' : 'Already have account? Login'}</Body>
        </TouchableOpacity>
      </Animated.View>
      <FloatingChatbotButton onPress={() => setChatbotVisible(true)} />
      <ChatbotModal visible={chatbotVisible} onClose={() => setChatbotVisible(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  langRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 12 },
  langBtn: { backgroundColor: '#eee', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 6, marginHorizontal: 2 },
  langBtnActive: { backgroundColor: '#2E7D32' },
  langBtnText: { color: '#222', fontWeight: 'bold' },
  roleCard: { 
    backgroundColor: 'white', 
    borderRadius: 20, 
    borderWidth: 2, 
    padding: 20, 
    marginHorizontal: 8, 
    alignItems: 'center', 
    elevation: 6, 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 12, 
    shadowOffset: { width: 0, height: 6 },
    transform: [{ scale: 1 }] // Prepared for press animations
  },
  roleIcon: { fontSize: 40, marginBottom: 8 },
  roleTitle: { fontWeight: 'bold', fontSize: 20, marginBottom: 2 },
  roleDesc: { color: '#888', fontSize: 14, marginBottom: 8, textAlign: 'center' },
  benefitsList: { alignItems: 'flex-start', width: '100%', marginTop: 4 },
  benefitItem: { color: '#2E7D32', fontSize: 13, marginBottom: 2 },
  loginLink: { marginTop: 18, alignSelf: 'center' },
});


