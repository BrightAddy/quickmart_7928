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
    primary: '#2DCCD3',
    primaryVariant: '#1DB6BD',
    secondary: '#7C9CF1',
    background: '#F5F7FA',
    surface: '#FFFFFF',
    error: '#DC143C',
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onBackground: '#0F172A',
    onSurface: '#0F172A',
    onError: '#FFFFFF'
  }
};

const darkTheme: AppTheme = {
  colors: {
    primary: '#2DCCD3',
    primaryVariant: '#1DB6BD',
    secondary: '#7C9CF1',
    background: '#0B0F16',
    surface: '#121826',
    error: '#EF5350',
    onPrimary: '#000000',
    onSecondary: '#000000',
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


