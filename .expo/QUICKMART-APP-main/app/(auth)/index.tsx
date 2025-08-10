import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Button from '@/components/Button';
import Colors from '@/constants/colors';

export default function WelcomeScreen() {
  const router = useRouter();
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=500&auto=format&fit=crop' }} 
            style={styles.logoBackground}
          />
          <View style={styles.logoOverlay}>
            <Text style={styles.appName}>QuickMart</Text>
            <Text style={styles.tagline}>Groceries delivered to your doorstep</Text>
          </View>
        </View>
        
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=500&auto=format&fit=crop' }} 
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>Fast Delivery</Text>
            <Text style={styles.featureDescription}>Get your groceries delivered within hours</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>Wide Selection</Text>
            <Text style={styles.featureDescription}>Choose from thousands of products</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>Secure Payments</Text>
            <Text style={styles.featureDescription}>Pay with Mobile Money or card</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Button 
          title="Login" 
          onPress={() => router.push('/login')}
          variant="primary"
          style={styles.button}
        />
        
        <Button 
          title="Create Account" 
          onPress={() => router.push('/register')}
          variant="outline"
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    width: 120,
    height: 120,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  logoBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  logoOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: 16,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.8,
    marginTop: 8,
    textAlign: 'center',
  },
  heroContainer: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 32,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  featuresContainer: {
    width: '100%',
  },
  featureItem: {
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.8,
  },
  footer: {
    width: '100%',
    padding: 24,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  button: {
    marginBottom: 16,
  },
});