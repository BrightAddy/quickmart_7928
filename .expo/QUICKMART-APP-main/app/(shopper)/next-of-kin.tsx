import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  Users,
  Phone,
  MapPin,
  Edit3,
  Save,
  Shield,
  AlertCircle,
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

interface NextOfKinData {
  name: string;
  relationship: string;
  phone: string;
  alternatePhone: string;
  address: string;
  city: string;
}

export default function NextOfKin() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<NextOfKinData>({
    name: 'Akosua Mensah',
    relationship: 'Sister',
    phone: '0241234567',
    alternatePhone: '0501234567',
    address: '123 Liberation Road',
    city: 'Accra',
  });

  const relationships = [
    'Parent', 'Spouse', 'Sibling', 'Child', 'Relative', 'Friend', 'Other'
  ];

  const handleSave = () => {
    if (!formData.name || !formData.phone || !formData.relationship) {
      Alert.alert(
        'Missing Information',
        'Please fill in all required fields (Name, Phone, Relationship).'
      );
      return;
    }

    if (formData.phone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number.');
      return;
    }

    Alert.alert(
      'Update Next of Kin',
      'Your emergency contact information will be updated.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: () => {
            setIsEditing(false);
            Alert.alert('Success', 'Next of kin information updated successfully!');
          },
        },
      ]
    );
  };

  const updateField = (field: keyof NextOfKinData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectRelationship = () => {
    Alert.alert(
      'Select Relationship',
      'Choose the relationship to your emergency contact',
      [
        { text: 'Cancel', style: 'cancel' },
        ...relationships.map(rel => ({
          text: rel,
          onPress: () => updateField('relationship', rel),
        })),
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Next of Kin',
          headerStyle: {
            backgroundColor: Colors.white,
          },
          headerTintColor: Colors.text,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}
              style={styles.headerButton}
            >
              {isEditing ? (
                <Save size={20} color="#4464EB" />
              ) : (
                <Edit3 size={20} color="#4464EB" />
              )}
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={[styles.container, { backgroundColor: Colors.background }]}>
        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: '#E3F2FD' }]}>
          <Shield size={24} color="#2196F3" />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: '#1976D2' }]}>
              Emergency Contact Information
            </Text>
            <Text style={[styles.infoText, { color: '#1976D2' }]}>
              This information will be used to contact someone in case of emergency while you're on duty.
            </Text>
          </View>
        </View>

        {/* Form */}
        <View style={[styles.formCard, { backgroundColor: Colors.white }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>
            Contact Details
          </Text>

          {/* Name */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: Colors.text }]}>
              Full Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: Colors.background,
                  color: Colors.text,
                  borderColor: Colors.border,
                },
              ]}
              value={formData.name}
              onChangeText={(value) => updateField('name', value)}
              placeholder="Enter full name"
              placeholderTextColor={Colors.subtext}
              editable={isEditing}
            />
          </View>

          {/* Relationship */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: Colors.text }]}>
              Relationship <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={[
                styles.selectInput,
                {
                  backgroundColor: Colors.background,
                  borderColor: Colors.border,
                },
              ]}
              onPress={isEditing ? selectRelationship : undefined}
              disabled={!isEditing}
            >
              <Text style={[styles.selectText, { color: Colors.text }]}>
                {formData.relationship || 'Select relationship'}
              </Text>
              {isEditing && <AlertCircle size={16} color={Colors.subtext} />}
            </TouchableOpacity>
          </View>

          {/* Primary Phone */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: Colors.text }]}>
              Primary Phone <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: Colors.background,
                  color: Colors.text,
                  borderColor: Colors.border,
                },
              ]}
              value={formData.phone}
              onChangeText={(value) => updateField('phone', value)}
              placeholder="Enter phone number"
              placeholderTextColor={Colors.subtext}
              keyboardType="phone-pad"
              editable={isEditing}
            />
          </View>

          {/* Alternate Phone */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: Colors.text }]}>
              Alternate Phone
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: Colors.background,
                  color: Colors.text,
                  borderColor: Colors.border,
                },
              ]}
              value={formData.alternatePhone}
              onChangeText={(value) => updateField('alternatePhone', value)}
              placeholder="Enter alternate phone number"
              placeholderTextColor={Colors.subtext}
              keyboardType="phone-pad"
              editable={isEditing}
            />
          </View>

          {/* Address */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: Colors.text }]}>
              Address
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: Colors.background,
                  color: Colors.text,
                  borderColor: Colors.border,
                },
              ]}
              value={formData.address}
              onChangeText={(value) => updateField('address', value)}
              placeholder="Enter address"
              placeholderTextColor={Colors.subtext}
              editable={isEditing}
            />
          </View>

          {/* City */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: Colors.text }]}>
              City
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: Colors.background,
                  color: Colors.text,
                  borderColor: Colors.border,
                },
              ]}
              value={formData.city}
              onChangeText={(value) => updateField('city', value)}
              placeholder="Enter city"
              placeholderTextColor={Colors.subtext}
              editable={isEditing}
            />
          </View>
        </View>

        {/* Contact Actions */}
        <View style={[styles.actionsCard, { backgroundColor: Colors.white }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>
            Quick Actions
          </Text>
          
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              Alert.alert(
                'Call Primary',
                `Call ${formData.name} at ${formData.phone}?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Call', onPress: () => {} },
                ]
              );
            }}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#E8F5E8' }]}>
              <Phone size={20} color="#4CAF50" />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: Colors.text }]}>
                Call Primary Phone
              </Text>
              <Text style={[styles.actionSubtitle, { color: Colors.subtext }]}>
                {formData.phone}
              </Text>
            </View>
          </TouchableOpacity>

          {formData.alternatePhone && (
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {
                Alert.alert(
                  'Call Alternate',
                  `Call ${formData.name} at ${formData.alternatePhone}?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Call', onPress: () => {} },
                  ]
                );
              }}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
                <Phone size={20} color="#2196F3" />
              </View>
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, { color: Colors.text }]}>
                  Call Alternate Phone
                </Text>
                <Text style={[styles.actionSubtitle, { color: Colors.subtext }]}>
                  {formData.alternatePhone}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Privacy Notice */}
        <View style={[styles.privacyCard, { backgroundColor: '#FFF3E0' }]}>
          <AlertCircle size={20} color="#F57C00" />
          <View style={styles.privacyContent}>
            <Text style={[styles.privacyTitle, { color: '#E65100' }]}>
              Privacy Notice
            </Text>
            <Text style={[styles.privacyText, { color: '#E65100' }]}>
              Your next of kin information is kept confidential and will only be used in emergency situations. We do not share this information with third parties.
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerButton: {
    padding: 8,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  formCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  required: {
    color: '#F44336',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
  selectText: {
    fontSize: 16,
  },
  actionsCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
  },
  privacyCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  privacyContent: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  privacyText: {
    fontSize: 14,
    lineHeight: 20,
  },
});