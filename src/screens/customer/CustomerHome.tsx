import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, Image, SafeAreaView, StatusBar, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useChatbot } from '../../context/ChatbotContext';
import { FloatingChatbotButton, ChatbotModal } from '../../components/UI';
import GlowingBorderCard from '../../components/GlowingBorderCard';
import { useProducts } from '../../context/ProductsContext';
// import bananaImg from '../../../assets/images/slide2-shopping.svg'; // SVG not supported in React Native

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Real data for the app
const specialDeals = [
  {
    id: 1,
    name: 'Fresh Organic Carrots',
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '₵ 18.00',
    originalPrice: '₵ 21.00',
    discount: '15%',
  },
  {
    id: 2,
    name: 'Ripe Red Tomatoes',
    image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '₵ 15.00',
    originalPrice: '₵ 20.00',
    discount: '25%',
  },
  {
    id: 3,
    name: 'Fresh Green Spinach',
    image: 'https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '₵ 12.00',
    originalPrice: '₵ 18.00',
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

// New vertical nearby stores (diverse)
const nearbyStoresData = [
  { id: 'ns1', name: 'Sunrise Supermarket', type: 'Supermarket', rating: 4.6, eta: '10-20 min', distance: '0.7 km', image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&fit=crop&w=400&q=80' },
  { id: 'ns2', name: 'MedCare Pharmacy', type: 'Pharmacy', rating: 4.8, eta: '15-25 min', distance: '1.1 km', image: 'https://images.pexels.com/photos/3985167/pexels-photo-3985167.jpeg?auto=compress&fit=crop&w=400&q=80' },
  { id: 'ns3', name: 'City Fresh Mart', type: 'Grocery', rating: 4.5, eta: '12-22 min', distance: '1.4 km', image: 'https://images.pexels.com/photos/4393667/pexels-photo-4393667.jpeg?auto=compress&fit=crop&w=400&q=80' },
  { id: 'ns4', name: 'StyleHub Boutique', type: 'Clothing', rating: 4.3, eta: '20-30 min', distance: '2.3 km', image: 'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&fit=crop&w=400&q=80' },
  { id: 'ns5', name: 'GreenLeaf Organics', type: 'Organic Store', rating: 4.7, eta: '18-28 min', distance: '1.9 km', image: 'https://images.pexels.com/photos/586744/pexels-photo-586744.jpeg?auto=compress&fit=crop&w=400&q=80' },
  { id: 'ns6', name: 'Tech n’ Phones', type: 'Electronics', rating: 4.2, eta: '25-35 min', distance: '3.1 km', image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&fit=crop&w=400&q=80' },
];

function HomeUnifiedSearch({ navigation }: any) {
  const { searchProducts, searchStores } = useProducts();
  const [q, setQ] = React.useState('');
  const [show, setShow] = React.useState(false);
  const storeResults = React.useMemo(() => q.trim() ? searchStores(q.trim()).slice(0, 5) : [], [q]);
  const productResults = React.useMemo(() => q.trim() ? searchProducts(q.trim()).slice(0, 5) : [], [q]);
  return (
    <View style={{ marginHorizontal: 20, marginTop: 16, marginBottom: 16, zIndex: 20 }}>
      <View style={styles.homeSearchRow}>
        <Ionicons name="search" size={20} color="#8A8F98" />
        <TextInput
          style={styles.homeSearchInput}
          placeholder="Search for products or stores"
          placeholderTextColor="#8A8F98"
          value={q}
          onChangeText={(t) => { setQ(t); setShow(true); }}
          onFocus={() => setShow(true)}
          returnKeyType="search"
        />
      </View>
      {show && q.trim().length > 0 && (
        <View style={styles.homeSearchResults}>
          <Text style={styles.resultSectionTitle}>Stores</Text>
          {storeResults.length === 0 ? (
            <Text style={styles.resultEmpty}>No matching stores</Text>
          ) : (
            storeResults.map((s: any) => (
              <TouchableOpacity key={s.id} style={styles.resultRow} onPress={() => { setShow(false); setQ(''); navigation.navigate('StoreBrowse', { store: { id: s.id, name: s.name, rating: s.rating, deliveryTime: s.deliveryTime, image: s.imageUrl } }); }}>
                <Text style={styles.resultRowTitle}>{s.name}</Text>
                <Text style={styles.resultRowMeta}>{(s.categories || []).slice(0, 2).join(' • ')}</Text>
              </TouchableOpacity>
            ))
          )}
          <Text style={[styles.resultSectionTitle, { marginTop: 12 }]}>Products</Text>
          {productResults.length === 0 ? (
            <Text style={styles.resultEmpty}>No matching products</Text>
          ) : (
            productResults.map((p: any) => (
              <TouchableOpacity key={p.id} style={styles.resultRow} onPress={() => { setShow(false); setQ(''); navigation.navigate('ProductDetails', { product: p }); }}>
                <Text style={styles.resultRowTitle}>{p.name}</Text>
                <Text style={[styles.resultRowMeta, { color: '#1CA77C', fontWeight: '700' }]}>GHS {Number(p.price).toFixed(2)}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}
    </View>
  );
}

export default function CustomerHome({ navigation }: any) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const { toggleChat, isOpen } = useChatbot();

  // Animations for vertical nearby stores
  const nearbyAnims = nearbyStoresData.map(() => new Animated.Value(0));

  React.useEffect(() => {
    const animations = nearbyAnims.map((a, idx) => Animated.timing(a, { toValue: 1, duration: 450, delay: 80 * idx, useNativeDriver: true }));
    Animated.stagger(80, animations).start();
  }, []);

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
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Header Section - White background, horizontal row */}
      <View style={styles.headerWhite}>
        <View style={styles.headerRow}>
          {/* Left: Avatar and Greeting */}
          <View style={styles.headerLeft}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>KA</Text>
            </View>
            <View style={styles.greetingTextContainer}>
              <Text style={styles.greetingSmall}>Welcome back,</Text>
              <Text style={styles.greetingName}>Kwame Asante</Text>
            </View>
          </View>
          {/* Right: Gear and Bell icons */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.navigate('UserPreferences')}>
              <Ionicons name="settings-sharp" size={24} color="#1CA77C" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.navigate('Notifications')}>
              <Ionicons name="notifications" size={24} color="#1CA77C" />
              <View style={styles.redDot} />
            </TouchableOpacity>
          </View>
          </View>
        </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Unified Search (Stores + Products) */}
        <HomeUnifiedSearch navigation={navigation} />
        {/* Promotional Banner */}
        <View style={styles.promoBannerCard}>
          {/* Left copy */}
          <View style={styles.promoBannerLeft}>
            <View style={styles.promoBadgeGreen}>
              <Text style={styles.promoBadgeGreenText}>20% OFF</Text>
            </View>
            <Text style={styles.promoBannerTitle}>Fresh Yam & Plantain</Text>
            <Text style={styles.promoBannerSubtitle}>Get 20% off on fresh produce</Text>
          </View>
          {/* Right image */}
          <View style={styles.promoImageWrap}>
            <Image source={{ uri: 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=800' }} style={styles.promoImageRight} />
          </View>
          {/* Decorative accent */}
          <LinearGradient colors={['#F0FFF9', '#E6FBF2']} style={styles.promoRightAccent} />
        </View>
        {/* Featured Stores (horizontal) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitleBlack}>Featured for You</Text>
          <View style={styles.sectionAccent} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storesScroll}>
          <View style={styles.storesRow}>
            {/* Store Card 1 */}
            <TouchableOpacity style={styles.storeCard} activeOpacity={0.9} onPress={() => navigation.navigate('StoreBrowse', { store: { id: 'store-001', name: "Kofi's Fresh Market", rating: 4.8, deliveryTime: "15-25 min", distance: "0.8 km", image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&fit=crop&w=400&q=80' } })}>
              <View style={styles.storeImageContainer}>
                <Image source={{ uri: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&fit=crop&w=400&q=80' }} style={styles.storeImage} />
                <TouchableOpacity 
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(1)}
                  activeOpacity={0.8}
                >
                  <Ionicons 
                    name={favorites.has(1) ? "heart" : "heart-outline"} 
                    size={20} 
                    color={favorites.has(1) ? "#e91e63" : "#fff"} 
                  />
                </TouchableOpacity>
          </View>
              <Text style={styles.storeName}>Kofi's Fresh Market</Text>
              <Text style={styles.storeRatingMuted}>4.8 ★ • 15-25 min • 0.8 km</Text>
              {/* Minimal tags to reduce clutter */}
              <View style={styles.storeTagsRow}>
                <View style={styles.storeTag}><Text style={styles.storeTagText}>Popular</Text></View>
              </View>
              </TouchableOpacity>
            {/* Store Card 2 */}
            <TouchableOpacity style={styles.storeCard} activeOpacity={0.9} onPress={() => navigation.navigate('StoreBrowse', { store: { id: 'store-002', name: "Ama's Grocery Store", rating: 4.6, deliveryTime: "20-30 min", distance: "1.2 km", image: 'https://images.pexels.com/photos/4393667/pexels-photo-4393667.jpeg?auto=compress&fit=crop&w=400&q=80' } })}>
              <View style={styles.storeImageContainer}>
                <Image source={{ uri: 'https://images.pexels.com/photos/4393667/pexels-photo-4393667.jpeg?auto=compress&fit=crop&w=400&q=80' }} style={styles.storeImage} />
            <TouchableOpacity 
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(2)}
              activeOpacity={0.8}
                >
                  <Ionicons 
                    name={favorites.has(2) ? "heart" : "heart-outline"} 
                    size={20} 
                    color={favorites.has(2) ? "#e91e63" : "#fff"} 
                  />
            </TouchableOpacity>
          </View>
              <Text style={styles.storeName}>Ama's Grocery</Text>
              <Text style={styles.storeRatingMuted}>4.6 ★ • 20-30 min • 1.2 km</Text>
              <View style={styles.storeTagsRow}>
                <View style={styles.storeTag}><Text style={styles.storeTagText}>Groceries</Text></View>
              </View>
            </TouchableOpacity>
            {/* Store Card 3 */}
            <TouchableOpacity style={styles.storeCard} activeOpacity={0.9} onPress={() => navigation.navigate('StoreBrowse', { store: { id: 'store-003', name: 'Fresh Market Accra', rating: 4.5, deliveryTime: '25-35 min', distance: '1.5 km', image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&fit=crop&w=400&q=80' } })}>
              <View style={styles.storeImageContainer}>
                <Image source={{ uri: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&fit=crop&w=400&q=80' }} style={styles.storeImage} />
                  <TouchableOpacity 
                    style={styles.favoriteButton}
                  onPress={() => toggleFavorite(3)}
                    activeOpacity={0.8}
                  >
                    <Ionicons 
                    name={favorites.has(3) ? "heart" : "heart-outline"} 
                      size={20} 
                    color={favorites.has(3) ? "#e91e63" : "#fff"} 
                    />
                  </TouchableOpacity>
                  </View>
              <Text style={styles.storeName}>Fresh Mart</Text>
              <Text style={styles.storeRatingMuted}>4.7 ★ • 10-20 min • 0.5 km</Text>
              <View style={styles.storeTagsRow}>
                <View style={styles.storeTag}><Text style={styles.storeTagText}>Organic</Text></View>
              </View>
                  </TouchableOpacity>
                </View>
        </ScrollView>

        {/* Nearby Stores (Vertical) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitleBlack}>Nearby Stores</Text>
          <View style={[styles.sectionAccent, { width: 46 }]} />
        </View>
        <View style={{ paddingHorizontal: 20, gap: 12, marginBottom: 24 }}>
          {nearbyStoresData.map((s, index) => (
            <Animated.View
              key={s.id}
              style={{
                opacity: nearbyAnims[index],
                transform: [{ translateY: nearbyAnims[index].interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
              }}
            >
              <GlowingBorderCard radius={16} glowColor={'#1CA77C'} thickness={2} durationMs={6500} style={{ borderRadius: 16 }}>
                <TouchableOpacity
                  style={styles.nearbyCard}
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('StoreBrowse', { store: { id: s.id, name: s.name, rating: s.rating, deliveryTime: s.eta, distance: s.distance, image: s.image, type: s.type } })}
                >
                  <Image source={{ uri: s.image }} style={styles.nearbyImage} />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={styles.nearbyName}>{s.name}</Text>
                      <View style={styles.typeChip}><Text style={styles.typeChipText}>{s.type}</Text></View>
                    </View>
                    <Text style={styles.nearbyMeta}>{s.rating} ★ • {s.eta} • {s.distance}</Text>
                  </View>
                </TouchableOpacity>
              </GlowingBorderCard>
            </Animated.View>
          ))}
        </View>

        {/* Quick Reorder Section Title */}
        <Text style={styles.sectionTitleBlack}>Quick Reorder</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickReorderScroll}>
          <View style={styles.quickReorderCard}>
            <Image source={{ uri: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&fit=crop&w=400&q=80' }} style={styles.quickReorderImage} />
            <View style={styles.quickReorderMiddle}>
              <Text style={styles.quickReorderStoreName}>Kofi's Fresh Market</Text>
              <Text style={styles.quickReorderSubtitle}>Rice (5kg), Palm Oil (1L)</Text>
                </View>
            <View style={styles.quickReorderRight}>
              <Text style={styles.quickReorderPrice}>GHS 85.50</Text>
              <TouchableOpacity style={styles.reorderButton} activeOpacity={0.8}>
                <Text style={styles.reorderButtonText}>Reorder</Text>
              </TouchableOpacity>
        </View>
          </View>
          <View style={styles.quickReorderCard}>
            <Image source={{ uri: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&fit=crop&w=400&q=80' }} style={styles.quickReorderImage} />
            <View style={styles.quickReorderMiddle}>
              <Text style={styles.quickReorderStoreName}>Ama's Grocery</Text>
              <Text style={styles.quickReorderSubtitle}>Tomatoes (2kg), Onions (1kg)</Text>
                  </View>
            <View style={styles.quickReorderRight}>
              <Text style={styles.quickReorderPrice}>GHS 45.20</Text>
              <TouchableOpacity style={styles.reorderButton} activeOpacity={0.8}>
                <Text style={styles.reorderButtonText}>Reorder</Text>
              </TouchableOpacity>
            </View>
          </View>
          </ScrollView>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Chat Button - Movable like Assistive Touch */}
      <FloatingChatbotButton onPress={toggleChat} />

      {/* Chatbot Component (new modal) */}
      <ChatbotModal visible={isOpen} onClose={toggleChat} />

      {/* Bottom Navigation */}
      {/* Removed the custom bottom navigation bar here */}
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
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '400',
    opacity: 0.9,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
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
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
  },
  homeSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    elevation: 4,
    shadowColor: '#1CA77C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(28,167,124,0.18)',
  },
  homeSearchInput: { flex: 1, fontSize: 15, color: '#0F172A', marginLeft: 8, fontWeight: '600' },
  homeSearchResults: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  resultSectionTitle: { fontWeight: '700', fontSize: 13, color: '#222', marginBottom: 6 },
  resultEmpty: { color: '#7D8B97', fontSize: 12 },
  resultRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  resultRowTitle: { fontWeight: '600', color: '#222' },
  resultRowMeta: { fontSize: 12, color: '#7D8B97' },
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
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
    color: '#333',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  headerWhite: {
    backgroundColor: '#fff',
    paddingTop: 22,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#CFF9E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: '#1CA7CE',
    fontWeight: 'bold',
    fontSize: 18,
  },
  greetingTextContainer: {
    justifyContent: 'center',
  },
  greetingSmall: {
    fontSize: 13,
    color: '#888',
    fontWeight: '400',
    marginBottom: 2,
  },
  greetingName: {
    fontSize: 17,
    color: '#222',
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    position: 'relative',
    borderWidth: 2,
    borderColor: 'rgba(28,167,124,0.18)',
    shadowColor: '#1CA77C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  redDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarPill: {
    backgroundColor: '#F2F3F5',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    gap: 10,
  },
  promoBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9F9ED',
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 24,
    minHeight: 100,
  },
  promoBannerLeft: {
    flex: 1,
    justifyContent: 'center',
    gap: 7,
  },
  promoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#2ECC40',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
  },
  promoBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  promoBadgeGreen: {
    alignSelf: 'flex-start',
    backgroundColor: '#14B86E',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
  },
  promoBadgeGreenText: { color: '#fff', fontWeight: '800', fontSize: 12, letterSpacing: 0.4 },
  promoBannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  promoBannerSubtitle: {
    fontSize: 14,
    color: '#7D8B97',
    fontWeight: '400',
  },
  promoImageWrap: { width: 135, height: 86, borderRadius: 16, overflow: 'hidden', marginLeft: 18 },
  promoImageRight: { width: '100%', height: '100%' },
  promoRightAccent: { position: 'absolute', right: 10, top: 10, width: 8, height: 76, borderRadius: 6, opacity: 0.8 },
  sectionTitleBlack: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginHorizontal: 20,
    marginBottom: 16,
    marginTop: 0,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 8,
  },
  sectionAccent: {
    height: 4,
    width: 64,
    borderRadius: 2,
    backgroundColor: '#1CA77C',
    opacity: 0.25,
  },
  storesScroll: {
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 24,
  },
  storesRow: {
    flexDirection: 'row',
    gap: 16,
  },
  storeCard: {
    width: 240,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    shadowColor: '#1CA77C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'rgba(28,167,124,0.18)',
  },
  storeImageContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 8,
  },
  storeImage: {
    width: '100%',
    height: 90,
    borderRadius: 14,
    backgroundColor: '#eee',
  },
  storeName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 3,
  },
  storeRatingMuted: {
    fontSize: 12,
    color: '#9AA6B2',
    marginBottom: 8,
  },
  storeTagsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  storeTag: {
    backgroundColor: '#D6F5E3',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  storeTagText: {
    color: '#1CA77C',
    fontSize: 11,
    fontWeight: '600',
  },
  nearbyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  nearbyImage: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  nearbyName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  nearbyMeta: {
    fontSize: 12,
    color: '#7D8B97',
  },
  typeChip: {
    backgroundColor: '#F2F3F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeChipText: {
    fontSize: 11,
    color: '#444',
    fontWeight: '600',
  },
  quickReorderScroll: {
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 24,
  },
  quickReorderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginRight: 16,
    width: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  quickReorderImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#eee',
    marginRight: 12,
  },
  quickReorderMiddle: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  quickReorderStoreName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  quickReorderSubtitle: {
    fontSize: 13,
    color: '#7D8B97',
    fontWeight: '400',
  },
  quickReorderRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
  },
  quickReorderPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1CA77C',
  },
  reorderButton: {
    backgroundColor: '#1CA77C',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  reorderButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
