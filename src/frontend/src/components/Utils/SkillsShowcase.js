import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Button, 
  TextField, 
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CodeIcon from '@mui/icons-material/Code';
import { useDebounce, useThrottle } from './performance';
import { useForm } from './useForm';
import { required, minLength, email } from './formValidation';
import CardWithLoading from './CardWithLoading';
import { useDataFetching } from './useDataFetching';
import { getTabProps, getTabPanelProps, getAccordionTriggerProps, getAccordionPanelProps } from './a11y';
import { useTranslation } from 'react-i18next';

/**
 * Skills Showcase Component
 * 
 * This component demonstrates various advanced React techniques and best practices:
 * - Custom hooks (useForm, useDataFetching, useDebounce, useThrottle)
 * - Performance optimization (useMemo, useCallback, React.memo)
 * - Accessibility features
 * - Form validation
 * - Error handling
 * - Reusable components
 */
const SkillsShowcase = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [showPerformanceMetrics, setShowPerformanceMetrics] = useState(false);
  
  // Performance metrics
  const renderCountRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const [renderTime, setRenderTime] = useState(0);
  
  // Increment render count for performance metrics
  useEffect(() => {
    renderCountRef.current += 1;
    const renderDuration = Date.now() - startTimeRef.current;
    setRenderTime(renderDuration);
    startTimeRef.current = Date.now();
  }, []);
  
  // Tab handling
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Simulate data fetching
  const fetchData = useCallback(async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: t('skills.mockData.item1'), category: t('skills.mockData.categoryA') },
          { id: 2, name: t('skills.mockData.item2'), category: t('skills.mockData.categoryB') },
          { id: 3, name: t('skills.mockData.item3'), category: t('skills.mockData.categoryA') },
          { id: 4, name: t('skills.mockData.item4'), category: t('skills.mockData.categoryC') },
          { id: 5, name: t('skills.mockData.item5'), category: t('skills.mockData.categoryB') }
        ]);
      }, 1500);
    });
  }, [t]);
  
  // Use our custom data fetching hook
  const { 
    data: fetchedItems, 
    loading, 
    error, 
    refetch 
  } = useDataFetching(fetchData, [], {
    successMessage: t('skills.itemsLoadedSuccess'),
    showSuccessNotification: true
  });
  
  // Update items when data is fetched
  useEffect(() => {
    if (fetchedItems) {
      setItems(fetchedItems);
    }
  }, [fetchedItems]);
  
  // Memoized filtered items based on search term
  const filteredItems = useMemo(() => {
    console.log('Filtering items...');
    if (!searchTerm.trim()) return items;
    
    return items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);
  
  // Memoized item counts by category
  const categoryCounts = useMemo(() => {
    console.log('Calculating category counts...');
    return items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
  }, [items]);
  
  // Debounced search handler
  const handleSearchChange = useDebounce((e) => {
    console.log('Debounced search...');
    setSearchTerm(e.target.value);
  }, 500);
  
  // Throttled counter increment
  const incrementCounter = useThrottle(() => {
    console.log('Throttled increment...');
    setCount(prev => prev + 1);
  }, 300);
  
  // Form validation rules
  const validationRules = {
    name: [required, minLength(3)],
    email: [required, email()],
    message: [required, minLength(10)]
  };
  
  // Form submission handler
  const handleSubmit = useCallback((values) => {
    console.log('Form submitted:', values);
    alert(`${t('skills.formSubmittedSuccess')}\n\n${t('skills.name')}: ${values.name}\n${t('skills.email')}: ${values.email}\n${t('skills.message')}: ${values.message}`);
  }, [t]);
  
  // Use our custom form hook
  const form = useForm(
    { name: '', email: '', message: '' },
    validationRules,
    handleSubmit,
    { validateOnBlur: true }
  );
  
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('skills.title')}
      </Typography>
      
      <Typography variant="body1" paragraph>
        {t('skills.description')}
      </Typography>
      
      {/* Performance metrics toggle */}
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={showPerformanceMetrics}
              onChange={(e) => setShowPerformanceMetrics(e.target.checked)}
            />
          }
          label={t('skills.showPerformanceMetrics')}
        />
      </Box>
      
      {/* Performance metrics display */}
      {showPerformanceMetrics && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.100' }}>
          <Typography variant="subtitle2" gutterBottom>
            {t('skills.performanceMetrics')}:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Typography variant="body2">
                {t('skills.renderCount')}: <Chip size="small" label={renderCountRef.current} color="primary" />
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2">
                {t('skills.lastRenderTime')}: <Chip size="small" label={`${renderTime}ms`} color="secondary" />
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2">
                {t('skills.memoizedItems')}: <Chip size="small" label={filteredItems.length} color="info" />
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2">
                {t('skills.categories')}: <Chip size="small" label={Object.keys(categoryCounts).length} color="success" />
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {/* Tabs for different sections */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          aria-label={t('skills.tabsAriaLabel')}
        >
          <Tab 
            label={t('skills.tabs.performanceOptimization')}
            {...getTabProps('skills-showcase', 0, activeTab)}
          />
          <Tab 
            label={t('skills.tabs.formHandling')}
            {...getTabProps('skills-showcase', 1, activeTab)}
          />
          <Tab 
            label={t('skills.tabs.dataFetching')}
            {...getTabProps('skills-showcase', 2, activeTab)}
          />
        </Tabs>
      </Box>
      
      {/* Performance Optimization Tab */}
      <div
        role="tabpanel"
        hidden={activeTab !== 0}
        {...getTabPanelProps('skills-showcase', 0)}
      >
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('skills.performanceOptimizationExamples')}
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {t('skills.debouncedSearch')}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {t('skills.debouncedSearchDescription')}
                  </Typography>
                  <TextField
                    label="Search items"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => {
                      // This will be debounced
                      handleSearchChange(e);
                    }}
                  />
                  <List>
                    {filteredItems.map(item => (
                      <ListItem key={item.id}>
                        <ListItemText 
                          primary={item.name} 
                          secondary={item.category} 
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {t('skills.throttledCounter')}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {t('skills.throttledCounterDescription')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button 
                      variant="contained" 
                      onClick={incrementCounter}
                    >
                      {t('skills.increment')}
                    </Button>
                    <Typography variant="h4">
                      {count}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {t('skills.memoizedCalculations')}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {t('skills.memoizedCalculationsDescription')}
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.entries(categoryCounts).map(([category, count]) => (
                      <Grid item key={category}>
                        <Chip 
                          label={`${category}: ${count}`} 
                          color="primary" 
                          variant="outlined"
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </div>
      
      {/* Form Handling Tab */}
      <div
        role="tabpanel"
        hidden={activeTab !== 1}
        {...getTabPanelProps('skills-showcase', 1)}
      >
        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('skills.formHandling')}
            </Typography>
            
            <Paper sx={{ p: 3 }}>
              <form onSubmit={form.handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label={t('skills.name')}
                      fullWidth
                      required
                      {...form.getFieldProps('name')}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label={t('skills.email')}
                      fullWidth
                      required
                      type="email"
                      {...form.getFieldProps('email')}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label={t('skills.message')}
                      fullWidth
                      required
                      multiline
                      rows={4}
                      {...form.getFieldProps('message')}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={form.resetForm}
                      >
                        {t('skills.reset')}
                      </Button>
                      
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={!form.isValid || form.isSubmitting}
                      >
                        {form.isSubmitting ? t('skills.submitting') : t('skills.submit')}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
              
              <Divider sx={{ my: 3 }} />
              
              <Accordion>
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon />}
                  {...getAccordionTriggerProps('form-state', false)}
                >
                  <Typography>{t('skills.formState')}</Typography>
                </AccordionSummary>
                <AccordionDetails {...getAccordionPanelProps('form-state')}>
                  <Typography variant="subtitle2" gutterBottom>
                    {t('skills.values')}:
                  </Typography>
                  <pre style={{ background: '#f5f5f5', padding: 10, borderRadius: 4 }}>
                    {JSON.stringify(form.values, null, 2)}
                  </pre>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    {t('skills.errors')}:
                  </Typography>
                  <pre style={{ background: '#f5f5f5', padding: 10, borderRadius: 4 }}>
                    {JSON.stringify(form.errors, null, 2)}
                  </pre>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    {t('skills.touched')}:
                  </Typography>
                  <pre style={{ background: '#f5f5f5', padding: 10, borderRadius: 4 }}>
                    {JSON.stringify(form.touched, null, 2)}
                  </pre>
                </AccordionDetails>
              </Accordion>
            </Paper>
          </Box>
        )}
      </div>
      
      {/* Data Fetching Tab */}
      <div
        role="tabpanel"
        hidden={activeTab !== 2}
        {...getTabPanelProps('skills-showcase', 2)}
      >
        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('skills.dataFetching')}
            </Typography>
            
            <CardWithLoading
              title={t('skills.items')}
              loading={loading}
              error={error}
              isEmpty={!loading && !error && (!items || items.length === 0)}
              emptyMessage={t('skills.noItemsFound')}
              onRetry={refetch}
              headerAction={
                <Button 
                  size="small" 
                  onClick={refetch}
                  startIcon={<CodeIcon />}
                >
                  {t('skills.refetch')}
                </Button>
              }
              footerActions={
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                  <Button size="small" color="primary">
                    {t('skills.viewAll')}
                  </Button>
                </Box>
              }
            >
              <List>
                {items.map(item => (
                  <ListItem key={item.id} divider>
                    <ListItemText 
                      primary={item.name} 
                      secondary={item.category} 
                    />
                    <Chip 
                      label={item.category} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </ListItem>
                ))}
              </List>
            </CardWithLoading>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                {t('skills.aboutDataFetching')}
              </Typography>
              <Typography variant="body2" paragraph>
                {t('skills.dataFetchingDescription')}
              </Typography>
              <Typography variant="body2">
                {t('skills.dataFetchingFeatures')}:
              </Typography>
              <ul>
                <li>{t('skills.automaticLoadingStateManagement')}</li>
                <li>{t('skills.errorHandlingWithRetryCapability')}</li>
                <li>{t('skills.successNotifications')}</li>
                <li>{t('skills.dataTransformation')}</li>
                <li>{t('skills.refetchFunctionality')}</li>
              </ul>
            </Box>
          </Box>
        )}
      </div>
    </Box>
  );
};

export default SkillsShowcase; 