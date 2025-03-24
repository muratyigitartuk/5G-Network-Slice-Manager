import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Grid,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CompliantIcon,
  Warning as WarningIcon,
  Error as NonCompliantIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const FrameworkDetails = ({ framework, onBack }) => {
  const [editMode, setEditMode] = useState(false);
  const [openControlDialog, setOpenControlDialog] = useState(false);
  const [selectedControl, setSelectedControl] = useState(null);
  const [controlFilter, setControlFilter] = useState('all');

  // Helper function to render status chip
  const renderStatusChip = (status) => {
    switch (status) {
      case 'compliant':
        return <Chip label="Compliant" color="success" size="small" icon={<CompliantIcon />} />;
      case 'warning':
        return <Chip label="Needs Attention" color="warning" size="small" icon={<WarningIcon />} />;
      case 'non-compliant':
        return <Chip label="Non-Compliant" color="error" size="small" icon={<NonCompliantIcon />} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const handleOpenControlDialog = (control) => {
    setSelectedControl(control);
    setOpenControlDialog(true);
  };

  const handleCloseControlDialog = () => {
    setOpenControlDialog(false);
    setSelectedControl(null);
  };

  const handleControlFilterChange = (event) => {
    setControlFilter(event.target.value);
  };

  const filteredControls = framework.controls.filter(control => {
    if (controlFilter === 'all') return true;
    return control.status === controlFilter;
  });

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={onBack} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">
          {framework.name}
        </Typography>
      </Box>

      {/* Framework Overview */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Framework Overview</Typography>
            <Box>
              {renderStatusChip(framework.status)}
            </Box>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="body1" paragraph>
                {framework.description}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {framework.details}
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Compliance Progress
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={framework.compliance} 
                  color={framework.compliance >= 90 ? "success" : framework.compliance >= 70 ? "warning" : "error"}
                  sx={{ height: 10, borderRadius: 5, mb: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    {framework.compliance}% Compliant
                  </Typography>
                  <Typography variant="body2">
                    {framework.compliantControls} of {framework.totalControls} controls
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Framework Details
                </Typography>
                <Divider sx={{ mb: 1 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Last Assessment:</Typography>
                  <Typography variant="body2">{framework.lastAssessment}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Critical Issues:</Typography>
                  <Typography variant="body2" color={framework.criticalIssues > 0 ? "error.main" : "success.main"}>
                    {framework.criticalIssues}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Next Review:</Typography>
                  <Typography variant="body2">{framework.nextReview}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Owner:</Typography>
                  <Typography variant="body2">{framework.owner}</Typography>
                </Box>
                
                <Box sx={{ mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<AssignmentIcon />} 
                    fullWidth
                    size="small"
                  >
                    Generate Report
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Controls Section */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Controls ({filteredControls.length})</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="control-filter-label">Filter</InputLabel>
                <Select
                  labelId="control-filter-label"
                  value={controlFilter}
                  label="Filter"
                  onChange={handleControlFilterChange}
                >
                  <MenuItem value="all">All Controls</MenuItem>
                  <MenuItem value="compliant">Compliant</MenuItem>
                  <MenuItem value="warning">Needs Attention</MenuItem>
                  <MenuItem value="non-compliant">Non-Compliant</MenuItem>
                </Select>
              </FormControl>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                size="small"
              >
                Add Control
              </Button>
            </Box>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <TableContainer component={Paper} variant="outlined">
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Control Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredControls.map((control) => (
                  <TableRow
                    key={control.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {control.id}
                    </TableCell>
                    <TableCell>{control.name}</TableCell>
                    <TableCell>{control.category}</TableCell>
                    <TableCell>{renderStatusChip(control.status)}</TableCell>
                    <TableCell>{control.lastUpdated}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenControlDialog(control)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Control Details Dialog */}
      {selectedControl && (
        <Dialog
          open={openControlDialog}
          onClose={handleCloseControlDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Control Details: {selectedControl.id} - {selectedControl.name}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Control ID"
                  value={selectedControl.id}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !editMode }}
                />
                <TextField
                  label="Control Name"
                  value={selectedControl.name}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !editMode }}
                />
                <TextField
                  label="Category"
                  value={selectedControl.category}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: !editMode }}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedControl.status}
                    label="Status"
                    disabled={!editMode}
                  >
                    <MenuItem value="compliant">Compliant</MenuItem>
                    <MenuItem value="warning">Needs Attention</MenuItem>
                    <MenuItem value="non-compliant">Non-Compliant</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Last Updated"
                  value={selectedControl.lastUpdated}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label="Updated By"
                  value={selectedControl.updatedBy}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label="Evidence"
                  value={selectedControl.evidence || "No evidence provided"}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  InputProps={{ readOnly: !editMode }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Description
                </Typography>
                <TextField
                  value={selectedControl.description}
                  fullWidth
                  multiline
                  rows={3}
                  InputProps={{ readOnly: !editMode }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Implementation Notes
                </Typography>
                <TextField
                  value={selectedControl.implementationNotes || "No implementation notes provided"}
                  fullWidth
                  multiline
                  rows={3}
                  InputProps={{ readOnly: !editMode }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            {!editMode ? (
              <>
                <Button onClick={handleCloseControlDialog}>Close</Button>
                <Button 
                  startIcon={<EditIcon />} 
                  variant="contained"
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </Button>
              </>
            ) : (
              <>
                <Button 
                  startIcon={<CancelIcon />} 
                  onClick={() => setEditMode(false)}
                  color="error"
                >
                  Cancel
                </Button>
                <Button 
                  startIcon={<SaveIcon />} 
                  variant="contained"
                  onClick={() => {
                    setEditMode(false);
                    handleCloseControlDialog();
                  }}
                >
                  Save
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default FrameworkDetails; 