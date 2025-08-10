import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  Star,
  Download,
  FileText,
  Video,
  Award,
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'quiz';
  duration: string;
  completed: boolean;
  rating?: number;
  icon: React.ReactNode;
}

const trainingModules: TrainingModule[] = [
  {
    id: '1',
    title: 'Getting Started as a Shopper',
    description: 'Learn the basics of being a successful shopper on our platform',
    type: 'video',
    duration: '8 min',
    completed: true,
    rating: 4.8,
    icon: <Play size={20} color="#4464EB" />,
  },
  {
    id: '2',
    title: 'How to Shop Efficiently',
    description: 'Tips and tricks for finding items quickly and accurately',
    type: 'video',
    duration: '12 min',
    completed: true,
    rating: 4.9,
    icon: <Play size={20} color="#4464EB" />,
  },
  {
    id: '3',
    title: 'Customer Communication Best Practices',
    description: 'Learn how to communicate effectively with customers',
    type: 'document',
    duration: '5 min read',
    completed: false,
    icon: <FileText size={20} color="#FF9800" />,
  },
  {
    id: '4',
    title: 'Handling Substitutions',
    description: 'When and how to make product substitutions',
    type: 'video',
    duration: '6 min',
    completed: false,
    icon: <Play size={20} color="#4464EB" />,
  },
  {
    id: '5',
    title: 'Delivery Excellence',
    description: 'Best practices for safe and timely deliveries',
    type: 'video',
    duration: '10 min',
    completed: false,
    icon: <Play size={20} color="#4464EB" />,
  },
  {
    id: '6',
    title: 'Safety Guidelines',
    description: 'Important safety protocols for shoppers',
    type: 'document',
    duration: '7 min read',
    completed: true,
    rating: 4.7,
    icon: <FileText size={20} color="#FF9800" />,
  },
  {
    id: '7',
    title: 'Shopper Assessment Quiz',
    description: 'Test your knowledge and earn your certification',
    type: 'quiz',
    duration: '15 min',
    completed: false,
    icon: <Award size={20} color="#4CAF50" />,
  },
];

