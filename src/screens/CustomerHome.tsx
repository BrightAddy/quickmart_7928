import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, Image, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Real data for the app
const specialDeals = [
  {
    id: 1,
    name: 'Fresh Organic Carrots',
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 'Rp 18,000',
    originalPrice: 'Rp 21,000',
    discount: '15%',
  },
  {
    id: 2,
    name: 'Ripe Red Tomatoes',
    image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 'Rp 15,000',
    originalPrice: 'Rp 20,000',
    discount: '25%',
  },
  {
    id: 3,
    name: 'Fresh Green Spinach',
    image: 'https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 'Rp 12,000',
    originalPrice: 'Rp 18,000',
    discount: '33%',
  },
];

const categories = [
  { id: 1, name: 'Vegetables', icon: 'leaf', color: '#51bc7d', bgColor: 'rgba(81, 188, 125, 0.1)' },
  { id: 2, name: 'Fruits', icon: 'food-apple', color: '#ff6b6b', bgColor: 'rgba(255, 107, 107, 0.1)' },
  { id: 3, name: 'Meat & Eggs', icon: 'food-steak', color: '#51bc7d', bgColor: 'rgba(81, 188, 125, 0.1)' },
  { id: 4, name: 'Drinks', icon: 'cup-water', color: '#4cad73', bgColor: 'rgba(76, 173, 115, 0.1)' },
  { id: 5, name: 'Bakery', icon: 'cake-variant', color: '#ffd93d', bgColor: 'rgba(255, 217, 61, 0.1)' },
];

const promotionalBanners = [
  {
    id: 1,
    title: 'Fresh Vegetables',
    subtitle: 'Get 25% off',
    image: 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=800',
    backgroundColor: '#51bc7d',
  },
  {
    id: 2,
    title: 'Organic Fruits',
    subtitle: 'Special offer',
    image: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=800',
    backgroundColor: '#4cad73',
  },
];

export default function CustomerHome({ navigation }: any) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(new Set());

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#51bc7d" />
      
      {/* Header Background */}
      <LinearGradient
        colors={['#51bc7d', '#4cad73']}
        style={styles.headerBackground}
      >
        {/* App Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Kangsayur</Text>
        </View>

        {/* Header Icons */}
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIconButton}>
            <Ionicons name="notifications" size={24} color="#fff" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconButton}>
            <Ionicons name="mail" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#bdbdbd" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for fruits, vegetables, groce..."
              placeholderTextColor="#bdbdbd"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.locationContainer}>
          <View style={styles.locationLeft}>
            <Ionicons name="location" size={16} color="#fff" />
            <Text style={styles.sentToText}>Sent to</Text>
          </View>
          <View style={styles.locationRight}>
            <Text style={styles.addressText}>Pamulang Barat Residence No.5, RT 05/ ...</Text>
            <Ionicons name="chevron-down" size={20} color="#fff" />
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Promotional Banner */}
        <View style={styles.bannerContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const slideIndex = Math.round(event.nativeEvent.contentOffset.x / (screenWidth - 40));
              setCurrentSlide(slideIndex);
            }}
          >
            {promotionalBanners.map((banner, index) => (
              <View key={banner.id} style={styles.bannerSlide}>
                <Image source={{ uri: banner.image }} style={styles.bannerImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.3)']}
                  style={styles.bannerOverlay}
                >
                  <View style={styles.bannerContent}>
                    <Text style={styles.bannerTitle}>{banner.title}</Text>
                    <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </ScrollView>
          
          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            {promotionalBanners.map((_, index) => (
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

        {/* Categories Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryCard} activeOpacity={0.8}>
                <View style={[styles.categoryIcon, { backgroundColor: category.bgColor }]}>
                  <MaterialCommunityIcons name={category.icon as any} size={28} color={category.color} />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Special Deal Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Special Deal</Text>
            <TouchableOpacity style={styles.seeMoreButton} activeOpacity={0.8}>
              <Text style={styles.seeMoreText}>See more</Text>
              <Ionicons name="chevron-forward" size={16} color="#0eb177" />
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dealsScroll}>
            {specialDeals.map((deal) => (
              <TouchableOpacity key={deal.id} style={styles.dealCard} activeOpacity={0.9}>
                <View style={styles.dealImageContainer}>
                  <Image source={{ uri: deal.image }} style={styles.dealImage} />
                  <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'transparent']}
                    style={styles.dealImageOverlay}
                  />
                  <TouchableOpacity 
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(deal.id)}
                    activeOpacity={0.8}
                  >
                    <Ionicons 
                      name={favorites.has(deal.id) ? "heart" : "heart-outline"} 
                      size={20} 
                      color={favorites.has(deal.id) ? "#e91e63" : "#fff"} 
                    />
                  </TouchableOpacity>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{deal.discount}</Text>
                  </View>
                </View>
                <View style={styles.dealInfo}>
                  <Text style={styles.dealName}>{deal.name}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.currentPrice}>{deal.price} /kg</Text>
                    <Text style={styles.originalPrice}>{deal.originalPrice} /kg</Text>
                  </View>
                  <TouchableOpacity style={styles.addToCartButton} activeOpacity={0.8}>
                    <View style={styles.plusIcon}>
                      <View style={styles.plusLine1} />
                      <View style={styles.plusLine2} />
                    </View>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]} activeOpacity={0.8}>
          <Ionicons name="home" size={24} color="#51bc7d" />
          <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
          <Ionicons name="heart" size={24} color="#999" />
          <Text style={styles.navText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
          <Ionicons name="cart" size={24} color="#999" />
          <Text style={styles.navText}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
          <Ionicons name="person" size={24} color="#999" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBackground: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'Montserrat Alternates',
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginBottom: 20,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    backgroundColor: '#eb5757',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sentToText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  locationRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    justifyContent: 'flex-end',
  },
  addressText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  bannerContainer: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  bannerSlide: {
    width: screenWidth - 40,
    height: 163,
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 20,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  bannerContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  paginationDotActive: {
    width: 29,
    backgroundColor: '#51bc7d',
  },
  sectionContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    letterSpacing: 0.3,
  },
  seeMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeMoreText: {
    fontSize: 13,
    color: '#0eb177',
    fontWeight: '500',
    letterSpacing: -0.08,
  },
  categoriesScroll: {
    paddingRight: 20,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 20,
    width: 76,
  },
  categoryIcon: {
    width: 54,
    height: 53,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  categoryName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    lineHeight: 18,
  },
  dealsScroll: {
    paddingRight: 20,
  },
  dealCard: {
    width: 157,
    height: 251,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  dealImageContainer: {
    position: 'relative',
    width: '100%',
    height: 130,
  },
  dealImage: {
    width: '100%',
    height: '100%',
  },
  dealImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  dealInfo: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  dealName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 18,
  },
  priceContainer: {
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#51bc7d',
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#51bc7d',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  plusIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusLine1: {
    position: 'absolute',
    width: 16,
    height: 2,
    backgroundColor: '#fff',
    borderRadius: 1,
  },
  plusLine2: {
    position: 'absolute',
    width: 2,
    height: 16,
    backgroundColor: '#fff',
    borderRadius: 1,
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navItemActive: {
    // Active state styling
  },
  navText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#51bc7d',
    fontWeight: '600',
  },
});
