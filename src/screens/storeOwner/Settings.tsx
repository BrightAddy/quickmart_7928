import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/theme/theme';

const ORANGE = '#FF7A00';

export default function Settings() {
  const { colors } = useTheme();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={[styles.header, { color: colors.onBackground }]}>Settings</Text>

      <View style={[styles.section, { borderColor: ORANGE + '33', backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Store Profile</Text>
        {['Name & Logo', 'Address & Hours', 'Description'].map((row) => (
          <TouchableOpacity key={row} style={styles.row}> 
            <Text style={{ color: colors.onSurface }}>{row}</Text>
            <Text style={{ color: ORANGE }}>Edit</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.section, { borderColor: ORANGE + '33', backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Payments</Text>
        {['MoMo / Bank Setup', 'Request Payout', 'Transactions'].map((row) => (
          <TouchableOpacity key={row} style={styles.row}>
            <Text style={{ color: colors.onSurface }}>{row}</Text>
            <Text style={{ color: ORANGE }}>Open</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.section, { borderColor: ORANGE + '33', backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Staff & Roles</Text>
        {['Manage Staff', 'Permissions', 'Activity Log'].map((row) => (
          <TouchableOpacity key={row} style={styles.row}>
            <Text style={{ color: colors.onSurface }}>{row}</Text>
            <Text style={{ color: ORANGE }}>Open</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.section, { borderColor: ORANGE + '33', backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Preferences</Text>
        {['Notifications', 'Language & Currency', 'Reports & Exports', 'Verification & Support'].map((row) => (
          <TouchableOpacity key={row} style={styles.row}>
            <Text style={{ color: colors.onSurface }}>{row}</Text>
            <Text style={{ color: ORANGE }}>Open</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 22, fontWeight: '700' },
  section: { borderRadius: 12, borderWidth: 1, padding: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  row: { paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});


