import React, { useState, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Text, Image, Modal, TextInput, Pressable } from 'react-native';
import { Screen, Title } from '../../components/UI';
import { useTheme } from '../../theme/theme';
import { FloatingChatbotButton, ChatbotModal, ImageScanModal } from '../../components/UI';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../../context/CartContext';

const initialItems = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    price: 12.5,
    qty: 2,
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=500',
    note: 'Please select ripe ones',
  },
  {
    id: '2',
    name: 'Whole Wheat Bread',
    price: 8.0,
    qty: 1,
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=500',
    note: '',
  },
  {
    id: '3',
    name: 'Fresh Milk - 1L',
    price: 15.0,
    qty: 3,
    image: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=500',
    note: 'Check expiry date',
  },
];

function CartItemCard({ item, onDelete, onQuantityChanged }: any) {
  return (
    <View style={styles.itemCard}>
      <Image source={{ uri: item.imageUrl || item.image }} style={styles.itemImage} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemMeta}>{item.category}</Text>
        <Text style={styles.itemPrice}>GHS {item.price.toFixed(2)}<Text style={{ color: '#94a3b8', fontSize: 12 }}> / {item.unitLabel}</Text></Text>
      </View>
      <View style={styles.rightCol}>
        <TouchableOpacity style={styles.deleteIcon} onPress={onDelete}><Text style={{ color: 'white', fontWeight: '900' }}>×</Text></TouchableOpacity>
        <View style={styles.stepperChip}>
          <TouchableOpacity onPress={() => onQuantityChanged(Math.max(1, item.qty - 1))} style={styles.stepperBtn}><Text style={styles.stepperBtnText}>−</Text></TouchableOpacity>
          <Text style={styles.stepperQty}>{item.qty} {item.unitLabel}</Text>
          <TouchableOpacity onPress={() => onQuantityChanged(item.qty + 1)} style={styles.stepperBtn}><Text style={styles.stepperBtnText}>＋</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function PromoAndSummary({ subtotal, delivery, discount, onApplyCode }: any) {
  const [code, setCode] = useState('');
  const final = Math.max(0, subtotal + delivery - discount);
  return (
    <View style={styles.summaryCard}>
      <View style={styles.promoRow}>
        <TextInput
          style={styles.promoInput}
          placeholder="Enter Promo Code"
          value={code}
          onChangeText={setCode}
        />
        <TouchableOpacity style={styles.applyBtn} onPress={() => onApplyCode(code)}>
          <Text style={{ color: 'white', fontWeight: '800', fontSize: 16 }}>Apply</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 14, gap: 10 }}>
        <View style={styles.rowBetween}><Text style={styles.label}>Sub Total</Text><Text style={styles.value}>GHS {subtotal.toFixed(2)}</Text></View>
        <View style={styles.rowBetween}><Text style={styles.label}>Delivery Charges</Text><Text style={styles.value}>GHS {delivery.toFixed(2)}</Text></View>
        <View style={styles.rowBetween}><Text style={styles.label}>Discount</Text><Text style={[styles.value, { color: '#ef4444' }]}>− GHS {discount.toFixed(2)}</Text></View>
        <View style={styles.dashedDivider} />
        <View style={styles.rowBetween}><Text style={[styles.label, { fontWeight: '900' }]}>Final Total</Text><Text style={[styles.value, { fontWeight: '900' }]}>GHS {final.toFixed(2)}</Text></View>
      </View>
    </View>
  );
}

