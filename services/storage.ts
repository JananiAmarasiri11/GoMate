import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const USER_KEY = 'user_data';
const FAVORITES_KEY = 'user_favorites';
const THEME_KEY = 'theme_preference';

// Web-compatible storage fallback
const webStorage = {
  setItem: (key: string, value: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  },
  getItem: (key: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  },
  removeItem: (key: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  },
};

export const storageService = {
  // User authentication storage
  saveUser: async (userData: any) => {
    try {
      if (Platform.OS === 'web') {
        webStorage.setItem(USER_KEY, JSON.stringify(userData));
      } else {
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  },

  getUser: async () => {
    try {
      let userData: string | null;
      if (Platform.OS === 'web') {
        userData = webStorage.getItem(USER_KEY);
      } else {
        userData = await SecureStore.getItemAsync(USER_KEY);
      }
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  },

  removeUser: async () => {
    try {
      if (Platform.OS === 'web') {
        webStorage.removeItem(USER_KEY);
      } else {
        await SecureStore.deleteItemAsync(USER_KEY);
      }
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  },

  // Favorites storage
  saveFavorites: async (favorites: any[]) => {
    try {
      if (Platform.OS === 'web') {
        webStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      } else {
        await SecureStore.setItemAsync(FAVORITES_KEY, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  },

  getFavorites: async () => {
    try {
      let favorites: string | null;
      if (Platform.OS === 'web') {
        favorites = webStorage.getItem(FAVORITES_KEY);
      } else {
        favorites = await SecureStore.getItemAsync(FAVORITES_KEY);
      }
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error retrieving favorites:', error);
      return [];
    }
  },

  clearFavorites: async () => {
    try {
      if (Platform.OS === 'web') {
        webStorage.removeItem(FAVORITES_KEY);
      } else {
        await SecureStore.deleteItemAsync(FAVORITES_KEY);
      }
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  },

  // Theme storage
  saveThemePreference: async (isDarkMode: boolean) => {
    try {
      if (Platform.OS === 'web') {
        webStorage.setItem(THEME_KEY, JSON.stringify({ isDarkMode }));
      } else {
        await SecureStore.setItemAsync(THEME_KEY, JSON.stringify({ isDarkMode }));
      }
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  },

  getThemePreference: async () => {
    try {
      let themeData: string | null;
      if (Platform.OS === 'web') {
        themeData = webStorage.getItem(THEME_KEY);
      } else {
        themeData = await SecureStore.getItemAsync(THEME_KEY);
      }
      return themeData ? JSON.parse(themeData).isDarkMode : false;
    } catch (error) {
      console.error('Error retrieving theme preference:', error);
      return false;
    }
  },
};