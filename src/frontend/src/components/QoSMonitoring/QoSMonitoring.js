import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Tabs,
  Tab
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const QoSMonitoring = () => {
  const { t } = useTranslation();
  const [selectedSlice, setSelectedSlice] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  const slices = [
    { id: 'slice1', name: t('qosMonitoring.slices.embb') },
    { id: 'slice2', name: t('qosMonitoring.slices.miot') },
    { id: 'slice3', name: t('qosMonitoring.slices.urllc') }
  ];
  
  const metrics = [
    { name: t('qosMonitoring.metrics.throughput'), value: '850 Mbps', status: 'good', sla: '800 Mbps' },
    { name: t('qosMonitoring.metrics.latency'), value: '15 ms', status: 'warning', sla: '10 ms' },
    { name: t('qosMonitoring.metrics.packetLoss'), value: '0.05%', status: 'good', sla: '0.1%' },
    { name: t('qosMonitoring.metrics.jitter'), value: '2 ms', status: 'good', sla: '5 ms' },
    { name: t('qosMonitoring.metrics.availability'), value: '99.99%', status: 'good', sla: '99.9%' }
  ];
  
  const handleChangeSlice = (event) => {
    setSelectedSlice(event.target.value);
  };
  
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'good': return 'success.main';
      case 'warning': return 'warning.main';
      case 'critical': return 'error.main';
      default: return 'info.main';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'good': return t('qosMonitoring.status.good');
      case 'warning': return t('qosMonitoring.status.warning');
      case 'critical': return t('qosMonitoring.status.critical');
      default: return t('qosMonitoring.status.unknown');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('qosMonitoring.title')}
      </Typography>
      <Typography variant="body1" paragraph>
        {t('qosMonitoring.description')}
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>{t('qosMonitoring.selectNetworkSlice')}</InputLabel>
              <Select
                value={selectedSlice}
                label={t('qosMonitoring.selectNetworkSlice')}
                onChange={handleChangeSlice}
              >
                {slices.map((slice) => (
                  <MenuItem key={slice.id} value={slice.id}>
                    {slice.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label={t('qosMonitoring.timeRange')}
              defaultValue={t('qosMonitoring.timeRanges.last24Hours')}
              fullWidth
              select
            >
              <MenuItem value="1hour">{t('qosMonitoring.timeRanges.last1Hour')}</MenuItem>
              <MenuItem value="6hours">{t('qosMonitoring.timeRanges.last6Hours')}</MenuItem>
              <MenuItem value="24hours">{t('qosMonitoring.timeRanges.last24Hours')}</MenuItem>
              <MenuItem value="7days">{t('qosMonitoring.timeRanges.last7Days')}</MenuItem>
              <MenuItem value="30days">{t('qosMonitoring.timeRanges.last30Days')}</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button variant="contained" fullWidth>
              {t('qosMonitoring.applyFilters')}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleChangeTab}>
          <Tab label={t('qosMonitoring.tabs.overview')} />
          <Tab label={t('qosMonitoring.tabs.performance')} />
          <Tab label={t('qosMonitoring.tabs.slaCompliance')} />
          <Tab label={t('qosMonitoring.tabs.alerts')} />
        </Tabs>
      </Box>
      
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('qosMonitoring.tableHeaders.metric')}</TableCell>
                    <TableCell>{t('qosMonitoring.tableHeaders.currentValue')}</TableCell>
                    <TableCell>{t('qosMonitoring.tableHeaders.slaTarget')}</TableCell>
                    <TableCell>{t('qosMonitoring.tableHeaders.status')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {metrics.map((metric) => (
                    <TableRow key={metric.name}>
                      <TableCell>{metric.name}</TableCell>
                      <TableCell>{metric.value}</TableCell>
                      <TableCell>{metric.sla}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: getStatusColor(metric.status),
                              mr: 1
                            }}
                          />
                          {getStatusText(metric.status)}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default QoSMonitoring; 