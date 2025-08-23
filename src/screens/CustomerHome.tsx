import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, Image, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FloatingChatbotButton, ChatbotModal } from '../components/UI';

const { width: screenWidth } = Dimensions.get('window');

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

const popularStores = [
  {
    id: 1,
    name: 'Melcom',
    image: 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    deliveryTime: '15-25 min',
    distance: '0.8 km',
    type: 'Supermarket',
    isFavorite: false,
    categories: ['Electronics', 'Groceries', 'Household'],
  },
  {
    id: 2,
    name: 'Palace',
    image: 'https://images.pexels.com/photos/2292837/pexels-photo-2292837.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    deliveryTime: '20-30 min',
    distance: '1.2 km',
    type: 'Supermarket',
    isFavorite: true,
    categories: ['Fresh Produce', 'Local Items'],
  },
  {
    id: 3,
    name: 'Shoprite',
    image: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    deliveryTime: '25-35 min',
    distance: '1.5 km',
    type: 'Supermarket',
    isFavorite: false,
    categories: ['International', 'Fresh Food'],
  },
  {
    id: 4,
    name: 'MaxMart',
    image: 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    deliveryTime: '18-28 min',
    distance: '1.0 km',
    type: 'Mart',
    isFavorite: false,
    categories: ['Local Groceries', 'Household'],
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
      colors={['#4CAF50', '#45A049', '#388E3C']}
      style={styles.headerGradient}
    >
      {/* App Header */}
      <View style={styles.appHeader}>
        <View style={styles.appTitleContainer}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.customerName}>{customerData.firstName}</Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} activeOpacity={0.8}>
            <View style={styles.headerButtonInner}>
              <Ionicons name="mail" size={22} color="#fff" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} activeOpacity={0.8}>
            <View style={styles.headerButtonInner}>
              <Ionicons name="notifications" size={22} color="#fff" />
              <View style={styles.notificationBadge} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for fruits, vegetables, groceries..."
            placeholderTextColor="#999"
          />
        </View>
      </View>
      
      {/* Location Section */}
      <View style={styles.locationSection}>
        <Ionicons name="location" size={16} color="#fff" />
        <Text style={styles.locationText}>Delivering to {customerData.location}</Text>
        <Ionicons name="chevron-down" size={16} color="#fff" />
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
        contentContainerStyle={styles.bannerScrollContent}
        onMomentumScrollEnd={(event) => {
          const slideIndex = Math.round(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
          setCurrentSlide(slideIndex);
        }}
      >
        {promotions.map((promo) => (
          <TouchableOpacity key={promo.id} style={styles.bannerCard} activeOpacity={0.9}>
            <View style={[styles.bannerLeft, { backgroundColor: promo.backgroundColor }]}>
              <Text style={styles.bannerDiscountLabel}>Discount</Text>
              <Text style={styles.bannerDiscountPercent}>{promo.discount}</Text>
              <Text style={styles.bannerTitle}>{promo.title}</Text>
              <TouchableOpacity style={styles.bannerButton} activeOpacity={0.8}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                  style={styles.bannerButtonGradient}
                >
                  <Text style={styles.bannerButtonText}>{promo.buttonText}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View style={[styles.bannerRight, { backgroundColor: promo.rightBackground }]}>
              <Image source={{ uri: promo.image }} style={styles.bannerImage} />
            </View>
          </TouchableOpacity>
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
          <TouchableOpacity key={cat.id} style={styles.categoryItem} activeOpacity={0.8}>
            <View style={[styles.categoryIcon, { backgroundColor: cat.color }]}>
              <MaterialCommunityIcons name={cat.icon} size={26} color={cat.iconColor} />
            </View>
            <Text style={styles.categoryName}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function PopularStoresSection({ onSeeMore }: { onSeeMore: () => void }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (storeId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(storeId)) {
        newFavorites.delete(storeId);
      } else {
        newFavorites.add(storeId);
      }
      return newFavorites;
    });
  };

  return (
    <View style={styles.popularStoresSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Stores</Text>
        <TouchableOpacity onPress={onSeeMore} activeOpacity={0.8}>
          <View style={styles.seeMoreButton}>
            <Text style={styles.seeMoreText}>See more {'>'}</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storesContainer}
      >
        {popularStores.map((store) => (
          <TouchableOpacity
            key={store.id}
            style={styles.storeItem}
            activeOpacity={0.9}
          >
            <View style={styles.storeImageContainer}>
              <Image source={{ uri: store.image }} style={styles.storeImage} />
              <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'transparent']}
                style={styles.storeImageOverlay}
              />
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(store.id.toString())}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name={favorites.has(store.id.toString()) ? "heart" : "heart-outline"} 
                  size={20} 
                  color={favorites.has(store.id.toString()) ? "#E91E63" : "#fff"} 
                />
              </TouchableOpacity>
            </View>
            <View style={styles.storeInfo}>
              <Text style={styles.storeName}>{store.name}</Text>
              <View style={styles.storeMeta}>
                <View style={styles.storeRating}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.ratingText}>{store.rating}</Text>
                </View>
                <Text style={styles.storeType}>{store.type}</Text>
              </View>
              <Text style={styles.storeDelivery}>{store.deliveryTime} • {store.distance}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function SpecialDealsSection({ onSeeMore }: { onSeeMore: () => void }) {
  return (
    <View style={styles.specialDealsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Special Deal</Text>
        <TouchableOpacity onPress={onSeeMore} activeOpacity={0.8}>
          <View style={styles.seeMoreButton}>
            <Text style={styles.seeMoreText}>See more {'>'}</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dealsContainer}
      >
        {specialDeals.map((deal) => (
          <TouchableOpacity key={deal.id} style={styles.dealItem} activeOpacity={0.9}>
            <View style={styles.dealImageContainer}>
              <Image source={{ uri: deal.image }} style={styles.dealImage} />
              <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'transparent']}
                style={styles.dealImageOverlay}
              />
            </View>
            <View style={styles.dealInfo}>
              <Text style={styles.dealName}>{deal.name}</Text>
              <View style={styles.dealPriceContainer}>
                <Text style={styles.dealPrice}>{deal.price}</Text>
                <Text style={styles.dealOriginalPrice}>{deal.originalPrice}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function BottomNavigation() {
  return (
    <View style={styles.bottomNavigation}>
      <View style={styles.navItems}>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]} activeOpacity={0.8}>
          <View style={styles.navIconContainer}>
            <Ionicons name="home" size={24} color="#4CAF50" />
          </View>
          <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
          <View style={styles.navIconContainer}>
            <Ionicons name="heart" size={24} color="#999" />
          </View>
          <Text style={styles.navText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
          <View style={styles.navIconContainer}>
            <Ionicons name="cart" size={24} color="#999" />
          </View>
          <Text style={styles.navText}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
          <View style={styles.navIconContainer}>
            <Ionicons name="person" size={24} color="#999" />
          </View>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function CustomerHome({ navigation }: any) {
  const [chatbotVisible, setChatbotVisible] = useState(false);

  const handleSeeMoreStores = () => {
    navigation.navigate('AllStores');
  };

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
          <PopularStoresSection onSeeMore={handleSeeMoreStores} />
          <SpecialDealsSection onSeeMore={() => navigation.navigate('Deals')} />
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
    backgroundColor: '#F8FCF8',
  },
  backgroundGradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  
  // Header Section with Enhanced 3D Styling
  headerGradient: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  appTitleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 15,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 4,
    fontWeight: '500',
  },
  customerName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  headerButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F44336',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  searchIcon: {
    marginRight: 16,
  },
  searchInput: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    marginRight: 8,
  },
  
  // Banner Section with Enhanced 3D Styling
  bannerContainer: {
    marginHorizontal: 20,
    marginVertical: 24,
  },
  bannerScrollContent: {
    paddingRight: 20,
  },
  bannerCard: {
    width: screenWidth - 40,
    height: 160,
    backgroundColor: '#fff',
    borderRadius: 20,
    flexDirection: 'row',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  bannerLeft: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  bannerDiscountLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 4,
    fontWeight: '600',
  },
  bannerDiscountPercent: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    lineHeight: 22,
  },
  bannerButton: {
    alignSelf: 'flex-start',
  },
  bannerButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bannerButtonText: {
    fontSize: 14,
    fontWeight: '700',
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
    borderRadius: 16,
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
    width: 24,
  },
  
  // Categories Section with Enhanced 3D Styling
  categoriesSection: {
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  categoriesContainer: {
    paddingRight: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 28,
    width: 70,
  },
  categoryIcon: {
    width: 65,
    height: 65,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  
  // Popular Stores Section with Enhanced 3D Styling
  popularStoresSection: {
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  seeMoreButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E8F5E8',
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  seeMoreText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '700',
  },
  storesContainer: {
    paddingRight: 20,
  },
  storeItem: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    overflow: 'hidden',
  },
  storeImageContainer: {
    position: 'relative',
    height: 120,
  },
  storeImage: {
    width: '100%',
    height: '100%',
  },
  storeImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  storeInfo: {
    padding: 16,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  storeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  storeRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '700',
    color: '#F57C00',
  },
  storeType: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4CAF50',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  storeDelivery: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  
  // Special Deals Section with Enhanced 3D Styling
  specialDealsSection: {
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  dealsContainer: {
    paddingRight: 20,
  },
  dealItem: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginRight: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  dealImageContainer: {
    position: 'relative',
    width: '100%',
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  dealImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  dealImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  dealInfo: {
    flex: 1,
  },
  dealName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    lineHeight: 18,
  },
  dealPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dealPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4CAF50',
  },
  dealOriginalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  
  // Bottom Navigation with Enhanced 3D Styling
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  navItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    minWidth: 80,
  },
  navItemActive: {
    backgroundColor: '#E8F5E8',
  },
  navIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  navTextActive: {
    color: '#4CAF50',
    fontWeight: '700',
  },
});


