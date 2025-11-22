import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider, useDispatch, useSelector } from 'react-redux';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { storageService } from '@/services/storage';
import { AppDispatch, RootState, store } from '@/store';
import { loginSuccess } from '@/store/slices/authSlice';
import { setFavorites } from '@/store/slices/favoritesSlice';
import { setTheme } from '@/store/slices/themeSlice';
import { KeepAwakeManager } from '@/utils/keepAwakeManager';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch<AppDispatch>();
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Debug logging
  useEffect(() => {
    console.log('Theme state changed:', { isDarkMode, colorScheme });
  }, [isDarkMode, colorScheme]);

  useEffect(() => {
    // Initialize keep-awake to prevent mobile errors
    KeepAwakeManager.initialize();

    // Check for stored user data on app launch
    const checkAuthState = async () => {
      try {
        const userData = await storageService.getUser();
        const favorites = await storageService.getFavorites();
        const isDarkMode = await storageService.getThemePreference();
        
        if (userData) {
          dispatch(loginSuccess(userData));
        }
        
        if (favorites) {
          dispatch(setFavorites(favorites));
        }
        
        dispatch(setTheme(isDarkMode));
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        // Mark initialization as complete
        setIsInitialized(true);
      }
    };

    checkAuthState();
  }, [dispatch]);

  const navigationTheme = isDarkMode ? {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#000000',
      card: '#1a1a1a',
      text: '#ffffff',
      border: '#404040',
      primary: '#007AFF',
    },
  } : {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#ffffff',
      card: '#ffffff',
      text: '#333333',
      border: '#f0f0f0',
      primary: '#007AFF',
    },
  };

  // Don't render navigation until initialization is complete
  if (!isInitialized) {
    return null;
  }

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar 
        style={isDarkMode ? 'light' : 'dark'} 
        backgroundColor={isDarkMode ? '#000000' : '#ffffff'}
        translucent={false}
      />
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: isDarkMode ? '#000000' : '#ffffff' }
      }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ 
          presentation: 'modal', 
          title: 'Modal',
          headerStyle: {
            backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
          },
          headerTintColor: isDarkMode ? '#ffffff' : '#333333',
        }} />
        <Stack.Screen 
          name="details/[id]" 
          options={{ 
            headerShown: true, 
            title: 'Details',
            headerStyle: {
              backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
            },
            headerTintColor: isDarkMode ? '#ffffff' : '#333333',
          }} 
        />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
