import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MapPin, Clock, Users, Zap } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function AvailabilityScreen() {
  const [isCurrentlyAvailable, setIsCurrentlyAvailable] = useState(true);

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen 
        options={{ 
          title: 'Availability',
          headerStyle: { backgroundColor: Colors.white },
          headerTintColor: Colors.text,
        }} 
      />

      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Zap size={24} color={Colors.primary} />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Availability Status</Text>
          <Text style={styles.headerSubtitle}>Toggle your availability to start receiving delivery orders</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Status</Text>
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <MapPin size={20} color={isCurrentlyAvailable ? Colors.success : Colors.subtext} />
            <Text style={[styles.statusTitle, { color: isCurrentlyAvailable ? Colors.success : Colors.subtext }]}>
              {isCurrentlyAvailable ? 'Available Now' : 'Currently Offline'}
            </Text>
            <Switch
              value={isCurrentlyAvailable}
              onValueChange={setIsCurrentlyAvailable}
              trackColor={{ false: Colors.lightGray, true: Colors.success + '30' }}
              thumbColor={isCurrentlyAvailable ? Colors.success : Colors.lightGray}
            />
          </View>
          <Text style={styles.statusSubtitle}>
            {isCurrentlyAvailable 
              ? 'You\'re currently available for deliveries in your selected zones'
              : 'Toggle on to start receiving delivery requests'
            }
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionCard}>
          <View style={styles.actionHeader}>
            <Clock size={20} color={Colors.primary} />
            <Text style={styles.actionTitle}>Instant Availability</Text>
          </View>
          <Text style={styles.actionSubtitle}>
            Toggle on to immediately start receiving delivery requests in your area
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status Overview</Text>
        
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <MapPin size={20} color={Colors.primary} />
              <Text style={styles.summaryLabel}>Current Status</Text>
              <Text style={[styles.summaryValue, { color: isCurrentlyAvailable ? Colors.success : Colors.subtext }]}>
                {isCurrentlyAvailable ? 'Online' : 'Offline'}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Users size={20} color={Colors.secondary} />
              <Text style={styles.summaryLabel}>Ready for Orders</Text>
              <Text style={[styles.summaryValue, { color: isCurrentlyAvailable ? Colors.success : Colors.subtext }]}>
                {isCurrentlyAvailable ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 How It Works</Text>
          <Text style={styles.infoText}>• Toggle your availability on/off anytime</Text>
          <Text style={styles.infoText}>• Receive orders only when you're online</Text>
          <Text style={styles.infoText}>• Work whenever it's convenient for you</Text>
          <Text style={styles.infoText}>• Complete flexibility with your schedule</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 16,
    lineHeight: 20,
  },
  actionCard: {
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  actionSubtitle: {
    fontSize: 14,
    color: Colors.subtext,
    lineHeight: 20,
  },
  summaryCard: {
    padding: 16,
    backgroundColor: Colors.lightPrimary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.subtext,
    marginTop: 4,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statusCard: {
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  statusSubtitle: {
    fontSize: 14,
    color: Colors.subtext,
    lineHeight: 20,
  },
  infoCard: {
    padding: 16,
    backgroundColor: Colors.lightPrimary,
    borderRadius: 12,
    marginTop: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },
});