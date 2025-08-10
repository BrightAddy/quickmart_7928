import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  MessageCircle,
  Phone,
  Mail,
  HelpCircle,
  ChevronRight,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'resolved' | 'pending';
  date: string;
  lastUpdate: string;
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How do I get paid?',
    answer: 'Payments are processed daily at 6:00 AM GMT to your registered Mobile Money account. You can track your earnings in the Earnings tab.',
    category: 'Payments',
  },
  {
    id: '2',
    question: 'What should I do if an item is out of stock?',
    answer: 'Always contact the customer first through the in-app chat to ask about substitutions. If they don\'t respond within 5 minutes, you can make a reasonable substitution or mark the item as unavailable.',
    category: 'Shopping',
  },
  {
    id: '3',
    question: 'How do I change my delivery zones?',
    answer: 'Go to Account > Delivery Zone to add or remove zones. You can have up to 4 active zones at a time.',
    category: 'Account',
  },
  {
    id: '4',
    question: 'What if a customer is not available for delivery?',
    answer: 'Try calling the customer first. If no response, wait 5 minutes and try again. If still no response, contact support through the app for guidance.',
    category: 'Delivery',
  },
  {
    id: '5',
    question: 'How do I report a problem with an order?',
    answer: 'Use the "Report Issue" button in the delivery screen or contact support immediately. Take photos if necessary.',
    category: 'Issues',
  },
];

const mockTickets: SupportTicket[] = [
  {
    id: '1',
    subject: 'Payment not received',
    status: 'resolved',
    date: '2 days ago',
    lastUpdate: 'Yesterday',
  },
  {
    id: '2',
    subject: 'Customer complaint about delivery',
    status: 'pending',
    date: '1 week ago',
    lastUpdate: '3 days ago',
  },
];

