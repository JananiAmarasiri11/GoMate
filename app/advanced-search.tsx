import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  DollarSign, 
  Calendar, 
  Users, 
  Activity,
  Clock,
  Bookmark,
  X,
  ChevronDown,
  ChevronUp,
  Sliders
} from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { RootState, AppDispatch } from '@/store';
import { 
  updateSearchFilters,
  addSavedSearch,
  removeSavedSearch,
  addRecentSearch,
  clearRecentSearches
} from '@/store/slices/utilitiesSlice';
import { addNotification } from '@/store/slices/notificationsSlice';

export default function AdvancedSearchScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { colors, isDarkMode } = useThemeColors();
  
  const { searchFilters, savedSearches, recentSearches } = useSelector((state: RootState) => state.utilities);
  const { destinations } = useSelector((state: RootState) => state.destinations);
  
  // Default filters structure
  const defaultFilters = {
    priceRange: { min: 0, max: 10000 },
    categories: [],
    minRating: 0,
    sortBy: 'relevance' as const,
    dateRange: { startDate: '', endDate: '' },
    groupSize: 1,
    duration: { min: 1, max: 30 },
    amenities: []
  };
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [localFilters, setLocalFilters] = useState({ ...defaultFilters, ...searchFilters });
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    dispatch(addNotification({
      title: 'Advanced Search Ready!',
      message: 'Use powerful filters to find your perfect destinations.',
      type: 'info',
    }));
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, localFilters]);

  const performSearch = async () => {
    setIsSearching(true);
    
    // Simulate search API call
    const filteredResults = destinations.filter(destination => {
      const matchesQuery = destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          destination.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          destination.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPriceRange = destination.price >= localFilters.priceRange.min &&
                               destination.price <= localFilters.priceRange.max;
      
      const matchesRating = destination.rating >= localFilters.minRating;
      
      const matchesCategory = localFilters.categories.length === 0 ||
                             localFilters.categories.some(cat => 
                               destination.category.toLowerCase().includes(cat.toLowerCase())
                             );
      
      return matchesQuery && matchesPriceRange && matchesRating && matchesCategory;
    });

    setTimeout(() => {
      setSearchResults(filteredResults);
      setIsSearching(false);
      
      if (searchQuery.trim()) {
        dispatch(addRecentSearch(searchQuery.trim()));
      }
    }, 500);
  };

  const handleApplyFilters = () => {
    dispatch(updateSearchFilters(localFilters));
    setShowFilters(false);
    performSearch();
  };

  const handleResetFilters = () => {
    setLocalFilters(defaultFilters);
    dispatch(updateSearchFilters(defaultFilters));
  };

  const handleSaveSearch = () => {
    if (searchQuery.trim()) {
      const savedSearch = {
        id: Date.now().toString(),
        query: searchQuery.trim(),
        filters: localFilters,
        timestamp: new Date().toISOString(),
        resultsCount: searchResults.length,
      };
      
      dispatch(addSavedSearch(savedSearch));
      dispatch(addNotification({
        title: 'Search Saved!',
        message: `"${searchQuery}" has been saved to your searches.`,
        type: 'success',
      }));
    }
  };

  const handleLoadSavedSearch = (savedSearch: any) => {
    setSearchQuery(savedSearch.query);
    setLocalFilters(savedSearch.filters);
    dispatch(updateSearchFilters(savedSearch.filters));
    setShowSavedSearches(false);
  };

  const handleDeleteSavedSearch = (id: string) => {
    dispatch(removeSavedSearch(id));
  };

  const categories = ['Beach', 'Mountain', 'City', 'Nature', 'Cultural', 'Adventure', 'Relaxation', 'Historical'];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' },
  ];

  const renderSearchResult = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.resultCard, { backgroundColor: colors.surface }]}
      onPress={() => router.push(`/details/${item.id}`)}
    >
      <View style={styles.resultContent}>
        <View style={styles.resultHeader}>
          <Text style={[styles.resultName, { color: colors.text }]}>{item.name}</Text>
          <View style={styles.resultRating}>
            <Star stroke={colors.warning} fill={colors.warning} width={14} height={14} />
            <Text style={[styles.ratingText, { color: colors.textSecondary }]}>{item.rating}</Text>
          </View>
        </View>
        
        <View style={styles.resultLocation}>
          <MapPin stroke={colors.textMuted} width={14} height={14} />
          <Text style={[styles.locationText, { color: colors.textMuted }]}>{item.country}</Text>
        </View>
        
        <Text style={[styles.resultDescription, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.resultFooter}>
          <View style={styles.resultPrice}>
            <DollarSign stroke={colors.primary} width={16} height={16} />
            <Text style={[styles.priceText, { color: colors.primary }]}>${item.price}</Text>
          </View>
          <Text style={[styles.categoryText, { color: colors.textMuted }]}>{item.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRecentSearch = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.recentSearchItem}
      onPress={() => setSearchQuery(item)}
    >
      <Clock stroke={colors.textMuted} width={16} height={16} />
      <Text style={[styles.recentSearchText, { color: colors.text }]}>{item}</Text>
    </TouchableOpacity>
  );

  const renderSavedSearch = ({ item }: { item: any }) => (
    <View style={[styles.savedSearchItem, { backgroundColor: colors.card }]}>
      <View style={styles.savedSearchContent}>
        <Text style={[styles.savedSearchQuery, { color: colors.text }]}>{item.query}</Text>
        <Text style={[styles.savedSearchMeta, { color: colors.textSecondary }]}>
          {item.resultsCount} results • {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.savedSearchActions}>
        <TouchableOpacity
          style={styles.loadButton}
          onPress={() => handleLoadSavedSearch(item)}
        >
          <Text style={[styles.loadButtonText, { color: colors.primary }]}>Load</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteSavedSearch(item.id)}
        >
          <X stroke={colors.error} width={16} height={16} />
        </TouchableOpacity>
      </View>
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
          style={styles.savedButton}
          onPress={() => setShowSavedSearches(true)}
        >
          <Bookmark stroke={colors.primary} width={24} height={24} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}>
          <Search stroke={colors.textMuted} width={20} height={20} />
          <TextInput
            style={[styles.searchInput, { color: colors.inputText }]}
            placeholder="Search destinations, countries, activities..."
            placeholderTextColor={colors.inputPlaceholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X stroke={colors.textMuted} width={20} height={20} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowFilters(true)}
        >
          <Filter stroke="#ffffff" width={20} height={20} />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={[styles.quickActions, { backgroundColor: colors.surface }]}>
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: colors.card }]}
            onPress={handleSaveSearch}
          >
            <Bookmark stroke={colors.primary} width={16} height={16} />
            <Text style={[styles.quickActionText, { color: colors.primary }]}>Save Search</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.quickAction, { backgroundColor: colors.card }]}
          onPress={handleResetFilters}
        >
          <X stroke={colors.textSecondary} width={16} height={16} />
          <Text style={[styles.quickActionText, { color: colors.textSecondary }]}>Clear Filters</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Recent Searches */}
        {searchQuery.length === 0 && recentSearches && recentSearches.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Searches</Text>
              <TouchableOpacity onPress={() => dispatch(clearRecentSearches())}>
                <Text style={[styles.clearText, { color: colors.textSecondary }]}>Clear</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={recentSearches.slice(0, 5)}
              renderItem={renderRecentSearch}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Search Results */}
        {searchQuery.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {isSearching ? 'Searching...' : `${searchResults.length} Results`}
              </Text>
              {searchResults.length > 0 && (
                <Text style={[styles.sortText, { color: colors.textSecondary }]}>
                  Sorted by {sortOptions.find(opt => opt.value === localFilters.sortBy)?.label}
                </Text>
              )}
            </View>
            
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ListEmptyComponent={
                !isSearching && searchQuery.length > 0 ? (
                  <View style={styles.emptyResults}>
                    <Search stroke={colors.textMuted} width={48} height={48} />
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>No results found</Text>
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                      Try adjusting your search or filters
                    </Text>
                  </View>
                ) : null
              }
            />
          </View>
        )}
      </ScrollView>

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.surface }]}>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={[styles.modalCancel, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Search Filters</Text>
            <TouchableOpacity onPress={handleApplyFilters}>
              <Text style={[styles.modalApply, { color: colors.primary }]}>Apply</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: colors.text }]}>Price Range</Text>
              <View style={styles.priceRange}>
                <TextInput
                  style={[styles.priceInput, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
                  placeholder="Min"
                  placeholderTextColor={colors.inputPlaceholder}
                  value={localFilters.priceRange.min.toString()}
                  onChangeText={(text) => setLocalFilters(prev => ({
                    ...prev,
                    priceRange: { ...prev.priceRange, min: parseInt(text) || 0 }
                  }))}
                  keyboardType="numeric"
                />
                <Text style={[styles.priceSeparator, { color: colors.textMuted }]}>to</Text>
                <TextInput
                  style={[styles.priceInput, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
                  placeholder="Max"
                  placeholderTextColor={colors.inputPlaceholder}
                  value={localFilters.priceRange.max.toString()}
                  onChangeText={(text) => setLocalFilters(prev => ({
                    ...prev,
                    priceRange: { ...prev.priceRange, max: parseInt(text) || 10000 }
                  }))}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Categories */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: colors.text }]}>Categories</Text>
              <View style={styles.categoryGrid}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: localFilters.categories.includes(category) ? colors.primary : colors.card,
                        borderColor: localFilters.categories.includes(category) ? colors.primary : colors.border,
                      }
                    ]}
                    onPress={() => {
                      const newCategories = localFilters.categories.includes(category)
                        ? localFilters.categories.filter(c => c !== category)
                        : [...localFilters.categories, category];
                      setLocalFilters(prev => ({ ...prev, categories: newCategories }));
                    }}
                  >
                    <Text style={[
                      styles.categoryChipText,
                      { color: localFilters.categories.includes(category) ? '#ffffff' : colors.text }
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Rating */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: colors.text }]}>Minimum Rating</Text>
              <View style={styles.ratingSelector}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingOption,
                      {
                        backgroundColor: localFilters.minRating >= rating ? colors.warning : colors.card,
                      }
                    ]}
                    onPress={() => setLocalFilters(prev => ({ ...prev, minRating: rating }))}
                  >
                    <Star
                      stroke={localFilters.minRating >= rating ? '#ffffff' : colors.warning}
                      fill={localFilters.minRating >= rating ? '#ffffff' : 'transparent'}
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
                  key={option.value}
                  style={[
                    styles.sortOption,
                    { borderColor: colors.border }
                  ]}
                  onPress={() => setLocalFilters(prev => ({ ...prev, sortBy: option.value as any }))}
                >
                  <Text style={[styles.sortOptionText, { color: colors.text }]}>{option.label}</Text>
                  <View style={[
                    styles.radioButton,
                    {
                      borderColor: localFilters.sortBy === option.value ? colors.primary : colors.border,
                      backgroundColor: localFilters.sortBy === option.value ? colors.primary : 'transparent',
                    }
                  ]}>
                    {localFilters.sortBy === option.value && (
                      <View style={[styles.radioInner, { backgroundColor: '#ffffff' }]} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Saved Searches Modal */}
      <Modal
        visible={showSavedSearches}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.surface }]}>
            <TouchableOpacity onPress={() => setShowSavedSearches(false)}>
              <Text style={[styles.modalCancel, { color: colors.textSecondary }]}>Close</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Saved Searches</Text>
            <View style={{ width: 60 }} />
          </View>
          
          <FlatList
            data={savedSearches}
            renderItem={renderSavedSearch}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.savedSearchesList}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Bookmark stroke={colors.textMuted} width={48} height={48} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No saved searches</Text>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Save your searches to quickly access them later
                </Text>
              </View>
            }
          />
        </SafeAreaView>
      </Modal>
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
  savedButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 15,
    gap: 12,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearText: {
    fontSize: 14,
  },
  sortText: {
    fontSize: 12,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  recentSearchText: {
    fontSize: 14,
  },
  resultCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  resultContent: {
    gap: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  resultRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
  },
  resultLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
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
  resultPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  emptyResults: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  modalCancel: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalApply: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginBottom: 30,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  priceRange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  priceSeparator: {
    fontSize: 14,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  ratingSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingOption: {
    padding: 12,
    borderRadius: 8,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  sortOptionText: {
    fontSize: 16,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  savedSearchesList: {
    padding: 20,
  },
  savedSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  savedSearchContent: {
    flex: 1,
  },
  savedSearchQuery: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  savedSearchMeta: {
    fontSize: 12,
  },
  savedSearchActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  loadButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },
});