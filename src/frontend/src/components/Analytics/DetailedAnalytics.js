import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Paper,
  Divider,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  Tooltip,
  CircularProgress,
  TextField,
  Chip,
  Stack
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as LineChartIcon,
  BubbleChart as BubbleChartIcon,
  FileDownload as DownloadIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon,
  DateRange as DateRangeIcon,
  FilterList as FilterIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useThemeMode } from '../Theme/ThemeProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, subDays, subMonths } from 'date-fns';

// Mock data generator
const generateMockData = (dataType, timeRange) => {
  const data = [];
  const now = new Date();
  let startDate;
  
  switch (timeRange) {
    case 'day':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 1);
      for (let i = 0; i < 24; i++) {
        const date = new Date(startDate);
        date.setHours(i);
        data.push({
          timestamp: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          value: Math.floor(Math.random() * 100)
        });
      }
      break;
    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        data.push({
          timestamp: date.toLocaleDateString([], { weekday: 'short' }),
          value: Math.floor(Math.random() * 100)
        });
      }
      break;
    case 'month':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
      for (let i = 0; i < 30; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        data.push({
          timestamp: date.toLocaleDateString([], { day: '2-digit', month: 'short' }),
          value: Math.floor(Math.random() * 100)
        });
      }
      break;
    case 'year':
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 12);
      for (let i = 0; i < 12; i++) {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + i);
        data.push({
          timestamp: date.toLocaleDateString([], { month: 'short' }),
          value: Math.floor(Math.random() * 100)
        });
      }
      break;
    default:
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        data.push({
          timestamp: date.toLocaleDateString([], { weekday: 'short' }),
          value: Math.floor(Math.random() * 100)
        });
      }
  }
  
  return data;
};

// Mock data for different chart types
const generateChartData = (chartType, timeRange) => {
  switch (chartType) {
    case 'bar':
      return {
        labels: generateMockData('bar', timeRange).map(item => item.timestamp),
        datasets: [
          {
            label: 'CPU Usage (%)',
            data: generateMockData('bar', timeRange).map(item => item.value),
            backgroundColor: '#1976d2'
          },
          {
            label: 'Memory Usage (%)',
            data: generateMockData('bar', timeRange).map(item => item.value),
            backgroundColor: '#dc004e'
          }
        ]
      };
    case 'line':
      return {
        labels: generateMockData('line', timeRange).map(item => item.timestamp),
        datasets: [
          {
            label: 'Network Traffic (Mbps)',
            data: generateMockData('line', timeRange).map(item => item.value),
            borderColor: '#1976d2',
            backgroundColor: 'rgba(25, 118, 210, 0.1)',
            fill: true
          },
          {
            label: 'Latency (ms)',
            data: generateMockData('line', timeRange).map(item => item.value / 10),
            borderColor: '#dc004e',
            backgroundColor: 'rgba(220, 0, 78, 0.1)',
            fill: true
          }
        ]
      };
    case 'pie':
      return {
        labels: ['Compute', 'Network', 'Storage', 'Other'],
        datasets: [
          {
            data: [
              Math.floor(Math.random() * 40) + 10,
              Math.floor(Math.random() * 30) + 10,
              Math.floor(Math.random() * 20) + 10,
              Math.floor(Math.random() * 10) + 5
            ],
            backgroundColor: [
              '#1976d2',
              '#dc004e',
              '#ff9800',
              '#4caf50'
            ]
          }
        ]
      };
    case 'bubble':
      const bubbleData = [];
      for (let i = 0; i < 20; i++) {
        bubbleData.push({
          x: Math.floor(Math.random() * 100),
          y: Math.floor(Math.random() * 100),
          r: Math.floor(Math.random() * 20) + 5
        });
      }
      return {
        datasets: [
          {
            label: 'Resource Allocation',
            data: bubbleData,
            backgroundColor: 'rgba(25, 118, 210, 0.6)'
          }
        ]
      };
    default:
      return {
        labels: generateMockData('bar', timeRange).map(item => item.timestamp),
        datasets: [
          {
            label: 'CPU Usage (%)',
            data: generateMockData('bar', timeRange).map(item => item.value),
            backgroundColor: '#1976d2'
          }
        ]
      };
  }
};

// Chart component (placeholder for actual chart library)
const ChartComponent = ({ chartType, data, height = 300 }) => {
  const { mode } = useThemeMode();
  const canvasRef = useRef(null);
  
  // In a real implementation, you would use a chart library like Chart.js or Recharts
  // This is just a placeholder to show how it would be structured
  
  return (
    <Box 
      sx={{ 
        height, 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
        borderRadius: 1,
        p: 2
      }}
    >
      <canvas ref={canvasRef} />
      <Typography color="text.secondary">
        {chartType === 'bar' && <BarChartIcon sx={{ fontSize: 60, opacity: 0.5 }} />}
        {chartType === 'line' && <LineChartIcon sx={{ fontSize: 60, opacity: 0.5 }} />}
        {chartType === 'pie' && <PieChartIcon sx={{ fontSize: 60, opacity: 0.5 }} />}
        {chartType === 'bubble' && <BubbleChartIcon sx={{ fontSize: 60, opacity: 0.5 }} />}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          Chart visualization would be rendered here using a library like Chart.js or Recharts.
          <br />
          Selected chart type: {chartType}
        </Box>
      </Typography>
    </Box>
  );
};