export default function Support() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [supportMessage, setSupportMessage] = useState('');

  const categories = ['All', 'Payments', 'Shopping', 'Delivery', 'Account', 'Issues'];
  const filteredFAQs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const handleContactSupport = (method: 'whatsapp' | 'email' | 'phone') => {
    switch (method) {
      case 'whatsapp':
        Linking.openURL('https://wa.me/233501234567');
        break;
      case 'email':
        Linking.openURL('mailto:support@shopgh.com');
        break;
      case 'phone':
        Linking.openURL('tel:+233501234567');
        break;
    }
  };

  const handleSendMessage = () => {
    if (!supportMessage.trim()) {
      Alert.alert('Empty Message', 'Please enter your message before sending.');
      return;
    }

    Alert.alert(
      'Message Sent',
      'Your message has been sent to our support team. We\'ll get back to you within 24 hours.',
      [
        {
          text: 'OK',
          onPress: () => setSupportMessage(''),
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'open':
        return '#2196F3';
      default:
        return Colors.gray;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle size={16} color="#4CAF50" />;
      case 'pending':
        return <Clock size={16} color="#FF9800" />;
      case 'open':
        return <AlertCircle size={16} color="#2196F3" />;
      default:
        return <HelpCircle size={16} color={Colors.gray} />;
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Help & Support',
          headerStyle: {
            backgroundColor: Colors.white,
          },
          headerTintColor: Colors.text,
        }}
      />
      
      <ScrollView style={[styles.container, { backgroundColor: Colors.background }]}>
        {/* Quick Contact */}
        <View style={[styles.contactCard, { backgroundColor: Colors.white }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>
            Need Immediate Help?
          </Text>
          
          <View style={styles.contactMethods}>
            <TouchableOpacity
              style={[styles.contactMethod, { backgroundColor: '#25D366' }]}
              onPress={() => handleContactSupport('whatsapp')}
            >
              <MessageCircle size={20} color={Colors.white} />
              <Text style={[styles.contactMethodText, { color: Colors.white }]}>
                WhatsApp
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.contactMethod, { backgroundColor: '#4464EB' }]}
              onPress={() => handleContactSupport('phone')}
            >
              <Phone size={20} color={Colors.white} />
              <Text style={[styles.contactMethodText, { color: Colors.white }]}>
                Call Us
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.contactMethod, { backgroundColor: '#FF9800' }]}
              onPress={() => handleContactSupport('email')}
            >
              <Mail size={20} color={Colors.white} />
              <Text style={[styles.contactMethodText, { color: Colors.white }]}>
                Email
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Tickets */}
        {mockTickets.length > 0 && (
          <View style={[styles.ticketsCard, { backgroundColor: Colors.white }]}>
            <Text style={[styles.sectionTitle, { color: Colors.text }]}>
              Your Support Tickets
            </Text>
            
            {mockTickets.map((ticket) => (
              <TouchableOpacity key={ticket.id} style={styles.ticketItem}>
                <View style={styles.ticketLeft}>
                  {getStatusIcon(ticket.status)}
                  <View style={styles.ticketContent}>
                    <Text style={[styles.ticketSubject, { color: Colors.text }]}>
                      {ticket.subject}
                    </Text>
                    <Text style={[styles.ticketDate, { color: Colors.subtext }]}>
                      Created {ticket.date} • Updated {ticket.lastUpdate}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(ticket.status) + '20' },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(ticket.status) },
                    ]}
                  >
                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Send Message */}
        <View style={[styles.messageCard, { backgroundColor: Colors.white }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>
            Send us a Message
          </Text>
          
          <TextInput
            style={[
              styles.messageInput,
              {
                backgroundColor: Colors.background,
                color: Colors.text,
                borderColor: Colors.border,
              },
            ]}
            value={supportMessage}
            onChangeText={setSupportMessage}
            placeholder="Describe your issue or question..."
            placeholderTextColor={Colors.subtext}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: '#4464EB' }]}
            onPress={handleSendMessage}
          >
            <Send size={16} color={Colors.white} />
            <Text style={[styles.sendButtonText, { color: Colors.white }]}>
              Send Message
            </Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Categories */}
        <View style={[styles.categoriesCard, { backgroundColor: Colors.white }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>
            Frequently Asked Questions
          </Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: selectedCategory === category ? '#4464EB' : Colors.background,
                  },
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    { color: selectedCategory === category ? Colors.white : Colors.text },
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* FAQ List */}
        <View style={[styles.faqCard, { backgroundColor: Colors.white }]}>
          {filteredFAQs.map((faq) => (
            <View key={faq.id} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
              >
                <Text style={[styles.faqQuestionText, { color: Colors.text }]}>
                  {faq.question}
                </Text>
                <ChevronRight
                  size={20}
                  color={Colors.subtext}
                  style={{
                    transform: [{ rotate: expandedFAQ === faq.id ? '90deg' : '0deg' }],
                  }}
                />
              </TouchableOpacity>
              
              {expandedFAQ === faq.id && (
                <View style={[styles.faqAnswer, { backgroundColor: Colors.background }]}>
                  <Text style={[styles.faqAnswerText, { color: Colors.text }]}>
                    {faq.answer}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Contact Info */}
        <View style={[styles.infoCard, { backgroundColor: Colors.white }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>
            Contact Information
          </Text>
          
          <View style={styles.infoItem}>
            <Phone size={16} color={Colors.subtext} />
            <Text style={[styles.infoText, { color: Colors.text }]}>
              +233 50 123 4567
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Mail size={16} color={Colors.subtext} />
            <Text style={[styles.infoText, { color: Colors.text }]}>
              support@shopgh.com
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Clock size={16} color={Colors.subtext} />
            <Text style={[styles.infoText, { color: Colors.text }]}>
              24/7 Support Available
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  contactCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  contactMethods: {
    flexDirection: 'row',
    gap: 12,
  },
  contactMethod: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  contactMethodText: {
    fontSize: 14,
    fontWeight: '600',
  },
  ticketsCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ticketItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  ticketLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  ticketContent: {
    flex: 1,
  },
  ticketSubject: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ticketDate: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  messageCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  messageInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 100,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoriesCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoriesScroll: {
    flexDirection: 'row',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  faqCard: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    padding: 20,
    paddingTop: 0,
  },
  faqAnswerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  infoText: {
    fontSize: 16,
  },
});