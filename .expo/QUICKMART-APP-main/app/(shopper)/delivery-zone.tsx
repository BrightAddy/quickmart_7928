import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MapPin, CheckCircle, Plus, Minus } from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

interface DeliveryZone {
  id: string;
  name: string;
  area: string;
  isActive: boolean;
  estimatedOrders: string;
  distance: string;
}

const availableZones: DeliveryZone[] = [
  {
    id: '1',
    name: 'Osu',
    area: 'Oxford Street, Danquah Circle',
    isActive: true,
    estimatedOrders: '15-20 per day',
    distance: '2.5 km from you',
  },
  {
    id: '2',
    name: 'East Legon',
    area: 'A&C Mall, Junction Mall',
    isActive: true,
    estimatedOrders: '20-25 per day',
    distance: '4.2 km from you',
  },
  {
    id: '3',
    name: 'Accra Mall',
    area: 'Tetteh Quarshie, Spintex',
    isActive: false,
    estimatedOrders: '10-15 per day',
    distance: '6.8 km from you',
  },
  {
    id: '4',
    name: 'Labone',
    area: 'Labone Beach, Cafe area',
    isActive: true,
    estimatedOrders: '8-12 per day',
    distance: '3.1 km from you',
  },
  {
    id: '5',
    name: 'Cantonments',
    area: 'Embassy area, Residential',
    isActive: false,
    estimatedOrders: '12-18 per day',
    distance: '5.5 km from you',
  },
  {
    id: '6',
    name: 'Airport Residential',
    area: 'Kotoka Airport vicinity',
    isActive: false,
    estimatedOrders: '6-10 per day',
    distance: '8.2 km from you',
  },
];

export default function DeliveryZone() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  const [zones, setZones] = useState(availableZones);

  const activeZones = zones.filter(zone => zone.isActive);
  const inactiveZones = zones.filter(zone => !zone.isActive);

  const toggleZone = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return;

    if (zone.isActive) {
      // Deactivating zone
      if (activeZones.length <= 1) {
        Alert.alert(
          'Cannot Remove Zone',
          'You must have at least one active delivery zone.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      Alert.alert(
        'Remove Delivery Zone',
        `Remove ${zone.name} from your delivery zones?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => updateZone(zoneId, false),
          },
        ]
      );
    } else {
      // Activating zone
      if (activeZones.length >= 4) {
        Alert.alert(
          'Maximum Zones Reached',
          'You can have a maximum of 4 active delivery zones.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      Alert.alert(
        'Add Delivery Zone',
        `Add ${zone.name} to your delivery zones?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Add',
            onPress: () => updateZone(zoneId, true),
          },
        ]
      );
    }
  };

  const updateZone = (zoneId: string, isActive: boolean) => {
    setZones(prev =>
      prev.map(zone =>
        zone.id === zoneId ? { ...zone, isActive } : zone
      )
    );
  };

  const renderZoneCard = (zone: DeliveryZone) => (
    <View
      key={zone.id}
      style={[
        styles.zoneCard,
        {
          backgroundColor: Colors.white,
          borderColor: zone.isActive ? '#4464EB' : Colors.border,
          borderWidth: zone.isActive ? 2 : 1,
        },
      ]}
    >
      <View style={styles.zoneHeader}>
        <View style={styles.zoneInfo}>
          <View style={styles.zoneTitleRow}>
            <Text style={[styles.zoneName, { color: Colors.text }]}>
              {zone.name}
            </Text>
            {zone.isActive && (
              <View style={[styles.activeBadge, { backgroundColor: '#4464EB' }]}>
                <CheckCircle size={16} color={Colors.white} />
                <Text style={[styles.activeText, { color: Colors.white }]}>Active</Text>
              </View>
            )}
          </View>
          <Text style={[styles.zoneArea, { color: Colors.subtext }]}>
            {zone.area}
          </Text>
          <View style={styles.zoneStats}>
            <View style={styles.zoneStat}>
              <MapPin size={14} color={Colors.subtext} />
              <Text style={[styles.zoneStatText, { color: Colors.subtext }]}>
                {zone.distance}
              </Text>
            </View>
            <Text style={[styles.zoneOrders, { color: Colors.subtext }]}>
              {zone.estimatedOrders}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={[
            styles.toggleButton,
            {
              backgroundColor: zone.isActive ? '#F44336' : '#4464EB',
            },
          ]}
          onPress={() => toggleZone(zone.id)}
        >
          {zone.isActive ? (
            <Minus size={20} color={Colors.white} />
          ) : (
            <Plus size={20} color={Colors.white} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Delivery Zones',
          headerStyle: {
            backgroundColor: Colors.white,
          },
          headerTintColor: Colors.text,
        }}
      />
      
      <ScrollView style={[styles.container, { backgroundColor: Colors.background }]}>
        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: '#E3F2FD' }]}>
          <MapPin size={24} color="#2196F3" />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: '#1976D2' }]}>
              Choose Your Delivery Zones
            </Text>
            <Text style={[styles.infoText, { color: '#1976D2' }]}>
              Select areas where you want to receive batch notifications. You can have up to 4 active zones.
            </Text>
          </View>
        </View>

        {/* Active Zones */}
        {activeZones.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: Colors.text }]}>
              Active Zones ({activeZones.length}/4)
            </Text>
            {activeZones.map(renderZoneCard)}
          </View>
        )}

        {/* Available Zones */}
        {inactiveZones.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: Colors.text }]}>
              Available Zones
            </Text>
            {inactiveZones.map(renderZoneCard)}
          </View>
        )}

        {/* Tips */}
        <View style={[styles.tipsCard, { backgroundColor: Colors.white }]}>
          <Text style={[styles.tipsTitle, { color: Colors.text }]}>Tips for Better Earnings</Text>
          
          <View style={styles.tip}>
            <Text style={[styles.tipNumber, { color: '#4464EB' }]}>1</Text>
            <Text style={[styles.tipText, { color: Colors.text }]}>
              Choose zones closer to your location to reduce travel time
            </Text>
          </View>
          
          <View style={styles.tip}>
            <Text style={[styles.tipNumber, { color: '#4464EB' }]}>2</Text>
            <Text style={[styles.tipText, { color: Colors.text }]}>
              Areas with higher order volume typically offer more earning opportunities
            </Text>
          </View>
          
          <View style={styles.tip}>
            <Text style={[styles.tipNumber, { color: '#4464EB' }]}>3</Text>
            <Text style={[styles.tipText, { color: Colors.text }]}>
              You can change your zones anytime based on your availability
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
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  zoneCard: {
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  zoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  zoneInfo: {
    flex: 1,
    marginRight: 12,
  },
  zoneTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  zoneName: {
    fontSize: 18,
    fontWeight: '700',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  activeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  zoneArea: {
    fontSize: 14,
    marginBottom: 8,
  },
  zoneStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zoneStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  zoneStatText: {
    fontSize: 12,
  },
  zoneOrders: {
    fontSize: 12,
    fontWeight: '600',
  },
  toggleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipsCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: '700',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});