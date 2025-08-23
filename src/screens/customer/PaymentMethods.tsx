import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from 'react-native';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PaymentMethod {
  id: string;
  type: 'mobile' | 'card' | 'cash';
  name: string;
  masked: string;
  logo: string;
  isDefault: boolean;
  isActive: boolean;
}

export default function PaymentMethods({ navigation }: any) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'mobile',
      name: 'MTN MoMo',
      masked: '024 •• 92',
      logo: '📱',
      isDefault: true,
      isActive: true
    },
    {
      id: '2',
      type: 'mobile',
      name: 'Vodafone Cash',
      masked: '050 •• 45',
      logo: '📲',
      isDefault: false,
      isActive: true
    },
    {
      id: '3',
      type: 'card',
      name: 'Mastercard',
      masked: '**** 8940',
      logo: '💳',
      isDefault: false,
      isActive: true
    },
    {
      id: '4',
      type: 'card',
      name: 'Visa Card',
      masked: '**** 7206',
      logo: '💳',
      isDefault: false,
      isActive: true
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    type: 'mobile' as 'mobile' | 'card' | 'cash',
    name: '',
    masked: '',
    logo: '📱'
  });

  const handleAddPayment = () => {
    if (!formData.name.trim() || !formData.masked.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: formData.type,
      name: formData.name.trim(),
      masked: formData.masked.trim(),
      logo: formData.logo,
      isDefault: false,
      isActive: true
    };

    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddModal(false);
    setFormData({ type: 'mobile', name: '', masked: '', logo: '📱' });
    
    Alert.alert('Success', 'Payment method added successfully!');
  };

  const handleEditPayment = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      type: method.type,
      name: method.name,
      masked: method.masked,
      logo: method.logo
    });
    setShowAddModal(true);
  };

  const handleUpdatePayment = () => {
    if (!editingMethod || !formData.name.trim() || !formData.masked.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setPaymentMethods(paymentMethods.map(method => 
      method.id === editingMethod.id 
        ? { ...method, name: formData.name.trim(), masked: formData.masked.trim(), logo: formData.logo }
        : method
    ));

    setShowAddModal(false);
    setEditingMethod(null);
    setFormData({ type: 'mobile', name: '', masked: '', logo: '📱' });
    
    Alert.alert('Success', 'Payment method updated successfully!');
  };

  const handleDeletePayment = (methodId: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(paymentMethods.filter(method => method.id !== methodId));
            Alert.alert('Success', 'Payment method deleted successfully!');
          }
        }
      ]
    );
  };

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === methodId
    })));
  };

  const handleToggleActive = (methodId: string) => {
    setPaymentMethods(paymentMethods.map(method => 
      method.id === methodId 
        ? { ...method, isActive: !method.isActive }
        : method
    ));
  };

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case 'mobile': return '📱';
      case 'card': return '💳';
      case 'cash': return '💵';
      default: return '💰';
    }
  };

  const PaymentMethodCard = ({ method }: { method: PaymentMethod }) => (
    <View style={[
      styles.paymentCard,
      { 
        borderColor: method.isDefault ? colors.primary : colors.primary + '22',
        backgroundColor: method.isActive ? 'white' : '#f8f9fa',
        opacity: method.isActive ? 1 : 0.6
      }
    ]}>
      <View style={styles.paymentCardHeader}>
        <View style={styles.paymentCardLeft}>
          <Text style={styles.paymentLogo}>{method.logo}</Text>
          <View style={styles.paymentInfo}>
            <Text style={[styles.paymentName, { color: colors.onBackground }]}>{method.name}</Text>
            <Text style={[styles.paymentMasked, { color: colors.onSurface + '88' }]}>{method.masked}</Text>
          </View>
        </View>
        
        <View style={styles.paymentCardRight}>
          {method.isDefault && (
            <View style={[styles.defaultBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
          <View style={styles.paymentActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleToggleActive(method.id)}
            >
              <Text style={styles.actionButtonText}>
                {method.isActive ? '🟢' : '🔴'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleEditPayment(method)}
            >
              <Text style={styles.actionButtonText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleDeletePayment(method.id)}
            >
              <Text style={styles.actionButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {!method.isDefault && method.isActive && (
        <TouchableOpacity 
          style={[styles.setDefaultButton, { borderColor: colors.primary }]}
          onPress={() => handleSetDefault(method.id)}
        >
          <Text style={[styles.setDefaultText, { color: colors.primary }]}>Set as Default</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <Screen style={{ flex: 1 }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.primary }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Add Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Quick Add</Text>
          <View style={styles.quickAddContainer}>
            <TouchableOpacity 
              style={[styles.quickAddButton, { borderColor: colors.primary + '44' }]}
              onPress={() => {
                setFormData({ type: 'mobile', name: 'MTN MoMo', masked: '', logo: '📱' });
                setShowAddModal(true);
              }}
            >
              <Text style={styles.quickAddIcon}>📱</Text>
              <Text style={[styles.quickAddText, { color: colors.onBackground }]}>MTN MoMo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickAddButton, { borderColor: colors.primary + '44' }]}
              onPress={() => {
                setFormData({ type: 'mobile', name: 'Vodafone Cash', masked: '', logo: '📲' });
                setShowAddModal(true);
              }}
            >
              <Text style={styles.quickAddIcon}>📲</Text>
              <Text style={[styles.quickAddText, { color: colors.onBackground }]}>Vodafone Cash</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickAddButton, { borderColor: colors.primary + '44' }]}
              onPress={() => {
                setFormData({ type: 'card', name: 'Credit/Debit Card', masked: '', logo: '💳' });
                setShowAddModal(true);
              }}
            >
              <Text style={styles.quickAddIcon}>💳</Text>
              <Text style={[styles.quickAddText, { color: colors.onBackground }]}>Card</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Saved Payment Methods */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
            Saved Payment Methods ({paymentMethods.filter(m => m.isActive).length})
          </Text>
          
          {paymentMethods.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💳</Text>
              <Text style={[styles.emptyTitle, { color: colors.onBackground }]}>No Payment Methods</Text>
              <Text style={[styles.emptySubtitle, { color: colors.onSurface + '88' }]}>
                Add a payment method to get started
              </Text>
            </View>
          ) : (
            paymentMethods.map(method => (
              <PaymentMethodCard key={method.id} method={method} />
            ))
          )}
        </View>

        {/* Security Note */}
        <View style={[styles.securityNote, { backgroundColor: colors.primary + '10' }]}>
          <Text style={styles.securityIcon}>🔒</Text>
          <View style={styles.securityText}>
            <Text style={[styles.securityTitle, { color: colors.onBackground }]}>Secure & Encrypted</Text>
            <Text style={[styles.securitySubtitle, { color: colors.onSurface + '88' }]}>
              Your payment information is securely stored and encrypted
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.onBackground }]}>
              {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.onBackground }]}>Payment Type</Text>
              <View style={styles.typeSelector}>
                {[
                  { type: 'mobile', label: 'Mobile Money', icon: '📱' },
                  { type: 'card', label: 'Card', icon: '💳' },
                  { type: 'cash', label: 'Cash', icon: '💵' }
                ].map(option => (
                  <TouchableOpacity
                    key={option.type}
                    style={[
                      styles.typeOption,
                      { 
                        backgroundColor: formData.type === option.type ? colors.primary : colors.background,
                        borderColor: colors.primary + '44'
                      }
                    ]}
                    onPress={() => setFormData({ ...formData, type: option.type as any, logo: option.icon })}
                  >
                    <Text style={styles.typeIcon}>{option.icon}</Text>
                    <Text style={[
                      styles.typeLabel,
                      { color: formData.type === option.type ? colors.onPrimary : colors.onBackground }
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.onBackground }]}>Payment Name</Text>
              <TextInput
                style={[styles.textInput, { 
                  borderColor: colors.primary + '44', 
                  color: colors.onBackground,
                  backgroundColor: colors.background
                }]}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="e.g., MTN MoMo, Mastercard"
                placeholderTextColor={colors.onSurface + '66'}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.onBackground }]}>
                {formData.type === 'mobile' ? 'Phone Number' : 'Card Number'}
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  borderColor: colors.primary + '44', 
                  color: colors.onBackground,
                  backgroundColor: colors.background
                }]}
                value={formData.masked}
                onChangeText={(text) => setFormData({ ...formData, masked: text })}
                placeholder={formData.type === 'mobile' ? '024 123 4567' : '**** **** **** 1234'}
                placeholderTextColor={colors.onSurface + '66'}
                keyboardType={formData.type === 'mobile' ? 'phone-pad' : 'numeric'}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.primary + '44' }]}
                onPress={() => {
                  setShowAddModal(false);
                  setEditingMethod(null);
                  setFormData({ type: 'mobile', name: '', masked: '', logo: '📱' });
                }}
              >
                <Text style={[styles.modalButtonText, { color: colors.onBackground }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={editingMethod ? handleUpdatePayment : handleAddPayment}
              >
                <Text style={[styles.modalButtonText, { color: colors.onPrimary }]}>
                  {editingMethod ? 'Update' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#16a34a',
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quickAddContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAddButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  quickAddIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickAddText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  paymentCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  paymentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentLogo: {
    fontSize: 24,
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  paymentMasked: {
    fontSize: 14,
  },
  paymentCardRight: {
    alignItems: 'flex-end',
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  defaultBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  paymentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
  },
  setDefaultButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  setDefaultText: {
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
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  securityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  securityText: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  securitySubtitle: {
    fontSize: 14,
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
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  typeOption: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  saveButton: {
    borderColor: 'transparent',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});


