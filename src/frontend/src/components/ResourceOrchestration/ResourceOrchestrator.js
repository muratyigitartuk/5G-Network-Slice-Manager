import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Tab,
  Tabs,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip
} from '@mui/material';
import {
  Memory as ResourceIcon,
  Speed as PerformanceIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Settings as SettingsIcon,
  Timeline as TimelineIcon,
  CloudQueue as CloudIcon,
  TrendingUp as TrendingIcon,
  Assessment as AnalyticsIcon,
  Alarm as AlertIcon,
  AttachMoney as CostIcon,
  SaveAlt as ExportIcon,
  Error as ErrorIcon,
  Gavel as GavelIcon,
  Security as SecurityIcon,
  History as AuditLogsIcon,
  AccountBalance as AccountBalanceIcon,
  Savings as SavingsIcon,
  MonetizationOn as MonetizationIcon,
  Inbox as InboxIcon,
  VerifiedUser as SecurityScanIcon
} from '@mui/icons-material';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { useTranslation } from 'react-i18next';

const ResourceOrchestrator = () => {
  const { t, i18n } = useTranslation();
  const roPrefix = 'resourceOrchestration'; // Translation prefix to make code cleaner
  const cmPrefix = `${roPrefix}.costManagement`; // Cost Management prefix
  const compPrefix = `${roPrefix}.compliance`; // Compliance prefix
  const anPrefix = `${roPrefix}.analytics`; // Analytics prefix
  const [resources, setResources] = useState([]);
  const [scheduledTasks, setScheduledTasks] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [resourceDialog, setResourceDialog] = useState(false);
  const [schedulerSettings, setSchedulerSettings] = useState({
    autoScale: true,
    loadBalancing: true,
    powerSaving: false,
    failoverEnabled: true
  });
  const [predictiveData, setPredictiveData] = useState({});
  const [plannerDialog, setPlannerDialog] = useState(false);
  const [allocationPlan, setAllocationPlan] = useState({
    startTime: '',
    endTime: '',
    resources: [],
    priority: 'medium',
    autoAdjust: true
  });
  const [complianceData, setComplianceData] = useState({});
  const [auditLogs] = useState([
    { 
      id: 1, 
      resource: 'ComputeCluster1', 
      action: 'securityScanPerformed', 
      timestamp: Date.now() - 3600000, 
      user: 'admin', 
      status: 'success' 
    },
    { 
      id: 2, 
      resource: 'ComputeCluster1', 
      action: 'complianceCheckCompleted', 
      timestamp: Date.now() - 7200000, 
      user: 'system', 
      status: 'success' 
    },
    { 
      id: 3, 
      resource: 'NetworkPoolA', 
      action: 'securityConfigUpdated', 
      timestamp: Date.now() - 86400000, 
      user: 'admin', 
      status: 'success' 
    },
    { 
      id: 4, 
      resource: 'NetworkPoolA', 
      action: 'firewallRuleUpdate', 
      timestamp: Date.now() - 172800000, 
      user: 'operator', 
      status: 'warning' 
    }
  ]);
  const [resourceCostData, setResourceCostData] = useState({});

  // Define fetch functions outside of useEffect to avoid dependency warning
  const fetchResources = () => {
    // Simulate API call
    setResources([
      {
        id: 1,
        name: 'Compute Cluster 1',
        type: 'compute',
        status: 'healthy',
        utilization: 75,
        capacity: {
          cpu: 80,
          memory: 65,
          storage: 45
        },
        allocated: {
          slices: ['IoT Slice', 'Video Streaming'],
          vnfs: ['Firewall', 'Load Balancer']
        }
      },
      {
        id: 2,
        name: 'Network Pool A',
        type: 'network',
        status: 'warning',
        utilization: 85,
        capacity: {
          bandwidth: 90,
          latency: 15,
          packets: 70
        },
        allocated: {
          slices: ['Gaming Slice'],
          vnfs: ['Traffic Analyzer']
        }
      },
      {
        id: 3,
        name: 'Storage Array 1',
        type: 'storage',
        status: 'healthy',
        utilization: 55,
        capacity: {
          total: 65,
          available: 35,
          iops: 60
        },
        allocated: {
          slices: ['Video Streaming'],
          vnfs: ['Content Cache']
        }
      }
    ]);
  };

  const fetchScheduledTasks = () => {
    // Simulate API call
    setScheduledTasks([
      {
        id: 1,
        type: 'scaling',
        resource: 'Compute Cluster 1',
        action: 'Scale up',
        scheduledFor: new Date(Date.now() + 3600000).toISOString(),
        status: 'pending'
      },
      {
        id: 2,
        type: 'migration',
        resource: 'Network Pool A',
        action: 'Load balance',
        scheduledFor: new Date(Date.now() + 1800000).toISOString(),
        status: 'in-progress'
      },
      {
        id: 3,
        type: 'optimization',
        resource: 'Storage Array 1',
        action: 'Defragment',
        scheduledFor: new Date(Date.now() + 7200000).toISOString(),
        status: 'pending'
      }
    ]);
  };

  const fetchPredictiveData = () => {
    // Simulate API call for predictive analytics
    setPredictiveData({
      [t(`${roPrefix}.resourceNames.ComputeCluster1`)]: {
        predictedUtilization: [
          { time: '1', value: 80 },
          { time: '2', value: 85 },
          { time: '3', value: 90 }
        ],
        recommendations: [
          'Consider scaling up in next 2 hours',
          'Optimize workload distribution'
        ],
        risks: [
          'High CPU utilization expected',
          'Memory pressure increasing'
        ]
      },
      [t(`${roPrefix}.resourceNames.NetworkPoolA`)]: {
        predictedUtilization: [
          { time: '1', value: 75 },
          { time: '2', value: 70 },
          { time: '3', value: 65 }
        ],
        recommendations: [
          'Monitor bandwidth usage',
          'Consider load balancing'
        ],
        risks: [
          'Potential latency spikes',
          'Bandwidth bottleneck possible'
        ]
      }
    });
  };

  const fetchCostData = () => {
    // Placeholder function for useEffect
  };

  const fetchBackupStatus = () => {
    // Placeholder function for useEffect
  };

  const fetchComplianceData = () => {
    // Simulate API call
    setComplianceData({
      'ComputeCluster1': {
        status: t(`${roPrefix}.status.compliant`),
        score: 92,
        policies: [
          { name: 'dataProtection', status: 'compliant' },
          { name: 'resourceIsolation', status: 'compliant' }
        ],
        certifications: ['ISO27001', 'GDPR'],
        violations: [],
        regulatoryRequirements: [
          { 
            name: 'dataResidency', 
            description: 'dataResidencyDesc', 
            status: 'compliant' 
          },
          { 
            name: 'encryptionStandards', 
            description: 'encryptionStandardsDesc', 
            status: 'compliant' 
          }
        ],
        securityAssessments: {
          dataPrivacy: t(`${compPrefix}.security.computePrivacyDesc`),
          accessControl: t(`${compPrefix}.security.computeAccessDesc`)
        },
        vulnerabilities: []
      },
      'NetworkPoolA': {
        status: t(`${roPrefix}.status.partiallyCompliant`),
        score: 78,
        policies: [
          { name: 'networkSegmentation', status: 'compliant' },
          { name: 'trafficEncryption', status: 'partiallyCompliant' }
        ],
        certifications: ['ISO27001'],
        violations: [
          { 
            policy: 'trafficEncryption', 
            details: 'outdatedEncryptionDesc', 
            severity: 'medium' 
          }
        ],
        regulatoryRequirements: [
          { 
            name: 'trafficMonitoring', 
            description: 'trafficMonitoringDesc', 
            status: 'compliant' 
          },
          { 
            name: 'intrusionDetection', 
            description: 'intrusionDetectionDesc', 
            status: 'partiallyCompliant' 
          }
        ],
        securityAssessments: {
          dataPrivacy: t(`${compPrefix}.security.networkPrivacyDesc`),
          accessControl: t(`${compPrefix}.security.networkAccessDesc`)
        },
        vulnerabilities: [
          { 
            name: 'outdatedTls', 
            details: 'outdatedTlsDesc', 
            severity: 'medium' 
          }
        ]
      }
    });
  };

  const fetchResourceCostData = () => {
    // Simulate API call
    setResourceCostData({
      'ComputeCluster1': {
        totalCost: 1250.50,
        forecastedExpense: 1500.75,
        costBreakdown: {
          compute: 800.25,
          storage: 300.15,
          network: 150.10
        },
        billingCycle: 'monthly',
        budgetStatus: 'underBudget',
        optimizationScore: 85,
        savingsOpportunities: [
          { 
            titleKey: 'energyEfficiency', 
            descriptionKey: 'energyEfficiencyDesc', 
            potentialSavings: 100 
          },
          { 
            titleKey: 'resourceConsolidation', 
            descriptionKey: 'resourceConsolidationDesc', 
            potentialSavings: 150 
          }
        ],
        unusedResources: [
          { name: 'IoTSlice', details: 'workloadStatus', monthlyCost: 0 },
          { name: 'VideoStreaming', details: 'workloadStatus', monthlyCost: 0 }
        ]
      },
      'NetworkPoolA': {
        totalCost: 850.25,
        forecastedExpense: 900.50,
        costBreakdown: {
          bandwidth: 500.25,
          services: 350.00
        },
        billingCycle: 'monthly',
        budgetStatus: 'underBudget',
        optimizationScore: 90,
        savingsOpportunities: [
          { 
            titleKey: 'trafficOptimization', 
            descriptionKey: 'trafficOptimizationDesc', 
            potentialSavings: 100 
          },
          { 
            titleKey: 'serviceConsolidation', 
            descriptionKey: 'serviceConsolidationDesc', 
            potentialSavings: 150 
          }
        ],
        unusedResources: [
          { name: 'GamingSlice', details: 'workloadStatus', monthlyCost: 0 },
          { name: 'TrafficAnalyzer', details: 'workloadStatus', monthlyCost: 0 }
        ]
      }
    });
  };

  useEffect(() => {
    fetchResources();
    fetchScheduledTasks();
    fetchPredictiveData();
    fetchCostData();
    fetchBackupStatus();
    fetchComplianceData();
    fetchResourceCostData();

    const interval = setInterval(() => {
      fetchResources();
      fetchScheduledTasks();
    }, 10000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSettingChange = (setting) => {
    setSchedulerSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <SuccessIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      default:
        return <WarningIcon color="error" />;
    }
  };

  const handleResourceAction = (resourceId, action) => {
    console.log(`Executing ${action} on resource ${resourceId}`);
    // Here we would make API calls to execute the action
  };

  const handlePlannerSubmit = () => {
    console.log('Submitting resource allocation plan:', allocationPlan);
    setPlannerDialog(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">{t(`${roPrefix}.title`)}</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ScheduleIcon />}
            onClick={() => setPlannerDialog(true)}
            sx={{ mr: 2 }}
          >
            {t(`${roPrefix}.resourcePlanner`)}
          </Button>
          <Button
            variant="contained"
            startIcon={<SettingsIcon />}
            onClick={() => setResourceDialog(true)}
          >
            {t(`${roPrefix}.orchestrationSettings`)}
          </Button>
        </Box>
      </Box>

      <Tabs
        value={currentTab}
        onChange={(e, newValue) => setCurrentTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label={t(`${roPrefix}.tabs.resourceOverview`)} icon={<ResourceIcon />} />
        <Tab label={t(`${roPrefix}.tabs.scheduledTasks`)} icon={<ScheduleIcon />} />
        <Tab label={t(`${roPrefix}.tabs.performance`)} icon={<PerformanceIcon />} />
        <Tab label={t(`${roPrefix}.tabs.analytics`)} icon={<AnalyticsIcon />} />
        <Tab label={t(`${roPrefix}.tabs.costManagement`)} icon={<CostIcon />} />
        <Tab label={t(`${roPrefix}.tabs.compliance`)} icon={<SecurityIcon />} />
      </Tabs>

      {currentTab === 0 && (
        <Grid container spacing={2}>
          {resources.map(resource => (
            <Grid item xs={4} key={resource.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">{resource.name}</Typography>
                    {getStatusIcon(resource.status)}
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {t(`${roPrefix}.type`)}: {t(`${roPrefix}.resourceTypes.${resource.type}`)}
                  </Typography>

                  <Box sx={{ my: 2 }}>
                    <Typography variant="body2">{t(`${roPrefix}.utilization`)}</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={resource.utilization}
                      color={resource.utilization > 80 ? "error" : resource.utilization > 60 ? "warning" : "success"}
                      sx={{ mt: 1 }}
                    />
                    <Typography variant="body2" sx={{ mt: 0.5, color: 'text.primary', fontSize: '0.8rem', textAlign: 'right' }}>
                      {resource.utilization}%
                    </Typography>
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>{t(`${roPrefix}.capacity`)}</Typography>
                  {Object.entries(resource.capacity).map(([key, value]) => (
                    <Box key={key} sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.primary">
                        {key === 'cpu' ? 'CPU' : 
                         key === 'memory' ? t(`${roPrefix}.capacityTypes.memory`) : 
                         key === 'storage' ? t(`${roPrefix}.capacityTypes.storage`) : 
                         key === 'bandwidth' ? t(`${roPrefix}.capacityTypes.bandwidth`) : 
                         key === 'latency' ? t(`${roPrefix}.capacityTypes.latency`) : 
                         key === 'packets' ? t(`${roPrefix}.capacityTypes.packets`) : 
                         key === 'total' ? t(`${roPrefix}.capacityTypes.total`) : 
                         key === 'available' ? t(`${roPrefix}.capacityTypes.available`) : 
                         key === 'iops' ? t(`${roPrefix}.capacityTypes.iops`) : 
                         key}: {value}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={value}
                        color={value > 80 ? "error" : value > 60 ? "warning" : "success"}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  ))}

                  <Typography variant="subtitle2" sx={{ mt: 2 }}>{t(`${roPrefix}.allocatedResources`)}</Typography>
                  <Typography variant="body2">
                    {t(`${roPrefix}.slices`)}: {resource.allocated.slices.join(', ')}
                  </Typography>
                  <Typography variant="body2">
                    {t(`${roPrefix}.vnfs`)}: {resource.allocated.vnfs.join(', ')}
                  </Typography>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      size="small"
                      startIcon={<TimelineIcon />}
                      onClick={() => handleResourceAction(resource.id, 'optimize')}
                    >
                      {t(`${roPrefix}.optimize`)}
                    </Button>
                    <Button
                      size="small"
                      startIcon={<CloudIcon />}
                      onClick={() => handleResourceAction(resource.id, 'scale')}
                    >
                      {t(`${roPrefix}.scale`)}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {currentTab === 1 && (
        <Paper sx={{ p: 2 }}>
          <List>
            {scheduledTasks.map(task => (
              <ListItem key={task.id}>
                <ListItemIcon>
                  <ScheduleIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`${task.action} - ${t(`${roPrefix}.resourceNames.${task.resource.replace(/\s+/g, '')}`)}`}
                  secondary={`${t(`${roPrefix}.scheduledFor`)}: ${new Date(task.scheduledFor).toLocaleString()}`}
                />
                <Chip
                  label={t(`${roPrefix}.status.${task.status}`)}
                  color={task.status === 'pending' ? 'primary' : 'warning'}
                  size="small"
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {currentTab === 2 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>{t(`${roPrefix}.performanceMetrics`)}</Typography>
          {resources.map(resource => (
            <Box key={resource.id} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>{resource.name}</Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2">{t(`${roPrefix}.resourceUtilization`)}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Paper>
      )}

      {currentTab === 3 && (
        <Grid container spacing={3}>
          {Object.entries(predictiveData).map(([resource, data]) => (
            <Grid item xs={12} key={resource}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>{resource}</Typography>
                
                {/* Predicted Utilization */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {t(`${anPrefix}.predictedUtilization`)}
                  </Typography>
                  <Grid container spacing={2}>
                    {data.predictedUtilization.map((point) => (
                      <Grid item xs={4} key={point.time}>
                        <Card>
                          <CardContent>
                            <Typography variant="subtitle2">
                              {t(`${anPrefix}.in`)} {point.time}{i18n.language === 'de' ? ' Std.' : 'h'}
                            </Typography>
                            <Typography variant="h4">
                              {point.value}%
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={point.value}
                              color={point.value > 80 ? "error" : "primary"}
                              sx={{ mt: 1 }}
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Recommendations and Risks */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      <TrendingIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                      {t(`${anPrefix}.recommendations`)}
                    </Typography>
                    <List>
                      {data.recommendations.map((rec, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckCircle color="success" />
                          </ListItemIcon>
                          <ListItemText primary={t(`${anPrefix}.recommendationItems.${rec}`, rec)} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      <AlertIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                      {t(`${anPrefix}.potentialRisks`)}
                    </Typography>
                    <List>
                      {data.risks.map((risk, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <WarningIcon color="warning" />
                          </ListItemIcon>
                          <ListItemText primary={t(`${anPrefix}.riskItems.${risk}`, risk)} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>

                {/* Action Buttons */}
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<TimelineIcon />}
                    onClick={() => handleResourceAction(resource, 'analyze')}
                  >
                    {t(`${anPrefix}.detailedAnalysis`)}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<CloudIcon />}
                    onClick={() => handleResourceAction(resource, 'autoOptimize')}
                  >
                    {t(`${anPrefix}.autoOptimize`)}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {currentTab === 4 && (
        <Box>
          {/* Compliance Overview */}
          <Grid container spacing={3}>
            {Object.entries(complianceData).map(([resourceKey, data]) => (
              <Grid item xs={12} key={resourceKey}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">{t(`${roPrefix}.resourceNames.${resourceKey}`)}</Typography>
                    <Box>
                      <Button
                        startIcon={<SecurityScanIcon />}
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => console.log('Run security scan')}
                      >
                        {t(`${compPrefix}.securityScan`)}
                      </Button>
                      <Button
                        startIcon={<GavelIcon />}
                        size="small"
                        onClick={() => console.log('Run compliance check')}
                      >
                        {t(`${compPrefix}.complianceCheck`)}
                      </Button>
                    </Box>
                  </Box>

                  {/* Compliance Score */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {t(`${compPrefix}.complianceScore`)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h4" sx={{ mr: 2 }}>
                        {data.score}/100
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={data.score}
                        color={data.score > 80 ? "success" : data.score > 60 ? "warning" : "error"}
                        sx={{ flexGrow: 1, height: 10, borderRadius: 5 }}
                      />
                    </Box>
                  </Box>

                  {/* Security Assessment */}
                  <Typography variant="subtitle1" gutterBottom>
                    <SecurityIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                    {t(`${compPrefix}.securityAssessmentTitle`)}
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom>
                            {t(`${compPrefix}.dataPrivacy`)}
                          </Typography>
                          <Typography variant="body2">
                            {data.securityAssessments?.dataPrivacy || t(`${compPrefix}.security.defaultDataPrivacy`)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom>
                            {t(`${compPrefix}.accessControl`)}
                          </Typography>
                          <Typography variant="body2">
                            {data.securityAssessments?.accessControl || t(`${compPrefix}.security.defaultAccessControl`)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Regulatory Requirements */}
                  {data.regulatoryRequirements && data.regulatoryRequirements.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        <GavelIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                        {t(`${compPrefix}.requirementsTitle`)}
                      </Typography>
                      <Grid container spacing={2}>
                        {data.regulatoryRequirements.map((req, index) => (
                          <Grid item xs={4} key={index}>
                            <Card>
                              <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="subtitle2">
                                    {t(`${compPrefix}.requirements.${req.name}`)}
                                  </Typography>
                                  <Chip
                                    size="small"
                                    label={t(`${roPrefix}.status.${req.status}`)}
                                    color={req.status === 'compliant' ? 'success' : 'warning'}
                                  />
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  {t(`${compPrefix}.requirements.${req.description}`)}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  {/* Policy Compliance */}
                  <Typography variant="subtitle1" gutterBottom>
                    <SecurityIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                    {t(`${compPrefix}.policyCompliance`)}
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {data.policies.map((policy, index) => (
                      <Grid item xs={4} key={index}>
                        <Card>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2">
                                {t(`${compPrefix}.policies.${policy.name}`)}
                              </Typography>
                              <Chip
                                size="small"
                                label={t(`${roPrefix}.status.${policy.status}`)}
                                color={policy.status === 'compliant' || policy.status === 'passed' ? 'success' : 'warning'}
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Certifications */}
                  {data.certifications && data.certifications.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {t(`${compPrefix}.certifications.title`)}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {data.certifications.map((cert, idx) => (
                          <Chip 
                            key={idx} 
                            label={t(`${compPrefix}.certifications.${cert.toLowerCase()}`)} 
                            color="primary" 
                            variant="outlined" 
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Vulnerabilities */}
                  <Typography variant="subtitle1" gutterBottom>
                    <WarningIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                    {t(`${compPrefix}.vulnerabilities.title`)}
                  </Typography>
                  {data.vulnerabilities && data.vulnerabilities.length > 0 ? (
                    <List>
                      {data.vulnerabilities.map((vuln, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <ErrorIcon color={vuln.severity === 'high' ? 'error' : 'warning'} />
                          </ListItemIcon>
                          <ListItemText
                            primary={t(`${compPrefix}.vulnerabilities.${vuln.name}`)}
                            secondary={t(`${compPrefix}.vulnerabilities.${vuln.details}`)}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="success.main">
                      {t(`${compPrefix}.noVulnerabilities`)}
                    </Typography>
                  )}

                  {/* Violations */}
                  {data.violations.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" color="error" gutterBottom>
                        {t(`${compPrefix}.policyViolations`)}
                      </Typography>
                      <List>
                        {data.violations.map((violation, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <WarningIcon color="error" />
                            </ListItemIcon>
                            <ListItemText
                              primary={t(`${compPrefix}.policies.${violation.policy}`)}
                              secondary={t(`${compPrefix}.violations.${violation.details}`)}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {/* Audit Logs */}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      <AuditLogsIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                      {t(`${compPrefix}.auditLogs`)}
                    </Typography>
                    <List>
                      {auditLogs
                        .filter(log => log.resource === resourceKey)
                        .map(log => (
                          <ListItem key={log.id}>
                            <ListItemText
                              primary={t(`${compPrefix}.actions.${log.action}`)}
                              secondary={`${new Date(log.timestamp).toLocaleString()} - ${log.user}`}
                            />
                            <Chip
                              size="small"
                              label={t(`${roPrefix}.status.${log.status}`)}
                              color={log.status === 'success' ? 'success' : 'warning'}
                            />
                          </ListItem>
                        ))}
                    </List>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {currentTab === 5 && (
        <Box>
          {/* Cost Management Overview */}
          <Grid container spacing={3}>
            {Object.entries(resourceCostData).map(([resourceKey, data]) => (
              <Grid item xs={12} key={resourceKey}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">{t(`${roPrefix}.resourceNames.${resourceKey}`)}</Typography>
                    <Button
                      startIcon={<ExportIcon />}
                      size="small"
                      onClick={() => console.log('Export billing data')}
                    >
                      {t(`${cmPrefix}.exportBillingData`)}
                    </Button>
                  </Box>

                  {/* Cost Breakdown */}
                  <Typography variant="subtitle1" gutterBottom>
                    <CostIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                    {t(`${cmPrefix}.costBreakdown`)}
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {Object.entries(data.costBreakdown).map(([category, amount]) => (
                      <Grid item xs={4} key={category}>
                        <Card>
                          <CardContent>
                            <Typography variant="subtitle2">{t(`${cmPrefix}.categories.${category}`)}</Typography>
                            <Typography variant="h4">${amount}</Typography>
                            <LinearProgress
                              variant="determinate"
                              value={(amount / data.totalCost) * 100}
                              sx={{ mt: 1 }}
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Budget Tracking */}
                  <Typography variant="subtitle1" gutterBottom>
                    <AccountBalanceIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                    {t(`${cmPrefix}.budgetTracking`)}
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="subtitle2">
                            {t(`${cmPrefix}.billingCycle`)}: {t(`${cmPrefix}.cycles.${data.billingCycle}`)}
                          </Typography>
                          <Chip
                            label={t(`${cmPrefix}.status.${data.budgetStatus}`)}
                            color={data.budgetStatus === 'underBudget' ? 'success' : 'warning'}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ minWidth: 150 }}>
                            {t(`${cmPrefix}.forecastedExpenses`)}:
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            ${data.forecastedExpense}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ minWidth: 150 }}>
                            {t(`${cmPrefix}.optimizationScore`)}:
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {data.optimizationScore}/100
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>

                  {/* Savings Opportunities */}
                  <Typography variant="subtitle1" gutterBottom>
                    <SavingsIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                    {t(`${cmPrefix}.savingsOpportunities`)}
                  </Typography>
                  <List>
                    {data.savingsOpportunities.map((opportunity, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <MonetizationIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={t(`${cmPrefix}.savings.${opportunity.titleKey}`)}
                          secondary={t(`${cmPrefix}.savings.${opportunity.descriptionKey}`)}
                        />
                        <Typography variant="body1" color="success.main">
                          ${opportunity.potentialSavings}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>

                  {/* Unused Resources */}
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    <InboxIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                    {t(`${cmPrefix}.unusedResources`)}
                  </Typography>
                  <Grid container spacing={2}>
                    {data.unusedResources.map((item, index) => (
                      <Grid item xs={6} key={index}>
                        <Card>
                          <CardContent>
                            <Typography variant="subtitle2">{t(`${roPrefix}.resourceNames.${item.name}`)}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {t(`${cmPrefix}.resourceStatus.${item.details}`)}
                            </Typography>
                            <Typography variant="body1" color="error.main" sx={{ mt: 1 }}>
                              ${item.monthlyCost}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Resource Allocation Planner Dialog */}
      <Dialog
        open={plannerDialog}
        onClose={() => setPlannerDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{t(`${roPrefix}.planner.title`)}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={t(`${roPrefix}.planner.startTime`)}
                type="datetime-local"
                value={allocationPlan.startTime}
                onChange={(e) => setAllocationPlan(prev => ({
                  ...prev,
                  startTime: e.target.value
                }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={t(`${roPrefix}.planner.endTime`)}
                type="datetime-local"
                value={allocationPlan.endTime}
                onChange={(e) => setAllocationPlan(prev => ({
                  ...prev,
                  endTime: e.target.value
                }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                {t(`${roPrefix}.planner.resourceRequirements`)}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label={t(`${roPrefix}.planner.cpuCores`)}
                    type="number"
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label={t(`${roPrefix}.planner.memoryGB`)}
                    type="number"
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label={t(`${roPrefix}.planner.storageGB`)}
                    type="number"
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label={t(`${roPrefix}.planner.priority`)}
                value={allocationPlan.priority}
                onChange={(e) => setAllocationPlan(prev => ({
                  ...prev,
                  priority: e.target.value
                }))}
              >
                <MenuItem value="low">{t(`${roPrefix}.planner.priorities.low`)}</MenuItem>
                <MenuItem value="medium">{t(`${roPrefix}.planner.priorities.medium`)}</MenuItem>
                <MenuItem value="high">{t(`${roPrefix}.planner.priorities.high`)}</MenuItem>
                <MenuItem value="critical">{t(`${roPrefix}.planner.priorities.critical`)}</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={allocationPlan.autoAdjust}
                    onChange={(e) => setAllocationPlan(prev => ({
                      ...prev,
                      autoAdjust: e.target.checked
                    }))}
                  />
                }
                label={t(`${roPrefix}.planner.autoAdjust`)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                {t(`${roPrefix}.planner.optimizationGoals`)}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label={t(`${roPrefix}.planner.goals.minimizeCost`)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label={t(`${roPrefix}.planner.goals.maximizePerformance`)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={<Switch />}
                    label={t(`${roPrefix}.planner.goals.energyEfficiency`)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label={t(`${roPrefix}.planner.goals.highAvailability`)}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPlannerDialog(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handlePlannerSubmit}>
            {t(`${roPrefix}.planner.createPlan`)}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog 
        open={resourceDialog} 
        onClose={() => setResourceDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t(`${roPrefix}.orchestrationSettings`)}</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemText
                primary={t(`${roPrefix}.settings.autoScaling`)}
                secondary={t(`${roPrefix}.settings.autoScalingDesc`)}
              />
              <Switch
                edge="end"
                checked={schedulerSettings.autoScale}
                onChange={() => handleSettingChange('autoScale')}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t(`${roPrefix}.settings.loadBalancing`)}
                secondary={t(`${roPrefix}.settings.loadBalancingDesc`)}
              />
              <Switch
                edge="end"
                checked={schedulerSettings.loadBalancing}
                onChange={() => handleSettingChange('loadBalancing')}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t(`${roPrefix}.settings.powerSaving`)}
                secondary={t(`${roPrefix}.settings.powerSavingDesc`)}
              />
              <Switch
                edge="end"
                checked={schedulerSettings.powerSaving}
                onChange={() => handleSettingChange('powerSaving')}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t(`${roPrefix}.settings.failoverProtection`)}
                secondary={t(`${roPrefix}.settings.failoverProtectionDesc`)}
              />
              <Switch
                edge="end"
                checked={schedulerSettings.failoverEnabled}
                onChange={() => handleSettingChange('failoverEnabled')}
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResourceDialog(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={() => setResourceDialog(false)}>
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResourceOrchestrator; 