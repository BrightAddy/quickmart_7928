const LightColors = {
  primary: '#4361EE',
  secondary: '#3F37C9',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  
  text: '#333333',
  subtext: '#757575',
  background: '#F5F7FA',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#9E9E9E',
  border: '#E0E0E0',
  
  lightPrimary: '#EEF2FF',
  card: '#F9FAFC',
  lightGray: '#F0F0F0',
};

const DarkColors = {
  primary: '#4361EE',
  secondary: '#3F37C9',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  
  text: '#FFFFFF',
  subtext: '#B0B0B0',
  background: '#121212',
  white: '#1E1E1E',
  black: '#FFFFFF',
  gray: '#666666',
  border: '#333333',
  
  lightPrimary: '#1A1A2E',
  card: '#1E1E1E',
  lightGray: '#2A2A2A',
};

export const getColors = (isDarkMode: boolean) => {
  return isDarkMode ? DarkColors : LightColors;
};

// Default export for backward compatibility
const Colors = {
  ...LightColors,
  gray: LightColors.subtext,
  black: '#000000'
};
export default Colors;