import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Phone, Mail, MessageCircle, Search, ChevronRight, HelpCircle, Book, Shield, Truck, CreditCard, User, Settings } from 'lucide-react-native';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { getColors } from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';
import Layout from '@/constants/layout';

interface HelpCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  articles: HelpArticle[];
}

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  helpful: number;
}

export default function HelpScreen() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  const styles = createStyles(Colors);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  
  const helpCategories: HelpCategory[] = [
    {
      id: 'orders',
      title: 'Orders & Delivery',
      icon: <Truck size={24} color={Colors.primary} />,
      description: 'Track orders, delivery issues, and order modifications',
      articles: [
        {
          id: 'track-order',
          title: 'How to track my order?',
          content: 'You can track your order in real-time by going to the Orders tab in your account. You\'ll see the current status of your order and estimated delivery time. You\'ll also receive push notifications for important updates like when your order is being prepared, out for delivery, and delivered.',
          helpful: 156
        },
        {
          id: 'delivery-time',
          title: 'What are the delivery times?',
          content: 'Our standard delivery time is 30-60 minutes depending on your location and the store\'s current order volume. Express delivery (15-30 minutes) is available for an additional fee. You can see the estimated delivery time before placing your order.',
          helpful: 203
        },
        {
          id: 'modify-order',
          title: 'Can I modify my order after placing it?',
          content: 'You can modify your order within 5 minutes of placing it, as long as the store hasn\'t started preparing it. Go to your active order and tap "Modify Order". After this window, you\'ll need to contact customer support for any changes.',
          helpful: 89
        },
        {
          id: 'delivery-issues',
          title: 'What if there\'s an issue with my delivery?',
          content: 'If you experience any delivery issues such as missing items, damaged products, or late delivery, please contact our support team immediately. We\'ll investigate the issue and provide a refund or replacement as appropriate.',
          helpful: 134
        }
      ]
    },
    {
      id: 'payments',
      title: 'Payments & Billing',
      icon: <CreditCard size={24} color={Colors.primary} />,
      description: 'Payment methods, refunds, and billing questions',
      articles: [
        {
          id: 'payment-methods',
          title: 'What payment methods do you accept?',
          content: 'We accept all major credit cards (Visa, Mastercard, American Express), mobile money (MTN MoMo, Vodafone Cash, AirtelTigo Money), and digital wallets. You can save multiple payment methods in your account for faster checkout.',
          helpful: 245
        },
        {
          id: 'refund-policy',
          title: 'What is your refund policy?',
          content: 'We offer full refunds for cancelled orders, missing items, or quality issues. Refunds are processed within 3-5 business days to your original payment method. For mobile money payments, refunds are typically instant.',
          helpful: 178
        },
        {
          id: 'payment-failed',
          title: 'My payment failed, what should I do?',
          content: 'If your payment fails, please check that your payment method has sufficient funds and that all details are correct. You can try a different payment method or contact your bank. If the issue persists, contact our support team.',
          helpful: 92
        }
      ]
    },
    {
      id: 'account',
      title: 'Account & Profile',
      icon: <User size={24} color={Colors.primary} />,
      description: 'Account settings, profile management, and security',
      articles: [
        {
          id: 'update-profile',
          title: 'How do I update my profile information?',
          content: 'Go to the Profile tab and tap "Edit Profile". You can update your name, email, phone number, and profile picture. Make sure to save your changes when done.',
          helpful: 167
        },
        {
          id: 'change-password',
          title: 'How do I change my password?',
          content: 'Currently, you can reset your password by logging out and using the "Forgot Password" option on the login screen. We\'ll send you a reset link via email.',
          helpful: 123
        },
        {
          id: 'delete-account',
          title: 'How do I delete my account?',
          content: 'You can request account deletion from the Settings section in your profile. This action is permanent and will delete all your data including order history, saved addresses, and payment methods.',
          helpful: 45
        }
      ]
    },
    {
      id: 'app',
      title: 'App Features',
      icon: <Settings size={24} color={Colors.primary} />,
      description: 'App functionality, features, and troubleshooting',
      articles: [
        {
          id: 'notifications',
          title: 'How do I manage notifications?',
          content: 'Go to Profile > Notifications to customize which notifications you receive. You can enable/disable order updates, promotions, new products, and delivery notifications.',
          helpful: 198
        },
        {
          id: 'app-crashes',
          title: 'The app keeps crashing, what should I do?',
          content: 'Try closing and reopening the app. If that doesn\'t work, restart your device. Make sure you have the latest version of the app installed. If the problem persists, contact support.',
          helpful: 76
        },
        {
          id: 'location-services',
          title: 'Why does the app need location access?',
          content: 'We use your location to show nearby stores, calculate delivery fees, and provide accurate delivery estimates. You can manage location permissions in your device settings.',
          helpful: 145
        }
      ]
    }
  ];
  
  const contactOptions = [
    {
      id: 'phone',
      title: 'Call Us',
      description: 'Speak with our support team',
      detail: '+1 (800) 123-4567',
      icon: <Phone size={20} color={Colors.primary} />,
      action: () => Linking.openURL('tel:+18001234567')
    },
    {
      id: 'email',
      title: 'Email Support',
      description: 'Send us a detailed message',
      detail: 'support@quickmart.com',
      icon: <Mail size={20} color={Colors.primary} />,
      action: () => Linking.openURL('mailto:support@quickmart.com')
    },
    {
      id: 'chat',
      title: 'Live Chat',
      description: 'Chat with us in real-time',
      detail: 'Available 24/7',
      icon: <MessageCircle size={20} color={Colors.primary} />,
      action: () => Alert.alert('Live Chat', 'Live chat feature will be available soon!')
    }
  ];
  
  const filteredCategories = helpCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.articles.some(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
  const handleArticlePress = (article: HelpArticle) => {
    setSelectedArticle(article);
  };
  
  const handleBackPress = () => {
    if (selectedArticle) {
      setSelectedArticle(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      router.back();
    }
  };
  
  const handleHelpful = (articleId: string, helpful: boolean) => {
    Alert.alert(
      'Thank you!',
      helpful ? 'Glad we could help!' : 'We\'ll work on improving this article.',
      [{ text: 'OK' }]
    );
  };
  
  const renderArticleView = () => {
    if (!selectedArticle) return null;
    
    return (
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.articleContainer}>
          <Text style={styles.articleTitle}>{selectedArticle.title}</Text>
          <Text style={styles.articleContent}>{selectedArticle.content}</Text>
          
          <View style={styles.helpfulSection}>
            <Text style={styles.helpfulTitle}>Was this helpful?</Text>
            <View style={styles.helpfulButtons}>
              <TouchableOpacity
                style={styles.helpfulButton}
                onPress={() => handleHelpful(selectedArticle.id, true)}
              >
                <Text style={styles.helpfulButtonText}>👍 Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.helpfulButton}
                onPress={() => handleHelpful(selectedArticle.id, false)}
              >
                <Text style={styles.helpfulButtonText}>👎 No</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.helpfulCount}>
              {selectedArticle.helpful} people found this helpful
            </Text>
          </View>
        </View>
        
        <View style={styles.contactSection}>
          <Text style={styles.contactSectionTitle}>Still need help?</Text>
          <Text style={styles.contactSectionDescription}>
            Our support team is here to help you with any questions.
          </Text>
          
          {contactOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.contactOption}
              onPress={option.action}
            >
              <View style={styles.contactOptionIcon}>
                {option.icon}
              </View>
              <View style={styles.contactOptionContent}>
                <Text style={styles.contactOptionTitle}>{option.title}</Text>
                <Text style={styles.contactOptionDescription}>{option.description}</Text>
                <Text style={styles.contactOptionDetail}>{option.detail}</Text>
              </View>
              <ChevronRight size={20} color={Colors.subtext} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };
  
  const renderCategoryView = () => {
    const category = helpCategories.find(cat => cat.id === selectedCategory);
    if (!category) return null;
    
    return (
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryIcon}>
            {category.icon}
          </View>
          <Text style={styles.categoryTitle}>{category.title}</Text>
          <Text style={styles.categoryDescription}>{category.description}</Text>
        </View>
        
        <View style={styles.articlesContainer}>
          {category.articles.map((article) => (
            <TouchableOpacity
              key={article.id}
              style={styles.articleItem}
              onPress={() => handleArticlePress(article)}
            >
              <View style={styles.articleItemContent}>
                <Text style={styles.articleItemTitle}>{article.title}</Text>
                <Text style={styles.articleItemHelpful}>
                  {article.helpful} people found this helpful
                </Text>
              </View>
              <ChevronRight size={20} color={Colors.subtext} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };
  
  const renderMainView = () => (
    <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search for help..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={Colors.subtext} />}
          containerStyle={styles.searchInput}
        />
      </View>
      
      {/* Quick Contact */}
      <View style={styles.quickContactContainer}>
        <Text style={styles.sectionTitle}>Need immediate help?</Text>
        <View style={styles.quickContactButtons}>
          {contactOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.quickContactButton}
              onPress={option.action}
            >
              <View style={styles.quickContactIcon}>
                {option.icon}
              </View>
              <Text style={styles.quickContactTitle}>{option.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Help Categories */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Browse by topic</Text>
        {filteredCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryItem}
            onPress={() => setSelectedCategory(category.id)}
          >
            <View style={styles.categoryItemIcon}>
              {category.icon}
            </View>
            <View style={styles.categoryItemContent}>
              <Text style={styles.categoryItemTitle}>{category.title}</Text>
              <Text style={styles.categoryItemDescription}>{category.description}</Text>
              <Text style={styles.categoryItemCount}>
                {category.articles.length} articles
              </Text>
            </View>
            <ChevronRight size={20} color={Colors.subtext} />
          </TouchableOpacity>
        ))}
      </View>
      
      {/* FAQ Section */}
      <View style={styles.faqContainer}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <TouchableOpacity style={styles.faqItem}>
          <HelpCircle size={20} color={Colors.primary} />
          <Text style={styles.faqText}>How long does delivery take?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.faqItem}>
          <HelpCircle size={20} color={Colors.primary} />
          <Text style={styles.faqText}>Can I cancel my order?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.faqItem}>
          <HelpCircle size={20} color={Colors.primary} />
          <Text style={styles.faqText}>What payment methods do you accept?</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
  
  return (
    <View style={styles.container}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {selectedArticle ? 'Help Article' : selectedCategory ? 'Help Topics' : 'Help & Support'}
          </Text>
          {!selectedArticle && !selectedCategory && (
            <Text style={styles.headerSubtitle}>How can we help you today?</Text>
          )}
        </View>
      </View>
      
      {/* Content */}
      {selectedArticle ? renderArticleView() : selectedCategory ? renderCategoryView() : renderMainView()}
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Layout.padding,
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchInput: {
    marginBottom: 0,
  },
  quickContactContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  quickContactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickContactButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickContactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickContactTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
  },
  categoriesContainer: {
    marginBottom: 32,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.lightPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryItemContent: {
    flex: 1,
  },
  categoryItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  categoryItemDescription: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 4,
  },
  categoryItemCount: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  faqContainer: {
    marginBottom: 32,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 8,
  },
  faqText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 12,
    flex: 1,
  },
  categoryHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 24,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.lightPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  categoryDescription: {
    fontSize: 16,
    color: Colors.subtext,
    textAlign: 'center',
    lineHeight: 22,
  },
  articlesContainer: {
    marginBottom: 32,
  },
  articleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  articleItemContent: {
    flex: 1,
  },
  articleItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  articleItemHelpful: {
    fontSize: 12,
    color: Colors.subtext,
  },
  articleContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  articleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    lineHeight: 32,
  },
  articleContent: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 32,
  },
  helpfulSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 24,
    alignItems: 'center',
  },
  helpfulTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  helpfulButtons: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  helpfulButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.card,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  helpfulButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  helpfulCount: {
    fontSize: 12,
    color: Colors.subtext,
  },
  contactSection: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  contactSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  contactSectionDescription: {
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 8,
    marginBottom: 12,
  },
  contactOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactOptionContent: {
    flex: 1,
  },
  contactOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  contactOptionDescription: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 2,
  },
  contactOptionDetail: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
});