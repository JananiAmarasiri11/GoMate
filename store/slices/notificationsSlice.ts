import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'deal' | 'reminder';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  imageUrl?: string;
}

export interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  dealAlerts: boolean;
  tripReminders: boolean;
  weatherAlerts: boolean;
  priceDrops: boolean;
}

interface NotificationsState {
  notifications: Notification[];
  preferences: NotificationPreferences;
  unreadCount: number;
}

const initialState: NotificationsState = {
  notifications: [],
  preferences: {
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    dealAlerts: true,
    tripReminders: true,
    weatherAlerts: true,
    priceDrops: true,
  },
  unreadCount: 0,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const notification: Notification = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
        ...action.payload,
      };
      state.notifications.unshift(notification);
      state.unreadCount += 1;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        const notification = state.notifications[index];
        if (!notification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications.splice(index, 1);
      }
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    updatePreferences: (state, action: PayloadAction<Partial<NotificationPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    scheduleNotification: (state, action: PayloadAction<{ scheduledFor: string; title: string; message: string; type: Notification['type'] }>) => {
      // This would integrate with actual push notification service
      const scheduledNotification = {
        id: Date.now().toString(),
        ...action.payload,
        scheduled: true,
        scheduledFor: action.payload.scheduledFor,
      };
      // In real app, this would register with push notification service
      console.log('Notification scheduled:', scheduledNotification);
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n: Notification) => !n.read).length;
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  updatePreferences,
  scheduleNotification,
  setNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;