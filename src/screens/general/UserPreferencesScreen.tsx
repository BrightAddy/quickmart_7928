import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Animated,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/theme';
import { Screen, Title, Body, KenteAccent, AdinkraLoader } from '../../components/UI';

type Props = NativeStackScreenProps<RootStackParamList, 'UserPreferences'>;

interface UserPreferences {
  language: 'en' | 'tw' | 'ga' | 'ew';
  notifications: boolean;
  locationServices: boolean;
  darkMode: boolean;
  currency: 'GHS' | 'USD';
  autoTranslate: boolean;
  culturalContent: boolean;
  voiceAssistant: boolean;
}

const languageOptions = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'tw', name: 'Twi', nativeName: 'Twi', flag: '🇬🇭' },
  { code: 'ga', name: 'Ga', nativeName: 'Ga', flag: '🇬🇭' },
  { code: 'ew', name: 'Ewe', nativeName: 'Eʋegbe', flag: '🇬🇭' },
];

const currencyOptions = [
  { code: 'GHS', name: 'Ghana Cedi', symbol: '₵' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
];

export default function UserPreferencesScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: 'en',
    notifications: true,
    locationServices: true,
    darkMode: false,
    currency: 'GHS',
    autoTranslate: true,
    culturalContent: true,
    voiceAssistant: false,
  });
  const [saving, setSaving] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const savePreferences = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    
    Alert.alert(
      'Preferences Saved',
      'Your settings have been updated successfully!',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Reset Preferences',
      'Are you sure you want to reset all settings to default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setPreferences({
              language: 'en',
              notifications: true,
              locationServices: true,
              darkMode: false,
              currency: 'GHS',
              autoTranslate: true,
              culturalContent: true,
              voiceAssistant: false,
            });
          }
        }
      ]
    );
  };

  const PreferenceSection: React.FC<{ 
    title: string; 
    children: React.ReactNode;
    delay?: number;
  }> = ({ title, children, delay = 0 }) => {
    const sectionAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(sectionAnim, {
        toValue: 1,
        duration: 500,
        delay: delay * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View style={[
        styles.section,
        { 
          backgroundColor: colors.surface,
          opacity: sectionAnim,
          transform: [{
            translateY: sectionAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            })
          }]
        }
      ]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>{title}</Text>
        {children}
      </Animated.View>
    );
  };

  const LanguageOption: React.FC<{ option: typeof languageOptions[0] }> = ({ option }) => (
    <TouchableOpacity
      style={[
        styles.languageOption,
        { 
          borderColor: preferences.language === option.code ? colors.primary : colors.onSurface + '22',
          backgroundColor: preferences.language === option.code ? colors.primary + '11' : 'transparent'
        }
      ]}
      onPress={() => updatePreference('language', option.code as any)}
    >
      <Text style={styles.flagEmoji}>{option.flag}</Text>
      <View style={styles.languageInfo}>
        <Text style={[styles.languageName, { color: colors.onSurface }]}>{option.name}</Text>
        <Text style={[styles.languageNative, { color: colors.onSurface + '88' }]}>
          {option.nativeName}
        </Text>
      </View>
      {preferences.language === option.code && (
        <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const ToggleOption: React.FC<{
    label: string;
    description: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    icon?: string;
  }> = ({ label, description, value, onValueChange, icon }) => (
    <View style={styles.toggleOption}>
      <View style={styles.toggleInfo}>
        {icon && <Text style={styles.optionIcon}>{icon}</Text>}
        <View style={styles.toggleText}>
          <Text style={[styles.toggleLabel, { color: colors.onSurface }]}>{label}</Text>
          <Text style={[styles.toggleDescription, { color: colors.onSurface + '88' }]}>
            {description}
          </Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.onSurface + '22', true: colors.primary + '44' }}
        thumbColor={value ? colors.primary : colors.onSurface + '66'}
      />
    </View>
  );

  return (
    <Screen style={styles.container}>
      <KenteAccent style={styles.kenteAccent} animated />
      
      <View style={[styles.header, { borderBottomColor: colors.primary + '22' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Title style={{ color: colors.onBackground }}>Preferences</Title>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <PreferenceSection title="Language & Region" delay={1}>
          <Text style={[styles.sectionDescription, { color: colors.onSurface + '99' }]}>
            Choose your preferred language for the app interface and AI assistant
          </Text>
          {languageOptions.map((option, index) => (
            <LanguageOption key={option.code} option={option} />
          ))}
          
          <View style={styles.currencyContainer}>
            <Text style={[styles.currencyLabel, { color: colors.onSurface }]}>Currency</Text>
            <View style={styles.currencyOptions}>
              {currencyOptions.map((currency) => (
                <TouchableOpacity
                  key={currency.code}
                  style={[
                    styles.currencyOption,
                    {
                      backgroundColor: preferences.currency === currency.code 
                        ? colors.primary 
                        : colors.onSurface + '11',
                      borderColor: preferences.currency === currency.code 
                        ? colors.primary 
                        : colors.onSurface + '22'
                    }
                  ]}
                  onPress={() => updatePreference('currency', currency.code as any)}
                >
                  <Text style={[
                    styles.currencySymbol,
                    { color: preferences.currency === currency.code ? colors.onPrimary : colors.onSurface }
                  ]}>
                    {currency.symbol}
                  </Text>
                  <Text style={[
                    styles.currencyName,
                    { color: preferences.currency === currency.code ? colors.onPrimary : colors.onSurface }
                  ]}>
                    {currency.code}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </PreferenceSection>

        <PreferenceSection title="AI Features" delay={2}>
          <ToggleOption
            label="Auto-translate products"
            description="Automatically translate product names to your preferred language"
            value={preferences.autoTranslate}
            onValueChange={(value) => updatePreference('autoTranslate', value)}
            icon="🔤"
          />
          <ToggleOption
            label="Voice Assistant"
            description="Enable voice commands for hands-free shopping"
            value={preferences.voiceAssistant}
            onValueChange={(value) => updatePreference('voiceAssistant', value)}
            icon="🎤"
          />
          <ToggleOption
            label="Cultural Content"
            description="Show Ghanaian cultural elements and local product recommendations"
            value={preferences.culturalContent}
            onValueChange={(value) => updatePreference('culturalContent', value)}
            icon="🏛️"
          />
        </PreferenceSection>

        <PreferenceSection title="App Settings" delay={3}>
          <ToggleOption
            label="Push Notifications"
            description="Receive updates about orders, promotions, and new features"
            value={preferences.notifications}
            onValueChange={(value) => updatePreference('notifications', value)}
            icon="🔔"
          />
          <ToggleOption
            label="Location Services"
            description="Allow location access for better delivery and store recommendations"
            value={preferences.locationServices}
            onValueChange={(value) => updatePreference('locationServices', value)}
            icon="📍"
          />
          <ToggleOption
            label="Dark Mode"
            description="Use dark theme for better viewing in low light"
            value={preferences.darkMode}
            onValueChange={(value) => updatePreference('darkMode', value)}
            icon="🌙"
          />
        </PreferenceSection>

        <PreferenceSection title="Actions" delay={4}>
          <TouchableOpacity
            style={[styles.actionButton, styles.resetButton, { borderColor: colors.error }]}
            onPress={resetToDefaults}
          >
            <Text style={[styles.actionButtonText, { color: colors.error }]}>
              Reset to Defaults
            </Text>
          </TouchableOpacity>
        </PreferenceSection>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.primary + '22' }]}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            { 
              backgroundColor: colors.primary,
              opacity: saving ? 0.7 : 1
            }
          ]}
          onPress={savePreferences}
          disabled={saving}
        >
          {saving ? (
            <AdinkraLoader size={24} symbol="nkyinkyim" />
          ) : (
            <Text style={[styles.saveButtonText, { color: colors.onPrimary }]}>
              Save Preferences
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  kenteAccent: {
    top: 20,
    right: 20,
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 8,
  },
  flagEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  languageNative: {
    fontSize: 14,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  currencyContainer: {
    marginTop: 20,
  },
  currencyLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  currencyOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  currencyOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  currencyName: {
    fontSize: 14,
    fontWeight: '600',
  },
  toggleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  toggleText: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  toggleDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  resetButton: {
    marginTop: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  saveButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
