import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Globe, Calendar } from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';
import Layout from '@/constants/layout';

export default function PrivacyScreen() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  const styles = createStyles(Colors);
  
  return (
    <View style={styles.container}>
      <StatusBar style={isDarkMode ? \"light\" : \"dark\"} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <Text style={styles.headerSubtitle}>Last updated: January 15, 2024</Text>
        </View>
        
        <View style={styles.headerIcon}>
          <Shield size={24} color={Colors.primary} />
        </View>
      </View>
      
      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Introduction */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Eye size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Your Privacy Matters</Text>
          </View>
          <Text style={styles.paragraph}>
            At QuickMart, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, share, and protect your information when you use our grocery delivery services.
          </Text>
          <Text style={styles.paragraph}>
            By using QuickMart, you consent to the practices described in this Privacy Policy. We encourage you to read this policy carefully to understand how we handle your information.
          </Text>
        </View>
        
        {/* Information We Collect */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Database size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Information We Collect</Text>
          </View>
          
          <Text style={styles.subSectionTitle}>1.1 Information You Provide</Text>
          <Text style={styles.paragraph}>
            When you create an account or use our services, you may provide us with:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• Personal details (name, email, phone number)</Text>
            <Text style={styles.bulletPoint}>• Delivery addresses and location information</Text>
            <Text style={styles.bulletPoint}>• Payment information (credit cards, mobile money accounts)</Text>
            <Text style={styles.bulletPoint}>• Order history and preferences</Text>
            <Text style={styles.bulletPoint}>• Reviews and ratings</Text>
            <Text style={styles.bulletPoint}>• Customer support communications</Text>
          </View>
          
          <Text style={styles.subSectionTitle}>1.2 Information We Collect Automatically</Text>
          <Text style={styles.paragraph}>
            When you use our app, we automatically collect:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• Device information (device type, operating system, unique identifiers)</Text>
            <Text style={styles.bulletPoint}>• Usage data (app interactions, features used, time spent)</Text>
            <Text style={styles.bulletPoint}>• Location data (with your permission)</Text>
            <Text style={styles.bulletPoint}>• Log information (IP address, access times, error logs)</Text>
            <Text style={styles.bulletPoint}>• Cookies and similar tracking technologies</Text>
          </View>
          
          <Text style={styles.subSectionTitle}>1.3 Information from Third Parties</Text>
          <Text style={styles.paragraph}>
            We may receive information from:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• Partner stores and suppliers</Text>
            <Text style={styles.bulletPoint}>• Payment processors</Text>
            <Text style={styles.bulletPoint}>• Delivery partners</Text>
            <Text style={styles.bulletPoint}>• Social media platforms (if you choose to connect)</Text>
            <Text style={styles.bulletPoint}>• Analytics and advertising partners</Text>
          </View>
        </View>
        
        {/* How We Use Your Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use your information to:
          </Text>
          
          <Text style={styles.subSectionTitle}>2.1 Provide Our Services</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• Process and fulfill your orders</Text>
            <Text style={styles.bulletPoint}>• Coordinate delivery with our partners</Text>
            <Text style={styles.bulletPoint}>• Process payments and prevent fraud</Text>
            <Text style={styles.bulletPoint}>• Provide customer support</Text>
            <Text style={styles.bulletPoint}>• Send order confirmations and updates</Text>
          </View>
          
          <Text style={styles.subSectionTitle}>2.2 Improve Our Services</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• Analyze usage patterns and preferences</Text>
            <Text style={styles.bulletPoint}>• Develop new features and functionality</Text>
            <Text style={styles.bulletPoint}>• Optimize delivery routes and timing</Text>
            <Text style={styles.bulletPoint}>• Enhance app performance and security</Text>
          </View>
          
          <Text style={styles.subSectionTitle}>2.3 Communicate with You</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• Send promotional offers and updates</Text>
            <Text style={styles.bulletPoint}>• Notify you about new products and services</Text>
            <Text style={styles.bulletPoint}>• Respond to your inquiries and feedback</Text>
            <Text style={styles.bulletPoint}>• Send important service announcements</Text>
          </View>
        </View>
        
        {/* Information Sharing */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>How We Share Your Information</Text>
          </View>
          
          <Text style={styles.paragraph}>
            We may share your information in the following circumstances:
          </Text>
          
          <Text style={styles.subSectionTitle}>3.1 Service Providers</Text>
          <Text style={styles.paragraph}>
            We share information with trusted third parties who help us operate our business:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• Partner stores (order details for fulfillment)</Text>
            <Text style={styles.bulletPoint}>• Delivery partners (delivery address and contact info)</Text>
            <Text style={styles.bulletPoint}>• Payment processors (payment information)</Text>
            <Text style={styles.bulletPoint}>• Cloud storage and hosting providers</Text>
            <Text style={styles.bulletPoint}>• Analytics and marketing service providers</Text>
          </View>
          
          <Text style={styles.subSectionTitle}>3.2 Legal Requirements</Text>
          <Text style={styles.paragraph}>
            We may disclose your information when required by law or to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• Comply with legal obligations</Text>
            <Text style={styles.bulletPoint}>• Protect our rights and property</Text>
            <Text style={styles.bulletPoint}>• Ensure user safety and security</Text>
            <Text style={styles.bulletPoint}>• Investigate fraud or abuse</Text>
          </View>
          
          <Text style={styles.subSectionTitle}>3.3 Business Transfers</Text>
          <Text style={styles.paragraph}>
            In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity, subject to the same privacy protections.
          </Text>
        </View>
        
        {/* Data Security */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Lock size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Data Security</Text>
          </View>
          
          <Text style={styles.paragraph}>
            We implement robust security measures to protect your information:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• Encryption of data in transit and at rest</Text>
            <Text style={styles.bulletPoint}>• Secure payment processing systems</Text>
            <Text style={styles.bulletPoint}>• Regular security audits and assessments</Text>
            <Text style={styles.bulletPoint}>• Access controls and authentication</Text>
            <Text style={styles.bulletPoint}>• Employee training on data protection</Text>
            <Text style={styles.bulletPoint}>• Incident response procedures</Text>
          </View>
          
          <Text style={styles.paragraph}>
            While we strive to protect your information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security but are committed to protecting your data using industry-standard practices.
          </Text>
        </View>
        
        {/* Your Rights and Choices */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Your Rights and Choices</Text>
          
          <Text style={styles.subSectionTitle}>5.1 Account Information</Text>
          <Text style={styles.paragraph}>
            You can access and update your account information at any time through the app settings.
          </Text>
          
          <Text style={styles.subSectionTitle}>5.2 Communication Preferences</Text>
          <Text style={styles.paragraph}>
            You can control the types of communications you receive from us through your notification settings.
          </Text>
          
          <Text style={styles.subSectionTitle}>5.3 Location Data</Text>
          <Text style={styles.paragraph}>
            You can enable or disable location services for our app through your device settings.
          </Text>
          
          <Text style={styles.subSectionTitle}>5.4 Data Deletion</Text>
          <Text style={styles.paragraph}>
            You can request deletion of your account and associated data by contacting our support team or using the account deletion feature in the app.
          </Text>
          
          <Text style={styles.subSectionTitle}>5.5 Data Portability</Text>
          <Text style={styles.paragraph}>
            You can request a copy of your personal data in a structured, machine-readable format.
          </Text>
        </View>
        
        {/* Data Retention */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Data Retention</Text>
          <Text style={styles.paragraph}>
            We retain your information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Specific retention periods include:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• Account information: Until account deletion</Text>
            <Text style={styles.bulletPoint}>• Order history: 7 years for tax and legal purposes</Text>
            <Text style={styles.bulletPoint}>• Payment information: As required by payment processors</Text>
            <Text style={styles.bulletPoint}>• Support communications: 3 years</Text>
            <Text style={styles.bulletPoint}>• Usage data: 2 years for analytics purposes</Text>
          </View>
        </View>
        
        {/* International Transfers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Globe size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>International Data Transfers</Text>
          </View>
          <Text style={styles.paragraph}>
            Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.
          </Text>
        </View>
        
        {/* Children's Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Children's Privacy</Text>
          <Text style={styles.paragraph}>
            Our services are not intended for children under 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will take steps to delete it promptly.
          </Text>
        </View>
        
        {/* Changes to Privacy Policy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Changes to This Privacy Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• Posting the updated policy in the app</Text>
            <Text style={styles.bulletPoint}>• Sending you an email notification</Text>
            <Text style={styles.bulletPoint}>• Displaying a prominent notice in the app</Text>
          </View>
          <Text style={styles.paragraph}>
            Your continued use of our services after any changes constitutes acceptance of the updated policy.
          </Text>
        </View>
        
        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactItem}>Email: privacy@quickmart.com</Text>
            <Text style={styles.contactItem}>Phone: +1 (800) 123-4567</Text>
            <Text style={styles.contactItem}>Address: 123 Delivery Street, San Francisco, CA 94107</Text>
            <Text style={styles.contactItem}>Data Protection Officer: dpo@quickmart.com</Text>
          </View>
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerIcon}>
            <Calendar size={16} color={Colors.subtext} />
          </View>
          <Text style={styles.footerText}>
            Last updated: January 15, 2024
          </Text>
          <Text style={styles.footerSubtext}>
            This Privacy Policy is effective as of the date last updated and replaces all prior versions.
          </Text>
        </View>
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const createStyles = (Colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.padding,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.subtext,
    marginTop: 2,
  },
  headerIcon: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Layout.padding,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    marginLeft: 8,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    marginTop: 12,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.text,
    marginBottom: 12,
  },
  bulletList: {
    marginLeft: 16,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.text,
    marginBottom: 4,
  },
  contactInfo: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  contactItem: {
    fontSize: 15,
    color: Colors.text,
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  footer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginTop: 16,
  },
  footerIcon: {
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 12,
    color: Colors.subtext,
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 20,
  },
});