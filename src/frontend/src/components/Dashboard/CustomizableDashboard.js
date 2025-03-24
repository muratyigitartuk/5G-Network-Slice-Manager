import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Button
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  NetworkCheck as NetworkIcon,
  Notifications as NotificationsIcon,
  BarChart as BarChartIcon,
  Fullscreen as FullscreenIcon
} from '@mui/icons-material';
import { useAuth } from '../Auth/AuthContext';
import { useThemeMode } from '../Theme/ThemeProvider';

// Sample data for widgets
const generateSampleData = () => ({
  performance: {
    cpu: Math.floor(Math.random() * 100),
    memory: Math.floor(Math.random() * 100),
    network: Math.floor(Math.random() * 100),
    storage: Math.floor(Math.random() * 100),
  },
  resources: {
    totalCPU: '32 cores',
    usedCPU: `${Math.floor(Math.random() * 28)} cores`,
    totalMemory: '128 GB',
    usedMemory: `${Math.floor(Math.random() * 100)} GB`,
    totalStorage: '2 TB',
    usedStorage: `${Math.floor(Math.random() * 1800)} GB`,
  },
  alerts: [
    { id: 1, severity: 'error', message: 'High CPU usage on Compute Node 3', time: '10 min ago' },
    { id: 2, severity: 'warning', message: 'Network latency increased on Slice A', time: '25 min ago' },
    { id: 3, severity: 'info', message: 'Storage capacity at 75% on Storage Pool B', time: '1 hour ago' },
    { id: 4, severity: 'success', message: 'VNF deployment completed successfully', time: '2 hours ago' },
  ],
  network: {
    activeSlices: Math.floor(Math.random() * 10) + 5,
    totalBandwidth: '10 Gbps',
    usedBandwidth: `${Math.floor(Math.random() * 8)} Gbps`,
    activeConnections: Math.floor(Math.random() * 1000) + 500,
  },
  storage: {
    volumes: Math.floor(Math.random() * 20) + 10,
    iops: Math.floor(Math.random() * 5000) + 1000,
    throughput: `${Math.floor(Math.random() * 800) + 200} MB/s`,
    latency: `${Math.floor(Math.random() * 10) + 1} ms`,
  },
  compute: {
    activeVMs: Math.floor(Math.random() * 50) + 20,
    containers: Math.floor(Math.random() * 100) + 50,
    scheduledTasks: Math.floor(Math.random() * 30) + 10,
    availableNodes: Math.floor(Math.random() * 10) + 5,
  }
});

