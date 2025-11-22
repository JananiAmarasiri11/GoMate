import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import destinationsReducer from './slices/destinationsSlice';
import favoritesReducer from './slices/favoritesSlice';
import themeReducer from './slices/themeSlice';
import tripsReducer from './slices/tripsSlice';
import notificationsReducer from './slices/notificationsSlice';
import utilitiesReducer from './slices/utilitiesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
    destinations: destinationsReducer,
    theme: themeReducer,
    trips: tripsReducer,
    notifications: notificationsReducer,
    utilities: utilitiesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;