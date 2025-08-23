import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Image, SafeAreaView, StatusBar, FlatList } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// --- Comprehensive Store Data ---
const allStores = [
  // Popular Stores
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
    description: 'Leading electronics and household retailer in Ghana',
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
    description: 'Premium grocery store with fresh local produce',
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
    description: 'International supermarket chain with diverse products',
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
    description: 'Convenient local mart for daily essentials',
  },
  
  // Additional Supermarkets
  {
    id: 5,
    name: 'Game',
    image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.4,
    deliveryTime: '30-40 min',
    distance: '2.1 km',
    type: 'Supermarket',
    isFavorite: false,
    categories: ['Electronics', 'Home & Garden'],
    description: 'South African retail chain with wide product range',
  },
  {
    id: 6,
    name: 'Koala',
    image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.3,
    deliveryTime: '22-32 min',
    distance: '1.8 km',
    type: 'Supermarket',
    isFavorite: false,
    categories: ['Fresh Food', 'Beverages'],
    description: 'Modern supermarket with fresh food focus',
  },
  {
    id: 7,
    name: 'Citydia',
    image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.2,
    deliveryTime: '20-30 min',
    distance: '1.6 km',
    type: 'Supermarket',
    isFavorite: false,
    categories: ['Groceries', 'Personal Care'],
    description: 'Neighborhood supermarket for daily needs',
  },
  
  // Marts
  {
    id: 8,
    name: 'QuickMart',
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.1,
    deliveryTime: '15-25 min',
    distance: '0.9 km',
    type: 'Mart',
    isFavorite: false,
    categories: ['Quick Bites', 'Essentials'],
    description: 'Quick convenience store for immediate needs',
  },
  {
    id: 9,
    name: 'MiniMart',
    image: 'https://images.pexels.com/photos/4110220/pexels-photo-4110220.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.0,
    deliveryTime: '12-22 min',
    distance: '0.7 km',
    type: 'Mart',
    isFavorite: false,
    categories: ['Snacks', 'Beverages'],
    description: 'Small neighborhood mart for quick purchases',
  },
  {
    id: 10,
    name: 'ExpressMart',
    image: 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 3.9,
    deliveryTime: '10-20 min',
    distance: '0.5 km',
    type: 'Mart',
    isFavorite: false,
    categories: ['Essentials', 'Quick Items'],
    description: 'Express convenience store for urgent needs',
  },
  
  // Local Shops
  {
    id: 11,
    name: 'Ama\'s Corner Shop',
    image: 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    deliveryTime: '8-15 min',
    distance: '0.3 km',
    type: 'Local Shop',
    isFavorite: true,
    categories: ['Local Produce', 'Traditional Items'],
    description: 'Authentic local shop with traditional Ghanaian products',
  },
  {
    id: 12,
    name: 'Kofi\'s Market',
    image: 'https://images.pexels.com/photos/2292837/pexels-photo-2292837.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    deliveryTime: '10-18 min',
    distance: '0.4 km',
    type: 'Local Shop',
    isFavorite: false,
    categories: ['Fresh Vegetables', 'Local Spices'],
    description: 'Family-owned market with fresh local vegetables',
  },
  {
    id: 13,
    name: 'Adwoa\'s Store',
    image: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.4,
    deliveryTime: '12-20 min',
    distance: '0.6 km',
    type: 'Local Shop',
    isFavorite: false,
    categories: ['Household Items', 'Local Goods'],
    description: 'Trusted local store for household essentials',
  },
  
  // Farmers Markets
  {
    id: 14,
    name: 'Accra Farmers Market',
    image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    deliveryTime: '25-35 min',
    distance: '2.5 km',
    type: 'Farmers Market',
    isFavorite: true,
    categories: ['Organic Produce', 'Fresh Fruits'],
    description: 'Large farmers market with organic and fresh produce',
  },
  {
    id: 15,
    name: 'Kumasi Fresh Market',
    image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    deliveryTime: '30-40 min',
    distance: '3.0 km',
    type: 'Farmers Market',
    isFavorite: false,
    categories: ['Local Vegetables', 'Fresh Herbs'],
    description: 'Traditional market with fresh local vegetables',
  },
  
  // Specialty Stores
  {
    id: 16,
    name: 'Organic Haven',
    image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    deliveryTime: '20-30 min',
    distance: '1.8 km',
    type: 'Specialty Store',
    isFavorite: false,
    categories: ['Organic Food', 'Health Products'],
    description: 'Premium organic and health food store',
  },
  {
    id: 17,
    name: 'Bakery Corner',
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    deliveryTime: '15-25 min',
    distance: '1.2 km',
    type: 'Specialty Store',
    isFavorite: true,
    categories: ['Fresh Bread', 'Pastries'],
    description: 'Artisanal bakery with fresh bread and pastries',
  },
  {
    id: 18,
    name: 'Seafood Paradise',
    image: 'https://images.pexels.com/photos/4110220/pexels-photo-4110220.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    deliveryTime: '25-35 min',
    distance: '2.2 km',
    type: 'Specialty Store',
    isFavorite: false,
    categories: ['Fresh Seafood', 'Fish'],
    description: 'Specialized seafood and fish market',
  },
  
  // More Supermarkets
  {
    id: 19,
    name: 'Giant Supermarket',
    image: 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.3,
    deliveryTime: '35-45 min',
    distance: '3.5 km',
    type: 'Supermarket',
    isFavorite: false,
    categories: ['General Groceries', 'Household'],
    description: 'Large supermarket with extensive product range',
  },
  {
    id: 20,
    name: 'Fresh Choice',
    image: 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.4,
    deliveryTime: '28-38 min',
    distance: '2.8 km',
    type: 'Supermarket',
    isFavorite: false,
    categories: ['Fresh Produce', 'Organic'],
    description: 'Supermarket focused on fresh and organic products',
  }
];

