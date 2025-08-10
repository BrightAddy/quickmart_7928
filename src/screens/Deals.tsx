import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { Screen, Title, Body } from '../components/UI';
import { useTheme } from '../theme/theme';

const deals = [
  { id: 'd1', title: 'Weekend Grocery Deal', subtitle: 'Free delivery above GHS 100', badge: 'FREE DELIVERY', image: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'd2', title: 'Rice & Grains', subtitle: 'Buy 2 get 1 free', badge: 'B2G1', image: 'https://images.pexels.com/photos/616837/pexels-photo-616837.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'd3', title: 'Fresh Produce', subtitle: 'Up to 20% off', badge: '-20%', image: 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

export default function Deals() {
  const { colors } = useTheme();
  return (
    <Screen>
      <View style={{ padding: 16 }}>
        <Title>Deals</Title>
        <Body style={{ marginTop: 4, opacity: 0.8 }}>Curated promos and flash sales</Body>
        <FlatList
          data={deals}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: colors.surface }]}> 
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.title, { color: colors.onSurface }]}>{item.title}</Text>
                <Text style={{ color: colors.onSurface + '88', marginTop: 2 }}>{item.subtitle}</Text>
                <View style={[styles.badge, { backgroundColor: colors.primary + '15' }]}>
                  <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 12 }}>{item.badge}</Text>
                </View>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          style={{ marginTop: 16 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', borderRadius: 12, padding: 12, alignItems: 'center' },
  image: { width: 72, height: 72, borderRadius: 10 },
  title: { fontSize: 16, fontWeight: '700' },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 8 },
});



