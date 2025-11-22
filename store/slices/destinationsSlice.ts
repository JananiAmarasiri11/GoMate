import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Destination {
  id: string;
  name: string;
  description: string;
  image: string;
  status: 'Popular' | 'Trending' | 'New' | 'Featured';
  category: 'destination' | 'transport';
  price?: string;
  rating?: number;
  country: string;
}

interface DestinationsState {
  destinations: Destination[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: 'all' | 'destination' | 'transport';
}

const initialState: DestinationsState = {
  destinations: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedCategory: 'all',
};

const destinationsSlice = createSlice({
  name: 'destinations',
  initialState,
  reducers: {
    fetchDestinationsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchDestinationsSuccess: (state, action: PayloadAction<Destination[]>) => {
      state.destinations = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchDestinationsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<'all' | 'destination' | 'transport'>) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const {
  fetchDestinationsStart,
  fetchDestinationsSuccess,
  fetchDestinationsFailure,
  setSearchQuery,
  setSelectedCategory,
} = destinationsSlice.actions;

export default destinationsSlice.reducer;