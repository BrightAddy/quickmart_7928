import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MapPin, CheckCircle, Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from '@/components/Button';

const DELIVERY_ZONES = [
  { id: '1', name: 'Accra Central', distance: '5 km', active: true },
  { id: '2', name: 'East Legon', distance: '8 km', active: true },
  { id: '3', name: 'Cantonments', distance: '6 km', active: false },
  { id: '4', name: 'Airport Residential', distance: '12 km', active: false },
  { id: '5', name: 'Tema', distance: '25 km', active: false },
  { id: '6', name: 'Madina', distance: '15 km', active: false },
  { id: '7', name: 'Adenta', distance: '18 km', active: false },
  { id: '8', name: 'Spintex', distance: '10 km', active: true },
];

export default function DeliveryZoneScreen() {
  const [zones, setZones] = useState(DELIVERY_ZONES);
  const [hasChanges, setHasChanges] = useState(false);

  const toggleZone = (zoneId: string) => {
    setZones(prev => prev.map(zone => {
      if (zone.id === zoneId) {
        return { ...zone, active: !zone.active };
      }
      return zone;
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    Alert.alert(
      'Save Changes',
      'Your delivery zone preferences have been updated successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            setHasChanges(false);
            // In a real app, you would save to backend here
          }
        }
      ]
    );
  };

  const activeZones = zones.filter(zone => zone.active);
  const totalDistance = activeZones.reduce((sum, zone) => {
    return sum + parseInt(zone.distance.replace(' km', ''));
  }, 0);

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen 
        options={{ 
          title: 'Delivery Zone',
          headerStyle: { backgroundColor: Colors.white },
          headerTintColor: Colors.text,
        }} 
      />

      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <MapPin size={24} color={Colors.primary} />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Set Your Delivery Areas</Text>
          <Text style={styles.headerSubtitle}>Choose zones where you want to deliver</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{activeZones.length}</Text>
          <Text style={styles.statLabel}>Active Zones</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalDistance} km</Text>
          <Text style={styles.statLabel}>Coverage Area</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Delivery Zones</Text>
        <Text style={styles.sectionSubtitle}>
          Select the areas where you're willing to make deliveries. You can change these anytime.
        </Text>

        {zones.map((zone) => (
          <View key={zone.id} style={styles.zoneCard}>
            <View style={styles.zoneInfo}>
              <View style={styles.zoneHeader}>
                <Text style={styles.zoneName}>{zone.name}</Text>
                <View style={[
                  styles.zoneStatus,
                  zone.active ? styles.zoneStatusActive : styles.zoneStatusInactive
                ]}>
                  {zone.active ? (
                    <CheckCircle size={16} color={Colors.success} />
                  ) : (
                    <Clock size={16} color={Colors.subtext} />
                  )}
                  <Text style={[
                    styles.zoneStatusText,
                    zone.active ? styles.zoneStatusTextActive : styles.zoneStatusTextInactive
                  ]}>
                    {zone.active ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
              <Text style={styles.zoneDistance}>Distance from you: {zone.distance}</Text>
            </View>
            <Switch
              value={zone.active}
              onValueChange={() => toggleZone(zone.id)}
              trackColor={{ false: Colors.lightGray, true: Colors.primary + '30' }}
              thumbColor={zone.active ? Colors.primary : Colors.lightGray}
            />
          </View>
        ))}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>How it works</Text>
        <View style={styles.infoItem}>
          <View style={styles.infoBullet} />
          <Text style={styles.infoText}>
            You'll receive delivery requests only from your selected zones
          </Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoBullet} />
          <Text style={styles.infoText}>
            Delivery fees may vary based on distance and zone
          </Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoBullet} />
          <Text style={styles.infoText}>
            You can update your zones anytime in your profile
          </Text>
        </View>
      </View>

      {hasChanges && (
        <View style={styles.saveContainer}>
          <Button
            title="Save Changes"
            onPress={handleSave}
            style={styles.saveButton}
          />
        </View>
      )}
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
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.subtext,
    textAlign: 'center',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.subtext,
    lineHeight: 20,
    marginBottom: 20,
  },
  zoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  zoneInfo: {
    flex: 1,
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  zoneName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  zoneStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  zoneStatusActive: {
    backgroundColor: Colors.success + '20',
  },
  zoneStatusInactive: {
    backgroundColor: Colors.lightGray,
  },
  zoneStatusText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  zoneStatusTextActive: {
    color: Colors.success,
  },
  zoneStatusTextInactive: {
    color: Colors.subtext,
  },
  zoneDistance: {
    fontSize: 14,
    color: Colors.subtext,
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
  saveContainer: {
    padding: 20,
  },
  saveButton: {
    marginBottom: 20,
  },
});