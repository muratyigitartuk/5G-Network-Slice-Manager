import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
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
  IconButton,
  Chip,
  Stack,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Backup as BackupIcon,
  Restore as RestoreIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import PropTypes from 'prop-types';

const BackupRecovery = ({ slice }) => {
  const [backups, setBackups] = useState([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [backupName, setBackupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulated backup data
  useEffect(() => {
    setBackups([
      {
        id: 1,
        name: 'Daily Backup',
        timestamp: '2024-02-20 08:00:00',
        size: '2.5 MB',
        type: 'automatic',
        status: 'completed'
      },
      {
        id: 2,
        name: 'Pre-Update Backup',
        timestamp: '2024-02-19 15:30:00',
        size: '2.3 MB',
        type: 'manual',
        status: 'completed'
      },
      {
        id: 3,
        name: 'Weekly Backup',
        timestamp: '2024-02-18 00:00:00',
        size: '2.4 MB',
        type: 'automatic',
        status: 'completed'
      }
    ]);
  }, []);

  const handleCreateBackup = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newBackup = {
        id: backups.length + 1,
        name: backupName,
        timestamp: new Date().toLocaleString(),
        size: '2.5 MB',
        type: 'manual',
        status: 'completed'
      };
      
      setBackups([newBackup, ...backups]);
      setCreateDialogOpen(false);
      setBackupName('');
    } catch (error) {
      setError('Failed to create backup');
    }
    setLoading(false);
  };

  const handleRestoreBackup = async () => {
    if (!selectedBackup) return;
    
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      setRestoreDialogOpen(false);
      setSelectedBackup(null);
    } catch (error) {
      setError('Failed to restore backup');
    }
    setLoading(false);
  };

  const handleDeleteBackup = async (backupId) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBackups(backups.filter(b => b.id !== backupId));
    } catch (error) {
      setError('Failed to delete backup');
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2">
            Backup & Recovery
          </Typography>
          <Button
            variant="contained"
            startIcon={<BackupIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Backup
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {backups.map((backup) => (
                <TableRow key={backup.id}>
                  <TableCell>{backup.name}</TableCell>
                  <TableCell>{backup.timestamp}</TableCell>
                  <TableCell>{backup.size}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={backup.type}
                      color={backup.type === 'automatic' ? 'primary' : 'secondary'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={backup.status}
                      color={getStatusColor(backup.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedBackup(backup);
                          setRestoreDialogOpen(true);
                        }}
                      >
                        <RestoreIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteBackup(backup.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton size="small">
                        <DownloadIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create Backup Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
        <DialogTitle>Create New Backup</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Backup Name"
            fullWidth
            value={backupName}
            onChange={(e) => setBackupName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateBackup}
            variant="contained"
            disabled={!backupName || loading}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Restore Backup Dialog */}
      <Dialog open={restoreDialogOpen} onClose={() => setRestoreDialogOpen(false)}>
        <DialogTitle>Restore Backup</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to restore the backup &quot;{selectedBackup?.name}&quot;?
            This will override the current network slice configuration.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestoreDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleRestoreBackup}
            variant="contained"
            color="warning"
            disabled={loading}
          >
            Restore
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

BackupRecovery.propTypes = {
  slice: PropTypes.object.isRequired
};

export default BackupRecovery; 