import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  IconButton,
  Box,
  Divider,
  Badge,
  Tooltip,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  DoneAll as DoneAllIcon,
  DeleteSweep as DeleteSweepIcon
} from '@mui/icons-material';
import { useNotifications } from './NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter = () => {
  const { t } = useTranslation();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    removeNotification, 
    markAllAsRead, 
    clearAll 
  } = useNotifications();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event, notification) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedNotification(null);
  };

  const handleMarkAsRead = (id) => {
    markAsRead(id);
    handleMenuClose();
  };

  const handleRemove = (id) => {
    removeNotification(id);
    handleMenuClose();
  };

  const handleMarkAllAsReadClick = () => {
    markAllAsRead();
  };

  const handleClearAllClick = () => {
    clearAll();
    handleClose();
  };

  const open = Boolean(anchorEl);
  const menuOpen = Boolean(menuAnchorEl);
  const id = open ? 'notification-popover' : undefined;

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'info':
      default:
        return <InfoIcon color="info" />;
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return t('notifications.unknownTime');
    }
  };

  return (
    <>
      <Tooltip title={t('notifications.title')}>
        <IconButton
          color="inherit"
          aria-describedby={id}
          onClick={handleClick}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 360, maxHeight: 500 }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{t('notifications.title')}</Typography>
          <Box>
            <Tooltip title={t('notifications.markAllAsRead')}>
              <IconButton size="small" onClick={handleMarkAllAsReadClick} disabled={unreadCount === 0}>
                <DoneAllIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('notifications.clearAll')}>
              <IconButton size="small" onClick={handleClearAllClick} disabled={notifications.length === 0}>
                <DeleteSweepIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Divider />
        
        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">{t('notifications.noNotifications')}</Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                    '&:hover': { bgcolor: 'action.selected' }
                  }}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      aria-label={t('notifications.more')}
                      onClick={(e) => handleMenuOpen(e, notification)}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  }
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.message}
                    secondary={formatTimestamp(notification.timestamp)}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: notification.read ? 'normal' : 'medium'
                    }}
                    secondaryTypographyProps={{
                      variant: 'caption'
                    }}
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Popover>

      <Menu
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {selectedNotification && !selectedNotification.read && (
          <MenuItem onClick={() => handleMarkAsRead(selectedNotification.id)}>
            <ListItemIcon>
              <DoneAllIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('notifications.markAsRead')}</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => selectedNotification && handleRemove(selectedNotification.id)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('notifications.remove')}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default NotificationCenter; 