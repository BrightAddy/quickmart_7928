import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Colors from '@/constants/colors';

export interface TabItem {
  id: string;
  label: string;
  count: number;
}

export interface ScrollableTabProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  scrollable?: boolean;
}

const ScrollableTab: React.FC<ScrollableTabProps> = ({ 
  tabs, 
  activeTab, 
  onTabChange,
  scrollable = true
}) => {
  const TabContainer = scrollable ? ScrollView : View;
  
  return (
    <TabContainer 
      horizontal={scrollable}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={!scrollable ? styles.fixedContainer : undefined}
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            activeTab === tab.id && styles.activeTab
          ]}
          onPress={() => onTabChange(tab.id)}
        >
          <Text style={[
            styles.tabText,
            activeTab === tab.id && styles.activeTabText
          ]}>
            {tab.label}
          </Text>
          {tab.count > 0 && (
            <View style={[
              styles.badge,
              activeTab === tab.id && styles.activeBadge
            ]}>
              <Text style={[
                styles.badgeText,
                activeTab === tab.id && styles.activeBadgeText
              ]}>
                {tab.count}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </TabContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  fixedContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  activeTab: {
    backgroundColor: Colors.primary + '15',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.subtext,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  activeBadge: {
    backgroundColor: Colors.primary + '30',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.subtext,
  },
  activeBadgeText: {
    color: Colors.primary,
  },
});

export default ScrollableTab;