function EmptyCart({ onShop }: { onShop: () => void }) {
  return (
    <View style={styles.emptyCart}>
      <View style={styles.cartIconContainer}>
        <Text style={styles.cartIcon}>🛒</Text>
      </View>
      <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
      <Text style={styles.emptyCartSubtitle}>Add some items to get started</Text>
      <TouchableOpacity style={styles.startShoppingBtn} onPress={onShop}>
        <Text style={styles.startShoppingText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );
}

function CheckoutModal({ visible, onClose, onComplete }: any) {
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('cash');
  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.modalBg} onPress={onClose}>
        <View style={styles.modalContent}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>Checkout</Text>
          <TextInput
            style={styles.input}
            placeholder="Delivery Address"
            value={address}
            onChangeText={setAddress}
          />
          <Text style={{ marginTop: 12, marginBottom: 4, fontWeight: 'bold' }}>Payment Method</Text>
          <TouchableOpacity style={[styles.payBtn, payment === 'cash' && styles.payBtnActive]} onPress={() => setPayment('cash')}><Text>Cash on Delivery</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.payBtn, payment === 'card' && styles.payBtnActive]} onPress={() => setPayment('card')}><Text>Credit/Debit Card</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.payBtn, payment === 'momo' && styles.payBtnActive]} onPress={() => setPayment('momo')}><Text>Mobile Money</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.startShoppingBtn, { backgroundColor: '#2E7D32', marginTop: 18 }]} onPress={() => { onComplete({ address, payment }); onClose(); }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Place Order</Text>
        </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

export default function CartCheckout({ navigation }: any) {
  const { items, updateQty, removeItem } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const insets = useSafeAreaInsets();
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);
  const delivery = 2;
  const [discount, setDiscount] = useState(0);
  const total = Math.max(0, subtotal + delivery - discount);
  const [chatbotVisible, setChatbotVisible] = React.useState(false);
  const [imageScanVisible, setImageScanVisible] = React.useState(false);

  if (!items.length && !orderPlaced) {
    return <Screen><EmptyCart onShop={() => navigation.navigate('CustomerTabs', { screen: 'Home' })} />
      <FloatingChatbotButton onPress={() => setChatbotVisible(true)} />
      <ChatbotModal visible={chatbotVisible} onClose={() => setChatbotVisible(false)} />
    </Screen>;
  }

  return (
    <Screen>
      <Title>{orderPlaced ? 'Order Placed!' : 'Cart'}</Title>
      {orderPlaced ? (
        <View style={styles.orderPlacedBox}>
          <Text style={{ fontSize: 60, color: '#2E7D32' }}>✔️</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#2E7D32', marginTop: 8 }}>Your order has been placed!</Text>
                  <TouchableOpacity style={[styles.startShoppingBtn, { backgroundColor: '#2E7D32', marginTop: 18 }]} onPress={() => navigation.replace('CustomerHome')}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Back to Home</Text>
        </TouchableOpacity>
        </View>
      ) : (
        <>
      <FlatList
        style={{ marginTop: 12 }}
        contentContainerStyle={{ gap: 10, paddingBottom: insets.bottom + 160 }}
        data={items}
        keyExtractor={(i) => i.id.toString()}
            renderItem={({ item, index }) => (
               <CartItemCard
                item={item}
                 onDelete={() => removeItem(item.id)}
                 onQuantityChanged={(qty: number) => updateQty(item.id, qty)}
              />
            )}
        ListFooterComponent={() => (
          <PromoAndSummary
            subtotal={subtotal}
            delivery={delivery}
            discount={discount}
            onApplyCode={(code: string) => setDiscount(code.trim().toLowerCase() === 'save10' ? Math.min(10, subtotal * 0.1) : 0)}
          />
        )}
        keyboardShouldPersistTaps="handled"
          />
          <CheckoutModal
            visible={showCheckout}
            onClose={() => setShowCheckout(false)}
             onComplete={() => {
               setOrderPlaced(true);
             }}
          />
        </>
      )}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.totalAmount}>GHS {total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={() => navigation.navigate('Checkout', { subtotal, delivery, discount, total })}>
          <Text style={{ color: 'white', fontWeight: '800', fontSize: 18 }}>Checkout</Text>
        </TouchableOpacity>
      </View>
      <FloatingChatbotButton onPress={() => setChatbotVisible(true)} />
      <ChatbotModal visible={chatbotVisible} onClose={() => setChatbotVisible(false)} />
      <ImageScanModal 
        visible={imageScanVisible} 
        onClose={() => setImageScanVisible(false)} 
        onRecognized={() => setImageScanVisible(false)} 
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    gap: 8,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  itemName: { fontWeight: '800', fontSize: 15, color: '#111' },
  itemMeta: { color: '#64748b', fontSize: 12 },
  itemPrice: { color: '#16a34a', fontWeight: '800', marginTop: 2 },
  rightCol: { alignItems: 'flex-end', justifyContent: 'space-between', height: 60 },
  deleteIcon: { backgroundColor: '#ef4444', borderRadius: 12, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  stepperChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e5f7ea', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, gap: 8 },
  stepperBtn: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' },
  stepperBtnText: { color: '#16a34a', fontWeight: '900' },
  stepperQty: { fontWeight: '700', color: '#0f172a', fontSize: 12 },
  summaryCard: { backgroundColor: 'white', borderRadius: 18, padding: 16, margin: 12, gap: 10, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  promoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#f1f5f9', borderRadius: 16, padding: 10 },
  promoInput: { flex: 1, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16 },
  applyBtn: { backgroundColor: '#16a34a', paddingHorizontal: 22, paddingVertical: 12, borderRadius: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: '#334155', fontSize: 16 },
  value: { color: '#0f172a', fontWeight: '800', fontSize: 16 },
  dashedDivider: { borderBottomWidth: 1, borderStyle: 'dashed', borderBottomColor: '#e5e7eb', marginVertical: 6 },
  emptyCart: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 20,
    marginTop: 60 
  },
  cartIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed'
  },
  cartIcon: {
    fontSize: 48,
    color: '#94a3b8'
  },
  emptyCartTitle: {
    fontWeight: '800',
    fontSize: 24,
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center'
  },
  emptyCartSubtitle: {
    color: '#6b7280',
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22
  },
  startShoppingBtn: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 200
  },
  startShoppingText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5
  },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', borderRadius: 16, padding: 24, width: 320, alignItems: 'center' },
  payBtn: { backgroundColor: '#eee', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, marginTop: 6, width: 200, alignItems: 'center' },
  payBtnActive: { backgroundColor: '#C8E6C9' },
  orderPlacedBox: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  input: { borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 10, width: 220, marginTop: 8, backgroundColor: '#fafafa' },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 14, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', gap: 16, borderTopWidth: 2, borderTopColor: '#eef2f7' },
  totalLabel: { color: '#6b7280', fontSize: 14 },
  totalAmount: { color: '#16a34a', fontSize: 22, fontWeight: '900' },
  checkoutBtn: { backgroundColor: '#16a34a', borderRadius: 999, paddingHorizontal: 34, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
});


