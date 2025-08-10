import { Stack } from "expo-router";
import { getColors } from "@/constants/colors";
import { useThemeStore } from "@/store/theme-store";

export default function AuthLayout() {
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="register" options={{ title: "Create Account" }} />
    </Stack>
  );
}