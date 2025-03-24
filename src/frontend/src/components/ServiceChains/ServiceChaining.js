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
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Card,
  CardContent,
  Tooltip,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Link as ChainIcon,
  Timeline as FlowIcon,
  Speed as PerformanceIcon,
  Warning as AlertIcon,
  Save as SaveIcon,
  ContentCopy as CloneIcon
} from '@mui/icons-material';
import axios from 'axios';
import ReactFlow, {
  Controls,
  Background,
  Handle,
  Position,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom node component for VNFs in the chain
const VNFNode = ({ data }) => (
  <Card sx={{ minWidth: 200 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {data.label}
      </Typography>
      <Typography color="textSecondary" variant="body2">
        Type: {data.type}
      </Typography>
      <Typography color="textSecondary" variant="body2">
        Status: {data.status}
      </Typography>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </CardContent>
  </Card>
);

const nodeTypes = {
  vnfNode: VNFNode
};

const ServiceChaining = () => {
  const [chains, setChains] = useState([]);
  const [selectedChain, setSelectedChain] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [availableVNFs, setAvailableVNFs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    vnfs: [],
    policies: []
  });
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [chainMetrics, setChainMetrics] = useState({});
  const [showMetrics, setShowMetrics] = useState(false);
  const [templateDialog, setTemplateDialog] = useState(false);
  const [policyDialog, setPolicyDialog] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    vnfs: [],
    policies: []
  });
  const [newPolicy, setNewPolicy] = useState({
    name: '',
    type: 'traffic',
    conditions: [],
    actions: []
  });

  useEffect(() => {
    fetchChains();
    fetchAvailableVNFs();
    // Start monitoring chain metrics
    const interval = setInterval(() => {
      if (selectedChain) {
        fetchChainMetrics(selectedChain.id);
      }
    }, 5000);

    // Simulate fetching templates
    setTemplates([
      {
        id: 1,
        name: 'Security Chain',
        description: 'Firewall -> IDS -> DPI',
        vnfs: ['firewall', 'ids', 'dpi']
      },
      {
        id: 2,
        name: 'Media Optimization',
        description: 'Load Balancer -> Cache -> Transcoder',
        vnfs: ['load_balancer', 'cache', 'transcoder']
      }
    ]);

    return () => {
      clearInterval(interval);
    };
  }, [selectedChain]);

  const fetchChains = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/v1/chains');
      setChains(response.data.chains || []);
    } catch (error) {
      showSnackbar('Failed to fetch service chains', 'error');
    }
    setLoading(false);
  };

  const fetchAvailableVNFs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/vnf/instances');
      setAvailableVNFs(response.data.vnfs || []);
    } catch (error) {
      showSnackbar('Failed to fetch available VNFs', 'error');
    }
  };

  const fetchChainMetrics = async (chainId) => {
    try {
      // Simulate fetching chain metrics
      const metrics = {
        latency: Math.random() * 100,
        throughput: Math.random() * 1000,
        packetLoss: Math.random() * 2,
        vnfMetrics: formData.vnfs.map(vnf => ({
          id: vnf.id,
          cpu: Math.random() * 100,
          memory: Math.random() * 100,
          packets: Math.floor(Math.random() * 10000)
        }))
      };
      setChainMetrics(prevMetrics => ({
        ...prevMetrics,
        [chainId]: metrics
      }));
    } catch (error) {
      console.error('Failed to fetch chain metrics:', error);
    }
  };

  const handleCreateChain = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/v1/chains', formData);
      setChains([...chains, response.data]);
      setOpenDialog(false);
      showSnackbar('Service chain created successfully', 'success');
      fetchChains();
    } catch (error) {
      showSnackbar('Failed to create service chain', 'error');
    }
  };

  const handleDeleteChain = async (chainId) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/chains/${chainId}`);
      setChains(chains.filter(chain => chain.id !== chainId));
      showSnackbar('Service chain deleted successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to delete service chain', 'error');
    }
  };

  const handleChainAction = async (chain, action) => {
    try {
      await axios.post(`http://localhost:8000/api/v1/chains/${chain.id}/${action}`);
      showSnackbar(`Chain ${action} successful`, 'success');
      fetchChains();
    } catch (error) {
      showSnackbar(`Failed to ${action} chain`, 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'configuring': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const updateChainFlow = (chain) => {
    // Create nodes and edges for the flow diagram
    const newNodes = chain.vnfs.map((vnf, index) => ({
      id: vnf.id.toString(),
      type: 'vnfNode',
      position: { x: index * 250, y: 100 },
      data: {
        label: vnf.name,
        type: vnf.type,
        status: vnf.status
      }
    }));

    const newEdges = chain.vnfs.slice(0, -1).map((vnf, index) => ({
      id: `e${vnf.id}-${chain.vnfs[index + 1].id}`,
      source: vnf.id.toString(),
      target: chain.vnfs[index + 1].id.toString(),
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed }
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  };

  const handleSaveTemplate = () => {
    if (selectedChain) {
      const template = {
        id: Date.now(),
        name: newTemplate.name,
        description: newTemplate.description,
        vnfs: selectedChain.vnfs.map(vnf => vnf.type)
      };
      setTemplates([...templates, template]);
      setTemplateDialog(false);
      setNewTemplate({ name: '', description: '', vnfs: [], policies: [] });
      showSnackbar('Template saved successfully', 'success');
    }
  };

  const handleAddPolicy = () => {
    if (selectedChain) {
      const updatedChain = {
        ...selectedChain,
        policies: [...(selectedChain.policies || []), newPolicy]
      };
      // Update chain with new policy
      handleChainAction(updatedChain, 'update');
      setPolicyDialog(false);
      setNewPolicy({ name: '', type: 'traffic', conditions: [], actions: [] });
      showSnackbar('Policy added successfully', 'success');
    }
  };

  const renderPolicyDialog = () => (
    <Dialog open={policyDialog} onClose={() => setPolicyDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Add Traffic Policy</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Policy Name"
              value={newPolicy.name}
              onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Policy Type"
              value={newPolicy.type}
              onChange={(e) => setNewPolicy({ ...newPolicy, type: e.target.value })}
            >
              <MenuItem value="traffic">Traffic Control</MenuItem>
              <MenuItem value="qos">QoS Policy</MenuItem>
              <MenuItem value="security">Security Policy</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>Conditions</Typography>
            {newPolicy.conditions.map((condition, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={condition}
                  onChange={(e) => {
                    const newConditions = [...newPolicy.conditions];
                    newConditions[index] = e.target.value;
                    setNewPolicy({ ...newPolicy, conditions: newConditions });
                  }}
                />
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => setNewPolicy({
                ...newPolicy,
                conditions: [...newPolicy.conditions, '']
              })}
            >
              Add Condition
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>Actions</Typography>
            {newPolicy.actions.map((action, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={action}
                  onChange={(e) => {
                    const newActions = [...newPolicy.actions];
                    newActions[index] = e.target.value;
                    setNewPolicy({ ...newPolicy, actions: newActions });
                  }}
                />
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => setNewPolicy({
                ...newPolicy,
                actions: [...newPolicy.actions, '']
              })}
            >
              Add Action
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setPolicyDialog(false)}>Cancel</Button>
        <Button
          onClick={handleAddPolicy}
          variant="contained"
          disabled={!newPolicy.name || newPolicy.conditions.length === 0 || newPolicy.actions.length === 0}
        >
          Add Policy
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderTemplateDialog = () => (
    <Dialog open={templateDialog} onClose={() => setTemplateDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Save as Template</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Template Name"
              value={newTemplate.name}
              onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              value={newTemplate.description}
              onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setTemplateDialog(false)}>Cancel</Button>
        <Button
          onClick={handleSaveTemplate}
          variant="contained"
          disabled={!newTemplate.name}
        >
          Save Template
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Service Function Chains</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchChains}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Create Chain
          </Button>
        </Box>
      </Box>

      {/* Service Chains List */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>VNFs</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Performance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chains.map((chain) => (
              <TableRow key={chain.id}>
                <TableCell>{chain.name}</TableCell>
                <TableCell>{chain.description}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {chain.vnfs.map((vnf, index) => (
                      <React.Fragment key={vnf.id}>
                        <Chip
                          label={vnf.name}
                          size="small"
                          variant="outlined"
                        />
                        {index < chain.vnfs.length - 1 && (
                          <ChainIcon fontSize="small" color="action" />
                        )}
                      </React.Fragment>
                    ))}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip
                    label={chain.status || 'inactive'}
                    color={getStatusColor(chain.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {chainMetrics[chain.id] && (
                    <Tooltip title={`
                      Latency: ${chainMetrics[chain.id].latency.toFixed(2)}ms
                      Throughput: ${chainMetrics[chain.id].throughput.toFixed(2)}Mbps
                      Packet Loss: ${chainMetrics[chain.id].packetLoss.toFixed(2)}%
                    `}>
                      <PerformanceIcon color={
                        chainMetrics[chain.id].latency > 100 ? 'error' : 'success'
                      } />
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedChain(chain);
                        updateChainFlow(chain);
                      }}
                    >
                      <FlowIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleChainAction(chain, chain.status === 'active' ? 'stop' : 'start')}
                    >
                      {chain.status === 'active' ? <StopIcon /> : <StartIcon />}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteChain(chain.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Chain Visualization */}
      {selectedChain && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Chain Flow: {selectedChain.name}</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={showMetrics}
                  onChange={(e) => setShowMetrics(e.target.checked)}
                />
              }
              label="Show Metrics"
            />
          </Box>
          <Box sx={{ height: 400 }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
            >
              <Controls />
              <Background />
            </ReactFlow>
          </Box>
          {showMetrics && chainMetrics[selectedChain.id] && (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2">End-to-End Latency</Typography>
                  <Typography variant="h6">
                    {chainMetrics[selectedChain.id].latency.toFixed(2)} ms
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2">Throughput</Typography>
                  <Typography variant="h6">
                    {chainMetrics[selectedChain.id].throughput.toFixed(2)} Mbps
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2">Packet Loss</Typography>
                  <Typography variant="h6">
                    {chainMetrics[selectedChain.id].packetLoss.toFixed(2)}%
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Paper>
      )}

      {/* Templates Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Chain Templates</Typography>
          {selectedChain && (
            <Button
              startIcon={<SaveIcon />}
              onClick={() => setTemplateDialog(true)}
            >
              Save as Template
            </Button>
          )}
        </Box>
        <Grid container spacing={2}>
          {templates.map((template) => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{template.name}</Typography>
                  <Typography color="textSecondary" variant="body2">
                    {template.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Stack direction="row" spacing={1}>
                      {template.vnfs.map((vnf, index) => (
                        <React.Fragment key={index}>
                          <Chip label={vnf} size="small" />
                          {index < template.vnfs.length - 1 && (
                            <ChainIcon fontSize="small" color="action" />
                          )}
                        </React.Fragment>
                      ))}
                    </Stack>
                  </Box>
                </CardContent>
                <Box sx={{ p: 1 }}>
                  <Button
                    fullWidth
                    onClick={() => {
                      setFormData({
                        name: `${template.name}-${Date.now()}`,
                        description: template.description,
                        vnfs: template.vnfs.map(type => ({
                          id: Date.now() + Math.random(),
                          name: `${type}-${Date.now()}`,
                          type
                        })),
                        policies: []
                      });
                      setOpenDialog(true);
                    }}
                  >
                    Use Template
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Create Chain Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Service Chain</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Chain Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Select VNFs for the Chain
              </Typography>
              <List>
                {formData.vnfs.map((vnf, index) => (
                  <ListItem key={vnf.id}>
                    <ListItemIcon>
                      <ChainIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={vnf.name}
                      secondary={`Type: ${vnf.type}`}
                    />
                    <IconButton
                      size="small"
                      onClick={() => {
                        const newVNFs = [...formData.vnfs];
                        newVNFs.splice(index, 1);
                        setFormData({ ...formData, vnfs: newVNFs });
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
                <ListItem>
                  <TextField
                    select
                    fullWidth
                    label="Add VNF"
                    value=""
                    onChange={(e) => {
                      const vnf = availableVNFs.find(v => v.id === e.target.value);
                      if (vnf) {
                        setFormData({
                          ...formData,
                          vnfs: [...formData.vnfs, vnf]
                        });
                      }
                    }}
                  >
                    {availableVNFs
                      .filter(vnf => !formData.vnfs.find(v => v.id === vnf.id))
                      .map((vnf) => (
                        <MenuItem key={vnf.id} value={vnf.id}>
                          {vnf.name} ({vnf.type})
                        </MenuItem>
                      ))}
                  </TextField>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateChain}
            variant="contained"
            disabled={!formData.name || formData.vnfs.length < 2}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Render dialogs */}
      {renderTemplateDialog()}
      {renderPolicyDialog()}

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
    </Box>
  );
};

export default ServiceChaining; 