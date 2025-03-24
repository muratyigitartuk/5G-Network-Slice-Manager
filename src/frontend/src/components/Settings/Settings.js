import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Divider,
  Container,
  Grid,
  FormControlLabel,
  Switch,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  FormControl,
  TextField,
  FormHelperText,
  Chip,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  Palette as PaletteIcon,
  Code as CodeIcon,
  Login as LoginIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
  Backup as BackupIcon,
  Restore as RestoreIcon,
  ClearAll as ClearAllIcon,
  Repeat as RepeatIcon
} from '@mui/icons-material';
import UserPreferences from './UserPreferences';
import UserProfile from '../UserManagement/UserProfile';
import SkillsShowcase from '../Utils/SkillsShowcase';
import { useAuth } from '../Auth/AuthContext';
import { getTabProps, getTabPanelProps } from '../Utils/a11y';
import PropTypes from 'prop-types';

// TabPanel component to handle tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 4 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Add PropTypes validation
TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};

const Settings = () => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const { currentUser } = useAuth();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Add notification feedback
  const showNotification = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle save actions
  const handleSaveSettings = (section) => {
    // In a real app, this would make an API call to save settings
    console.log(`Saving ${section} settings`);
    showNotification(t('settings.saveSuccess'));
  };

  // Handle clear notifications
  const handleClearNotifications = () => {
    // In a real app, this would make an API call to clear notifications
    console.log('Clearing all notifications');
    showNotification(t('notifications.clearAll'));
  };

  // Handle download logs
  const handleDownloadLogs = () => {
    // In a real app, this would trigger a download
    console.log('Downloading security logs');
    showNotification('Logs downloaded successfully');
  };

  // Handle system backup
  const handleSystemBackup = () => {
    console.log('Backing up database');
    showNotification('Database backup started');
  };

  // Handle clear cache
  const handleClearCache = () => {
    console.log('Clearing cache');
    showNotification('Cache cleared successfully');
  };

  // Handle rebuild indexes
  const handleRebuildIndexes = () => {
    console.log('Rebuilding indexes');
    showNotification('Index rebuild started');
  };

  // Handle restore defaults
  const handleRestoreDefaults = () => {
    console.log('Restoring defaults');
    showNotification('Default settings restored');
  };

  // Calculate the index for the About tab based on whether the user is an admin
  const aboutTabIndex = currentUser && currentUser.role === 'admin' ? 6 : 5;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, mt: 2 }}>
        <Typography variant="h4" gutterBottom>
          {t('settings.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('settings.manageAccount')}
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="settings tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab 
              icon={<PersonIcon />} 
              label={t('settings.profile')} 
              {...getTabProps('settings', 0, tabValue)} 
            />
            <Tab 
              icon={<PaletteIcon />} 
              label={t('settings.preferences')} 
              {...getTabProps('settings', 1, tabValue)} 
            />
            <Tab 
              icon={<SecurityIcon />} 
              label={t('settings.security')} 
              {...getTabProps('settings', 2, tabValue)} 
            />
            <Tab 
              icon={<NotificationsIcon />} 
              label={t('settings.notifications')} 
              {...getTabProps('settings', 3, tabValue)} 
            />
            <Tab 
              icon={<CodeIcon />} 
              label={t('settings.skillsShowcase')} 
              {...getTabProps('settings', 4, tabValue)} 
            />
            {currentUser && currentUser.role === 'admin' && (
              <Tab 
                icon={<SettingsIcon />} 
                label={t('settings.systemSettings')} 
                {...getTabProps('settings', 5, tabValue)} 
              />
            )}
            <Tab 
              icon={<InfoIcon />} 
              label={t('settings.about')} 
              {...getTabProps('settings', aboutTabIndex, tabValue)} 
            />
          </Tabs>
        </Box>

        <div {...getTabPanelProps('settings', 0)} hidden={tabValue !== 0}>
          {tabValue === 0 && <UserProfile />}
        </div>

        <div {...getTabPanelProps('settings', 1)} hidden={tabValue !== 1}>
          {tabValue === 1 && <UserPreferences />}
        </div>

        <div {...getTabPanelProps('settings', 2)} hidden={tabValue !== 2}>
          {tabValue === 2 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                {t('settings.securitySettings')}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {t('settings.manageSecuritySettings')}
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      {t('security.passwordSettings')}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label={t('security.passwordExpiration')}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                        {t('security.passwordExpirationDescription')}
                      </Typography>
                      
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>{t('security.passwordExpirationPeriod')}</InputLabel>
                        <Select
                          defaultValue={90}
                          label={t('security.passwordExpirationPeriod')}
                        >
                          <MenuItem value={30}>{t('security.thirtyDays')}</MenuItem>
                          <MenuItem value={60}>{t('security.sixtyDays')}</MenuItem>
                          <MenuItem value={90}>{t('security.ninetyDays')}</MenuItem>
                        </Select>
                      </FormControl>
                      
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label={t('security.twoFactorAuth')}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                        {t('security.twoFactorAuthDescription')}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      {t('security.sessionSettings')}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label={t('security.autoLogout')}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                        {t('security.autoLogoutDescription')}
                      </Typography>
                      
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>{t('security.inactivityPeriod')}</InputLabel>
                        <Select
                          defaultValue={30}
                          label={t('security.inactivityPeriod')}
                        >
                          <MenuItem value={15}>{t('security.fifteenMinutes')}</MenuItem>
                          <MenuItem value={30}>{t('security.thirtyMinutes')}</MenuItem>
                          <MenuItem value={60}>{t('security.sixtyMinutes')}</MenuItem>
                        </Select>
                      </FormControl>
                      
                      <FormControlLabel
                        control={<Switch />}
                        label={t('security.deviceManagement')}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                        {t('security.deviceManagementDescription')}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      {t('security.accessLogs')}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
                        {t('security.accessLogs')}
                      </Typography>
                      <List>
                        <ListItem divider>
                          <ListItemIcon>
                            <LoginIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={t('security.successfulLogin')} 
                            secondary="23.03.2025 19:10:28" 
                          />
                          <Typography variant="body2" color="textSecondary">
                            IP: 203.0.113.42
                          </Typography>
                        </ListItem>
                        <ListItem divider>
                          <ListItemIcon>
                            <VisibilityIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={t('security.profileViewed')} 
                            secondary="22.03.2025 19:10:28" 
                          />
                          <Typography variant="body2" color="textSecondary">
                            IP: 45.67.89.123
                          </Typography>
                        </ListItem>
                        <ListItem divider>
                          <ListItemIcon>
                            <LoginIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={t('security.successfulLogin')} 
                            secondary="21.03.2025 19:10:28" 
                          />
                          <Typography variant="body2" color="textSecondary">
                            IP: 128.30.15.67
                          </Typography>
                        </ListItem>
                        <ListItem divider>
                          <ListItemIcon>
                            <VisibilityIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={t('security.profileViewed')} 
                            secondary="20.03.2025 19:10:28" 
                          />
                          <Typography variant="body2" color="textSecondary">
                            IP: 198.51.100.234
                          </Typography>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <LoginIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={t('security.successfulLogin')} 
                            secondary="19.03.2025 19:10:28" 
                          />
                          <Typography variant="body2" color="textSecondary">
                            IP: 104.236.178.43
                          </Typography>
                        </ListItem>
                      </List>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button 
                          variant="outlined" 
                          startIcon={<DownloadIcon />}
                          onClick={handleDownloadLogs}
                        >
                          {t('security.downloadLogs')}
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  startIcon={<SaveIcon />}
                  onClick={() => handleSaveSettings('security')}
                >
                  {t('common.save')}
                </Button>
              </Box>
            </Box>
          )}
        </div>

        <div {...getTabPanelProps('settings', 3)} hidden={tabValue !== 3}>
          {tabValue === 3 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                {t('settings.notificationSettings')}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {t('settings.configureNotifications')}
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      {t('notifications.settings.channels')}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label={t('notifications.settings.inApp')}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                        {t('notifications.settings.inAppDescription')}
                      </Typography>
                      
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label={t('notifications.settings.email')}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                        {t('notifications.settings.emailDescription')}
                      </Typography>
                      
                      <TextField
                        fullWidth
                        label={t('notifications.settings.emailAddress')}
                        defaultValue="user@example.com"
                        sx={{ mb: 2 }}
                      />
                      
                      <FormControlLabel
                        control={<Switch />}
                        label={t('notifications.settings.push')}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                        {t('notifications.settings.pushDescription')}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      {t('notifications.settings.preferences')}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <List dense>
                        <ListItem>
                          <ListItemText 
                            primary={t('notifications.settings.systemAlerts')} 
                            secondary={t('notifications.settings.systemAlertsDescription')}
                          />
                          <Switch defaultChecked edge="end" />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary={t('notifications.settings.resourceUpdates')} 
                            secondary={t('notifications.settings.resourceUpdatesDescription')}
                          />
                          <Switch defaultChecked edge="end" />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary={t('notifications.settings.securityAlerts')} 
                            secondary={t('notifications.settings.securityAlertsDescription')}
                          />
                          <Switch defaultChecked edge="end" />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary={t('notifications.settings.userActivity')} 
                            secondary={t('notifications.settings.userActivityDescription')}
                          />
                          <Switch edge="end" />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary={t('notifications.settings.maintenanceUpdates')} 
                            secondary={t('notifications.settings.maintenanceUpdatesDescription')}
                          />
                          <Switch defaultChecked edge="end" />
                        </ListItem>
                      </List>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        {t('notifications.settings.schedule')}
                      </Typography>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label={t('notifications.settings.quietHours')}
                      />
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>{t('notifications.settings.startTime')}</InputLabel>
                          <Select
                            defaultValue="22:00"
                            label={t('notifications.settings.startTime')}
                          >
                            <MenuItem value="20:00">20:00</MenuItem>
                            <MenuItem value="21:00">21:00</MenuItem>
                            <MenuItem value="22:00">22:00</MenuItem>
                            <MenuItem value="23:00">23:00</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>{t('notifications.settings.endTime')}</InputLabel>
                          <Select
                            defaultValue="07:00"
                            label={t('notifications.settings.endTime')}
                          >
                            <MenuItem value="06:00">06:00</MenuItem>
                            <MenuItem value="07:00">07:00</MenuItem>
                            <MenuItem value="08:00">08:00</MenuItem>
                            <MenuItem value="09:00">09:00</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button 
                  variant="outlined"
                  onClick={handleClearNotifications}
                >
                  {t('notifications.settings.clearAllNotifications')}
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<SaveIcon />}
                  onClick={() => handleSaveSettings('notifications')}
                >
                  {t('common.save')}
                </Button>
              </Box>
            </Box>
          )}
        </div>

        <div {...getTabPanelProps('settings', 4)} hidden={tabValue !== 4}>
          {tabValue === 4 && <SkillsShowcase />}
        </div>

        {currentUser && currentUser.role === 'admin' && (
          <div {...getTabPanelProps('settings', 5)} hidden={tabValue !== 5}>
            {tabValue === 5 && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  {t('settings.systemSettings')}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {t('settings.configureSystemSettings')}
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                      <Typography variant="h6" gutterBottom>
                        {t('system.generalSettings')}
                      </Typography>
                      
                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>{t('system.defaultLanguage')}</InputLabel>
                        <Select
                          defaultValue="en"
                          label={t('system.defaultLanguage')}
                        >
                          <MenuItem value="en">{t('language.en')}</MenuItem>
                          <MenuItem value="de">{t('language.de')}</MenuItem>
                        </Select>
                        <FormHelperText>
                          {t('system.defaultLanguageDescription')}
                        </FormHelperText>
                      </FormControl>
                      
                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>{t('system.defaultTheme')}</InputLabel>
                        <Select
                          defaultValue="light"
                          label={t('system.defaultTheme')}
                        >
                          <MenuItem value="light">{t('theme.lightMode')}</MenuItem>
                          <MenuItem value="dark">{t('theme.darkMode')}</MenuItem>
                          <MenuItem value="system">{t('preferences.systemDefault')}</MenuItem>
                        </Select>
                        <FormHelperText>
                          {t('system.defaultThemeDescription')}
                        </FormHelperText>
                      </FormControl>
                      
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label={t('system.enableMaintenanceMode')}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                        {t('system.enableMaintenanceModeDescription')}
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                      <Typography variant="h6" gutterBottom>
                        {t('system.userManagement')}
                      </Typography>
                      
                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>{t('system.userRegistration')}</InputLabel>
                        <Select
                          defaultValue="approval"
                          label={t('system.userRegistration')}
                        >
                          <MenuItem value="open">{t('system.registrationOpen')}</MenuItem>
                          <MenuItem value="approval">{t('system.registrationApproval')}</MenuItem>
                          <MenuItem value="closed">{t('system.registrationClosed')}</MenuItem>
                        </Select>
                        <FormHelperText>
                          {t('system.userRegistrationDescription')}
                        </FormHelperText>
                      </FormControl>
                      
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label={t('system.enforcePasswordPolicies')}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                        {t('system.enforcePasswordPoliciesDescription')}
                      </Typography>
                      
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label={t('system.enableUserRoles')}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                        {t('system.enableUserRolesDescription')}
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        {t('system.performance')}
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>{t('system.dataCaching')}</InputLabel>
                            <Select
                              defaultValue="medium"
                              label={t('system.dataCaching')}
                            >
                              <MenuItem value="low">{t('system.cachingLow')}</MenuItem>
                              <MenuItem value="medium">{t('system.cachingMedium')}</MenuItem>
                              <MenuItem value="high">{t('system.cachingHigh')}</MenuItem>
                            </Select>
                            <FormHelperText>
                              {t('system.dataCachingDescription')}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>{t('system.logLevel')}</InputLabel>
                            <Select
                              defaultValue="warning"
                              label={t('system.logLevel')}
                            >
                              <MenuItem value="error">{t('system.logLevelError')}</MenuItem>
                              <MenuItem value="warning">{t('system.logLevelWarning')}</MenuItem>
                              <MenuItem value="info">{t('system.logLevelInfo')}</MenuItem>
                              <MenuItem value="debug">{t('system.logLevelDebug')}</MenuItem>
                            </Select>
                            <FormHelperText>
                              {t('system.logLevelDescription')}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
                      
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          {t('system.resourceLimits')}
                        </Typography>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label={t('system.maxNetworkSlices')}
                              type="number"
                              defaultValue={100}
                              InputProps={{ inputProps: { min: 10, max: 1000 } }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label={t('system.maxVNFsPerSlice')}
                              type="number"
                              defaultValue={50}
                              InputProps={{ inputProps: { min: 5, max: 200 } }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label={t('system.maxConcurrentUsers')}
                              type="number"
                              defaultValue={200}
                              InputProps={{ inputProps: { min: 10, max: 1000 } }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">
                          {t('system.maintenance')}
                        </Typography>
                        <Chip
                          label={t('system.databaseStatus')}
                          color="success"
                          icon={<CheckCircleIcon />}
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                        <Button 
                          variant="outlined" 
                          startIcon={<BackupIcon />}
                          onClick={handleSystemBackup}
                        >
                          {t('system.backupDatabase')}
                        </Button>
                        <Button 
                          variant="outlined" 
                          startIcon={<ClearAllIcon />}
                          onClick={handleClearCache}
                        >
                          {t('system.clearCache')}
                        </Button>
                        <Button 
                          variant="outlined" 
                          startIcon={<RepeatIcon />}
                          onClick={handleRebuildIndexes}
                        >
                          {t('system.rebuildIndexes')}
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                  <Button 
                    variant="outlined" 
                    color="error"
                    startIcon={<RestoreIcon />}
                    onClick={handleRestoreDefaults}
                  >
                    {t('system.restoreDefaults')}
                  </Button>
                  <Button 
                    variant="contained" 
                    startIcon={<SaveIcon />}
                    onClick={() => handleSaveSettings('system')}
                  >
                    {t('common.save')}
                  </Button>
                </Box>
              </Box>
            )}
          </div>
        )}

        <div {...getTabPanelProps('settings', aboutTabIndex)} hidden={tabValue !== aboutTabIndex}>
          {tabValue === aboutTabIndex && (
            <Box>
              <Typography variant="h5" gutterBottom>
                {t('settings.about')}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {t('settings.aboutInfo')}
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                {t('settings.appName')}
              </Typography>
              <Typography variant="body1" paragraph>
                {t('settings.version', { version: '1.0.0' })}
              </Typography>
              <Typography variant="body2" paragraph>
                {t('settings.appDescription')}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
                {t('settings.copyright')}
              </Typography>
            </Box>
          )}
        </div>
      </Paper>

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
    </Container>
  );
};

export default Settings; 