import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Star, Clock, MapPin } from 'lucide-react-native';
import { Store } from '@/types';
import { getColors } from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

interface StoreCardProps {
  store: Store;
  onPress: (store: Store) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, onPress }) => {
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  
  // Use the store's logo if available, otherwise use a default QuickMart-style logo
  const logoUri = store.logo || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200&auto=format&fit=crop';

  const styles = createStyles(Colors);
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(store)}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: store.coverImage }} 
        style={styles.coverImage}
        resizeMode="cover"
      />
      
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>
          {store.isOpen ? 'Open' : 'Closed'}
        </Text>
      </View>
      
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: logoUri }} 
          style={styles.logo}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{store.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={16} color={Colors.secondary} fill={Colors.secondary} />
            <Text style={styles.rating}>{store.rating.toFixed(1)}</Text>
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <MapPin size={14} color={Colors.subtext} />
          <Text style={styles.address} numberOfLines={1}>
            {store.address}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Clock size={14} color={Colors.subtext} />
          <Text style={styles.hours}>
            {store.openingHours} - {store.closingHours}
          </Text>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.categoriesContainer}>
            {store.categories.slice(0, 2).map((category, index) => (
              <View key={index} style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
            {store.categories.length > 2 && (
              <Text style={styles.moreCategories}>+{store.categories.length - 2}</Text>
            )}
          </View>
          
          {store.distance !== undefined && (
            <Text style={styles.distance}>{store.distance.toFixed(1)} km</Text>
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
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: 120,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  statusText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  logoContainer: {
    position: 'absolute',
    top: 90,
    left: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  content: {
    padding: 16,
    paddingLeft: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  address: {
    fontSize: 14,
    color: Colors.subtext,
    marginLeft: 6,
    flex: 1,
  },
  hours: {
    fontSize: 14,
    color: Colors.subtext,
    marginLeft: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: Colors.card,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    color: Colors.subtext,
  },
  moreCategories: {
    fontSize: 12,
    color: Colors.subtext,
  },
  distance: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
    backgroundColor: Colors.card,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
});

export default StoreCard;