import * as React from 'react';
import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid,
  Card, 
  CardContent,
  CardHeader,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNotifications } from '../Notifications/NotificationContext';
import { useTranslation } from 'react-i18next';

const ServiceChaining = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotifications();
  const [serviceChains, setServiceChains] = useState([
    {
      id: 1,
      name: t('serviceChaining.mockData.webTrafficChain'),
      description: t('serviceChaining.mockData.webTrafficDescription'),
      services: [
        t('serviceChaining.services.firewall'), 
        t('serviceChaining.services.loadBalancer'), 
        t('serviceChaining.services.webCache'), 
        t('serviceChaining.services.dpi')
      ]
    },
    {
      id: 2,
      name: t('serviceChaining.mockData.iotDataChain'),
      description: t('serviceChaining.mockData.iotDataDescription'),
      services: [
        t('serviceChaining.services.messageQueue'), 
        t('serviceChaining.services.dataFilter'), 
        t('serviceChaining.services.analyticsEngine')
      ]
    }
  ]);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [currentChain, setCurrentChain] = useState(null);
  const [newChain, setNewChain] = useState({
    name: '',
    description: '',
    services: []
  });
  const [newService, setNewService] = useState('');

  // Available services for dropdown
  const availableServices = [
    t('serviceChaining.services.firewall'), 
    t('serviceChaining.services.loadBalancer'), 
    t('serviceChaining.services.webCache'), 
    t('serviceChaining.services.dpi'), 
    t('serviceChaining.services.messageQueue'), 
    t('serviceChaining.services.dataFilter'), 
    t('serviceChaining.services.analyticsEngine'),
    t('serviceChaining.services.natGateway'), 
    t('serviceChaining.services.trafficAnalyzer'), 
    t('serviceChaining.services.vpnEndpoint')
  ];

  // Handle creating a new chain
  const handleCreateChain = () => {
    if (!newChain.name) return;
    
    const chain = {
      id: Date.now(),
      name: newChain.name,
      description: newChain.description,
      services: newChain.services
    };
    
    setServiceChains([...serviceChains, chain]);
    setNewChain({ name: '', description: '', services: [] });
    setCreateDialogOpen(false);
    
    addNotification({
      type: 'success',
      message: t('serviceChaining.notifications.created', { name: chain.name })
    });
  };

  // Handle deleting a chain
  const handleDeleteChain = (chainId) => {
    const chain = serviceChains.find(c => c.id === chainId);
    setServiceChains(serviceChains.filter(c => c.id !== chainId));
    
    addNotification({
      type: 'info',
      message: t('serviceChaining.notifications.deleted', { name: chain.name })
    });
  };

  // Handle deleting a service from a chain
  const handleDeleteService = (chainId, serviceIndex) => {
    setServiceChains(serviceChains.map(chain => {
      if (chain.id === chainId) {
        const newServices = [...chain.services];
        newServices.splice(serviceIndex, 1);
        return { ...chain, services: newServices };
      }
      return chain;
    }));
  };

  // Handle opening settings dialog
  const handleOpenSettings = (chain) => {
    setCurrentChain(chain);
    setSettingsDialogOpen(true);
  };

  // Handle opening manage dialog
  const handleOpenManage = (chain) => {
    setCurrentChain(chain);
    setManageDialogOpen(true);
  };

  // Handle adding a service to a chain
  const handleAddService = () => {
    if (!newService || !currentChain) return;
    
    setServiceChains(serviceChains.map(chain => {
      if (chain.id === currentChain.id) {
        return { ...chain, services: [...chain.services, newService] };
      }
      return chain;
    }));
    
    setNewService('');
    
    // Update the current chain
    const updatedChain = serviceChains.find(c => c.id === currentChain.id);
    setCurrentChain(updatedChain);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('serviceChaining.title')}
      </Typography>
      <Typography variant="body1" paragraph>
        {t('serviceChaining.description')}
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          sx={{ mb: 2 }}
          onClick={() => setCreateDialogOpen(true)}
        >
          {t('serviceChaining.createButton')}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {serviceChains.map((chain) => (
          <Grid item xs={12} md={6} key={chain.id}>
            <Card variant="outlined">
              <CardHeader
                title={chain.name}
                action={
                  <IconButton 
                    aria-label={t('serviceChaining.settings')}
                    onClick={() => handleOpenSettings(chain)}
                  >
                    <SettingsIcon />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {chain.description}
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  {t('serviceChaining.servicePath')}
                </Typography>
                
                <List dense>
                  {chain.services.map((service, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText primary={service} />
                        {index < chain.services.length - 1 && (
                          <ListItemIcon sx={{ minWidth: 'auto' }}>
                            <ArrowForwardIcon fontSize="small" />
                          </ListItemIcon>
                        )}
                        <IconButton 
                          edge="end" 
                          aria-label={t('serviceChaining.delete')}
                          size="small"
                          onClick={() => handleDeleteService(chain.id, index)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button 
                    size="small" 
                    color="error" 
                    onClick={() => handleDeleteChain(chain.id)}
                  >
                    {t('serviceChaining.deleteChain')}
                  </Button>
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={() => handleOpenManage(chain)}
                  >
                    {t('serviceChaining.manageChain')}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create New Chain Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('serviceChaining.createNewChain')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('serviceChaining.chainName')}
            fullWidth
            value={newChain.name}
            onChange={(e) => setNewChain({...newChain, name: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label={t('serviceChaining.description')}
            fullWidth
            multiline
            rows={3}
            value={newChain.description}
            onChange={(e) => setNewChain({...newChain, description: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>{t('serviceChaining.cancel')}</Button>
          <Button onClick={handleCreateChain} variant="contained">{t('serviceChaining.create')}</Button>
        </DialogActions>
      </Dialog>

      {/* Manage Chain Dialog */}
      <Dialog open={manageDialogOpen} onClose={() => setManageDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('serviceChaining.manageChainTitle', { name: currentChain?.name })}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" gutterBottom>{t('serviceChaining.addServiceToChain')}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <FormControl fullWidth sx={{ mr: 2 }}>
              <InputLabel id="service-select-label">{t('serviceChaining.service')}</InputLabel>
              <Select
                labelId="service-select-label"
                value={newService}
                label={t('serviceChaining.service')}
                onChange={(e) => setNewService(e.target.value)}
              >
                {availableServices.map((service) => (
                  <MenuItem key={service} value={service}>{service}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button 
              variant="contained" 
              onClick={handleAddService}
              disabled={!newService}
            >
              {t('serviceChaining.add')}
            </Button>
          </Box>
          
          <Typography variant="subtitle2" gutterBottom>{t('serviceChaining.currentServices')}</Typography>
          <List dense>
            {currentChain?.services.map((service, index) => (
              <ListItem key={index}>
                <ListItemText primary={service} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setManageDialogOpen(false)}>{t('serviceChaining.close')}</Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsDialogOpen} onClose={() => setSettingsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('serviceChaining.chainSettings', { name: currentChain?.name })}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label={t('serviceChaining.chainName')}
            fullWidth
            value={currentChain?.name || ''}
            onChange={(e) => setCurrentChain({...currentChain, name: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label={t('serviceChaining.description')}
            fullWidth
            multiline
            rows={3}
            value={currentChain?.description || ''}
            onChange={(e) => setCurrentChain({...currentChain, description: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsDialogOpen(false)}>{t('serviceChaining.cancel')}</Button>
          <Button 
            onClick={() => {
              setServiceChains(serviceChains.map(chain => 
                chain.id === currentChain.id ? currentChain : chain
              ));
              setSettingsDialogOpen(false);
              
              addNotification({
                type: 'success',
                message: t('serviceChaining.notifications.updated', { name: currentChain.name })
              });
            }} 
            variant="contained"
          >
            {t('serviceChaining.saveChanges')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServiceChaining; 