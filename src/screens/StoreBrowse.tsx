import React, { useState, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Image, TextInput, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Screen, Title, Body, FloatingChatbotButton, ChatbotModal, ImageUploadButton, ImageScanModal, ImageRecognitionResult, GhanaianLoader, KenteAccent } from '../components/UI';
import { useTheme } from '../theme/theme';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';

const defaultStoreData = {
  name: 'Fresh Market Accra',
  rating: 4.5,
  deliveryTime: '25-35 min',
  imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3',
};

const categories = [
  'All', 'Fruits', 'Vegetables', 'Dairy', 'Meat', 'Bakery', 'Beverages', 'Snacks'
];

const allProducts = [
  {
    id: 1,
    name: 'Fresh Bananas',
    price: 8.5,
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3',
    category: 'Fruits',
    inStock: true,
    rating: 4.2,
  },
  {
    id: 2,
    name: 'Organic Tomatoes',
    price: 12.0,
    imageUrl: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3',
    category: 'Vegetables',
    inStock: true,
    rating: 4.5,
  },
  {
    id: 3,
    name: 'Fresh Milk 1L',
    price: 6.5,
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3',
    category: 'Dairy',
    inStock: false,
    rating: 4.0,
  },
  {
    id: 4,
    name: 'Chicken Breast',
    price: 25.0,
    imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3',
    category: 'Meat',
    inStock: true,
    rating: 4.3,
  },
  {
    id: 5,
    name: 'Whole Wheat Bread',
    price: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3',
    category: 'Bakery',
    inStock: true,
    rating: 4.1,
  },
  {
    id: 6,
    name: 'Orange Juice 500ml',
    price: 7.0,
    imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3',
    category: 'Beverages',
    inStock: true,
    rating: 4.4,
  },
  {
    id: 7,
    name: 'Plantain Chips',
    price: 5.5,
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3',
    category: 'Snacks',
    inStock: true,
    rating: 4.0,
  },
  {
    id: 8,
    name: 'Red Onions',
    price: 3.5,
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3',
    category: 'Vegetables',
    inStock: true,
    rating: 4.2,
  },
];

function StoreHeader({ store }: any) {
  return (
    <View style={styles.headerBox}>
      <Image source={{ uri: store.imageUrl }} style={styles.headerImage} />
      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text style={styles.headerTitle}>{store.name}</Text>
        <Text style={styles.headerMeta}>{store.rating} ★ · {store.deliveryTime}</Text>
      </View>
    </View>
  );
}

function SearchBar({ value, onChange, onFilter, onVoice, onImageScan }: any) {
  return (
    <View style={styles.searchBarBox}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={value}
        onChangeText={onChange}
      />
      <TouchableOpacity onPress={onFilter} style={styles.searchIcon}><Text>🔍</Text></TouchableOpacity>
      <TouchableOpacity onPress={onVoice} style={styles.searchIcon}><Text>🎤</Text></TouchableOpacity>
      <TouchableOpacity onPress={onImageScan} style={styles.searchIcon}><Text>📷</Text></TouchableOpacity>
    </View>
  );
}

function CategoryChips({ selected, onSelect }: any) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10, marginLeft: 8 }}>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat}
          style={[styles.chip, selected === cat && styles.chipActive]}
          onPress={() => onSelect(cat)}
        >
          <Text style={[styles.chipText, selected === cat && styles.chipTextActive]}>{cat}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function ProductCard({ product, onPress }: any) {
  const { items, addItem, updateQty, removeItem } = useCart();
  const inCart = items.find((i) => i.id === product.id);
  const qty = inCart?.qty || 0;
  const canAdd = product.inStock !== false;
  return (
    <TouchableOpacity style={styles.productCard} onPress={onPress} activeOpacity={0.9}>
      <KenteAccent style={{ top: -10, right: -10 }} />
      <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>GHS {product.price.toFixed(2)}</Text>
      <Text style={styles.productMeta}>{product.rating} ★ {product.inStock ? 'In Stock' : 'Out of Stock'}</Text>

      {qty > 0 ? (
        <View style={styles.stepperBar}>
          <TouchableOpacity style={styles.stepIcon} onPress={() => qty > 1 ? updateQty(product.id, qty - 1) : removeItem(product.id)}>
            <Text style={styles.stepIconText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.stepQty}>{qty}</Text>
          <TouchableOpacity style={styles.stepIcon} onPress={() => updateQty(product.id, qty + 1)}>
            <Text style={styles.stepIconText}>＋</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.addBtn, !canAdd && { backgroundColor: '#ccc' }]}
          disabled={!canAdd}
          onPress={() => addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, category: product.category, unitLabel: '1 KG' }, 1)}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Add to Cart</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

function FloatingCartBadge({ count, onPress }: any) {
  if (!count) return null;
  return (
    <TouchableOpacity style={styles.cartBadge} onPress={onPress} activeOpacity={0.9}>
      <Text style={styles.cartBadgeIcon}>🛒</Text>
      <Text style={styles.cartBadgeCount}>{count}</Text>
    </TouchableOpacity>
  );
}

