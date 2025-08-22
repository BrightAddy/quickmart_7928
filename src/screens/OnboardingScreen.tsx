import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Easing,
  PanResponder,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';

// Import the 3 main slide images
const slide1Image = require('../../assets/images/slide1-delivery.svg');
const slide2Image = require('../../assets/images/slide2-shopping.svg');
const slide3Image = require('../../assets/images/slide3-earnings.svg');

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: any;
}

const onboardingData: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Fast Delivery to Your Door',
    description: 'Get your groceries delivered by our reliable delivery partners in minutes.',
    image: slide1Image,
  },
  {
    id: '2',
    title: 'Shop Smart, Save More',
    description: 'Browse thousands of products and get the best deals with our smart recommendations.',
    image: slide2Image,
  },
  {
    id: '3',
    title: 'Earn While You Deliver',
    description: 'Join our delivery network and earn money by delivering groceries to customers.',
    image: slide3Image,
  }
];

export default function OnboardingScreen({ navigation }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const produceAnim = useRef(new Animated.Value(0)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(produceAnim, {
        toValue: 1,
        duration: 1200,
        delay: 300,
        useNativeDriver: true,
      })
    ]).start();

    // Floating animation for produce
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 3000,
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
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          delay: 200,
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
    outputRange: [0, -15],
  });



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

        <TouchableOpacity style={styles.skipButton} onPress={skipOnboarding}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
          }
        ]}
        {...panResponder.panHandlers}
      >
                 {/* Main Illustration */}
         <Animated.View 
           style={[
             styles.illustrationContainer,
             {
               transform: [{ translateY: floatingTransform }],
               opacity: produceAnim
             }
           ]}
         >
           <Image 
             source={currentData.image} 
             style={styles.mainIllustration} 
             resizeMode="contain"
           />
         </Animated.View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{currentData.title}</Text>
          <Text style={styles.description}>{currentData.description}</Text>
        </View>
      </Animated.View>

      {/* Bottom Section with Fade Effect */}
      <View style={styles.bottomContainer}>
        {/* Fade overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(248, 252, 248, 0.8)', '#F8FCF8']}
          style={styles.fadeOverlay}
        />
        
        {/* Progress Dots */}
        <View style={styles.progressContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                {
                  backgroundColor: index === currentSlide ? '#4CAF50' : '#E0E0E0',
                  transform: [{ scale: index === currentSlide ? 1.2 : 1 }]
                }
              ]}
            />
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={nextSlide}
        >
          <Text style={styles.nextButtonText}>
            {currentSlide === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
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
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#FF8C00',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
     illustrationContainer: {
     alignItems: 'center',
     marginBottom: 40,
     position: 'relative',
   },
   mainIllustration: {
     width: 300,
     height: 200,
   },
  produceItem: {
    position: 'absolute',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  produceImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F8F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  mistyBase: {
    position: 'absolute',
    bottom: -20,
    width: 250,
    height: 40,
    backgroundColor: 'rgba(232, 245, 232, 0.6)',
    borderRadius: 20,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomContainer: {
    position: 'relative',
    paddingBottom: 40,
  },
  fadeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
     nextButtonText: {
     fontSize: 18,
     fontWeight: '600',
     color: '#FFF',
   },
   fallbackShape: {
     position: 'absolute',
     width: '100%',
     height: '100%',
     justifyContent: 'center',
     alignItems: 'center',
     borderRadius: 20,
   },
       fallbackText: {
      fontSize: 20,
      color: '#FFF',
    },
    illustration: {
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    illustrationIcon: {
      fontSize: 24,
    },
  });
