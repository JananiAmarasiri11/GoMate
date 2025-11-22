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
  Modal,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Edit3, 
  Trash2,
  Share2,
  Camera
} from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { RootState, AppDispatch } from '@/store';
import { 
  createTripStart, 
  createTripSuccess, 
  createTripFailure,
  addDestinationToTrip,
  removeDestinationFromTrip,
  updateTrip
} from '@/store/slices/tripsSlice';
import { addNotification } from '@/store/slices/notificationsSlice';
import { Trip, TripDestination } from '@/store/slices/tripsSlice';

export default function TripPlanningScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { colors, isDarkMode } = useThemeColors();
  
  const { trips, currentTrip, isLoading } = useSelector((state: RootState) => state.trips);
  const { destinations } = useSelector((state: RootState) => state.destinations);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddDestinationModal, setShowAddDestinationModal] = useState(false);
  const [newTrip, setNewTrip] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelers: '1',
  });
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);

  useEffect(() => {
    // Add sample notification when component mounts
    dispatch(addNotification({
      title: 'Trip Planning Ready!',
      message: 'Start planning your next adventure with our trip planner.',
      type: 'info',
    }));
  }, [dispatch]);

  const handleCreateTrip = async () => {
    if (!newTrip.name.trim() || !newTrip.startDate || !newTrip.endDate) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    try {
      dispatch(createTripStart());
      
      const trip: Trip = {
        id: Date.now().toString(),
        name: newTrip.name.trim(),
        description: newTrip.description.trim(),
        startDate: newTrip.startDate,
        endDate: newTrip.endDate,
        destinations: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch(createTripSuccess(trip));
      dispatch(addNotification({
        title: 'Trip Created!',
        message: `${trip.name} has been created successfully.`,
        type: 'success',
      }));

      setNewTrip({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        budget: '',
        travelers: '1',
      });
      setShowCreateModal(false);
    } catch (error) {
      dispatch(createTripFailure('Failed to create trip'));
    }
  };

  const handleAddDestinations = () => {
    if (!currentTrip || selectedDestinations.length === 0) return;

    selectedDestinations.forEach(destId => {
      const destination = destinations.find(d => d.id === destId);
      if (destination) {
        const tripDestination: Omit<TripDestination, 'addedAt' | 'order'> = {
          id: destination.id,
          name: destination.name,
          description: destination.description,
          image: destination.image,
          country: destination.country,
        };
        
        dispatch(addDestinationToTrip({
          tripId: currentTrip.id,
          destination: tripDestination,
        }));
      }
    });

    dispatch(addNotification({
      title: 'Destinations Added!',
      message: `${selectedDestinations.length} destinations added to your trip.`,
      type: 'success',
    }));

    setSelectedDestinations([]);
    setShowAddDestinationModal(false);
  };

  const handleRemoveDestination = (destinationId: string) => {
    if (!currentTrip) return;
    
    Alert.alert(
      'Remove Destination',
      'Are you sure you want to remove this destination from your trip?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            dispatch(removeDestinationFromTrip({
              tripId: currentTrip.id,
              destinationId,
            }));
          },
        },
      ]
    );
  };

  const handleShareTrip = () => {
    if (!currentTrip) return;
    
    const shareText = `Check out my trip plan: ${currentTrip.name}\n${currentTrip.description}\n\nDestinations:\n${currentTrip.destinations.map(d => `• ${d.name}, ${d.country}`).join('\n')}`;
    
    // In a real app, this would use the Share API
    Alert.alert('Share Trip', shareText);
    
    dispatch(addNotification({
      title: 'Trip Shared!',
      message: 'Your trip has been shared successfully.',
      type: 'success',
    }));
  };

  const renderTripCard = ({ item }: { item: Trip }) => (
    <TouchableOpacity
      style={[styles.tripCard, { backgroundColor: colors.card }]}
      onPress={() => router.push(`/trip-details/${item.id}`)}
    >
      <View style={styles.tripHeader}>
        <Text style={[styles.tripName, { color: colors.text }]}>{item.name}</Text>
        <TouchableOpacity onPress={() => handleShareTrip()}>
          <Share2 stroke={colors.primary} width={20} height={20} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.tripDescription, { color: colors.textSecondary }]} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.tripInfo}>
        <View style={styles.tripInfoItem}>
          <Calendar stroke={colors.textMuted} width={16} height={16} />
          <Text style={[styles.tripInfoText, { color: colors.textMuted }]}>
            {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.tripInfoItem}>
          <MapPin stroke={colors.textMuted} width={16} height={16} />
          <Text style={[styles.tripInfoText, { color: colors.textMuted }]}>
            {item.destinations.length} destinations
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDestinationItem = ({ item }: { item: any }) => {
    const isSelected = selectedDestinations.includes(item.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.destinationItem,
          { 
            backgroundColor: isSelected ? colors.primary : colors.card,
            borderColor: isSelected ? colors.primary : colors.border,
          }
        ]}
        onPress={() => {
          if (isSelected) {
            setSelectedDestinations(prev => prev.filter(id => id !== item.id));
          } else {
            setSelectedDestinations(prev => [...prev, item.id]);
          }
        }}
      >
        <Text style={[
          styles.destinationName,
          { color: isSelected ? '#ffffff' : colors.text }
        ]}>
          {item.name}
        </Text>
        <Text style={[
          styles.destinationCountry,
          { color: isSelected ? '#ffffff' : colors.textSecondary }
        ]}>
          {item.country}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCurrentTripDestination = ({ item }: { item: TripDestination }) => (
    <View style={[styles.currentDestination, { backgroundColor: colors.card }]}>
      <View style={styles.currentDestinationContent}>
        <Text style={[styles.currentDestinationName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.currentDestinationCountry, { color: colors.textSecondary }]}>
          {item.country}
        </Text>
        {item.notes && (
          <Text style={[styles.currentDestinationNotes, { color: colors.textMuted }]}>
            {item.notes}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveDestination(item.id)}
      >
        <Trash2 stroke={colors.error} width={20} height={20} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft stroke={colors.text} width={24} height={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Trip Planning</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Plus stroke={colors.primary} width={24} height={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* My Trips */}
        {trips.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>My Trips</Text>
            <FlatList
              data={trips}
              renderItem={renderTripCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tripsList}
            />
          </View>
        )}

        {/* Current Trip Details */}
        {currentTrip && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {currentTrip.name}
              </Text>
              <TouchableOpacity
                style={[styles.addDestinationButton, { backgroundColor: colors.primary }]}
                onPress={() => setShowAddDestinationModal(true)}
              >
                <Plus stroke="#ffffff" width={16} height={16} />
                <Text style={styles.addDestinationText}>Add Destination</Text>
              </TouchableOpacity>
            </View>
            
            {currentTrip.destinations.length > 0 ? (
              <FlatList
                data={currentTrip.destinations.sort((a, b) => a.order - b.order)}
                renderItem={renderCurrentTripDestination}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            ) : (
              <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
                <Camera stroke={colors.textMuted} width={48} height={48} />
                <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
                  No destinations yet
                </Text>
                <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                  Add some destinations to start planning your trip
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Getting Started */}
        {trips.length === 0 && (
          <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
            <MapPin stroke={colors.textMuted} width={64} height={64} />
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
              Start Planning Your Trip
            </Text>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              Create your first trip and add destinations to get started
            </Text>
            <TouchableOpacity
              style={[styles.startButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowCreateModal(true)}
            >
              <Text style={styles.startButtonText}>Create Your First Trip</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Create Trip Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.surface }]}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={[styles.modalCancel, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Create Trip</Text>
            <TouchableOpacity onPress={handleCreateTrip}>
              <Text style={[styles.modalSave, { color: colors.primary }]}>Create</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Trip Name *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
                placeholder="Enter trip name"
                placeholderTextColor={colors.inputPlaceholder}
                value={newTrip.name}
                onChangeText={(text) => setNewTrip(prev => ({ ...prev, name: text }))}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Description</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
                placeholder="Describe your trip"
                placeholderTextColor={colors.inputPlaceholder}
                multiline
                numberOfLines={3}
                value={newTrip.description}
                onChangeText={(text) => setNewTrip(prev => ({ ...prev, description: text }))}
              />
            </View>

            <View style={styles.dateRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Start Date *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor={colors.inputPlaceholder}
                  value={newTrip.startDate}
                  onChangeText={(text) => setNewTrip(prev => ({ ...prev, startDate: text }))}
                />
              </View>
              
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>End Date *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor={colors.inputPlaceholder}
                  value={newTrip.endDate}
                  onChangeText={(text) => setNewTrip(prev => ({ ...prev, endDate: text }))}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Add Destination Modal */}
      <Modal
        visible={showAddDestinationModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.surface }]}>
            <TouchableOpacity onPress={() => setShowAddDestinationModal(false)}>
              <Text style={[styles.modalCancel, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add Destinations</Text>
            <TouchableOpacity onPress={handleAddDestinations}>
              <Text style={[styles.modalSave, { color: colors.primary }]}>Add ({selectedDestinations.length})</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={destinations.filter(dest => 
              !currentTrip?.destinations.some(tripDest => tripDest.id === dest.id)
            )}
            renderItem={renderDestinationItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.destinationsList}
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
  createButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tripsList: {
    paddingRight: 20,
  },
  tripCard: {
    width: 280,
    padding: 16,
    borderRadius: 12,
    marginRight: 15,
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
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  tripDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  tripInfo: {
    gap: 8,
  },
  tripInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tripInfoText: {
    fontSize: 12,
  },
  addDestinationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  addDestinationText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  currentDestination: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  currentDestinationContent: {
    flex: 1,
  },
  currentDestinationName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  currentDestinationCountry: {
    fontSize: 14,
    marginBottom: 4,
  },
  currentDestinationNotes: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  removeButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    margin: 20,
    borderRadius: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  startButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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
  modalSave: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  dateRow: {
    flexDirection: 'row',
  },
  destinationsList: {
    padding: 20,
  },
  destinationItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  destinationCountry: {
    fontSize: 14,
  },
});