import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  SafeAreaView, 
  StatusBar,
  FlatList,
  Dimensions 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/theme';

const { width: screenWidth } = Dimensions.get('window');

// Sample product data matching the image
const products = [
  {
    id: 1,
    name: 'Fresh Carrot',
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400',
    currentPrice: 'Rp 18,000 / kg',
    originalPrice: 'Rp 21,000',
    category: 'Vegetables',
    isFavorite: false,
  },
  {
    id: 2,
    name: 'Fresh Red Chili',
    image: 'https://images.pexels.com/photos/4110220/pexels-photo-4110220.jpeg?auto=compress&cs=tinysrgb&w=400',
    currentPrice: 'Rp 12,000 / kg',
    originalPrice: 'Rp 14,000',
    category: 'Vegetables',
    isFavorite: false,
  },
  {
    id: 3,
    name: 'Fresh Onion',
    image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400',
    currentPrice: 'Rp 21,000 / kg',
    originalPrice: 'Rp 23,000',
    category: 'Vegetables',
    isFavorite: false,
  },
  {
    id: 4,
    name: 'Fresh Potato',
    image: 'https://images.pexels.com/photos/4110220/pexels-photo-4110220.jpeg?auto=compress&cs=tinysrgb&w=400',
    currentPrice: 'Rp 10,000 / 1 pack',
    originalPrice: 'Rp 12,000',
    category: 'Vegetables',
    isFavorite: false,
  },
  {
    id: 5,
    name: 'Fresh Tomatoes',
    image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400',
    currentPrice: 'Rp 15,000 / kg',
    originalPrice: 'Rp 18,000',
    category: 'Vegetables',
    isFavorite: false,
  },
  {
    id: 6,
    name: 'Fresh Ginger',
    image: 'https://images.pexels.com/photos/4110220/pexels-photo-4110220.jpeg?auto=compress&cs=tinysrgb&w=400',
    currentPrice: 'Rp 8,000 / kg',
    originalPrice: 'Rp 10,000',
    category: 'Vegetables',
    isFavorite: false,
  },
  // Add more products for other categories
  {
    id: 7,
    name: 'Fresh Apples',
    image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=400',
    currentPrice: 'Rp 25,000 / kg',
    originalPrice: 'Rp 30,000',
    category: 'Fruits',
    isFavorite: false,
  },
  {
    id: 8,
    name: 'Fresh Bananas',
    image: 'https://images.pexels.com/photos/47305/bananas-banana-yellow-sweet-47305.jpeg?auto=compress&cs=tinysrgb&w=400',
    currentPrice: 'Rp 15,000 / kg',
    originalPrice: 'Rp 18,000',
    category: 'Fruits',
    isFavorite: false,
  },
  {
    id: 9,
    name: 'Fresh Beef',
    image: 'https://images.pexels.com/photos/618775/pexels-photo-618775.jpeg?auto=compress&cs=tinysrgb&w=400',
    currentPrice: 'Rp 120,000 / kg',
    originalPrice: 'Rp 150,000',
    category: 'Meat & Eggs',
    isFavorite: false,
  },
  {
    id: 10,
    name: 'Fresh Eggs',
    image: 'https://images.pexels.com/photos/4110220/pexels-photo-4110220.jpeg?auto=compress&cs=tinysrgb&w=400',
    currentPrice: 'Rp 35,000 / dozen',
    originalPrice: 'Rp 40,000',
    category: 'Meat & Eggs',
    isFavorite: false,
  },
  {
    id: 11,
    name: 'Fresh Milk',
    image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400',
    currentPrice: 'Rp 25,000 / liter',
    originalPrice: 'Rp 30,000',
    category: 'Drinks',
    isFavorite: false,
  },
  {
    id: 12,
    name: 'Fresh Bread',
    image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=400',
    currentPrice: 'Rp 15,000 / loaf',
    originalPrice: 'Rp 18,000',
    category: 'Bakery',
    isFavorite: false,
  },
];

const categories = [
  { id: 1, name: 'Vegetables', icon: 'food-apple', color: '#4CAF50', iconColor: '#4CAF50' },
  { id: 2, name: 'Fruits', icon: 'food-apple', color: '#FFCDD2', iconColor: '#D32F2F' },
  { id: 3, name: 'Meat & Eggs', icon: 'food-steak', color: '#F8BBD9', iconColor: '#C2185B' },
  { id: 4, name: 'Drinks', icon: 'cup-water', color: '#B3E5FC', iconColor: '#1976D2' },
  { id: 5, name: 'Bakery', icon: 'cake-variant', color: '#FFE0B2', iconColor: '#F57C00' },
];

export default function Deals({ navigation }: any) {
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('Vegetables');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const filteredProducts = products.filter(product => 
    product.category === selectedCategory && 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProductCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.productCard} activeOpacity={0.9}>
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'transparent']}
          style={styles.imageOverlay}
        />
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={favorites.has(item.id) ? "heart" : "heart-outline"} 
            size={20} 
            color={favorites.has(item.id) ? "#E91E63" : "#fff"} 
          />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>{item.currentPrice}</Text>
          <Text style={styles.originalPrice}>{item.originalPrice}</Text>
        </View>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={() => {
            // TODO: Add to cart functionality
            console.log('Added to cart:', item.name);
          }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#4CAF50', '#45A049']}
            style={styles.addToCartGradient}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      {/* Modern Header with Gradient */}
      <LinearGradient
        colors={['#4CAF50', '#45A049', '#388E3C']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <View style={styles.backButtonInner}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for fruits, vegetables..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <TouchableOpacity style={styles.filterButton}>
            <View style={styles.filterButtonInner}>
              <Ionicons name="filter" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cartButton}>
            <View style={styles.cartButtonInner}>
              <Ionicons name="cart" size={20} color="#fff" />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>2</Text>
                </View>
              </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Categories with 3D styling */}
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                selectedCategory === category.name && styles.selectedCategory
              ]}
              onPress={() => setSelectedCategory(category.name)}
              activeOpacity={0.8}
            >
              <View style={[
                styles.categoryIcon,
                { backgroundColor: category.color },
                selectedCategory === category.name && styles.selectedCategoryIcon
              ]}>
                <MaterialCommunityIcons 
                  name={category.icon as any} 
                  size={24} 
                  color={selectedCategory === category.name ? '#fff' : category.iconColor} 
                />
              </View>
              <Text style={[
                styles.categoryName,
                selectedCategory === category.name && styles.selectedCategoryName
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
            </View>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productsContainer}
          showsVerticalScrollIndicator={false}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FCF8',
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 16,
    marginRight: 16,
    height: 45,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    marginRight: 16,
  },
  filterButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cartButton: {
    position: 'relative',
  },
  cartButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginTop: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 28,
  },
  selectedCategory: {
    // Selected state styling
  },
  categoryIcon: {
    width: 65,
    height: 65,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  selectedCategoryIcon: {
    backgroundColor: '#4CAF50',
    elevation: 8,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  selectedCategoryName: {
    color: '#4CAF50',
    fontWeight: '700',
  },
  productsContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  productCard: {
    width: (screenWidth - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  productImageContainer: {
    position: 'relative',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 130,
    borderRadius: 16,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
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
  productInfo: {
    position: 'relative',
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    lineHeight: 20,
  },
  priceContainer: {
    marginBottom: 16,
  },
  currentPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4CAF50',
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  addToCartButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 22,
    elevation: 8,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addToCartGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});



