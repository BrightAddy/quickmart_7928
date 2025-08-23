import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing, Text, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/theme';

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const ingredientsOpacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo animation
    Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ]).start();

    // Text animation
    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 1000,
      delay: 600,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();

    // Ingredients animation
    Animated.timing(ingredientsOpacity, {
      toValue: 1,
      duration: 1200,
      delay: 800,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();

    // Progress bar animation
    Animated.timing(progressWidth, {
      toValue: width - 80,
      duration: 2500,
      delay: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();

    // Navigate after animations
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: '#F8F6F2' }]}>
      {/* Wooden texture background */}
      <View style={styles.woodenBackground} />
      
      {/* Main Content */}
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            }
          ]}
        >
          <View style={styles.logoBox}>
            <View style={styles.chefHat}>
              <View style={styles.hatBase} />
              <View style={styles.hatTop} />
              <View style={styles.leaves}>
                <Text style={styles.leaf1}>🌿</Text>
                <Text style={styles.leaf2}>🌱</Text>
              </View>
              <View style={styles.ingredientLine} />
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
          <Text style={styles.brandTitle}>Fresh</Text>
          <Text style={styles.brandSubtitle}>Groceries</Text>
          <Text style={styles.tagline}>Delivered to your door</Text>
        </Animated.View>

        {/* Fresh ingredients decoration */}
        <Animated.View style={[styles.ingredientsContainer, { opacity: ingredientsOpacity }]}>
          <View style={styles.ingredientRow}>
            <Text style={styles.ingredient}>🍅</Text>
            <Text style={styles.ingredient}>🥬</Text>
            <Text style={styles.ingredient}>🧄</Text>
            <Text style={styles.ingredient}>🌿</Text>
          </View>
          <View style={styles.ingredientRow}>
            <Text style={styles.ingredient}>🥑</Text>
            <Text style={styles.ingredient}>🥕</Text>
            <Text style={styles.ingredient}>🍎</Text>
            <Text style={styles.ingredient}>🥦</Text>
          </View>
        </Animated.View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { 
                width: progressWidth,
                backgroundColor: '#8B4513'
              }
            ]} 
          />
        </View>
        <Text style={styles.loadingText}>Preparing fresh ingredients...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  woodenBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#F8F6F2',
    opacity: 0.8,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBox: {
    width: 140,
    height: 140,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B4513',
    shadowOpacity: 0.15,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
    borderWidth: 1,
    borderColor: '#E8E0D8',
  },
  chefHat: {
    position: 'relative',
    alignItems: 'center',
  },
  hatBase: {
    width: 60,
    height: 20,
    backgroundColor: '#8B4513',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#654321',
  },
  hatTop: {
    width: 80,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#E8E0D8',
    marginTop: -10,
  },
  leaves: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  leaf1: {
    fontSize: 20,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  leaf2: {
    fontSize: 16,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  ingredientLine: {
    position: 'absolute',
    bottom: -5,
    width: 40,
    height: 3,
    backgroundColor: '#FFA500',
    borderRadius: 2,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#8B4513',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 4,
    fontFamily: 'System',
  },
  brandSubtitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#228B22',
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: 8,
    fontFamily: 'System',
  },
  tagline: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    letterSpacing: 0.8,
    fontStyle: 'italic',
  },
  ingredientsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  ingredient: {
    fontSize: 24,
    marginHorizontal: 8,
    opacity: 0.8,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E8E0D8',
    borderRadius: 3,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  loadingText: {
    color: '#8B4513',
    fontSize: 14,
    letterSpacing: 0.5,
    fontStyle: 'italic',
  },
});


