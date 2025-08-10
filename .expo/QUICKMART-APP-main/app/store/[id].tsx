import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Star, Clock, ArrowLeft, ShoppingCart, Search, Heart, ChevronDown, ChevronUp } from 'lucide-react-native';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/colors';
import { Product, Store } from '@/types';
import { mockStores } from '@/mocks/stores';
import { getProductsByStore } from '@/mocks/products';
import { useCartStore } from '@/store/cart-store';
import { useProductStore } from '@/store/product-store';

export default function StoreDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { 
    cart, 
    addToCart, 
    updateQuantity, 
    getItemCount 
  } = useCartStore();
  
  const { products: customProducts } = useProductStore();
  
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  const searchInputRef = useRef<TextInput>(null);
  
  useEffect(() => {
    // Fetch store details
    const storeData = mockStores.find(s => s.id === id);
    if (storeData) {
      setStore(storeData);
      
      // Fetch products for this store - combine mock products with verified custom products
      const storeProducts = [
        ...getProductsByStore(id),
        ...customProducts.filter(p => p.storeId === id && p.verified === true)
      ];
      
      setProducts(storeProducts);
      
      // Set first category as selected
      if (storeData.categories.length > 0) {
        setSelectedCategory(storeData.categories[0]);
      }
    }
    
    setIsLoading(false);
  }, [id, customProducts]);
  
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);
  
  const getFilteredProducts = () => {
    let filtered = products;
    
    // Filter by category if selected
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search query if present
    if (searchQuery.trim()) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };
  
  const handleAddToCart = (product: Product) => {
    if (!store) return;
    
    addToCart(product, 1, store.id, store.name);
  };
  
  const handleIncreaseQuantity = (product: Product) => {
    if (!cart) return;
    
    const cartItem = cart.items.find(item => item.product.id === product.id);
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity + 1);
    } else {
      handleAddToCart(product);
    }
  };
  
  const handleDecreaseQuantity = (product: Product) => {
    if (!cart) return;
    
    const cartItem = cart.items.find(item => item.product.id === product.id);
    if (cartItem && cartItem.quantity > 1) {
      updateQuantity(product.id, cartItem.quantity - 1);
    } else if (cartItem) {
      updateQuantity(product.id, 0); // This will remove the item
    }
  };
  
  const getProductQuantityInCart = (productId: string): number => {
    if (!cart) return 0;
    
    const cartItem = cart.items.find(item => item.product.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };
  
  const isProductInCart = (productId: string): boolean => {
    return getProductQuantityInCart(productId) > 0;
  };
  
  const renderCategoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item && styles.categoryButtonActive
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === item && styles.categoryButtonTextActive
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );
  
  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => {}}
      onAddToCart={handleAddToCart}
      quantity={getProductQuantityInCart(item.id)}
      onIncreaseQuantity={handleIncreaseQuantity}
      onDecreaseQuantity={handleDecreaseQuantity}
      isInCart={isProductInCart(item.id)}
    />
  );
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  
  if (!store) {
    return (
      <EmptyState
        title="Store Not Found"
        message="The store you're looking for doesn't exist or has been removed."
        buttonText="Go Back"
        onButtonPress={() => router.back()}
      />
    );
  }
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          headerTitle: store.name,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => setShowSearch(!showSearch)}
              >
                <Search size={24} color={Colors.white} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cartButton}
                onPress={() => router.push('/(customer)/cart')}
              >
                <ShoppingCart size={24} color={Colors.white} />
                {getItemCount() > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{getItemCount()}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      {showSearch && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={Colors.subtext} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor={Colors.subtext}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearButton}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.storeHeader}>
          <Image 
            source={{ uri: store.coverImage }} 
            style={styles.coverImage}
            resizeMode="cover"
          />
          
          <View style={styles.storeInfo}>
            <View style={styles.logoContainer}>
              <Image 
                source={{ uri: store.logo }} 
                style={styles.logo}
                resizeMode="cover"
              />
            </View>
            
            <View style={styles.storeDetails}>
              <View style={styles.storeNameRow}>
                <Text style={styles.storeName}>{store.name}</Text>
                <TouchableOpacity style={styles.favoriteButton}>
                  <Heart size={20} color={Colors.subtext} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.storeMetaContainer}>
                <View style={styles.ratingContainer}>
                  <Star size={16} color={Colors.secondary} fill={Colors.secondary} />
                  <Text style={styles.ratingText}>{store.rating.toFixed(1)}</Text>
                </View>
                
                <View style={styles.hoursContainer}>
                  <Clock size={16} color={Colors.subtext} />
                  <Text style={styles.hoursText}>
                    {store.openingHours} - {store.closingHours}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.storeAddress}>{store.address}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.infoToggle}
            onPress={() => setShowInfo(!showInfo)}
          >
            <Text style={styles.infoToggleText}>
              {showInfo ? 'Hide Details' : 'Show Details'}
            </Text>
            {showInfo ? (
              <ChevronUp size={16} color={Colors.primary} />
            ) : (
              <ChevronDown size={16} color={Colors.primary} />
            )}
          </TouchableOpacity>
          
          {showInfo && (
            <View style={styles.storeDescription}>
              <Text style={styles.descriptionText}>
                {store.description || 'No description available for this store.'}
              </Text>
              
              <View style={styles.categoriesContainer}>
                {store.categories.map((category, index) => (
                  <View key={index} style={styles.categoryTag}>
                    <Text style={styles.categoryTagText}>{category}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.categoriesSection}>
          <FlatList
            data={store.categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
        
        <View style={styles.productsContainer}>
          <Text style={styles.productsTitle}>
            {getFilteredProducts().length} Products
            {selectedCategory ? ` in ${selectedCategory}` : ''}
            {searchQuery ? ` matching "${searchQuery}"` : ''}
          </Text>
          
          {getFilteredProducts().length === 0 ? (
            <EmptyState
              title="No Products Found"
              message={
                searchQuery 
                  ? `No products match "${searchQuery}"`
                  : `There are no products available in the ${selectedCategory} category.`
              }
              buttonText={searchQuery ? "Clear Search" : "View All Products"}
              onButtonPress={() => {
                if (searchQuery) {
                  setSearchQuery('');
                } else {
                  setSelectedCategory(null);
                }
              }}
            />
          ) : (
            <FlatList
              data={getFilteredProducts()}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.productRow}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginRight: 16,
  },
  searchContainer: {
    padding: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text,
  },
  clearButton: {
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
  storeHeader: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  coverImage: {
    width: '100%',
    height: 150,
  },
  storeInfo: {
    flexDirection: 'row',
    padding: 16,
  },
  logoContainer: {
    marginRight: 16,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  storeDetails: {
    flex: 1,
  },
  storeNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
  },
  storeMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 4,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hoursText: {
    fontSize: 14,
    color: Colors.subtext,
    marginLeft: 4,
  },
  storeAddress: {
    fontSize: 14,
    color: Colors.subtext,
  },
  infoToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  infoToggleText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginRight: 4,
  },
  storeDescription: {
    padding: 16,
    paddingTop: 0,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryTag: {
    backgroundColor: Colors.card,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryTagText: {
    fontSize: 12,
    color: Colors.subtext,
  },
  categoriesSection: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    color: Colors.text,
  },
  categoryButtonTextActive: {
    color: Colors.white,
    fontWeight: '500',
  },
  productsContainer: {
    padding: 16,
  },
  productsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  cartButton: {
    marginRight: 16,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});