import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Heart, User, Phone, MapPin } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import Input from '@/components/Input';

const RELATIONSHIP_OPTIONS = [
  'Spouse',
  'Parent',
  'Child',
  'Sibling',
  'Relative',
  'Friend',
  'Other'
];

export default function NextOfKinScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Mary Doe',
    relationship: 'Spouse',
    phone: '0244987654',
    alternatePhone: '0201234567',
    address: '123 Main Street, Accra',
    email: 'mary.doe@email.com'
  });

  const [originalData, setOriginalData] = useState(formData);

  const handleEdit = () => {
    setOriginalData(formData);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.relationship || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Save Changes',
      'Your next of kin information has been updated successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            setIsEditing(false);
            // In a real app, you would save to backend here
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen 
        options={{ 
          title: 'Next of Kin',
          headerStyle: { backgroundColor: Colors.white },
          headerTintColor: Colors.text,
        }} 
      />

      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Heart size={24} color={Colors.primary} />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Emergency Contact</Text>
          <Text style={styles.headerSubtitle}>Person to contact in case of emergency</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          {!isEditing && (
            <Button
              title="Edit"
              onPress={handleEdit}
              variant="outline"
              size="small"
            />
          )}
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name *"
            value={formData.name}
            onChangeText={(value) => updateField('name', value)}
            placeholder="Enter full name"
            editable={isEditing}
            style={[styles.input, !isEditing && styles.inputDisabled]}
            leftIcon={<User size={20} color={Colors.subtext} />}
          />

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Relationship *</Text>
            <View style={styles.relationshipContainer}>
              {RELATIONSHIP_OPTIONS.map((option) => (
                <Button
                  key={option}
                  title={option}
                  onPress={() => updateField('relationship', option)}
                  variant={formData.relationship === option ? 'primary' : 'outline'}
                  size="small"
                  style={styles.relationshipButton}
                  disabled={!isEditing}
                />
              ))}
            </View>
          </View>

          <Input
            label="Primary Phone Number *"
            value={formData.phone}
            onChangeText={(value) => updateField('phone', value)}
            placeholder="0244123456"
            keyboardType="phone-pad"
            editable={isEditing}
            style={[styles.input, !isEditing && styles.inputDisabled]}
            leftIcon={<Phone size={20} color={Colors.subtext} />}
          />

          <Input
            label="Alternate Phone Number"
            value={formData.alternatePhone}
            onChangeText={(value) => updateField('alternatePhone', value)}
            placeholder="0201234567"
            keyboardType="phone-pad"
            editable={isEditing}
            style={[styles.input, !isEditing && styles.inputDisabled]}
            leftIcon={<Phone size={20} color={Colors.subtext} />}
          />

          <Input
            label="Email Address"
            value={formData.email}
            onChangeText={(value) => updateField('email', value)}
            placeholder="email@example.com"
            keyboardType="email-address"
            editable={isEditing}
            style={[styles.input, !isEditing && styles.inputDisabled]}
          />

          <Input
            label="Home Address"
            value={formData.address}
            onChangeText={(value) => updateField('address', value)}
            placeholder="Enter home address"
            multiline
            numberOfLines={3}
            editable={isEditing}
            style={[styles.input, styles.textArea, !isEditing && styles.inputDisabled]}
            leftIcon={<MapPin size={20} color={Colors.subtext} />}
          />
        </View>

        {isEditing && (
          <View style={styles.actionButtons}>
            <Button
              title="Cancel"
              onPress={handleCancel}
              variant="outline"
              style={styles.actionButton}
            />
            <Button
              title="Save Changes"
              onPress={handleSave}
              style={styles.actionButton}
            />
          </View>
        )}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Why do we need this information?</Text>
        <View style={styles.infoItem}>
          <View style={styles.infoBullet} />
          <Text style={styles.infoText}>
            Emergency contact in case of accidents or incidents during delivery
          </Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoBullet} />
          <Text style={styles.infoText}>
            Required for insurance and safety compliance
          </Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoBullet} />
          <Text style={styles.infoText}>
            Your information is kept secure and confidential
          </Text>
        </View>
      </View>

      <View style={styles.verificationSection}>
        <View style={styles.verificationHeader}>
          <Text style={styles.verificationTitle}>Verification Status</Text>
          <View style={styles.verificationBadge}>
            <Text style={styles.verificationBadgeText}>Verified</Text>
          </View>
        </View>
        <Text style={styles.verificationText}>
          Your next of kin information has been verified and is up to date.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.lightGray,
  },
  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.subtext,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  form: {
    gap: 16,
  },
  input: {
    marginBottom: 0,
  },
  inputDisabled: {
    backgroundColor: Colors.lightGray,
    opacity: 0.7,
  },
  textArea: {
    minHeight: 80,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  relationshipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  relationshipButton: {
    minWidth: 80,
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
  },
  infoSection: {
    padding: 20,
    backgroundColor: Colors.lightGray,
    margin: 20,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 6,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 18,
  },
  verificationSection: {
    padding: 20,
    backgroundColor: Colors.success + '10',
    margin: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.success + '20',
  },
  verificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  verificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  verificationBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verificationBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  verificationText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 18,
  },
});