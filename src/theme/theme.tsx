import React, { createContext, useContext, PropsWithChildren } from 'react';
import { Platform, ColorSchemeName, useColorScheme } from 'react-native';

type AppTheme = {
  colors: {
    primary: string;
    primaryVariant: string;
    secondary: string;
    background: string;
    surface: string;
    error: string;
    onPrimary: string;
    onSecondary: string;
    onBackground: string;
    onSurface: string;
    onError: string;
  };
};

const lightTheme: AppTheme = {
  colors: {
    primary: '#2E7D32', // Forest Green (Ghana flag inspired)
    primaryVariant: '#1B5E20',
    secondary: '#FFB300', // Golden Yellow (Ghana flag inspired)
    background: '#F8F9FA', // Slightly warmer white
    surface: '#FFFFFF',
    error: '#DC143C', // Crimson Red (Ghana flag inspired)
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onBackground: '#1A1A1A', // Richer black
    onSurface: '#1A1A1A',
    onError: '#FFFFFF'
  }
};

const darkTheme: AppTheme = {
  colors: {
    primary: '#4CAF50',
    primaryVariant: '#2E7D32',
    secondary: '#FFB74D',
    background: '#121212',
    surface: '#1E1E1E',
    error: '#EF5350',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    onError: '#000000'
  }
};

const ThemeContext = createContext<AppTheme>(lightTheme);

export function ThemeProvider({ children }: PropsWithChildren) {
  const scheme: ColorSchemeName = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}


