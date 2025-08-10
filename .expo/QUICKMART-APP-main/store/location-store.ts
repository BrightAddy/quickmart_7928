import { create } from 'zustand';
import * as Location from 'expo-location';
import { Store } from '@/types';
import { mockStores } from '@/mocks/stores';

interface LocationState {
  userLocation: { latitude: number; longitude: number } | null;
  isLoading: boolean;
  error: string | null;
  requestLocationPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<void>;
  getNearbyStores: (radius: number, storeList?: Store[]) => Store[];
}

export const useLocationStore = create<LocationState>((set, get) => ({
  userLocation: null,
  isLoading: false,
  error: null,
  
  requestLocationPermission: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        set({ error: 'Permission to access location was denied', isLoading: false });
        return false;
      }
      
      return true;
    } catch (error) {
      set({ error: 'Failed to request location permission', isLoading: false });
      return false;
    }
  },
  
  getCurrentLocation: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Add timeout to prevent hanging
      const location = await Promise.race([
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Location timeout')), 8000)
        )
      ]) as Location.LocationObject;
      
      set({
        userLocation: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        },
        isLoading: false
      });
    } catch (error) {
      console.log('Location error:', error);
      set({ error: 'Failed to get current location', isLoading: false });
    }
  },
  
  getNearbyStores: (radius, storeList = mockStores) => {
    const { userLocation } = get();
    
    if (!userLocation) return storeList;
    
    // Calculate distance between two coordinates in kilometers
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // Radius of the earth in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c; // Distance in km
      return distance;
    };
    
    // Filter stores within the radius and add distance property
    return storeList
      .map(store => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          store.latitude,
          store.longitude
        );
        
        return { ...store, distance };
      })
      .filter(store => store.distance <= radius)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }
}));