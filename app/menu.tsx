import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  MapPin, 
  Search, 
  Sun, 
  Bell, 
  Settings,
  User,
  Heart,
  Calendar,
  Bookmark,
  DollarSign,
  Navigation,
  Star,
  Award,
  Globe
} from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  color: string;
  category: 'planning' | 'discovery' | 'utilities' | 'account';
}

export default function MenuScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useThemeColors();
  const { user } = useSelector((state: RootState) => state.auth);

  const menuItems: MenuItem[] = [
    // Planning
    {
      id: 'trip-planning',
      title: 'Trip Planning',
      description: 'Create and manage your travel itineraries',
      icon: <MapPin stroke="#ffffff" width={24} height={24} />,
      route: '/trip-planning',
      color: colors.primary,
      category: 'planning',
    },
    {
      id: 'booking',
      title: 'Book Transport',
      description: 'Book flights, buses, and other transport',
      icon: <Navigation stroke="#ffffff" width={24} height={24} />,
      route: '/booking',
      color: colors.info,
      category: 'planning',
    },
    {
      id: 'favorites',
      title: 'My Favorites',
      description: 'Your saved destinations and trips',
      icon: <Heart stroke="#ffffff" width={24} height={24} />,
      route: '/favorites',
      color: colors.error,
      category: 'planning',
    },

    // Discovery
    {
      id: 'advanced-search',
      title: 'Advanced Search',
      description: 'Find destinations with powerful filters',
      icon: <Search stroke="#ffffff" width={24} height={24} />,
      route: '/advanced-search',
      color: colors.success,
      category: 'discovery',
    },
    {
      id: 'explore',
      title: 'Explore',
      description: 'Discover trending destinations',
      icon: <Globe stroke="#ffffff" width={24} height={24} />,
      route: '/(tabs)/explore',
      color: colors.warning,
      category: 'discovery',
    },

    // Utilities
    {
      id: 'utilities',
      title: 'Weather & Currency',
      description: 'Check weather and convert currencies',
      icon: <Sun stroke="#ffffff" width={24} height={24} />,
      route: '/utilities',
      color: '#FF6B35',
      category: 'utilities',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage your alerts and preferences',
      icon: <Bell stroke="#ffffff" width={24} height={24} />,
      route: '/notifications',
      color: '#9B59B6',
      category: 'utilities',
    },

    // Account
    {
      id: 'profile',
      title: 'Profile Settings',
      description: 'Manage your account and preferences',
      icon: <User stroke="#ffffff" width={24} height={24} />,
      route: '/profile',
      color: colors.textSecondary,
      category: 'account',
    },
    {
      id: 'settings',
      title: 'App Settings',
      description: 'Theme, language, and app preferences',
      icon: <Settings stroke="#ffffff" width={24} height={24} />,
      route: '/settings',
      color: '#34495E',
      category: 'account',
    },
    {
      id: 'features',
      title: 'App Features',
      description: 'View all implemented features and capabilities',
      icon: <Award stroke="#ffffff" width={24} height={24} />,
      route: '/features',
      color: '#E74C3C',
      category: 'account',
    },
  ];

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'planning':
        return 'Trip Planning';
      case 'discovery':
        return 'Discovery';
      case 'utilities':
        return 'Travel Tools';
      case 'account':
        return 'Account';
      default:
        return category;
    }
  };

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItem, { backgroundColor: colors.surface }]}
      onPress={() => router.push(item.route as any)}
    >
      <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
        {item.icon}
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.menuDescription, { color: colors.textSecondary }]}>
          {item.description}
        </Text>
      </View>
      <View style={styles.menuArrow}>
        <Text style={[styles.arrowText, { color: colors.textMuted }]}>›</Text>
      </View>
    </TouchableOpacity>
  );

  const renderMenuSection = (category: string, items: MenuItem[]) => (
    <View key={category} style={styles.menuSection}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {getCategoryTitle(category)}
      </Text>
      {items.map(renderMenuItem)}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft stroke={colors.text} width={24} height={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Menu</Text>
        <View style={{ width: 34 }} />
      </View>

      {/* User Info */}
      <View style={[styles.userSection, { backgroundColor: colors.surface }]}>
        <View style={[styles.userAvatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.userInitial}>
            {user?.firstName?.charAt(0) || 'T'}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Traveler'}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {user?.email || 'guest@gomate.app'}
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.profileButton, { backgroundColor: colors.card }]}
          onPress={() => router.push('/profile')}
        >
          <Settings stroke={colors.textSecondary} width={20} height={20} />
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {Object.entries(groupedMenuItems).map(([category, items]) =>
          renderMenuSection(category, items)
        )}

        {/* App Info */}
        <View style={[styles.appInfo, { backgroundColor: colors.surface }]}>
          <Text style={[styles.appName, { color: colors.text }]}>GoMate Travel App</Text>
          <Text style={[styles.appVersion, { color: colors.textSecondary }]}>Version 2.0.0</Text>
          <Text style={[styles.appDescription, { color: colors.textMuted }]}>
            Advanced travel planning with AI-powered recommendations
          </Text>
        </View>
      </ScrollView>
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
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInitial: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  profileButton: {
    padding: 12,
    borderRadius: 8,
  },
  content: {
    flex: 1,
  },
  menuSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      default: {
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  menuArrow: {
    marginLeft: 12,
  },
  arrowText: {
    fontSize: 24,
    fontWeight: '300',
  },
  appInfo: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});