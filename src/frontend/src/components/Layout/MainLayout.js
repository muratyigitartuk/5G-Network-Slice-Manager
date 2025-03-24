import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  Typography, 
  List, 
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  CssBaseline,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  ListItemButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  NetworkCheck as NetworkIcon,
  Storage as StorageIcon,
  Settings as SettingsIcon,
  AccountCircle,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Cable as CableIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  BarChart as BarChartIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { useThemeMode } from '../Theme/ThemeProvider';
import NotificationCenter from '../Notifications/NotificationCenter';
import SkipLink from '../Utils/SkipLink';
import LanguageSwitcher from '../Utils/LanguageSwitcher';

const expandedDrawerWidth = 240;
const collapsedDrawerWidth = 65;

const MainLayout = ({ children }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const history = useHistory();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  
  // Check if the screen is mobile size
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Close drawer by default on mobile screens
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  const menuItems = [
    { text: t('navigation.dashboard'), icon: <DashboardIcon />, path: '/' },
    { text: t('navigation.networkSlices'), icon: <NetworkIcon />, path: '/slices', permission: 'network:view' },
    { text: t('navigation.vnfManagement'), icon: <StorageIcon />, path: '/vnf', permission: 'vnf:view' },
    { text: t('navigation.serviceChaining'), icon: <CableIcon />, path: '/service-chaining', permission: 'service:view' },
    { text: t('navigation.qosMonitoring'), icon: <SpeedIcon />, path: '/qos-monitoring', permission: 'monitoring:view' },
    { text: t('navigation.resourceOrchestration'), icon: <MemoryIcon />, path: '/resource-orchestration', permission: 'resource:view' },
    { text: t('navigation.monitoringDashboard'), icon: <BarChartIcon />, path: '/monitoring-dashboard', permission: 'dashboard:view' },
    { text: t('navigation.settings'), icon: <SettingsIcon />, path: '/settings', permission: 'settings:view' }
  ];

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen(!open);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    history.push('/login');
  };

  const handleProfileClick = () => {
    handleMenuClose();
    history.push('/settings');
  };

  // Filter menu items based on user permissions
  const filteredMenuItems = menuItems.filter(item => {
    if (!item.permission) return true;
    return currentUser && currentUser.permissions.includes(item.permission);
  });

  const drawer = (
    <Box>
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        px: [1, 1, 2],
      }}>
        <Typography 
          variant="h6" 
          noWrap 
          sx={{ 
            opacity: open ? 1 : 0,
            transition: theme.transitions.create('opacity', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          {t('navigation.appTitle')}
        </Typography>
        {!isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List aria-label={t('navigation.mainNavigation')}>
        {filteredMenuItems.map((item) => (
          <ListItem 
            disablePadding
            key={item.text}
            sx={{ display: 'block' }}
          >
            <ListItemButton
              onClick={() => {
                history.push(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              selected={location.pathname === item.path}
              aria-current={location.pathname === item.path ? 'page' : undefined}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  opacity: open ? 1 : 0,
                  transition: theme.transitions.create('opacity', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                  }),
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {currentUser && open && (
        <Box sx={{ p: 2, mt: 'auto' }}>
          <Typography variant="body2" color="text.secondary">
            {t('auth.loggedInAs')}:
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {currentUser.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('auth.role')}: {currentUser.role}
          </Typography>
        </Box>
      )}
    </Box>
  );

  const drawerWidth = open ? expandedDrawerWidth : collapsedDrawerWidth;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Skip Link for accessibility */}
      <SkipLink targetId="main-content" label={t('accessibility.skipToContent')} />
      
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${isMobile ? 0 : drawerWidth}px)` },
          ml: { sm: `${isMobile ? 0 : drawerWidth}px` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label={open ? t('navigation.closeDrawer') : t('navigation.openDrawer')}
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {filteredMenuItems.find(item => item.path === location.pathname)?.text || t('navigation.dashboard')}
          </Typography>
          
          {/* Language Switcher */}
          <LanguageSwitcher sx={{ mx: 1 }} />
          
          {/* Notifications */}
          <NotificationCenter />
          
          {/* Theme Toggle */}
          <Tooltip title={mode === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark')}>
            <IconButton
              edge="end"
              onClick={toggleMode}
              color="inherit"
              aria-label={t('theme.themeToggle')}
              sx={{ mx: 1 }}
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          
          {/* User Profile Menu */}
          <Tooltip title={t('auth.accountSettings')}>
            <IconButton
              edge="end"
              onClick={handleProfileMenuOpen}
              color="inherit"
              aria-label={t('auth.accountMenu')}
              aria-controls="user-menu"
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl) ? 'true' : 'false'}
            >
              {currentUser ? (
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: currentUser.role === 'admin' ? 'error.main' : 'primary.main'
                  }}
                  alt={currentUser.name}
                >
                  {currentUser.name.charAt(0)}
                </Avatar>
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </Tooltip>
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {currentUser && (
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1">{currentUser.name}</Typography>
                <Typography variant="body2" color="text.secondary">{currentUser.role}</Typography>
              </Box>
            )}
            <Divider />
            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t('auth.profile')}</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t('auth.logout')}</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ 
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
        aria-label={t('navigation.mainNavigation')}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: expandedDrawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
            },
          }}
          open={open}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        id="main-content"
        tabIndex={-1}
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { 
            xs: '100%',
            sm: `calc(100% - ${drawerWidth}px)` 
          },
          mt: '64px',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          outline: 'none', // Remove focus outline but keep it focusable for skip link
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default MainLayout; 