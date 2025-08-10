import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Colors from '@/constants/colors';

interface Step {
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  const { width } = useWindowDimensions();
  const stepWidth = (width - 48) / steps.length;
  
  return (
    <View style={styles.container}>
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <View 
              key={index} 
              style={[
                styles.step,
                { width: stepWidth },
              ]}
            >
              <View 
                style={[
                  styles.stepCircle,
                  isActive && styles.activeStepCircle,
                  isCompleted && styles.completedStepCircle,
                ]}
              >
                <Text 
                  style={[
                    styles.stepNumber,
                    (isActive || isCompleted) && styles.activeStepNumber,
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
              
              <Text 
                style={[
                  styles.stepTitle,
                  isActive && styles.activeStepTitle,
                  isCompleted && styles.completedStepTitle,
                ]}
                numberOfLines={1}
              >
                {step.title}
              </Text>
            </View>
          );
        })}
      </View>
      
      <View style={styles.progressContainer}>
        <View 
          style={[
            styles.progressBar,
            { 
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  step: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeStepCircle: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  completedStepCircle: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.subtext,
  },
  activeStepNumber: {
    color: Colors.white,
  },
  stepTitle: {
    fontSize: 10,
    color: Colors.subtext,
    textAlign: 'center',
  },
  activeStepTitle: {
    color: Colors.primary,
    fontWeight: '500',
  },
  completedStepTitle: {
    color: Colors.text,
  },
  progressContainer: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
});

export default StepIndicator;