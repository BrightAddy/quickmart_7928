import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, TextInput, Alert, Animated, Image } from 'react-native';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';

interface Address {
  id: string;
  name: string;
  address: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  name: string;
  masked: string;
  logo?: string;
}

export default function Checkout({ route, navigation }: any) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { items, subtotal, deliveryFee, discount, total, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { subtotal: routeSubtotal = 0, delivery = 0, discount: routeDiscount = 0, total: routeTotal = 0 } = route?.params || {};

  // Use cart data if available, otherwise use route params
  const finalSubtotal = subtotal || routeSubtotal;
  const finalDelivery = deliveryFee || delivery;
  const finalDiscount = discount || routeDiscount;
  const finalTotal = total || routeTotal;

  const [selectedAddress, setSelectedAddress] = useState('home');
  const [selectedPayment, setSelectedPayment] = useState('momo');
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState('shop_for_me');
  const [editAddressModal, setEditAddressModal] = useState(false);
  const [editPaymentModal, setEditPaymentModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  const successAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const [addresses, setAddresses] = useState<Address[]>([
    { id: 'home', name: 'Home', address: 'House 10, Road 5, Block J, Baridhara, Dhaka, 1212' },
    { id: 'office', name: 'Office', address: 'Apartment B3, House 25, Road 10, Banani, Dhaka, 1213' },
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 'mc', type: 'card', name: 'Mastercard', masked: '**** 8940', logo: '💳' },
    { id: 'visa', type: 'card', name: 'Visacard', masked: '**** 7206', logo: '💳' },
    { id: 'momo', type: 'mobile', name: 'MTN MoMo', masked: '024 •• 92', logo: '📱' },
  ]);

  // Mock distance calculation (in real app, this would be calculated based on store and delivery address)
  const deliveryDistance = 2.5; // km

  const deliveryMethods = [
    { 
      id: 'shop_for_me', 
      name: 'Shop for Me', 
      emoji: '🛒', 
      description: 'Our shopper will buy your items and deliver them',
      estimatedTime: '30-45 mins',
      recommended: true,
      disabled: false,
      details: 'Shopper visits store, selects items, and delivers to you'
    },
    { 
      id: 'pick_and_drop', 
      name: 'Pick and Drop', 
      emoji: '📦', 
      description: 'You\'ve already shopped, we\'ll just pick up and deliver',
      estimatedTime: '15-25 mins',
      recommended: false,
      disabled: false,
      details: 'Quick pickup from your location and delivery to destination'
    }
  ];

  const showSuccessAnimation = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessDialog(true);
    
    Animated.parallel([
      Animated.timing(successAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.timing(successAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowSuccessDialog(false);
        scaleAnim.setValue(0);
      });
    }, 2000);
  };

  const handlePayment = () => {
    // Get selected address and payment method
    const selectedAddressData = addresses.find(addr => addr.id === selectedAddress);
    const selectedPaymentData = paymentMethods.find(pay => pay.id === selectedPayment);
    
    if (!selectedAddressData || !selectedPaymentData) {
      Alert.alert('Error', 'Please select an address and payment method');
      return;
    }

    // Create order from cart items
    const orderItems = items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: item.qty,
      unitLabel: item.unitLabel,
      imageUrl: item.imageUrl
    }));

    // Get selected delivery method
    const selectedDeliveryMethodData = deliveryMethods.find(method => method.id === selectedDeliveryMethod);
    
    // Add order to context
    addOrder({
      items: orderItems,
      subtotal: finalSubtotal,
      deliveryFee: finalDelivery,
      discount: finalDiscount,
      total: finalTotal,
      store: 'Kofi\'s Fresh Market', // This could be dynamic based on the store
      address: selectedAddressData.address,
      paymentMethod: selectedPaymentData.name,
      deliveryMethod: selectedDeliveryMethodData?.name || 'Shop for Me',
      deliveryMethodEmoji: selectedDeliveryMethodData?.emoji || '🛒',
      estimatedDeliveryTime: selectedDeliveryMethodData?.estimatedTime || '30-45 mins',
      status: 'pending'
    });

    // Clear cart after successful order
    clearCart();
    
    setShowOrderSuccess(true);
  };

  const handleTrackOrder = () => {
    setShowOrderSuccess(false);
    navigation.navigate('CustomerTabs', { screen: 'Orders' });
  };

  const handleGoBack = () => {
    setShowOrderSuccess(false);
    navigation.navigate('CustomerTabs', { screen: 'Home' });
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setEditAddressModal(true);
  };

  const handleEditPayment = (payment: PaymentMethod) => {
    setEditingPayment(payment);
    setEditPaymentModal(true);
  };

  const handleAddNewAddress = () => {
    const newAddress: Address = {
      id: `address_${Date.now()}`,
      name: 'New Address',
      address: 'Enter address details'
    };
    setAddresses([...addresses, newAddress]);
    setEditingAddress(newAddress);
    setEditAddressModal(true);
  };

  const handleAddNewPayment = () => {
    const newPayment: PaymentMethod = {
      id: `payment_${Date.now()}`,
      type: 'mobile',
      name: 'Telecel Cash',
      masked: '024 •• ••',
      logo: '📱'
    };
    setPaymentMethods([...paymentMethods, newPayment]);
    setEditingPayment(newPayment);
    setEditPaymentModal(true);
  };

  const saveAddress = (address: Address) => {
    setAddresses(addresses.map(addr => addr.id === address.id ? address : addr));
    setEditAddressModal(false);
    setEditingAddress(null);
    showSuccessAnimation('Address saved successfully!');
  };

  const savePayment = (payment: PaymentMethod) => {
    setPaymentMethods(paymentMethods.map(pay => pay.id === payment.id ? payment : pay));
    setEditPaymentModal(false);
    setEditingPayment(null);
    showSuccessAnimation('Payment method saved successfully!');
  };

  const deleteAddress = (addressId: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAddresses(addresses.filter(addr => addr.id !== addressId));
            if (selectedAddress === addressId) {
              setSelectedAddress(addresses[0]?.id || '');
            }
            setEditAddressModal(false);
            setEditingAddress(null);
            showSuccessAnimation('Address deleted successfully!');
          }
        }
      ]
    );
  };

  const deletePayment = (paymentId: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(paymentMethods.filter(pay => pay.id !== paymentId));
            if (selectedPayment === paymentId) {
              setSelectedPayment(paymentMethods[0]?.id || '');
            }
            setEditPaymentModal(false);
            setEditingPayment(null);
            showSuccessAnimation('Payment method deleted successfully!');
          }
        }
      ]
    );
  };

  const orderNumber = Math.floor(Math.random() * 9000000) + 1000000;

  return (
    <Screen style={{ padding: 0 }}>
      <View style={[styles.header, { paddingTop: insets.top + 6, backgroundColor: colors.primary }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.headerBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: 'white' }]}>Checkout</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 160 }} showsVerticalScrollIndicator={false}>
        {/* Address */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <View style={styles.rowBetween}>
            <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Address</Text>
            <TouchableOpacity onPress={handleAddNewAddress}>
              <Text style={{ color: colors.primary, fontWeight: '700' }}>Add New</Text>
            </TouchableOpacity>
          </View>
          <View style={{ gap: 12, marginTop: 12 }}>
            {addresses.map((address) => (
              <View key={address.id} style={{ position: 'relative' }}>
                <TouchableOpacity
                  onPress={() => setSelectedAddress(address.id)}
                  style={[
                    styles.addressCard, 
                    { 
                      backgroundColor: colors.surface, 
                      borderColor: selectedAddress === address.id ? colors.primary : '#e5e7eb',
                      borderWidth: selectedAddress === address.id ? 2 : 1
                    }
                  ]}
                >
                  <View style={styles.rowBetween}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <View style={[
                        styles.radioButton,
                        { 
                          backgroundColor: selectedAddress === address.id ? colors.primary : 'transparent',
                          borderColor: selectedAddress === address.id ? colors.primary : '#d1d5db'
                        }
                      ]}>
                        {selectedAddress === address.id && <Text style={{ color: 'white', fontSize: 12 }}>✓</Text>}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.addressTitle, { color: colors.onBackground }]}>{address.name}</Text>
                        <Text style={[styles.addressMeta, { color: colors.onSurface + '88' }]}>{address.address}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.editBtnAbsolute, { backgroundColor: colors.primary + '15' }]}
                  onPress={() => handleEditAddress(address)}
                >
                  <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600' }}>Edit</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Order Items */}
        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Order Items</Text>
          <View style={{ gap: 12, marginTop: 12 }}>
            {items.map((item) => (
              <View key={item.id} style={[styles.orderItemCard, { backgroundColor: colors.surface, borderColor: colors.primary + '22' }]}>
                <Image source={{ uri: item.imageUrl }} style={styles.orderItemImage} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.orderItemName, { color: colors.onSurface }]}>{item.name}</Text>
                  <Text style={[styles.orderItemCategory, { color: colors.onSurface + '66' }]}>{item.category}</Text>
                  <Text style={[styles.orderItemPrice, { color: colors.primary }]}>
                    GHS {item.price.toFixed(2)} × {item.qty} {item.unitLabel}
                  </Text>
                </View>
                <View style={styles.orderItemRight}>
                  <Text style={[styles.orderItemTotal, { color: colors.onSurface }]}>
                    GHS {(item.price * item.qty).toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Payment */}
        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          <View style={styles.rowBetween}>
            <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Payment</Text>
            <TouchableOpacity onPress={handleAddNewPayment}>
              <Text style={{ color: colors.primary, fontWeight: '700' }}>Add New</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ gap: 12, paddingTop: 12, paddingBottom: 8 }}
          >
            {paymentMethods.map((payment) => (
              <PaymentCard 
                key={payment.id}
                payment={payment}
                selected={selectedPayment === payment.id}
                onPress={() => setSelectedPayment(payment.id)}
                onEdit={() => handleEditPayment(payment)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Delivery Method Selection */}
        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Delivery Method</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.onSurface + '88' }]}>
            Choose how you'd like your order to be handled
          </Text>
          <View style={{ gap: 12, marginTop: 12 }}>
            {deliveryMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => !method.disabled && setSelectedDeliveryMethod(method.id)}
                disabled={method.disabled}
                style={[
                  styles.deliveryMethodCard,
                  {
                    backgroundColor: method.disabled ? colors.surface + '50' : colors.surface,
                    borderColor: selectedDeliveryMethod === method.id ? colors.primary : '#e5e7eb',
                    borderWidth: selectedDeliveryMethod === method.id ? 2 : 1,
                    opacity: method.disabled ? 0.5 : 1
                  }
                ]}
              >
                <View style={styles.deliveryMethodLeft}>
                  <View style={styles.deliveryMethodIcon}>
                    <Text style={styles.deliveryMethodEmoji}>{method.emoji}</Text>
                  </View>
                  <View style={styles.deliveryMethodInfo}>
                    <View style={styles.deliveryMethodHeader}>
                      <Text style={[styles.deliveryMethodName, { color: colors.onBackground }]}>
                        {method.name}
                      </Text>
                      {method.recommended && (
                        <View style={[styles.recommendedBadge, { backgroundColor: colors.primary }]}>
                          <Text style={[styles.recommendedText, { color: colors.onPrimary }]}>Recommended</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.deliveryMethodDescription, { color: colors.onSurface + '88' }]}>
                      {method.description}
                    </Text>
                    <Text style={[styles.deliveryMethodDetails, { color: colors.onSurface + '66' }]}>
                      {method.details}
                    </Text>
                    <Text style={[styles.deliveryMethodTime, { color: colors.primary }]}>
                      ETA: {method.estimatedTime}
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.deliveryMethodRadio,
                  {
                    backgroundColor: selectedDeliveryMethod === method.id ? colors.primary : 'transparent',
                    borderColor: selectedDeliveryMethod === method.id ? colors.primary : '#d1d5db'
                  }
                ]}>
                  {selectedDeliveryMethod === method.id && <Text style={{ color: 'white', fontSize: 12 }}>✓</Text>}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16, borderTopColor: colors.primary + '22', backgroundColor: colors.surface }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={[styles.totalAmount, { color: colors.primary }]}>GHS {Number(finalTotal).toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.payBtn, { backgroundColor: colors.primary }]} 
          onPress={handlePayment}
        >
          <Text style={{ color: colors.onPrimary, fontWeight: '800' }}>Payment</Text>
        </TouchableOpacity>
      </View>

      {/* Success Animation Dialog */}
      <Animated.View 
        style={[
          styles.successDialog,
          {
            opacity: successAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: successAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })}
            ]
          }
        ]}
        pointerEvents="none"
      >
        <View style={[styles.successContent, { backgroundColor: colors.primary }]}>
          <Text style={{ fontSize: 24, marginBottom: 8 }}>✅</Text>
          <Text style={{ color: colors.onPrimary, fontWeight: '600', textAlign: 'center' }}>{successMessage}</Text>
        </View>
      </Animated.View>

      {/* Order Success Modal */}
      <Modal visible={showOrderSuccess} animationType="fade" transparent>
        <View style={styles.orderSuccessOverlay}>
          <View style={styles.orderSuccessContent}>
            {/* Success Icon with Stars */}
            <View style={styles.successIconContainer}>
              <Text style={styles.starIcon}>⭐</Text>
              <View style={[styles.checkmarkCircle, { backgroundColor: colors.primary }]}>
                <Text style={styles.checkmarkIcon}>✓</Text>
              </View>
              <Text style={styles.starIcon}>⭐</Text>
            </View>
            
            {/* Title */}
            <Text style={styles.orderSuccessTitle}>Order Successfull</Text>
            
            {/* Order Number */}
            <Text style={styles.orderNumberText}>Your order #{orderNumber} is successfully placed</Text>
            
            {/* Action Buttons */}
            <View style={styles.orderSuccessButtons}>
              <TouchableOpacity 
                style={[styles.trackOrderBtn, { backgroundColor: colors.primary }]}
                onPress={handleTrackOrder}
              >
                <Text style={[styles.trackOrderText, { color: colors.onPrimary }]}>Track My Order</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.goBackBtn, { borderColor: colors.primary }]}
                onPress={handleGoBack}
              >
                <Text style={[styles.goBackText, { color: colors.primary }]}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Address Edit Modal */}
      <AddressEditModal
        visible={editAddressModal}
        address={editingAddress}
        onSave={saveAddress}
        onDelete={deleteAddress}
        onClose={() => setEditAddressModal(false)}
        colors={colors}
      />

      {/* Payment Edit Modal */}
      <PaymentEditModal
        visible={editPaymentModal}
        payment={editingPayment}
        onSave={savePayment}
        onDelete={deletePayment}
        onClose={() => setEditPaymentModal(false)}
        colors={colors}
      />
    </Screen>
  );
}

