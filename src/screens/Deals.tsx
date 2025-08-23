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
  FlatList 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/theme';

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
    <TouchableOpacity style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
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
        >
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#4CAF50" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for fruits, vegetables..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={24} color="#333" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cartButton}>
          <Ionicons name="cart" size={24} color="#333" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    marginRight: 12,
  },
  cartButton: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 24,
  },
  selectedCategory: {
    // Selected state styling
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  selectedCategoryIcon: {
    backgroundColor: '#4CAF50',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  selectedCategoryName: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  productsContainer: {
    padding: 16,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    position: 'relative',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  priceContainer: {
    marginBottom: 12,
  },
  currentPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 2,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});



