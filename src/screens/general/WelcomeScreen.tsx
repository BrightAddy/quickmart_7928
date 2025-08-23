import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Welcome'>) {
  const [selectedLang, setSelectedLang] = useState('en');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

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
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 1200,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleStartShopping = () => {
    navigation.navigate('Onboarding');
  };

  return (
    <View style={styles.container}>
              {/* Background Gradient */}
        <LinearGradient
          colors={['#E8F5E8', '#F0F8F0', '#F8FCF8']}
          style={styles.background}
        />

      {/* Language Selector */}
      <View style={styles.languageContainer}>
        <TouchableOpacity 
          style={[styles.langBtn, selectedLang === 'en' && styles.langBtnActive]} 
          onPress={() => setSelectedLang('en')}
        >
          <Text style={[styles.langText, selectedLang === 'en' && styles.langTextActive]}>EN</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.langBtn, selectedLang === 'tw' && styles.langBtnActive]} 
          onPress={() => setSelectedLang('tw')}
        >
          <Text style={[styles.langText, selectedLang === 'tw' && styles.langTextActive]}>TW</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.characterContainer}>
            <View style={styles.character}>
              <View style={styles.head} />
              <View style={styles.body} />
              <View style={styles.arm} />
              <View style={styles.leg} />
              <View style={styles.orange} />
            </View>
          </View>
          
          <View style={styles.cartContainer}>
            <View style={styles.cart} />
            <View style={styles.oranges}>
              <View style={styles.orange1} />
              <View style={styles.orange2} />
              <View style={styles.orange3} />
            </View>
          </View>

          {/* Background Shapes */}
          <View style={styles.backgroundShape1} />
          <View style={styles.backgroundShape2} />
          
          {/* Decorative Orbs */}
          <View style={styles.orb1} />
          <View style={styles.orb2} />
          <View style={styles.orb3} />
        </View>

        {/* Text Section */}
        <View style={styles.textSection}>
          <Text style={styles.title}>
            {selectedLang === 'tw' ? 'Yɛɛ wo ho yie na tɔ' : 'Realax and shop'}
          </Text>
          <Text style={styles.description}>
            {selectedLang === 'tw' 
              ? 'Tɔ wo nneɛma wɔ internet so na fa wo nneɛma akɔ wo fie wɔ saa ɔduruu saa saa.'
              : 'Shop online and get grocories delivered from stores to your home in as fast as 1 hour .'
            }
          </Text>
        </View>

        {/* Action Button */}
        <Animated.View 
          style={[
            styles.buttonContainer,
            {
              opacity: buttonAnim,
              transform: [{ translateY: buttonAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })}]
            }
          ]}
        >
          <TouchableOpacity style={styles.startShoppingButton} onPress={handleStartShopping}>
            <Text style={styles.startShoppingText}>
              {selectedLang === 'tw' ? 'Fɛɛ aseɛ tɔ' : 'Start Shopping'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E8',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 60,
    gap: 12,
  },
  langBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 140, 0, 0.3)',
  },
  langBtnActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  langText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  langTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  illustrationContainer: {
    width: width * 0.8,
    height: height * 0.4,
    position: 'relative',
    marginBottom: 40,
  },
  characterContainer: {
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 3,
  },
  character: {
    position: 'relative',
  },
  head: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8B4513',
    marginBottom: 8,
  },
  body: {
    width: 32,
    height: 40,
    backgroundColor: '#FF8C00',
    borderRadius: 16,
  },
  arm: {
    position: 'absolute',
    right: -8,
    top: 8,
    width: 20,
    height: 8,
    backgroundColor: '#FF8C00',
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
  },
  leg: {
    position: 'absolute',
    left: 4,
    bottom: -8,
    width: 8,
    height: 20,
    backgroundColor: '#FF8C00',
    borderRadius: 4,
    transform: [{ rotate: '15deg' }],
  },
  orange: {
    position: 'absolute',
    right: -12,
    top: 4,
    width: 16,
    height: 16,
    backgroundColor: '#FFA500',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#228B22',
  },
  cartContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    zIndex: 2,
  },
  cart: {
    width: 60,
    height: 40,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  oranges: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  orange1: {
    width: 12,
    height: 12,
    backgroundColor: '#FFA500',
    borderRadius: 6,
  },
  orange2: {
    width: 10,
    height: 10,
    backgroundColor: '#FFA500',
    borderRadius: 5,
  },
  orange3: {
    width: 8,
    height: 8,
    backgroundColor: '#FFA500',
    borderRadius: 4,
  },
  backgroundShape1: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 120,
    height: 120,
    backgroundColor: '#FFE4B5',
    borderRadius: 60,
    opacity: 0.6,
    zIndex: 1,
  },
  backgroundShape2: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 80,
    height: 60,
    backgroundColor: '#FFD700',
    borderRadius: 20,
    opacity: 0.4,
    zIndex: 1,
  },
  orb1: {
    position: 'absolute',
    left: 20,
    bottom: 40,
    width: 8,
    height: 8,
    backgroundColor: '#FF8C00',
    borderRadius: 4,
    zIndex: 1,
  },
  orb2: {
    position: 'absolute',
    right: 40,
    bottom: 60,
    width: 6,
    height: 6,
    backgroundColor: '#FF8C00',
    borderRadius: 3,
    zIndex: 1,
  },
  orb3: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 10,
    height: 10,
    backgroundColor: '#FF8C00',
    borderRadius: 5,
    zIndex: 1,
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 38,
  },
  description: {
    fontSize: 16,
    color: '#2E7D32',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  startShoppingButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  startShoppingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