// Export menu component
const ExportMenu = ({ anchorEl, open, handleClose, handleExport }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem onClick={() => handleExport('pdf')}>
        <ListItemIcon>
          <DownloadIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Export as PDF</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => handleExport('csv')}>
        <ListItemIcon>
          <DownloadIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Export as CSV</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => handleExport('image')}>
        <ListItemIcon>
          <DownloadIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Export as Image</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => handleExport('print')}>
        <ListItemIcon>
          <PrintIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Print Report</ListItemText>
      </MenuItem>
    </Menu>
  );
};

// Filter component
const FilterPanel = ({ open, onClose, filters, setFilters, applyFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleApply = () => {
    setFilters(localFilters);
    applyFilters();
    onClose();
  };
  
  const handleReset = () => {
    const resetFilters = {
      resource: 'all',
      metric: 'all',
      threshold: ''
    };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
    applyFilters();
    onClose();
  };
  
  if (!open) return null;
  
  return (
    <Paper 
      sx={{ 
        position: 'absolute', 
        top: 0, 
        right: 0, 
        width: 300, 
        p: 2, 
        zIndex: 10,
        height: '100%',
        boxShadow: 3
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="resource-label">Resource Type</InputLabel>
          <Select
            labelId="resource-label"
            name="resource"
            value={localFilters.resource}
            onChange={handleChange}
            label="Resource Type"
          >
            <MenuItem value="all">All Resources</MenuItem>
            <MenuItem value="compute">Compute</MenuItem>
            <MenuItem value="network">Network</MenuItem>
            <MenuItem value="storage">Storage</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="metric-label">Metric</InputLabel>
          <Select
            labelId="metric-label"
            name="metric"
            value={localFilters.metric}
            onChange={handleChange}
            label="Metric"
          >
            <MenuItem value="all">All Metrics</MenuItem>
            <MenuItem value="cpu">CPU Usage</MenuItem>
            <MenuItem value="memory">Memory Usage</MenuItem>
            <MenuItem value="network">Network Traffic</MenuItem>
            <MenuItem value="storage">Storage Usage</MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          fullWidth
          label="Threshold Value"
          name="threshold"
          type="number"
          value={localFilters.threshold}
          onChange={handleChange}
          helperText="Filter values above this threshold"
        />
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="outlined" onClick={handleReset}>
          Reset
        </Button>
        <Button variant="contained" onClick={handleApply}>
          Apply Filters
        </Button>
      </Box>
    </Paper>
  );
};

// Main component
const DetailedAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState('bar');
  const [timeRange, setTimeRange] = useState('week');
  const [tabValue, setTabValue] = useState(0);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [customDateRange, setCustomDateRange] = useState([null, null]);
  const [filters, setFilters] = useState({
    resource: 'all',
    metric: 'all',
    threshold: ''
  });
  const [chartData, setChartData] = useState(generateChartData('bar', 'week'));
  const [dashboards, setDashboards] = useState([
    { id: 1, name: 'Resource Usage', default: true },
    { id: 2, name: 'Network Performance', default: false },
    { id: 3, name: 'Storage Analytics', default: false }
  ]);
  
  // Load chart data
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setChartData(generateChartData(chartType, timeRange));
      setLoading(false);
    }, 500);
  }, [chartType, timeRange, filters]);
  
  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };
  
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleExportClick = (event) => {
    setExportAnchorEl(event.currentTarget);
  };
  
  const handleExportClose = () => {
    setExportAnchorEl(null);
  };
  
  const handleExport = (format) => {
    // In a real app, this would trigger the actual export
    console.log(`Exporting in ${format} format`);
    handleExportClose();
    
    // Show success message or download the file
    alert(`Analytics data exported as ${format.toUpperCase()}`);
  };
  
  const handleFilterToggle = () => {
    setFilterOpen(!filterOpen);
  };
  
  const applyFilters = () => {
    // In a real app, this would apply the filters to the data
    console.log('Applying filters:', filters);
    // Refresh data
    setChartData(generateChartData(chartType, timeRange));
  };
  
  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setChartData(generateChartData(chartType, timeRange));
      setLoading(false);
    }, 500);
  };
  
  const handleAddDashboard = () => {
    const newDashboard = {
      id: dashboards.length + 1,
      name: `New Dashboard ${dashboards.length + 1}`,
      default: false
    };
    setDashboards([...dashboards, newDashboard]);
    setTabValue(dashboards.length);
  };
  
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Detailed Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Comprehensive analytics and reporting for network resources and performance
        </Typography>
      </Box>
      
      {/* Dashboard Tabs */}
      <Box sx={{ mb: 3, position: 'relative' }}>
        <Paper sx={{ borderRadius: 1 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            {dashboards.map((dashboard) => (
              <Tab 
                key={dashboard.id} 
                label={dashboard.name} 
                icon={dashboard.default ? <BarChartIcon /> : <LineChartIcon />} 
                iconPosition="start"
              />
            ))}
            <Tab 
              icon={<AddIcon />} 
              iconPosition="start" 
              label="Add Dashboard" 
              onClick={handleAddDashboard}
            />
          </Tabs>
          
          {/* Controls */}
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel id="chart-type-label">Chart Type</InputLabel>
                <Select
                  labelId="chart-type-label"
                  value={chartType}
                  onChange={handleChartTypeChange}
                  label="Chart Type"
                  size="small"
                >
                  <MenuItem value="bar">Bar Chart</MenuItem>
                  <MenuItem value="line">Line Chart</MenuItem>
                  <MenuItem value="pie">Pie Chart</MenuItem>
                  <MenuItem value="bubble">Bubble Chart</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel id="time-range-label">Time Range</InputLabel>
                <Select
                  labelId="time-range-label"
                  value={timeRange}
                  onChange={handleTimeRangeChange}
                  label="Time Range"
                  size="small"
                >
                  <MenuItem value="day">Last 24 Hours</MenuItem>
                  <MenuItem value="week">Last 7 Days</MenuItem>
                  <MenuItem value="month">Last 30 Days</MenuItem>
                  <MenuItem value="year">Last 12 Months</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </Select>
              </FormControl>
              
              {timeRange === 'custom' && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    label="Start Date"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="End Date"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Refresh Data">
                <IconButton onClick={handleRefresh} disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Filter Data">
                <IconButton onClick={handleFilterToggle}>
                  <FilterIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Export Data">
                <IconButton onClick={handleExportClick}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Share">
                <IconButton>
                  <ShareIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Settings">
                <IconButton>
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          {/* Active Filters */}
          {(filters.resource !== 'all' || filters.metric !== 'all' || filters.threshold) && (
            <Box sx={{ px: 2, pb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Active Filters:
              </Typography>
              <Stack direction="row" spacing={1}>
                {filters.resource !== 'all' && (
                  <Chip 
                    label={`Resource: ${filters.resource}`} 
                    onDelete={() => {
                      setFilters({...filters, resource: 'all'});
                      applyFilters();
                    }} 
                    size="small" 
                  />
                )}
                {filters.metric !== 'all' && (
                  <Chip 
                    label={`Metric: ${filters.metric}`} 
                    onDelete={() => {
                      setFilters({...filters, metric: 'all'});
                      applyFilters();
                    }} 
                    size="small" 
                  />
                )}
                {filters.threshold && (
                  <Chip 
                    label={`Threshold: > ${filters.threshold}`} 
                    onDelete={() => {
                      setFilters({...filters, threshold: ''});
                      applyFilters();
                    }} 
                    size="small" 
                  />
                )}
              </Stack>
            </Box>
          )}
        </Paper>
        
        {/* Filter Panel */}
        <FilterPanel 
          open={filterOpen} 
          onClose={() => setFilterOpen(false)} 
          filters={filters} 
          setFilters={setFilters} 
          applyFilters={applyFilters} 
        />
      </Box>
      
      {/* Chart Area */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {dashboards[tabValue < dashboards.length ? tabValue : 0]?.name || 'Analytics Dashboard'}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <ChartComponent 
                chartType={chartType} 
                data={chartData} 
                height={400} 
              />
            </CardContent>
          </Card>
        </Grid>
        
        {/* Metrics Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                CPU Usage
              </Typography>
              <Typography variant="h3" color="primary">
                {Math.floor(Math.random() * 30) + 40}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average over selected period
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Memory Usage
              </Typography>
              <Typography variant="h3" color="secondary">
                {Math.floor(Math.random() * 20) + 60}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average over selected period
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Network Traffic
              </Typography>
              <Typography variant="h3" color="info.main">
                {Math.floor(Math.random() * 500) + 500} MB/s
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average over selected period
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Data Table (placeholder) */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detailed Data
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                A data table would be displayed here with detailed metrics and the ability to sort and filter.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Export Menu */}
      <ExportMenu 
        anchorEl={exportAnchorEl}
        open={Boolean(exportAnchorEl)}
        handleClose={handleExportClose}
        handleExport={handleExport}
      />
    </Box>
  );
};

export default DetailedAnalytics; 