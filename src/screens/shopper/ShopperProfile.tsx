import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Switch, KeyboardAvoidingView, Platform, Animated, Alert, ScrollView } from 'react-native';
import { Screen } from '../../components/UI';
import { useTheme } from '../../theme/theme';

export default function ShopperProfile({ navigation }: any) {
  const { colors } = useTheme();

  const [availability, setAvailability] = useState<boolean>(false);
  const [profile, setProfile] = useState(() => ({
    name: 'Bright Addy',
    phone: '+233 558680795',
    email: 'brightaddy40@gmail.com',
    rating: 4.9,
  }));
  const [vehicle, setVehicle] = useState(() => ({ type: 'Motorbike', plate: 'GR-1234-22' }));
  const [documents, setDocuments] = useState(() => ({ id: true, license: true, insurance: true }));
  const [preferences, setPreferences] = useState(() => ({ notifications: true, language: 'English', navigationApp: 'Google Maps' }));

  const [modal, setModal] = useState<null | 'profile' | 'vehicle' | 'documents' | 'preferences'>(null);
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (modal) {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 7, tension: 80 }),
      ]).start();
    }
  }, [modal]);

  const closeModal = () => setModal(null);

  const saveProfile = (next: typeof profile) => {
    setProfile(next);
    Alert.alert('Saved', 'Personal information updated');
    closeModal();
  };
  const saveVehicle = (next: typeof vehicle) => {
    setVehicle(next);
    Alert.alert('Saved', 'Vehicle details updated');
    closeModal();
  };
  const saveDocuments = (next: typeof documents) => {
    setDocuments(next);
    Alert.alert('Saved', 'Document statuses updated');
    closeModal();
  };
  const savePreferences = (next: typeof preferences) => {
    setPreferences(next);
    Alert.alert('Saved', 'Preferences updated');
    closeModal();
  };

  return (
    <Screen style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}> 
        <View style={[styles.avatar, { backgroundColor: colors.onPrimary + '20' }]}> 
          <Text style={[styles.avatarText, { color: colors.onPrimary }]}>{profile.name.charAt(0)}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.name, { color: colors.onPrimary }]}>{profile.name}</Text>
          <Text style={[styles.sub, { color: colors.onPrimary + 'CC' }]}>{profile.phone} · {profile.email}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.star}>⭐</Text>
            <Text style={[styles.rating, { color: colors.onPrimary }]}>{profile.rating.toFixed(1)}</Text>
          </View>
        </View>
        <View style={styles.availabilityRow}>
          <Text style={[styles.availabilityLabel, { color: colors.onPrimary }]}>{availability ? 'Online' : 'Offline'}</Text>
          <Switch value={availability} onValueChange={setAvailability} thumbColor={'#fff'} trackColor={{ false: '#d1d5db', true: '#34d399' }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Quick Access</Text>
        <View style={styles.grid}>
          <ActionTile label="Availability" icon={availability ? '🟢' : '⚪'} onPress={() => setAvailability(v => !v)} colors={colors} />
          <ActionTile label="Documents" icon="📄" onPress={() => setModal('documents')} colors={colors} />
          <ActionTile label="Vehicle" icon="🛵" onPress={() => setModal('vehicle')} colors={colors} />
          <ActionTile label="Support" icon="🆘" onPress={() => navigation.navigate('HelpCenter')} colors={colors} />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.onBackground, marginTop: 24 }]}>Account</Text>
        <ListItem title="Personal Info" subtitle="Name, phone, email" icon="👤" onPress={() => setModal('profile')} colors={colors} />
        <ListItem title="Vehicle" subtitle={`${vehicle.type} · ${vehicle.plate}`} icon="🛵" onPress={() => setModal('vehicle')} colors={colors} />
        <ListItem title="Documents" subtitle={`ID ${documents.id ? '✓' : '✗'} · License ${documents.license ? '✓' : '✗'} · Insurance ${documents.insurance ? '✓' : '✗'}`} icon="📄" onPress={() => setModal('documents')} colors={colors} />
        <ListItem title="Preferences" subtitle={`${preferences.language} · ${preferences.navigationApp}`} icon="⚙️" onPress={() => setModal('preferences')} colors={colors} />
        <ListItem title="Legal" subtitle="Terms, privacy" icon="📜" onPress={() => {}} colors={colors} />

        <TouchableOpacity style={[styles.signOut, { backgroundColor: '#ef4444' }]} onPress={() => navigation.replace('UserRoleSelection')}>
          <Text style={[styles.signOutText, { color: '#fff' }]}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Modals */}
      <EditModal visible={modal === 'profile'} onClose={closeModal} colors={colors} fadeAnim={fadeAnim} scaleAnim={scaleAnim} title="Edit Personal Info">
        {(dismiss) => (
          <ProfileForm
            initial={profile}
            colors={colors}
            onCancel={dismiss}
            onSave={saveProfile}
          />
        )}
      </EditModal>

      <EditModal visible={modal === 'vehicle'} onClose={closeModal} colors={colors} fadeAnim={fadeAnim} scaleAnim={scaleAnim} title="Edit Vehicle">
        {(dismiss) => (
          <VehicleForm
            initial={vehicle}
            colors={colors}
            onCancel={dismiss}
            onSave={saveVehicle}
          />
        )}
      </EditModal>

      <EditModal visible={modal === 'documents'} onClose={closeModal} colors={colors} fadeAnim={fadeAnim} scaleAnim={scaleAnim} title="Documents">
        {(dismiss) => (
          <DocumentsForm
            initial={documents}
            colors={colors}
            onCancel={dismiss}
            onSave={saveDocuments}
          />
        )}
      </EditModal>

      <EditModal visible={modal === 'preferences'} onClose={closeModal} colors={colors} fadeAnim={fadeAnim} scaleAnim={scaleAnim} title="Preferences">
        {(dismiss) => (
          <PreferencesForm
            initial={preferences}
            colors={colors}
            onCancel={dismiss}
            onSave={savePreferences}
          />
        )}
      </EditModal>
    </Screen>
  );
}

