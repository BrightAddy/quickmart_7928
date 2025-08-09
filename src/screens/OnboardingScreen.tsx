import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
  Easing,
  PanResponder,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme/theme';
import { Screen, GhanaianLoader, KenteAccent } from '../components/UI';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  titleTwi?: string;
  descriptionTwi?: string;
  illustration: string;
  backgroundColor: string;
  features: string[];
}

const onboardingData: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Welcome to QuickMart',
    titleTwi: 'Akwaaba QuickMart',
    description: 'Shop groceries from local stores in Ghana with ease',
    descriptionTwi: 'Tɔ aduan fi mpɔtam hɔ stores wɔ Ghana mu a ɛyɛ mmerɛw',
    illustration: '🛒',
    backgroundColor: '#2E7D32',
    features: ['Local Ghanaian stores', 'Fast delivery', 'Fresh products']
  },
  {
    id: '2',
    title: 'AI-Powered Chat Support',
    titleTwi: 'AI Chatbot Mmoa',
    description: 'Get help in English, Twi, Ga, or Ewe anytime',
    descriptionTwi: 'Nya mmoa wɔ Borɔfo, Twi, Ga, anaa Ewe mu bere biara',
    illustration: '🤖',
    backgroundColor: '#FFB300',
    features: ['24/7 Support', 'Local languages', 'Smart assistance']
  },
  {
    id: '3',
    title: 'Smart Image Recognition',
    titleTwi: 'Smart Mfoni Recognition',
    description: 'Scan products to verify and identify items instantly',
    descriptionTwi: 'Scan nneɛma na wo ahu ne identify ntɛmntɛm',
    illustration: '📸',
    backgroundColor: '#DC143C',
    features: ['Product verification', 'Quick identification', 'Inventory help']
  },
  {
    id: '4',
    title: 'Choose Your Role',
    titleTwi: 'Paw Wo Role',
    description: 'Customer, Shopper, or Store Owner - we support all',
    descriptionTwi: 'Customer, Shopper, anaa Store Owner - yɛboa obiara',
    illustration: '👥',
    backgroundColor: '#2E7D32',
    features: ['Multiple user types', 'Earn money', 'Grow business']
  }
];

export default function OnboardingScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showTwi, setShowTwi] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      })
    ]).start();

    // Floating animation for illustrations
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    // Animate slide changes
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: currentSlide,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        })
      ])
    ]).start();
  }, [currentSlide]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 50 && currentSlide > 0) {
        setCurrentSlide(currentSlide - 1);
      } else if (gestureState.dx < -50 && currentSlide < onboardingData.length - 1) {
        setCurrentSlide(currentSlide + 1);
      }
    },
  });

  const nextSlide = () => {
    if (currentSlide < onboardingData.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.replace('UserRoleSelection');
    }
  };

  const skipOnboarding = () => {
    navigation.replace('UserRoleSelection');
  };

  const currentData = onboardingData[currentSlide];
  const floatingTransform = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <Screen style={[styles.container, { backgroundColor: currentData.backgroundColor }]}>
      <KenteAccent style={styles.kenteAccent} />
      
      {/* Skip Button */}
      <TouchableOpacity 
        style={styles.skipButton} 
        onPress={skipOnboarding}
        accessibilityLabel="Skip onboarding"
        accessibilityHint="Skip the introduction and go to role selection"
      >
        <Text style={[styles.skipText, { color: colors.onPrimary }]}>Skip</Text>
      </TouchableOpacity>

      {/* Language Toggle */}
      <TouchableOpacity 
        style={styles.languageToggle} 
        onPress={() => setShowTwi(!showTwi)}
        accessibilityLabel={showTwi ? "Switch to English" : "Switch to Twi"}
      >
        <Text style={[styles.languageText, { color: colors.onPrimary }]}>
          {showTwi ? 'EN' : 'TWI'}
        </Text>
      </TouchableOpacity>

      <Animated.View 
        style={[
          styles.slideContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
        {...panResponder.panHandlers}
      >
        {/* Illustration */}
        <Animated.View 
          style={[
            styles.illustrationContainer,
            { transform: [{ translateY: floatingTransform }] }
          ]}
        >
          <Text style={styles.illustration}>{currentData.illustration}</Text>
          <View style={styles.illustrationGlow} />
        </Animated.View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: colors.onPrimary }]}>
            {showTwi && currentData.titleTwi ? currentData.titleTwi : currentData.title}
          </Text>
          
          <Text style={[styles.description, { color: colors.onPrimary + 'cc' }]}>
            {showTwi && currentData.descriptionTwi ? currentData.descriptionTwi : currentData.description}
          </Text>

          {/* Features */}
          <View style={styles.featuresContainer}>
            {currentData.features.map((feature, index) => (
              <Animated.View 
                key={index}
                style={[
                  styles.featureItem,
                  {
                    opacity: fadeAnim,
                    transform: [{
                      translateX: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      })
                    }]
                  }
                ]}
              >
                <View style={[styles.featureDot, { backgroundColor: colors.onPrimary }]} />
                <Text style={[styles.featureText, { color: colors.onPrimary + 'ee' }]}>
                  {feature}
                </Text>
              </Animated.View>
            ))}
          </View>
        </View>
      </Animated.View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {onboardingData.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setCurrentSlide(index)}
            style={[
              styles.progressDot,
              {
                backgroundColor: index === currentSlide 
                  ? colors.onPrimary 
                  : colors.onPrimary + '44',
                transform: [{ scale: index === currentSlide ? 1.2 : 1 }]
              }
            ]}
            accessibilityLabel={`Go to slide ${index + 1}`}
          />
        ))}
      </View>

      {/* Next Button */}
      <TouchableOpacity 
        style={[styles.nextButton, { backgroundColor: colors.onPrimary }]}
        onPress={nextSlide}
        accessibilityLabel={currentSlide === onboardingData.length - 1 ? "Get started" : "Next slide"}
      >
        <Text style={[styles.nextButtonText, { color: currentData.backgroundColor }]}>
          {currentSlide === onboardingData.length - 1 ? 'Get Started' : 'Next'}
        </Text>
        <Text style={styles.nextButtonIcon}>→</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  kenteAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    opacity: 0.3,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    zIndex: 10,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  languageToggle: {
    position: 'absolute',
    top: 50,
    left: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    zIndex: 10,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingTop: 100,
    paddingBottom: 120,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  illustration: {
    fontSize: 120,
    textAlign: 'center',
  },
  illustrationGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -20,
    left: -20,
  },
  contentContainer: {
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    alignSelf: 'stretch',
    paddingHorizontal: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    gap: 8,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  nextButtonIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
