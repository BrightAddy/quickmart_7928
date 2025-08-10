import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { 
  HelpCircle, 
  Phone, 
  Mail, 
  MessageCircle, 
  FileText, 
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react-native';
import Colors from '@/constants/colors';

const FAQ_ITEMS = [
  {
    id: '1',
    question: 'How do I update my delivery status?',
    answer: 'You can update your delivery status by tapping on the order in your active deliveries list and selecting the appropriate status update.'
  },
  {
    id: '2',
    question: 'What should I do if a customer is not available?',
    answer: 'Try calling the customer first. If they don\'t answer, wait for 5 minutes and try again. If still no response, contact support for guidance.'
  },
  {
    id: '3',
    question: 'How are my earnings calculated?',
    answer: 'Your earnings include base delivery fee, distance bonus, and customer tips. You can view detailed breakdowns in the Earnings section.'
  },
  {
    id: '4',
    question: 'Can I change my delivery zone?',
    answer: 'Yes, you can update your preferred delivery zones in your profile settings. Changes may take up to 24 hours to take effect.'
  }
];

const SUPPORT_TICKETS = [
  {
    id: '1',
    title: 'Payment Issue - Missing Tip',
    status: 'resolved',
    date: '2024-01-10',
    response: 'Issue resolved - tip has been added to your account'
  },
  {
    id: '2',
    title: 'App Crash During Delivery',
    status: 'in_progress',
    date: '2024-01-08',
    response: 'Our technical team is investigating this issue'
  }
];

export default function SupportScreen() {
  const [activeTab, setActiveTab] = useState<'help' | 'contact' | 'tickets'>('help');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const handlePhoneCall = () => {
    const phoneNumber = '+233123456789';
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Error', 'Unable to make phone call');
    });
  };

  const handleEmail = () => {
    const email = 'support@deliveryapp.com';
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert('Error', 'Unable to open email client');
    });
  };

  const handleWhatsApp = () => {
    const phoneNumber = '+233123456789';
    const message = 'Hello, I need help with my delivery app account.';
    Linking.openURL(`whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`).catch(() => {
      Alert.alert('Error', 'WhatsApp is not installed on your device');
    });
  };

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle size={16} color={Colors.success} />;
      case 'in_progress':
        return <Clock size={16} color={Colors.warning} />;
      default:
        return <AlertCircle size={16} color={Colors.error} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return Colors.success;
      case 'in_progress':
        return Colors.warning;
      default:
        return Colors.error;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen 
        options={{ 
          title: 'Support',
          headerStyle: { backgroundColor: Colors.white },
          headerTintColor: Colors.text,
        }} 
      />

      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <HelpCircle size={24} color={Colors.primary} />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>How can we help?</Text>
          <Text style={styles.headerSubtitle}>Get support and find answers to your questions</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'help' && styles.activeTab]}
          onPress={() => setActiveTab('help')}
        >
          <Text style={[styles.tabText, activeTab === 'help' && styles.activeTabText]}>
            Help
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'contact' && styles.activeTab]}
          onPress={() => setActiveTab('contact')}
        >
          <Text style={[styles.tabText, activeTab === 'contact' && styles.activeTabText]}>
            Contact
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tickets' && styles.activeTab]}
          onPress={() => setActiveTab('tickets')}
        >
          <Text style={[styles.tabText, activeTab === 'tickets' && styles.activeTabText]}>
            My Tickets
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'help' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {FAQ_ITEMS.map((item) => (
            <View key={item.id} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => toggleFAQ(item.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.faqQuestionText}>{item.question}</Text>
                <ChevronRight 
                  size={20} 
                  color={Colors.subtext}
                  style={[
                    styles.faqChevron,
                    expandedFAQ === item.id && styles.faqChevronExpanded
                  ]}
                />
              </TouchableOpacity>
              {expandedFAQ === item.id && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{item.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {activeTab === 'contact' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          
          <TouchableOpacity
            style={styles.contactItem}
            onPress={handlePhoneCall}
            activeOpacity={0.7}
          >
            <View style={styles.contactIconContainer}>
              <Phone size={20} color={Colors.primary} />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Call Support</Text>
              <Text style={styles.contactSubtitle}>+233 123 456 789</Text>
              <Text style={styles.contactHours}>Available 24/7</Text>
            </View>
            <ChevronRight size={20} color={Colors.subtext} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={handleEmail}
            activeOpacity={0.7}
          >
            <View style={styles.contactIconContainer}>
              <Mail size={20} color={Colors.primary} />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactSubtitle}>support@deliveryapp.com</Text>
              <Text style={styles.contactHours}>Response within 24 hours</Text>
            </View>
            <ChevronRight size={20} color={Colors.subtext} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={handleWhatsApp}
            activeOpacity={0.7}
          >
            <View style={styles.contactIconContainer}>
              <MessageCircle size={20} color={Colors.primary} />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>WhatsApp Support</Text>
              <Text style={styles.contactSubtitle}>Chat with us on WhatsApp</Text>
              <Text style={styles.contactHours}>Quick responses</Text>
            </View>
            <ChevronRight size={20} color={Colors.subtext} />
          </TouchableOpacity>
        </View>
      )}

      {activeTab === 'tickets' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support Tickets</Text>
          {SUPPORT_TICKETS.length > 0 ? (
            SUPPORT_TICKETS.map((ticket) => (
              <View key={ticket.id} style={styles.ticketCard}>
                <View style={styles.ticketHeader}>
                  <Text style={styles.ticketTitle}>{ticket.title}</Text>
                  <View style={[styles.ticketStatus, { backgroundColor: getStatusColor(ticket.status) + '20' }]}>
                    {getStatusIcon(ticket.status)}
                    <Text style={[styles.ticketStatusText, { color: getStatusColor(ticket.status) }]}>
                      {ticket.status.replace('_', ' ').toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.ticketDate}>
                  Created: {new Date(ticket.date).toLocaleDateString()}
                </Text>
                <Text style={styles.ticketResponse}>{ticket.response}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <FileText size={48} color={Colors.subtext} />
              <Text style={styles.emptyStateTitle}>No Support Tickets</Text>
              <Text style={styles.emptyStateSubtitle}>
                You haven't submitted any support tickets yet
              </Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.lightGray,
  },
  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.subtext,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.lightGray,
    margin: 20,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: Colors.white,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.subtext,
  },
  activeTabText: {
    color: Colors.primary,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  faqItem: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  faqChevron: {
    marginLeft: 8,
    transform: [{ rotate: '0deg' }],
  },
  faqChevronExpanded: {
    transform: [{ rotate: '90deg' }],
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: Colors.lightGray,
  },
  faqAnswerText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 2,
  },
  contactHours: {
    fontSize: 12,
    color: Colors.subtext,
  },
  ticketCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ticketTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 12,
  },
  ticketStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ticketStatusText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  ticketDate: {
    fontSize: 12,
    color: Colors.subtext,
    marginBottom: 8,
  },
  ticketResponse: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'center',
    lineHeight: 20,
  },
});