export default function StoreBrowse({ navigation, route }: any) {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [loading, setLoading] = useState(false);
  const [chatbotVisible, setChatbotVisible] = React.useState(false);
  const [imageScanVisible, setImageScanVisible] = React.useState(false);
  const [recognitionResult, setRecognitionResult] = React.useState<any>(null);
  const [showResult, setShowResult] = React.useState(false);
  const { addItem, totalCount } = useCart();
  const { getCustomerStoreProducts, getProductsByCategory, searchProducts } = useProducts();

  const store = route?.params?.store ? {
    id: route.params.store.id || 'store-001',
    name: route.params.store.name,
    rating: route.params.store.rating,
    deliveryTime: route.params.store.deliveryTime,
    imageUrl: route.params.store.image,
  } : {
    id: 'store-001',
    name: 'Fresh Market Accra',
    rating: 4.5,
    deliveryTime: '25-35 min',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3',
  };

  // Get products from the shared context
  const storeProducts = getCustomerStoreProducts(store.id);
  
  const filteredProducts = useMemo(() => {
    let prods = storeProducts;
    if (selectedCat !== 'All') {
      prods = getProductsByCategory(selectedCat, store.id);
    }
    if (search.trim()) {
      prods = searchProducts(search.trim(), store.id);
    }
    return prods;
  }, [search, selectedCat, storeProducts, store.id, getProductsByCategory, searchProducts]);

  const handleImageRecognition = (result: any) => {
    setRecognitionResult(result);
    setShowResult(true);
  };

  return (
    <Screen>
      <FlatList
        ListHeaderComponent={
          <>
            <StoreHeader store={store} />
            <SearchBar 
              value={search} 
              onChange={setSearch} 
              onFilter={() => {}} 
              onVoice={() => {}} 
              onImageScan={() => setImageScanVisible(true)}
            />
            <CategoryChips selected={selectedCat} onSelect={setSelectedCat} />
          </>
        }
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 8 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => navigation.navigate('ProductDetails', { product: item })} />
        )}
        ListEmptyComponent={loading ? (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <GhanaianLoader size={60} />
            <Text style={{ color: '#888', marginTop: 16, fontSize: 16, fontWeight: '500' }}>Loading products...</Text>
          </View>
        ) : (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ fontSize: 40, color: '#eee' }}>🔍</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#888', marginTop: 8 }}>No products found</Text>
            <Text style={{ color: '#aaa', marginTop: 4 }}>Try adjusting your search or filters</Text>
            </View>
        )}
      />
      <FloatingCartBadge count={totalCount} onPress={() => navigation.navigate('CartCheckout')} />
      <FloatingChatbotButton onPress={() => setChatbotVisible(true)} />
      <ChatbotModal visible={chatbotVisible} onClose={() => setChatbotVisible(false)} />
      <ImageScanModal 
        visible={imageScanVisible}
        onClose={() => setImageScanVisible(false)}
        onRecognized={handleImageRecognition}
        mode="customer"
      />
      <ImageRecognitionResult 
        result={recognitionResult} 
        visible={showResult} 
        onClose={() => setShowResult(false)} 
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerBox: { flexDirection: 'row', alignItems: 'center', margin: 12, marginBottom: 0 },
  headerImage: { width: 60, height: 60, borderRadius: 16, backgroundColor: '#eee' },
  headerTitle: { fontWeight: 'bold', fontSize: 18, color: '#222' },
  headerMeta: { color: '#888', fontSize: 13, marginTop: 2 },
  searchBarBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 16, margin: 12, marginTop: 10, paddingHorizontal: 12 },
  searchInput: { flex: 1, fontSize: 16, color: '#222', paddingVertical: 8 },
  searchIcon: { padding: 8, marginLeft: 2 },
  chip: { backgroundColor: '#eee', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 6, marginRight: 8 },
  chipActive: { backgroundColor: '#2E7D32' },
  chipText: { color: '#222', fontWeight: 'bold' },
  chipTextActive: { color: 'white' },
  productCard: { backgroundColor: 'white', borderRadius: 16, padding: 12, flex: 1, alignItems: 'center', marginBottom: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  productImage: { width: 90, height: 90, borderRadius: 12, backgroundColor: '#fafafa' },
  productName: { fontWeight: 'bold', fontSize: 15, color: '#222', marginTop: 8 },
  productPrice: { color: '#2E7D32', fontWeight: 'bold', marginTop: 2 },
  productMeta: { fontSize: 13, color: '#888', marginTop: 2 },
  addBtn: { backgroundColor: '#2E7D32', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8, marginTop: 8 },
  stepperBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', backgroundColor: '#D7F4D9', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, marginTop: 8 },
  stepIcon: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#2E7D32', alignItems: 'center', justifyContent: 'center' },
  stepIconText: { color: 'white', fontWeight: '900' },
  stepQty: { fontWeight: '800', color: '#0f172a' },
  cartBadge: { position: 'absolute', right: 16, bottom: 20, backgroundColor: '#16a34a', borderRadius: 999, paddingHorizontal: 20, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 8, elevation: 6, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } },
  cartBadgeIcon: { color: 'white', fontSize: 18 },
  cartBadgeCount: { color: 'white', fontWeight: '900', fontSize: 16 },
});


