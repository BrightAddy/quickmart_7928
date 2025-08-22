import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FloatingChatbotButton, ChatbotModal } from '../components/UI';

// --- Placeholder Data ---
const promotions = [
  {
    id: 1,
    title: 'All Vegetables & Fruits',
    discount: '25%',
    backgroundColor: '#4CAF50',
    rightBackground: '#FFF9C4',
    buttonText: 'See Detail',
    image: 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 2,
    title: 'Fresh Meat & Seafood',
    discount: '30%',
    backgroundColor: '#FF5722',
    rightBackground: '#FFE0B2',
    buttonText: 'Shop Now',
    image: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 3,
    title: 'Organic Dairy Products',
    discount: '20%',
    backgroundColor: '#2196F3',
    rightBackground: '#E3F2FD',
    buttonText: 'Explore',
    image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

const categories = [
  { id: 1, name: 'Vegetables', icon: 'leaf' as const, color: '#4CAF50', iconColor: '#2E7D32' },
  { id: 2, name: 'Fruits', icon: 'food-apple' as const, color: '#FFCDD2', iconColor: '#D32F2F' },
  { id: 3, name: 'Meat & Eggs', icon: 'food-steak' as const, color: '#F8BBD9', iconColor: '#C2185B' },
  { id: 4, name: 'Drinks', icon: 'cup-water' as const, color: '#B3E5FC', iconColor: '#1976D2' },
  { id: 5, name: 'Bakery', icon: 'cake-variant' as const, color: '#FFE0B2', iconColor: '#F57C00' },
  { id: 6, name: 'Snacks', icon: 'food-variant' as const, color: '#FFF3E0', iconColor: '#FF9800' },
  { id: 7, name: 'Frozen', icon: 'snowflake' as const, color: '#E1F5FE', iconColor: '#0277BD' },
  { id: 8, name: 'Canned', icon: 'package-variant' as const, color: '#F3E5F5', iconColor: '#7B1FA2' },
];

const specialDeals = [
  {
    id: 1,
    name: 'Fresh Pasta Bowl',
    image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 'GHS 25.00',
    originalPrice: 'GHS 35.00',
  },
  {
    id: 2,
    name: 'Fresh Tomatoes',
    image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 'GHS 15.00',
    originalPrice: 'GHS 20.00',
  },
  {
    id: 3,
    name: 'Organic Carrots',
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 'GHS 12.00',
    originalPrice: 'GHS 18.00',
  },
  {
    id: 4,
    name: 'Fresh Ginger',
    image: 'https://images.pexels.com/photos/4110220/pexels-photo-4110220.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 'GHS 8.00',
    originalPrice: 'GHS 12.00',
  },
];

// Mock customer data - replace with actual user data
const customerData = {
  firstName: 'Kwame',
  location: 'Accra, Ghana'
};

// --- Components ---
function HeaderSection() {
  return (
    <LinearGradient
      colors={['#4CAF50', '#45A049']}
      style={styles.headerGradient}
    >
      {/* App Header */}
      <View style={styles.appHeader}>
        <View style={styles.appTitleContainer}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.customerName}>{customerData.firstName}</Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="mail" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="notifications" size={24} color="#333" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
            placeholder="Search for fruits, vegetables, groceries..."
        placeholderTextColor="#888"
      />
    </View>
      </View>
      
      {/* Location Section */}
      <View style={styles.locationSection}>
        <Ionicons name="location" size={16} color="#666" />
        <Text style={styles.locationText}>Delivering to {customerData.location}</Text>
        <Ionicons name="chevron-down" size={16} color="#666" />
      </View>
    </LinearGradient>
  );
}

function PromotionalBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  return (
    <View style={styles.bannerContainer}>
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const slideIndex = Math.round(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
          setCurrentSlide(slideIndex);
        }}
      >
      {promotions.map((promo) => (
          <View key={promo.id} style={styles.bannerCard}>
            <View style={[styles.bannerLeft, { backgroundColor: promo.backgroundColor }]}>
              <Text style={styles.bannerDiscountLabel}>Discount</Text>
              <Text style={styles.bannerDiscountPercent}>{promo.discount}</Text>
            <Text style={styles.bannerTitle}>{promo.title}</Text>
              <TouchableOpacity style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>{promo.buttonText}</Text>
              </TouchableOpacity>
          </View>
            <View style={[styles.bannerRight, { backgroundColor: promo.rightBackground }]}>
          <Image source={{ uri: promo.image }} style={styles.bannerImage} />
            </View>
        </View>
      ))}
    </ScrollView>
      
      {/* Pagination Dots */}
      <View style={styles.paginationDots}>
        {promotions.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.paginationDot, 
              index === currentSlide && styles.paginationDotActive
            ]} 
          />
              ))}
            </View>
    </View>
  );
}

