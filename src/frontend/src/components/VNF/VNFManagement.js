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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  Select,
  LinearProgress,
  InputLabel,
  useMediaQuery,
  useTheme,
  Skeleton
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Storage as StorageIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Help as HelpIcon,
  Error as ErrorIcon,
  Visibility as ViewIcon,
  Refresh as RestartIcon,
  Security as SecurityIcon,
  Balance as BalanceIcon,
  Shield as ShieldIcon,
  Router as RouterIcon,
  SwapHoriz as SwapHorizIcon,
  VpnLock as VpnLockIcon,
  Http as HttpIcon,
  Dns as DnsIcon,
  Speed as OptimizeIcon,
  Memory as MemoryIcon
} from '@mui/icons-material';
import { useNotifications } from '../Notifications/NotificationContext';
import SkeletonLoader from '../Utils/SkeletonLoader';
import { useTranslation } from 'react-i18next';

const VNFManagement = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotifications();
  const theme = useTheme();
  const [vnfs, setVNFs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    type: 'firewall',
    resources: {
      cpu: 1,
      memory: 512,
      storage: 1
    },
    config: {
      port: 80,
      rules: []
    }
  });
  const [templateDialog, setTemplateDialog] = useState(false);
  const [healthCheckDialog, setHealthCheckDialog] = useState(false);
  const [autoScalingDialog, setAutoScalingDialog] = useState(false);
  const [logsDialog, setLogsDialog] = useState(false);
  const [optimizationDialog, setOptimizationDialog] = useState(false);
  const [migrationDialog, setMigrationDialog] = useState(false);
  const [selectedVNF, setSelectedVNF] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    config: null
  });
  const [healthChecks, setHealthChecks] = useState([]);
  const [newHealthCheck, setNewHealthCheck] = useState({
    endpoint: '',
    interval: 30,
    timeout: 5,
    successCodes: [200],
    retries: 3
  });
  const [autoScalingRules, setAutoScalingRules] = useState([]);
  const [newScalingRule, setNewScalingRule] = useState({
    metric: 'cpu',
    condition: 'above',
    threshold: 80,
    duration: 300,
    scaleChange: 1,
    cooldown: 600
  });
  const [newRule, setNewRule] = useState('');
  const [newBackend, setNewBackend] = useState('');
  
  // These variables are for future features - disabling ESLint warnings
  // eslint-disable-next-line no-unused-vars
  const [logs, setLogs] = useState([]);
  const [logFilters, setLogFilters] = useState({
    severity: '',
    timeRange: '1h'
  });
  // eslint-disable-next-line no-unused-vars
  const [optimizationSuggestions, setOptimizationSuggestions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [availableSlices, setAvailableSlices] = useState([]);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const vnfTypes = [
    { value: 'firewall', label: t('vnf.types.firewall'), defaultPort: 443, icon: <SecurityIcon /> },
    { value: 'load_balancer', label: t('vnf.types.loadBalancer'), defaultPort: 80, icon: <BalanceIcon /> },
    { value: 'ids', label: t('vnf.types.ids'), defaultPort: 8080, icon: <ShieldIcon /> },
    { value: 'router', label: t('vnf.types.virtualRouter'), defaultPort: 80, icon: <RouterIcon /> },
    { value: 'nat', label: t('vnf.types.natGateway'), defaultPort: 80, icon: <SwapHorizIcon /> },
    { value: 'vpn', label: t('vnf.types.vpnGateway'), defaultPort: 1194, icon: <VpnLockIcon /> },
    { value: 'proxy', label: t('vnf.types.proxyServer'), defaultPort: 8080, icon: <HttpIcon /> },
    { value: 'dns', label: t('vnf.types.dnsServer'), defaultPort: 53, icon: <DnsIcon /> }
  ];

  useEffect(() => {
    // Load VNFs when component mounts
    fetchVNFs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchVNFs = async () => {
    setLoading(true);
    try {
      // Mock data for VNFs
      const mockVNFs = [
        {
          id: 1001,
          name: t('vnf.mockData.firewallName'),
          type: 'firewall',
          status: 'running',
          resources: {
            cpu: 2,
            memory: 1024,
            storage: 5
          },
          config: {
            port: 443,
            rules: [t('vnf.mockData.allowRule'), t('vnf.mockData.denyRule')]
          },
          health: {
            status: 'healthy',
            lastCheck: '2023-06-15T09:30:00Z'
          },
          metrics: {
            cpu: 35,
            memory: 42,
            network: 78
          },
          created_at: '2023-05-10T08:15:22Z'
        },
        {
          id: 1002,
          name: t('vnf.mockData.loadBalancerName'),
          type: 'load_balancer',
          status: 'running',
          resources: {
            cpu: 4,
            memory: 2048,
            storage: 10
          },
          config: {
            port: 80,
            algorithm: 'round-robin',
            backends: ['192.168.1.10', '192.168.1.11', '192.168.1.12']
          },
          health: {
            status: 'healthy',
            lastCheck: '2023-06-15T09:30:00Z'
          },
          metrics: {
            cpu: 56,
            memory: 63,
            network: 92
          },
          created_at: '2023-05-12T10:20:35Z'
        }
      ];
      
      setTimeout(() => {
        setVNFs(mockVNFs);
        setLoading(false);
        addNotification({
          message: t('vnf.notifications.loaded'),
          type: 'success'
        });
      }, 1000);
    } catch (error) {
      console.error('Error fetching VNFs:', error);
      setLoading(false);
      setSnackbar({
        open: true,
        message: t('vnf.notifications.loadError'),
        severity: 'error'
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name || formData.name.trim() === '') {
      errors.name = 'VNF name is required';
    } else if (formData.name.length < 3) {
      errors.name = 'VNF name must be at least 3 characters';
    }
    
    if (!formData.type || formData.type.trim() === '') {
      errors.type = 'VNF type is required';
    }
    
    if (!formData.resources.cpu || formData.resources.cpu < 1) {
      errors.cpu = 'CPU must be at least 1 core';
    }
    
    if (!formData.resources.memory || formData.resources.memory < 128) {
      errors.memory = 'Memory must be at least 128 MB';
    }
    
    if (!formData.resources.storage || formData.resources.storage < 1) {
      errors.storage = 'Storage must be at least 1 GB';
    }
    
    return errors;
  };
  
  const handleCreateVNF = async () => {
    // Validate form first
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      // Show the first error
      const firstError = Object.values(errors)[0];
      showSnackbar(firstError, 'error');
      return;
    }
    
    try {
      // Create a new VNF with mock data
      const newVNF = {
        id: Date.now(), // Use timestamp as ID
        name: formData.name,
        type: formData.type,
        status: 'stopped',
        resources: formData.resources,
        config: formData.config,
        health: {
          status: 'healthy',
          lastCheck: new Date().toISOString()
        },
        metrics: {
          cpu: Math.floor(Math.random() * 100),
          memory: Math.floor(Math.random() * 100),
          network: Math.floor(Math.random() * 100)
        },
        created_at: new Date().toISOString()
      };
      
      // Update state with new VNF
      setVNFs([...vnfs, newVNF]);
      setOpenDialog(false);
      
      // Reset form data
      setFormData({
        name: '',
        type: 'firewall',
        resources: {
          cpu: 1,
          memory: 512,
          storage: 1
        },
        config: {
          port: 80,
          rules: []
        }
      });
      
      // Show success notification
      addNotification({
        type: 'success',
        message: `VNF "${newVNF.name}" created successfully`
      });
      
      // Also show snackbar for consistency
      showSnackbar('VNF created successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to create VNF', 'error');
      
      addNotification({
        type: 'error',
        message: 'Failed to create VNF'
      });
    }
  };

  const handleDeleteVNF = async (id) => {
    try {
      // Filter out the deleted VNF from state
      const updatedVNFs = vnfs.filter(vnf => vnf.id !== id);
      setVNFs(updatedVNFs);
      
      // Get the name of the deleted VNF for the notification
      const deletedVNF = vnfs.find(vnf => vnf.id === id);
      
      // Show success notification
      addNotification({
        type: 'success',
        message: `VNF "${deletedVNF?.name || 'Unknown'}" deleted successfully`
      });
      
      showSnackbar('VNF deleted successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to delete VNF', 'error');
      
      addNotification({
        type: 'error',
        message: 'Failed to delete VNF'
      });
    }
  };

  const handleVNFAction = async (id, action) => {
    try {
      // Find the VNF to update
      const vnfToUpdate = vnfs.find(vnf => vnf.id === id);
      if (!vnfToUpdate) {
        showSnackbar('VNF not found', 'error');
        return;
      }
      
      // Update VNF status based on action
      let newStatus;
      switch (action) {
        case 'start':
          newStatus = 'running';
          break;
        case 'stop':
          newStatus = 'stopped';
          break;
        case 'restart':
          newStatus = 'restarting';
          // After 2 seconds, change to running to simulate restart
          setTimeout(() => {
            setVNFs(currentVNFs => 
              currentVNFs.map(vnf => 
                vnf.id === id ? { ...vnf, status: 'running' } : vnf
              )
            );
          }, 2000);
          break;
        default:
          newStatus = vnfToUpdate.status;
      }
      
      // Update the VNF in state
      const updatedVNFs = vnfs.map(vnf => 
        vnf.id === id ? { ...vnf, status: newStatus } : vnf
      );
      
      setVNFs(updatedVNFs);
      
      const actionText = action === 'start' ? 'started' : 
                         action === 'stop' ? 'stopped' : 
                         'restarted';
      
      // Show success notification
      addNotification({
        type: 'success',
        message: `VNF "${vnfToUpdate.name}" ${actionText} successfully`
      });
      
      showSnackbar(`VNF ${actionText} successfully`, 'success');
    } catch (error) {
      showSnackbar(`Failed to ${action} VNF`, 'error');
      
      addNotification({
        type: 'error',
        message: `Failed to ${action} VNF`
      });
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    let updatedConfig = { ...formData.config };
    
    // Reset type-specific config when changing types
    if (type === 'firewall') {
      updatedConfig = {
        port: 443,
        rules: []
      };
    } else if (type === 'load_balancer') {
      updatedConfig = {
        port: 80,
        algorithm: 'round-robin',
        backends: []
      };
    } else if (type === 'ids') {
      updatedConfig = {
        port: 8080,
        mode: 'detection',
        signatures: 'latest'
      };
    } else {
      updatedConfig = {
        port: 80
      };
    }
    
    setFormData({
      ...formData,
      type,
      config: updatedConfig
    });
  };

  const handleSaveTemplate = () => {
    if (selectedVNF) {
      const template = {
        ...newTemplate,
        config: {
          type: selectedVNF.type,
          resources: selectedVNF.resources,
          config: selectedVNF.config
        }
      };
      setTemplates([...templates, template]);
      setTemplateDialog(false);
      setNewTemplate({ name: '', description: '', config: null });
    }
  };

  const handleAddHealthCheck = () => {
    if (selectedVNF) {
      setHealthChecks([...healthChecks, { ...newHealthCheck, vnfId: selectedVNF.id }]);
      setHealthCheckDialog(false);
      setNewHealthCheck({
        endpoint: '',
        interval: 30,
        timeout: 5,
        successCodes: [200],
        retries: 3
      });
    }
  };

  const handleAddScalingRule = () => {
    if (selectedVNF) {
      setAutoScalingRules([...autoScalingRules, { ...newScalingRule, vnfId: selectedVNF.id }]);
      setAutoScalingDialog(false);
      setNewScalingRule({
        metric: 'cpu',
        condition: 'above',
        threshold: 80,
        duration: 300,
        scaleChange: 1,
        cooldown: 600
      });
    }
  };

  const handleMigrateVNF = async (vnfId, targetSliceId) => {
    try {
      // Mock the migration process
      // Find the VNF to update
      const vnfToMigrate = vnfs.find(vnf => vnf.id === vnfId);
      if (!vnfToMigrate) {
        showSnackbar('VNF not found', 'error');
        return;
      }
      
      // Update the VNF status temporarily to indicate migration
      const updatedVNFs = vnfs.map(vnf => 
        vnf.id === vnfId ? { ...vnf, status: 'migrating' } : vnf
      );
      
      setVNFs(updatedVNFs);
      
      // After 2 seconds, change to running to simulate completed migration
      setTimeout(() => {
        setVNFs(currentVNFs => 
          currentVNFs.map(vnf => 
            vnf.id === vnfId ? { ...vnf, status: 'running', sliceId: targetSliceId } : vnf
          )
        );
        
        // Show success notification
        addNotification({
          type: 'success',
          message: `VNF "${vnfToMigrate.name}" migrated successfully to Slice ${targetSliceId}`
        });
      }, 2000);
      
      showSnackbar('VNF migration initiated', 'success');
    } catch (error) {
      showSnackbar('Failed to migrate VNF', 'error');
      
      addNotification({
        type: 'error',
        message: 'Failed to migrate VNF'
      });
    }
  };

  /**
   * Fetches VNF logs - Reserved for future log viewing feature
   */
  // eslint-disable-next-line no-unused-vars
  const fetchVNFLogs = async (vnfId) => {
    // Implementation will be added when the logging feature is implemented
  };

  /**
   * Generates optimization suggestions - Reserved for future performance optimization feature
   */
  // eslint-disable-next-line no-unused-vars
  const generateOptimizationSuggestions = async (vnfId) => {
    // Implementation will be added when the optimization feature is implemented
  };

  const handleViewDetails = (vnf) => {
    setSelectedVNF(vnf);
    setOpenDetailsDialog(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3, gap: 2 }}>
        <Typography variant="h4" sx={{ mb: { xs: 1, sm: 0 } }}>{t('vnf.title')}</Typography>
        <Box sx={{ display: 'flex', width: { xs: '100%', sm: 'auto' } }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchVNFs}
            sx={{ mr: 1, flex: { xs: 1, sm: 'none' } }}
          >
            {t('vnf.refreshButton')}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ flex: { xs: 1, sm: 'none' } }}
          >
            {t('vnf.createButton')}
          </Button>
        </Box>
      </Box>

      {loading ? (
        <>
          <SkeletonLoader type="dashboard" rows={3} />
        </>
      ) : (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} md={3}>
            <Paper 
              sx={{ 
                p: 2, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.shadows[4]
                }
              }}
            >
              <Typography variant="h4" color="primary" gutterBottom>
                {vnfs.length}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {t('vnf.totalVnfs')}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper 
              sx={{ 
                p: 2, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.shadows[4]
                }
              }}
            >
              <Typography variant="h4" color="success.main" gutterBottom>
                {vnfs.filter(vnf => vnf.status === 'running').length}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {t('vnf.runningVnfs')}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper 
              sx={{ 
                p: 2, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.shadows[4]
                }
              }}
            >
              <Typography variant="h4" color="error.main" gutterBottom>
                {vnfs.filter(vnf => vnf.status === 'stopped').length}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {t('vnf.stoppedVnfs')}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper 
              sx={{ 
                p: 2, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.shadows[4]
                }
              }}
            >
              <Typography variant="h4" color={
                vnfs.filter(vnf => vnf.health.status !== 'healthy').length > 0 
                  ? 'error.main' 
                  : 'success.main'
              } gutterBottom>
                {vnfs.filter(vnf => vnf.health.status === 'healthy').length}/{vnfs.length}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {t('vnf.healthyVnfs')}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      <TableContainer component={Paper} sx={{ mt: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('vnf.name')}</TableCell>
              <TableCell>{t('vnf.type')}</TableCell>
              <TableCell>{t('vnf.status')}</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('vnf.resources')}</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t('vnf.health')}</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{t('vnf.created')}</TableCell>
              <TableCell>{t('vnf.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array(5).fill(0).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell colSpan={7} sx={{ py: 0, height: 60 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ flex: 2 }}>
                          <Skeleton animation="wave" height={24} width="80%" />
                        </Box>
                        <Box sx={{ flex: 1, display: { xs: 'none', sm: 'block' } }}>
                          <Skeleton animation="wave" height={24} width="60%" />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Skeleton animation="wave" height={24} width="60%" />
                        </Box>
                        <Box sx={{ flex: 2, display: { xs: 'none', md: 'block' } }}>
                          <Skeleton animation="wave" height={24} width="90%" />
                        </Box>
                        <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }}>
                          <Skeleton animation="wave" height={24} width="60%" />
                        </Box>
                        <Box sx={{ flex: 1, display: { xs: 'none', sm: 'block' } }}>
                          <Skeleton animation="wave" height={24} width="70%" />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Skeleton animation="wave" variant="circular" width={32} height={32} sx={{ ml: 0.5 }} />
                            <Skeleton animation="wave" variant="circular" width={32} height={32} sx={{ ml: 0.5, display: { xs: 'none', sm: 'block' } }} />
                            <Skeleton animation="wave" variant="circular" width={32} height={32} sx={{ ml: 0.5 }} />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : vnfs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <StorageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.3 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {t('vnf.noVnfsFound')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {t('vnf.createFirstVnf')}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenDialog(true)}
                      size="large"
                    >
                      {t('vnf.createVnf')}
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              vnfs.map((vnf) => (
                <TableRow 
                  key={vnf.id} 
                  sx={{ 
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: theme => theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  <TableCell>{vnf.name}</TableCell>
                  <TableCell>
                    <Chip
                      icon={vnfTypes.find(t => t.value === vnf.type)?.icon || <StorageIcon />}
                      label={vnfTypes.find(t => t.value === vnf.type)?.label || vnf.type}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={vnf.status}
                      color={
                        vnf.status === 'running' ? 'success' :
                        vnf.status === 'stopped' ? 'error' :
                        vnf.status === 'restarting' ? 'warning' : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Typography variant="body2" component="div">
                      <Box display="flex" alignItems="center">
                        <Box mr={1}>CPU:</Box>
                        <Box flexGrow={1}>
                          <LinearProgress 
                            variant="determinate" 
                            value={vnf.metrics.cpu} 
                            color={vnf.metrics.cpu > 80 ? "error" : "primary"}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                        <Box ml={1} minWidth={30} textAlign="right">
                          {vnf.metrics.cpu}%
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" mt={0.5}>
                        <Box mr={1}>RAM:</Box>
                        <Box flexGrow={1}>
                          <LinearProgress 
                            variant="determinate" 
                            value={vnf.metrics.memory} 
                            color={vnf.metrics.memory > 80 ? "error" : "primary"}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                        <Box ml={1} minWidth={30} textAlign="right">
                          {vnf.metrics.memory}%
                        </Box>
                      </Box>
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Box display="flex" alignItems="center">
                      {vnf.health.status === 'healthy' ? (
                        <CheckCircleIcon color="success" fontSize="small" />
                      ) : vnf.health.status === 'unknown' ? (
                        <HelpIcon color="warning" fontSize="small" />
                      ) : (
                        <ErrorIcon color="error" fontSize="small" />
                      )}
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {vnf.health.status}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    {new Date(vnf.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexWrap="nowrap">
                      <IconButton
                        size="small"
                        onClick={() => handleVNFAction(vnf.id, vnf.status === 'running' ? 'stop' : 'start')}
                        color={vnf.status === 'running' ? "error" : "success"}
                        title={vnf.status === 'running' ? t('vnf.stopVnf') : t('vnf.startVnf')}
                        sx={{ 
                          transition: 'transform 0.2s',
                          '&:hover': { transform: 'scale(1.1)' }
                        }}
                      >
                        {vnf.status === 'running' ? <StopIcon /> : <StartIcon />}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleVNFAction(vnf.id, 'restart')}
                        disabled={vnf.status !== 'running'}
                        color="warning"
                        title={t('vnf.restartVnf')}
                        sx={{ 
                          display: { xs: 'none', sm: 'inline-flex' },
                          transition: 'transform 0.2s',
                          '&:hover': { transform: 'scale(1.1)' }
                        }}
                      >
                        <RestartIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(vnf)}
                        color="primary"
                        title={t('vnf.viewDetails')}
                        sx={{ 
                          transition: 'transform 0.2s',
                          '&:hover': { transform: 'scale(1.1)' }
                        }}
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteVNF(vnf.id)}
                        color="error"
                        title={t('vnf.deleteVnf')}
                        sx={{ 
                          display: { xs: 'none', sm: 'inline-flex' },
                          transition: 'transform 0.2s',
                          '&:hover': { transform: 'scale(1.1)' }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create VNF Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        fullScreen={useMediaQuery(theme.breakpoints.down('sm'))}
        TransitionProps={{
          style: { 
            transition: 'all 0.3s ease-in-out'
          }
        }}
      >
        <DialogTitle>
          {t('vnf.createTitle')}
          <IconButton
            aria-label="close"
            onClick={() => setOpenDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('vnf.name')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                error={!formData.name || formData.name.length < 3}
                helperText={!formData.name ? t('vnf.nameRequired') : formData.name.length < 3 ? t('vnf.nameMinLength') : ""}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>{t('vnf.type')}</InputLabel>
                <Select
                  value={formData.type}
                  onChange={handleTypeChange}
                  label={t('vnf.type')}
                >
                  {vnfTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {type.icon}
                        <Box sx={{ ml: 1 }}>{type.label}</Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ 
                mt: 2, 
                fontSize: { xs: '1rem', sm: '1.25rem' },
                borderBottom: `1px solid ${theme.palette.divider}`,
                pb: 1
              }}>
                {t('vnf.resourceAllocation')}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label={t('vnf.cpuCores')}
                value={formData.resources.cpu}
                onChange={(e) => setFormData({
                  ...formData,
                  resources: {
                    ...formData.resources,
                    cpu: parseInt(e.target.value) || 1
                  }
                })}
                InputProps={{ 
                  inputProps: { min: 1 },
                  startAdornment: (
                    <Box sx={{ mr: 1, color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                      <StorageIcon fontSize="small" />
                    </Box>
                  )
                }}
                required
                error={formData.resources.cpu < 1}
                helperText={formData.resources.cpu < 1 ? t('vnf.minCpu') : ""}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label={t('vnf.memory')}
                value={formData.resources.memory}
                onChange={(e) => setFormData({
                  ...formData,
                  resources: {
                    ...formData.resources,
                    memory: parseInt(e.target.value) || 128
                  }
                })}
                InputProps={{ 
                  inputProps: { min: 128 },
                  startAdornment: (
                    <Box sx={{ mr: 1, color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                      <MemoryIcon fontSize="small" />
                    </Box>
                  )
                }}
                required
                error={formData.resources.memory < 128}
                helperText={formData.resources.memory < 128 ? t('vnf.minMemory') : ""}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label={t('vnf.storage')}
                value={formData.resources.storage}
                onChange={(e) => setFormData({
                  ...formData,
                  resources: {
                    ...formData.resources,
                    storage: parseInt(e.target.value) || 1
                  }
                })}
                InputProps={{ 
                  inputProps: { min: 1 },
                  startAdornment: (
                    <Box sx={{ mr: 1, color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                      <StorageIcon fontSize="small" />
                    </Box>
                  )
                }}
                required
                error={formData.resources.storage < 1}
                helperText={formData.resources.storage < 1 ? t('vnf.minStorage') : ""}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ 
                mt: 2, 
                fontSize: { xs: '1rem', sm: '1.25rem' },
                borderBottom: `1px solid ${theme.palette.divider}`,
                pb: 1
              }}>
                {t('vnf.configuration')}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label={t('vnf.port')}
                value={formData.config.port}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    port: parseInt(e.target.value) || 80
                  }
                })}
                InputProps={{ 
                  inputProps: { min: 1, max: 65535 },
                  startAdornment: (
                    <Box sx={{ mr: 1, color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                      <RouterIcon fontSize="small" />
                    </Box>
                  )
                }}
                variant="outlined"
              />
            </Grid>
            
            {formData.type === 'firewall' && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  {t('vnf.firewallRules')}
                </Typography>
                <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap' }}>
                  {formData.config.rules && formData.config.rules.map((rule, index) => (
                    <Chip 
                      key={index}
                      label={rule}
                      onDelete={() => {
                        const updatedRules = [...formData.config.rules];
                        updatedRules.splice(index, 1);
                        setFormData({
                          ...formData,
                          config: {
                            ...formData.config,
                            rules: updatedRules
                          }
                        });
                      }}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }}>
                  <TextField
                    fullWidth
                    label={t('vnf.addRule')}
                    value={newRule || ''}
                    onChange={(e) => setNewRule(e.target.value)}
                    sx={{ mb: { xs: 1, sm: 0 } }}
                  />
                  <Button 
                    variant="contained" 
                    sx={{ ml: { xs: 0, sm: 1 }, flexShrink: 0 }}
                    onClick={() => {
                      if (newRule && newRule.trim() !== '') {
                        setFormData({
                          ...formData,
                          config: {
                            ...formData.config,
                            rules: [...(formData.config.rules || []), newRule]
                          }
                        });
                        setNewRule('');
                      }
                    }}
                  >
                    {t('vnf.add')}
                  </Button>
                </Box>
              </Grid>
            )}
            
            {formData.type === 'load_balancer' && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  {t('vnf.loadBalancerConfig')}
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>{t('vnf.algorithm')}</InputLabel>
                  <Select
                    value={formData.config.algorithm || 'round-robin'}
                    onChange={(e) => setFormData({
                      ...formData,
                      config: {
                        ...formData.config,
                        algorithm: e.target.value
                      }
                    })}
                    label={t('vnf.algorithm')}
                  >
                    <MenuItem value="round-robin">{t('vnf.roundRobin')}</MenuItem>
                    <MenuItem value="least-connections">{t('vnf.leastConnections')}</MenuItem>
                    <MenuItem value="ip-hash">{t('vnf.ipHash')}</MenuItem>
                  </Select>
                </FormControl>
                
                <Typography variant="subtitle2" gutterBottom>
                  {t('vnf.backends')}
                </Typography>
                <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap' }}>
                  {formData.config.backends && formData.config.backends.map((backend, index) => (
                    <Chip 
                      key={index}
                      label={backend}
                      onDelete={() => {
                        const updatedBackends = [...formData.config.backends];
                        updatedBackends.splice(index, 1);
                        setFormData({
                          ...formData,
                          config: {
                            ...formData.config,
                            backends: updatedBackends
                          }
                        });
                      }}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }}>
                  <TextField
                    fullWidth
                    label={t('vnf.addBackend')}
                    value={newBackend || ''}
                    onChange={(e) => setNewBackend(e.target.value)}
                    sx={{ mb: { xs: 1, sm: 0 } }}
                  />
                  <Button 
                    variant="contained" 
                    sx={{ ml: { xs: 0, sm: 1 }, flexShrink: 0 }}
                    onClick={() => {
                      if (newBackend && newBackend.trim() !== '') {
                        setFormData({
                          ...formData,
                          config: {
                            ...formData.config,
                            backends: [...(formData.config.backends || []), newBackend]
                          }
                        });
                        setNewBackend('');
                      }
                    }}
                  >
                    {t('vnf.add')}
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Box>
            <Button onClick={() => setOpenDialog(false)} variant="outlined">{t('vnf.cancel')}</Button>
          </Box>
          <Button onClick={handleCreateVNF} variant="contained" color="primary">{t('vnf.create')}</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Template Dialog */}
      <Dialog open={templateDialog} onClose={() => setTemplateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('vnf.saveTemplateTitle')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('vnf.templateName')}
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('vnf.description')}
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialog(false)}>{t('vnf.cancel')}</Button>
          <Button
            onClick={handleSaveTemplate}
            variant="contained"
            disabled={!newTemplate.name}
          >
            {t('vnf.saveTemplate')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Health Check Dialog */}
      <Dialog open={healthCheckDialog} onClose={() => setHealthCheckDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('vnf.addHealthCheck')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('vnf.endpoint')}
                value={newHealthCheck.endpoint}
                onChange={(e) => setNewHealthCheck({ ...newHealthCheck, endpoint: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label={t('vnf.interval')}
                value={newHealthCheck.interval}
                onChange={(e) => setNewHealthCheck({ ...newHealthCheck, interval: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label={t('vnf.timeout')}
                value={newHealthCheck.timeout}
                onChange={(e) => setNewHealthCheck({ ...newHealthCheck, timeout: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={t('vnf.successCodes')}
                value={newHealthCheck.successCodes.join(', ')}
                onChange={(e) => setNewHealthCheck({
                  ...newHealthCheck,
                  successCodes: e.target.value.split(',').map(code => Number(code.trim()))
                })}
                helperText={t('vnf.successCodesHelper')}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label={t('vnf.retries')}
                value={newHealthCheck.retries}
                onChange={(e) => setNewHealthCheck({ ...newHealthCheck, retries: Number(e.target.value) })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHealthCheckDialog(false)}>{t('vnf.cancel')}</Button>
          <Button
            onClick={handleAddHealthCheck}
            variant="contained"
            disabled={!newHealthCheck.endpoint}
          >
            {t('vnf.addHealthCheck')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Auto-scaling Dialog */}
      <Dialog open={autoScalingDialog} onClose={() => setAutoScalingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('vnf.addAutoScaling')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label={t('vnf.metric')}
                value={newScalingRule.metric}
                onChange={(e) => setNewScalingRule({ ...newScalingRule, metric: e.target.value })}
              >
                <MenuItem value="cpu">{t('vnf.cpu')}</MenuItem>
                <MenuItem value="memory">{t('vnf.memory')}</MenuItem>
                <MenuItem value="network">{t('vnf.network')}</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label={t('vnf.condition')}
                value={newScalingRule.condition}
                onChange={(e) => setNewScalingRule({ ...newScalingRule, condition: e.target.value })}
              >
                <MenuItem value="above">{t('vnf.above')}</MenuItem>
                <MenuItem value="below">{t('vnf.below')}</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label={t('vnf.threshold')}
                value={newScalingRule.threshold}
                onChange={(e) => setNewScalingRule({ ...newScalingRule, threshold: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label={t('vnf.duration')}
                value={newScalingRule.duration}
                onChange={(e) => setNewScalingRule({ ...newScalingRule, duration: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label={t('vnf.scaleChange')}
                value={newScalingRule.scaleChange}
                onChange={(e) => setNewScalingRule({ ...newScalingRule, scaleChange: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label={t('vnf.cooldown')}
                value={newScalingRule.cooldown}
                onChange={(e) => setNewScalingRule({ ...newScalingRule, cooldown: Number(e.target.value) })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAutoScalingDialog(false)}>{t('vnf.cancel')}</Button>
          <Button
            onClick={handleAddScalingRule}
            variant="contained"
          >
            {t('vnf.addRule')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Logs Dialog */}
      <Dialog open={logsDialog} onClose={() => setLogsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('vnf.vnfLogs')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label={t('vnf.severity')}
                value={logFilters.severity}
                onChange={(e) => setLogFilters({ ...logFilters, severity: e.target.value })}
              >
                <MenuItem value="">{t('vnf.all')}</MenuItem>
                <MenuItem value="info">{t('vnf.info')}</MenuItem>
                <MenuItem value="warning">{t('vnf.warning')}</MenuItem>
                <MenuItem value="error">{t('vnf.error')}</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label={t('vnf.timeRange')}
                value={logFilters.timeRange}
                onChange={(e) => setLogFilters({ ...logFilters, timeRange: e.target.value })}
              >
                <MenuItem value="1h">{t('vnf.lastHour')}</MenuItem>
                <MenuItem value="6h">{t('vnf.last6Hours')}</MenuItem>
                <MenuItem value="24h">{t('vnf.last24Hours')}</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <TableContainer sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('vnf.timestamp')}</TableCell>
                  <TableCell>{t('vnf.severity')}</TableCell>
                  <TableCell>{t('vnf.message')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs
                  .filter(log => !logFilters.severity || log.severity === logFilters.severity)
                  .map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={log.severity}
                          color={log.severity === 'error' ? 'error' : log.severity === 'warning' ? 'warning' : 'default'}
                        />
                      </TableCell>
                      <TableCell>{log.message}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogsDialog(false)}>{t('vnf.close')}</Button>
        </DialogActions>
      </Dialog>

      {/* Optimization Dialog */}
      <Dialog open={optimizationDialog} onClose={() => setOptimizationDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('vnf.resourceOptimization')}</DialogTitle>
        <DialogContent>
          <List>
            {optimizationSuggestions.map((suggestion, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <OptimizeIcon color={suggestion.impact === 'high' ? 'error' : 'warning'} />
                </ListItemIcon>
                <ListItemText
                  primary={suggestion.message}
                  secondary={`${t('vnf.impact')}: ${suggestion.impact}`}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    // Handle optimization action
                    console.log(`${t('vnf.applyingOptimization')}: ${suggestion.action}`);
                  }}
                >
                  {t('vnf.apply')}
                </Button>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOptimizationDialog(false)}>{t('vnf.close')}</Button>
        </DialogActions>
      </Dialog>

      {/* Migration Dialog */}
      <Dialog open={migrationDialog} onClose={() => setMigrationDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('vnf.migrateVnf')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                {t('vnf.selectTargetNetworkSlice')}
              </Typography>
              {availableSlices.map((slice) => (
                <Paper
                  key={slice.id}
                  sx={{
                    p: 2,
                    mb: 1,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                  onClick={() => {
                    if (selectedVNF) {
                      handleMigrateVNF(selectedVNF.id, slice.id);
                      setMigrationDialog(false);
                    }
                  }}
                >
                  <Typography variant="subtitle2">{slice.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {t('vnf.type')}: {slice.type}
                  </Typography>
                </Paper>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMigrationDialog(false)}>{t('vnf.cancel')}</Button>
        </DialogActions>
      </Dialog>

      {/* VNF Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        maxWidth="md"
        fullWidth
        fullScreen={useMediaQuery(theme.breakpoints.down('sm'))}
      >
        <DialogTitle>
          {t('vnf.vnfDetails')} {selectedVNF?.name}
          <IconButton
            aria-label={t('vnf.close')}
            onClick={() => setOpenDetailsDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedVNF && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>{t('vnf.generalInfo')}</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary={t('vnf.id')} secondary={selectedVNF.id} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={t('vnf.type')} secondary={selectedVNF.type} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={t('vnf.status')} secondary={selectedVNF.status} />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary={t('vnf.created')} 
                        secondary={new Date(selectedVNF.created_at).toLocaleString()} 
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>{t('vnf.resources')}</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary={t('vnf.cpu')} secondary={`${selectedVNF.resources.cpu} cores`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={t('vnf.memory')} secondary={`${selectedVNF.resources.memory} MB`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={t('vnf.storage')} secondary={`${selectedVNF.resources.storage} GB`} />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>{t('vnf.configuration')}</Typography>
                  <pre style={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    padding: '10px', 
                    borderRadius: '4px',
                    overflow: 'auto',
                    maxHeight: '200px',
                    fontSize: '0.875rem',
                    whiteSpace: 'pre-wrap',
                    color: 'inherit',
                  }}>
                    {JSON.stringify(selectedVNF.config, null, 2)}
                  </pre>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>{t('vnf.health')}</Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Box mr={1}>
                      {selectedVNF.health.status === 'healthy' ? (
                        <CheckCircleIcon color="success" />
                      ) : selectedVNF.health.status === 'unknown' ? (
                        <HelpIcon color="warning" />
                      ) : (
                        <ErrorIcon color="error" />
                      )}
                    </Box>
                    <Typography>
                      {t('vnf.status')}: {selectedVNF.health.status}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {t('vnf.lastChecked')}: {new Date(selectedVNF.health.lastCheck).toLocaleString()}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>{t('vnf.performanceMetrics')}</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary={t('vnf.cpuUsage')} 
                        secondary={
                          <Box display="flex" alignItems="center">
                            <Box width="100%" mr={1}>
                              <LinearProgress 
                                variant="determinate" 
                                value={selectedVNF.metrics.cpu} 
                                color={selectedVNF.metrics.cpu > 80 ? "error" : "primary"}
                              />
                            </Box>
                            <Box minWidth={35}>
                              <Typography variant="body2" color="text.primary">
                                {`${selectedVNF.metrics.cpu}%`}
                              </Typography>
                            </Box>
                          </Box>
                        } 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary={t('vnf.memoryUsage')} 
                        secondary={
                          <Box display="flex" alignItems="center">
                            <Box width="100%" mr={1}>
                              <LinearProgress 
                                variant="determinate" 
                                value={selectedVNF.metrics.memory} 
                                color={selectedVNF.metrics.memory > 80 ? "error" : "primary"}
                              />
                            </Box>
                            <Box minWidth={35}>
                              <Typography variant="body2" color="text.primary">
                                {`${selectedVNF.metrics.memory}%`}
                              </Typography>
                            </Box>
                          </Box>
                        } 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary={t('vnf.networkUsage')} 
                        secondary={
                          <Box display="flex" alignItems="center">
                            <Box width="100%" mr={1}>
                              <LinearProgress 
                                variant="determinate" 
                                value={selectedVNF.metrics.network} 
                                color={selectedVNF.metrics.network > 80 ? "error" : "primary"}
                              />
                            </Box>
                            <Box minWidth={35}>
                              <Typography variant="body2" color="text.primary">
                                {`${selectedVNF.metrics.network}%`}
                              </Typography>
                            </Box>
                          </Box>
                        } 
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', p: 2 }}>
          <Box>
            <Button 
              onClick={() => handleVNFAction(selectedVNF.id, selectedVNF.status === 'running' ? 'stop' : 'start')}
              color={selectedVNF?.status === 'running' ? "error" : "success"}
              variant="contained"
              sx={{ mr: 1, mb: { xs: 1, sm: 0 } }}
            >
              {selectedVNF?.status === 'running' ? t('vnf.stop') : t('vnf.start')}
            </Button>
            <Button 
              onClick={() => handleVNFAction(selectedVNF.id, 'restart')}
              color="warning"
              variant="contained"
              disabled={selectedVNF?.status !== 'running'}
              sx={{ mr: 1, mb: { xs: 1, sm: 0 } }}
            >
              {t('vnf.restart')}
            </Button>
          </Box>
          <Button 
            onClick={() => setOpenDetailsDialog(false)}
            variant="outlined"
          >
            {t('vnf.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VNFManagement; 