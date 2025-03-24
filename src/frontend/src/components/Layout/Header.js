import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  Badge,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { useThemeMode } from '../Theme/ThemeProvider';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const history = useHistory();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationMenu = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    handleClose();
    history.push('/login');
  };
  
  const handleProfile = () => {
    history.push('/profile');
    handleClose();
  };
  
  const handleSettings = () => {
    history.push('/settings');
    handleClose();
  };
  
  // Mock notifications
  const notifications = [
    { id: 1, message: t('notifications.alerts.highCpuUsage', { node: 'Compute Node 3' }), read: false },
    { id: 2, message: t('notifications.alerts.networkLatency', { slice: 'Slice A' }), read: false },
    { id: 3, message: t('notifications.alerts.vnfDeployment'), read: true }
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMenuItemClick = (path) => {
    history.push(path);
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {t('auth.platformName')}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={mode === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark')}>
            <FormControlLabel
              control={
                <Switch
                  checked={mode === 'dark'}
                  onChange={toggleMode}
                  icon={<LightModeIcon />}
                  checkedIcon={<DarkModeIcon />}
                  aria-label={t('theme.themeToggle')}
                />
              }
              label=""
            />
          </Tooltip>
          
          <Tooltip title={t('notifications.title')}>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleNotificationMenu}
              aria-label={t('notifications.title')}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Menu
            id="notification-menu"
            anchorEl={notificationAnchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationClose}
          >
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <MenuItem 
                  key={notification.id} 
                  onClick={handleNotificationClose}
                  sx={{ 
                    fontWeight: notification.read ? 'normal' : 'bold',
                    minWidth: 250
                  }}
                >
                  {notification.message}
                </MenuItem>
              ))
            ) : (
              <MenuItem onClick={handleNotificationClose}>
                {t('notifications.noNotifications')}
              </MenuItem>
            )}
            <MenuItem 
              onClick={() => {
                handleNotificationClose();
                history.push('/notifications');
              }}
              sx={{ borderTop: '1px solid rgba(0, 0, 0, 0.12)', justifyContent: 'center' }}
            >
              {t('notifications.viewAll')}
            </MenuItem>
          </Menu>
          
          <Tooltip title={t('auth.accountSettings')}>
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
              aria-label={t('auth.accountMenu')}
            >
              {currentUser?.profileImage ? (
                <Avatar 
                  alt={currentUser.name} 
                  src={currentUser.profileImage}
                  sx={{ width: 32, height: 32 }}
                />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </Tooltip>
          
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {currentUser && (
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1">{currentUser.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentUser.email}
                </Typography>
              </Box>
            )}
            <MenuItem onClick={handleProfile}>
              <AccountCircle sx={{ mr: 1 }} /> {t('auth.profile')}
            </MenuItem>
            <MenuItem onClick={handleSettings}>
              <SettingsIcon sx={{ mr: 1 }} /> {t('common.settings')}
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} /> {t('auth.logout')}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 