import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Search, Plus, Edit, Trash2, AlertCircle, CheckCircle, X, Package, AlertTriangle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { StoreOwner, Product } from '@/types';
import { mockStores } from '@/mocks/stores';
import { mockProducts } from '@/mocks/products';
import { useProductStore } from '@/store/product-store';
import AddProductForm from '@/components/AddProductForm';
import ScrollableTab, { TabItem } from '@/components/ScrollableTab';

export default function StoreInventoryScreen() {
  const { user } = useAuthStore();
  const storeOwner = user as StoreOwner;
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'in-stock', 'low-stock', 'out-of-stock'
  const [isAddProductModalVisible, setIsAddProductModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const { products, addProduct, deleteProduct, updateProduct } = useProductStore();
  
  // Get store data
  const store = mockStores.find(s => s.id === storeOwner?.storeId);
  
  // Get store products - combine mock products with products from store
  const storeProducts = [
    ...mockProducts.filter(p => p.storeId === storeOwner?.storeId),
    ...products.filter(p => p.storeId === storeOwner?.storeId)
  ];
  
  // Filter products based on search and status
  const filteredProducts = storeProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
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
  
  // Define tabs
  const tabs: TabItem[] = [
    { id: 'all', label: 'All', count: totalProducts },
    { id: 'in-stock', label: 'In Stock', count: inStockProducts },
    { id: 'low-stock', label: 'Low Stock', count: lowStockProducts },
    { id: 'out-of-stock', label: 'Out of Stock', count: outOfStockProducts }
  ];
  
  const handleAddProduct = (newProduct: Product) => {
    addProduct(newProduct);
    setIsAddProductModalVisible(false);
  };
  
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsAddProductModalVisible(true);
  };
  
  const handleUpdateProduct = (updatedProduct: Product) => {
    updateProduct(updatedProduct.id, updatedProduct);
    setIsAddProductModalVisible(false);
    setSelectedProduct(null);
  };
  
  const handleDeleteConfirm = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct.id);
      setIsDeleteModalVisible(false);
      setSelectedProduct(null);
    }
  };
  
  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalVisible(true);
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventory</Text>
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
            placeholderTextColor={Colors.subtext}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            setSelectedProduct(null);
            setIsAddProductModalVisible(true);
          }}
        >
          <Plus size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabsContainer}>
        <ScrollableTab 
          tabs={tabs}
          activeTab={filterStatus}
          onTabChange={setFilterStatus}
        />
      </View>
      
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => {
          let stockStatus = 'In Stock';
          let statusColor = Colors.success;
          let StatusIcon = CheckCircle;
          
          if (item.quantity === 0) {
            stockStatus = 'Out of Stock';
            statusColor = Colors.error;
            StatusIcon = AlertCircle;
          } else if (item.quantity <= 10) {
            stockStatus = 'Low Stock';
            statusColor = Colors.warning;
            StatusIcon = AlertTriangle;
          }
          
          return (
            <View style={styles.productCard}>
              <View style={styles.productHeader}>
                <View style={styles.productImageContainer}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.productImage} />
                  ) : (
                    <View style={styles.productImagePlaceholder}>
                      <Package size={24} color={Colors.subtext} />
                    </View>
                  )}
                </View>
                
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productCategory}>{item.category}</Text>
                  
                  <View style={styles.productPriceRow}>
                    <Text style={styles.productPrice}>₵{item.price.toFixed(2)}</Text>
                    {item.discountPrice && (
                      <Text style={styles.productDiscountPrice}>₵{item.discountPrice.toFixed(2)}</Text>
                    )}
                  </View>
                </View>
              </View>
              
              <View style={styles.productFooter}>
                <View style={[styles.stockStatus, { backgroundColor: statusColor + '15' }]}>
                  <StatusIcon size={14} color={statusColor} style={styles.statusIcon} />
                  <Text style={[styles.stockStatusText, { color: statusColor }]}>
                    {stockStatus} • {item.quantity} {item.unit}
                  </Text>
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleEditProduct(item)}
                  >
                    <Edit size={18} color={Colors.primary} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => openDeleteModal(item)}
                  >
                    <Trash2 size={18} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
              
              {!item.verified && (
                <View style={styles.verificationBadge}>
                  <Text style={styles.verificationText}>Pending Verification</Text>
                </View>
              )}
            </View>
          );
        }}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.productsList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Package size={50} color={Colors.subtext} style={styles.emptyStateIcon} />
            <Text style={styles.emptyStateTitle}>No products found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery ? "Try adjusting your search" : "Add products to your inventory"}
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => {
                setSelectedProduct(null);
                setIsAddProductModalVisible(true);
              }}
            >
              <Plus size={18} color={Colors.white} style={styles.emptyStateButtonIcon} />
              <Text style={styles.emptyStateButtonText}>Add Product</Text>
            </TouchableOpacity>
          </View>
        }
      />
      
      {/* Add/Edit Product Modal */}
      <Modal
        visible={isAddProductModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setIsAddProductModalVisible(false);
          setSelectedProduct(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedProduct ? 'Edit Product' : 'Add New Product'}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  setIsAddProductModalVisible(false);
                  setSelectedProduct(null);
                }}
              >
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            
            <AddProductForm 
              storeId={storeOwner?.storeId || ''}
              product={selectedProduct}
              onSubmit={selectedProduct ? handleUpdateProduct : handleAddProduct}
              onCancel={() => {
                setIsAddProductModalVisible(false);
                setSelectedProduct(null);
              }}
            />
          </View>
        </View>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        visible={isDeleteModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.confirmModalContainer}>
          <View style={styles.confirmModalContent}>
            <AlertCircle size={40} color={Colors.error} style={styles.confirmModalIcon} />
            <Text style={styles.confirmModalTitle}>Delete Product</Text>
            <Text style={styles.confirmModalText}>
              Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
            </Text>
            
            <View style={styles.confirmModalButtons}>
              <TouchableOpacity 
                style={[styles.confirmModalButton, styles.cancelModalButton]}
                onPress={() => setIsDeleteModalVisible(false)}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.confirmModalButton, styles.deleteModalButton]}
                onPress={handleDeleteConfirm}
              >
                <Text style={styles.deleteModalButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
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
  tabsContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  productsList: {
    padding: 16,
    paddingBottom: 80,
  },
  productCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  productHeader: {
    flexDirection: 'row',
    padding: 16,
  },
  productImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 8,
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginRight: 8,
  },
  productDiscountPrice: {
    fontSize: 14,
    color: Colors.subtext,
    textDecorationLine: 'line-through',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border + '30',
  },
  stockStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusIcon: {
    marginRight: 4,
  },
  stockStatusText: {
    fontSize: 13,
    fontWeight: '600',
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
  deleteButton: {
    backgroundColor: Colors.error + '10',
  },
  verificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.info + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  verificationText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.info,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginTop: 20,
  },
  emptyStateIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyStateButtonIcon: {
    marginRight: 8,
  },
  emptyStateButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginHorizontal: 20,
    maxHeight: '90%',
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
  confirmModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  confirmModalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  confirmModalIcon: {
    marginBottom: 16,
  },
  confirmModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  confirmModalText: {
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'center',
    marginBottom: 24,
  },
  confirmModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelModalButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  deleteModalButton: {
    backgroundColor: Colors.error,
  },
  cancelModalButtonText: {
    color: Colors.text,
    fontWeight: '600',
  },
  deleteModalButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
});