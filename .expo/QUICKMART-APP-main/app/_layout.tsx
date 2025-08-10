import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, ActivityIndicator } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { getColors } from "@/constants/colors";
import { useThemeStore } from "@/store/theme-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Utility function to add timeout to any promise
const withTimeout = function<T>(promise: Promise<T>, timeoutMs: number = 5000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

// Make it available globally for debugging
if (typeof global !== 'undefined') {
  (global as any).withTimeout = withTimeout;
}

export const unstable_settings = {
  initialRouteName: "(auth)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create a client with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const [isThemeReady, setIsThemeReady] = useState(false);
  
  useEffect(() => {
    // Add a small delay to ensure theme store is hydrated
    const timer = setTimeout(() => {
      setIsThemeReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isThemeReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 16, color: '#666' }}>Loading...</Text>
      </View>
    );
  }
  
  return <RootLayoutContent />;
}

function RootLayoutContent() {
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackTitle: "Back",
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(customer)" options={{ headerShown: false }} />
        <Stack.Screen name="(employee)" options={{ headerShown: false }} />
        <Stack.Screen name="(store)" options={{ headerShown: false }} />
        
        {/* These routes are accessible but won't appear as tabs */}
        <Stack.Screen name="order/[id]" options={{ headerShown: true, presentation: 'modal' }} />
        <Stack.Screen name="store/[id]" options={{ headerShown: true, presentation: 'modal' }} />
        <Stack.Screen name="checkout" options={{ 
          headerShown: true, 
          presentation: 'modal',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
        }} />
      </Stack>
    </>
  );
}