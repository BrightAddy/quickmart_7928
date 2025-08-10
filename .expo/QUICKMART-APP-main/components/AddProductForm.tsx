import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Camera, Image as ImageIcon, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Product } from '@/types';

interface AddProductFormProps {
  storeId: string;
  product?: Product | null;
  onSubmit: (product: Product) => void;
  onCancel: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ storeId, product, onSubmit, onCancel }) => {
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price ? product.price.toString() : '');
  const [discountPrice, setDiscountPrice] = useState(product?.discountPrice ? product.discountPrice.toString() : '');
  const [category, setCategory] = useState(product?.category || '');
  const [quantity, setQuantity] = useState(product?.quantity ? product.quantity.toString() : '');
  const [unit, setUnit] = useState(product?.unit || '');
  const [image, setImage] = useState(product?.image || 'https://images.unsplash.com/photo-1580913428023-02c695666d61?q=80&w=200&auto=format&fit=crop');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'Product name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!price.trim()) newErrors.price = 'Price is required';
    else if (isNaN(Number(price)) || Number(price) <= 0) newErrors.price = 'Price must be a positive number';
    if (discountPrice.trim() && (isNaN(Number(discountPrice)) || Number(discountPrice) <= 0)) 
      newErrors.discountPrice = 'Discount price must be a positive number';
    if (!category.trim()) newErrors.category = 'Category is required';
    if (!quantity.trim()) newErrors.quantity = 'Quantity is required';
    else if (isNaN(Number(quantity)) || Number(quantity) < 0) newErrors.quantity = 'Quantity must be a non-negative number';
    if (!unit.trim()) newErrors.unit = 'Unit is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const productData: Product = {
      id: product?.id || `p${Date.now()}`,
      storeId,
      name,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      image,
      category,
      inStock: Number(quantity) > 0,
      unit,
      quantity: Number(quantity),
      verified: product?.verified || false,
    };
    
    onSubmit(productData);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageSection}>
        {image ? (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: image }} 
              style={styles.productImage}
              resizeMode="cover"
            />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={() => setImage('')}
            >
              <X size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <ImageIcon size={40} color={Colors.subtext} />
          </View>
        )}
        
        <TouchableOpacity style={styles.imageButton}>
          <Camera size={18} color={Colors.white} style={styles.imageButtonIcon} />
          <Text style={styles.imageButtonText}>
            {image ? 'Change Image' : 'Add Image'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Product Name*</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={name}
          onChangeText={setName}
          placeholder="Enter product name"
          placeholderTextColor={Colors.subtext}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Description*</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.description && styles.inputError]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter product description"
          placeholderTextColor={Colors.subtext}
          multiline
          numberOfLines={4}
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
      </View>
      
      <View style={styles.row}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Price (₵)*</Text>
          <TextInput
            style={[styles.input, errors.price && styles.inputError]}
            value={price}
            onChangeText={setPrice}
            placeholder="0.00"
            placeholderTextColor={Colors.subtext}
            keyboardType="numeric"
          />
          {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
        </View>
        
        <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Discount Price (₵)</Text>
          <TextInput
            style={[styles.input, errors.discountPrice && styles.inputError]}
            value={discountPrice}
            onChangeText={setDiscountPrice}
            placeholder="0.00"
            placeholderTextColor={Colors.subtext}
            keyboardType="numeric"
          />
          {errors.discountPrice && <Text style={styles.errorText}>{errors.discountPrice}</Text>}
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Category*</Text>
        <TextInput
          style={[styles.input, errors.category && styles.inputError]}
          value={category}
          onChangeText={setCategory}
          placeholder="e.g. Fresh Produce, Groceries, etc."
          placeholderTextColor={Colors.subtext}
        />
        {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
      </View>
      
      <View style={styles.row}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Quantity*</Text>
          <TextInput
            style={[styles.input, errors.quantity && styles.inputError]}
            value={quantity}
            onChangeText={setQuantity}
            placeholder="0"
            placeholderTextColor={Colors.subtext}
            keyboardType="numeric"
          />
          {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
        </View>
        
        <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Unit*</Text>
          <TextInput
            style={[styles.input, errors.unit && styles.inputError]}
            value={unit}
            onChangeText={setUnit}
            placeholder="e.g. kg, piece, pack"
            placeholderTextColor={Colors.subtext}
          />
          {errors.unit && <Text style={styles.errorText}>{errors.unit}</Text>}
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>
            {product ? 'Update Product' : 'Add Product'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.error,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  imageButtonIcon: {
    marginRight: 8,
  },
  imageButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputError: {
    borderColor: Colors.error,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.background,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    color: Colors.text,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    marginLeft: 8,
  },
  submitButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
});

export default AddProductForm;