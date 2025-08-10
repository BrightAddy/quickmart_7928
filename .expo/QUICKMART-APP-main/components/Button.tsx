import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  View
} from 'react-native';
import Colors from '@/constants/colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
  ...props
}) => {
  const getButtonStyle = () => {
    let buttonStyle: ViewStyle = {};
    
    // Variant styles
    switch (variant) {
      case 'primary':
        buttonStyle = {
          backgroundColor: Colors.primary,
          borderWidth: 0,
        };
        break;
      case 'secondary':
        buttonStyle = {
          backgroundColor: Colors.secondary,
          borderWidth: 0,
        };
        break;
      case 'outline':
        buttonStyle = {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: Colors.primary,
        };
        break;
      case 'text':
        buttonStyle = {
          backgroundColor: 'transparent',
          borderWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        };
        break;
    }
    
    // Size styles
    switch (size) {
      case 'small':
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: 8,
          paddingHorizontal: 16,
        };
        break;
      case 'medium':
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: 12,
          paddingHorizontal: 24,
        };
        break;
      case 'large':
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: 16,
          paddingHorizontal: 32,
        };
        break;
    }
    
    // Disabled state
    if (disabled || isLoading) {
      buttonStyle = {
        ...buttonStyle,
        opacity: 0.6,
      };
    }
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    let textStyleObj: TextStyle = {};
    
    // Variant text styles
    switch (variant) {
      case 'primary':
      case 'secondary':
        textStyleObj = {
          color: Colors.white,
        };
        break;
      case 'outline':
      case 'text':
        textStyleObj = {
          color: Colors.primary,
        };
        break;
    }
    
    // Size text styles
    switch (size) {
      case 'small':
        textStyleObj = {
          ...textStyleObj,
          fontSize: 14,
        };
        break;
      case 'medium':
        textStyleObj = {
          ...textStyleObj,
          fontSize: 16,
        };
        break;
      case 'large':
        textStyleObj = {
          ...textStyleObj,
          fontSize: 18,
        };
        break;
    }
    
    return textStyleObj;
  };
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        getButtonStyle(),
        style
      ]}
      activeOpacity={0.7}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={variant === 'primary' || variant === 'secondary' ? Colors.white : Colors.primary} 
          size="small" 
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconContainer}>
              {icon}
            </View>
          )}
          <Text style={[
            styles.text,
            getTextStyle(),
            icon && { marginLeft: iconPosition === 'right' ? 0 : 8, marginRight: iconPosition === 'left' ? 0 : 8 },
            textStyle
          ]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconContainer}>
              {icon}
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Button;