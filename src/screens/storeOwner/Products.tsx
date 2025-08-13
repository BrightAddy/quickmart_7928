import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Dimensions, Alert } from 'react-native';
import { useTheme } from '@/theme/theme';
import { useProducts } from '../../context/ProductsContext';

const ORANGE = '#FF7A00';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Products() {
  const { colors } = useTheme();
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    getStoreOwnerProducts, 
    getProductStats 
  } = useProducts();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Name');

  // For demo purposes, we'll use a specific owner ID
  // In a real app, this would come from user authentication
  const currentOwnerId = 'owner-001';
  
  const ownerProducts = getStoreOwnerProducts(currentOwnerId);
  const productStats = getProductStats(currentOwnerId);

  const categories = ['All', 'Fruits', 'Vegetables', 'Dairy', 'Meat', 'Bakery', 'Beverages', 'Snacks'];

  const handleAddProduct = () => {
    Alert.alert('Add Product', 'Opening product creation form...');
    // In a real app, this would open a form to create a new product
    // For now, let's add a sample product to demonstrate the sync
    const newProduct = {
      id: `PRD-${Date.now()}`,
      storeId: 'store-001', // Kofi's Fresh Market
      name: 'New Sample Product',
      category: 'Food',
      price: 15.99,
      stock: 50,
      sku: `SAMPLE-${Date.now()}`,
      status: 'Active' as const,
      featured: false,
      sales: 0,
      revenue: 0,
      image: '🆕',
      description: 'A new product added by store owner',
      unitLabel: '1 Unit',
      rating: 0,
      inStock: true
    };
    
    addProduct(newProduct);
    Alert.alert('Success', 'New product added! Check the customer interface to see it.');
  };

  const handleImportCSV = () => {
    Alert.alert('Import Products', 'Opening CSV import tool...');
  };

  const handleExportData = () => {
    Alert.alert('Export Products', 'Exporting product data...');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    Alert.alert('Filter Applied', `Showing ${category} products`);
  };

  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
    Alert.alert('Sort Applied', `Sorted by ${sortOption}`);
  };

  const handleProductAction = (action: string, productId: string) => {
    switch (action) {
      case 'Edit':
        Alert.alert('Edit Product', `Editing product ${productId}`);
        break;
      case 'Duplicate':
        const originalProduct = ownerProducts.find((p: any) => p.id === productId);
        if (originalProduct) {
          const duplicatedProduct = {
            ...originalProduct,
            id: `PRD-${Date.now()}`,
            name: `${originalProduct.name} (Copy)`,
            sku: `${originalProduct.sku}-COPY`,
            sales: 0,
            revenue: 0
          };
          addProduct(duplicatedProduct);
          Alert.alert('Success', 'Product duplicated! Check the customer interface.');
        }
        break;
      case 'Manage Stock':
        Alert.alert('Manage Stock', `Managing stock for product ${productId}`);
        break;
      case 'Toggle Status':
        const product = ownerProducts.find((p: any) => p.id === productId);
        if (product) {
          const newStatus = product.status === 'Active' ? 'Inactive' : 'Active';
          updateProduct(productId, { status: newStatus });
          Alert.alert('Status Updated', `Product is now ${newStatus}. Changes will reflect in customer interface.`);
        }
        break;
      case 'Delete':
        Alert.alert(
          'Delete Product', 
          `Are you sure you want to delete product ${productId}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Delete', 
              style: 'destructive',
              onPress: () => {
                deleteProduct(productId);
                Alert.alert('Deleted', 'Product deleted. It will no longer appear in customer interface.');
              }
            }
          ]
        );
        break;
      default:
        Alert.alert('Action', `${action} for product ${productId}`);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { status: 'Out of Stock', color: '#DC2626', bgColor: '#FEE2E2' };
    if (stock <= 10) return { status: 'Low Stock', color: '#D97706', bgColor: '#FEF3C7' };
    return { status: 'In Stock', color: '#059669', bgColor: '#D1FAE5' };
  };

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'All' 
    ? ownerProducts 
    : ownerProducts.filter(product => product.category === selectedCategory);

  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'Name':
        return a.name.localeCompare(b.name);
      case 'Price':
        return a.price - b.price;
      case 'Stock':
        return b.stock - a.stock;
      case 'Sales':
        return b.sales - a.sales;
      default:
        return 0;
    }
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.onBackground }]}>Products</Text>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => Alert.alert('Notifications', 'Opening notifications...')}
          activeOpacity={0.7}
        >
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}>
            <Text style={styles.statIcon}>📦</Text>
            <Text style={[styles.statValue, { color: colors.onBackground }]}>{productStats.total}</Text>
            <Text style={[styles.statLabel, { color: colors.onSurface + '88' }]}>Total Products</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}>
            <Text style={styles.statIcon}>⚠️</Text>
            <Text style={[styles.statValue, { color: colors.onBackground }]}>{productStats.lowStock}</Text>
            <Text style={[styles.statLabel, { color: colors.onSurface + '88' }]}>Low Stock</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={[styles.statValue, { color: colors.onBackground }]}>{productStats.active}</Text>
            <Text style={[styles.statLabel, { color: colors.onSurface + '88' }]}>Active</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={[styles.statValue, { color: colors.onBackground }]}>GHC {productStats.revenue.toLocaleString()}</Text>
            <Text style={[styles.statLabel, { color: colors.onSurface + '88' }]}>Total Revenue</Text>
          </View>
        </View>

        {/* Real-time Sync Demo */}
        <View style={[styles.syncDemoContainer, { backgroundColor: '#E8F5E8', borderColor: '#4CAF50' }]}>
          <Text style={styles.syncDemoIcon}>🔄</Text>
          <View style={styles.syncDemoContent}>
            <Text style={[styles.syncDemoTitle, { color: '#2E7D32' }]}>Real-time Sync Active</Text>
            <Text style={[styles.syncDemoText, { color: '#388E3C' }]}>
              Changes made here will instantly appear in the customer interface. 
              Try adding, editing, or toggling product status!
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={[styles.quickActionBtn, { backgroundColor: ORANGE }]}
            onPress={handleAddProduct}
            activeOpacity={0.7}
          >
            <Text style={styles.quickActionIcon}>➕</Text>
            <Text style={styles.quickActionText}>Add Product</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionBtn, { backgroundColor: '#10B981' }]}
            onPress={handleImportCSV}
            activeOpacity={0.7}
          >
            <Text style={styles.quickActionIcon}>📥</Text>
            <Text style={styles.quickActionText}>Import CSV</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionBtn, { backgroundColor: '#6366F1' }]}
            onPress={handleExportData}
            activeOpacity={0.7}
          >
            <Text style={styles.quickActionIcon}>📤</Text>
            <Text style={styles.quickActionText}>Export Data</Text>
          </TouchableOpacity>
        </View>

        {/* Search and Filter Bar */}
        <View style={styles.searchFilterContainer}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={[styles.searchInput, { color: colors.onBackground, backgroundColor: colors.surface }]}
              placeholder="Search products, SKU, or category..."
              placeholderTextColor={colors.onSurface + '66'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}
            onPress={() => Alert.alert('Advanced Filters', 'Opening filter options...')}
            activeOpacity={0.7}
          >
            <Text style={styles.filterIcon}>⚙️</Text>
            <Text style={[styles.filterText, { color: colors.onBackground }]}>Filters</Text>
          </TouchableOpacity>
        </View>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryTab,
                selectedCategory === category && styles.activeCategoryTab,
                { backgroundColor: selectedCategory === category ? ORANGE : colors.surface }
              ]}
              onPress={() => handleCategorySelect(category)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.categoryText,
                { color: selectedCategory === category ? '#fff' : colors.onBackground }
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sort Options */}
        <View style={styles.sortContainer}>
          <Text style={[styles.sortLabel, { color: colors.onSurface + '88' }]}>Sort by:</Text>
          <TouchableOpacity
            style={[styles.sortButton, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}
            onPress={() => handleSortChange('Name')}
            activeOpacity={0.7}
          >
            <Text style={[styles.sortText, { color: colors.onBackground }]}>Name</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}
            onPress={() => handleSortChange('Price')}
            activeOpacity={0.7}
          >
            <Text style={[styles.sortText, { color: colors.onBackground }]}>Price</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}
            onPress={() => handleSortChange('Stock')}
            activeOpacity={0.7}
          >
            <Text style={[styles.sortText, { color: colors.onBackground }]}>Stock</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}
            onPress={() => handleSortChange('Sales')}
            activeOpacity={0.7}
          >
            <Text style={[styles.sortText, { color: colors.onBackground }]}>Sales</Text>
          </TouchableOpacity>
        </View>

        {/* Product Cards */}
        <View style={styles.productsContainer}>
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <View
                  key={product.id}
                  style={[styles.productCard, { backgroundColor: colors.surface, borderColor: ORANGE + '33' }]}
                >
                  {/* Product Header */}
                  <View style={styles.productHeader}>
                    <View style={styles.productImageContainer}>
                      <Text style={styles.productImage}>{product.image}</Text>
                    </View>
                    <View style={styles.productInfo}>
                      <Text style={[styles.productName, { color: colors.onBackground }]}>{product.name}</Text>
                      <Text style={[styles.productCategory, { color: colors.onSurface + '88' }]}>{product.category}</Text>
                      <Text style={[styles.productSku, { color: colors.onSurface + '66' }]}>SKU: {product.sku}</Text>
                    </View>
                    <View style={styles.productStatus}>
                      <View style={[styles.statusBadge, { backgroundColor: product.status === 'Active' ? '#10B981' : '#6B7280' }]}>
                        <Text style={styles.statusText}>{product.status}</Text>
                      </View>
                      {product.featured && (
                        <View style={[styles.featuredBadge, { backgroundColor: ORANGE }]}>
                          <Text style={styles.featuredText}>⭐ Featured</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Product Details */}
                  <View style={styles.productDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Price:</Text>
                      <Text style={[styles.detailValue, { color: colors.onBackground }]}>GHC {product.price.toFixed(2)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Stock:</Text>
                      <View style={[styles.stockBadge, { backgroundColor: stockStatus.bgColor }]}>
                        <Text style={[styles.stockText, { color: stockStatus.color }]}>{stockStatus.status}</Text>
                      </View>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Sales:</Text>
                      <Text style={[styles.detailValue, { color: colors.onBackground }]}>{product.sales} units</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Revenue:</Text>
                      <Text style={[styles.detailValue, { color: colors.onBackground }]}>GHC {product.revenue.toLocaleString()}</Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.editButton]}
                      onPress={() => handleProductAction('Edit', product.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.actionButtonIcon}>✏️</Text>
                      <Text style={styles.actionButtonText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.duplicateButton]}
                      onPress={() => handleProductAction('Duplicate', product.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.actionButtonIcon}>📋</Text>
                      <Text style={styles.actionButtonText}>Duplicate</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.stockButton]}
                      onPress={() => handleProductAction('Manage Stock', product.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.actionButtonIcon}>📦</Text>
                      <Text style={styles.actionButtonText}>Stock</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.toggleButton]}
                      onPress={() => handleProductAction('Toggle Status', product.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.actionButtonIcon}>🔄</Text>
                      <Text style={styles.actionButtonText}>Toggle</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={[styles.emptyTitle, { color: colors.onBackground }]}>No products found</Text>
              <Text style={[styles.emptySubtitle, { color: colors.onSurface + '88' }]}>
                {selectedCategory !== 'All' 
                  ? `No products in ${selectedCategory} category`
                  : 'Start by adding your first product'
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    paddingTop: Math.max(50, screenHeight * 0.06),
    paddingBottom: Math.max(16, screenHeight * 0.02),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: Math.max(24, screenWidth * 0.06),
    fontWeight: 'bold',
  },
  notificationButton: {
    padding: Math.max(8, screenWidth * 0.02),
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    fontSize: Math.max(20, screenWidth * 0.05),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Math.max(32, screenHeight * 0.04),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    paddingVertical: Math.max(20, screenHeight * 0.025),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: Math.max(12, screenWidth * 0.03),
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Math.max(16, screenHeight * 0.02),
    paddingHorizontal: Math.max(12, screenWidth * 0.03),
    borderRadius: Math.max(12, screenWidth * 0.03),
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: Math.max(24, screenWidth * 0.06),
    marginBottom: Math.max(8, screenHeight * 0.01),
  },
  statValue: {
    fontSize: Math.max(18, screenWidth * 0.045),
    fontWeight: 'bold',
    marginBottom: Math.max(4, screenHeight * 0.005),
  },
  statLabel: {
    fontSize: Math.max(12, screenWidth * 0.03),
    textAlign: 'center',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    paddingVertical: Math.max(20, screenHeight * 0.025),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: Math.max(12, screenWidth * 0.03),
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Math.max(12, screenHeight * 0.015),
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    borderRadius: Math.max(10, screenWidth * 0.025),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: Math.max(18, screenWidth * 0.045),
    marginRight: Math.max(8, screenWidth * 0.02),
  },
  quickActionText: {
    fontSize: Math.max(14, screenWidth * 0.035),
    fontWeight: '600',
    color: '#fff',
  },
  searchFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    paddingVertical: Math.max(20, screenHeight * 0.025),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: Math.max(12, screenWidth * 0.03),
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: Math.max(12, screenWidth * 0.03),
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    paddingVertical: Math.max(12, screenHeight * 0.015),
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchIcon: {
    fontSize: Math.max(18, screenWidth * 0.045),
    marginRight: Math.max(8, screenWidth * 0.02),
    color: '#6c757d',
  },
  searchInput: {
    flex: 1,
    fontSize: Math.max(16, screenWidth * 0.04),
    paddingVertical: 0,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Math.max(12, screenHeight * 0.015),
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    borderRadius: Math.max(10, screenWidth * 0.025),
    borderWidth: 1,
    minWidth: Math.max(100, screenWidth * 0.25),
    justifyContent: 'center',
  },
  filterIcon: {
    fontSize: Math.max(18, screenWidth * 0.045),
    marginRight: Math.max(8, screenWidth * 0.02),
  },
  filterText: {
    fontSize: Math.max(14, screenWidth * 0.035),
    fontWeight: '600',
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    paddingVertical: Math.max(20, screenHeight * 0.025),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryTab: {
    paddingVertical: Math.max(10, screenHeight * 0.012),
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    borderRadius: Math.max(25, screenWidth * 0.06),
    marginRight: Math.max(12, screenWidth * 0.03),
    borderWidth: 1,
    borderColor: '#e9ecef',
    minWidth: Math.max(80, screenWidth * 0.2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCategoryTab: {
    borderColor: ORANGE,
    borderWidth: 2,
    backgroundColor: ORANGE + '10',
  },
  categoryText: {
    fontSize: Math.max(14, screenWidth * 0.035),
    fontWeight: '600',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    paddingVertical: Math.max(20, screenHeight * 0.025),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: Math.max(12, screenWidth * 0.03),
  },
  sortLabel: {
    fontSize: Math.max(14, screenWidth * 0.035),
    fontWeight: '500',
    marginRight: Math.max(8, screenWidth * 0.02),
  },
  sortButton: {
    paddingVertical: Math.max(8, screenHeight * 0.01),
    paddingHorizontal: Math.max(12, screenWidth * 0.03),
    borderRadius: Math.max(8, screenWidth * 0.02),
    borderWidth: 1,
    minWidth: Math.max(70, screenWidth * 0.18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortText: {
    fontSize: Math.max(13, screenWidth * 0.033),
    fontWeight: '500',
  },
  productsContainer: {
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    paddingTop: Math.max(20, screenHeight * 0.025),
    gap: Math.max(16, screenWidth * 0.04),
  },
  productCard: {
    borderRadius: Math.max(16, screenWidth * 0.04),
    padding: Math.max(20, screenWidth * 0.05),
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Math.max(16, screenHeight * 0.02),
  },
  productImageContainer: {
    width: Math.max(60, screenWidth * 0.15),
    height: Math.max(60, screenWidth * 0.15),
    borderRadius: Math.max(30, screenWidth * 0.075),
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Math.max(16, screenWidth * 0.04),
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  productImage: {
    fontSize: Math.max(28, screenWidth * 0.07),
  },
  productInfo: {
    flex: 1,
    marginRight: Math.max(12, screenWidth * 0.03),
  },
  productName: {
    fontSize: Math.max(18, screenWidth * 0.045),
    fontWeight: '700',
    marginBottom: Math.max(6, screenHeight * 0.008),
    lineHeight: Math.max(22, screenHeight * 0.027),
  },
  productCategory: {
    fontSize: Math.max(14, screenWidth * 0.035),
    marginBottom: Math.max(4, screenHeight * 0.005),
    fontWeight: '500',
  },
  productSku: {
    fontSize: Math.max(12, screenWidth * 0.03),
    fontFamily: 'monospace',
  },
  productStatus: {
    alignItems: 'flex-end',
    gap: Math.max(6, screenHeight * 0.008),
  },
  statusBadge: {
    paddingVertical: Math.max(6, screenHeight * 0.008),
    paddingHorizontal: Math.max(12, screenWidth * 0.03),
    borderRadius: Math.max(20, screenWidth * 0.05),
  },
  statusText: {
    fontSize: Math.max(12, screenWidth * 0.03),
    fontWeight: '600',
    color: '#fff',
  },
  featuredBadge: {
    paddingVertical: Math.max(4, screenHeight * 0.005),
    paddingHorizontal: Math.max(8, screenWidth * 0.02),
    borderRadius: Math.max(12, screenWidth * 0.03),
  },
  featuredText: {
    fontSize: Math.max(11, screenWidth * 0.028),
    fontWeight: '600',
    color: '#fff',
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: Math.max(20, screenHeight * 0.025),
    gap: Math.max(12, screenHeight * 0.015),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: Math.max(120, screenWidth * 0.3),
  },
  detailLabel: {
    fontSize: Math.max(13, screenWidth * 0.033),
    color: '#6c757d',
    marginRight: Math.max(6, screenWidth * 0.015),
    fontWeight: '500',
  },
  detailValue: {
    fontSize: Math.max(13, screenWidth * 0.033),
    fontWeight: '600',
  },
  stockBadge: {
    paddingVertical: Math.max(4, screenHeight * 0.005),
    paddingHorizontal: Math.max(8, screenWidth * 0.02),
    borderRadius: Math.max(12, screenWidth * 0.03),
  },
  stockText: {
    fontSize: Math.max(11, screenWidth * 0.028),
    fontWeight: '600',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Math.max(8, screenWidth * 0.02),
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Math.max(12, screenHeight * 0.015),
    paddingHorizontal: Math.max(8, screenWidth * 0.02),
    borderRadius: Math.max(8, screenWidth * 0.02),
    borderWidth: 1,
    minHeight: Math.max(44, screenHeight * 0.055),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  editButton: {
    backgroundColor: '#fff',
    borderColor: ORANGE,
  },
  duplicateButton: {
    backgroundColor: '#fff',
    borderColor: '#6366F1',
  },
  stockButton: {
    backgroundColor: '#fff',
    borderColor: '#10B981',
  },
  toggleButton: {
    backgroundColor: '#fff',
    borderColor: '#6B7280',
  },
  actionButtonIcon: {
    fontSize: Math.max(16, screenWidth * 0.04),
    marginRight: Math.max(6, screenWidth * 0.015),
  },
  actionButtonText: {
    fontSize: Math.max(12, screenWidth * 0.03),
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Math.max(50, screenHeight * 0.1),
    paddingHorizontal: Math.max(20, screenWidth * 0.05),
  },
  emptyIcon: {
    fontSize: Math.max(50, screenWidth * 0.15),
    marginBottom: Math.max(15, screenHeight * 0.02),
  },
  emptyTitle: {
    fontSize: Math.max(20, screenWidth * 0.06),
    fontWeight: 'bold',
    marginBottom: Math.max(10, screenHeight * 0.015),
  },
  emptySubtitle: {
    fontSize: Math.max(14, screenWidth * 0.035),
    textAlign: 'center',
    lineHeight: Math.max(20, screenHeight * 0.025),
  },
  syncDemoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Math.max(12, screenHeight * 0.015),
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    borderRadius: Math.max(10, screenWidth * 0.025),
    borderWidth: 1,
    marginHorizontal: Math.max(16, screenWidth * 0.04),
    marginBottom: Math.max(20, screenHeight * 0.025),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  syncDemoIcon: {
    fontSize: Math.max(24, screenWidth * 0.06),
    marginRight: Math.max(12, screenWidth * 0.03),
  },
  syncDemoContent: {
    flex: 1,
  },
  syncDemoTitle: {
    fontSize: Math.max(16, screenWidth * 0.04),
    fontWeight: '600',
    marginBottom: Math.max(4, screenHeight * 0.005),
  },
  syncDemoText: {
    fontSize: Math.max(13, screenWidth * 0.033),
    color: '#388E3C',
  },
});


