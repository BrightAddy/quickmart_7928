import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Search, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';
import Layout from '@/constants/layout';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How long does delivery take?',
    answer: 'Our standard delivery time is 30-60 minutes depending on your location and the store\'s current order volume. Express delivery (15-30 minutes) is available for an additional fee. You can see the estimated delivery time before placing your order.',
    category: 'Delivery',
    helpful: 245
  },
  {
    id: '2',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), mobile money (MTN MoMo, Vodafone Cash, AirtelTigo Money), and digital wallets. You can save multiple payment methods in your account for faster checkout.',
    category: 'Payment',
    helpful: 189
  },
  {
    id: '3',
    question: 'Can I cancel my order?',
    answer: 'You can cancel your order within 5 minutes of placing it, as long as the store hasn\'t started preparing it. After this window, cancellation may not be possible. If you need to cancel after this time, please contact our support team.',
    category: 'Orders',
    helpful: 156
  },
  {
    id: '4',
    question: 'What if an item is out of stock?',
    answer: 'If an item becomes out of stock after you place your order, we\'ll contact you to suggest alternatives or remove the item from your order. You\'ll only be charged for items that are delivered.',
    category: 'Orders',
    helpful: 134
  },
  {
    id: '5',
    question: 'How do I track my order?',
    answer: 'You can track your order in real-time by going to the Orders tab in your account. You\'ll see the current status of your order and estimated delivery time. You\'ll also receive push notifications for important updates.',
    category: 'Delivery',
    helpful: 203
  },
  {
    id: '6',
    question: 'What is your refund policy?',
    answer: 'We offer full refunds for cancelled orders, missing items, or quality issues. Refunds are processed within 3-5 business days to your original payment method. For mobile money payments, refunds are typically instant.',
    category: 'Payment',
    helpful: 167
  },
  {
    id: '7',
    question: 'Do you deliver to my area?',
    answer: 'We deliver to most areas within the city. Enter your address during checkout to see if delivery is available in your area. We\'re constantly expanding our delivery zones.',
    category: 'Delivery',
    helpful: 178
  },
  {
    id: '8',
    question: 'How do I add items to my wishlist?',
    answer: 'Tap the heart icon on any product to add it to your wishlist. You can view and manage your wishlist from the Profile tab. Items in your wishlist will notify you of price changes and availability.',
    category: 'App Features',
    helpful: 89
  },
  {
    id: '9',
    question: 'Can I schedule a delivery for later?',
    answer: 'Yes! During checkout, you can select \"Schedule Delivery\" to choose a specific date and time window for your delivery. Scheduled deliveries are available up to 7 days in advance.',
    category: 'Delivery',
    helpful: 145
  },
  {
    id: '10',
    question: 'How do I contact customer support?',
    answer: 'You can contact our support team through the Help section in your profile, call us at +1 (800) 123-4567, or email support@quickmart.com. Our support team is available 24/7 to assist you.',
    category: 'Support',
    helpful: 234
  },
  {
    id: '11',
    question: 'What if I receive damaged items?',
    answer: 'If you receive damaged or spoiled items, please contact our support team immediately with photos of the damaged items. We\'ll provide a full refund or replacement at no additional cost.',
    category: 'Orders',
    helpful: 123
  },
  {
    id: '12',
    question: 'How do I change my delivery address?',
    answer: 'You can add or edit delivery addresses in the Profile tab under \"Delivery Addresses\". You can also change the delivery address during checkout before confirming your order.',
    category: 'Account',
    helpful: 156
  },
  {
    id: '13',
    question: 'Are there any delivery fees?',
    answer: 'Delivery fees vary based on your location and order size. Standard delivery typically costs $2.99, while express delivery costs $4.99. Free delivery is available for orders over $35.',
    category: 'Delivery',
    helpful: 198
  },
  {
    id: '14',
    question: 'Can I tip my delivery driver?',
    answer: 'Yes! You can add a tip for your delivery driver during checkout or after delivery. Tips can be added in cash or through the app, and 100% of tips go directly to the driver.',
    category: 'Delivery',
    helpful: 167
  },
  {
    id: '15',
    question: 'How do I update my payment information?',
    answer: 'Go to Profile > Payment Methods to add, edit, or remove payment methods. You can set a default payment method and manage multiple cards or mobile money accounts.',
    category: 'Payment',
    helpful: 134
  }
];