/* ---------- Reusable UI blocks ---------- */
function ActionTile({ label, icon, onPress, colors }: { label: string; icon: string; onPress: () => void; colors: any }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.tile, { borderColor: colors.primary + '22' }]}> 
      <Text style={styles.tileIcon}>{icon}</Text>
      <Text style={[styles.tileLabel, { color: '#374151' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function ListItem({ title, subtitle, icon, onPress, colors }: { title: string; subtitle?: string; icon: string; onPress?: () => void; colors: any }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.item, { borderColor: colors.primary + '22', backgroundColor: colors.surface }]}> 
      <Text style={styles.itemIcon}>{icon}</Text>
      <View style={styles.itemCenter}>
        <Text style={[styles.itemTitle, { color: '#111827' }]}>{title}</Text>
        {subtitle ? <Text style={[styles.itemSubtitle, { color: '#6b7280' }]}>{subtitle}</Text> : null}
      </View>
      <Text style={styles.itemArrow}>›</Text>
    </TouchableOpacity>
  );
}

/* ---------- Modal + Forms ---------- */
function EditModal({ visible, onClose, title, colors, fadeAnim, scaleAnim, children }: { visible: boolean; onClose: () => void; title: string; colors: any; fadeAnim: Animated.Value; scaleAnim: Animated.Value; children: (dismiss: () => void) => React.ReactNode; }) {
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.modalBackdrop, { opacity: fadeAnim }]}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalContainer}>
          <Animated.View style={[styles.modalCard, { backgroundColor: '#fff', transform: [{ scale: scaleAnim }] }]}> 
            <Text style={styles.modalTitle}>{title}</Text>
            <ScrollView contentContainerStyle={{ paddingBottom: 8 }} showsVerticalScrollIndicator={false}>
              {children(onClose)}
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
}

function LabeledInput({ label, value, onChangeText, placeholder = '', keyboardType = 'default' as const }: { label: string; value: string; onChangeText: (t: string) => void; placeholder?: string; keyboardType?: 'default' | 'email-address' | 'phone-pad'; }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        style={styles.input}
      />
    </View>
  );
}

