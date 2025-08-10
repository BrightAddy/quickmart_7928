import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react-native';
import Button from '@/components/Button';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/colors';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { CartItem as CartItemType } from '@/types';
import { getFeaturedProducts } from '@/mocks/products';
import ProductCard from '@/components/ProductCard';

export default function CartScreen() {
  const router = useRouter();
  const { 
    cart, 
    updateQuantity, 
    removeFromCart,
    getCartTotal,
    addToCart
  } = useCartStore();
  
  const { user } = useAuthStore();
  
  const [recommendedProducts] = useState(getFeaturedProducts(4));
  
  const handleIncreaseQuantity = (productId: string) => {
    if (!cart) return;
    
    const cartItem = cart.items.find(item => item.product.id === productId);
    if (cartItem) {
      updateQuantity(productId, cartItem.quantity + 1);
    }
  };
  
  const handleDecreaseQuantity = (productId: string) => {
    if (!cart) return;
    
    const cartItem = cart.items.find(item => item.product.id === productId);
    if (cartItem && cartItem.quantity > 1) {
      updateQuantity(productId, cartItem.quantity - 1);
    } else if (cartItem) {
      updateQuantity(productId, 0); // This will remove the item
    }
  };
  
  const handleRemoveItem = (productId: string) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Remove", 
          onPress: () => removeFromCart(productId),
          style: "destructive"
        }
      ]
    );
  };
  
  const handleProceedToCheckout = () => {
    if (!cart) return;
    
    // Check if user is logged in and is a customer
    if (!user || user.role !== 'customer') {
      Alert.alert(
        "Login Required",
        "Please login to continue with checkout.",
        [
          { 
            text: "Login", 
            onPress: () => router.push('/(auth)/login')
          },
          {
            text: "Cancel",
            style: "cancel"
          }
        ]
      );
      return;
    }
    
    // Navigate to checkout screen
    router.push('/checkout');
  };
  
  const handleAddRecommendedToCart = (product: any) => {
    if (!cart) return;
    
    addToCart(product, 1, cart.storeId, cart.storeName);
  };
  
  const handleProductPress = (product: any) => {
    router.push({
      pathname: '/store/[id]',
      params: { id: product.storeId }
    });
  };
  
  const renderRecommendedProduct = ({ item }: { item: any }) => (
    <ProductCard
      product={item}
      onPress={handleProductPress}
      onAddToCart={handleAddRecommendedToCart}
      isCompact={true}
    />
  );
  
  if (!cart || cart.items.length === 0) {
    return (
      <EmptyState
        title="Your Cart is Empty"
        message="Add items to your cart to start shopping."
        icon={<ShoppingBag size={64} color={Colors.subtext} />}
        buttonText="Browse Stores"
        onButtonPress={() => router.push('/(customer)')}
      />
    );
  }
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.storeInfo}>
          <Text style={styles.storeLabel}>Shopping from:</Text>
          <Text style={styles.storeName}>{cart.storeName}</Text>
        </View>
        
        <View style={styles.cartItemsContainer}>
          {cart.items.map((item) => (
            <View key={item.product.id} style={styles.cartItem}>
              <Image 
                source={{ uri: item.product.image }} 
                style={styles.productImage}
                resizeMode="cover"
              />
              
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.product.name}</Text>
                <Text style={styles.productPrice}>
                  ₵{(item.product.discountPrice || item.product.price).toFixed(2)}
                  {item.product.discountPrice && (
                    <Text style={styles.originalPrice}> ₵{item.product.price.toFixed(2)}</Text>
                  )}
                </Text>
                
                <View style={styles.quantityContainer}>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => handleDecreaseQuantity(item.product.id)}
                  >
                    <Minus size={16} color={Colors.primary} />
                  </TouchableOpacity>
                  
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => handleIncreaseQuantity(item.product.id)}
                  >
                    <Plus size={16} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.itemActions}>
                <Text style={styles.itemTotal}>
                  ₵{((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                </Text>
                
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => handleRemoveItem(item.product.id)}
                >
                  <Trash2 size={20} color={Colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        
        <View style={styles.recommendedSection}>
          <View style={styles.recommendedHeader}>
            <Text style={styles.recommendedTitle}>You might also like</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push({
                pathname: '/store/[id]',
                params: { id: cart.storeId }
              })}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <ArrowRight size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={recommendedProducts}
            renderItem={renderRecommendedProduct}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedList}
          />
        </View>
      </ScrollView>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₵{getCartTotal().toFixed(2)}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>₵10.00</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₵{(getCartTotal() + 10).toFixed(2)}</Text>
        </View>
        
        <Button
          title="Proceed to Checkout"
          onPress={handleProceedToCheckout}
          style={styles.checkoutButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  storeInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  storeLabel: {
    fontSize: 14,
    color: Colors.subtext,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  cartItemsContainer: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 8,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityText: {
    paddingHorizontal: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  itemActions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingLeft: 8,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  removeButton: {
    padding: 4,
  },
  recommendedSection: {
    marginTop: 16,
    marginBottom: 100, // Space for the summary container
  },
  recommendedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  recommendedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    marginRight: 4,
  },
  recommendedList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  summaryContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.subtext,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  checkoutButton: {
    marginTop: 16,
  },
});