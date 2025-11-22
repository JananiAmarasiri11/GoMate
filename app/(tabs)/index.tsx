import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { MapPin, Search } from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { useThemeColors } from '@/hooks/use-theme-colors';
import { destinationsService } from '@/services/api';
import { AppDispatch, RootState } from '@/store';
import {
    Destination,
    fetchDestinationsFailure,
    fetchDestinationsStart,
    fetchDestinationsSuccess,
    setSearchQuery,
    setSelectedCategory
} from '@/store/slices/destinationsSlice';

const ImageWithLoader = ({ source, style, colors }: { source: { uri: string }, style: any, colors: any }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const imageLoaderStyles = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  };

  const imageErrorStyles = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  };

  const imageErrorTextStyles = {
    fontSize: 12,
    textAlign: 'center' as const,
  };

  return (
    <View style={style}>
      <Image 
        source={source} 
        style={style}
        onLoadStart={() => setLoading(true)}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        resizeMode="cover"
      />
      {loading && (
        <View style={[imageLoaderStyles, style]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      {error && (
        <View style={[imageErrorStyles, style]}>
          <Text style={[imageErrorTextStyles, { color: colors.textSecondary }]}>Failed to load image</Text>
        </View>
      )}
    </View>
  );
};

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { destinations, isLoading, searchQuery, selectedCategory } = useSelector(
    (state: RootState) => state.destinations
  );
  const { colors } = useThemeColors();

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      dispatch(fetchDestinationsStart());
      const data = await destinationsService.getDestinations();
      dispatch(fetchDestinationsSuccess(data));
    } catch (error) {
      dispatch(fetchDestinationsFailure(error instanceof Error ? error.message : 'Failed to load destinations'));
      Alert.alert('Error', 'Failed to load destinations. Please try again.');
    }
  };

  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         destination.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || destination.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderDestinationCard = ({ item }: { item: Destination }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() => router.push(`/details/${item.id}`)}
    >
      <ImageWithLoader source={{ uri: item.image }} style={styles.cardImage} colors={colors} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{item.name}</Text>
          <View style={[styles.statusBadge, getStatusColor(item.status)]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <Text style={[styles.cardDescription, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.cardFooter}>
          <View style={styles.locationContainer}>
            <MapPin stroke={colors.textSecondary} width={14} height={14} />
            <Text style={[styles.locationText, { color: colors.textSecondary }]}>{item.country}</Text>
          </View>
          {item.price && (
            <Text style={styles.priceText}>{item.price}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Popular': return { backgroundColor: '#ff6b6b' };
      case 'Trending': return { backgroundColor: '#4ecdc4' };
      case 'New': return { backgroundColor: '#45b7d1' };
      case 'Featured': return { backgroundColor: '#f9ca24' };
      default: return { backgroundColor: '#95a5a6' };
    }
  };

  const CategoryButton = ({ category, title }: { category: typeof selectedCategory, title: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        { backgroundColor: colors.inputBackground },
        selectedCategory === category && styles.activeCategoryButton
      ]}
      onPress={() => dispatch(setSelectedCategory(category))}
    >
      <Text style={[
        styles.categoryButtonText,
        { color: colors.textSecondary },
        selectedCategory === category && styles.activeCategoryButtonText
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>Welcome back,</Text>
          <Text style={[styles.userNameText, { color: colors.text }]}>{user?.firstName || 'Traveler'}! 👋</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/menu')}
        >
          <View style={styles.profileIcon}>
            <Text style={styles.profileInitial}>
              {user?.firstName?.charAt(0) || 'T'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.inputBackground }]}>
          <Search stroke={colors.textSecondary} width={20} height={20} />
          <TextInput
            style={[styles.searchInput, { color: colors.inputText }]}
            placeholder="Search destinations or transport..."
            placeholderTextColor={colors.inputPlaceholder}
            value={searchQuery}
            onChangeText={(text) => dispatch(setSearchQuery(text))}
          />
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <CategoryButton category="all" title="All" />
        <CategoryButton category="destination" title="Destinations" />
        <CategoryButton category="transport" title="Transport" />
      </View>

      {/* Quick Access */}
      <View style={styles.featuresContainer}>
        <Text style={[styles.featuresTitle, { color: colors.text }]}>Quick Access</Text>
        <View style={styles.featuresGrid}>
          <TouchableOpacity 
            style={[styles.featureCard, { backgroundColor: '#007AFF' }]}
            onPress={() => router.push('/trip-planning')}
          >
            <Text style={[styles.featureIcon, { color: '#ffffff' }]}>🗺️</Text>
            <Text style={styles.featureText}>Plan Trip</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.featureCard, { backgroundColor: '#34C759' }]}
            onPress={() => router.push('/advanced-search')}
          >
            <Text style={[styles.featureIcon, { color: '#ffffff' }]}>🔍</Text>
            <Text style={styles.featureText}>Advanced Search</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.featureCard, { backgroundColor: '#FF9500' }]}
            onPress={() => router.push('/utilities')}
          >
            <Text style={[styles.featureIcon, { color: '#ffffff' }]}>🌤️</Text>
            <Text style={[styles.featureText, { color: '#ffffff' }]}>Weather & Currency</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.featureCard, { backgroundColor: '#AF52DE' }]}
            onPress={() => router.push('/notifications')}
          >
            <Text style={[styles.featureIcon, { color: '#ffffff' }]}>🔔</Text>
            <Text style={styles.featureText}>Notifications</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredDestinations}
        renderItem={renderDestinationCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadDestinations}
            colors={['#007AFF']}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  greeting: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  userNameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  profileButton: {
    padding: 5,
  },
  profileIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeCategoryButton: {
    backgroundColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeCategoryButtonText: {
    color: '#fff',
  },
  featuresContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  featureCard: {
    width: '47%',
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 8,
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
  featureText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    elevation: 5,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    }),
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  imageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  imageError: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  imageErrorText: {
    fontSize: 12,
    textAlign: 'center',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});
