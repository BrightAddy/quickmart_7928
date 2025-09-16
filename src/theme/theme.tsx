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
    primary: '#1CA77C',
    primaryVariant: '#16936A',
    secondary: '#1CA77C',
    background: '#F5F7FA',
    surface: '#FFFFFF',
    error: '#DC143C',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: '#0F172A',
    onSurface: '#0F172A',
    onError: '#FFFFFF'
  }
};

const darkTheme: AppTheme = {
  colors: {
    primary: '#1CA77C',
    primaryVariant: '#16936A',
    secondary: '#1CA77C',
    background: '#0B0F16',
    surface: '#121826',
    error: '#EF5350',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: '#F8FAFC',
    onSurface: '#F8FAFC',
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

// Allow subtree overrides (e.g., shopper UI themed separately)
export function ThemeOverrideProvider({ theme, children }: { theme: AppTheme; children: React.ReactNode }) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

// Predefined shopper orange theme
export const shopperOrangeTheme: AppTheme = {
  colors: {
    primary: '#F97316',
    primaryVariant: '#EA580C',
    secondary: '#F97316',
    background: '#F5F7FA',
    surface: '#FFFFFF',
    error: '#DC143C',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: '#0F172A',
    onSurface: '#0F172A',
    onError: '#FFFFFF'
  }
};

export const storeOwnerBlueTheme: AppTheme = {
  colors: {
    primary: '#2563EB',
    primaryVariant: '#1D4ED8',
    secondary: '#2563EB',
    background: '#F5F7FA',
    surface: '#FFFFFF',
    error: '#DC143C',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: '#0F172A',
    onSurface: '#0F172A',
    onError: '#FFFFFF'
  }
};

