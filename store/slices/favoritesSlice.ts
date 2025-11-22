import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Destination } from './destinationsSlice';

interface FavoritesState {
  favorites: Destination[];
  isLoading: boolean;
}

const initialState: FavoritesState = {
  favorites: [],
  isLoading: false,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<Destination>) => {
      const exists = state.favorites.find(item => item.id === action.payload.id);
      if (!exists) {
        state.favorites.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(item => item.id !== action.payload);
    },
    setFavorites: (state, action: PayloadAction<Destination[]>) => {
      state.favorites = action.payload;
    },
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
});

export const { addToFavorites, removeFromFavorites, setFavorites, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;