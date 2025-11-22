import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { MapPin, Search, Star, Settings } from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import { useThemeColors } from '@/hooks/use-theme-colors';
import { RootState } from '@/store';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { destinations } = useSelector((state: RootState) => state.destinations);
  const { colors, isDarkMode } = useThemeColors();

  // Debug mobile theme changes
  useEffect(() => {
    console.log('Explore screen theme update:', { isDarkMode, backgroundColor: colors.background });
  }, [isDarkMode, colors.background]);

  // Create dynamic styles for better mobile theme compatibility
  const dynamicStyles = {
    container: {
      ...styles.container,
      backgroundColor: colors.background,
    },
    scrollView: {
      ...styles.scrollView,
      backgroundColor: colors.background,
    },
    title: {
      ...styles.title,
      color: colors.text,
    },
    subtitle: {
      ...styles.subtitle,
      color: colors.textSecondary,
    },
    sectionTitle: {
      ...styles.sectionTitle,
      color: colors.text,
    },
    inputContainer: {
      ...styles.inputContainer,
      backgroundColor: colors.inputBackground,
      borderColor: colors.inputBorder,
    },
    searchInput: {
      ...styles.searchInput,
      color: colors.inputText,
    },
  };

  const categories = [
    { id: 'popular', title: 'Popular Destinations', icon: '🔥' },
    { id: 'trending', title: 'Trending Now', icon: '📈' },
    { id: 'transport', title: 'Transport Options', icon: '🚌' },
    { id: 'featured', title: 'Featured Places', icon: '⭐' },
  ];

  const quickActions = [
    { id: 'trip-planning', title: 'Plan Trip', icon: '🗺️', color: '#007AFF' },
    { id: 'advanced-search', title: 'Advanced Search', icon: '🔍', color: '#34C759' },
    { id: 'utilities', title: 'Weather & Currency', icon: '🌤️', color: '#FF9500' },
    { id: 'notifications', title: 'Notifications', icon: '🔔', color: '#AF52DE' },
  ];

  const getDestinationsByStatus = (status: string) => {
    return destinations.filter(dest => dest.status.toLowerCase() === status.toLowerCase());
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'trip-planning':
        router.push('/trip-planning');
        break;
      case 'advanced-search':
        router.push('/advanced-search');
        break;
      case 'utilities':
        router.push('/utilities');
        break;
      case 'notifications':
        router.push('/notifications');
        break;
      default:
        break;
    }
  };

  const renderQuickAction = (action: typeof quickActions[0]) => (
    <TouchableOpacity 
      key={action.id} 
      style={[styles.quickActionCard, { backgroundColor: action.color }]}
      onPress={() => handleQuickAction(action.id)}
    >
      <Text style={styles.quickActionIcon}>{action.icon}</Text>
      <Text style={styles.quickActionTitle}>{action.title}</Text>
    </TouchableOpacity>
  );

  const renderCategorySection = (category: typeof categories[0]) => {
    const categoryDestinations = category.id === 'transport' 
      ? destinations.filter(dest => dest.category === 'transport')
      : getDestinationsByStatus(category.id);

    if (categoryDestinations.length === 0) return null;

    // Create dynamic styles for better mobile compatibility
    const dynamicStyles = {
      categoryTitle: {
        ...styles.categoryTitle,
        color: colors.text,
      },
    };

    return (
      <View key={category.id} style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text style={dynamicStyles.categoryTitle}>{category.title}</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {categoryDestinations.slice(0, 5).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.categoryCard, { backgroundColor: colors.card }]}
              onPress={() => router.push(`/details/${item.id}`)}
            >
              <Image source={{ uri: item.image }} style={styles.categoryCardImage} />
              <View style={styles.categoryCardContent}>
                <Text style={[styles.categoryCardTitle, { color: colors.text }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.categoryCardFooter}>
                  <MapPin stroke={colors.textMuted} width={12} height={12} />
                  <Text style={[styles.categoryCardLocation, { color: colors.textSecondary }]}>{item.country}</Text>
                </View>
                {item.rating && (
                  <View style={styles.ratingContainer}>
                    <Star stroke="#FFD700" fill="#FFD700" width={12} height={12} />
                    <Text style={[styles.ratingText, { color: colors.textSecondary }]}>{item.rating}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView 
      key={`explore-${isDarkMode}`} 
      style={dynamicStyles.container}
    >
      <ScrollView style={dynamicStyles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <Text style={dynamicStyles.title}>Explore</Text>
              <Text style={dynamicStyles.subtitle}>Discover amazing places and transport options</Text>
            </View>
            <TouchableOpacity 
              style={[styles.menuButton, { backgroundColor: colors.card }]}
              onPress={() => router.push('/menu')}
            >
              <Settings stroke={colors.primary} width={24} height={24} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={dynamicStyles.inputContainer}>
            <Search stroke={colors.textMuted} width={20} height={20} />
            <TextInput
              style={dynamicStyles.searchInput}
              placeholder="Where do you want to go?"
              placeholderTextColor={colors.inputPlaceholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.quickActionsContainer}>
          <Text style={dynamicStyles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        <View style={styles.categoriesContainer}>
          {categories.map(renderCategorySection)}
        </View>

        <View style={styles.tipsSection}>
          <Text style={dynamicStyles.sectionTitle}>Travel Tips</Text>
          <View style={[styles.tipCard, { backgroundColor: colors.surface }]}>
            <Text style={styles.tipIcon}>💡</Text>
            <View style={styles.tipContent}>
              <Text style={[styles.tipTitle, { color: colors.text }]}>Best Time to Travel</Text>
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                Plan your trips during off-peak seasons for better deals and fewer crowds.
              </Text>
            </View>
          </View>
          
          <View style={[styles.tipCard, { backgroundColor: colors.surface }]}>
            <Text style={styles.tipIcon}>🎒</Text>
            <View style={styles.tipContent}>
              <Text style={[styles.tipTitle, { color: colors.text }]}>Pack Smart</Text>
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                Always check the weather forecast and pack accordingly. Don&apos;t forget essentials!
              </Text>
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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  menuButton: {
    padding: 12,
    borderRadius: 12,
    marginLeft: 16,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }),
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  quickActionCard: {
    width: '47%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  quickActionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  categoriesContainer: {
    paddingBottom: 30,
  },
  categorySection: {
    marginBottom: 30,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  horizontalList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  categoryCard: {
    width: 160,
    marginRight: 15,
    borderRadius: 12,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }),
  },
  categoryCardImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  categoryCardContent: {
    padding: 12,
  },
  categoryCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  categoryCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryCardLocation: {
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
  },
  tipsSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  tipCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
});