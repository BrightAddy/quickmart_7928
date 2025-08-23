import React, { useMemo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../../context/CartContext';
import { Product } from '../../context/ProductsContext';

export default function ProductDetails({ route, navigation }: any) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const product: Product = route?.params?.product || {};
  const { addItem } = useCart();
  const [qty, setQty] = useState<number>(1);
  const [fav, setFav] = useState(false);
  const canDecrease = qty > 1;
  const total = useMemo(() => (product?.price || 0) * qty, [product?.price, qty]);

  const displayImage = product?.image || 'https://via.placeholder.com/600x400.png?text=Product';
  const weight = product?.unitLabel || '1000 gm';
  const rating = product?.rating ?? 4.5;
  const description = product?.description ||
    '100% satisfaction guarantee. If you experience any of the following issues, missing, poor item, late arrival, unprofessional service, please let us know and we will make it right.';

  return (
    <Screen style={{ padding: 0 }}>
      <View style={[
        styles.header,
        { backgroundColor: colors.primary, borderBottomColor: colors.primary, paddingTop: insets.top + 6 }
      ]}> 
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.headerBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: 'white' }]}>Product Details</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('CartCheckout')}>
          <Text style={styles.headerBtnText}>🛒</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}
      >
        <View style={styles.imageWrap}>
          <Image source={{ uri: displayImage }} style={styles.image} />
          <TouchableOpacity onPress={() => setFav((f) => !f)} style={[styles.favBtn, { backgroundColor: colors.surface }]}> 
            <Text style={{ fontSize: 18 }}>{fav ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          <Text style={[styles.name, { color: colors.onBackground }]}>{product?.name || 'Product'}</Text>
          <Text style={{ color: colors.onSurface + '88', marginTop: 2 }}>1000 gm</Text>

          <View style={styles.rowBetween}>
            <Text style={[styles.price, { color: colors.onBackground }]}>GHS {Number(product?.price || 0).toFixed(2)}</Text>
            <View style={styles.inlineRow}>
              <Text style={{ fontSize: 10, color: colors.onSurface + '88', marginRight: 6 }}>Available on fast delivery</Text>
              <Text>⚡</Text>
            </View>
          </View>

          <View style={[styles.rowBetween, { marginTop: 10 }]}> 
            <View style={styles.inlineRow}>
              <Text style={styles.colorDot}>🟣</Text>
              <Text style={styles.colorDot}>🟠</Text>
              <Text style={styles.colorDot}>🔵</Text>
            </View>
            <View style={styles.inlineRow}>
              <Text style={{ marginRight: 6 }}>⭐</Text>
              <Text style={{ color: colors.onSurface + '88' }}>{rating.toFixed(1)} Rating</Text>
            </View>
          </View>

          <View style={[styles.divider, { borderBottomColor: colors.primary + '22' }]} />

          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>About</Text>
          <Text numberOfLines={4} style={{ color: colors.onSurface + 'AA', lineHeight: 20 }}>
            {description}
          </Text>
        </View>
      </ScrollView>

      <View style={[
        styles.bottomBar,
        { borderTopColor: colors.primary + '22', backgroundColor: colors.surface, paddingBottom: insets.bottom + 8 }
      ]}> 
        <View style={styles.stepper}>
          <TouchableOpacity
            onPress={() => canDecrease && setQty((q) => Math.max(1, q - 1))}
            disabled={!canDecrease}
            style={[styles.stepBtn, { opacity: canDecrease ? 1 : 0.5, borderColor: colors.primary }]}>
            <Text style={[styles.stepBtnText, { color: colors.primary }]}>−</Text>
          </TouchableOpacity>
          <Text style={[styles.qtyText, { color: colors.onBackground }]}>{qty}</Text>
          <TouchableOpacity
            onPress={() => setQty((q) => q + 1)}
            style={[styles.stepBtn, { borderColor: colors.primary }]}>
            <Text style={[styles.stepBtnText, { color: colors.primary }]}>＋</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            addItem({
              id: Number(product?.id) ?? Math.random(),
              name: product?.name || 'Product',
              price: product?.price || 0,
              imageUrl: product?.image || '',
              category: product?.category || 'General',
              unitLabel: weight,
            }, qty);
            navigation.navigate('CartCheckout');
          }}
          style={[styles.addBtn, { backgroundColor: colors.primary }]}>
          <Text style={{ color: colors.onPrimary, fontWeight: '800' }}>Add to cart • GHS {total.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 8, paddingTop: 8, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerBtnText: { fontSize: 18, color: 'white', fontWeight: '700' },
  headerTitle: { fontSize: 16, fontWeight: '800' },
  imageWrap: { marginTop: 10, marginHorizontal: 12, borderRadius: 20, overflow: 'hidden', backgroundColor: '#f6f6f6' },
  image: { width: '100%', aspectRatio: 16/10, resizeMode: 'cover' },
  favBtn: { position: 'absolute', right: 12, bottom: 12, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', elevation: 2 },
  name: { fontSize: 18, fontWeight: '800', marginTop: 16 },
  price: { fontSize: 22, fontWeight: '800', marginTop: 8 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  inlineRow: { flexDirection: 'row', alignItems: 'center' },
  colorDot: { marginRight: 6 },
  divider: { borderBottomWidth: 1, marginTop: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '800', marginBottom: 6 },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 12, paddingTop: 8, paddingBottom: 12, borderTopWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  stepBtnText: { fontSize: 18, fontWeight: '800' },
  qtyText: { width: 28, textAlign: 'center', fontWeight: '800' },
  addBtn: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
});


