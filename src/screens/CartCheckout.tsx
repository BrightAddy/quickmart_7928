import React, { useState, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Text, Image, Modal, TextInput, Pressable } from 'react-native';
import { Screen, Title, Body } from '../components/UI';
import { useTheme } from '../theme/theme';
import { FloatingChatbotButton, ChatbotModal, ImageUploadButton, ImageScanModal } from '../components/UI';

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

function CartItemCard({ item, onDelete, onQuantityChanged, onNoteChanged, onImageUpload }: any) {
  return (
    <View style={styles.itemCard}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>GHS {item.price.toFixed(2)}</Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => onQuantityChanged(Math.max(1, item.qty - 1))}><Text style={styles.qtyBtnText}>-</Text></TouchableOpacity>
          <Text style={styles.qtyText}>{item.qty}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => onQuantityChanged(item.qty + 1)}><Text style={styles.qtyBtnText}>+</Text></TouchableOpacity>
        </View>
        <TextInput
          style={styles.noteInput}
          placeholder="Add note (optional)"
          value={item.note}
          onChangeText={onNoteChanged}
        />
        <ImageUploadButton onPress={onImageUpload} style={{ alignSelf: 'flex-start', marginTop: 6 }} />
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}><Text style={{ color: 'white', fontWeight: 'bold' }}>×</Text></TouchableOpacity>
    </View>
  );
}

function OrderSummaryCard({ subtotal, delivery, total, onAddMore, onCheckout }: any) {
  return (
    <View style={styles.summaryCard}>
      <Body>Subtotal: GHS {subtotal.toFixed(2)}</Body>
      <Body>Delivery: GHS {delivery.toFixed(2)}</Body>
      <Title>Total: GHS {total.toFixed(2)}</Title>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
        <TouchableOpacity style={[styles.summaryBtn, { backgroundColor: '#eee' }]} onPress={onAddMore}>
          <Text style={{ color: '#2E7D32', fontWeight: 'bold' }}>Add More</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.summaryBtn, { backgroundColor: '#2E7D32' }]} onPress={onCheckout}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function EmptyCart({ onShop }: { onShop: () => void }) {
  return (
    <View style={styles.emptyCart}>
      <Text style={{ fontSize: 60, color: '#eee' }}>🛒</Text>
      <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#888', marginTop: 8 }}>Your cart is empty</Text>
      <Text style={{ color: '#aaa', marginTop: 4 }}>Add some items to get started</Text>
      <TouchableOpacity style={[styles.summaryBtn, { backgroundColor: '#2E7D32', marginTop: 18 }]} onPress={onShop}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Start Shopping</Text>
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
          <TouchableOpacity style={[styles.summaryBtn, { backgroundColor: '#2E7D32', marginTop: 18 }]} onPress={() => { onComplete({ address, payment }); onClose(); }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Place Order</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

export default function CartCheckout({ navigation }: any) {
  const [items, setItems] = useState(initialItems);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);
  const delivery = 5;
  const total = subtotal + delivery;
  const [chatbotVisible, setChatbotVisible] = React.useState(false);
  const [imageScanVisible, setImageScanVisible] = React.useState(false);

  if (!items.length && !orderPlaced) {
    return <Screen><EmptyCart onShop={() => navigation.replace('StoreBrowse')} />
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
          <TouchableOpacity style={[styles.summaryBtn, { backgroundColor: '#2E7D32', marginTop: 18 }]} onPress={() => navigation.replace('CustomerHome')}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
      <FlatList
        style={{ marginTop: 12 }}
        contentContainerStyle={{ gap: 10, paddingBottom: 16 }}
        data={items}
        keyExtractor={(i) => i.id}
            renderItem={({ item, index }) => (
              <CartItemCard
                item={item}
                onDelete={() => {
                  const newItems = [...items];
                  newItems.splice(index, 1);
                  setItems(newItems);
                }}
                onQuantityChanged={(qty: number) => {
                  const newItems = [...items];
                  newItems[index].qty = qty;
                  setItems(newItems);
                }}
                onNoteChanged={(note: string) => {
                  const newItems = [...items];
                  newItems[index].note = note;
                  setItems(newItems);
                }}
                onImageUpload={() => setImageScanVisible(true)}
              />
            )}
          />
          <OrderSummaryCard
            subtotal={subtotal}
            delivery={delivery}
            total={total}
            onAddMore={() => navigation.replace('StoreBrowse')}
            onCheckout={() => setShowCheckout(true)}
          />
          <CheckoutModal
            visible={showCheckout}
            onClose={() => setShowCheckout(false)}
            onComplete={() => {
              setItems([]);
              setOrderPlaced(true);
            }}
          />
        </>
      )}
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
    alignItems: 'flex-start',
    marginHorizontal: 8,
    gap: 8,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  itemName: { fontWeight: 'bold', fontSize: 16, color: '#222' },
  itemPrice: { color: '#2E7D32', fontWeight: 'bold', marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  qtyBtn: { backgroundColor: '#eee', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 2 },
  qtyBtnText: { fontWeight: 'bold', fontSize: 18, color: '#2E7D32' },
  qtyText: { fontWeight: 'bold', fontSize: 16, color: '#222', marginHorizontal: 4 },
  noteInput: { borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 6, marginTop: 8, fontSize: 13, backgroundColor: '#fafafa' },
  deleteBtn: { backgroundColor: '#D32F2F', borderRadius: 16, width: 28, height: 28, alignItems: 'center', justifyContent: 'center', marginLeft: 6, marginTop: 2 },
  summaryCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, margin: 12, gap: 4, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  summaryBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  emptyCart: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', borderRadius: 16, padding: 24, width: 320, alignItems: 'center' },
  payBtn: { backgroundColor: '#eee', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, marginTop: 6, width: 200, alignItems: 'center' },
  payBtnActive: { backgroundColor: '#C8E6C9' },
  orderPlacedBox: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  input: { borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 10, width: 220, marginTop: 8, backgroundColor: '#fafafa' },
});


