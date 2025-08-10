import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/auth-store';

export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Redirect based on authentication status and user role
    const redirect = () => {
      try {
        if (!isAuthenticated || !user) {
          router.replace('/(auth)');
          return;
        }

        // Redirect based on user role
        switch (user.role) {
          case 'customer':
            router.replace('/(customer)');
            break;
          case 'employee':
            router.replace('/(employee)');
            break;
          case 'store_owner':
            router.replace('/(store)');
            break;
          default:
            router.replace('/(auth)');
        }
      } catch (error) {
        console.log('Redirect error:', error);
        // Fallback to auth if there's any error
        router.replace('/(auth)');
      }
    };

    // Small delay to ensure stores are hydrated
    const timer = setTimeout(redirect, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, user, router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#4361EE" />
    </View>
  );
}