import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { BookOpen, Play, CheckCircle, Clock, Award, Download } from 'lucide-react-native';
import Colors from '@/constants/colors';

const TRAINING_MODULES = [
  {
    id: '1',
    title: 'Food Safety & Hygiene',
    description: 'Learn proper food handling and safety protocols',
    duration: '15 min',
    completed: true,
    progress: 100,
    type: 'video'
  },
  {
    id: '2',
    title: 'Customer Service Excellence',
    description: 'Best practices for customer interactions',
    duration: '20 min',
    completed: true,
    progress: 100,
    type: 'video'
  },
  {
    id: '3',
    title: 'Delivery Best Practices',
    description: 'Efficient and safe delivery techniques',
    duration: '25 min',
    completed: false,
    progress: 60,
    type: 'video'
  },
  {
    id: '4',
    title: 'App Navigation Guide',
    description: 'Master the delivery app features',
    duration: '10 min',
    completed: false,
    progress: 0,
    type: 'interactive'
  },
  {
    id: '5',
    title: 'Emergency Procedures',
    description: 'What to do in emergency situations',
    duration: '12 min',
    completed: false,
    progress: 0,
    type: 'document'
  }
];

const CERTIFICATIONS = [
  {
    id: '1',
    title: 'Food Safety Certified',
    issueDate: '2024-01-15',
    expiryDate: '2025-01-15',
    status: 'active'
  },
  {
    id: '2',
    title: 'Customer Service Excellence',
    issueDate: '2024-02-01',
    expiryDate: '2025-02-01',
    status: 'active'
  }
];

export default function TrainingScreen() {
  const [activeTab, setActiveTab] = useState<'modules' | 'certificates'>('modules');

  const handleModulePress = (module: typeof TRAINING_MODULES[0]) => {
    if (module.completed) {
      Alert.alert(
        'Module Completed',
        `You have already completed "${module.title}". Would you like to review it again?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Review', onPress: () => console.log('Review module:', module.id) }
        ]
      );
    } else {
      Alert.alert(
        'Start Training',
        `Start "${module.title}" training module?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Start', onPress: () => console.log('Start module:', module.id) }
        ]
      );
    }
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play size={16} color={Colors.primary} />;
      case 'interactive':
        return <BookOpen size={16} color={Colors.primary} />;
      case 'document':
        return <Download size={16} color={Colors.primary} />;
      default:
        return <BookOpen size={16} color={Colors.primary} />;
    }
  };

  const completedModules = TRAINING_MODULES.filter(m => m.completed).length;
  const totalModules = TRAINING_MODULES.length;
  const overallProgress = (completedModules / totalModules) * 100;

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen 
        options={{ 
          title: 'Training',
          headerStyle: { backgroundColor: Colors.white },
          headerTintColor: Colors.text,
        }} 
      />

      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Award size={24} color={Colors.primary} />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Training Progress</Text>
          <Text style={styles.headerSubtitle}>
            {completedModules} of {totalModules} modules completed
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${overallProgress}%` }]} />
          </View>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'modules' && styles.activeTab]}
          onPress={() => setActiveTab('modules')}
        >
          <Text style={[styles.tabText, activeTab === 'modules' && styles.activeTabText]}>
            Training Modules
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'certificates' && styles.activeTab]}
          onPress={() => setActiveTab('certificates')}
        >
          <Text style={[styles.tabText, activeTab === 'certificates' && styles.activeTabText]}>
            Certificates
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'modules' ? (
        <View style={styles.section}>
          {TRAINING_MODULES.map((module) => (
            <TouchableOpacity
              key={module.id}
              style={styles.moduleCard}
              onPress={() => handleModulePress(module)}
              activeOpacity={0.7}
            >
              <View style={styles.moduleHeader}>
                <View style={styles.moduleIconContainer}>
                  {getModuleIcon(module.type)}
                </View>
                <View style={styles.moduleInfo}>
                  <Text style={styles.moduleTitle}>{module.title}</Text>
                  <Text style={styles.moduleDescription}>{module.description}</Text>
                  <View style={styles.moduleMetadata}>
                    <Clock size={14} color={Colors.subtext} />
                    <Text style={styles.moduleDuration}>{module.duration}</Text>
                  </View>
                </View>
                <View style={styles.moduleStatus}>
                  {module.completed ? (
                    <CheckCircle size={24} color={Colors.success} />
                  ) : (
                    <View style={styles.progressCircle}>
                      <Text style={styles.progressText}>{module.progress}%</Text>
                    </View>
                  )}
                </View>
              </View>
              
              {!module.completed && module.progress > 0 && (
                <View style={styles.moduleProgressBar}>
                  <View style={[styles.moduleProgressFill, { width: `${module.progress}%` }]} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.section}>
          {CERTIFICATIONS.map((cert) => (
            <View key={cert.id} style={styles.certificateCard}>
              <View style={styles.certificateHeader}>
                <View style={styles.certificateIconContainer}>
                  <Award size={20} color={Colors.primary} />
                </View>
                <View style={styles.certificateInfo}>
                  <Text style={styles.certificateTitle}>{cert.title}</Text>
                  <Text style={styles.certificateDate}>
                    Issued: {new Date(cert.issueDate).toLocaleDateString()}
                  </Text>
                  <Text style={styles.certificateExpiry}>
                    Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                  </Text>
                </View>
                <View style={[
                  styles.certificateStatus,
                  cert.status === 'active' ? styles.certificateStatusActive : styles.certificateStatusExpired
                ]}>
                  <Text style={[
                    styles.certificateStatusText,
                    cert.status === 'active' ? styles.certificateStatusTextActive : styles.certificateStatusTextExpired
                  ]}>
                    {cert.status === 'active' ? 'Active' : 'Expired'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.lightGray,
  },
  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.lightGray,
    margin: 20,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: Colors.white,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.subtext,
  },
  activeTabText: {
    color: Colors.primary,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  moduleCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 6,
  },
  moduleMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleDuration: {
    fontSize: 12,
    color: Colors.subtext,
    marginLeft: 4,
  },
  moduleStatus: {
    marginLeft: 12,
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  moduleProgressBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginTop: 12,
    overflow: 'hidden',
  },
  moduleProgressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  certificateCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  certificateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  certificateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  certificateInfo: {
    flex: 1,
  },
  certificateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  certificateDate: {
    fontSize: 12,
    color: Colors.subtext,
    marginBottom: 2,
  },
  certificateExpiry: {
    fontSize: 12,
    color: Colors.subtext,
  },
  certificateStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  certificateStatusActive: {
    backgroundColor: Colors.success + '20',
  },
  certificateStatusExpired: {
    backgroundColor: Colors.error + '20',
  },
  certificateStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  certificateStatusTextActive: {
    color: Colors.success,
  },
  certificateStatusTextExpired: {
    color: Colors.error,
  },
});