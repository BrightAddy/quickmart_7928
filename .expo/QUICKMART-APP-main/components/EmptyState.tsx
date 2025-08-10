import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Button from './Button';
import { getColors } from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  buttonText?: string;
  onButtonPress?: () => void;
  style?: ViewStyle;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
  buttonText,
  onButtonPress,
  style,
}) => {
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  const styles = createStyles(Colors);
  return (
    <View style={[styles.container, style]}>
      {icon && (
        <View style={styles.iconContainer}>
          {icon}
        </View>
      )}
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      
      {buttonText && onButtonPress && (
        <Button
          title={buttonText}
          onPress={onButtonPress}
          variant="primary"
          style={styles.button}
        />
      )}
    </View>
  );
};

const createStyles = (Colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: Colors.subtext,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    minWidth: 150,
  },
});

export default EmptyState;