import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      
      toggleDarkMode: () => {
        try {
          set((state) => ({ isDarkMode: !state.isDarkMode }));
        } catch (error) {
          console.log('Theme toggle error:', error);
        }
      },
      
      setDarkMode: (isDark: boolean) => {
        try {
          set({ isDarkMode: isDark });
        } catch (error) {
          console.log('Theme set error:', error);
        }
      },
    }),
    {
      name: 'quickmart-theme',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        console.log('Theme hydration complete:', state);
      },
    }
  )
);