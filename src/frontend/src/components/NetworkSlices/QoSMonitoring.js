import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Alert,
  AlertTitle,
  Slider,
  Switch,
  FormControlLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  PlayArrow as AutomateIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const QoSMonitoring = () => {
  const [thresholds, setThresholds] = useState({
    bandwidth: 80, // % of allocated
    latency: 120, // % of target
    reliability: 95 // minimum %
  });

  const [alerts, setAlerts] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [autoAlert, setAutoAlert] = useState(true);
  const [customMetrics, setCustomMetrics] = useState([]);
  const [customMetricDialog, setCustomMetricDialog] = useState(false);
  const [newMetric, setNewMetric] = useState({
    name: '',
    unit: '',
    formula: '',
    thresholds: { warning: 80, critical: 90 }
  });
  const [automatedActions, setAutomatedActions] = useState([]);
  const [actionDialog, setActionDialog] = useState(false);
  const [newAction, setNewAction] = useState({
    metric: '',
    condition: 'above',
    threshold: 80,
    action: 'notify',
    parameters: {}
  });
  const [timeRange, setTimeRange] = useState('1h');
  const [customTimeRange, setCustomTimeRange] = useState({
    start: new Date(Date.now() - 3600000),
    end: new Date()
  });
  const [compareMode, setCompareMode] = useState(false);
  const [comparisonRange, setComparisonRange] = useState({
    start: new Date(Date.now() - 7200000),
    end: new Date(Date.now() - 3600000)
  });

  const timeRanges = [
    { value: '1h', label: 'Last Hour' },
    { value: '6h', label: 'Last 6 Hours' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const actionTypes = [
    { value: 'notify', label: 'Send Notification' },
    { value: 'scale', label: 'Scale Resources' },
    { value: 'restart', label: 'Restart VNF' },
    { value: 'webhook', label: 'Call Webhook' }
  ];

  const generateMetrics = useCallback(() => {
    const now = new Date();
    return {
      timestamp: now.toLocaleTimeString(),
      bandwidth: Math.random() * 100,
      latency: Math.random() * 150,
      reliability: 90 + Math.random() * 10,
      violations: []
    };
  }, []);

  const generateCustomMetrics = useCallback(() => {
    const metrics = {};
    customMetrics.forEach(metric => {
      // Simple random value generation - in real app would use the formula
      metrics[metric.name] = Math.random() * 100;
    });
    return metrics;
  }, [customMetrics]);

  const updateHistoricalData = useCallback((newData) => {
    setHistoricalData(prev => [...prev.slice(-20), newData]);
  }, []);

  const checkThresholds = useCallback((metrics) => {
    if (!autoAlert) return;

    const violations = [];
    if (metrics.bandwidth > thresholds.bandwidth) {
      violations.push('Bandwidth usage exceeded threshold');
    }
    if (metrics.latency > thresholds.latency) {
      violations.push('Latency exceeded target');
    }
    if (metrics.reliability < thresholds.reliability) {
      violations.push('Reliability below minimum threshold');
    }

    if (violations.length > 0) {
      setAlerts(prev => [{
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        message: violations.join(', '),
        severity: violations.length > 1 ? 'error' : 'warning'
      }, ...prev.slice(0, 9)]);
    }
  }, [autoAlert, thresholds]);

  const checkCustomThresholds = useCallback((metrics) => {
    if (!metrics || !customMetrics.length || !autoAlert) return;
    
    customMetrics.forEach(customMetric => {
      const value = metrics[customMetric.name];
      if (!value) return;
      
      // Check if the value exceeds the threshold
      const threshold = parseFloat(customMetric.thresholds[customMetric.condition]);
      const exceeds = customMetric.condition === '>' 
        ? value > threshold
        : value < threshold;
      
      if (exceeds) {
        setAlerts(prev => [
          ...prev.slice(0, 9),
          {
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            message: `Custom metric "${customMetric.name}" ${customMetric.condition} ${threshold}`,
            severity: 'warning'
          }
        ]);
      }
    });
  }, [customMetrics, autoAlert]);

  useEffect(() => {
    // Simulate real-time monitoring
    const interval = setInterval(() => {
      const newDataPoint = generateMetrics();
      updateHistoricalData(newDataPoint);
      checkThresholds(newDataPoint);
    }, 5000);

    // Add custom metrics monitoring
    const customMetricsInterval = setInterval(() => {
      const newDataPoint = generateCustomMetrics();
      updateHistoricalData(newDataPoint);
      checkCustomThresholds(newDataPoint);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(customMetricsInterval);
    };
  }, [
    generateMetrics,
    updateHistoricalData,
    checkThresholds,
    generateCustomMetrics,
    checkCustomThresholds
  ]);

  const handleAddCustomMetric = () => {
    setCustomMetrics([...customMetrics, newMetric]);
    setCustomMetricDialog(false);
    setNewMetric({
      name: '',
      unit: '',
      formula: '',
      thresholds: { warning: 80, critical: 90 }
    });
  };

  const handleAddAutomatedAction = () => {
    setAutomatedActions([...automatedActions, newAction]);
    setActionDialog(false);
    setNewAction({
      metric: '',
      condition: 'above',
      threshold: 80,
      action: 'notify',
      parameters: {}
    });
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Current Alerts */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" component="h2">
                Active Alerts
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoAlert}
                    onChange={(e) => setAutoAlert(e.target.checked)}
                  />
                }
                label="Automatic Alerts"
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {alerts.map(alert => (
                <Alert 
                  key={alert.id} 
                  severity={alert.severity}
                  onClose={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
                >
                  <AlertTitle>{alert.timestamp}</AlertTitle>
                  {alert.message}
                </Alert>
              ))}
              {alerts.length === 0 && (
                <Typography color="textSecondary" align="center">
                  No active alerts
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Time Range Selection */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Time Range</Typography>
              <Stack direction="row" spacing={2}>
                <TextField
                  select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  size="small"
                >
                  {timeRanges.map(range => (
                    <MenuItem key={range.value} value={range.value}>
                      {range.label}
                    </MenuItem>
                  ))}
                </TextField>
                <FormControlLabel
                  control={
                    <Switch
                      checked={compareMode}
                      onChange={(e) => setCompareMode(e.target.checked)}
                    />
                  }
                  label="Compare"
                />
              </Stack>
            </Box>
            {timeRange === 'custom' && (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack direction="row" spacing={2}>
                  <DateTimePicker
                    label="Start Time"
                    value={customTimeRange.start}
                    onChange={(date) => setCustomTimeRange({ ...customTimeRange, start: date })}
                  />
                  <DateTimePicker
                    label="End Time"
                    value={customTimeRange.end}
                    onChange={(date) => setCustomTimeRange({ ...customTimeRange, end: date })}
                  />
                </Stack>
              </LocalizationProvider>
            )}
          </Paper>
        </Grid>

        {/* Custom Metrics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Custom Metrics</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => setCustomMetricDialog(true)}
              >
                Add Metric
              </Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Formula</TableCell>
                    <TableCell>Warning</TableCell>
                    <TableCell>Critical</TableCell>
                    <TableCell>Current</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customMetrics.map((metric) => (
                    <TableRow key={metric.name}>
                      <TableCell>{metric.name}</TableCell>
                      <TableCell>{metric.unit}</TableCell>
                      <TableCell>{metric.formula}</TableCell>
                      <TableCell>{metric.thresholds.warning}</TableCell>
                      <TableCell>{metric.thresholds.critical}</TableCell>
                      <TableCell>
                        {historicalData[historicalData.length - 1]?.[metric.name]?.toFixed(2) || 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Automated Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Automated Actions</Typography>
              <Button
                startIcon={<AutomateIcon />}
                onClick={() => setActionDialog(true)}
              >
                Add Action
              </Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Metric</TableCell>
                    <TableCell>Condition</TableCell>
                    <TableCell>Threshold</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {automatedActions.map((action, index) => (
                    <TableRow key={index}>
                      <TableCell>{action.metric}</TableCell>
                      <TableCell>{action.condition}</TableCell>
                      <TableCell>{action.threshold}</TableCell>
                      <TableCell>{action.action}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label="Active"
                          color="success"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Real-time Metrics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Real-time QoS Metrics
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <ChartTooltip />
                  <ReferenceLine y={thresholds.bandwidth} stroke="red" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="bandwidth" name="Bandwidth %" stroke="#8884d8" />
                  <Line type="monotone" dataKey="latency" name="Latency %" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="reliability" name="Reliability %" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Threshold Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Alert Thresholds
            </Typography>
            <Box sx={{ px: 2 }}>
              <Typography gutterBottom>Bandwidth Usage Threshold (%)</Typography>
              <Slider
                value={thresholds.bandwidth}
                onChange={(_, value) => setThresholds(prev => ({ ...prev, bandwidth: value }))}
                valueLabelDisplay="auto"
                min={0}
                max={100}
              />
              <Typography gutterBottom>Latency Threshold (%)</Typography>
              <Slider
                value={thresholds.latency}
                onChange={(_, value) => setThresholds(prev => ({ ...prev, latency: value }))}
                valueLabelDisplay="auto"
                min={0}
                max={200}
              />
              <Typography gutterBottom>Reliability Threshold (%)</Typography>
              <Slider
                value={thresholds.reliability}
                onChange={(_, value) => setThresholds(prev => ({ ...prev, reliability: value }))}
                valueLabelDisplay="auto"
                min={80}
                max={100}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Historical Violations */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              QoS Violations History
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Metric</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Threshold</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historicalData
                    .filter(data => 
                      data.bandwidth > thresholds.bandwidth ||
                      data.latency > thresholds.latency ||
                      data.reliability < thresholds.reliability
                    )
                    .map((violation, index) => (
                      <TableRow key={index}>
                        <TableCell>{violation.timestamp}</TableCell>
                        <TableCell>
                          {violation.bandwidth > thresholds.bandwidth ? 'Bandwidth' :
                           violation.latency > thresholds.latency ? 'Latency' : 'Reliability'}
                        </TableCell>
                        <TableCell>
                          {violation.bandwidth > thresholds.bandwidth ? `${violation.bandwidth.toFixed(1)}%` :
                           violation.latency > thresholds.latency ? `${violation.latency.toFixed(1)}ms` :
                           `${violation.reliability.toFixed(1)}%`}
                        </TableCell>
                        <TableCell>
                          {violation.bandwidth > thresholds.bandwidth ? `${thresholds.bandwidth}%` :
                           violation.latency > thresholds.latency ? `${thresholds.latency}ms` :
                           `${thresholds.reliability}%`}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <ChartTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="bandwidth" name="Bandwidth %" stroke="#8884d8" />
                  <Line type="monotone" dataKey="latency" name="Latency %" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="reliability" name="Reliability %" stroke="#ffc658" />
                  {compareMode && (
                    <>
                      <Line type="monotone" dataKey="bandwidth_prev" name="Previous Bandwidth %" stroke="#8884d8" strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="latency_prev" name="Previous Latency %" stroke="#82ca9d" strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="reliability_prev" name="Previous Reliability %" stroke="#ffc658" strokeDasharray="5 5" />
                    </>
                  )}
                  {customMetrics.map((metric, index) => (
                    <Line
                      key={metric.name}
                      type="monotone"
                      dataKey={metric.name}
                      name={`${metric.name} (${metric.unit})`}
                      stroke={`hsl(${index * 45}, 70%, 50%)`}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Custom Metric Dialog */}
      <Dialog open={customMetricDialog} onClose={() => setCustomMetricDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Custom Metric</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Metric Name"
                value={newMetric.name}
                onChange={(e) => setNewMetric({ ...newMetric, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Unit"
                value={newMetric.unit}
                onChange={(e) => setNewMetric({ ...newMetric, unit: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Formula"
                value={newMetric.formula}
                onChange={(e) => setNewMetric({ ...newMetric, formula: e.target.value })}
                helperText="Enter a formula using available metrics (e.g., bandwidth * 2 + latency)"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Warning Threshold"
                value={newMetric.thresholds.warning}
                onChange={(e) => setNewMetric({
                  ...newMetric,
                  thresholds: { ...newMetric.thresholds, warning: Number(e.target.value) }
                })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Critical Threshold"
                value={newMetric.thresholds.critical}
                onChange={(e) => setNewMetric({
                  ...newMetric,
                  thresholds: { ...newMetric.thresholds, critical: Number(e.target.value) }
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomMetricDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddCustomMetric}
            variant="contained"
            disabled={!newMetric.name || !newMetric.unit}
          >
            Add Metric
          </Button>
        </DialogActions>
      </Dialog>

      {/* Automated Action Dialog */}
      <Dialog open={actionDialog} onClose={() => setActionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Automated Action</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Metric"
                value={newAction.metric}
                onChange={(e) => setNewAction({ ...newAction, metric: e.target.value })}
              >
                <MenuItem value="bandwidth">Bandwidth</MenuItem>
                <MenuItem value="latency">Latency</MenuItem>
                <MenuItem value="reliability">Reliability</MenuItem>
                {customMetrics.map(metric => (
                  <MenuItem key={metric.name} value={metric.name}>
                    {metric.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Condition"
                value={newAction.condition}
                onChange={(e) => setNewAction({ ...newAction, condition: e.target.value })}
              >
                <MenuItem value="above">Above</MenuItem>
                <MenuItem value="below">Below</MenuItem>
                <MenuItem value="equals">Equals</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Threshold"
                value={newAction.threshold}
                onChange={(e) => setNewAction({ ...newAction, threshold: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Action"
                value={newAction.action}
                onChange={(e) => setNewAction({ ...newAction, action: e.target.value })}
              >
                {actionTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {newAction.action === 'webhook' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Webhook URL"
                  value={newAction.parameters.url || ''}
                  onChange={(e) => setNewAction({
                    ...newAction,
                    parameters: { ...newAction.parameters, url: e.target.value }
                  })}
                />
              </Grid>
            )}
            {newAction.action === 'scale' && (
              <>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    select
                    label="Resource"
                    value={newAction.parameters.resource || ''}
                    onChange={(e) => setNewAction({
                      ...newAction,
                      parameters: { ...newAction.parameters, resource: e.target.value }
                    })}
                  >
                    <MenuItem value="cpu">CPU</MenuItem>
                    <MenuItem value="memory">Memory</MenuItem>
                    <MenuItem value="bandwidth">Bandwidth</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Scale Amount"
                    value={newAction.parameters.amount || ''}
                    onChange={(e) => setNewAction({
                      ...newAction,
                      parameters: { ...newAction.parameters, amount: Number(e.target.value) }
                    })}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddAutomatedAction}
            variant="contained"
            disabled={!newAction.metric || !newAction.action}
          >
            Add Action
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QoSMonitoring; 