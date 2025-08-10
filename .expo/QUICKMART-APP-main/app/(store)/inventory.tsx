import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Search, Plus, Edit, Trash2, AlertTriangle, CheckCircle, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { StoreOwner, Product } from '@/types';
import { mockStores } from '@/mocks/stores';
import { mockProducts } from '@/mocks/products';
import { useProductStore } from '@/store/product-store';
import AddProductForm from '@/components/AddProductForm';

export default function StoreInventoryScreen() {
  const { user } = useAuthStore();
  const storeOwner = user as StoreOwner;
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'in-stock', 'low-stock', 'out-of-stock'
  const [isAddProductModalVisible, setIsAddProductModalVisible] = useState(false);
  const { products, addProduct, deleteProduct } = useProductStore();
  
  // Get store data
  const store = mockStores.find(s => s.id === storeOwner?.storeId);
  
  // Get store products - combine mock products with products from store
  const storeProducts = [
    ...mockProducts.filter(p => p.storeId === storeOwner?.storeId),
    ...products.filter(p => p.storeId === storeOwner?.storeId)
  ];
  
  // Filter products based on search and status
  const filteredProducts = storeProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'in-stock') return matchesSearch && product.quantity > 10;
    if (filterStatus === 'low-stock') return matchesSearch && product.quantity > 0 && product.quantity <= 10;
    if (filterStatus === 'out-of-stock') return matchesSearch && product.quantity === 0;
    
    return matchesSearch;
  });
  
  // Calculate inventory stats
  const totalProducts = storeProducts.length;
  const inStockProducts = storeProducts.filter(p => p.quantity > 10).length;
  const lowStockProducts = storeProducts.filter(p => p.quantity > 0 && p.quantity <= 10).length;
  const outOfStockProducts = storeProducts.filter(p => p.quantity === 0).length;
  
  const handleAddProduct = (newProduct: Product) => {
    addProduct(newProduct);
    setIsAddProductModalVisible(false);
  };
  
  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId);
  };
  
  const renderProductItem = ({ item }: { item: Product }) => {
    let stockStatus = 'In Stock';
    let statusColor = Colors.success;
    let StatusIcon = CheckCircle;
    
    if (item.quantity === 0) {
      stockStatus = 'Out of Stock';
      statusColor = Colors.error;
      StatusIcon = AlertTriangle;
    } else if (item.quantity <= 10) {
      stockStatus = 'Low Stock';
      statusColor = Colors.warning;
      StatusIcon = AlertTriangle;
    }
    
    return (
      <View style={styles.productItem}>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productCategory}>{item.category}</Text>
          <View style={styles.productDetails}>
            <Text style={styles.productPrice}>₵{item.price.toFixed(2)}</Text>
            <View style={[styles.stockStatus, { backgroundColor: statusColor + '20' }]}>
              <StatusIcon size={14} color={statusColor} style={styles.statusIcon} />
              <Text style={[styles.stockStatusText, { color: statusColor }]}>{stockStatus}</Text>
            </View>
            {!item.verified && (
              <View style={[styles.stockStatus, { backgroundColor: Colors.info + '20', marginLeft: 8 }]}>
                <Text style={[styles.stockStatusText, { color: Colors.info }]}>Pending Verification</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.stockContainer}>
          <Text style={styles.stockLabel}>Stock</Text>
          <Text style={styles.stockValue}>{item.quantity}</Text>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Edit size={18} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDeleteProduct(item.id)}
          >
            <Trash2 size={18} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventory Management</Text>
        <Text style={styles.headerSubtitle}>{store?.name || storeOwner?.businessName}</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.subtext} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsAddProductModalVisible(true)}
        >
          <Plus size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsContainer}>
        <TouchableOpacity 
          style={[styles.statTab, filterStatus === 'all' && styles.activeStatTab]}
          onPress={() => setFilterStatus('all')}
        >
          <Text style={styles.statValue}>{totalProducts}</Text>
          <Text style={[styles.statLabel, filterStatus === 'all' && styles.activeStatLabel]}>All</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.statTab, filterStatus === 'in-stock' && styles.activeStatTab]}
          onPress={() => setFilterStatus('in-stock')}
        >
          <Text style={styles.statValue}>{inStockProducts}</Text>
          <Text style={[styles.statLabel, filterStatus === 'in-stock' && styles.activeStatLabel]}>In Stock</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.statTab, filterStatus === 'low-stock' && styles.activeStatTab]}
          onPress={() => setFilterStatus('low-stock')}
        >
          <Text style={styles.statValue}>{lowStockProducts}</Text>
          <Text style={[styles.statLabel, filterStatus === 'low-stock' && styles.activeStatLabel]}>Low Stock</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.statTab, filterStatus === 'out-of-stock' && styles.activeStatTab]}
          onPress={() => setFilterStatus('out-of-stock')}
        >
          <Text style={styles.statValue}>{outOfStockProducts}</Text>
          <Text style={[styles.statLabel, filterStatus === 'out-of-stock' && styles.activeStatLabel]}>Out of Stock</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.productsList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No products found</Text>
          </View>
        }
      />
      
      <Modal
        visible={isAddProductModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddProductModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Product</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsAddProductModalVisible(false)}
              >
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            
            <AddProductForm 
              storeId={storeOwner?.storeId || ''}
              onSubmit={handleAddProduct}
              onCancel={() => setIsAddProductModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: Colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeStatTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.subtext,
  },
  activeStatLabel: {
    color: Colors.primary,
    fontWeight: '500',
  },
  productsList: {
    padding: 16,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 8,
  },
  productDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginRight: 12,
  },
  stockStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusIcon: {
    marginRight: 4,
  },
  stockStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  stockContainer: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  stockLabel: {
    fontSize: 12,
    color: Colors.subtext,
    marginBottom: 4,
  },
  stockValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.subtext,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginHorizontal: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
});