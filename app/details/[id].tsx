import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Heart,
    MapPin,
    Share2,
    Star
} from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { destinationsService } from '@/services/api';
import { storageService } from '@/services/storage';
import { AppDispatch, RootState } from '@/store';
import { Destination } from '@/store/slices/destinationsSlice';
import { addToFavorites, removeFromFavorites } from '@/store/slices/favoritesSlice';

const { width } = Dimensions.get('window');

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  
  const dispatch = useDispatch<AppDispatch>();
  const { favorites } = useSelector((state: RootState) => state.favorites);
  
  const isFavorite = destination ? favorites.some(fav => fav.id === destination.id) : false;

  useEffect(() => {
    if (id) {
      loadDestination();
    }
  }, [id]);

  const loadDestination = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const data = await destinationsService.getDestinationById(id);
      setDestination(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load destination details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!destination) return;

    if (isFavorite) {
      dispatch(removeFromFavorites(destination.id));
      const updatedFavorites = favorites.filter(fav => fav.id !== destination.id);
      await storageService.saveFavorites(updatedFavorites);
    } else {
      dispatch(addToFavorites(destination));
      const updatedFavorites = [...favorites, destination];
      await storageService.saveFavorites(updatedFavorites);
    }
  };

  const handleShare = () => {
    Alert.alert('Share', `Share ${destination?.name} with friends!`);
  };

  const handleBookNow = () => {
    Alert.alert(
      'Book Now', 
      `Ready to book ${destination?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => console.log('Booking process...') }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Popular': return '#ff6b6b';
      case 'Trending': return '#4ecdc4';
      case 'New': return '#45b7d1';
      case 'Featured': return '#f9ca24';
      default: return '#95a5a6';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!destination) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Destination not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: destination.image }} style={styles.heroImage} />
          
          <View style={styles.headerOverlay}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <ArrowLeft stroke="#fff" width={24} height={24} />
            </TouchableOpacity>
            
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleShare}
              >
                <Share2 stroke="#fff" width={24} height={24} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.headerButton, isFavorite && styles.favoriteActive]}
                onPress={handleFavoriteToggle}
              >
                <Heart 
                  stroke={isFavorite ? "#ff4444" : "#fff"} 
                  fill={isFavorite ? "#ff4444" : "transparent"}
                  width={24} 
                  height={24} 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.statusBadge}>
            <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(destination.status) }]}>
              <Text style={styles.statusText}>{destination.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{destination.name}</Text>
            
            <View style={styles.locationRow}>
              <MapPin stroke="#666" width={18} height={18} />
              <Text style={styles.locationText}>{destination.country}</Text>
            </View>
            
            {destination.rating && (
              <View style={styles.ratingRow}>
                <View style={styles.ratingContainer}>
                  <Star stroke="#FFD700" fill="#FFD700" width={18} height={18} />
                  <Text style={styles.ratingText}>{destination.rating}</Text>
                  <Text style={styles.ratingSubtext}>(150+ reviews)</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{destination.description}</Text>
            
            <Text style={styles.expandedDescription}>
              {destination.category === 'destination' 
                ? "This amazing destination offers breathtaking views, rich cultural experiences, and unforgettable memories. Perfect for travelers seeking adventure, relaxation, or cultural immersion. The location provides excellent amenities, guided tours, and local experiences that will make your trip truly special."
                : "This transport option provides convenient and comfortable travel experiences. With reliable schedules, modern facilities, and excellent service, it's the perfect choice for your journey. Whether you're traveling for business or leisure, this service ensures a smooth and enjoyable trip."
              }
            </Text>
          </View>

          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresGrid}>
              <View style={styles.featureItem}>
                <Clock stroke="#007AFF" width={24} height={24} />
                <Text style={styles.featureText}>24/7 Support</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Calendar stroke="#007AFF" width={24} height={24} />
                <Text style={styles.featureText}>Flexible Booking</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Star stroke="#007AFF" width={24} height={24} />
                <Text style={styles.featureText}>Top Rated</Text>
              </View>
              
              <View style={styles.featureItem}>
                <MapPin stroke="#007AFF" width={24} height={24} />
                <Text style={styles.featureText}>Prime Location</Text>
              </View>
            </View>
          </View>

          {destination.price && (
            <View style={styles.pricingSection}>
              <Text style={styles.sectionTitle}>Pricing</Text>
              <View style={styles.priceRow}>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceAmount}>{destination.price}</Text>
                  <Text style={styles.priceUnit}>
                    {destination.category === 'destination' ? 'per person' : 'per trip'}
                  </Text>
                </View>
                <View style={styles.priceFeatures}>
                  <Text style={styles.priceFeature}>✓ All inclusive</Text>
                  <Text style={styles.priceFeature}>✓ Free cancellation</Text>
                  <Text style={styles.priceFeature}>✓ 24/7 support</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.priceBottomContainer}>
          {destination.price && (
            <>
              <Text style={styles.bottomPriceLabel}>Starting from</Text>
              <Text style={styles.bottomPrice}>{destination.price}</Text>
            </>
          )}
        </View>
        
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>
            {destination.category === 'destination' ? 'Book Now' : 'Reserve Seat'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
  },
  heroImage: {
    width: width,
    height: 300,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 10,
  },
  favoriteActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    color: '#666',
  },
  ratingRow: {
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  ratingSubtext: {
    fontSize: 14,
    color: '#666',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 12,
  },
  expandedDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureItem: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  pricingSection: {
    marginBottom: 24,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  priceContainer: {
    flex: 1,
  },
  priceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  priceUnit: {
    fontSize: 16,
    color: '#666',
  },
  priceFeatures: {
    flex: 1,
    paddingLeft: 20,
  },
  priceFeature: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      default: {
        boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  priceBottomContainer: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: 14,
    color: '#666',
  },
  bottomPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginLeft: 16,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});