export default function Training() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  const [modules, setModules] = useState(trainingModules);

  const completedModules = modules.filter(m => m.completed).length;
  const totalModules = modules.length;
  const progressPercentage = Math.round((completedModules / totalModules) * 100);

  const handleModulePress = (module: TrainingModule) => {
    if (module.type === 'video') {
      Alert.alert(
        module.title,
        'This will open the training video. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Watch Video',
            onPress: () => {
              // Simulate completing the module
              if (!module.completed) {
                setModules(prev =>
                  prev.map(m =>
                    m.id === module.id ? { ...m, completed: true, rating: 4.8 } : m
                  )
                );
                Alert.alert('Module Completed!', 'Great job! You\'ve completed this training module.');
              }
            },
          },
        ]
      );
    } else if (module.type === 'document') {
      Alert.alert(
        module.title,
        'This will open the training document. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Read Document',
            onPress: () => {
              if (!module.completed) {
                setModules(prev =>
                  prev.map(m =>
                    m.id === module.id ? { ...m, completed: true, rating: 4.7 } : m
                  )
                );
                Alert.alert('Module Completed!', 'Great job! You\'ve completed this training module.');
              }
            },
          },
        ]
      );
    } else if (module.type === 'quiz') {
      Alert.alert(
        'Assessment Quiz',
        'This quiz will test your knowledge from all training modules. You need to complete all other modules first.',
        [
          { text: 'OK' },
        ]
      );
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video size={16} color="#4464EB" />;
      case 'document':
        return <FileText size={16} color="#FF9800" />;
      case 'quiz':
        return <Award size={16} color="#4CAF50" />;
      default:
        return <BookOpen size={16} color={Colors.subtext} />;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={12}
            color={star <= rating ? '#FFD700' : Colors.border}
            fill={star <= rating ? '#FFD700' : 'transparent'}
          />
        ))}
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Training Materials',
          headerStyle: {
            backgroundColor: Colors.white,
          },
          headerTintColor: Colors.text,
        }}
      />
      
      <ScrollView style={[styles.container, { backgroundColor: Colors.background }]}>
        {/* Progress Card */}
        <View style={[styles.progressCard, { backgroundColor: '#4464EB' }]}>
          <View style={styles.progressHeader}>
            <BookOpen size={24} color={Colors.white} />
            <Text style={[styles.progressTitle, { color: Colors.white }]}>
              Training Progress
            </Text>
          </View>
          <Text style={[styles.progressPercentage, { color: Colors.white }]}>
            {progressPercentage}% Complete
          </Text>
          <View style={[styles.progressBar, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: Colors.white,
                  width: `${progressPercentage}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: Colors.white }]}>
            {completedModules} of {totalModules} modules completed
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={[styles.statsCard, { backgroundColor: Colors.white }]}>
          <View style={styles.statItem}>
            <CheckCircle size={20} color="#4CAF50" />
            <Text style={[styles.statValue, { color: Colors.text }]}>{completedModules}</Text>
            <Text style={[styles.statLabel, { color: Colors.subtext }]}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Clock size={20} color="#FF9800" />
            <Text style={[styles.statValue, { color: Colors.text }]}>{totalModules - completedModules}</Text>
            <Text style={[styles.statLabel, { color: Colors.subtext }]}>Remaining</Text>
          </View>
          <View style={styles.statItem}>
            <Star size={20} color="#FFD700" />
            <Text style={[styles.statValue, { color: Colors.text }]}>4.8</Text>
            <Text style={[styles.statLabel, { color: Colors.subtext }]}>Avg Rating</Text>
          </View>
        </View>

        {/* Training Modules */}
        <View style={[styles.modulesCard, { backgroundColor: Colors.white }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>
            Training Modules
          </Text>
          
          {modules.map((module) => (
            <TouchableOpacity
              key={module.id}
              style={[
                styles.moduleItem,
                module.completed && { backgroundColor: Colors.background },
              ]}
              onPress={() => handleModulePress(module)}
            >
              <View style={styles.moduleLeft}>
                <View
                  style={[
                    styles.moduleIcon,
                    {
                      backgroundColor: module.completed ? '#E8F5E8' : Colors.background,
                    },
                  ]}
                >
                  {module.completed ? (
                    <CheckCircle size={20} color="#4CAF50" />
                  ) : (
                    module.icon
                  )}
                </View>
                <View style={styles.moduleContent}>
                  <Text style={[styles.moduleTitle, { color: Colors.text }]}>
                    {module.title}
                  </Text>
                  <Text style={[styles.moduleDescription, { color: Colors.subtext }]}>
                    {module.description}
                  </Text>
                  <View style={styles.moduleFooter}>
                    <View style={styles.moduleType}>
                      {getTypeIcon(module.type)}
                      <Text style={[styles.moduleTypeText, { color: Colors.subtext }]}>
                        {module.duration}
                      </Text>
                    </View>
                    {module.completed && module.rating && (
                      <View style={styles.moduleRating}>
                        {renderStars(module.rating)}
                        <Text style={[styles.ratingText, { color: Colors.subtext }]}>
                          {module.rating}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              {!module.completed && (
                <View style={[styles.playButton, { backgroundColor: '#4464EB' }]}>
                  <Play size={16} color={Colors.white} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Certification */}
        <View style={[styles.certificationCard, { backgroundColor: '#E8F5E8' }]}>
          <Award size={24} color="#4CAF50" />
          <View style={styles.certificationContent}>
            <Text style={[styles.certificationTitle, { color: '#2E7D32' }]}>
              Shopper Certification
            </Text>
            <Text style={[styles.certificationText, { color: '#2E7D32' }]}>
              Complete all training modules and pass the assessment quiz to earn your official Shopper Certification badge.
            </Text>
            {completedModules === totalModules - 1 && (
              <TouchableOpacity
                style={[styles.certificationButton, { backgroundColor: '#4CAF50' }]}
                onPress={() => handleModulePress(modules.find(m => m.type === 'quiz')!)}
              >
                <Text style={[styles.certificationButtonText, { color: Colors.white }]}>
                  Take Assessment Quiz
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Help Section */}
        <View style={[styles.helpCard, { backgroundColor: Colors.white }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>
            Need Help?
          </Text>
          
          <TouchableOpacity style={styles.helpItem}>
            <Download size={20} color="#2196F3" />
            <View style={styles.helpContent}>
              <Text style={[styles.helpTitle, { color: Colors.text }]}>
                Download Training Materials
              </Text>
              <Text style={[styles.helpDescription, { color: Colors.subtext }]}>
                Access offline versions of training documents
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpItem}>
            <BookOpen size={20} color="#FF9800" />
            <View style={styles.helpContent}>
              <Text style={[styles.helpTitle, { color: Colors.text }]}>
                Shopper Handbook
              </Text>
              <Text style={[styles.helpDescription, { color: Colors.subtext }]}>
                Complete guide to being a successful shopper
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  progressCard: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    opacity: 0.9,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
  },
  modulesCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  moduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  moduleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  moduleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
  },
  moduleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  moduleTypeText: {
    fontSize: 12,
  },
  moduleRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 1,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  certificationCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  certificationContent: {
    flex: 1,
  },
  certificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  certificationText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  certificationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  certificationButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  helpCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  helpDescription: {
    fontSize: 14,
  },
});