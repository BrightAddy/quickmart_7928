import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  MessageCircle,
  Award,
  Target,
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  orderValue: number;
}

interface PerformanceMetric {
  label: string;
  value: string;
  percentage: number;
  icon: React.ReactNode;
  color: string;
}

const mockReviews: Review[] = [
  {
    id: '1',
    customerName: 'Kwame A.',
    rating: 5,
    comment: 'Excellent service! Found all items and delivered on time. Very professional.',
    date: '2 days ago',
    orderValue: 53,
  },
  {
    id: '2',
    customerName: 'Ama K.',
    rating: 4,
    comment: 'Good shopper, but one item was substituted without asking first.',
    date: '1 week ago',
    orderValue: 77,
  },
  {
    id: '3',
    customerName: 'John D.',
    rating: 5,
    comment: 'Perfect! Great communication and fast delivery.',
    date: '1 week ago',
    orderValue: 40,
  },
  {
    id: '4',
    customerName: 'Sarah M.',
    rating: 5,
    comment: 'Amazing shopper! Very careful with produce selection.',
    date: '2 weeks ago',
    orderValue: 89,
  },
];

export default function ShopperRatings() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const Colors = getColors(isDarkMode);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  const overallRating = 4.8;
  const totalReviews = 127;
  const recentReviews = mockReviews.slice(0, 3);

  const performanceMetrics: PerformanceMetric[] = [
    {
      label: 'On-time Rate',
      value: '96%',
      percentage: 96,
      icon: <Clock size={20} color="#4CAF50" />,
      color: '#4CAF50',
    },
    {
      label: 'Order Accuracy',
      value: '94%',
      percentage: 94,
      icon: <CheckCircle size={20} color="#2196F3" />,
      color: '#2196F3',
    },
    {
      label: 'Communication',
      value: '98%',
      percentage: 98,
      icon: <MessageCircle size={20} color="#FF9800" />,
      color: '#FF9800',
    },
  ];

  const renderStars = (rating: number, size: number = 16) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            color={star <= rating ? '#FFD700' : Colors.border}
            fill={star <= rating ? '#FFD700' : 'transparent'}
          />
        ))}
      </View>
    );
  };

  const renderRatingDistribution = () => {
    const distribution = [
      { stars: 5, count: 89, percentage: 70 },
      { stars: 4, count: 28, percentage: 22 },
      { stars: 3, count: 7, percentage: 6 },
      { stars: 2, count: 2, percentage: 1.5 },
      { stars: 1, count: 1, percentage: 0.5 },
    ];

    return (
      <View style={styles.distributionContainer}>
        {distribution.map((item) => (
          <View key={item.stars} style={styles.distributionRow}>
            <Text style={[styles.distributionStars, { color: Colors.text }]}>
              {item.stars}
            </Text>
            <Star size={14} color="#FFD700" fill="#FFD700" />
            <View style={[styles.distributionBar, { backgroundColor: Colors.border }]}>
              <View
                style={[
                  styles.distributionFill,
                  {
                    backgroundColor: '#FFD700',
                    width: `${item.percentage}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.distributionCount, { color: Colors.subtext }]}>
              {item.count}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'My Ratings',
        }}
      />
      
      <ScrollView style={[styles.container, { backgroundColor: Colors.background }]}>
        {/* Overall Rating Card */}
        <View style={[styles.overallCard, { backgroundColor: Colors.white }]}>
          <View style={styles.overallHeader}>
            <View style={styles.ratingSection}>
              <Text style={[styles.overallRating, { color: Colors.text }]}>
                {overallRating}
              </Text>
              {renderStars(Math.floor(overallRating), 24)}
              <Text style={[styles.totalReviews, { color: Colors.subtext }]}>
                Based on {totalReviews} reviews
              </Text>
            </View>
            <View style={[styles.badgeContainer, { backgroundColor: '#E8F5E8' }]}>
              <Award size={32} color="#4CAF50" />
              <Text style={[styles.badgeText, { color: '#4CAF50' }]}>
                Top Shopper
              </Text>
            </View>
          </View>
          
          {renderRatingDistribution()}
        </View>

        {/* Performance Metrics */}
        <View style={[styles.metricsCard, { backgroundColor: Colors.white }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>
            Performance Metrics
          </Text>
          
          {performanceMetrics.map((metric, index) => (
            <View key={index} style={styles.metricItem}>
              <View style={styles.metricLeft}>
                <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
                  {metric.icon}
                </View>
                <View>
                  <Text style={[styles.metricLabel, { color: Colors.text }]}>
                    {metric.label}
                  </Text>
                  <Text style={[styles.metricValue, { color: metric.color }]}>
                    {metric.value}
                  </Text>
                </View>
              </View>
              <View style={styles.metricRight}>
                <View style={[styles.progressCircle, { borderColor: Colors.border }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: metric.color,
                        transform: [{ rotate: `${(metric.percentage / 100) * 360}deg` }],
                      },
                    ]}
                  />
                  <View style={styles.progressInner}>
                    <Text style={[styles.progressText, { color: Colors.text }]}>
                      {metric.percentage}%
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Period Selector */}
        <View style={[styles.periodSelector, { backgroundColor: Colors.white }]}>
          {(['week', 'month', 'all'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && { backgroundColor: '#4464EB' },
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  { color: selectedPeriod === period ? Colors.white : Colors.subtext },
                ]}
              >
                {period === 'all' ? 'All Time' : `This ${period.charAt(0).toUpperCase() + period.slice(1)}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Reviews */}
        <View style={[styles.reviewsCard, { backgroundColor: Colors.white }]}>
          <View style={styles.reviewsHeader}>
            <Text style={[styles.sectionTitle, { color: Colors.text }]}>
              Recent Reviews
            </Text>
            <TouchableOpacity>
              <Text style={[styles.viewAllText, { color: '#4464EB' }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {recentReviews.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <View>
                  <Text style={[styles.customerName, { color: Colors.text }]}>
                    {review.customerName}
                  </Text>
                  <Text style={[styles.reviewDate, { color: Colors.subtext }]}>
                    {review.date} • GH₵{review.orderValue} order
                  </Text>
                </View>
                {renderStars(review.rating)}
              </View>
              <Text style={[styles.reviewComment, { color: Colors.text }]}>
                {review.comment}
              </Text>
            </View>
          ))}
        </View>

        {/* Improvement Tips */}
        <View style={[styles.tipsCard, { backgroundColor: Colors.white }]}>
          <View style={styles.tipsHeader}>
            <Target size={24} color="#4464EB" />
            <Text style={[styles.sectionTitle, { color: Colors.text }]}>
              Tips to Improve
            </Text>
          </View>

          <View style={styles.tipItem}>
            <View style={[styles.tipIcon, { backgroundColor: '#E3F2FD' }]}>
              <MessageCircle size={16} color="#2196F3" />
            </View>
            <View style={styles.tipContent}>
              <Text style={[styles.tipTitle, { color: Colors.text }]}>
                Communicate substitutions
              </Text>
              <Text style={[styles.tipDescription, { color: Colors.subtext }]}>
                Always ask customers before making substitutions
              </Text>
            </View>
          </View>

          <View style={styles.tipItem}>
            <View style={[styles.tipIcon, { backgroundColor: '#E8F5E8' }]}>
              <Clock size={16} color="#4CAF50" />
            </View>
            <View style={styles.tipContent}>
              <Text style={[styles.tipTitle, { color: Colors.text }]}>
                Maintain delivery times
              </Text>
              <Text style={[styles.tipDescription, { color: Colors.subtext }]}>
                Keep up your excellent on-time delivery rate
              </Text>
            </View>
          </View>

          <View style={styles.tipItem}>
            <View style={[styles.tipIcon, { backgroundColor: '#FFF3E0' }]}>
              <CheckCircle size={16} color="#FF9800" />
            </View>
            <View style={styles.tipContent}>
              <Text style={[styles.tipTitle, { color: Colors.text }]}>
                Double-check produce
              </Text>
              <Text style={[styles.tipDescription, { color: Colors.subtext }]}>
                Ensure fresh produce selection for better ratings
              </Text>
            </View>
          </View>
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
  overallCard: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  overallHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingSection: {
    alignItems: 'flex-start',
  },
  overallRating: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 8,
  },
  totalReviews: {
    fontSize: 14,
  },
  badgeContainer: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  distributionContainer: {
    gap: 8,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distributionStars: {
    fontSize: 14,
    fontWeight: '600',
    width: 12,
  },
  distributionBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  distributionFill: {
    height: '100%',
    borderRadius: 4,
  },
  distributionCount: {
    fontSize: 12,
    width: 20,
    textAlign: 'right',
  },
  metricsCard: {
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
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  metricLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  metricRight: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  progressInner: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 10,
    fontWeight: '700',
  },
  periodSelector: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  reviewsCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  reviewItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
  },
  tipsCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  tipDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
});