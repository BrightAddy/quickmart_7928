import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, FlatList } from 'react-native';
import { Screen, Title, Body } from '../../components/UI';
import { useTheme } from '../../theme/theme';

type NotificationItem = { id: string; title: string; body: string; read?: boolean };

const mock: NotificationItem[] = [
  { id: 'n1', title: 'Order Update', body: 'Your order #QM-1023 is on the way. ETA 20 min.' },
  { id: 'n2', title: 'Deal Alert', body: 'Rice & grains: Buy 2 get 1 free this week!' },
  { id: 'n3', title: 'Price Drop', body: 'Palm Oil (1L) dropped to GHS 12.50.' },
];

export default function Notifications() {
  const { colors } = useTheme();
  const [enabled, setEnabled] = useState(true);
  const [list] = useState<NotificationItem[]>(mock);

  return (
    <Screen>
      <View style={{ padding: 16 }}>
        <Title>Notifications</Title>
        <View style={[styles.prefRow, { borderColor: colors.primary + '22' }]}>
          <Body style={{ flex: 1 }}>Enable push notifications</Body>
          <Switch value={enabled} onValueChange={setEnabled} thumbColor={enabled ? colors.primary : undefined} />
        </View>

        <FlatList
          data={list}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: colors.surface }]}> 
              <Text style={[styles.title, { color: colors.onSurface }]}>{item.title}</Text>
              <Text style={{ color: colors.onSurface + '88', marginTop: 4 }}>{item.body}</Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          style={{ marginTop: 16 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  prefRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, paddingVertical: 12, marginTop: 6 },
  card: { padding: 12, borderRadius: 12 },
  title: { fontSize: 15, fontWeight: '700' },
});



