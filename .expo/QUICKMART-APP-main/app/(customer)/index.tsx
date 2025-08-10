import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, ScrollView, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Search, MapPin, Filter, ChevronDown, Bell, ShoppingBag, TrendingUp } from 'lucide-react-native';
import StoreCard from '@/components/StoreCard';
import EmptyState from '@/components/EmptyState';
import { getColors } from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';
import { Store } from '@/types';
import { useLocationStore } from '@/store/location-store';
import { mockStores } from '@/mocks/stores';
import { useProductStore } from '@/store/product-store';
import { useCartStore } from '@/store/cart-store';



export default function CustomerHomeScreen() {
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  const styles = createStyles(Colors);
  
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });
  
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -20],
    extrapolate: 'clamp',
  });
  

  
  // Animation for store cards
  const storeAnimations = useRef<Animated.Value[]>([]);
  const router = useRouter();
  const { 
    userLocation, 
    isLoading: isLocationLoading, 
    error: locationError,
    requestLocationPermission,
    getCurrentLocation,
    getNearbyStores
  } = useLocationStore();
  
  const { products } = useProductStore();
  const { getItemCount } = useCartStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);

  
  // Get stores that have verified products
  const getStoresWithVerifiedProducts = () => {
    const storeIds = new Set<string>();
    
    // Add stores with verified custom products
    products
      .filter(p => p.verified)
      .forEach(p => storeIds.add(p.storeId));
    
    // Add all mock stores (they have products by default)
    mockStores.forEach(s => storeIds.add(s.id));
    
    return mockStores.filter(store => storeIds.has(store.id));
  };
  
  // Initialize store animations
  useEffect(() => {
    // Initialize store animations when stores are loaded
    if (stores.length > 0) {
      storeAnimations.current = stores.map(() => new Animated.Value(0));
      
      // Stagger animation for store cards
      Animated.stagger(
        150,
        storeAnimations.current.map(anim => 
          Animated.spring(anim, {
            toValue: 1,
            friction: 8,
            tension: 50,
            useNativeDriver: true,
          })
        )
      ).start();
    }
  }, [stores]);
  
  useEffect(() => {
    let isMounted = true;
    
    const initLocation = async () => {
      try {
        const hasPermission = await requestLocationPermission();
        if (hasPermission && isMounted) {
          await getCurrentLocation();
        }
        
        if (!isMounted) return;
        
        // Get stores with or without location, but only those with verified products
        const availableStores = getStoresWithVerifiedProducts();
        const nearbyStores = userLocation 
          ? getNearbyStores(10, availableStores) 
          : availableStores;
        
        setStores(nearbyStores);
        setFilteredStores(nearbyStores);
        
        setIsLoading(false);
      } catch (error) {
        console.log('Init location error:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    initLocation();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStores(stores);
    } else {
      const filtered = stores.filter(store => 
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.categories.some(category => 
          category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredStores(filtered);
    }
  }, [searchQuery, stores]);
  
  const handleStorePress = (store: Store) => {
    router.push({
      pathname: '/store/[id]',
      params: { id: store.id }
    });
  };
  

  

  

  

  

  

  

  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Animated Header with Profile and Location */}
      <Animated.View style={[
        styles.header,
        { 
          opacity: headerOpacity,
          transform: [{ translateY: headerTranslateY }] 
        }
      ]}>
        <View style={styles.headerTop}>
          <View style={styles.profileSection}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' }}
              style={styles.profileImage}
            />
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Location</Text>
              <View style={styles.locationRow}>
                <MapPin size={14} color={Colors.warning} />
                <Text style={styles.locationText}>Hanoi, Vietnam</Text>
                <ChevronDown size={14} color={Colors.text} />
              </View>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.notificationButton}
              activeOpacity={0.7}
            >
              <Bell size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={Colors.subtext} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products, stores & more"
              placeholderTextColor={Colors.subtext}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.filterButton}
            activeOpacity={0.7}
          >
            <Filter size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Finding stores near you...</Text>
        </View>
      ) : (
        <Animated.ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          

          
          {/* Stores Section with Enhanced Animation */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <ShoppingBag size={18} color={Colors.primary} />
                <Text style={styles.sectionTitle}>
                  {filteredStores.length} {filteredStores.length === 1 ? 'Store' : 'Stores'} Available
                </Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>View Map</Text>
              </TouchableOpacity>
            </View>
            
            {filteredStores.length === 0 ? (
              <EmptyState
                title="No Stores Found"
                message={
                  searchQuery 
                    ? "We couldn't find any stores matching your search." 
                    : "There are no stores available in your area yet."
                }
                buttonText="Refresh"
                onButtonPress={() => {
                  setIsLoading(true);
                  getCurrentLocation();
                }}
              />
            ) : (
              <View style={styles.storesList}>
                {filteredStores.map((store, index) => {
                  const storeAnim = storeAnimations.current[index] || new Animated.Value(1);
                  
                  return (
                    <Animated.View 
                      key={store.id} 
                      style={{
                        opacity: storeAnim,
                        transform: [{
                          scale: storeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.8, 1],
                          })
                        }, {
                          translateY: storeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [30, 0],
                          })
                        }]
                      }}
                    >
                      <StoreCard 
                        store={store} 
                        onPress={handleStorePress} 
                      />
                    </Animated.View>
                  );
                })}
              </View>
            )}
          </View>
          {/* Popular Stores Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <TrendingUp size={18} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Popular This Week</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>View all</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.popularStoresList}
            >
              {stores.slice(0, 5).map((store, index) => (
                <View key={store.id} style={styles.popularStoreCard}>
                  <TouchableOpacity 
                    onPress={() => handleStorePress(store)}
                    activeOpacity={0.8}
                  >
                    <Image 
                      source={{ uri: store.coverImage || store.logo }} 
                      style={styles.popularStoreImage}
                      resizeMode="cover"
                    />
                    <View style={styles.popularStoreOverlay}>
                      <Text style={styles.popularStoreName}>{store.name}</Text>
                      <View style={styles.popularStoreRating}>
                        <Text style={styles.popularStoreRatingText}>⭐ {store.rating}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </Animated.ScrollView>
      )}
      
      {/* Animated Cart Button */}
      {getItemCount() > 0 && (
        <Animated.View
          style={[
            styles.cartButtonContainer,
            {
              transform: [{
                translateY: scrollY.interpolate({
                  inputRange: [0, 200],
                  outputRange: [0, 20],
                  extrapolate: 'clamp',
                })
              }]
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => router.push('/(customer)/cart')}
            activeOpacity={0.8}
          >
            <ShoppingBag size={20} color={Colors.white} />
            <Text style={styles.cartButtonText}>
              View Cart ({getItemCount()})
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const createStyles = (Colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: Colors.subtext,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 4,
    marginRight: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text,
  },
  filterButton: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  bannerContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
    marginTop: 16,
  },
  banner: {
    backgroundColor: '#FFF3CD',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 12,
  },
  orderButton: {
    backgroundColor: Colors.warning,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  orderButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  bannerImageContainer: {
    marginLeft: 16,
  },
  bannerImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.subtext,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 100, // Space for cart button
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 8,
  },
  popularStoresList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  popularStoreCard: {
    width: 160,
    height: 120,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  popularStoreImage: {
    width: '100%',
    height: '100%',
  },
  popularStoreOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
  },
  popularStoreName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  popularStoreRating: {
    alignSelf: 'flex-start',
  },
  popularStoreRatingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },

  storesList: {
    paddingHorizontal: 16,
  },
  cartButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 100,
  },
  cartButton: {
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cartButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  

});