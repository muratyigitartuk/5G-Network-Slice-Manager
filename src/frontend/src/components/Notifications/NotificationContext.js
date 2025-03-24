import React, { createContext, useContext, useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useAuth } from '../Auth/AuthContext';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

// Create notification context
const NotificationContext = createContext({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
  markAsRead: () => {},
  clearAll: () => {},
  unreadCount: 0
});

// Provider component
export const NotificationProvider = ({ children }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [open, setOpen] = useState(false);

  // Load notifications when user changes or language changes
  useEffect(() => {
    if (currentUser) {
      // Sample notifications using translation keys
      const sampleNotifications = [
        { 
          id: 1, 
          type: 'error', 
          message: t('notifications.alerts.highCpuUsage', { node: 'Compute Node 3' }), 
          timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
          read: false
        },
        { 
          id: 2, 
          type: 'warning', 
          message: t('notifications.alerts.networkLatency', { slice: 'Slice A' }), 
          timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
          read: false
        },
        { 
          id: 3, 
          type: 'info', 
          message: t('notifications.alerts.storageCapacity', { pool: 'Storage Pool B', percentage: '75%' }), 
          timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
          read: true
        },
        { 
          id: 4, 
          type: 'success', 
          message: t('notifications.alerts.vnfDeployment'), 
          timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
          read: true
        }
      ];
      
      setNotifications(sampleNotifications);
    } else {
      setNotifications([]);
    }
  }, [currentUser, t]);  // Add t to dependencies to update when language changes

  // Calculate unread count
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Add a new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show snackbar for new notification
    setCurrentNotification(newNotification);
    setOpen(true);
  };

  // Remove a notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  // Handle snackbar close
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  // Simulate receiving new notifications periodically
  useEffect(() => {
    if (!currentUser || !currentUser.preferences?.enableNotifications) return;

    const types = ['info', 'warning', 'error', 'success'];
    const messages = [
      'notifications.alerts.networkSlice',
      'notifications.alerts.resourceAllocation',
      'notifications.alerts.vnfRestart',
      'notifications.alerts.bandwidthThreshold',
      'notifications.alerts.systemUpdate',
      'notifications.alerts.backupCompleted'
    ];

    const interval = setInterval(() => {
      // 20% chance of new notification
      if (Math.random() < 0.2) {
        const randomType = types[Math.floor(Math.random() * types.length)];
        const randomMessageKey = messages[Math.floor(Math.random() * messages.length)];
        
        addNotification({
          type: randomType,
          message: t(randomMessageKey)
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [currentUser, t]); // Add t to dependencies

  // Context value
  const contextValue = {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    unreadCount
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      
      {/* Snackbar for new notifications */}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {currentNotification && (
          <Alert 
            onClose={handleClose} 
            severity={currentNotification.type} 
            sx={{ width: '100%' }}
          >
            {currentNotification.message}
          </Alert>
        )}
      </Snackbar>
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => useContext(NotificationContext);

// Add PropTypes validation
NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default NotificationContext; 