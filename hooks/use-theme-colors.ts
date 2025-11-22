import { RootState } from '@/store';
import { useSelector } from 'react-redux';

export const useThemeColors = () => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  const colors = {
    // Background colors
    background: isDarkMode ? '#000000' : '#ffffff',
    surface: isDarkMode ? '#1a1a1a' : '#ffffff',
    card: isDarkMode ? '#2a2a2a' : '#ffffff',
    header: isDarkMode ? '#1a1a1a' : '#f8f9fa',
    
    // Text colors
    text: isDarkMode ? '#ffffff' : '#333333',
    textSecondary: isDarkMode ? '#cccccc' : '#666666',
    textMuted: isDarkMode ? '#999999' : '#999999',
    
    // Primary colors
    primary: '#007AFF',
    primaryText: '#ffffff',
    
    // Status colors
    success: '#34C759',
    error: '#ff4444',
    warning: '#f9ca24',
    info: '#17a2b8',
    
    // Border and separator colors
    border: isDarkMode ? '#404040' : '#f0f0f0',
    separator: isDarkMode ? '#333333' : '#e0e0e0',
    
    // Input colors
    inputBackground: isDarkMode ? '#2a2a2a' : '#f5f5f5',
    inputBorder: isDarkMode ? '#404040' : '#ddd',
    inputText: isDarkMode ? '#ffffff' : '#333333',
    inputPlaceholder: isDarkMode ? '#888888' : '#666666',
    
    // Tab colors
    tabBarBackground: isDarkMode ? '#1a1a1a' : '#ffffff',
    tabBarActive: '#007AFF',
    tabBarInactive: isDarkMode ? '#888888' : '#666666',
    
    // Button colors
    buttonBackground: '#007AFF',
    buttonText: '#ffffff',
    buttonSecondary: isDarkMode ? '#2a2a2a' : '#f0f0f0',
    buttonSecondaryText: isDarkMode ? '#ffffff' : '#333333',
    
    // Shadow colors
    shadow: isDarkMode ? '#000000' : '#000000',
  };

  return { colors, isDarkMode };
};