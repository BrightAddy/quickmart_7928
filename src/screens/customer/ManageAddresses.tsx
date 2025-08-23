import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

 type Address = {
  id: string;
  name: string;
  address: string;
  isDefault?: boolean;
};

 type Props = NativeStackScreenProps<RootStackParamList, 'ManageAddresses'>;

export default function ManageAddresses({ route, navigation }: Props) {
  const { colors } = useTheme();
  const addresses: Address[] = route.params?.addresses || [];

  return (
    <Screen style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { borderBottomColor: colors.primary + '22' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBack}>
          <Text style={[styles.headerBackText, { color: colors.primary }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.onBackground }]}>Manage Addresses</Text>
        <View style={styles.headerRight} />
      </View>

      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={addresses}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: colors.onBackground }]}>No addresses yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.onSurface + '99' }]}>Add a new address to get started.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { borderColor: colors.primary + '22', backgroundColor: colors.surface }]}>
            <View style={styles.cardLeft}>
              <Text style={[styles.cardName, { color: colors.onBackground }]}>{item.name}</Text>
              <Text style={[styles.cardAddress, { color: colors.onSurface + 'CC' }]}>{item.address}</Text>
              {item.isDefault ? (
                <View style={[styles.badge, { backgroundColor: colors.primary + '22' }]}> 
                  <Text style={[styles.badgeText, { color: colors.primary }]}>Default</Text>
                </View>
              ) : null}
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.primary + '44' }]} onPress={() => {}}>
                <Text style={[styles.actionText, { color: colors.primary }]}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { borderColor: '#E53935' + '44' }]} onPress={() => {}}>
                <Text style={[styles.actionText, { color: '#E53935' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={[styles.footer, { borderTopColor: colors.primary + '22' }]}>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={() => {}}>
          <Text style={[styles.addButtonText, { color: colors.onPrimary }]}>Add New Address</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingHorizontal: 12,
  },
  headerBack: {
    width: 80,
    justifyContent: 'center',
  },
  headerBackText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
  headerRight: {
    width: 80,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardLeft: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardAddress: {
    fontSize: 14,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  addButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
}); 
