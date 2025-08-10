import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Mail, Phone, Globe, MapPin, Heart, Shield, Truck, ShoppingBag } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Layout from '@/constants/layout';

export default function AboutScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };
  
  const openEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(err => console.error("Couldn't open email client", err));
  };
  
  const openPhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(err => console.error("Couldn't open phone app", err));
  };
  
  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop' }}
          style={styles.headerImage}
        />
        <View style={styles.overlay} />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>About QuickMart</Text>
          <Text style={styles.headerSubtitle}>
            Your trusted grocery delivery platform
          </Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.paragraph}>
          At QuickMart, we're on a mission to revolutionize how people shop for groceries. 
          We believe that everyone deserves access to fresh, quality products without the hassle 
          of traditional shopping. Our platform connects customers with local stores for fast, 
          reliable delivery right to your doorstep.
        </Text>
      </View>
      
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Why Choose QuickMart</Text>
        
        <View style={styles.featureRow}>
          <View style={styles.feature}>
            <View style={styles.featureIconContainer}>
              <Truck size={24} color={Colors.primary} />
            </View>
            <Text style={styles.featureTitle}>Fast Delivery</Text>
            <Text style={styles.featureDescription}>
              Get your groceries delivered in as little as 1 hour
            </Text>
          </View>
          
          <View style={styles.feature}>
            <View style={styles.featureIconContainer}>
              <ShoppingBag size={24} color={Colors.primary} />
            </View>
            <Text style={styles.featureTitle}>Wide Selection</Text>
            <Text style={styles.featureDescription}>
              Shop from thousands of products across multiple stores
            </Text>
          </View>
        </View>
        
        <View style={styles.featureRow}>
          <View style={styles.feature}>
            <View style={styles.featureIconContainer}>
              <Shield size={24} color={Colors.primary} />
            </View>
            <Text style={styles.featureTitle}>Secure Payments</Text>
            <Text style={styles.featureDescription}>
              Multiple payment options with secure transactions
            </Text>
          </View>
          
          <View style={styles.feature}>
            <View style={styles.featureIconContainer}>
              <Heart size={24} color={Colors.primary} />
            </View>
            <Text style={styles.featureTitle}>Customer First</Text>
            <Text style={styles.featureDescription}>
              Dedicated support team to assist you every step of the way
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Story</Text>
        <Text style={styles.paragraph}>
          QuickMart was founded in 2023 with a simple idea: make grocery shopping easier for everyone. 
          What started as a small operation in one city has quickly grown into a platform serving 
          multiple regions, connecting thousands of customers with their favorite local stores.
        </Text>
        <Text style={styles.paragraph}>
          Our team is passionate about creating technology that makes everyday life simpler. 
          We're constantly innovating and improving our service to provide the best possible 
          experience for both customers and store partners.
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => openEmail('support@quickmart.com')}
        >
          <View style={styles.contactIconContainer}>
            <Mail size={20} color={Colors.primary} />
          </View>
          <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>Email</Text>
            <Text style={styles.contactValue}>support@quickmart.com</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => openPhone('+18001234567')}
        >
          <View style={styles.contactIconContainer}>
            <Phone size={20} color={Colors.primary} />
          </View>
          <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>Phone</Text>
            <Text style={styles.contactValue}>+1 (800) 123-4567</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => openLink('https://quickmart.com')}
        >
          <View style={styles.contactIconContainer}>
            <Globe size={20} color={Colors.primary} />
          </View>
          <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>Website</Text>
            <Text style={styles.contactValue}>www.quickmart.com</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => openLink('https://maps.google.com')}
        >
          <View style={styles.contactIconContainer}>
            <MapPin size={20} color={Colors.primary} />
          </View>
          <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>Headquarters</Text>
            <Text style={styles.contactValue}>123 Delivery Street, San Francisco, CA 94107</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2023-2025 QuickMart. All rights reserved.
        </Text>
        <View style={styles.footerLinks}>
          <TouchableOpacity onPress={() => openLink('https://quickmart.com/terms')}>
            <Text style={styles.footerLink}>Terms of Service</Text>
          </TouchableOpacity>
          <Text style={styles.footerDivider}>•</Text>
          <TouchableOpacity onPress={() => openLink('https://quickmart.com/privacy')}>
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    height: 200,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Layout.padding,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
  },
  section: {
    padding: Layout.padding,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.text,
    marginBottom: 16,
  },
  featuresSection: {
    padding: Layout.padding,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  feature: {
    width: '48%',
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'center',
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    color: Colors.primary,
  },
  footer: {
    padding: Layout.padding,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 12,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLink: {
    fontSize: 14,
    color: Colors.primary,
  },
  footerDivider: {
    marginHorizontal: 8,
    color: Colors.subtext,
  },
});