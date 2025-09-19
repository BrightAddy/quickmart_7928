import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Alert, 
  Image,
  Modal,
  Dimensions,
  Switch
} from 'react-native';
import { useTheme } from '../../theme/theme';
import { Screen } from '../../components/UI';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const ORANGE = '#FF7A00';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: string;
  unit: string;
  stockQuantity: string;
  minStockLevel: string;
  barcode: string;
  weight: string;
  dimensions: string;
  isActive: boolean;
  isFeatured: boolean;
  tags: string;
  imageUrl: string;
}

export default function AddProduct({ navigation }: any) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: '',
    category: '',
    unit: '',
    stockQuantity: '',
    minStockLevel: '',
    barcode: '',
    weight: '',
    dimensions: '',
    isActive: true,
    isFeatured: false,
    tags: '',
    imageUrl: ''
  });

  const categories = [
    'Fruits & Vegetables',
    'Dairy & Eggs',
    'Meat & Seafood',
    'Bakery & Bread',
    'Beverages',
    'Snacks & Confectionery',
    'Canned & Packaged',
    'Frozen Foods',
    'Health & Beauty',
    'Household Items',
    'Other'
  ];

  const units = [
    'kg', 'g', 'lb', 'oz',
    'L', 'ml', 'gal', 'pt',
    'pcs', 'pack', 'box', 'bottle',
    'can', 'bag', 'dozen'
  ];

  const handleInputChange = (field: keyof ProductForm, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageSelection = (imageType: 'camera' | 'gallery') => {
    setShowImagePicker(false);
    // In a real app, you would implement image picker here
    Alert.alert('Image Selection', `${imageType} selected. Image picker would open here.`);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Product name is required');
      return false;
    }
    if (!formData.price.trim() || isNaN(Number(formData.price))) {
      Alert.alert('Validation Error', 'Valid price is required');
      return false;
    }
    if (!formData.category) {
      Alert.alert('Validation Error', 'Category is required');
      return false;
    }
    if (!formData.unit) {
      Alert.alert('Validation Error', 'Unit is required');
      return false;
    }
    if (!formData.stockQuantity.trim() || isNaN(Number(formData.stockQuantity))) {
      Alert.alert('Validation Error', 'Valid stock quantity is required');
      return false;
    }
    return true;
  };

  const handleSaveProduct = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success!', 
        'Product has been added successfully',
        [
          {
            text: 'Add Another',
            onPress: () => {
              setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                unit: '',
                stockQuantity: '',
                minStockLevel: '',
                barcode: '',
                weight: '',
                dimensions: '',
                isActive: true,
                isFeatured: false,
                tags: '',
                imageUrl: ''
              });
            }
          },
          {
            text: 'View Products',
            onPress: () => navigation.navigate('Products')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    Alert.alert('Draft Saved', 'Product saved as draft successfully');
  };

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
        <Text style={[styles.headerTitle, { color: colors.onBackground }]}>Add New Product</Text>
        <TouchableOpacity 
          style={[styles.draftButton, { backgroundColor: colors.primary + '22' }]}
          onPress={handleSaveDraft}
        >
          <Text style={[styles.draftText, { color: colors.primary }]}>Save Draft</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image Section */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.primary + '22' }]}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Product Image</Text>
          <TouchableOpacity 
            style={[styles.imageContainer, { borderColor: colors.primary + '44' }]}
            onPress={() => setShowImagePicker(true)}
          >
            {formData.imageUrl ? (
              <Image source={{ uri: formData.imageUrl }} style={styles.productImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imageIcon}>📷</Text>
                <Text style={[styles.imageText, { color: colors.onSurface + '88' }]}>Tap to add image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Basic Information */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.primary + '22' }]}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.onSurface }]}>Product Name *</Text>
            <TextInput
              style={[styles.textInput, { borderColor: colors.primary + '44', color: colors.onBackground }]}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Enter product name"
              placeholderTextColor={colors.onSurface + '66'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.onSurface }]}>Description</Text>
            <TextInput
              style={[styles.textArea, { borderColor: colors.primary + '44', color: colors.onBackground }]}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Enter product description"
              placeholderTextColor={colors.onSurface + '66'}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={[styles.inputLabel, { color: colors.onSurface }]}>Price (₵) *</Text>
              <TextInput
                style={[styles.textInput, { borderColor: colors.primary + '44', color: colors.onBackground }]}
                value={formData.price}
                onChangeText={(value) => handleInputChange('price', value)}
                placeholder="0.00"
                placeholderTextColor={colors.onSurface + '66'}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={[styles.inputLabel, { color: colors.onSurface }]}>Unit *</Text>
              <TouchableOpacity 
                style={[styles.pickerButton, { borderColor: colors.primary + '44' }]}
                onPress={() => setShowUnitPicker(true)}
              >
                <Text style={[styles.pickerText, { color: formData.unit ? colors.onBackground : colors.onSurface + '66' }]}>
                  {formData.unit || 'Select unit'}
                </Text>
                <Text style={[styles.pickerIcon, { color: colors.onSurface + '66' }]}>▼</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.onSurface }]}>Category *</Text>
            <TouchableOpacity 
              style={[styles.pickerButton, { borderColor: colors.primary + '44' }]}
              onPress={() => setShowCategoryPicker(true)}
            >
              <Text style={[styles.pickerText, { color: formData.category ? colors.onBackground : colors.onSurface + '66' }]}>
                {formData.category || 'Select category'}
              </Text>
              <Text style={[styles.pickerIcon, { color: colors.onSurface + '66' }]}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Inventory Information */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.primary + '22' }]}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Inventory Information</Text>
          
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={[styles.inputLabel, { color: colors.onSurface }]}>Stock Quantity *</Text>
              <TextInput
                style={[styles.textInput, { borderColor: colors.primary + '44', color: colors.onBackground }]}
                value={formData.stockQuantity}
                onChangeText={(value) => handleInputChange('stockQuantity', value)}
                placeholder="0"
                placeholderTextColor={colors.onSurface + '66'}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={[styles.inputLabel, { color: colors.onSurface }]}>Min Stock Level</Text>
              <TextInput
                style={[styles.textInput, { borderColor: colors.primary + '44', color: colors.onBackground }]}
                value={formData.minStockLevel}
                onChangeText={(value) => handleInputChange('minStockLevel', value)}
                placeholder="0"
                placeholderTextColor={colors.onSurface + '66'}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.onSurface }]}>Barcode/SKU</Text>
            <TextInput
              style={[styles.textInput, { borderColor: colors.primary + '44', color: colors.onBackground }]}
              value={formData.barcode}
              onChangeText={(value) => handleInputChange('barcode', value)}
              placeholder="Enter barcode or SKU"
              placeholderTextColor={colors.onSurface + '66'}
            />
          </View>
        </View>

        {/* Physical Properties */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.primary + '22' }]}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Physical Properties</Text>
          
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={[styles.inputLabel, { color: colors.onSurface }]}>Weight (kg)</Text>
              <TextInput
                style={[styles.textInput, { borderColor: colors.primary + '44', color: colors.onBackground }]}
                value={formData.weight}
                onChangeText={(value) => handleInputChange('weight', value)}
                placeholder="0.0"
                placeholderTextColor={colors.onSurface + '66'}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={[styles.inputLabel, { color: colors.onSurface }]}>Dimensions (L×W×H)</Text>
              <TextInput
                style={[styles.textInput, { borderColor: colors.primary + '44', color: colors.onBackground }]}
                value={formData.dimensions}
                onChangeText={(value) => handleInputChange('dimensions', value)}
                placeholder="10×5×3"
                placeholderTextColor={colors.onSurface + '66'}
              />
            </View>
          </View>
        </View>

        {/* Product Settings */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.primary + '22' }]}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Product Settings</Text>
          
          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <Text style={[styles.switchLabel, { color: colors.onBackground }]}>Active Product</Text>
              <Text style={[styles.switchDescription, { color: colors.onSurface + '88' }]}>
                Product will be visible to customers
              </Text>
            </View>
            <Switch
              value={formData.isActive}
              onValueChange={(value) => handleInputChange('isActive', value)}
              trackColor={{ false: '#767577', true: colors.primary + '44' }}
              thumbColor={formData.isActive ? colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <Text style={[styles.switchLabel, { color: colors.onBackground }]}>Featured Product</Text>
              <Text style={[styles.switchDescription, { color: colors.onSurface + '88' }]}>
                Show in featured products section
              </Text>
            </View>
            <Switch
              value={formData.isFeatured}
              onValueChange={(value) => handleInputChange('isFeatured', value)}
              trackColor={{ false: '#767577', true: colors.primary + '44' }}
              thumbColor={formData.isFeatured ? colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.onSurface }]}>Tags</Text>
            <TextInput
              style={[styles.textInput, { borderColor: colors.primary + '44', color: colors.onBackground }]}
              value={formData.tags}
              onChangeText={(value) => handleInputChange('tags', value)}
              placeholder="organic, fresh, local (comma separated)"
              placeholderTextColor={colors.onSurface + '66'}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.cancelButton, { borderColor: colors.primary + '44' }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.cancelText, { color: colors.primary }]}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSaveProduct}
            disabled={loading}
          >
            <Text style={[styles.saveText, { color: colors.onPrimary }]}>
              {loading ? 'Saving...' : 'Add Product'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Category Picker Modal */}
      <Modal visible={showCategoryPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.onBackground }]}>Select Category</Text>
            <ScrollView style={styles.pickerList}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[styles.pickerItem, { borderBottomColor: colors.primary + '22' }]}
                  onPress={() => {
                    handleInputChange('category', category);
                    setShowCategoryPicker(false);
                  }}
                >
                  <Text style={[styles.pickerItemText, { color: colors.onBackground }]}>{category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity 
              style={[styles.modalCloseButton, { backgroundColor: colors.primary + '22' }]}
              onPress={() => setShowCategoryPicker(false)}
            >
              <Text style={[styles.modalCloseText, { color: colors.primary }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Unit Picker Modal */}
      <Modal visible={showUnitPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.onBackground }]}>Select Unit</Text>
            <ScrollView style={styles.pickerList}>
              {units.map((unit) => (
                <TouchableOpacity
                  key={unit}
                  style={[styles.pickerItem, { borderBottomColor: colors.primary + '22' }]}
                  onPress={() => {
                    handleInputChange('unit', unit);
                    setShowUnitPicker(false);
                  }}
                >
                  <Text style={[styles.pickerItemText, { color: colors.onBackground }]}>{unit}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity 
              style={[styles.modalCloseButton, { backgroundColor: colors.primary + '22' }]}
              onPress={() => setShowUnitPicker(false)}
            >
              <Text style={[styles.modalCloseText, { color: colors.primary }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Image Picker Modal */}
      <Modal visible={showImagePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.onBackground }]}>Add Product Image</Text>
            <View style={styles.imageOptions}>
              <TouchableOpacity 
                style={[styles.imageOption, { backgroundColor: colors.primary + '22' }]}
                onPress={() => handleImageSelection('camera')}
              >
                <Text style={styles.imageOptionIcon}>📷</Text>
                <Text style={[styles.imageOptionText, { color: colors.primary }]}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.imageOption, { backgroundColor: colors.primary + '22' }]}
                onPress={() => handleImageSelection('gallery')}
              >
                <Text style={styles.imageOptionIcon}>🖼️</Text>
                <Text style={[styles.imageOptionText, { color: colors.primary }]}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={[styles.modalCloseButton, { backgroundColor: colors.primary + '22' }]}
              onPress={() => setShowImagePicker(false)}
            >
              <Text style={[styles.modalCloseText, { color: colors.primary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

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
  draftButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  draftText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
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
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  pickerButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 16,
    flex: 1,
  },
  pickerIcon: {
    fontSize: 12,
    marginLeft: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchInfo: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  imageContainer: {
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  imageIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  imageText: {
    fontSize: 16,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
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
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerList: {
    maxHeight: 300,
  },
  pickerItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  pickerItemText: {
    fontSize: 16,
  },
  modalCloseButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '600',
  },
  imageOptions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  imageOption: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  imageOptionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  imageOptionText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
