import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Alert, 
  FlatList,
  Modal,
  Dimensions,
  Switch
} from 'react-native';
import { useTheme } from '../../theme/theme';
import { Screen } from '../../components/UI';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const ORANGE = '#FF7A00';

interface Product {
  id: string;
  name: string;
  currentStock: number;
  minStockLevel: number;
  unit: string;
  category: string;
  lastRestocked: string;
  imageUrl?: string;
}

interface RestockItem {
  productId: string;
  productName: string;
  currentStock: number;
  restockQuantity: number;
  unit: string;
  costPerUnit: number;
  totalCost: number;
}

export default function Restock({ navigation }: any) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showLowStockOnly, setShowLowStockOnly] = useState(true);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [restockItems, setRestockItems] = useState<RestockItem[]>([]);

  // Mock data - in real app, this would come from API
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Coca Cola 500ml',
      currentStock: 5,
      minStockLevel: 20,
      unit: 'bottles',
      category: 'Beverages',
      lastRestocked: '2024-01-15',
      imageUrl: 'https://via.placeholder.com/60'
    },
    {
      id: '2',
      name: 'Fresh Bananas',
      currentStock: 12,
      minStockLevel: 15,
      unit: 'kg',
      category: 'Fruits & Vegetables',
      lastRestocked: '2024-01-14',
      imageUrl: 'https://via.placeholder.com/60'
    },
    {
      id: '3',
      name: 'Whole Milk',
      currentStock: 8,
      minStockLevel: 25,
      unit: 'liters',
      category: 'Dairy & Eggs',
      lastRestocked: '2024-01-13',
      imageUrl: 'https://via.placeholder.com/60'
    },
    {
      id: '4',
      name: 'Bread Loaf',
      currentStock: 3,
      minStockLevel: 10,
      unit: 'pieces',
      category: 'Bakery & Bread',
      lastRestocked: '2024-01-12',
      imageUrl: 'https://via.placeholder.com/60'
    },
    {
      id: '5',
      name: 'Rice 5kg',
      currentStock: 45,
      minStockLevel: 20,
      unit: 'bags',
      category: 'Canned & Packaged',
      lastRestocked: '2024-01-10',
      imageUrl: 'https://via.placeholder.com/60'
    }
  ]);

  const categories = ['All', 'Beverages', 'Fruits & Vegetables', 'Dairy & Eggs', 'Bakery & Bread', 'Canned & Packaged'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesLowStock = !showLowStockOnly || product.currentStock <= product.minStockLevel;
    
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const handleRestockProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowRestockModal(true);
  };

  const handleAddToRestockList = (product: Product, quantity: number, costPerUnit: number) => {
    const existingItem = restockItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      setRestockItems(prev => prev.map(item => 
        item.productId === product.id 
          ? { ...item, restockQuantity: quantity, costPerUnit, totalCost: quantity * costPerUnit }
          : item
      ));
    } else {
      const newItem: RestockItem = {
        productId: product.id,
        productName: product.name,
        currentStock: product.currentStock,
        restockQuantity: quantity,
        unit: product.unit,
        costPerUnit,
        totalCost: quantity * costPerUnit
      };
      setRestockItems(prev => [...prev, newItem]);
    }
    
    setShowRestockModal(false);
    setSelectedProduct(null);
  };

  const handleRemoveFromRestockList = (productId: string) => {
    setRestockItems(prev => prev.filter(item => item.productId !== productId));
  };

  const handleProcessRestock = async () => {
    if (restockItems.length === 0) {
      Alert.alert('Empty List', 'Please add items to restock before processing.');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const totalCost = restockItems.reduce((sum, item) => sum + item.totalCost, 0);
      
      Alert.alert(
        'Restock Processed!', 
        `Successfully restocked ${restockItems.length} items for ₵${totalCost.toFixed(2)}`,
        [
          {
            text: 'View Inventory',
            onPress: () => navigation.navigate('Products')
          },
          {
            text: 'OK',
            onPress: () => {
              setRestockItems([]);
              setSearchQuery('');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to process restock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (currentStock: number, minStockLevel: number) => {
    if (currentStock === 0) return { status: 'Out of Stock', color: '#FF4444' };
    if (currentStock <= minStockLevel) return { status: 'Low Stock', color: '#FF9800' };
    if (currentStock <= minStockLevel * 1.5) return { status: 'Medium Stock', color: '#FFC107' };
    return { status: 'Good Stock', color: '#4CAF50' };
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const stockStatus = getStockStatus(item.currentStock, item.minStockLevel);
    
    return (
      <TouchableOpacity 
        style={[styles.productCard, { backgroundColor: colors.surface, borderColor: colors.primary + '22' }]}
        onPress={() => handleRestockProduct(item)}
      >
        <View style={styles.productInfo}>
          <View style={styles.productImageContainer}>
            <Text style={styles.productEmoji}>📦</Text>
          </View>
          <View style={styles.productDetails}>
            <Text style={[styles.productName, { color: colors.onBackground }]}>{item.name}</Text>
            <Text style={[styles.productCategory, { color: colors.onSurface + '88' }]}>{item.category}</Text>
            <View style={styles.stockInfo}>
              <Text style={[styles.stockText, { color: colors.onSurface }]}>
                Current: {item.currentStock} {item.unit}
              </Text>
              <Text style={[styles.minStockText, { color: colors.onSurface + '88' }]}>
                Min: {item.minStockLevel} {item.unit}
              </Text>
            </View>
            <View style={[styles.stockStatusBadge, { backgroundColor: stockStatus.color + '22' }]}>
              <Text style={[styles.stockStatusText, { color: stockStatus.color }]}>
                {stockStatus.status}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.productActions}>
          <TouchableOpacity 
            style={[styles.restockButton, { backgroundColor: colors.primary }]}
            onPress={() => handleRestockProduct(item)}
          >
            <Text style={[styles.restockButtonText, { color: colors.onPrimary }]}>Restock</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRestockItem = ({ item }: { item: RestockItem }) => (
    <View style={[styles.restockItem, { backgroundColor: colors.surface, borderColor: colors.primary + '22' }]}>
      <View style={styles.restockItemInfo}>
        <Text style={[styles.restockItemName, { color: colors.onBackground }]}>{item.productName}</Text>
        <Text style={[styles.restockItemDetails, { color: colors.onSurface + '88' }]}>
          {item.restockQuantity} {item.unit} × ₵{item.costPerUnit.toFixed(2)} = ₵{item.totalCost.toFixed(2)}
        </Text>
      </View>
      <TouchableOpacity 
        style={[styles.removeButton, { backgroundColor: '#FF4444' + '22' }]}
        onPress={() => handleRemoveFromRestockList(item.productId)}
      >
        <Text style={[styles.removeButtonText, { color: '#FF4444' }]}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Screen style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.primary + '22' }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backIcon, { color: colors.onSurface }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.onBackground }]}>Restock Inventory</Text>
        <TouchableOpacity 
          style={[styles.processButton, { backgroundColor: colors.primary }]}
          onPress={handleProcessRestock}
          disabled={loading || restockItems.length === 0}
        >
          <Text style={[styles.processButtonText, { color: colors.onPrimary }]}>
            {loading ? 'Processing...' : `Process (${restockItems.length})`}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search and Filters */}
        <View style={[styles.searchSection, { backgroundColor: colors.surface, borderColor: colors.primary + '22' }]}>
          <TextInput
            style={[styles.searchInput, { borderColor: colors.primary + '44', color: colors.onBackground }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search products..."
            placeholderTextColor={colors.onSurface + '66'}
          />
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  { 
                    backgroundColor: selectedCategory === category ? colors.primary : colors.primary + '22',
                    borderColor: colors.primary + '44'
                  }
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryChipText,
                  { color: selectedCategory === category ? colors.onPrimary : colors.primary }
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.filterRow}>
            <View style={styles.switchRow}>
              <Text style={[styles.switchLabel, { color: colors.onBackground }]}>Show low stock only</Text>
              <Switch
                value={showLowStockOnly}
                onValueChange={setShowLowStockOnly}
                trackColor={{ false: '#767577', true: colors.primary + '44' }}
                thumbColor={showLowStockOnly ? colors.primary : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* Restock List */}
        {restockItems.length > 0 && (
          <View style={[styles.restockListSection, { backgroundColor: colors.surface, borderColor: colors.primary + '22' }]}>
            <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
              Restock List ({restockItems.length} items)
            </Text>
            <FlatList
              data={restockItems}
              keyExtractor={(item) => item.productId}
              renderItem={renderRestockItem}
              scrollEnabled={false}
            />
            <View style={styles.totalCostContainer}>
              <Text style={[styles.totalCostText, { color: colors.onBackground }]}>
                Total Cost: ₵{restockItems.reduce((sum, item) => sum + item.totalCost, 0).toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        {/* Products List */}
        <View style={[styles.productsSection, { backgroundColor: colors.surface, borderColor: colors.primary + '22' }]}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
            Products ({filteredProducts.length})
          </Text>
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            renderItem={renderProductItem}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📦</Text>
                <Text style={[styles.emptyText, { color: colors.onSurface }]}>No products found</Text>
                <Text style={[styles.emptySubtext, { color: colors.onSurface + '88' }]}>
                  Try adjusting your search or filters
                </Text>
              </View>
            }
          />
        </View>
      </ScrollView>

      {/* Restock Modal */}
      <Modal visible={showRestockModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.onBackground }]}>
              Restock {selectedProduct?.name}
            </Text>
            
            {selectedProduct && (
              <RestockForm
                product={selectedProduct}
                onAdd={handleAddToRestockList}
                onCancel={() => setShowRestockModal(false)}
                colors={colors}
              />
            )}
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

interface RestockFormProps {
  product: Product;
  onAdd: (product: Product, quantity: number, costPerUnit: number) => void;
  onCancel: () => void;
  colors: any;
}

const RestockForm: React.FC<RestockFormProps> = ({ product, onAdd, onCancel, colors }) => {
  const [quantity, setQuantity] = useState('');
  const [costPerUnit, setCostPerUnit] = useState('');

  const handleSubmit = () => {
    const qty = Number(quantity);
    const cost = Number(costPerUnit);
    
    if (!qty || qty <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity');
      return;
    }
    
    if (!cost || cost <= 0) {
      Alert.alert('Invalid Cost', 'Please enter a valid cost per unit');
      return;
    }
    
    onAdd(product, qty, cost);
  };

  return (
    <>
      <View style={styles.formContainer}>
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: colors.onBackground }]}>{product.name}</Text>
          <Text style={[styles.productDetails, { color: colors.onSurface + '88' }]}>
            Current Stock: {product.currentStock} {product.unit}
          </Text>
          <Text style={[styles.productDetails, { color: colors.onSurface + '88' }]}>
            Min Level: {product.minStockLevel} {product.unit}
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.onSurface }]}>Quantity to Restock *</Text>
          <TextInput
            style={[styles.textInput, { borderColor: colors.primary + '44', color: colors.onBackground }]}
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Enter quantity"
            placeholderTextColor={colors.onSurface + '66'}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.onSurface }]}>Cost per Unit (₵) *</Text>
          <TextInput
            style={[styles.textInput, { borderColor: colors.primary + '44', color: colors.onBackground }]}
            value={costPerUnit}
            onChangeText={setCostPerUnit}
            placeholder="0.00"
            placeholderTextColor={colors.onSurface + '66'}
            keyboardType="numeric"
          />
        </View>

        {quantity && costPerUnit && (
          <View style={[styles.totalPreview, { backgroundColor: colors.primary + '22' }]}>
            <Text style={[styles.totalPreviewText, { color: colors.primary }]}>
              Total Cost: ₵{(Number(quantity) * Number(costPerUnit)).toFixed(2)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.modalButtons}>
        <TouchableOpacity 
          style={[styles.cancelButton, { borderColor: colors.primary + '44' }]}
          onPress={onCancel}
        >
          <Text style={[styles.cancelText, { color: colors.primary }]}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
        >
          <Text style={[styles.addText, { color: colors.onPrimary }]}>Add to List</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  processButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  processButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  searchSection: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  restockListSection: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  restockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  restockItemInfo: {
    flex: 1,
  },
  restockItemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  restockItemDetails: {
    fontSize: 14,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  removeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalCostContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalCostText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productsSection: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  productInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  productImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productEmoji: {
    fontSize: 24,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    marginBottom: 8,
  },
  stockInfo: {
    marginBottom: 8,
  },
  stockText: {
    fontSize: 14,
    marginBottom: 2,
  },
  minStockText: {
    fontSize: 12,
  },
  stockStatusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  productActions: {
    marginLeft: 12,
  },
  restockButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  restockButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  productInfo: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  productDetails: {
    fontSize: 14,
    marginBottom: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  totalPreview: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  totalPreviewText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
