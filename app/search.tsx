import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Search, Filter, X, Star, MapPin, DollarSign } from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { updateSearchFilters, addRecentSearch, saveSearch } from '@/store/slices/utilitiesSlice';

export default function AdvancedSearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const dispatch = useDispatch();
  const { colors, isDarkMode } = useThemeColors();
  
  const { destinations } = useSelector((state) => state.destinations);
  const { searchFilters, recentSearches, savedSearches } = useSelector((state) => state.utilities);
  
  const [searchQuery, setSearchQuery] = useState(params.query || '');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(searchFilters);
  const [filteredResults, setFilteredResults] = useState([]);
  const [saveSearchName, setSaveSearchName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const categories = [
    { id: 'all', name: 'All Categories', icon: '🌍' },
    { id: 'destination', name: 'Destinations', icon: '🏖️' },
    { id: 'transport', name: 'Transport', icon: '🚌' },
    { id: 'accommodation', name: 'Hotels', icon: '🏨' },
    { id: 'activities', name: 'Activities', icon: '🎯' },
  ];

  const sortOptions = [
    { id: 'popularity', name: 'Most Popular' },
    { id: 'price_low', name: 'Price: Low to High' },
    { id: 'price_high', name: 'Price: High to Low' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'distance', name: 'Nearest First' },
  ];

  const amenities = [
    { id: 'wifi', name: 'Free WiFi', icon: '📶' },
    { id: 'parking', name: 'Parking', icon: '🅿️' },
    { id: 'pool', name: 'Swimming Pool', icon: '🏊' },
    { id: 'gym', name: 'Fitness Center', icon: '💪' },
    { id: 'spa', name: 'Spa', icon: '🧘' },
    { id: 'restaurant', name: 'Restaurant', icon: '🍽️' },
    { id: 'bar', name: 'Bar/Lounge', icon: '🍸' },
    { id: 'ac', name: 'Air Conditioning', icon: '❄️' },
  ];

  useEffect(() => {
    filterResults();
  }, [searchQuery, localFilters, destinations]);

  const filterResults = () => {
    let results = destinations.filter(destination => {
      const matchesQuery = !searchQuery || 
        destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        destination.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        destination.country.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = localFilters.category === 'all' || 
        destination.category === localFilters.category;

      const price = parseFloat(destination.price.replace(/[$,]/g, ''));
      const matchesPrice = price >= localFilters.priceRange[0] && price <= localFilters.priceRange[1];

      const matchesRating = destination.rating >= localFilters.rating;

      return matchesQuery && matchesCategory && matchesPrice && matchesRating;
    });

    // Apply sorting
    switch (localFilters.sortBy) {
      case 'price_low':
        results.sort((a, b) => parseFloat(a.price.replace(/[$,]/g, '')) - parseFloat(b.price.replace(/[$,]/g, '')));
        break;
      case 'price_high':
        results.sort((a, b) => parseFloat(b.price.replace(/[$,]/g, '')) - parseFloat(a.price.replace(/[$,]/g, '')));
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
      default:
        // Keep original order (popularity)
        break;
    }

    setFilteredResults(results);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      dispatch(addRecentSearch(searchQuery.trim()));
    }
    dispatch(updateSearchFilters(localFilters));
    filterResults();
  };

  const applyFilters = () => {
    dispatch(updateSearchFilters(localFilters));
    setShowFilters(false);
    filterResults();
  };

  const resetFilters = () => {
    const defaultFilters = {
      priceRange: [0, 2000],
      duration: 'any',
      category: 'all',
      rating: 0,
      sortBy: 'popularity',
      amenities: [],
    };
    setLocalFilters(defaultFilters);
  };

  const handleSaveSearch = () => {
    if (saveSearchName.trim()) {
      dispatch(saveSearch({
        name: saveSearchName.trim(),
        filters: { ...localFilters, query: searchQuery },
      }));
      setSaveSearchName('');
      setShowSaveDialog(false);
      Alert.alert('Success', 'Search saved successfully!');
    }
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={[styles.resultCard, { backgroundColor: colors.card }]}
      onPress={() => router.push(`/details/${item.id}`)}
    >
      <View style={styles.resultContent}>
        <Text style={[styles.resultTitle, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.resultDescription, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.resultFooter}>
          <View style={styles.resultLocation}>
            <MapPin stroke={colors.textMuted} width={14} height={14} />
            <Text style={[styles.resultLocationText, { color: colors.textMuted }]}>{item.country}</Text>
          </View>
          <View style={styles.resultPrice}>
            <DollarSign stroke={colors.primary} width={14} height={14} />
            <Text style={[styles.resultPriceText, { color: colors.primary }]}>{item.price}</Text>
          </View>
        </View>
        {item.rating && (
          <View style={styles.resultRating}>
            <Star stroke="#FFD700" fill="#FFD700" width={14} height={14} />
            <Text style={[styles.resultRatingText, { color: colors.textSecondary }]}>{item.rating}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderFilterSection = () => (
    <View style={[styles.filtersContainer, { backgroundColor: colors.surface }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Price Range */}
        <View style={styles.filterSection}>
          <Text style={[styles.filterTitle, { color: colors.text }]}>Price Range</Text>
          <View style={styles.priceRangeContainer}>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
              ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={2000}
              value={localFilters.priceRange[1]}
              onValueChange={(value) => 
                setLocalFilters(prev => ({ 
                  ...prev, 
                  priceRange: [prev.priceRange[0], Math.round(value)] 
                }))
              }
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border}
              thumbStyle={{ backgroundColor: colors.primary }}
            />
          </View>
        </View>

        {/* Category */}
        <View style={styles.filterSection}>
          <Text style={[styles.filterTitle, { color: colors.text }]}>Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  { 
                    backgroundColor: localFilters.category === category.id ? colors.primary : colors.inputBackground,
                    borderColor: localFilters.category === category.id ? colors.primary : colors.border,
                  }
                ]}
                onPress={() => setLocalFilters(prev => ({ ...prev, category: category.id }))}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryText,
                  { 
                    color: localFilters.category === category.id ? '#ffffff' : colors.text 
                  }
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Rating */}
        <View style={styles.filterSection}>
          <Text style={[styles.filterTitle, { color: colors.text }]}>Minimum Rating</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <TouchableOpacity
                key={rating}
                style={[
                  styles.ratingButton,
                  { backgroundColor: localFilters.rating >= rating ? colors.primary : colors.inputBackground }
                ]}
                onPress={() => setLocalFilters(prev => ({ ...prev, rating }))}
              >
                <Star 
                  stroke="#FFD700" 
                  fill={localFilters.rating >= rating ? "#FFD700" : "transparent"} 
                  width={20} 
                  height={20} 
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sort By */}
        <View style={styles.filterSection}>
          <Text style={[styles.filterTitle, { color: colors.text }]}>Sort By</Text>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.sortOption,
                { 
                  backgroundColor: localFilters.sortBy === option.id ? colors.primary : 'transparent',
                  borderColor: colors.border,
                }
              ]}
              onPress={() => setLocalFilters(prev => ({ ...prev, sortBy: option.id }))}
            >
              <Text style={[
                styles.sortOptionText,
                { 
                  color: localFilters.sortBy === option.id ? '#ffffff' : colors.text 
                }
              ]}>
                {option.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.filterActions}>
          <TouchableOpacity
            style={[styles.resetButton, { borderColor: colors.border }]}
            onPress={resetFilters}
          >
            <Text style={[styles.resetButtonText, { color: colors.text }]}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: colors.primary }]}
            onPress={applyFilters}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft stroke={colors.text} width={24} height={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Advanced Search</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => setShowSaveDialog(true)}
        >
          <Text style={[styles.saveButtonText, { color: colors.primary }]}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}>
          <Search stroke={colors.textMuted} width={20} height={20} />
          <TextInput
            style={[styles.searchInput, { color: colors.inputText }]}
            placeholder="Search destinations, hotels, activities..."
            placeholderTextColor={colors.inputPlaceholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X stroke={colors.textMuted} width={20} height={20} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { 
              backgroundColor: showFilters ? colors.primary : colors.inputBackground,
              borderColor: showFilters ? colors.primary : colors.border,
            }
          ]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter stroke={showFilters ? '#ffffff' : colors.text} width={20} height={20} />
        </TouchableOpacity>
      </View>

      {/* Results Counter */}
      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
          {filteredResults.length} results found
        </Text>
      </View>

      {/* Filters Panel */}
      {showFilters && renderFilterSection()}

      {/* Search Results */}
      <FlatList
        data={filteredResults}
        renderItem={renderSearchResult}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.resultsList}
        showsVerticalScrollIndicator={false}
      />
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
  saveButton: {
    paddingVertical: 5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  searchContainer: {
    flex: 1,
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
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  resultsCount: {
    fontSize: 14,
  },
  filtersContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    maxHeight: 400,
  },
  filterSection: {
    marginBottom: 25,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  priceRangeContainer: {
    paddingHorizontal: 5,
  },
  priceLabel: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortOption: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resultCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      default: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  resultContent: {
    gap: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resultLocationText: {
    fontSize: 12,
  },
  resultPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resultPriceText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resultRatingText: {
    fontSize: 12,
  },
});