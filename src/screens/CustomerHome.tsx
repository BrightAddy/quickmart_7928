import React from 'react';
import { View, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, Image, FlatList } from 'react-native';
import { Screen, Title, Body, FloatingChatbotButton, ChatbotModal } from '../components/UI';
import { useTheme } from '../theme/theme';
import { useProducts } from '../context/ProductsContext';

// --- Placeholder Data ---
const promotions = [
  {
    id: 1,
    title: 'Fresh Yam & Plantain',
    subtitle: 'Get 20% off on fresh produce',
    image: 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=800',
    backgroundColor: '#E8F5E8',
    discount: '20% OFF',
  },
  {
    id: 2,
    title: 'Rice & Grains Special',
    subtitle: 'Buy 2 get 1 free on selected rice',
    image: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=800',
    backgroundColor: '#FFF3E0',
    discount: 'Buy 2 Get 1',
  },
  {
    id: 3,
    title: 'Weekend Grocery Deal',
    subtitle: 'Free delivery on orders above GHS 100',
    image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800',
    backgroundColor: '#F3E5F5',
    discount: 'Free Delivery',
  },
];

const nearbyStores = [
  {
    id: 1,
    name: "Kofi's Fresh Market",
    image: 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.8,
    deliveryTime: '15-25 min',
    distance: '0.8 km',
    isFavorite: true,
    categories: ['Fresh Produce', 'Local Items'],
  },
  {
    id: 2,
    name: "Ama's Grocery Store",
    image: 'https://images.pexels.com/photos/2292837/pexels-photo-2292837.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.6,
    deliveryTime: '20-30 min',
    distance: '1.2 km',
    isFavorite: false,
    categories: ['Groceries', 'Household'],
  },
];

