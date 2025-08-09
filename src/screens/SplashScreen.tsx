import React, { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator, Image, StyleSheet, Animated, Easing, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme/theme';
import { AdinkraLoader, KenteAccent, GhanaGradient } from '../components/UI';

const loadingTexts = [
  'Initializing...',
  'Loading preferences...',
  'Preparing your experience...',
  'Almost ready...'
];

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const spinnerRotate = useRef(new Animated.Value(0)).current;
  const [loadingIdx, setLoadingIdx] = useState(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 1200,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 900,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ]).start();
    Animated.loop(
      Animated.timing(spinnerRotate, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
    const textInterval = setInterval(() => {
      setLoadingIdx((idx) => (idx + 1) % loadingTexts.length);
    }, 900);
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 1800);
    return () => {
      clearTimeout(timer);
      clearInterval(textInterval);
    };
  }, [navigation]);

  const rotate = spinnerRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>  
      <Animated.View
        style={{
          transform: [
            { scale: logoScale },
          ],
          opacity: logoOpacity,
          alignItems: 'center',
        }}
      >
        <View style={styles.logoBox}>
          <Image
            source={require('../../assets/images/no-image.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.brandTitle}>QuickMart</Text>
        <Text style={styles.brandSubtitle}>Your favorite groceries, delivered fast</Text>
      </Animated.View>
      <View style={{ height: 40 }} />
      <AdinkraLoader size={60} symbol="gye_nyame" />
      <Text style={[styles.loadingText, { color: colors.onPrimary + 'cc' }]}>{loadingTexts[loadingIdx]}</Text>
      
      {/* Add cultural accents */}
      <KenteAccent style={{ position: 'absolute', top: 50, left: 20 }} animated />
      <KenteAccent style={{ position: 'absolute', bottom: 100, right: 30, width: 40, height: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    width: 140,
    height: 140,
    borderRadius: 32,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  logo: { width: 100, height: 100 },
  brandTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginTop: 8, letterSpacing: 1.2 },
  brandSubtitle: { fontSize: 15, color: '#fff', opacity: 0.9, textAlign: 'center', marginTop: 2, letterSpacing: 0.5 },
  spinnerCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  loadingText: {
    color: '#fff',
    fontSize: 15,
    marginTop: 12,
    opacity: 0.8,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});