const storeTypes = [
  { id: 1, name: 'Popular', icon: 'star' },
  { id: 2, name: 'Supermarkets', icon: 'store' },
  { id: 3, name: 'Marts', icon: 'shopping' },
  { id: 4, name: 'Local Shops', icon: 'home-city' },
  { id: 5, name: 'Farmers Market', icon: 'leaf' },
  { id: 6, name: 'Specialty Store', icon: 'gift' },
];

// --- Components ---
function HeaderSection({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.headerSection}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>All Stores</Text>
      <TouchableOpacity style={styles.searchButton}>
        <Ionicons name="search" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

function FilterSection({ selectedType, onFilterChange }: { selectedType: string; onFilterChange: (type: string) => void }) {
  return (
    <View style={styles.filterSection}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {storeTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[styles.filterButton, selectedType === type.name && styles.activeFilter]}
            onPress={() => onFilterChange(type.name)}
          >
            <MaterialCommunityIcons 
              name={type.icon as any} 
              size={16} 
              color={selectedType === type.name ? '#fff' : '#666'} 
            />
            <Text style={[styles.filterText, selectedType === type.name && styles.activeFilterText]}>
              {type.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function StoreCard({ store, onToggleFavorite }: { store: any; onToggleFavorite: (id: string) => void }) {
  return (
    <TouchableOpacity style={styles.storeCard}>
      <View style={styles.storeImageContainer}>
        <Image source={{ uri: store.image }} style={styles.storeImage} />
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => onToggleFavorite(store.id.toString())}
        >
          <Ionicons 
            name={store.isFavorite ? "heart" : "heart-outline"} 
            size={20} 
            color={store.isFavorite ? "#E91E63" : "#fff"} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.storeInfo}>
        <Text style={styles.storeName}>{store.name}</Text>
        <Text style={styles.storeDescription}>{store.description}</Text>
        
        <View style={styles.storeMeta}>
          <View style={styles.storeRating}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{store.rating}</Text>
          </View>
          <Text style={styles.storeType}>{store.type}</Text>
        </View>
        
        <Text style={styles.storeDelivery}>{store.deliveryTime} • {store.distance}</Text>
        
        <View style={styles.storeCategories}>
          {store.categories.map((cat: string, idx: number) => (
            <Text key={idx} style={styles.storeCategory}>{cat}</Text>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function AllStores({ navigation }: any) {
  const [selectedType, setSelectedType] = useState('Popular');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filteredStores, setFilteredStores] = useState(allStores);

  const handleFilterChange = (type: string) => {
    setSelectedType(type);
    if (type === 'Popular') {
      setFilteredStores(allStores.slice(0, 8)); // Show top 8 stores
    } else if (type === 'Supermarkets') {
      setFilteredStores(allStores.filter(store => store.type === 'Supermarket'));
    } else if (type === 'Marts') {
      setFilteredStores(allStores.filter(store => store.type === 'Mart'));
    } else if (type === 'Local Shops') {
      setFilteredStores(allStores.filter(store => store.type === 'Local Shop'));
    } else if (type === 'Farmers Market') {
      setFilteredStores(allStores.filter(store => store.type === 'Farmers Market'));
    } else if (type === 'Specialty Store') {
      setFilteredStores(allStores.filter(store => store.type === 'Specialty Store'));
    }
  };

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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <HeaderSection onBack={() => navigation.goBack()} />
      <FilterSection selectedType={selectedType} onFilterChange={handleFilterChange} />
      
      <FlatList
        data={filteredStores}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <StoreCard 
            store={item} 
            onToggleFavorite={toggleFavorite}
          />
        )}
        style={styles.storesList}
        contentContainerStyle={styles.storesListContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  // Header Section
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Filter Section
  filterSection: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  activeFilter: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 6,
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '600',
  },
  
  // Stores List
  storesList: {
    flex: 1,
  },
  storesListContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  
  // Store Card
  storeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  storeImageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  storeImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeInfo: {
    padding: 16,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  storeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  storeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  storeRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  ratingText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  storeType: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  storeDelivery: {
    fontSize: 13,
    color: '#999',
    marginBottom: 12,
  },
  storeCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  storeCategory: {
    fontSize: 11,
    color: '#666',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
});
