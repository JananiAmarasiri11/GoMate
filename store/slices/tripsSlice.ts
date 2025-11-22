import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Trip {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  destinations: TripDestination[];
  createdAt: string;
  updatedAt: string;
}

export interface TripDestination {
  id: string;
  name: string;
  description: string;
  image: string;
  country: string;
  addedAt: string;
  order: number;
  notes?: string;
}

interface TripsState {
  trips: Trip[];
  currentTrip: Trip | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TripsState = {
  trips: [],
  currentTrip: null,
  isLoading: false,
  error: null,
};

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    createTripStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createTripSuccess: (state, action: PayloadAction<Trip>) => {
      state.isLoading = false;
      state.trips.push(action.payload);
      state.currentTrip = action.payload;
    },
    createTripFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateTrip: (state, action: PayloadAction<Trip>) => {
      const index = state.trips.findIndex(trip => trip.id === action.payload.id);
      if (index !== -1) {
        state.trips[index] = action.payload;
        if (state.currentTrip?.id === action.payload.id) {
          state.currentTrip = action.payload;
        }
      }
    },
    deleteTrip: (state, action: PayloadAction<string>) => {
      state.trips = state.trips.filter(trip => trip.id !== action.payload);
      if (state.currentTrip?.id === action.payload) {
        state.currentTrip = null;
      }
    },
    setCurrentTrip: (state, action: PayloadAction<Trip | null>) => {
      state.currentTrip = action.payload;
    },
    addDestinationToTrip: (state, action: PayloadAction<{ tripId: string; destination: Omit<TripDestination, 'addedAt' | 'order'> }>) => {
      const { tripId, destination } = action.payload;
      const trip = state.trips.find(trip => trip.id === tripId);
      if (trip) {
        if (!trip.destinations) {
          trip.destinations = [];
        }
        trip.destinations.push({
          ...destination,
          addedAt: new Date().toISOString(),
          order: trip.destinations.length,
        });
        if (state.currentTrip?.id === tripId) {
          state.currentTrip = trip;
        }
      }
    },
    removeDestinationFromTrip: (state, action: PayloadAction<{ tripId: string; destinationId: string }>) => {
      const { tripId, destinationId } = action.payload;
      const trip = state.trips.find(trip => trip.id === tripId);
      if (trip && trip.destinations) {
        trip.destinations = trip.destinations.filter(dest => dest.id !== destinationId);
        if (state.currentTrip?.id === tripId) {
          state.currentTrip = trip;
        }
      }
    },
    reorderTripDestinations: (state, action: PayloadAction<{ tripId: string; reorderedDestinations: TripDestination[] }>) => {
      const { tripId, reorderedDestinations } = action.payload;
      const trip = state.trips.find(trip => trip.id === tripId);
      if (trip) {
        trip.destinations = reorderedDestinations.map((dest, index) => ({
          ...dest,
          order: index,
        }));
        if (state.currentTrip?.id === tripId) {
          state.currentTrip = trip;
        }
      }
    },
    setTrips: (state, action: PayloadAction<Trip[]>) => {
      state.trips = action.payload;
    },
    clearTrips: (state) => {
      state.trips = [];
      state.currentTrip = null;
    },
  },
});

export const {
  createTripStart,
  createTripSuccess,
  createTripFailure,
  updateTrip,
  deleteTrip,
  setCurrentTrip,
  addDestinationToTrip,
  removeDestinationFromTrip,
  reorderTripDestinations,
  setTrips,
  clearTrips,
} = tripsSlice.actions;

export default tripsSlice.reducer;