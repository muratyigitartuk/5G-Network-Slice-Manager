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
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Divider,
  Chip
} from '@mui/material';
import {
  Link as LinkIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  SwapVert as SwapIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';

const SliceChainIntegration = () => {
  const [slices, setSlices] = useState([]);
  const [chains, setChains] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [mappingDialog, setMappingDialog] = useState(false);
  const [selectedSlice, setSelectedSlice] = useState(null);
  const [selectedChain, setSelectedChain] = useState(null);

  useEffect(() => {
    fetchSlices();
    fetchChains();
    fetchMappings();
  }, []);

  const fetchSlices = () => {
    // Simulate API call
    setSlices([
      { id: 1, name: 'IoT Slice', type: 'iot', status: 'active' },
      { id: 2, name: 'Video Streaming', type: 'multimedia', status: 'active' },
      { id: 3, name: 'Gaming Slice', type: 'low-latency', status: 'active' }
    ]);
  };

  const fetchChains = () => {
    // Simulate API call
    setChains([
      { id: 1, name: 'Security Chain', vnfs: ['firewall', 'ids', 'vpn'] },
      { id: 2, name: 'Media Chain', vnfs: ['transcoder', 'cache', 'optimizer'] },
      { id: 3, name: 'Gaming Chain', vnfs: ['loadbalancer', 'accelerator'] }
    ]);
  };

  const fetchMappings = () => {
    // Simulate API call
    setMappings([
      { 
        id: 1, 
        sliceId: 1, 
        chainId: 1, 
        performance: { latency: 15, throughput: 85 },
        status: 'optimal'
      },
      { 
        id: 2, 
        sliceId: 2, 
        chainId: 2, 
        performance: { latency: 25, throughput: 95 },
        status: 'warning'
      }
    ]);
  };

  const handleCreateMapping = () => {
    if (selectedSlice && selectedChain) {
      const newMapping = {
        id: mappings.length + 1,
        sliceId: selectedSlice.id,
        chainId: selectedChain.id,
        performance: { latency: 20, throughput: 90 },
        status: 'optimal'
      };
      setMappings([...mappings, newMapping]);
      setMappingDialog(false);
      setSelectedSlice(null);
      setSelectedChain(null);
    }
  };

  const handleDeleteMapping = (mappingId) => {
    setMappings(mappings.filter(m => m.id !== mappingId));
  };

  const getSliceName = (sliceId) => {
    const slice = slices.find(s => s.id === sliceId);
    return slice ? slice.name : 'Unknown Slice';
  };

  const getChainName = (chainId) => {
    const chain = chains.find(c => c.id === chainId);
    return chain ? chain.name : 'Unknown Chain';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Slice-Chain Integration</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setMappingDialog(true)}
        >
          Create Mapping
        </Button>
      </Box>

      {/* Current Mappings */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Active Mappings</Typography>
        <List>
          {mappings.map(mapping => (
            <ListItem key={mapping.id}>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getSliceName(mapping.sliceId)}
                    <SwapIcon sx={{ mx: 1 }} />
                    {getChainName(mapping.chainId)}
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      size="small" 
                      label={`Latency: ${mapping.performance.latency}ms`}
                      color={mapping.performance.latency < 20 ? "success" : "warning"}
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      size="small" 
                      label={`Throughput: ${mapping.performance.throughput}%`}
                      color={mapping.performance.throughput > 90 ? "success" : "warning"}
                    />
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Tooltip title="View Performance">
                  <IconButton edge="end" sx={{ mr: 1 }}>
                    <SpeedIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Mapping">
                  <IconButton edge="end" onClick={() => handleDeleteMapping(mapping.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Available Resources */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Available Slices</Typography>
            <List>
              {slices.map(slice => (
                <ListItem key={slice.id}>
                  <ListItemText
                    primary={slice.name}
                    secondary={`Type: ${slice.type}`}
                  />
                  <Chip 
                    size="small" 
                    label={slice.status}
                    color={slice.status === 'active' ? "success" : "warning"}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Available Chains</Typography>
            <List>
              {chains.map(chain => (
                <ListItem key={chain.id}>
                  <ListItemText
                    primary={chain.name}
                    secondary={`VNFs: ${chain.vnfs.join(', ')}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Mapping Dialog */}
      <Dialog open={mappingDialog} onClose={() => setMappingDialog(false)}>
        <DialogTitle>Create New Mapping</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 400 }}>
            <Typography variant="subtitle1" gutterBottom>Select Network Slice</Typography>
            <List>
              {slices.map(slice => (
                <ListItem 
                  key={slice.id}
                  button
                  selected={selectedSlice?.id === slice.id}
                  onClick={() => setSelectedSlice(slice)}
                >
                  <ListItemText primary={slice.name} secondary={`Type: ${slice.type}`} />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>Select Service Chain</Typography>
            <List>
              {chains.map(chain => (
                <ListItem
                  key={chain.id}
                  button
                  selected={selectedChain?.id === chain.id}
                  onClick={() => setSelectedChain(chain)}
                >
                  <ListItemText primary={chain.name} secondary={`VNFs: ${chain.vnfs.join(', ')}`} />
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMappingDialog(false)}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={handleCreateMapping}
            disabled={!selectedSlice || !selectedChain}
          >
            Create Mapping
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SliceChainIntegration; 