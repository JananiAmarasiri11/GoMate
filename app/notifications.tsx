import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Switch,
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ArrowLeft, 
  Bell, 
  BellOff, 
  Settings, 
  Check, 
  Calendar, 
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Trash2
} from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { RootState, AppDispatch } from '@/store';
import { 
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  updatePreferences,
  scheduleNotification
} from '@/store/slices/notificationsSlice';

export default function NotificationsScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { colors } = useThemeColors();
  
  const { 
    notifications, 
    preferences
  } = useSelector((state: RootState) => state.notifications);
  
  const [activeTab, setActiveTab] = useState<'notifications' | 'settings'>('notifications');
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [localPreferences, setLocalPreferences] = useState(preferences);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleDeleteNotification = (id: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteNotification(id)),
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => dispatch(clearAllNotifications()),
        },
      ]
    );
  };

  const handleSavePreferences = () => {
    dispatch(updatePreferences(localPreferences));
    setShowPreferencesModal(false);
  };

  const handleTogglePreference = (key: keyof typeof preferences, value: boolean) => {
    setLocalPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleScheduleTestNotification = () => {
    const testNotification = {
      id: Date.now().toString(),
      title: 'Test Notification',
      message: 'This is a test notification to verify your settings.',
      type: 'info' as const,
      scheduledFor: new Date(Date.now() + 5000).toISOString(), // 5 seconds from now
    };
    
    dispatch(scheduleNotification(testNotification));
    Alert.alert('Test Scheduled', 'A test notification will appear in 5 seconds.');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle stroke={colors.success} width={20} height={20} />;
      case 'error':
        return <XCircle stroke={colors.error} width={20} height={20} />;
      case 'warning':
        return <AlertTriangle stroke={colors.warning} width={20} height={20} />;
      case 'booking':
        return <Calendar stroke={colors.primary} width={20} height={20} />;
      case 'travel':
        return <Calendar stroke={colors.primary} width={20} height={20} />;
      default:
        return <Info stroke={colors.primary} width={20} height={20} />;
    }
  };

  const getNotificationTime = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const renderNotificationItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        { 
          backgroundColor: item.isRead ? colors.surface : colors.card,
          borderLeftColor: item.isRead ? colors.border : colors.primary,
        }
      ]}
      onPress={() => handleMarkAsRead(item.id)}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <View style={styles.notificationIcon}>
            {getNotificationIcon(item.type)}
          </View>
          <View style={styles.notificationMeta}>
            <Text style={[styles.notificationTime, { color: colors.textMuted }]}>
              {getNotificationTime(item.timestamp)}
            </Text>
            {!item.isRead && (
              <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
            )}
          </View>
        </View>
        
        <Text style={[styles.notificationTitle, { color: colors.text }]}>
          {item.title}
        </Text>
        <Text style={[styles.notificationMessage, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.message}
        </Text>
        
        {item.actionUrl && (
          <TouchableOpacity 
            style={[styles.actionButton, { borderColor: colors.primary }]}
            onPress={() => {
              // Navigate to action URL
              console.log('Navigate to:', item.actionUrl);
            }}
          >
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>
              View Details
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteNotification(item.id)}
      >
        <Trash2 stroke={colors.textMuted} width={16} height={16} />
      </TouchableOpacity>
    </TouchableOpacity>
  );



  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft stroke={colors.text} width={24} height={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Notifications {unreadCount > 0 && `(${unreadCount})`}
        </Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setShowPreferencesModal(true)}
        >
          <Settings stroke={colors.text} width={24} height={24} />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'notifications' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setActiveTab('notifications')}
        >
          <Bell stroke={activeTab === 'notifications' ? '#ffffff' : colors.textSecondary} width={20} height={20} />
          <Text style={[
            styles.tabText,
            { color: activeTab === 'notifications' ? '#ffffff' : colors.textSecondary }
          ]}>
            Notifications
          </Text>
          {unreadCount > 0 && activeTab === 'notifications' && (
            <View style={[styles.badge, { backgroundColor: colors.error }]}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'settings' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setActiveTab('settings')}
        >
          <Settings stroke={activeTab === 'settings' ? '#ffffff' : colors.textSecondary} width={20} height={20} />
          <Text style={[
            styles.tabText,
            { color: activeTab === 'settings' ? '#ffffff' : colors.textSecondary }
          ]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'notifications' ? (
        <View style={styles.content}>
          {/* Actions Bar */}
          {notifications.length > 0 && (
            <View style={[styles.actionsBar, { backgroundColor: colors.surface }]}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                <Check stroke={unreadCount > 0 ? colors.primary : colors.textMuted} width={16} height={16} />
                <Text style={[
                  styles.actionText,
                  { color: unreadCount > 0 ? colors.primary : colors.textMuted }
                ]}>
                  Mark All Read
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleClearAll}
              >
                <Trash2 stroke={colors.error} width={16} height={16} />
                <Text style={[styles.actionText, { color: colors.error }]}>
                  Clear All
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Notifications List */}
          {notifications.length > 0 ? (
            <FlatList
              data={notifications.slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())}
              renderItem={renderNotificationItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.notificationsList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
              <BellOff stroke={colors.textMuted} width={64} height={64} />
              <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
                No notifications yet
              </Text>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                You&apos;ll see important updates and alerts here
              </Text>
            </View>
          )}
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {/* Notification Preferences */}
          <View style={[styles.settingsSection, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Notification Types</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Push Notifications</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Receive notifications on your device
                </Text>
              </View>
              <Switch
                value={localPreferences.pushEnabled}
                onValueChange={(value) => handleTogglePreference('pushEnabled', value)}
                trackColor={{ false: colors.inputBackground, true: colors.primary }}
                thumbColor={localPreferences.pushEnabled ? '#ffffff' : colors.inputPlaceholder}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Email Notifications</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Receive notifications via email
                </Text>
              </View>
              <Switch
                value={localPreferences.emailEnabled}
                onValueChange={(value) => handleTogglePreference('emailEnabled', value)}
                trackColor={{ false: colors.inputBackground, true: colors.primary }}
                thumbColor={localPreferences.emailEnabled ? '#ffffff' : colors.inputPlaceholder}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Booking Updates</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Updates about your bookings
                </Text>
              </View>
              <Switch
                value={localPreferences.tripReminders}
                onValueChange={(value) => handleTogglePreference('tripReminders', value)}
                trackColor={{ false: colors.inputBackground, true: colors.primary }}
                thumbColor={localPreferences.tripReminders ? '#ffffff' : colors.inputPlaceholder}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Travel Alerts</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Important travel information
                </Text>
              </View>
              <Switch
                value={localPreferences.weatherAlerts}
                onValueChange={(value) => handleTogglePreference('weatherAlerts', value)}
                trackColor={{ false: colors.inputBackground, true: colors.primary }}
                thumbColor={localPreferences.weatherAlerts ? '#ffffff' : colors.inputPlaceholder}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Promotional</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Deals and special offers
                </Text>
              </View>
              <Switch
                value={localPreferences.dealAlerts}
                onValueChange={(value) => handleTogglePreference('dealAlerts', value)}
                trackColor={{ false: colors.inputBackground, true: colors.primary }}
                thumbColor={localPreferences.dealAlerts ? '#ffffff' : colors.inputPlaceholder}
              />
            </View>
          </View>



          {/* Test Notifications */}
          <View style={[styles.settingsSection, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Test & Debug</Text>
            
            <TouchableOpacity
              style={[styles.testButton, { backgroundColor: colors.primary }]}
              onPress={handleScheduleTestNotification}
            >
              <Bell stroke="#ffffff" width={20} height={20} />
              <Text style={styles.testButtonText}>Send Test Notification</Text>
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <View style={styles.saveButtonContainer}>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSavePreferences}
            >
              <Text style={styles.saveButtonText}>Save Preferences</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Preferences Modal */}
      <Modal
        visible={showPreferencesModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.surface }]}>
            <TouchableOpacity onPress={() => setShowPreferencesModal(false)}>
              <Text style={[styles.modalCancel, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Notification Settings</Text>
            <TouchableOpacity onPress={handleSavePreferences}>
              <Text style={[styles.modalSave, { color: colors.primary }]}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
            Customize your notification preferences to stay informed about what matters most to you.
          </Text>
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
  settingsButton: {
    padding: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 25,
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 4,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  notificationsList: {
    padding: 20,
  },
  notificationItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    flexDirection: 'row',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationIcon: {
    marginRight: 8,
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationTime: {
    fontSize: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },

  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  settingsSection: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  scheduledItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  scheduledContent: {
    flex: 1,
  },
  scheduledTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  scheduledMessage: {
    fontSize: 12,
    marginBottom: 4,
  },
  scheduledTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scheduledTimeText: {
    fontSize: 10,
  },
  cancelButton: {
    padding: 8,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  testButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButtonContainer: {
    padding: 20,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
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
  modalDescription: {
    padding: 20,
    fontSize: 14,
    lineHeight: 20,
  },
});