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
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  produce: string[];
}

const onboardingData: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Wholesome Organics Without the Cost',
    description: 'Get affordable organic groceries made for everyone, every single day.',
    produce: ['🥬', '🌽', '🫑', '🎃', '🧅', '🥬', '🍎', '🍌', '🍒', '🥕', '🧄', '🥑', '🍋', '🥗']
  },
  {
    id: '2',
    title: 'Fresh From Local Farms',
    description: 'Connect directly with local farmers for the freshest produce delivered to your door.',
    produce: ['🥬', '🌽', '🫑', '🎃', '🧅', '🥬', '🍎', '🍌', '🍒', '🥕', '🧄', '🥑', '🍋', '🥗']
  },
  {
    id: '3',
    title: 'Smart Shopping Made Simple',
    description: 'AI-powered recommendations help you find the best deals and freshest ingredients.',
    produce: ['🥬', '🌽', '🫑', '🎃', '🧅', '🥬', '🍎', '🍌', '🍒', '🥕', '🧄', '🥑', '🍋', '🥗']
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
        {/* Produce Pile */}
        <Animated.View 
          style={[
            styles.produceContainer,
            {
              transform: [{ translateY: floatingTransform }],
              opacity: produceAnim
            }
          ]}
        >
          <View style={styles.producePile}>
            {currentData.produce.map((item, index) => (
              <Animated.Text
                key={index}
                style={[
                  styles.produceItem,
                  {
                    transform: [{
                      translateY: produceAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      })
                    }],
                    opacity: produceAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 0.5, 1],
                    })
                  }
                ]}
              >
                {item}
              </Animated.Text>
            ))}
          </View>
          
          {/* Misty base effect */}
          <View style={styles.mistyBase} />
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
  produceContainer: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  producePile: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 200,
    position: 'relative',
  },
  produceItem: {
    fontSize: 32,
    margin: 4,
    position: 'absolute',
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
});
