import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Alert,
  Snackbar,
  Chip
} from '@mui/material';
import {
  Save as SaveIcon
} from '@mui/icons-material';
import { useAuth } from '../Auth/AuthContext';

const UserPreferences = () => {
  const { t } = useTranslation();
  const { currentUser, updatePreferences } = useAuth();
  const [preferences, setPreferences] = useState({
    theme: 'light',
    dashboardLayout: 'grid',
    enableNotifications: true,
    refreshRate: 30,
    visibleWidgets: ['performance', 'resources', 'alerts', 'network'],
    defaultView: 'overview'
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Load user preferences from auth context if available
    if (currentUser && currentUser.preferences) {
      setPreferences(currentUser.preferences);
    }
  }, [currentUser]);

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setPreferences(prev => ({
      ...prev,
      [name]: event.target.type === 'checkbox' ? checked : value
    }));
  };

  const handleWidgetToggle = (widget) => {
    setPreferences(prev => {
      const visibleWidgets = [...prev.visibleWidgets];
      
      if (visibleWidgets.includes(widget)) {
        return {
          ...prev,
          visibleWidgets: visibleWidgets.filter(w => w !== widget)
        };
      } else {
        return {
          ...prev,
          visibleWidgets: [...visibleWidgets, widget]
        };
      }
    });
  };

  const handleSave = () => {
    updatePreferences(preferences);
    setSuccess(true);
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  const availableWidgets = [
    { id: 'performance', label: t('preferences.widgets.performance') },
    { id: 'resources', label: t('preferences.widgets.resources') },
    { id: 'alerts', label: t('preferences.widgets.alerts') },
    { id: 'network', label: t('preferences.widgets.network') },
    { id: 'storage', label: t('preferences.widgets.storage') },
    { id: 'compute', label: t('preferences.widgets.compute') }
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {t('preferences.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {t('preferences.description')}
      </Typography>

      <Grid container spacing={3}>
        {/* Theme Settings */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="theme-label">{t('settings.theme')}</InputLabel>
            <Select
              labelId="theme-label"
              id="theme"
              name="theme"
              value={preferences.theme}
              onChange={handleChange}
              label={t('settings.theme')}
            >
              <MenuItem value="light">{t('settings.lightMode')}</MenuItem>
              <MenuItem value="dark">{t('settings.darkMode')}</MenuItem>
              <MenuItem value="system">{t('preferences.systemDefault')}</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="dashboard-layout-label">{t('preferences.dashboardLayout')}</InputLabel>
            <Select
              labelId="dashboard-layout-label"
              id="dashboardLayout"
              name="dashboardLayout"
              value={preferences.dashboardLayout}
              onChange={handleChange}
              label={t('preferences.dashboardLayout')}
            >
              <MenuItem value="grid">{t('preferences.layouts.grid')}</MenuItem>
              <MenuItem value="list">{t('preferences.layouts.list')}</MenuItem>
              <MenuItem value="compact">{t('preferences.layouts.compact')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Switch
                checked={preferences.enableNotifications}
                onChange={handleChange}
                name="enableNotifications"
                color="primary"
              />
            }
            label={t('preferences.enableNotifications')}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="refresh-rate-label">{t('preferences.dataRefreshRate')}</InputLabel>
            <Select
              labelId="refresh-rate-label"
              id="refreshRate"
              name="refreshRate"
              value={preferences.refreshRate}
              onChange={handleChange}
              label={t('preferences.dataRefreshRate')}
              disabled={!preferences.enableNotifications}
            >
              <MenuItem value={10}>{t('preferences.refreshTimes.tenSeconds')}</MenuItem>
              <MenuItem value={30}>{t('preferences.refreshTimes.thirtySeconds')}</MenuItem>
              <MenuItem value={60}>{t('preferences.refreshTimes.oneMinute')}</MenuItem>
              <MenuItem value={300}>{t('preferences.refreshTimes.fiveMinutes')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Dashboard Widgets */}
        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary" paragraph>
            {t('preferences.selectWidgets')}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {availableWidgets.map(widget => (
              <Chip
                key={widget.id}
                label={widget.label}
                onClick={() => handleWidgetToggle(widget.id)}
                color={preferences.visibleWidgets.includes(widget.id) ? "primary" : "default"}
                variant={preferences.visibleWidgets.includes(widget.id) ? "filled" : "outlined"}
              />
            ))}
          </Box>
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="default-view-label">{t('preferences.defaultView')}</InputLabel>
            <Select
              labelId="default-view-label"
              id="defaultView"
              name="defaultView"
              value={preferences.defaultView}
              onChange={handleChange}
              label={t('preferences.defaultView')}
            >
              <MenuItem value="overview">{t('preferences.views.overview')}</MenuItem>
              <MenuItem value="performance">{t('preferences.views.performance')}</MenuItem>
              <MenuItem value="resources">{t('preferences.views.resources')}</MenuItem>
              <MenuItem value="alerts">{t('preferences.views.alerts')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          {t('preferences.savePreferences')}
        </Button>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {t('preferences.saveSuccess')}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserPreferences; 