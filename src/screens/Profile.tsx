import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Screen, FloatingChatbotButton, ChatbotModal, KenteAccent } from '../components/UI';
import { useTheme } from '../theme/theme';

export default function Profile({ navigation }: any) {
  const { colors } = useTheme();
  const [chatbotVisible, setChatbotVisible] = useState(false);
  return (
    <Screen style={{ flex: 1 }}>
      <KenteAccent style={{ top: 10, right: 10 }} animated />
      <View style={{ padding: 20 }}>
        <Text style={[styles.title, { color: colors.onBackground }]}>Profile</Text>
        <View style={[styles.card, { borderColor: colors.primary + '22' }]}>
          <Text style={[styles.name, { color: colors.onSurface }]}>Kwame Asante</Text>
          <Text style={{ color: colors.onSurface + '88' }}>kwame.asante@example.com</Text>
        </View>
        <TouchableOpacity style={[styles.item, { borderColor: colors.primary + '22' }]} onPress={() => navigation.navigate('UserPreferences')}>
          <Text style={[styles.itemText, { color: colors.onSurface }]}>Preferences</Text>
          <Text>⚙️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.item, { borderColor: colors.primary + '22' }]} onPress={() => navigation.navigate('HelpCenter')}>
          <Text style={[styles.itemText, { color: colors.onSurface }]}>Help Center</Text>
          <Text>❓</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.item, { borderColor: colors.primary + '22' }]} onPress={() => navigation.navigate('Referral')}>
          <Text style={[styles.itemText, { color: colors.onSurface }]}>Referral Program</Text>
          <Text>🎁</Text>
        </TouchableOpacity>
      </View>
      <FloatingChatbotButton onPress={() => setChatbotVisible(true)} />
      <ChatbotModal visible={chatbotVisible} onClose={() => setChatbotVisible(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  card: { borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 20 },
  name: { fontSize: 18, fontWeight: 'bold' },
  item: { borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemText: { fontSize: 16, fontWeight: '600' },
});


