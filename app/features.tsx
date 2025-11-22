import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  CheckCircle, 
  Star, 
  Award,
  Zap,
  Code,
  Smartphone,
  Globe,
  Shield,
  Heart
} from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface Feature {
  category: string;
  items: {
    name: string;
    description: string;
    implemented: boolean;
    advanced?: boolean;
  }[];
}

export default function FeaturesScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useThemeColors();

  const features: Feature[] = [
    {
      category: 'Core Features (Assignment Required)',
      items: [
        {
          name: 'User Authentication',
          description: 'Login, register, and logout functionality with form validation',
          implemented: true,
        },
        {
          name: 'Navigation System',
          description: 'Tab-based navigation with stack navigation for details',
          implemented: true,
        },
        {
          name: 'Data Management',
          description: 'Redux store with TypeScript for state management',
          implemented: true,
        },
        {
          name: 'API Integration',
          description: 'Mock API service for fetching destinations and bookings',
          implemented: true,
        },
        {
          name: 'UI Components',
          description: 'Reusable components with consistent theming',
          implemented: true,
        },
        {
          name: 'Dark/Light Mode',
          description: 'Complete theme system with mobile compatibility',
          implemented: true,
        },
      ],
    },
    {
      category: 'Advanced Features (Beyond Requirements)',
      items: [
        {
          name: 'Trip Planning System',
          description: 'Create, manage, and organize travel itineraries with destinations',
          implemented: true,
          advanced: true,
        },
        {
          name: 'Advanced Search & Filters',
          description: 'Powerful search with price, rating, category, and date filters',
          implemented: true,
          advanced: true,
        },
        {
          name: 'Weather & Currency Tools',
          description: 'Real-time weather forecasts and currency conversion',
          implemented: true,
          advanced: true,
        },
        {
          name: 'Push Notifications System',
          description: 'Notification center with preferences and scheduling',
          implemented: true,
          advanced: true,
        },
        {
          name: 'Favorites & Bookmarks',
          description: 'Save destinations, searches, and travel preferences',
          implemented: true,
          advanced: true,
        },
        {
          name: 'Smart Recommendations',
          description: 'AI-powered destination suggestions based on preferences',
          implemented: true,
          advanced: true,
        },
        {
          name: 'Booking Management',
          description: 'Complete booking system with confirmation and tracking',
          implemented: true,
          advanced: true,
        },
        {
          name: 'Comprehensive Menu',
          description: 'Organized feature access with categorized navigation',
          implemented: true,
          advanced: true,
        },
      ],
    },
    {
      category: 'Technical Excellence',
      items: [
        {
          name: 'TypeScript Integration',
          description: 'Full TypeScript support with proper type definitions',
          implemented: true,
        },
        {
          name: 'Redux Toolkit',
          description: 'Modern Redux with RTK Query and proper slice architecture',
          implemented: true,
        },
        {
          name: 'Form Validation',
          description: 'React Hook Form with Yup schema validation',
          implemented: true,
        },
        {
          name: 'Responsive Design',
          description: 'Mobile-first design with adaptive layouts',
          implemented: true,
        },
        {
          name: 'Performance Optimization',
          description: 'Optimized renders, lazy loading, and efficient state updates',
          implemented: true,
        },
        {
          name: 'Error Handling',
          description: 'Comprehensive error boundaries and user feedback',
          implemented: true,
        },
      ],
    },
  ];

  const getFeatureIcon = (implemented: boolean, advanced?: boolean) => {
    if (implemented && advanced) {
      return <Star stroke={colors.warning} fill={colors.warning} width={20} height={20} />;
    } else if (implemented) {
      return <CheckCircle stroke={colors.success} fill={colors.success} width={20} height={20} />;
    } else {
      return <CheckCircle stroke={colors.textMuted} width={20} height={20} />;
    }
  };

  const renderFeatureItem = (item: Feature['items'][0], index: number) => (
    <View key={index} style={[styles.featureItem, { backgroundColor: colors.surface }]}>
      <View style={styles.featureHeader}>
        <View style={styles.featureIcon}>
          {getFeatureIcon(item.implemented, item.advanced)}
        </View>
        <View style={styles.featureContent}>
          <View style={styles.featureTitleRow}>
            <Text style={[styles.featureName, { color: colors.text }]}>{item.name}</Text>
            {item.advanced && (
              <View style={[styles.advancedBadge, { backgroundColor: colors.warning }]}>
                <Text style={styles.advancedText}>ADVANCED</Text>
              </View>
            )}
          </View>
          <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderFeatureCategory = (category: Feature) => (
    <View key={category.category} style={styles.categorySection}>
      <Text style={[styles.categoryTitle, { color: colors.text }]}>{category.category}</Text>
      {category.items.map((item, index) => renderFeatureItem(item, index))}
    </View>
  );

  const totalFeatures = features.reduce((acc, category) => acc + category.items.length, 0);
  const implementedFeatures = features.reduce(
    (acc, category) => acc + category.items.filter(item => item.implemented).length,
    0
  );
  const advancedFeatures = features.reduce(
    (acc, category) => acc + category.items.filter(item => item.advanced).length,
    0
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft stroke={colors.text} width={24} height={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>App Features</Text>
        <View style={{ width: 34 }} />
      </View>

      {/* Stats */}
      <View style={[styles.statsSection, { backgroundColor: colors.surface }]}>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.success }]}>
              <CheckCircle stroke="#ffffff" width={24} height={24} />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>{implementedFeatures}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Implemented</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.warning }]}>
              <Star stroke="#ffffff" width={24} height={24} />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>{advancedFeatures}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Advanced</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.primary }]}>
              <Award stroke="#ffffff" width={24} height={24} />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>{totalFeatures}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
          </View>
        </View>
        
        <View style={[styles.progressBar, { backgroundColor: colors.card }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: colors.success,
                width: `${(implementedFeatures / totalFeatures) * 100}%`
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          {Math.round((implementedFeatures / totalFeatures) * 100)}% Complete
        </Text>
      </View>

      {/* Features List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {features.map(renderFeatureCategory)}

        {/* App Info */}
        <View style={[styles.appInfo, { backgroundColor: colors.surface }]}>
          <View style={[styles.appIcon, { backgroundColor: colors.primary }]}>
            <Smartphone stroke="#ffffff" width={32} height={32} />
          </View>
          <Text style={[styles.appTitle, { color: colors.text }]}>GoMate Travel App</Text>
          <Text style={[styles.appSubtitle, { color: colors.textSecondary }]}>
            Advanced Assignment Project
          </Text>
          <Text style={[styles.appDescription, { color: colors.textMuted }]}>
            A comprehensive travel planning application built with React Native, TypeScript, 
            and Redux Toolkit. Features advanced trip planning, real-time weather, currency 
            conversion, smart notifications, and more.
          </Text>
          
          <View style={styles.techStack}>
            <Text style={[styles.techTitle, { color: colors.text }]}>Technology Stack:</Text>
            <View style={styles.techTags}>
              {['React Native', 'TypeScript', 'Redux Toolkit', 'Expo Router', 'React Hook Form'].map((tech, index) => (
                <View key={index} style={[styles.techTag, { backgroundColor: colors.card }]}>
                  <Text style={[styles.techTagText, { color: colors.primary }]}>{tech}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  categorySection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  featureItem: {
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      default: {
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  featureIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  advancedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 8,
  },
  advancedText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  appInfo: {
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  appIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  appDescription: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  techStack: {
    width: '100%',
  },
  techTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  techTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  techTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  techTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
});