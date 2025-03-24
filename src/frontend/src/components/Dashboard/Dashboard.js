import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import {
  NetworkCheck as NetworkIcon,
  Speed as QosIcon,
  Storage as VnfIcon,
  Link as ChainIcon,
  Cloud as ResourceIcon,
  BarChart as AnalyticsIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { useTranslation } from 'react-i18next';

/**
 * Dashboard component displaying system overview and metrics
 * 
 * Displays:
 * - Key performance indicators
 * - Component status
 * - Recent system activities
 * - Quick action buttons
 * 
 * @component
 * @returns {JSX.Element} Rendered Dashboard component
 */
const Dashboard = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  
  /**
   * Status information for all system components
   * @type {Array<{name: string, status: 'healthy'|'warning'|'error', icon: JSX.Element}>}
   */
  const componentStatus = [
    { name: t('navigation.networkSlices'), status: 'healthy', icon: <NetworkIcon color="primary" /> },
    { name: t('navigation.qosMonitoring'), status: 'warning', icon: <QosIcon color="warning" /> },
    { name: t('navigation.vnfManagement'), status: 'healthy', icon: <VnfIcon color="primary" /> },
    { name: t('navigation.serviceChaining'), status: 'healthy', icon: <ChainIcon color="primary" /> },
    { name: t('navigation.resourceOrchestration'), status: 'error', icon: <ResourceIcon color="error" /> },
    { name: t('dashboard.analytics'), status: 'healthy', icon: <AnalyticsIcon color="primary" /> }
  ];
  
  /**
   * Recent system activity logs
   * @type {Array<{id: number, action: string, user: string, time: string, status: 'success'|'warning'|'error'}>}
   */
  const recentActivities = [
    { id: 1, action: t('dashboard.activities.sliceCreated'), user: t('dashboard.roles.admin'), time: t('dashboard.timeAgo.minutes', { count: 10 }), status: 'success' },
    { id: 2, action: t('dashboard.activities.vnfFailed'), user: t('dashboard.roles.system'), time: t('dashboard.timeAgo.hours', { count: 1 }), status: 'error' },
    { id: 3, action: t('dashboard.activities.resourceUpdated'), user: t('dashboard.roles.operator'), time: t('dashboard.timeAgo.hours', { count: 3 }), status: 'success' },
    { id: 4, action: t('dashboard.activities.qosWarning'), user: t('dashboard.roles.system'), time: t('dashboard.timeAgo.hours', { count: 5 }), status: 'warning' }
  ];
  
  /**
   * Key metrics and statistics for quick overview
   * @type {Array<{title: string, value: string|number, change: string, path: string}>}
   */
  const quickStats = [
    { title: t('dashboard.stats.activeSlices'), value: 12, change: '+2', path: '/network-slices' },
    { title: t('dashboard.stats.runningVnfs'), value: 45, change: '-3', path: '/vnf-management' },
    { title: t('dashboard.stats.serviceChains'), value: 8, change: '+1', path: '/service-chaining' },
    { title: t('dashboard.stats.resourceUsage'), value: '68%', change: '+5%', path: '/resource-orchestration' }
  ];
  
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {t('dashboard.welcome', { name: currentUser?.name || t('common.user') })}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('dashboard.overview')}
        </Typography>
      </Box>
      
      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {quickStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {stat.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography variant="h3" color="primary">
                    {stat.value}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color={stat.change.startsWith('+') ? 'success.main' : 'error.main'}
                    sx={{ ml: 1 }}
                  >
                    {stat.change}
                  </Typography>
                </Box>
                <Button 
                  component={Link} 
                  to={stat.path} 
                  size="small" 
                  sx={{ mt: 1 }}
                >
                  {t('common.viewDetails')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Grid container spacing={3}>
        {/* Component Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('dashboard.componentStatus')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                {componentStatus.map((component, index) => (
                  <ListItem 
                    key={index}
                    secondaryAction={
                      <Chip 
                        label={t(`dashboard.status.${component.status}`)} 
                        color={
                          component.status === 'healthy' ? 'success' : 
                          component.status === 'warning' ? 'warning' : 'error'
                        }
                        size="small"
                      />
                    }
                  >
                    <ListItemIcon>
                      {component.icon}
                    </ListItemIcon>
                    <ListItemText primary={component.name} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('dashboard.recentActivities')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                {recentActivities.map((activity) => (
                  <ListItem key={activity.id}>
                    <ListItemIcon>
                      {activity.status === 'success' && <SuccessIcon color="success" />}
                      {activity.status === 'warning' && <WarningIcon color="warning" />}
                      {activity.status === 'error' && <ErrorIcon color="error" />}
                    </ListItemIcon>
                    <ListItemText 
                      primary={activity.action} 
                      secondary={`${activity.user} • ${activity.time}`} 
                    />
                  </ListItem>
                ))}
              </List>
              
              <Button 
                variant="outlined" 
                fullWidth 
                component={Link}
                to="/detailed-analytics"
                sx={{ mt: 2 }}
              >
                {t('dashboard.viewAllActivities')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.quickActions')}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Button 
                  variant="contained" 
                  startIcon={<NetworkIcon />}
                  component={Link}
                  to="/network-slices"
                  fullWidth
                >
                  {t('dashboard.actions.createSlice')}
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button 
                  variant="contained" 
                  startIcon={<VnfIcon />}
                  component={Link}
                  to="/vnf-management"
                  fullWidth
                >
                  {t('dashboard.actions.deployVNF')}
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button 
                  variant="contained" 
                  startIcon={<ChainIcon />}
                  component={Link}
                  to="/service-chaining"
                  fullWidth
                >
                  {t('dashboard.actions.createChain')}
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button 
                  variant="contained" 
                  startIcon={<AnalyticsIcon />}
                  component={Link}
                  to="/detailed-analytics"
                  fullWidth
                >
                  {t('dashboard.actions.viewAnalytics')}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 