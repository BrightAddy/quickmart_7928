import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ShoppingCart, Plus, Minus, Star } from 'lucide-react-native';
import { Product } from '@/types';
import { getColors } from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  quantity?: number;
  onIncreaseQuantity?: (product: Product) => void;
  onDecreaseQuantity?: (product: Product) => void;
  isInCart?: boolean;
  isCompact?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
  quantity = 0,
  onIncreaseQuantity,
  onDecreaseQuantity,
  isInCart = false,
  isCompact = false,
}) => {
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  const styles = createStyles(Colors);
  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };
  
  const handleIncrease = (e: any) => {
    e.stopPropagation();
    if (onIncreaseQuantity) {
      onIncreaseQuantity(product);
    }
  };
  
  const handleDecrease = (e: any) => {
    e.stopPropagation();
    if (onDecreaseQuantity) {
      onDecreaseQuantity(product);
    }
  };
  
  if (isCompact) {
    return (
      <TouchableOpacity 
        style={styles.compactContainer}
        onPress={() => onPress(product)}
        activeOpacity={0.7}
        disabled={!product.inStock}
      >
        <Image 
          source={{ uri: product.image }} 
          style={styles.compactImage}
          resizeMode="cover"
        />
        
        {!product.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
        
        {product.discountPrice && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
            </Text>
          </View>
        )}
        
        <View style={styles.compactContent}>
          <Text style={styles.compactPrice}>
            ₵{(product.discountPrice || product.price).toFixed(2)}
          </Text>
          
          <Text style={styles.compactName} numberOfLines={2}>{product.name}</Text>
          
          <TouchableOpacity 
            style={styles.compactAddButton}
            onPress={handleAddToCart}
            disabled={!product.inStock}
          >
            <Plus size={16} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        !product.inStock && styles.outOfStock
      ]}
      onPress={() => onPress(product)}
      activeOpacity={0.7}
      disabled={!product.inStock}
    >
      <Image 
        source={{ uri: product.image }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      {!product.inStock && (
        <View style={styles.outOfStockOverlay}>
          <Text style={styles.outOfStockText}>Out of Stock</Text>
        </View>
      )}
      
      {product.discountPrice && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>
            {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
          </Text>
        </View>
      )}
      
      <View style={styles.content}>
        <Text style={styles.price}>
          ₵{(product.discountPrice || product.price).toFixed(2)}
          {product.discountPrice && (
            <Text style={styles.originalPrice}> ₵{product.price.toFixed(2)}</Text>
          )}
        </Text>
        
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        
        <Text style={styles.unit}>{product.unit}</Text>
        
        <View style={styles.footer}>
          {isInCart || quantity > 0 ? (
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={handleDecrease}
              >
                <Minus size={16} color={Colors.primary} />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{quantity}</Text>
              
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={handleIncrease}
              >
                <Plus size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart size={16} color={Colors.white} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (Colors: any) => StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  outOfStock: {
    opacity: 0.7,
  },
  image: {
    width: '100%',
    height: 120,
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 14,
    backgroundColor: Colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 10,
  },
  content: {
    padding: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 12,
    fontWeight: 'normal',
    color: Colors.subtext,
    textDecorationLine: 'line-through',
  },
  name: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
    height: 40,
  },
  unit: {
    fontSize: 12,
    color: Colors.subtext,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  quantityButton: {
    backgroundColor: Colors.background,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    paddingHorizontal: 8,
  },
  
  // Compact styles for horizontal scrolling
  compactContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    width: 140,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  compactImage: {
    width: '100%',
    height: 100,
  },
  compactContent: {
    padding: 10,
  },
  compactPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },
  compactName: {
    fontSize: 12,
    color: Colors.text,
    marginVertical: 4,
    height: 32,
  },
  compactAddButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProductCard;