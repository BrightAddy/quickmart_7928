import { Redirect } from 'expo-router';

export default function StoreIndex() {
  // Redirect to the tabs layout
  return <Redirect href="/(store)/(tabs)" />;
}