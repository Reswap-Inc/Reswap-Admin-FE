import { createSlice } from '@reduxjs/toolkit';
import { getAllNotifications, deleteNotification, getUnreadNotificationsCount, seeNotification } from '../../network/generalApi';

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.body || [];
      })
      .addCase(getAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || 'Failed to fetch notifications';
      })
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted notification from the list
        const deletedNotificationId = action.meta.arg;
        state.notifications = state.notifications.filter(
          notif => notif.notificationId !== deletedNotificationId
        );
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || 'Failed to delete notification';
      })
      .addCase(getUnreadNotificationsCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUnreadNotificationsCount.fulfilled, (state, action) => {
        state.loading = false;
        // Count unread notifications (where seen is false)
        const unreadNotifications = action.payload.body?.filter(notif => !notif.seen) || [];
        state.unreadCount = unreadNotifications.length;
      })
      .addCase(getUnreadNotificationsCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || 'Failed to fetch unread count';
      })
      .addCase(seeNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(seeNotification.fulfilled, (state, action) => {
        state.loading = false;
        // Update the notification to mark it as seen
        const updatedNotification = action.payload.body?.[0];
        if (updatedNotification) {
          const index = state.notifications.findIndex(
            notif => notif.notificationId === updatedNotification.notificationId
          );
          if (index !== -1) {
            state.notifications[index] = { ...state.notifications[index], ...updatedNotification };
          }
        }
        // Decrease unread count
        if (state.unreadCount > 0) {
          state.unreadCount -= 1;
        }
      })
      .addCase(seeNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || 'Failed to mark notification as seen';
      });
  },
});

export default notificationSlice.reducer; 