function FormActions({ onCancel, onSaveLabel = 'Save', onSave }: { onCancel: () => void; onSaveLabel?: string; onSave: () => void }) {
  return (
    <View style={styles.formActions}>
      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#e5e7eb' }]} onPress={onCancel}>
        <Text style={[styles.actionText, { color: '#111827' }]}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#111827' }]} onPress={onSave}>
        <Text style={[styles.actionText, { color: '#fff' }]}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

function ProfileForm({ initial, onSave, onCancel, colors }: { initial: { name: string; phone: string; email: string }; onSave: (v: any) => void; onCancel: () => void; colors: any }) {
  const [form, setForm] = useState(initial);
  return (
    <View>
      <LabeledInput label="Full Name" value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} placeholder="Enter full name" />
      <LabeledInput label="Phone" value={form.phone} onChangeText={(t) => setForm({ ...form, phone: t })} placeholder="e.g. +233..." keyboardType="phone-pad" />
      <LabeledInput label="Email" value={form.email} onChangeText={(t) => setForm({ ...form, email: t })} placeholder="you@example.com" keyboardType="email-address" />
      <FormActions onCancel={onCancel} onSave={() => onSave(form)} />
    </View>
  );
}

function VehicleForm({ initial, onSave, onCancel, colors }: { initial: { type: string; plate: string }; onSave: (v: any) => void; onCancel: () => void; colors: any }) {
  const [form, setForm] = useState(initial);
  return (
    <View>
      <LabeledInput label="Vehicle Type" value={form.type} onChangeText={(t) => setForm({ ...form, type: t })} placeholder="Motorbike / Bicycle / Car" />
      <LabeledInput label="Plate Number" value={form.plate} onChangeText={(t) => setForm({ ...form, plate: t })} placeholder="e.g. GR-1234-22" />
      <FormActions onCancel={onCancel} onSave={() => onSave(form)} />
    </View>
  );
}

function DocumentsForm({ initial, onSave, onCancel, colors }: { initial: { id: boolean; license: boolean; insurance: boolean }; onSave: (v: any) => void; onCancel: () => void; colors: any }) {
  const [form, setForm] = useState(initial);
  const ToggleRow = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
  return (
    <View>
      <ToggleRow label="ID Verified" value={form.id} onChange={(v) => setForm({ ...form, id: v })} />
      <ToggleRow label="License Valid" value={form.license} onChange={(v) => setForm({ ...form, license: v })} />
      <ToggleRow label="Insurance Valid" value={form.insurance} onChange={(v) => setForm({ ...form, insurance: v })} />
      <FormActions onCancel={onCancel} onSave={() => onSave(form)} />
    </View>
  );
}

function PreferencesForm({ initial, onSave, onCancel, colors }: { initial: { notifications: boolean; language: string; navigationApp: string }; onSave: (v: any) => void; onCancel: () => void; colors: any }) {
  const [form, setForm] = useState(initial);
  return (
    <View>
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Notifications</Text>
        <Switch value={form.notifications} onValueChange={(v) => setForm({ ...form, notifications: v })} />
      </View>
      <LabeledInput label="Language" value={form.language} onChangeText={(t) => setForm({ ...form, language: t })} placeholder="English" />
      <LabeledInput label="Navigation App" value={form.navigationApp} onChangeText={(t) => setForm({ ...form, navigationApp: t })} placeholder="Google Maps / Waze / Apple Maps" />
      <FormActions onCancel={onCancel} onSave={() => onSave(form)} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
  },
  headerInfo: { flex: 1 },
  name: { fontSize: 20, fontWeight: '800' },
  sub: { fontSize: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  star: { fontSize: 14, marginRight: 4 },
  rating: { fontSize: 14, fontWeight: '700' },
  availabilityRow: { alignItems: 'center' },
  availabilityLabel: { fontSize: 12, fontWeight: '700', marginBottom: 4 },
  content: { padding: 16, paddingBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: { width: '47%', borderWidth: 1, borderRadius: 12, padding: 16, alignItems: 'center' },
  tileIcon: { fontSize: 22, marginBottom: 8 },
  tileLabel: { fontSize: 14, fontWeight: '700' },
  item: { flexDirection: 'row', alignItems: 'center', padding: 14, borderWidth: 1, borderRadius: 12, marginBottom: 10 },
  itemIcon: { fontSize: 20, marginRight: 12 },
  itemCenter: { flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: '700' },
  itemSubtitle: { fontSize: 12, marginTop: 2 },
  itemArrow: { fontSize: 22, color: '#9ca3af' },
  signOut: { marginTop: 12, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  signOutText: { fontSize: 14, fontWeight: '800' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' },
  modalContainer: { padding: 16 },
  modalCard: { borderRadius: 16, padding: 16, maxHeight: '80%' },
  modalTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12, textAlign: 'center' },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  formActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  actionBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  actionText: { fontSize: 14, fontWeight: '800' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  toggleLabel: { fontSize: 14, fontWeight: '700', color: '#111827' },
}); 