const categories = ['All', 'Delivery', 'Payment', 'Orders', 'Account', 'App Features', 'Support'];

export default function FAQScreen() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  const styles = createStyles(Colors);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const toggleExpanded = (id: string) => {\n    const newExpanded = new Set(expandedItems);\n    if (newExpanded.has(id)) {\n      newExpanded.delete(id);\n    } else {\n      newExpanded.add(id);\n    }\n    setExpandedItems(newExpanded);\n  };\n  \n  const renderFAQItem = (item: FAQItem) => {\n    const isExpanded = expandedItems.has(item.id);\n    \n    return (\n      <View key={item.id} style={styles.faqItem}>\n        <TouchableOpacity\n          style={styles.faqHeader}\n          onPress={() => toggleExpanded(item.id)}\n        >\n          <View style={styles.faqHeaderContent}>\n            <Text style={styles.faqQuestion}>{item.question}</Text>\n            <View style={styles.faqMeta}>\n              <Text style={styles.faqCategory}>{item.category}</Text>\n              <Text style={styles.faqHelpful}>{item.helpful} helpful</Text>\n            </View>\n          </View>\n          <View style={styles.expandIcon}>\n            {isExpanded ? (\n              <ChevronUp size={20} color={Colors.primary} />\n            ) : (\n              <ChevronDown size={20} color={Colors.subtext} />\n            )}\n          </View>\n        </TouchableOpacity>\n        \n        {isExpanded && (\n          <View style={styles.faqAnswer}>\n            <Text style={styles.faqAnswerText}>{item.answer}</Text>\n            <View style={styles.faqActions}>\n              <TouchableOpacity style={styles.helpfulButton}>\n                <Text style={styles.helpfulButtonText}>👍 Helpful</Text>\n              </TouchableOpacity>\n              <TouchableOpacity style={styles.helpfulButton}>\n                <Text style={styles.helpfulButtonText}>👎 Not helpful</Text>\n              </TouchableOpacity>\n            </View>\n          </View>\n        )}\n      </View>\n    );\n  };\n  \n  return (\n    <View style={styles.container}>\n      <StatusBar style={isDarkMode ? \"light\" : \"dark\"} />\n      \n      {/* Header */}\n      <View style={styles.header}>\n        <TouchableOpacity\n          style={styles.backButton}\n          onPress={() => router.back()}\n        >\n          <ArrowLeft size={24} color={Colors.text} />\n        </TouchableOpacity>\n        \n        <View style={styles.headerContent}>\n          <Text style={styles.headerTitle}>Frequently Asked Questions</Text>\n          <Text style={styles.headerSubtitle}>\n            Find answers to common questions\n          </Text>\n        </View>\n        \n        <View style={styles.headerIcon}>\n          <HelpCircle size={24} color={Colors.primary} />\n        </View>\n      </View>\n      \n      {/* Search */}\n      <View style={styles.searchContainer}>\n        <View style={styles.searchInputContainer}>\n          <Search size={20} color={Colors.subtext} style={styles.searchIcon} />\n          <TextInput\n            style={styles.searchInput}\n            placeholder=\"Search FAQs...\"\n            placeholderTextColor={Colors.subtext}\n            value={searchQuery}\n            onChangeText={setSearchQuery}\n          />\n        </View>\n      </View>\n      \n      {/* Category Filter */}\n      <View style={styles.categoryContainer}>\n        <ScrollView \n          horizontal \n          showsHorizontalScrollIndicator={false}\n          contentContainerStyle={styles.categoryList}\n        >\n          {categories.map((category) => {\n            const count = category === 'All' \n              ? faqData.length \n              : faqData.filter(item => item.category === category).length;\n            \n            return (\n              <TouchableOpacity\n                key={category}\n                style={[\n                  styles.categoryChip,\n                  selectedCategory === category && styles.selectedCategoryChip\n                ]}\n                onPress={() => setSelectedCategory(category)}\n              >\n                <Text style={[\n                  styles.categoryChipText,\n                  selectedCategory === category && styles.selectedCategoryChipText\n                ]}>\n                  {category}\n                </Text>\n                <View style={[\n                  styles.categoryCount,\n                  selectedCategory === category && styles.selectedCategoryCount\n                ]}>\n                  <Text style={[\n                    styles.categoryCountText,\n                    selectedCategory === category && styles.selectedCategoryCountText\n                  ]}>\n                    {count}\n                  </Text>\n                </View>\n              </TouchableOpacity>\n            );\n          })}\n        </ScrollView>\n      </View>\n      \n      {/* FAQ List */}\n      <ScrollView \n        style={styles.content}\n        contentContainerStyle={styles.contentContainer}\n        showsVerticalScrollIndicator={false}\n      >\n        {filteredFAQs.length === 0 ? (\n          <View style={styles.emptyState}>\n            <Search size={60} color={Colors.border} />\n            <Text style={styles.emptyTitle}>No results found</Text>\n            <Text style={styles.emptyDescription}>\n              Try adjusting your search terms or browse different categories.\n            </Text>\n          </View>\n        ) : (\n          <>\n            <View style={styles.resultsHeader}>\n              <Text style={styles.resultsCount}>\n                {filteredFAQs.length} {filteredFAQs.length === 1 ? 'result' : 'results'}\n                {searchQuery && ` for \"${searchQuery}\"`}\n              </Text>\n            </View>\n            \n            {filteredFAQs.map(renderFAQItem)}\n          </>\n        )}\n        \n        <View style={styles.bottomSpacing} />\n      </ScrollView>\n    </View>\n  );\n}\n\nconst createStyles = (Colors: any) => StyleSheet.create({\n  container: {\n    flex: 1,\n    backgroundColor: Colors.background,\n  },\n  header: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    padding: Layout.padding,\n    backgroundColor: Colors.white,\n    borderBottomWidth: 1,\n    borderBottomColor: Colors.border,\n  },\n  backButton: {\n    padding: 8,\n    marginRight: 8,\n  },\n  headerContent: {\n    flex: 1,\n  },\n  headerTitle: {\n    fontSize: 20,\n    fontWeight: 'bold',\n    color: Colors.text,\n  },\n  headerSubtitle: {\n    fontSize: 14,\n    color: Colors.subtext,\n    marginTop: 2,\n  },\n  headerIcon: {\n    padding: 8,\n    marginLeft: 8,\n  },\n  searchContainer: {\n    padding: Layout.padding,\n    backgroundColor: Colors.white,\n    borderBottomWidth: 1,\n    borderBottomColor: Colors.border,\n  },\n  searchInputContainer: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    backgroundColor: Colors.card,\n    borderRadius: 12,\n    paddingHorizontal: 16,\n    paddingVertical: 12,\n  },\n  searchIcon: {\n    marginRight: 12,\n  },\n  searchInput: {\n    flex: 1,\n    fontSize: 16,\n    color: Colors.text,\n  },\n  categoryContainer: {\n    backgroundColor: Colors.white,\n    borderBottomWidth: 1,\n    borderBottomColor: Colors.border,\n    paddingVertical: 12,\n  },\n  categoryList: {\n    paddingHorizontal: Layout.padding,\n  },\n  categoryChip: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    paddingHorizontal: 16,\n    paddingVertical: 8,\n    borderRadius: 20,\n    backgroundColor: Colors.card,\n    borderWidth: 1,\n    borderColor: Colors.border,\n    marginRight: 8,\n  },\n  selectedCategoryChip: {\n    backgroundColor: Colors.primary,\n    borderColor: Colors.primary,\n  },\n  categoryChipText: {\n    fontSize: 14,\n    fontWeight: '500',\n    color: Colors.text,\n    marginRight: 6,\n  },\n  selectedCategoryChipText: {\n    color: Colors.white,\n  },\n  categoryCount: {\n    backgroundColor: Colors.border,\n    borderRadius: 10,\n    minWidth: 20,\n    height: 20,\n    justifyContent: 'center',\n    alignItems: 'center',\n  },\n  selectedCategoryCount: {\n    backgroundColor: Colors.white,\n  },\n  categoryCountText: {\n    fontSize: 12,\n    fontWeight: '600',\n    color: Colors.text,\n  },\n  selectedCategoryCountText: {\n    color: Colors.primary,\n  },\n  content: {\n    flex: 1,\n  },\n  contentContainer: {\n    padding: Layout.padding,\n  },\n  emptyState: {\n    alignItems: 'center',\n    padding: Layout.padding * 2,\n  },\n  emptyTitle: {\n    fontSize: 20,\n    fontWeight: 'bold',\n    color: Colors.text,\n    marginTop: 16,\n    marginBottom: 8,\n  },\n  emptyDescription: {\n    fontSize: 14,\n    color: Colors.subtext,\n    textAlign: 'center',\n    lineHeight: 20,\n  },\n  resultsHeader: {\n    marginBottom: 16,\n  },\n  resultsCount: {\n    fontSize: 14,\n    color: Colors.subtext,\n    fontWeight: '500',\n  },\n  faqItem: {\n    backgroundColor: Colors.white,\n    borderRadius: 12,\n    marginBottom: 12,\n    shadowColor: '#000',\n    shadowOffset: { width: 0, height: 2 },\n    shadowOpacity: 0.1,\n    shadowRadius: 4,\n    elevation: 3,\n  },\n  faqHeader: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    padding: 16,\n  },\n  faqHeaderContent: {\n    flex: 1,\n  },\n  faqQuestion: {\n    fontSize: 16,\n    fontWeight: '600',\n    color: Colors.text,\n    marginBottom: 8,\n    lineHeight: 22,\n  },\n  faqMeta: {\n    flexDirection: 'row',\n    alignItems: 'center',\n  },\n  faqCategory: {\n    fontSize: 12,\n    color: Colors.primary,\n    fontWeight: '500',\n    backgroundColor: Colors.lightPrimary,\n    paddingHorizontal: 8,\n    paddingVertical: 2,\n    borderRadius: 4,\n    marginRight: 8,\n  },\n  faqHelpful: {\n    fontSize: 12,\n    color: Colors.subtext,\n  },\n  expandIcon: {\n    padding: 4,\n    marginLeft: 8,\n  },\n  faqAnswer: {\n    paddingHorizontal: 16,\n    paddingBottom: 16,\n    borderTopWidth: 1,\n    borderTopColor: Colors.border,\n  },\n  faqAnswerText: {\n    fontSize: 15,\n    color: Colors.text,\n    lineHeight: 22,\n    marginBottom: 16,\n  },\n  faqActions: {\n    flexDirection: 'row',\n    justifyContent: 'center',\n  },\n  helpfulButton: {\n    paddingHorizontal: 16,\n    paddingVertical: 8,\n    backgroundColor: Colors.card,\n    borderRadius: 8,\n    marginHorizontal: 8,\n  },\n  helpfulButtonText: {\n    fontSize: 14,\n    color: Colors.text,\n    fontWeight: '500',\n  },\n  bottomSpacing: {\n    height: 20,\n  },\n});