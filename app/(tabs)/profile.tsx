import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    Bell,
    ChevronRight,
    Heart,
    HelpCircle,
    LogOut,
    Moon,
    Settings,
    Shield
} from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { useThemeColors } from '@/hooks/use-theme-colors';
import { storageService } from '@/services/storage';
import { AppDispatch, RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { clearFavorites } from '@/store/slices/favoritesSlice';
import { toggleTheme } from '@/store/slices/themeSlice';

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { favorites } = useSelector((state: RootState) => state.favorites);
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  const { colors } = useThemeColors();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Logging out user...');
              
              // Clear storage first
              await storageService.removeUser();
              await storageService.clearFavorites();
              console.log('Storage cleared');
              
              // Clear Redux state - this will trigger automatic redirect via root layout
              dispatch(logout());
              dispatch(clearFavorites());
              console.log('Redux state cleared');
              
              // Let the app's navigation logic handle the redirect automatically
              console.log('Logout completed successfully');
            } catch (error) {
              console.error('Error during logout:', error);
              // Clear Redux state even if storage clearing failed
              dispatch(logout());
              dispatch(clearFavorites());
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 'favorites',
      title: 'My Favorites',
      subtitle: `${favorites.length} saved destinations`,
      icon: Heart,
      onPress: () => router.push('/(tabs)/favorites'),
      showChevron: true,
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'App preferences and account',
      icon: Settings,
      onPress: () => {},
      showChevron: true,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Push notifications',
      icon: Bell,
      onPress: () => {},
      showSwitch: true,
      switchValue: notifications,
      onSwitchChange: setNotifications,
    },
    {
      id: 'darkMode',
      title: 'Dark Mode',
      subtitle: 'Toggle dark theme',
      icon: Moon,
      onPress: () => {},
      showSwitch: true,
      switchValue: isDarkMode,
      onSwitchChange: async (value: boolean) => {
        dispatch(toggleTheme());
        await storageService.saveThemePreference(value);
      },
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      subtitle: 'Data protection settings',
      icon: Shield,
      onPress: () => {},
      showChevron: true,
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'Get help and contact us',
      icon: HelpCircle,
      onPress: () => {},
      showChevron: true,
    },
  ];

  const renderMenuItem = (item: typeof menuItems[0]) => {
    const IconComponent = item.icon;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.menuItem}
        onPress={item.onPress}
        disabled={item.showSwitch}
      >
        <View style={styles.menuItemLeft}>
          <View style={styles.menuItemIcon}>
            <IconComponent stroke="#666" width={22} height={22} />
          </View>
          <View style={styles.menuItemText}>
            <Text style={styles.menuItemTitle}>{item.title}</Text>
            <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
          </View>
        </View>
        
        <View style={styles.menuItemRight}>
          {item.showSwitch && (
            <Switch
              value={item.switchValue}
              onValueChange={item.onSwitchChange}
              trackColor={{ false: '#E5E5E5', true: '#007AFF' }}
              thumbColor="#fff"
            />
          )}
          {item.showChevron && (
            <ChevronRight stroke="#666" width={20} height={20} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: colors.header }]}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.firstName?.charAt(0) || 'T'}
                  {user?.lastName?.charAt(0) || 'U'}
                </Text>
              </View>
            </View>
            
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: colors.text }]}>
                {user ? `${user.firstName} ${user.lastName}` : 'Traveler User'}
              </Text>
              <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                {user?.email || 'traveler@example.com'}
              </Text>
              <Text style={[styles.userStats, { color: colors.textMuted }]}>
                Member since 2024 • {favorites.length} favorites
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          {menuItems.map(renderMenuItem)}
        </View>

        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut stroke="#ff4444" width={22} height={22} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>GoMate Travel App</Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#f8f9fa',
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      default: {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  userStats: {
    fontSize: 14,
    color: '#999',
  },
  menuSection: {
    paddingTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  menuItemRight: {
    marginLeft: 10,
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff4444',
    marginLeft: 10,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 14,
    color: '#999',
  },
});