const recentOrders = [
  {
    id: 1,
    storeName: "Kofi's Fresh Market",
    items: ['Rice (5kg)', 'Palm Oil (1L)', 'Plantain (bunch)'],
    totalAmount: 'GHS 85.50',
    orderDate: '2 days ago',
    image: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 2,
    storeName: "Ama's Grocery Store",
    items: ['Yam (3kg)', 'Tomatoes (2kg)', 'Onions (1kg)'],
    totalAmount: 'GHS 42.00',
    orderDate: '5 days ago',
    image: 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

const categories = [
  { id: 1, name: 'Rice & Grains', icon: '🍚', color: '#E8F5E8' },
  { id: 2, name: 'Yam & Tubers', icon: '🥔', color: '#FFF3E0' },
  { id: 3, name: 'Plantain', icon: '🍌', color: '#F3E5F5' },
  { id: 4, name: 'Fresh Fish', icon: '🐟', color: '#E3F2FD' },
  { id: 5, name: 'Palm Oil', icon: '🛢️', color: '#FFF8E1' },
  { id: 6, name: 'Vegetables', icon: '🥬', color: '#E8F5E8' },
  { id: 7, name: 'Spices', icon: '🌶️', color: '#FFEBEE' },
  { id: 8, name: 'Beverages', icon: '☕', color: '#F1F8E9' },
];

// --- Components ---
function SearchBar() {
  return (
    <View style={styles.searchBarContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for groceries, stores..."
        placeholderTextColor="#888"
      />
    </View>
  );
}

function PromotionalBanner() {
  return (
    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.bannerScroll}>
      {promotions.map((promo) => (
        <View key={promo.id} style={[styles.bannerCard, { backgroundColor: promo.backgroundColor }]}> 
          <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
            <Text style={styles.bannerDiscount}>{promo.discount}</Text>
            <Text style={styles.bannerTitle}>{promo.title}</Text>
            <Text style={styles.bannerSubtitle}>{promo.subtitle}</Text>
          </View>
          <Image source={{ uri: promo.image }} style={styles.bannerImage} />
        </View>
      ))}
    </ScrollView>
  );
}

function NearbyStores({ navigation }: any) {
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());
  const { colors } = useTheme();
  const { stores } = useProducts();

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
    <View style={{ marginTop: 24 }}>
      <Text style={styles.sectionTitle}>Nearby Stores</Text>
      <FlatList
        data={stores}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.storeCard} onPress={() => navigation.navigate('StoreBrowse', { store: item })}>
            <View style={styles.storeImageContainer}>
              <Image source={{ uri: item.imageUrl }} style={styles.storeImage} />
              <TouchableOpacity 
                style={[styles.favoriteButton, { backgroundColor: colors.surface }]}
                onPress={() => toggleFavorite(item.id)}
              >
                <Text style={styles.favoriteIcon}>
                  {favorites.has(item.id) ? '❤️' : '🤍'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.storeName}>{item.name}</Text>
            <Text style={styles.storeMeta}>{item.rating} ★ · {item.deliveryTime} · {item.distance}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
              {item.categories.map((cat, idx) => (
                <Text key={idx} style={styles.storeCategory}>{cat}</Text>
              ))}
            </View>
            {favorites.has(item.id) && (
              <View style={[styles.favoriteLabel, { backgroundColor: colors.error + '22' }]}>
                <Text style={[styles.favoriteLabelText, { color: colors.error }]}>❤️ Favorite</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function QuickReorder() {
  if (!recentOrders.length) return null;
  return (
    <View style={{ marginTop: 24 }}>
      <Text style={styles.sectionTitle}>Quick Reorder</Text>
      <FlatList
        data={recentOrders}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <Image source={{ uri: item.image }} style={styles.orderImage} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.orderStore}>{item.storeName}</Text>
              <Text style={styles.orderItems}>{item.items.slice(0, 2).join(', ')}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                <Text style={styles.orderAmount}>{item.totalAmount}</Text>
                <TouchableOpacity style={styles.reorderBtn}><Text style={{ color: 'white', fontWeight: 'bold' }}>Reorder</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        style={{ marginTop: 8 }}
      />
    </View>
  );
}

function PopularCategories() {
  return (
    <View style={{ marginTop: 24 }}>
      <Text style={styles.sectionTitle}>Popular Categories</Text>
      <View style={styles.categoriesGrid}>
        {categories.map((cat) => (
          <View key={cat.id} style={[styles.categoryCard, { backgroundColor: cat.color }]}> 
            <Text style={styles.categoryIcon}>{cat.icon}</Text>
            <Text style={styles.categoryName}>{cat.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function UserHeader({ navigation }: any) {
  const { colors } = useTheme();
  return (
    <View style={[styles.userHeader, { borderBottomColor: colors.primary + '22' }]}>
      <View style={styles.userInfo}>
        <View style={[styles.userAvatar, { backgroundColor: colors.primary + '22' }]}>
          <Text style={[styles.userInitials, { color: colors.primary }]}>KA</Text>
        </View>
        <View>
          <Text style={[styles.welcomeText, { color: colors.onBackground + '88' }]}>Welcome back,</Text>
          <Text style={[styles.userName, { color: colors.onBackground }]}>Kwame Asante</Text>
        </View>
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={[styles.headerButton, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate('UserPreferences')}
        >
          <Text style={styles.headerButtonIcon}>⚙️</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.headerButton, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={styles.headerButtonIcon}>🔔</Text>
          <View style={[styles.notificationBadge, { backgroundColor: colors.error }]} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function CustomerHome({ navigation }: any) {
  const [chatbotVisible, setChatbotVisible] = React.useState(false);
  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <UserHeader navigation={navigation} />
        <SearchBar />
        <PromotionalBanner />
        <NearbyStores navigation={navigation} />
        <QuickReorder />
        <PopularCategories />
        <View style={{ height: 40 }} />
      </ScrollView>
      <FloatingChatbotButton onPress={() => setChatbotVisible(true)} />
      <ChatbotModal visible={chatbotVisible} onClose={() => setChatbotVisible(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    fontSize: 16,
    color: '#222',
  },
  bannerScroll: {
    marginTop: 16,
    minHeight: 140,
    maxHeight: 180,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    marginHorizontal: 8,
    padding: 0,
    minWidth: 320,
    maxWidth: 360,
    height: 140,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  bannerDiscount: {
    backgroundColor: '#2E7D32',
    color: 'white',
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 8,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  bannerImage: {
    width: 100,
    height: 140,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 4,
    color: '#222',
  },
  storeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 8,
    padding: 12,
    width: 200,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  storeImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  storeImage: {
    width: '100%',
    height: 80,
    borderRadius: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  favoriteIcon: {
    fontSize: 16,
  },
  favoriteLabel: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  favoriteLabelText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  storeName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
    color: '#222',
  },
  storeMeta: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  storeCategory: {
    backgroundColor: '#E8F5E8',
    color: '#2E7D32',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 12,
    marginRight: 4,
    marginTop: 4,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 8,
    padding: 12,
    width: 280,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  orderImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  orderStore: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  orderItems: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  orderAmount: {
    fontWeight: 'bold',
    color: '#2E7D32',
    fontSize: 15,
  },
  reorderBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInitials: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 14,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerButtonIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 8,
    marginTop: 8,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 12,
    margin: 6,
    minWidth: 140,
    maxWidth: 180,
    flex: 1,
  },
  categoryIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },
});


