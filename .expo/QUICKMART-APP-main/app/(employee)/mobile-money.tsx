import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CreditCard, Smartphone, Plus, Edit3, Trash2, CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import Input from '@/components/Input';

const MOMO_PROVIDERS = [
  { id: 'mtn', name: 'MTN Mobile Money', color: '#FFCC00', logo: '📱' },
  { id: 'vodafone', name: 'Vodafone Cash', color: '#E60000', logo: '📱' },
  { id: 'airteltigo', name: 'AirtelTigo Money', color: '#FF6600', logo: '📱' },
];

const SAVED_ACCOUNTS = [
  {
    id: '1',
    provider: 'mtn',
    number: '0244123456',
    name: 'John Doe',
    isPrimary: true
  },
  {
    id: '2',
    provider: 'vodafone',
    number: '0201987654',
    name: 'John Doe',
    isPrimary: false
  }
];

export default function MobileMoneyScreen() {
  const [accounts, setAccounts] = useState(SAVED_ACCOUNTS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  const handleAddAccount = () => {
    if (!selectedProvider || !phoneNumber || !accountName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newAccount = {
      id: Date.now().toString(),
      provider: selectedProvider,
      number: phoneNumber,
      name: accountName,
      isPrimary: accounts.length === 0
    };

    setAccounts(prev => [...prev, newAccount]);
    setShowAddForm(false);
    setSelectedProvider('');
    setPhoneNumber('');
    setAccountName('');
    
    Alert.alert('Success', 'Mobile money account added successfully!');
  };

  const handleSetPrimary = (accountId: string) => {
    setAccounts(prev => prev.map(account => ({
      ...account,
      isPrimary: account.id === accountId
    })));
    Alert.alert('Success', 'Primary account updated successfully!');
  };

  const handleDeleteAccount = (accountId: string) => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete this mobile money account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAccounts(prev => prev.filter(account => account.id !== accountId));
          }
        }
      ]
    );
  };

  const getProviderInfo = (providerId: string) => {
    return MOMO_PROVIDERS.find(p => p.id === providerId) || MOMO_PROVIDERS[0];
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen 
        options={{ 
          title: 'Mobile Money',
          headerStyle: { backgroundColor: Colors.white },
          headerTintColor: Colors.text,
        }} 
      />

      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Smartphone size={24} color={Colors.primary} />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Mobile Money Accounts</Text>
          <Text style={styles.headerSubtitle}>Manage your payment methods for earnings</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Saved Accounts</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
          >
            <Plus size={20} color={Colors.primary} />
            <Text style={styles.addButtonText}>Add Account</Text>
          </TouchableOpacity>
        </View>

        {accounts.length > 0 ? (
          accounts.map((account) => {
            const provider = getProviderInfo(account.provider);
            return (
              <View key={account.id} style={styles.accountCard}>
                <View style={styles.accountHeader}>
                  <View style={styles.accountInfo}>
                    <View style={[styles.providerIcon, { backgroundColor: provider.color + '20' }]}>
                      <Text style={styles.providerEmoji}>{provider.logo}</Text>
                    </View>
                    <View style={styles.accountDetails}>
                      <Text style={styles.accountProvider}>{provider.name}</Text>
                      <Text style={styles.accountNumber}>{account.number}</Text>
                      <Text style={styles.accountName}>{account.name}</Text>
                    </View>
                  </View>
                  
                  {account.isPrimary && (
                    <View style={styles.primaryBadge}>
                      <CheckCircle size={16} color={Colors.success} />
                      <Text style={styles.primaryText}>Primary</Text>
                    </View>
                  )}
                </View>

                <View style={styles.accountActions}>
                  {!account.isPrimary && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleSetPrimary(account.id)}
                    >
                      <Text style={styles.actionButtonText}>Set as Primary</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteAccount(account.id)}
                  >
                    <Trash2 size={16} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <CreditCard size={48} color={Colors.subtext} />
            <Text style={styles.emptyStateTitle}>No Mobile Money Accounts</Text>
            <Text style={styles.emptyStateSubtitle}>
              Add a mobile money account to receive your earnings
            </Text>
          </View>
        )}
      </View>

      {showAddForm && (
        <View style={styles.addFormContainer}>
          <View style={styles.addFormHeader}>
            <Text style={styles.addFormTitle}>Add Mobile Money Account</Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowAddForm(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.providerSelection}>
            <Text style={styles.inputLabel}>Select Provider</Text>
            <View style={styles.providerGrid}>
              {MOMO_PROVIDERS.map((provider) => (
                <TouchableOpacity
                  key={provider.id}
                  style={[
                    styles.providerCard,
                    selectedProvider === provider.id && styles.providerCardSelected
                  ]}
                  onPress={() => setSelectedProvider(provider.id)}
                >
                  <Text style={styles.providerCardEmoji}>{provider.logo}</Text>
                  <Text style={styles.providerCardName}>{provider.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Input
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="0244123456"
            keyboardType="phone-pad"
            style={styles.input}
          />

          <Input
            label="Account Name"
            value={accountName}
            onChangeText={setAccountName}
            placeholder="Enter account holder name"
            style={styles.input}
          />

          <Button
            title="Add Account"
            onPress={handleAddAccount}
            style={styles.addAccountButton}
          />
        </View>
      )}

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Important Information</Text>
        <View style={styles.infoItem}>
          <View style={styles.infoBullet} />
          <Text style={styles.infoText}>
            Your earnings will be sent to your primary mobile money account
          </Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoBullet} />
          <Text style={styles.infoText}>
            Payments are processed within 24 hours after completion
          </Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoBullet} />
          <Text style={styles.infoText}>
            Ensure your mobile money account is active and verified
          </Text>
        </View>
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 4,
  },
  accountCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  providerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  providerEmoji: {
    fontSize: 20,
  },
  accountDetails: {
    flex: 1,
  },
  accountProvider: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  accountNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
    marginBottom: 2,
  },
  accountName: {
    fontSize: 12,
    color: Colors.subtext,
  },
  primaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  primaryText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.success,
    marginLeft: 4,
  },
  accountActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
  deleteButton: {
    borderColor: Colors.error,
    paddingHorizontal: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'center',
    lineHeight: 20,
  },
  addFormContainer: {
    backgroundColor: Colors.lightGray,
    margin: 20,
    borderRadius: 12,
    padding: 20,
  },
  addFormHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addFormTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelButtonText: {
    fontSize: 14,
    color: Colors.error,
    fontWeight: '500',
  },
  providerSelection: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  providerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  providerCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  providerCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  providerCardEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  providerCardName: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  addAccountButton: {
    marginTop: 8,
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
});