// Widget components
const PerformanceWidget = ({ data }) => {
  return (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardHeader 
        title="Performance Metrics" 
        action={
          <IconButton aria-label="refresh">
            <RefreshIcon />
          </IconButton>
        }
      />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="body2" color="text.secondary">CPU</Typography>
              <Box position="relative" display="inline-flex" sx={{ my: 1 }}>
                <CircularProgress variant="determinate" value={data.cpu} size={80} />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="body1" component="div" color="text.secondary">
                    {`${data.cpu}%`}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="body2" color="text.secondary">Memory</Typography>
              <Box position="relative" display="inline-flex" sx={{ my: 1 }}>
                <CircularProgress variant="determinate" value={data.memory} size={80} color="secondary" />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="body1" component="div" color="text.secondary">
                    {`${data.memory}%`}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="body2" color="text.secondary">Network</Typography>
              <Box position="relative" display="inline-flex" sx={{ my: 1 }}>
                <CircularProgress variant="determinate" value={data.network} size={80} color="info" />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="body1" component="div" color="text.secondary">
                    {`${data.network}%`}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="body2" color="text.secondary">Storage</Typography>
              <Box position="relative" display="inline-flex" sx={{ my: 1 }}>
                <CircularProgress variant="determinate" value={data.storage} size={80} color="warning" />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="body1" component="div" color="text.secondary">
                    {`${data.storage}%`}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const ResourcesWidget = ({ data }) => {
  return (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardHeader 
        title="Resource Utilization" 
        action={
          <IconButton aria-label="refresh">
            <RefreshIcon />
          </IconButton>
        }
      />
      <Divider />
      <CardContent>
        <List>
          <ListItem>
            <ListItemIcon>
              <MemoryIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="CPU Usage" 
              secondary={`${data.usedCPU} of ${data.totalCPU}`} 
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <StorageIcon color="secondary" />
            </ListItemIcon>
            <ListItemText 
              primary="Memory Usage" 
              secondary={`${data.usedMemory} of ${data.totalMemory}`} 
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <StorageIcon color="warning" />
            </ListItemIcon>
            <ListItemText 
              primary="Storage Usage" 
              secondary={`${data.usedStorage} of ${data.totalStorage}`} 
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

const AlertsWidget = ({ data }) => {
  return (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardHeader 
        title="Active Alerts" 
        action={
          <IconButton aria-label="refresh">
            <RefreshIcon />
          </IconButton>
        }
      />
      <Divider />
      <CardContent>
        <List>
          {data.map((alert) => (
            <ListItem key={alert.id}>
              <ListItemIcon>
                {alert.severity === 'error' && <ErrorIcon color="error" />}
                {alert.severity === 'warning' && <WarningIcon color="warning" />}
                {alert.severity === 'info' && <NotificationsIcon color="info" />}
                {alert.severity === 'success' && <CheckCircleIcon color="success" />}
              </ListItemIcon>
              <ListItemText 
                primary={alert.message} 
                secondary={alert.time} 
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

const NetworkWidget = ({ data }) => {
  return (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardHeader 
        title="Network Status" 
        action={
          <IconButton aria-label="refresh">
            <RefreshIcon />
          </IconButton>
        }
      />
      <Divider />
      <CardContent>
        <List>
          <ListItem>
            <ListItemIcon>
              <NetworkIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Active Network Slices" 
              secondary={data.activeSlices} 
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <SpeedIcon color="secondary" />
            </ListItemIcon>
            <ListItemText 
              primary="Bandwidth Usage" 
              secondary={`${data.usedBandwidth} of ${data.totalBandwidth}`} 
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <NetworkIcon color="info" />
            </ListItemIcon>
            <ListItemText 
              primary="Active Connections" 
              secondary={data.activeConnections} 
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

const StorageWidget = ({ data }) => {
  return (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardHeader 
        title="Storage Metrics" 
        action={
          <IconButton aria-label="refresh">
            <RefreshIcon />
          </IconButton>
        }
      />
      <Divider />
      <CardContent>
        <List>
          <ListItem>
            <ListItemIcon>
              <StorageIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Active Volumes" 
              secondary={data.volumes} 
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <SpeedIcon color="secondary" />
            </ListItemIcon>
            <ListItemText 
              primary="IOPS" 
              secondary={data.iops} 
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <SpeedIcon color="info" />
            </ListItemIcon>
            <ListItemText 
              primary="Throughput" 
              secondary={data.throughput} 
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <SpeedIcon color="warning" />
            </ListItemIcon>
            <ListItemText 
              primary="Latency" 
              secondary={data.latency} 
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

const ComputeWidget = ({ data }) => {
  return (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardHeader 
        title="Compute Resources" 
        action={
          <IconButton aria-label="refresh">
            <RefreshIcon />
          </IconButton>
        }
      />
      <Divider />
      <CardContent>
        <List>
          <ListItem>
            <ListItemIcon>
              <MemoryIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Active VMs" 
              secondary={data.activeVMs} 
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <MemoryIcon color="secondary" />
            </ListItemIcon>
            <ListItemText 
              primary="Containers" 
              secondary={data.containers} 
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <BarChartIcon color="info" />
            </ListItemIcon>
            <ListItemText 
              primary="Scheduled Tasks" 
              secondary={data.scheduledTasks} 
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <MemoryIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Available Nodes" 
              secondary={data.availableNodes} 
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
const CustomizableDashboard = () => {
  const { currentUser } = useAuth();
  const { mode } = useThemeMode();
  const [dashboardData, setDashboardData] = useState(generateSampleData());
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(null);

  // Get user preferences
  const userPreferences = currentUser?.preferences || {
    dashboardLayout: 'grid',
    visibleWidgets: ['performance', 'resources', 'alerts', 'network'],
    refreshRate: 30
  };

  // Refresh dashboard data
  const refreshData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setDashboardData(generateSampleData());
      setLoading(false);
    }, 500);
  };

  // Set up auto-refresh based on user preferences
  useEffect(() => {
    refreshData();
    
    if (userPreferences.enableNotifications && userPreferences.refreshRate) {
      const interval = setInterval(() => {
        refreshData();
      }, userPreferences.refreshRate * 1000);
      
      setRefreshInterval(interval);
      
      return () => clearInterval(interval);
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [userPreferences.enableNotifications, userPreferences.refreshRate]);

  // Get grid layout based on user preferences
  const getGridSize = (widget) => {
    const layout = userPreferences.dashboardLayout;
    
    if (layout === 'compact') {
      return { xs: 12, md: 6, lg: 4 };
    } else if (layout === 'list') {
      return { xs: 12 };
    } else { // grid layout
      if (widget === 'performance') {
        return { xs: 12, md: 12, lg: 12 };
      } else {
        return { xs: 12, md: 6, lg: 6 };
      }
    }
  };

  // Render widget based on type
  const renderWidget = (widgetType) => {
    switch (widgetType) {
      case 'performance':
        return <PerformanceWidget data={dashboardData.performance} />;
      case 'resources':
        return <ResourcesWidget data={dashboardData.resources} />;
      case 'alerts':
        return <AlertsWidget data={dashboardData.alerts} />;
      case 'network':
        return <NetworkWidget data={dashboardData.network} />;
      case 'storage':
        return <StorageWidget data={dashboardData.storage} />;
      case 'compute':
        return <ComputeWidget data={dashboardData.compute} />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Dashboard
          {loading && (
            <CircularProgress size={20} sx={{ ml: 2 }} />
          )}
        </Typography>
        <Box>
          <Tooltip title="Refresh Dashboard">
            <IconButton onClick={refreshData} sx={{ mr: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Dashboard Settings">
            <Button 
              variant="outlined" 
              startIcon={<SettingsIcon />}
              onClick={() => window.location.href = '/settings'}
              size="small"
            >
              Customize
            </Button>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {userPreferences.visibleWidgets.map((widget) => (
          <Grid item key={widget} {...getGridSize(widget)}>
            {renderWidget(widget)}
          </Grid>
        ))}
        
        {userPreferences.visibleWidgets.length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No widgets selected
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Customize your dashboard by adding widgets in the settings
              </Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 2 }}
                onClick={() => window.location.href = '/settings'}
              >
                Go to Settings
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CustomizableDashboard; 