const PaymentCard: React.FC<{ 
  payment: PaymentMethod; 
  selected: boolean; 
  onPress: () => void;
  onEdit: () => void;
}> = ({ payment, selected, onPress, onEdit }) => (
  <TouchableOpacity 
    onPress={onPress} 
    style={[
      styles.payCard, 
      { 
        borderColor: selected ? '#16a34a' : '#e5e7eb', 
        backgroundColor: selected ? '#16a34a22' : 'white',
        borderWidth: selected ? 2 : 1
      }
    ]}
  > 
    <View style={styles.payCardHeader}>
      <Text style={{ fontSize: 20 }}>{payment.logo}</Text>
      <TouchableOpacity 
        onPress={onEdit} 
        style={[styles.editBtn, { backgroundColor: '#16a34a15' }]}
      >
        <Text style={{ color: '#16a34a', fontSize: 12, fontWeight: '600' }}>Edit</Text>
      </TouchableOpacity>
    </View>
    <Text style={{ fontWeight: '800', color: '#0f172a', fontSize: 14 }}>{payment.name}</Text>
    <Text style={{ color: '#64748b', marginTop: 4, fontSize: 12 }}>{payment.masked}</Text>
    <View style={[
      styles.paymentRadio,
      { 
        backgroundColor: selected ? '#16a34a' : 'transparent',
        borderColor: selected ? '#16a34a' : '#d1d5db'
      }
    ]}>
      {selected && <Text style={{ color: 'white', fontSize: 10 }}>✓</Text>}
    </View>
  </TouchableOpacity>
);

