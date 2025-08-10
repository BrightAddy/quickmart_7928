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
  Smartphone,
  CheckCircle,
  Clock,
  DollarSign,
  Edit3,
  Shield,
  AlertCircle,
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

interface PayoutHistory {
  id: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  transactionId: string;
}

const mockPayoutHistory: PayoutHistory[] = [
  {
    id: '1',
    amount: 156,
    date: 'Today, 6:00 AM',
    status: 'completed',
    transactionId: 'TXN123456789',
  },
  {
    id: '2',
    amount: 234,
    date: 'Yesterday, 6:00 AM',
    status: 'completed',
    transactionId: 'TXN123456788',
  },
  {
    id: '3',
    amount: 89,
    date: '2 days ago, 6:00 AM',
    status: 'completed',
    transactionId: 'TXN123456787',
  },
  {
    id: '4',
    amount: 67,
    date: '3 days ago, 6:00 AM',
    status: 'pending',
    transactionId: 'TXN123456786',
  },
];

const mobileProviders = [
  { id: 'mtn', name: 'MTN Mobile Money', color: '#FFCC00', prefix: '024, 054, 055, 059' },
  { id: 'vodafone', name: 'Vodafone Cash', color: '#E60000', prefix: '020, 050' },
  { id: 'airteltigo', name: 'AirtelTigo Money', color: '#FF6600', prefix: '026, 056, 027, 057' },
];

