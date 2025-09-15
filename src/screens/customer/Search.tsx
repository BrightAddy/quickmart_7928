import React, { useEffect, useMemo, useState } from 'react';
import { View, TextInput, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Screen, Title, Body } from '../../components/UI';
import { useTheme } from '../../theme/theme';
import { useProducts } from '../../context/ProductsContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

const trendingQueries = ['Rice', 'Plantain', 'Palm Oil', 'Tomatoes', 'Yam'];
const recentQueriesInitial = ['Fan Milk', 'Titus Sardine'];

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

export default function Search({ route }: Props) {
  const { colors } = useTheme();
  const { searchProducts } = useProducts();
  const [query, setQuery] = useState(route?.params?.initialQuery || '');
  const [recentQueries, setRecentQueries] = useState<string[]>(recentQueriesInitial);

  const results = useMemo(() => {
    if (!query.trim()) return [] as any[];
    // Global search across all stores
    return searchProducts(query.trim());
  }, [query, searchProducts]);

  useEffect(() => {
    if (route?.params?.initialQuery) {
      setQuery(route.params.initialQuery);
    }
  }, [route?.params?.initialQuery]);

  const onSubmit = () => {
    if (!query.trim()) return;
    setRecentQueries((prev) => [query.trim(), ...prev.filter((q) => q !== query.trim())].slice(0, 8));
  };

  return (
    <Screen>
      <View style={{ paddingHorizontal: 12, paddingTop: 8 }}>
        <Title style={{ marginBottom: 8 }}>Search</Title>
        <View style={[styles.searchRow, { borderColor: colors.primary + '33', backgroundColor: colors.surface }]}>
          <Text style={{ fontSize: 18, marginRight: 8 }}>🔎</Text>
          <TextInput
            style={[styles.input, { color: colors.onSurface }]}
            placeholder="Search for products or stores"
            placeholderTextColor={colors.onSurface + '66'}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={onSubmit}
            returnKeyType="search"
          />
        </View>

        {!query && (
          <View style={{ marginTop: 16 }}>
            <Body style={{ opacity: 0.8, marginBottom: 8 }}>Trending</Body>
            <View style={styles.chipsRow}>
              {trendingQueries.map((q) => (
                <TouchableOpacity key={q} style={[styles.chip, { backgroundColor: colors.primary + '15' }]} onPress={() => setQuery(q)}>
                  <Text style={{ color: colors.primary, fontWeight: '600' }}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {!!recentQueries.length && (
              <View style={{ marginTop: 16 }}>
                <Body style={{ opacity: 0.8, marginBottom: 8 }}>Recent</Body>
                <View style={styles.chipsRow}>
                  {recentQueries.map((q) => (
                    <TouchableOpacity key={q} style={[styles.chip, { backgroundColor: colors.secondary + '15' }]} onPress={() => setQuery(q)}>
                      <Text style={{ color: colors.onBackground }}>{q}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {!!query && (
          <FlatList
            data={results as any}
            keyExtractor={(item: any) => String(item.id)}
            renderItem={({ item }: any) => (
              <View style={[styles.resultItem, { backgroundColor: colors.surface }]}>
                <Text style={[styles.resultTitle, { color: colors.onSurface }]}>{item.name}</Text>
                <Text style={{ color: colors.primary, fontWeight: '700' }}>GHS {Number(item.price).toFixed(2)}</Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            style={{ marginTop: 16 }}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: { flex: 1, fontSize: 16 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  resultItem: { padding: 12, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultTitle: { fontSize: 15, fontWeight: '600' },
});



