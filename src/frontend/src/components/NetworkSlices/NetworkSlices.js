import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Timeline as MetricsIcon,
  Notifications as AlertIcon,
  Warning as WarningIcon,
  CheckCircle as HealthIcon,
  Settings as ThresholdIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNotifications } from '../Notifications/NotificationContext';
import BackupRecovery from './BackupRecovery';
import QoSMonitoring from './QoSMonitoring';
import TopologyView from './TopologyView';
import { useTranslation } from 'react-i18next';

const NetworkSlices = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotifications();
  const [slices, setSlices] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    service_type: 'eMBB',
    qos_requirements: {
      bandwidth: 100,
      latency: 20,
      reliability: 99.9
    },
    isolation_level: 'full'
  });
  const [selectedSlice, setSelectedSlice] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [metrics, setMetrics] = useState({
    cpu: [],
    memory: [],
    bandwidth: []
  });
  const [qosAlerts, setQosAlerts] = useState([]);
  const [thresholds, setThresholds] = useState({
    bandwidth: { warning: 80, critical: 90 },
    latency: { warning: 15, critical: 25 },
    reliability: { warning: 95, critical: 90 }
  });
  const [showThresholds, setShowThresholds] = useState(false);
  const [selectedSlices, setSelectedSlices] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    serviceType: '',
    status: '',
    minBandwidth: '',
    maxLatency: ''
  });
  const [quotas, setQuotas] = useState({
    maxSlices: 10,
    totalBandwidth: 1000,
    totalCPU: 100,
    totalMemory: 1024000
  });
  const [showDependencies, setShowDependencies] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const serviceTypes = ['eMBB', 'URLLC', 'mMTC', 'V2X', 'IoT'];
  const isolationLevels = ['full', 'partial', 'none'];

  const sliceTemplates = [
    {
      name: 'IoT Slice',
      serviceType: 'mMTC',
      qosRequirements: {
        bandwidth: 10,
        latency: 50,
        reliability: 99.9
      },
      isolationLevel: 'partial'
    },
    {
      name: 'Video Streaming',
      serviceType: 'eMBB',
      qosRequirements: {
        bandwidth: 100,
        latency: 20,
        reliability: 99.99
      },
      isolationLevel: 'full'
    },
    {
      name: 'Gaming Slice',
      serviceType: 'URLLC',
      qosRequirements: {
        bandwidth: 50,
        latency: 5,
        reliability: 99.999
      },
      isolationLevel: 'full'
    }
  ];

  useEffect(() => {
    fetchSlices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(checkQoSViolations, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSlices = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Simulate fetching data from API
      const mockSlices = [
        {
          id: 1,
          name: 'IoT Slice',
          service_type: 'mMTC',
          status: 'active',
          qos_requirements: {
            bandwidth: 10,
            latency: 50,
            reliability: 99.9
          }
        },
        {
          id: 2,
          name: 'Video Streaming',
          service_type: 'eMBB',
          status: 'active',
          qos_requirements: {
            bandwidth: 100,
            latency: 20,
            reliability: 99.99
          }
        },
        {
          id: 3,
          name: 'Gaming Slice',
          service_type: 'URLLC',
          status: 'stopped',
          qos_requirements: {
            bandwidth: 50,
            latency: 5,
            reliability: 99.999
          }
        }
      ];
      
      setSlices(mockSlices);
      setLoading(false);
      
      // Show success notification with translation
      addNotification({
        type: 'success',
        message: `${t('navigation.networkSlices')} ${t('notifications.loadedSuccessfully')}`
      });
      
      setSnackbar({
        open: true,
        message: `${t('navigation.networkSlices')} ${t('notifications.loadedSuccessfully')}`,
        severity: 'success'
      });
    }, 1000);
  };

  // Add a validation function for the form
  const validateForm = () => {
    if (!formData.name || formData.name.trim() === '') {
      showSnackbar('Slice name is required', 'error');
      return false;
    }
    
    if (!formData.service_type) {
      showSnackbar('Service type is required', 'error');
      return false;
    }
    
    if (!formData.isolation_level) {
      showSnackbar('Isolation level is required', 'error');
      return false;
    }
    
    const { bandwidth, latency, reliability } = formData.qos_requirements;
    
    if (bandwidth <= 0) {
      showSnackbar('Bandwidth must be greater than 0', 'error');
      return false;
    }
    
    if (latency <= 0) {
      showSnackbar('Latency must be greater than 0', 'error');
      return false;
    }
    
    if (reliability <= 0 || reliability > 100) {
      showSnackbar('Reliability must be between 0 and 100', 'error');
      return false;
    }
    
    return true;
  };

  const handleCreateSlice = async () => {
    // Validate form before creating slice
    if (!validateForm()) {
      return;
    }
    
    try {
      // Instead of API call, create mock data
      const newSlice = {
        id: Date.now(), // Using timestamp as ID for mock data
        name: formData.name,
        service_type: formData.service_type,
        qos_requirements: formData.qos_requirements,
        isolation_level: formData.isolation_level,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        vnfs: [],
        resources: {
          cpu: Math.floor(Math.random() * 8) + 2, // Random CPU allocation
          memory: Math.floor(Math.random() * 16) + 4, // Random memory allocation
          storage: Math.floor(Math.random() * 500) + 100 // Random storage allocation
        }
      };
      
      setSlices([...slices, newSlice]);
      setOpenDialog(false);
      setFormData({
        name: '',
        service_type: 'eMBB',
        qos_requirements: {
          bandwidth: 100,
          latency: 20,
          reliability: 99.9
        },
        isolation_level: 'full'
      });
      
      // Show success notification
      addNotification({
        type: 'success',
        message: `Network slice "${newSlice.name}" created successfully`
      });
      
      // Also show snackbar for consistency with existing code
      showSnackbar('Network slice created successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to create network slice', 'error');
      
      addNotification({
        type: 'error',
        message: 'Failed to create network slice'
      });
    }
  };

  const handleDeleteSlice = async (sliceId) => {
    try {
      // Find the slice to be deleted
      const sliceToDelete = slices.find(slice => slice.id === sliceId);
      if (!sliceToDelete) {
        throw new Error('Slice not found');
      }
      
      // Update state to remove the slice
      setSlices(slices.filter(slice => slice.id !== sliceId));
      
      // Show success notification
      addNotification({
        type: 'info',
        message: `Network slice "${sliceToDelete.name}" deleted successfully`
      });
      
      // Also show snackbar for consistency with existing code
      showSnackbar('Network slice deleted successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to delete network slice', 'error');
      
      addNotification({
        type: 'error',
        message: 'Failed to delete network slice'
      });
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const handleViewDetails = (slice) => {
    setSelectedSlice(slice);
    setDetailsOpen(true);
    // Simulate fetching metrics
    const now = Date.now();
    const simulatedMetrics = Array.from({ length: 10 }, (_, i) => ({
      timestamp: new Date(now - (9 - i) * 60000).toLocaleTimeString(),
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      bandwidth: Math.random() * slice.qos_requirements.bandwidth
    }));
    setMetrics({
      cpu: simulatedMetrics,
      memory: simulatedMetrics,
      bandwidth: simulatedMetrics
    });
  };

  const handleSliceAction = async (slice, action) => {
    try {
      // Update the slice status based on the action
      const updatedSlices = slices.map(s => {
        if (s.id === slice.id) {
          return { 
            ...s, 
            status: action === 'start' ? 'active' : 'stopped',
            updated_at: new Date().toISOString()
          };
        }
        return s;
      });
      
      setSlices(updatedSlices);
      
      // Show success notification
      addNotification({
        type: 'success',
        message: `Network slice "${slice.name}" ${action === 'start' ? 'started' : 'stopped'} successfully`
      });
      
      // Also show snackbar for consistency
      showSnackbar(`Network slice ${action === 'start' ? 'started' : 'stopped'} successfully`, 'success');
    } catch (error) {
      showSnackbar(`Failed to ${action} network slice`, 'error');
      
      addNotification({
        type: 'error',
        message: `Failed to ${action} network slice "${slice.name}"`
      });
    }
  };

  const checkQoSViolations = () => {
    const newAlerts = [];
    slices.forEach(slice => {
      // Simulate current metrics (in real app, these would come from API)
      const currentMetrics = {
        bandwidth: Math.random() * 100,
        latency: Math.random() * 30,
        reliability: 85 + Math.random() * 15
      };

      // Check bandwidth
      if (currentMetrics.bandwidth > thresholds.bandwidth.critical) {
        newAlerts.push({
          id: Date.now(),
          sliceId: slice.id,
          sliceName: slice.name,
          type: 'bandwidth',
          severity: 'critical',
          message: `Bandwidth usage critical: ${currentMetrics.bandwidth.toFixed(1)}%`,
          timestamp: new Date().toISOString()
        });
      } else if (currentMetrics.bandwidth > thresholds.bandwidth.warning) {
        newAlerts.push({
          id: Date.now(),
          sliceId: slice.id,
          sliceName: slice.name,
          type: 'bandwidth',
          severity: 'warning',
          message: `High bandwidth usage: ${currentMetrics.bandwidth.toFixed(1)}%`,
          timestamp: new Date().toISOString()
        });
      }

      // Check latency
      if (currentMetrics.latency > thresholds.latency.critical) {
        newAlerts.push({
          id: Date.now() + 1,
          sliceId: slice.id,
          sliceName: slice.name,
          type: 'latency',
          severity: 'critical',
          message: `High latency detected: ${currentMetrics.latency.toFixed(1)}ms`,
          timestamp: new Date().toISOString()
        });
      }

      // Check reliability
      if (currentMetrics.reliability < thresholds.reliability.critical) {
        newAlerts.push({
          id: Date.now() + 2,
          sliceId: slice.id,
          sliceName: slice.name,
          type: 'reliability',
          severity: 'critical',
          message: `Low reliability: ${currentMetrics.reliability.toFixed(1)}%`,
          timestamp: new Date().toISOString()
        });
      }
    });

    if (newAlerts.length > 0) {
      setQosAlerts(prev => [...newAlerts, ...prev].slice(0, 50)); // Keep last 50 alerts
    }
  };

  const SliceDetailsDialog = () => {
    if (!selectedSlice) return null;

    return (
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Slice Details: {selectedSlice.name}
          <Chip
            label={selectedSlice.status || 'active'}
            color={getStatusColor(selectedSlice.status)}
            size="small"
            sx={{ ml: 2 }}
          />
        </DialogTitle>
        <DialogContent>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
            <Tab label="Overview" />
            <Tab label="QoS Monitoring" />
            <Tab label="Topology" />
            <Tab label="Backup & Recovery" />
            <Tab label="Connected VNFs" />
          </Tabs>

          {activeTab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Service Type</Typography>
                <Typography variant="body1">{selectedSlice.service_type}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Isolation Level</Typography>
                <Typography variant="body1">{selectedSlice.isolation_level}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>QoS Requirements</Typography>
                <Stack direction="row" spacing={2}>
                  <Paper sx={{ p: 2, flex: 1 }}>
                    <Typography variant="subtitle2">Bandwidth</Typography>
                    <Typography variant="h6">{selectedSlice.qos_requirements.bandwidth} Mbps</Typography>
                  </Paper>
                  <Paper sx={{ p: 2, flex: 1 }}>
                    <Typography variant="subtitle2">Latency</Typography>
                    <Typography variant="h6">{selectedSlice.qos_requirements.latency} ms</Typography>
                  </Paper>
                  <Paper sx={{ p: 2, flex: 1 }}>
                    <Typography variant="subtitle2">Reliability</Typography>
                    <Typography variant="h6">{selectedSlice.qos_requirements.reliability}%</Typography>
                  </Paper>
                </Stack>
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <QoSMonitoring slice={selectedSlice} />
          )}

          {activeTab === 2 && (
            <TopologyView slice={selectedSlice} />
          )}

          {activeTab === 3 && (
            <BackupRecovery slice={selectedSlice} />
          )}

          {activeTab === 4 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>VNF Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography color="textSecondary">No VNFs connected</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={selectedSlice.status === 'active' ? <StopIcon /> : <StartIcon />}
            onClick={() => handleSliceAction(selectedSlice, selectedSlice.status === 'active' ? 'stop' : 'start')}
          >
            {selectedSlice.status === 'active' ? 'Stop' : 'Start'}
          </Button>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const QosMonitoringTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">QoS Monitoring</Typography>
        <Button
          startIcon={<ThresholdIcon />}
          onClick={() => setShowThresholds(true)}
        >
          Set Thresholds
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Recent Alerts</Typography>
            <List>
              {qosAlerts
                .filter(alert => alert.sliceId === selectedSlice.id)
                .slice(0, 5)
                .map(alert => (
                  <ListItem key={alert.id}>
                    <ListItemIcon>
                      {alert.severity === 'critical' ? 
                        <WarningIcon color="error" /> : 
                        <AlertIcon color="warning" />
                      }
                    </ListItemIcon>
                    <ListItemText
                      primary={alert.message}
                      secondary={new Date(alert.timestamp).toLocaleString()}
                    />
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Health Status</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <HealthIcon 
                    color={metrics.cpu[metrics.cpu.length - 1]?.cpu > thresholds.bandwidth.warning ? 'warning' : 'success'} 
                    sx={{ fontSize: 40 }}
                  />
                  <Typography>Bandwidth</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <HealthIcon 
                    color={metrics.cpu[metrics.cpu.length - 1]?.latency > thresholds.latency.warning ? 'warning' : 'success'} 
                    sx={{ fontSize: 40 }}
                  />
                  <Typography>Latency</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <HealthIcon 
                    color={metrics.cpu[metrics.cpu.length - 1]?.reliability < thresholds.reliability.warning ? 'warning' : 'success'} 
                    sx={{ fontSize: 40 }}
                  />
                  <Typography>Reliability</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const handleBatchOperation = async (operation) => {
    try {
      await Promise.all(
        selectedSlices.map(sliceId => 
          axios.post(`http://localhost:8000/api/v1/slices/${sliceId}/${operation}`)
        )
      );
      showSnackbar(`Batch ${operation} successful`, 'success');
      fetchSlices();
    } catch (error) {
      showSnackbar(`Failed to perform batch ${operation}`, 'error');
    }
  };

  const handleExport = () => {
    const exportData = {
      slices,
      quotas,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'network-slices-export.json';
    a.click();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const importData = JSON.parse(e.target.result);
          // Import slices
          await Promise.all(
            importData.slices.map(slice => 
              axios.post('http://localhost:8000/api/v1/slices', slice)
            )
          );
          setQuotas(importData.quotas);
          showSnackbar('Import successful', 'success');
          fetchSlices();
        } catch (error) {
          showSnackbar('Failed to import configuration', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredSlices = slices.filter(slice => {
    if (filterOptions.serviceType && slice.service_type !== filterOptions.serviceType) return false;
    if (filterOptions.status && slice.status !== filterOptions.status) return false;
    if (filterOptions.minBandwidth && slice.qos_requirements.bandwidth < filterOptions.minBandwidth) return false;
    if (filterOptions.maxLatency && slice.qos_requirements.latency > filterOptions.maxLatency) return false;
    return true;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">{t('networkSlices.title')}</Typography>
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<RefreshIcon />} 
            onClick={() => fetchSlices()}
            sx={{ mr: 1 }}
          >
            {t('common.refresh')}
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />} 
            onClick={() => setOpenDialog(true)}
          >
            {t('networkSlices.createSlice')}
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>{t('networkSlices.filters')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label={t('networkSlices.serviceType')}
              value={filterOptions.serviceType}
              onChange={(e) => setFilterOptions({...filterOptions, serviceType: e.target.value})}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              {serviceTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label={t('common.status')}
              value={filterOptions.status}
              onChange={(e) => setFilterOptions({...filterOptions, status: e.target.value})}
            >
              <MenuItem value="">{t('common.all')}</MenuItem>
              <MenuItem value="active">{t('networkSlices.status.active')}</MenuItem>
              <MenuItem value="stopped">{t('networkSlices.status.stopped')}</MenuItem>
              <MenuItem value="error">{t('networkSlices.status.error')}</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="number"
              label={t('networkSlices.minBandwidth')}
              placeholder="Mbps"
              value={filterOptions.minBandwidth}
              onChange={(e) => setFilterOptions({...filterOptions, minBandwidth: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="number"
              label={t('networkSlices.maxLatency')}
              placeholder="ms"
              value={filterOptions.maxLatency}
              onChange={(e) => setFilterOptions({...filterOptions, maxLatency: e.target.value})}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>{t('networkSlices.resourceQuotas')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="number"
              label={t('networkSlices.maxSlices')}
              value={quotas.maxSlices}
              onChange={(e) => setQuotas({...quotas, maxSlices: parseInt(e.target.value)})}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="number"
              label={t('networkSlices.totalBandwidth')}
              placeholder="Mbps"
              value={quotas.totalBandwidth}
              onChange={(e) => setQuotas({...quotas, totalBandwidth: parseInt(e.target.value)})}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="number"
              label={t('networkSlices.totalCPU')}
              value={quotas.totalCPU}
              onChange={(e) => setQuotas({...quotas, totalCPU: parseInt(e.target.value)})}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="number"
              label={t('networkSlices.totalMemory')}
              placeholder="MB"
              value={quotas.totalMemory}
              onChange={(e) => setQuotas({...quotas, totalMemory: parseInt(e.target.value)})}
            />
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
        <Button 
          variant="outlined"
          disabled={selectedSlices.length === 0}
          onClick={() => handleBatchOperation('start')}
        >
          {t('networkSlices.startSelected')}
        </Button>
        <Button 
          variant="outlined"
          disabled={selectedSlices.length === 0}
          onClick={() => handleBatchOperation('stop')}
        >
          {t('networkSlices.stopSelected')}
        </Button>
        <Button 
          variant="outlined" 
          color="error"
          disabled={selectedSlices.length === 0}
          onClick={() => handleBatchOperation('delete')}
        >
          {t('networkSlices.deleteSelected')}
        </Button>
        <Button 
          variant="outlined"
          onClick={() => setShowDependencies(!showDependencies)}
        >
          {t('networkSlices.exportConfiguration')}
        </Button>
        <Button 
          variant="outlined"
          onClick={handleImport}
        >
          {t('networkSlices.importConfiguration')}
        </Button>
        <Button 
          variant="outlined"
          onClick={() => setTemplateDialogOpen(true)}
        >
          {t('networkSlices.useTemplate')}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox 
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSlices(slices.map(s => s.id));
                    } else {
                      setSelectedSlices([]);
                    }
                  }}
                  checked={selectedSlices.length > 0 && selectedSlices.length === slices.length}
                  indeterminate={selectedSlices.length > 0 && selectedSlices.length < slices.length}
                />
              </TableCell>
              <TableCell>{t('common.name')}</TableCell>
              <TableCell>{t('networkSlices.serviceType')}</TableCell>
              <TableCell>{t('common.status')}</TableCell>
              <TableCell>{t('networkSlices.bandwidth')}</TableCell>
              <TableCell>{t('networkSlices.latency')}</TableCell>
              <TableCell>{t('networkSlices.reliability')}</TableCell>
              <TableCell>{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSlices.map((slice) => (
              <TableRow 
                key={slice.id} 
                hover
                selected={selectedSlices.includes(slice.id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox 
                    checked={selectedSlices.includes(slice.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSlices([...selectedSlices, slice.id]);
                      } else {
                        setSelectedSlices(selectedSlices.filter(id => id !== slice.id));
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{slice.name}</TableCell>
                <TableCell>{slice.service_type}</TableCell>
                <TableCell>
                  <Chip 
                    label={t(`networkSlices.status.${slice.status}`)}
                    color={
                      slice.status === 'active' ? 'success' : 
                      slice.status === 'stopped' ? 'default' : 'error'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{slice.qos_requirements.bandwidth} Mbps</TableCell>
                <TableCell>{slice.qos_requirements.latency} ms</TableCell>
                <TableCell>{slice.qos_requirements.reliability}%</TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => handleViewDetails(slice)}
                    title={t('networkSlices.viewMetrics')}
                    size="small"
                  >
                    <MetricsIcon />
                  </IconButton>
                  {slice.status === 'active' ? (
                    <IconButton 
                      onClick={() => handleSliceAction(slice, 'stop')}
                      title={t('networkSlices.stopSlice')}
                      size="small"
                    >
                      <StopIcon />
                    </IconButton>
                  ) : (
                    <IconButton 
                      onClick={() => handleSliceAction(slice, 'start')}
                      title={t('networkSlices.startSlice')}
                      size="small"
                      disabled={slice.status === 'error'}
                    >
                      <StartIcon />
                    </IconButton>
                  )}
                  <IconButton 
                    onClick={() => handleDeleteSlice(slice.id)}
                    title={t('networkSlices.deleteSlice')}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredSlices.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {t('networkSlices.noSlicesFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Create Slice Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('networkSlices.createNewSlice')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('networkSlices.sliceName')}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label={t('networkSlices.serviceType')}
                value={formData.service_type}
                onChange={(e) => setFormData({...formData, service_type: e.target.value})}
                required
              >
                {serviceTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label={t('networkSlices.isolationLevel')}
                value={formData.isolation_level}
                onChange={(e) => setFormData({...formData, isolation_level: e.target.value})}
                required
              >
                {isolationLevels.map(level => (
                  <MenuItem key={level} value={level}>
                    {t(`networkSlices.isolation.${level}`)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                {t('networkSlices.qosRequirements')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label={t('networkSlices.bandwidth')}
                value={formData.qos_requirements.bandwidth}
                onChange={(e) => setFormData({
                  ...formData, 
                  qos_requirements: {
                    ...formData.qos_requirements,
                    bandwidth: parseInt(e.target.value)
                  }
                })}
                InputProps={{ endAdornment: 'Mbps' }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label={t('networkSlices.latency')}
                value={formData.qos_requirements.latency}
                onChange={(e) => setFormData({
                  ...formData, 
                  qos_requirements: {
                    ...formData.qos_requirements,
                    latency: parseInt(e.target.value)
                  }
                })}
                InputProps={{ endAdornment: 'ms' }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label={t('networkSlices.reliability')}
                value={formData.qos_requirements.reliability}
                onChange={(e) => setFormData({
                  ...formData, 
                  qos_requirements: {
                    ...formData.qos_requirements,
                    reliability: parseFloat(e.target.value)
                  }
                })}
                InputProps={{ endAdornment: '%' }}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleCreateSlice}
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? t('common.loading') : t('common.create')}
          </Button>
        </DialogActions>
      </Dialog>
      
    </Box>
  );
};

export default NetworkSlices; 