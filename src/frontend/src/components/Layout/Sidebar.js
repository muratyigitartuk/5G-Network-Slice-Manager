import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  BarChart as AnalyticsIcon,
  Settings as SettingsIcon,
  NetworkCheck as NetworkIcon,
  Speed as QosIcon,
  Storage as VnfIcon,
  Link as ChainIcon,
  Cloud as ResourceIcon,
  Monitoring as MonitoringIcon,
  InsightsOutlined as DetailedAnalyticsIcon,
  Security as ComplianceIcon,
  ExpandLess,
  ExpandMore,
  Person as ProfileIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useAuth } from '../Auth/AuthContext';
import { useThemeMode } from '../Theme/ThemeProvider';

const drawerWidth = 240;

const Sidebar = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const { mode } = useThemeMode();
  const [open, setOpen] = useState(true);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAnalyticsClick = () => {
    setAnalyticsOpen(!analyticsOpen);
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/',
    },
    {
      text: 'Network Slices',
      icon: <NetworkIcon />,
      path: '/network-slices',
    },
    {
      text: 'QoS Monitoring',
      icon: <QosIcon />,
      path: '/qos-monitoring',
    },
    {
      text: 'VNF Management',
      icon: <VnfIcon />,
      path: '/vnf-management',
    },
    {
      text: 'Service Chaining',
      icon: <ChainIcon />,
      path: '/service-chaining',
    },
    {
      text: 'Resource Orchestration',
      icon: <ResourceIcon />,
      path: '/resource-orchestration',
    },
    {
      text: 'Analytics',
      icon: <AnalyticsIcon />,
      submenu: [
        {
          text: 'Monitoring Dashboard',
          icon: <MonitoringIcon />,
          path: '/monitoring-dashboard',
        },
        {
          text: 'Detailed Analytics',
          icon: <DetailedAnalyticsIcon />,
          path: '/detailed-analytics',
        }
      ]
    },
    {
      text: 'Compliance',
      icon: <ComplianceIcon />,
      path: '/compliance',
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
    },
    {
      text: 'Profile',
      icon: <ProfileIcon />,
      path: '/profile',
    }
  ];

  const drawer = (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Box
          component="img"
          sx={{
            height: 40,
            width: 'auto',
          }}
          alt="Logo"
          src="/logo.png"
        />
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          item.submenu ? (
            <React.Fragment key={item.text}>
              <ListItem disablePadding>
                <ListItemButton onClick={handleAnalyticsClick}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                  {analyticsOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={analyticsOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.submenu.map((subItem) => (
                    <ListItem key={subItem.text} disablePadding>
                      <ListItemButton
                        component={Link}
                        to={subItem.path}
                        selected={location.pathname === subItem.path}
                        sx={{ pl: 4 }}
                      >
                        <ListItemIcon>{subItem.icon}</ListItemIcon>
                        <ListItemText primary={subItem.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ) : (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          )
        ))}
      </List>
    </>
  );

  return (
    <>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Mobile menu button */}
      <Box sx={{ position: 'fixed', top: 10, left: 10, zIndex: 1100, display: { sm: 'none' } }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
    </>
  );
};

export default Sidebar; 