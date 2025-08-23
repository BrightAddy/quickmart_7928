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
        <TouchableOpacity onPress={onSeeMore}>
          <Text style={styles.seeMoreText}>See more {'>'}</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storesContainer}
      >
        {popularStores.map((store) => (
          <TouchableOpacity key={store.id} style={styles.storeItem}>
            <View style={styles.storeImageContainer}>
              <Image source={{ uri: store.image }} style={styles.storeImage} />
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(store.id.toString())}
              >
                <Ionicons 
                  name={favorites.has(store.id.toString()) ? "heart" : "heart-outline"} 
                  size={20} 
                  color={favorites.has(store.id.toString()) ? "#E91E63" : "#fff"} 
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.storeName}>{store.name}</Text>
            <View style={styles.storeMeta}>
              <View style={styles.storeRating}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{store.rating}</Text>
              </View>
              <Text style={styles.storeType}>{store.type}</Text>
            </View>
            <Text style={styles.storeDelivery}>{store.deliveryTime} • {store.distance}</Text>
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
        <TouchableOpacity onPress={onSeeMore}>
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
  
  // Popular Stores Section
  popularStoresSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  storesContainer: {
    paddingRight: 16,
  },
  storeItem: {
    marginRight: 16,
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  storeImageContainer: {
    position: 'relative',
    width: '100%',
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  storeImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  storeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  storeRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  storeType: {
    fontSize: 12,
    color: '#666',
  },
  storeDelivery: {
    fontSize: 12,
    color: '#999',
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
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#f2f2f2",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  active: {
    backgroundColor: "#2ecc71",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  modalStoresList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  modalStoreItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  modalStoreImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  modalStoreInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  modalStoreName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  modalStoreMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalStoreRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  modalRatingText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  modalStoreType: {
    fontSize: 13,
    color: '#6c757d',
  },
  modalStoreDelivery: {
    fontSize: 13,
    color: '#6c757d',
    marginBottom: 6,
  },
  modalStoreCategories: {
    flexDirection: 'row',
    gap: 6,
  },
  modalStoreCategory: {
    fontSize: 11,
    color: '#6c757d',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
});