export default function MobileMoney() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  const [selectedProvider, setSelectedProvider] = useState('mtn');
  const [phoneNumber, setPhoneNumber] = useState('0541234567');
  const [isEditing, setIsEditing] = useState(false);
  const [pendingEarnings] = useState(82);

  const handleSaveChanges = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid mobile money number.');
      return;
    }

    Alert.alert(
      'Update Mobile Money',
      'Your mobile money details will be updated. This may take a few minutes to verify.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: () => {
            setIsEditing(false);
            Alert.alert('Success', 'Mobile money details updated successfully!');
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'failed':
        return '#F44336';
      default:
        return Colors.gray;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Mobile Money',
          headerStyle: {
            backgroundColor: Colors.white,
          },
          headerTintColor: Colors.text,
        }}
      />
      
      <ScrollView style={[styles.container, { backgroundColor: Colors.background }]}>
        {/* Pending Earnings */}
        <View style={[styles.earningsCard, { backgroundColor: '#4464EB' }]}>
          <View style={styles.earningsHeader}>
            <DollarSign size={24} color={Colors.white} />
            <Text style={[styles.earningsTitle, { color: Colors.white }]}>
              Pending Earnings
            </Text>
          </View>
          <Text style={[styles.earningsAmount, { color: Colors.white }]}>
            GH₵{pendingEarnings}
          </Text>
          <Text style={[styles.earningsSubtitle, { color: Colors.white }]}>
            Next payout: Tomorrow at 6:00 AM
          </Text>
        </View>

        {/* Mobile Money Setup */}
        <View style={[styles.setupCard, { backgroundColor: Colors.white }]}>
          <View style={styles.setupHeader}>
            <Text style={[styles.sectionTitle, { color: Colors.text }]}>
              Mobile Money Account
            </Text>
            <TouchableOpacity
              onPress={() => setIsEditing(!isEditing)}
              style={styles.editButton}
            >
              <Edit3 size={20} color="#4464EB" />
            </TouchableOpacity>
          </View>

          {/* Provider Selection */}
          <Text style={[styles.fieldLabel, { color: Colors.text }]}>Provider</Text>
          <View style={styles.providersContainer}>
            {mobileProviders.map((provider) => (
              <TouchableOpacity
                key={provider.id}
                style={[
                  styles.providerCard,
                  {
                    backgroundColor: Colors.background,
                    borderColor: selectedProvider === provider.id ? '#4464EB' : Colors.border,
                    borderWidth: selectedProvider === provider.id ? 2 : 1,
                  },
                ]}
                onPress={() => isEditing && setSelectedProvider(provider.id)}
                disabled={!isEditing}
              >
                <View
                  style={[
                    styles.providerIcon,
                    { backgroundColor: provider.color + '20' },
                  ]}
                >
                  <Smartphone size={20} color={provider.color} />
                </View>
                <View style={styles.providerInfo}>
                  <Text style={[styles.providerName, { color: Colors.text }]}>
                    {provider.name}
                  </Text>
                  <Text style={[styles.providerPrefix, { color: Colors.subtext }]}>
                    {provider.prefix}
                  </Text>
                </View>
                {selectedProvider === provider.id && (
                  <CheckCircle size={20} color="#4464EB" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Phone Number */}
          <Text style={[styles.fieldLabel, { color: Colors.text }]}>Phone Number</Text>
          <TextInput
            style={[
              styles.phoneInput,
              {
                backgroundColor: Colors.background,
                color: Colors.text,
                borderColor: Colors.border,
              },
            ]}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter mobile money number"
            placeholderTextColor={Colors.subtext}
            keyboardType="phone-pad"
            editable={isEditing}
          />

          {isEditing && (
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: '#4464EB' }]}
              onPress={handleSaveChanges}
            >
              <Text style={[styles.saveButtonText, { color: Colors.white }]}>
                Save Changes
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Security Info */}
        <View style={[styles.securityCard, { backgroundColor: '#E8F5E8' }]}>
          <Shield size={20} color="#4CAF50" />
          <View style={styles.securityContent}>
            <Text style={[styles.securityTitle, { color: '#2E7D32' }]}>
              Secure Payments
            </Text>
            <Text style={[styles.securityText, { color: '#2E7D32' }]}>
              Your mobile money details are encrypted and secure. Payouts are processed daily at 6:00 AM.
            </Text>
          </View>
        </View>

        {/* Payout Schedule */}
        <View style={[styles.scheduleCard, { backgroundColor: Colors.white }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>
            Payout Schedule
          </Text>
          
          <View style={styles.scheduleItem}>
            <Clock size={20} color="#4464EB" />
            <View style={styles.scheduleContent}>
              <Text style={[styles.scheduleTitle, { color: Colors.text }]}>
                Daily Payouts
              </Text>
              <Text style={[styles.scheduleText, { color: Colors.subtext }]}>
                Every day at 6:00 AM (GMT)
              </Text>
            </View>
          </View>

          <View style={styles.scheduleItem}>
            <DollarSign size={20} color="#4CAF50" />
            <View style={styles.scheduleContent}>
              <Text style={[styles.scheduleTitle, { color: Colors.text }]}>
                Minimum Payout
              </Text>
              <Text style={[styles.scheduleText, { color: Colors.subtext }]}>
                GH₵10 (No minimum for daily payouts)
              </Text>
            </View>
          </View>

          <View style={styles.scheduleItem}>
            <AlertCircle size={20} color="#FF9800" />
            <View style={styles.scheduleContent}>
              <Text style={[styles.scheduleTitle, { color: Colors.text }]}>
                Processing Time
              </Text>
              <Text style={[styles.scheduleText, { color: Colors.subtext }]}>
                Usually instant, may take up to 30 minutes
              </Text>
            </View>
          </View>
        </View>

        {/* Payout History */}
        <View style={[styles.historyCard, { backgroundColor: Colors.white }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>
            Recent Payouts
          </Text>
          
          {mockPayoutHistory.map((payout) => (
            <View key={payout.id} style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <Text style={[styles.historyAmount, { color: Colors.text }]}>
                  GH₵{payout.amount}
                </Text>
                <Text style={[styles.historyDate, { color: Colors.subtext }]}>
                  {payout.date}
                </Text>
                <Text style={[styles.historyId, { color: Colors.subtext }]}>
                  {payout.transactionId}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(payout.status) + '20' },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(payout.status) },
                  ]}
                >
                  {getStatusText(payout.status)}
                </Text>
              </View>
            </View>
          ))}
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
  earningsCard: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  earningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  earningsTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  earningsAmount: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 8,
  },
  earningsSubtitle: {
    fontSize: 14,
    opacity: 0.9,
  },
  setupCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  setupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  editButton: {
    padding: 8,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  providersContainer: {
    marginBottom: 20,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  providerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  providerPrefix: {
    fontSize: 12,
  },
  phoneInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  securityCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  securityContent: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  securityText: {
    fontSize: 14,
    lineHeight: 20,
  },
  scheduleCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  scheduleText: {
    fontSize: 14,
  },
  historyCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  historyLeft: {
    flex: 1,
  },
  historyAmount: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 14,
    marginBottom: 2,
  },
  historyId: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});