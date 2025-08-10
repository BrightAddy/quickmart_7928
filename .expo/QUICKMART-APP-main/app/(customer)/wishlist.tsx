import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Heart, ShoppingCart, Trash2, Search, Filter, ArrowLeft } from 'lucide-react-native';
import Button from '@/components/Button';
import { getColors } from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';
import { useCartStore } from '@/store/cart-store';
import Layout from '@/constants/layout';
import { Product } from '@/types';

// Mock wishlist data
const mockWishlistItems: Product[] = [
  {
    id: '1',
    name: 'Organic Bananas',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=400&auto=format&fit=crop',
    category: 'Fruits',
    description: 'Fresh organic bananas, perfect for smoothies and snacks',
    inStock: true,
    storeId: 'store1',
    rating: 4.5,
    reviews: 128
  },
  {
    id: '2',
    name: 'Artisan Sourdough Bread',
    price: 5.49,
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=400&auto=format&fit=crop',
    category: 'Bakery',
    description: 'Freshly baked artisan sourdough bread with crispy crust',
    inStock: true,
    storeId: 'store1',
    rating: 4.8,
    reviews: 89
  },
  {
    id: '3',
    name: 'Premium Coffee Beans',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=400&auto=format&fit=crop',
    category: 'Beverages',
    description: 'Single-origin premium coffee beans, medium roast',
    inStock: false,
    storeId: 'store2',
    rating: 4.7,
    reviews: 156
  },
  {
    id: '4',
    name: 'Greek Yogurt',
    price: 4.29,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=400&auto=format&fit=crop',
    category: 'Dairy',
    description: 'Creamy Greek yogurt, high in protein and probiotics',
    inStock: true,
    storeId: 'store1',
    rating: 4.6,
    reviews: 203
  },
  {
    id: '5',
    name: 'Avocados',
    price: 1.99,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=400&auto=format&fit=crop',
    category: 'Fruits',
    description: 'Ripe avocados, perfect for toast and salads',
    inStock: true,
    storeId: 'store1',
    rating: 4.4,
    reviews: 92
  }
];

export default function WishlistScreen() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const { addToCart } = useCartStore();
  const Colors = getColors(isDarkMode);
  const styles = createStyles(Colors);
  
  const [wishlistItems, setWishlistItems] = useState<Product[]>(mockWishlistItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const categories = ['All', ...Array.from(new Set(wishlistItems.map(item => item.category)))];
  
  const filteredItems = selectedCategory === 'All' 
    ? wishlistItems 
    : wishlistItems.filter(item => item.category === selectedCategory);
  
  const handleRemoveFromWishlist = (productId: string) => {
    Alert.alert(
      "Remove from Wishlist",
      "Are you sure you want to remove this item from your wishlist?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setWishlistItems(prev => prev.filter(item => item.id !== productId));
          }
        }
      ]
    );
  };
  
  const handleAddToCart = (product: Product) => {
    if (!product.inStock) {
      Alert.alert('Out of Stock', 'This item is currently out of stock.');
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      storeId: product.storeId
    });
    
    Alert.alert('Added to Cart', `${product.name} has been added to your cart.`);
  };
  
  const handleClearWishlist = () => {
    Alert.alert(
      "Clear Wishlist",
      "Are you sure you want to remove all items from your wishlist?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => {
            setWishlistItems([]);
          }
        }
      ]
    );
  };
  
  const renderWishlistItem = (item: Product) => (
    <View key={item.id} style={styles.wishlistItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>{item.description}</Text>
        
        <View style={styles.productMeta}>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>★ {item.rating}</Text>
            <Text style={styles.reviews}>({item.reviews})</Text>
          </View>
        </View>
        
        {!item.inStock && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>
      
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleRemoveFromWishlist(item.id)}
        >
          <Trash2 size={20} color={Colors.error} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.cartButton, !item.inStock && styles.disabledButton]}
          onPress={() => handleAddToCart(item)}
          disabled={!item.inStock}
        >
          <ShoppingCart size={20} color={item.inStock ? Colors.primary : Colors.subtext} />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Wishlist</Text>
          <Text style={styles.headerSubtitle}>
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.headerAction}
          onPress={() => router.push('/(customer)')}
        >
          <Search size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>
      
      {wishlistItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Heart size={80} color={Colors.border} />
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptyDescription}>
            Start adding items to your wishlist by tapping the heart icon on products you love.
          </Text>
          <Button
            title="Start Shopping"
            onPress={() => router.push('/(customer)')}
            style={styles.emptyButton}
          />
        </View>
      ) : (
        <>
          {/* Category Filter */}
          <View style={styles.filterContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category && styles.selectedCategoryChip
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryChipText,
                    selectedCategory === category && styles.selectedCategoryChipText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {wishlistItems.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearWishlist}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Wishlist Items */}
          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {filteredItems.map(renderWishlistItem)}
            
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.padding,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.subtext,
    marginTop: 2,
  },
  headerAction: {
    padding: 8,
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.padding * 2,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 16,
    color: Colors.subtext,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyButton: {
    minWidth: 200,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.padding,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryList: {
    paddingRight: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  selectedCategoryChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  selectedCategoryChipText: {
    color: Colors.white,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    fontSize: 14,
    color: Colors.error,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Layout.padding,
  },
  wishlistItem: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: Colors.subtext,
    lineHeight: 18,
    marginBottom: 8,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: Colors.warning,
    fontWeight: '500',
    marginRight: 4,
  },
  reviews: {
    fontSize: 12,
    color: Colors.subtext,
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  outOfStockText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '600',
  },
  itemActions: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cartButton: {
    backgroundColor: Colors.lightPrimary,
  },
  disabledButton: {
    backgroundColor: Colors.border,
  },
  bottomSpacing: {
    height: 20,
  },
});