import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface PasswordStrengthProps {
  strength: number; // 0-5 scale
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ strength }) => {
  const getStrengthLabel = () => {
    switch (strength) {
      case 0:
        return 'No password';
      case 1:
        return 'Very weak';
      case 2:
        return 'Weak';
      case 3:
        return 'Fair';
      case 4:
        return 'Good';
      case 5:
        return 'Strong';
      default:
        return '';
    }
  };
  
  const getStrengthColor = () => {
    switch (strength) {
      case 0:
      case 1:
        return Colors.error;
      case 2:
        return '#FF9800'; // Orange
      case 3:
        return '#FFC107'; // Amber
      case 4:
        return '#8BC34A'; // Light Green
      case 5:
        return '#4CAF50'; // Green
      default:
        return Colors.border;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Password Strength:</Text>
        <Text style={[styles.strengthLabel, { color: getStrengthColor() }]}>
          {getStrengthLabel()}
        </Text>
      </View>
      
      <View style={styles.barContainer}>
        {[1, 2, 3, 4, 5].map((index) => (
          <View
            key={index}
            style={[
              styles.strengthSegment,
              {
                backgroundColor: index <= strength ? getStrengthColor() : Colors.border,
              },
            ]}
          />
        ))}
      </View>
      
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Tips for a strong password:</Text>
        <Text style={styles.tip}>• Use at least 8 characters</Text>
        <Text style={styles.tip}>• Include uppercase and lowercase letters</Text>
        <Text style={styles.tip}>• Include numbers and special characters</Text>
        <Text style={styles.tip}>• Avoid common words or phrases</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.subtext,
  },
  strengthLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  barContainer: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  strengthSegment: {
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 3,
  },
  tipsContainer: {
    backgroundColor: Colors.lightGray,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  tipsTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  tip: {
    fontSize: 12,
    color: Colors.subtext,
    marginBottom: 2,
  },
});

export default PasswordStrength;