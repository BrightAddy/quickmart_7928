import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';

type ChatMsg = { id: string; from: 'me' | 'them' | 'system'; text: string; ts: number };

export default function ShopperChat({ route }: any) {
  const { colors } = useTheme();
  const { orderId, peerName = 'Customer' } = route?.params || {};
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { id: 'm1', from: 'system', text: `Chat about ${orderId || 'Order'}`, ts: Date.now() - 60000 },
    { id: 'm2', from: 'them', text: 'Hi, please pick the low-fat milk if available.', ts: Date.now() - 30000 },
  ]);

  const send = () => {
    if (!input.trim()) return;
    const m: ChatMsg = { id: Math.random().toString(36).slice(2), from: 'me', text: input.trim(), ts: Date.now() };
    setMsgs((p) => [m, ...p]);
    setInput('');
  };

  return (
    <Screen>
      <View style={{ padding: 16 }}>
        <Text style={[styles.title, { color: colors.onBackground }]}>Chat with {peerName}</Text>
        <FlatList
          data={msgs}
          inverted
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.from === 'me' ? styles.myBubble : styles.theirBubble,
                { backgroundColor: item.from === 'me' ? colors.primary : colors.surface },
              ]}
            >
              <Text style={{ color: item.from === 'me' ? colors.onPrimary : colors.onSurface }}>{item.text}</Text>
              <Text style={{ fontSize: 10, marginTop: 4, color: item.from === 'me' ? colors.onPrimary + '88' : colors.onSurface + '88' }}>
                {new Date(item.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          )}
          contentContainerStyle={{ gap: 10, paddingTop: 10 }}
          style={{ height: '80%' }}
          showsVerticalScrollIndicator={false}
        />
        <View style={[styles.inputRow, { borderTopColor: colors.primary + '22' }]}> 
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.onSurface, borderColor: colors.primary + '33' }]}
            value={input}
            onChangeText={setInput}
            placeholder={`Message ${peerName}...`}
            placeholderTextColor={colors.onSurface + '66'}
            onSubmitEditing={send}
          />
          <TouchableOpacity style={[styles.sendBtn, { backgroundColor: colors.primary }]} onPress={send}>
            <Text style={{ color: colors.onPrimary, fontWeight: '700' }}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  bubble: { alignSelf: 'flex-start', padding: 10, borderRadius: 12, maxWidth: '80%' },
  myBubble: { alignSelf: 'flex-end' },
  theirBubble: { alignSelf: 'flex-start' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 12 },
  input: { flex: 1, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  sendBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
});