function CategoriesSection() {
  return (
    <View style={styles.categoriesSection}>
      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((cat) => (
          <TouchableOpacity key={cat.id} style={styles.categoryItem}>
            <View style={[styles.categoryIcon, { backgroundColor: cat.color }]}>
              <MaterialCommunityIcons name={cat.icon} size={24} color={cat.iconColor} />
              </View>
            <Text style={styles.categoryName}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function SpecialDealsSection() {
  return (
    <View style={styles.specialDealsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Special Deal</Text>
        <TouchableOpacity>
          <Text style={styles.seeMoreText}>See more {'>'}</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dealsContainer}
      >
        {specialDeals.map((deal) => (
          <TouchableOpacity key={deal.id} style={styles.dealItem}>
            <Image source={{ uri: deal.image }} style={styles.dealImage} />
            <Text style={styles.dealName}>{deal.name}</Text>
            <View style={styles.dealPriceContainer}>
              <Text style={styles.dealPrice}>{deal.price}</Text>
              <Text style={styles.dealOriginalPrice}>{deal.originalPrice}</Text>
          </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function BottomNavigation() {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem}>
        <View style={[styles.navIconContainer, styles.navIconActive]}>
          <Ionicons name="home" size={24} color="#4CAF50" />
        </View>
        <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <View style={styles.navIconContainer}>
          <Ionicons name="heart" size={24} color="#999" />
        </View>
        <Text style={styles.navLabel}>Favorites</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <View style={styles.navIconContainer}>
          <Ionicons name="cart" size={24} color="#999" />
          <View style={styles.cartBadge} />
      </View>
        <Text style={styles.navLabel}>Cart</Text>
        </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <View style={styles.navIconContainer}>
          <Ionicons name="person" size={24} color="#999" />
        </View>
        <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
    </View>
  );
}

export default function CustomerHome({ navigation }: any) {
  const [chatbotVisible, setChatbotVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#4CAF50" />
      <LinearGradient
        colors={['#E8F5E8', '#F0F8F0', '#F8FCF8']}
        style={styles.backgroundGradient}
      >
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          <HeaderSection />
        <PromotionalBanner />
          <CategoriesSection />
          <SpecialDealsSection />
          <View style={{ height: 100 }} />
      </ScrollView>
        
        <BottomNavigation />
        
        {/* Floating Chatbot */}
      <FloatingChatbotButton onPress={() => setChatbotVisible(true)} />
      <ChatbotModal visible={chatbotVisible} onClose={() => setChatbotVisible(false)} />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundGradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  
  // Header Section
  headerGradient: {
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  appTitleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 14,
    color: '#333',
    opacity: 0.8,
    marginBottom: 2,
  },
  customerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F44336',
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    fontSize: 16,
    color: '#222',
    flex: 1,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    marginRight: 8,
  },
  
  // Banner Section
  bannerContainer: {
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  bannerCard: {
    flexDirection: 'row',
    width: 350,
    height: 180,
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  bannerLeft: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  bannerDiscountLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  bannerDiscountPercent: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  bannerButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  bannerRight: {
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  paginationDotActive: {
    backgroundColor: '#4CAF50',
  },
  
  // Categories Section
  categoriesSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingRight: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  
  // Special Deals Section
  specialDealsSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeMoreText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  dealsContainer: {
    paddingRight: 16,
  },
  dealItem: {
    marginRight: 16,
    width: 120,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dealImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  dealName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  dealPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dealPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  dealOriginalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  
  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingBottom: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  navIconActive: {
    backgroundColor: '#E8F5E8',
  },
  navLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  cartBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F44336',
  },
});