const AddressEditModal: React.FC<{
  visible: boolean;
  address: Address | null;
  onSave: (address: Address) => void;
  onDelete: (addressId: string) => void;
  onClose: () => void;
  colors: any;
}> = ({ visible, address, onSave, onDelete, onClose, colors }) => {
  const [name, setName] = useState('');
  const [addressText, setAddressText] = useState('');

  React.useEffect(() => {
    if (address) {
      setName(address.name);
      setAddressText(address.address);
    }
  }, [address]);

  const handleSave = () => {
    if (address && name.trim() && addressText.trim()) {
      onSave({ ...address, name: name.trim(), address: addressText.trim() });
    }
  };

  const handleDelete = () => {
    if (address) {
      onDelete(address.id);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <Text style={[styles.modalTitle, { color: colors.onBackground }]}>Edit Address</Text>
          <TextInput
            style={[styles.modalInput, { borderColor: colors.primary + '44', color: colors.onBackground }]}
            placeholder="Address Name"
            placeholderTextColor={colors.onSurface + '66'}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.modalInput, { borderColor: colors.primary + '44', color: colors.onBackground }]}
            placeholder="Full Address"
            placeholderTextColor={colors.onSurface + '66'}
            value={addressText}
            onChangeText={setAddressText}
            multiline
            numberOfLines={3}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.deleteBtn, { borderColor: '#ef4444' }]} 
              onPress={handleDelete}
            >
              <Text style={{ color: '#ef4444', fontWeight: '600' }}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={{ color: colors.onSurface }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.saveBtn, { backgroundColor: colors.primary }]} 
              onPress={handleSave}
            >
              <Text style={{ color: colors.onPrimary, fontWeight: '600' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const PaymentEditModal: React.FC<{
  visible: boolean;
  payment: PaymentMethod | null;
  onSave: (payment: PaymentMethod) => void;
  onDelete: (paymentId: string) => void;
  onClose: () => void;
  colors: any;
}> = ({ visible, payment, onSave, onDelete, onClose, colors }) => {
  const [name, setName] = useState('');
  const [masked, setMasked] = useState('');

  React.useEffect(() => {
    if (payment) {
      setName(payment.name);
      setMasked(payment.masked);
    }
  }, [payment]);

  const handleSave = () => {
    if (payment && name.trim() && masked.trim()) {
      onSave({ ...payment, name: name.trim(), masked: masked.trim() });
    }
  };

  const handleDelete = () => {
    if (payment) {
      onDelete(payment.id);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <Text style={[styles.modalTitle, { color: colors.onBackground }]}>Edit Payment Method</Text>
          <TextInput
            style={[styles.modalInput, { borderColor: colors.primary + '44', color: colors.onBackground }]}
            placeholder="Payment Name"
            placeholderTextColor={colors.onSurface + '66'}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.modalInput, { borderColor: colors.primary + '44', color: colors.onBackground }]}
            placeholder="Card/Number (e.g., **** 1234)"
            placeholderTextColor={colors.onSurface + '66'}
            value={masked}
            onChangeText={setMasked}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.deleteBtn, { borderColor: '#ef4444' }]} 
              onPress={handleDelete}
            >
              <Text style={{ color: '#ef4444', fontWeight: '600' }}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={{ color: colors.onSurface }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.saveBtn, { backgroundColor: colors.primary }]} 
              onPress={handleSave}
            >
              <Text style={{ color: colors.onPrimary, fontWeight: '600' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: { 
    paddingHorizontal: 8, 
    paddingBottom: 10, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  headerBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  headerBtnText: { 
    fontSize: 18, 
    color: 'white', 
    fontWeight: '700' 
  },
  headerTitle: { 
    fontSize: 16, 
    fontWeight: '800' 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '800' 
  },
  rowBetween: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  addressCard: { 
    borderRadius: 16, 
    padding: 16,
    minHeight: 80
  },
  addressTitle: { 
    fontWeight: '800', 
    fontSize: 16,
    marginBottom: 4
  },
  addressMeta: { 
    fontSize: 14, 
    lineHeight: 20 
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  editBtnAbsolute: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'transparent',
    zIndex: 10
  },
  payCard: { 
    width: 160, 
    borderRadius: 16, 
    padding: 16, 
    alignItems: 'flex-start',
    minHeight: 120
  },
  payCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8
  },
  paymentRadio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  },
  bottomBar: { 
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom: 0, 
    paddingHorizontal: 20, 
    paddingTop: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 16, 
    borderTopWidth: 1 
  },
  totalLabel: { 
    color: '#6b7280', 
    fontSize: 14 
  },
  totalAmount: { 
    fontSize: 24, 
    fontWeight: '900' 
  },
  payBtn: { 
    paddingHorizontal: 32, 
    paddingVertical: 16, 
    borderRadius: 999, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  successDialog: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  successContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 200,
    maxWidth: 280
  },
  orderSuccessOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  orderSuccessContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    minWidth: 300,
    maxWidth: 350
  },
  successIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24
  },
  starIcon: {
    fontSize: 20,
    marginHorizontal: 8
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12
  },
  checkmarkIcon: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold'
  },
  orderSuccessTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center'
  },
  orderNumberText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22
  },
  orderSuccessButtons: {
    width: '100%',
    gap: 12
  },
  trackOrderBtn: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  trackOrderText: {
    fontSize: 16,
    fontWeight: '700'
  },
  goBackBtn: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    backgroundColor: 'white'
  },
  goBackText: {
    fontSize: 16,
    fontWeight: '600'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    gap: 16
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center'
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8
  },
  deleteBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  saveBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  orderItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  orderItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  orderItemCategory: {
    fontSize: 12,
    marginBottom: 4,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderItemRight: {
    alignItems: 'flex-end',
  },
  orderItemTotal: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20
  },
  deliveryMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 100
  },
  deliveryMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  deliveryMethodIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  deliveryMethodEmoji: {
    fontSize: 24
  },
  deliveryMethodInfo: {
    flex: 1
  },
  deliveryMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  deliveryMethodName: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8
  },
  recommendedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '600'
  },
  deliveryMethodDescription: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '500'
  },
  deliveryMethodDetails: {
    fontSize: 12,
    marginBottom: 4,
    fontStyle: 'italic'
  },
  deliveryMethodTime: {
    fontSize: 12,
    fontWeight: '600'
  },
  deliveryMethodRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12
  }
});



