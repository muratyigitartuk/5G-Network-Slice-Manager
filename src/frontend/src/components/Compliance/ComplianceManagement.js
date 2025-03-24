import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Divider,
  Button,
  Chip,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Security as SecurityIcon,
  CheckCircle as CompliantIcon,
  Warning as WarningIcon,
  Error as NonCompliantIcon,
  Assignment as AuditIcon,
  Description as PolicyIcon,
  Timeline as TimelineIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Add as AddIcon
} from '@mui/icons-material';
import FrameworkDetails from './FrameworkDetails';

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`compliance-tabpanel-${index}`}
      aria-labelledby={`compliance-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ComplianceManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [complianceData, setComplianceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for compliance overview
  const mockComplianceData = {
    overallScore: 78,
    frameworks: [
      { 
        id: 1, 
        name: 'GDPR', 
        description: 'General Data Protection Regulation',
        details: 'The General Data Protection Regulation (GDPR) is a regulation in EU law on data protection and privacy in the European Union and the European Economic Area. It addresses the transfer of personal data outside the EU and EEA areas.',
        compliance: 85, 
        status: 'warning',
        lastAssessment: '2023-05-15',
        nextReview: '2023-08-15',
        owner: 'Jane Smith',
        criticalIssues: 2,
        totalControls: 42,
        compliantControls: 36,
        controls: [
          {
            id: 'GDPR-1',
            name: 'Lawful Basis for Processing',
            category: 'Data Processing',
            status: 'compliant',
            lastUpdated: '2023-05-10',
            updatedBy: 'John Doe',
            description: 'Ensure personal data is processed lawfully, fairly and in a transparent manner.',
            implementationNotes: 'All data processing activities are documented and have a lawful basis.',
            evidence: 'Data processing register updated on 2023-05-01'
          },
          {
            id: 'GDPR-2',
            name: 'Data Subject Rights',
            category: 'Individual Rights',
            status: 'compliant',
            lastUpdated: '2023-05-12',
            updatedBy: 'Jane Smith',
            description: 'Implement mechanisms to handle data subject requests (access, rectification, erasure, etc.).',
            implementationNotes: 'Request handling procedures are in place and tested.',
            evidence: 'Subject access request log and procedure document'
          },
          {
            id: 'GDPR-3',
            name: 'Data Protection Impact Assessment',
            category: 'Risk Management',
            status: 'warning',
            lastUpdated: '2023-04-28',
            updatedBy: 'Mike Johnson',
            description: 'Conduct DPIAs for high-risk processing activities.',
            implementationNotes: 'DPIA process is defined but not consistently applied.',
            evidence: 'DPIA template and two completed assessments'
          },
          {
            id: 'GDPR-4',
            name: 'Data Breach Notification',
            category: 'Security',
            status: 'warning',
            lastUpdated: '2023-05-05',
            updatedBy: 'Sarah Williams',
            description: 'Implement procedures to detect, report and investigate personal data breaches.',
            implementationNotes: 'Breach notification procedure needs updating to reflect new organizational structure.',
            evidence: 'Incident response plan dated 2022-11-15'
          },
          {
            id: 'GDPR-5',
            name: 'International Data Transfers',
            category: 'Data Transfer',
            status: 'non-compliant',
            lastUpdated: '2023-04-15',
            updatedBy: 'John Doe',
            description: 'Ensure appropriate safeguards for transfers of personal data outside the EU/EEA.',
            implementationNotes: 'Current transfer mechanisms need to be reviewed following Schrems II decision.',
            evidence: 'None'
          }
        ]
      },
      { 
        id: 2, 
        name: 'ISO 27001', 
        description: 'Information Security Management',
        details: 'ISO/IEC 27001 is an international standard on how to manage information security. It specifies an information security management system (ISMS) to bring information security under management control.',
        compliance: 92, 
        status: 'compliant',
        lastAssessment: '2023-06-01',
        nextReview: '2023-09-01',
        owner: 'Robert Chen',
        criticalIssues: 0,
        totalControls: 38,
        compliantControls: 35,
        controls: [
          {
            id: 'ISO-1',
            name: 'Information Security Policy',
            category: 'Policies',
            status: 'compliant',
            lastUpdated: '2023-05-20',
            updatedBy: 'Robert Chen',
            description: 'Establish an information security policy that is approved by management and communicated to employees.',
            implementationNotes: 'Policy document is up to date and accessible to all employees.',
            evidence: 'Information Security Policy v3.2, approved 2023-04-15'
          },
          {
            id: 'ISO-2',
            name: 'Access Control',
            category: 'Security',
            status: 'compliant',
            lastUpdated: '2023-06-01',
            updatedBy: 'Lisa Wong',
            description: 'Implement access controls to ensure only authorized personnel can access information systems.',
            implementationNotes: 'Role-based access control is implemented across all systems.',
            evidence: 'Access control matrix and quarterly review logs'
          },
          {
            id: 'ISO-3',
            name: 'Risk Assessment',
            category: 'Risk Management',
            status: 'compliant',
            lastUpdated: '2023-05-15',
            updatedBy: 'Robert Chen',
            description: 'Conduct regular risk assessments to identify, analyze and evaluate information security risks.',
            implementationNotes: 'Risk assessment methodology is defined and applied quarterly.',
            evidence: 'Q2 2023 Risk Assessment Report'
          }
        ]
      },
      { 
        id: 3, 
        name: 'NIST CSF', 
        description: 'Cybersecurity Framework',
        details: 'The NIST Cybersecurity Framework (CSF) is a set of guidelines for private sector organizations to follow to be better prepared in identifying, detecting, and responding to cyber-attacks.',
        compliance: 68, 
        status: 'non-compliant',
        lastAssessment: '2023-04-22',
        nextReview: '2023-07-22',
        owner: 'Michael Brown',
        criticalIssues: 5,
        totalControls: 45,
        compliantControls: 31,
        controls: [
          {
            id: 'NIST-1',
            name: 'Asset Management',
            category: 'Identify',
            status: 'warning',
            lastUpdated: '2023-04-10',
            updatedBy: 'Michael Brown',
            description: 'Identify and maintain inventory of all physical and software assets.',
            implementationNotes: 'Asset inventory exists but is not regularly updated.',
            evidence: 'Asset inventory spreadsheet last updated 2023-02-15'
          },
          {
            id: 'NIST-2',
            name: 'Vulnerability Management',
            category: 'Protect',
            status: 'non-compliant',
            lastUpdated: '2023-03-30',
            updatedBy: 'David Lee',
            description: 'Identify, report, and correct information system flaws in a timely manner.',
            implementationNotes: 'No formal vulnerability management process in place.',
            evidence: 'None'
          },
          {
            id: 'NIST-3',
            name: 'Incident Response',
            category: 'Respond',
            status: 'non-compliant',
            lastUpdated: '2023-04-05',
            updatedBy: 'Michael Brown',
            description: 'Establish an incident response capability to prepare, detect, analyze, contain, and recover from cybersecurity incidents.',
            implementationNotes: 'Incident response plan is outdated and has not been tested.',
            evidence: 'Incident Response Plan dated 2021-11-10'
          }
        ]
      },
      { 
        id: 4, 
        name: '3GPP Security', 
        description: '3GPP Security Standards for 5G',
        details: 'The 3rd Generation Partnership Project (3GPP) security standards for 5G networks address authentication, encryption, integrity protection, and privacy.',
        compliance: 75, 
        status: 'warning',
        lastAssessment: '2023-05-30',
        nextReview: '2023-08-30',
        owner: 'Emily Johnson',
        criticalIssues: 3,
        totalControls: 36,
        compliantControls: 27,
        controls: [
          {
            id: '3GPP-1',
            name: 'Network Slice Authentication',
            category: 'Authentication',
            status: 'compliant',
            lastUpdated: '2023-05-25',
            updatedBy: 'Emily Johnson',
            description: 'Implement authentication mechanisms for network slice selection and access.',
            implementationNotes: 'Authentication mechanisms are implemented according to 3GPP specifications.',
            evidence: 'Authentication test results from 2023-05-20'
          },
          {
            id: '3GPP-2',
            name: 'Slice Isolation',
            category: 'Isolation',
            status: 'warning',
            lastUpdated: '2023-05-15',
            updatedBy: 'Thomas Wilson',
            description: 'Ensure proper isolation between network slices to prevent unauthorized access.',
            implementationNotes: 'Isolation mechanisms are in place but need additional testing.',
            evidence: 'Isolation test plan and partial results'
          },
          {
            id: '3GPP-3',
            name: 'Subscriber Privacy',
            category: 'Privacy',
            status: 'non-compliant',
            lastUpdated: '2023-04-28',
            updatedBy: 'Emily Johnson',
            description: 'Implement mechanisms to protect subscriber identity and location privacy.',
            implementationNotes: 'Privacy protection mechanisms are not fully implemented.',
            evidence: 'None'
          }
        ]
      }
    ],
    recentAudits: [
      {
        id: 1,
        name: 'Quarterly Security Audit',
        date: '2023-06-15',
        status: 'completed',
        findings: 8,
        criticalFindings: 2
      },
      {
        id: 2,
        name: 'GDPR Compliance Check',
        date: '2023-05-20',
        status: 'completed',
        findings: 5,
        criticalFindings: 1
      },
      {
        id: 3,
        name: 'Network Slice Security Assessment',
        date: '2023-06-01',
        status: 'in-progress',
        findings: null,
        criticalFindings: null
      }
    ],
    upcomingDeadlines: [
      {
        id: 1,
        name: 'GDPR Annual Review',
        dueDate: '2023-07-15',
        status: 'pending',
        daysLeft: 14
      },
      {
        id: 2,
        name: 'ISO 27001 Recertification',
        dueDate: '2023-08-30',
        status: 'pending',
        daysLeft: 60
      },
      {
        id: 3,
        name: 'Security Patch Implementation',
        dueDate: '2023-06-25',
        status: 'overdue',
        daysLeft: -5
      }
    ]
  };

  useEffect(() => {
    // Simulate API call to fetch compliance data
    setLoading(true);
    setTimeout(() => {
      setComplianceData(mockComplianceData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setComplianceData(mockComplianceData);
      setLoading(false);
    }, 1000);
  };

  const handleFrameworkSelect = (framework) => {
    setSelectedFramework(framework);
  };

  const handleBackToFrameworks = () => {
    setSelectedFramework(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Helper function to render status chip
  const renderStatusChip = (status) => {
    switch (status) {
      case 'compliant':
        return <Chip label="Compliant" color="success" size="small" icon={<CompliantIcon />} />;
      case 'warning':
        return <Chip label="Needs Attention" color="warning" size="small" icon={<WarningIcon />} />;
      case 'non-compliant':
        return <Chip label="Non-Compliant" color="error" size="small" icon={<NonCompliantIcon />} />;
      case 'pending':
        return <Chip label="Pending" color="primary" size="small" />;
      case 'completed':
        return <Chip label="Completed" color="success" size="small" />;
      case 'in-progress':
        return <Chip label="In Progress" color="info" size="small" />;
      case 'overdue':
        return <Chip label="Overdue" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  // Filter frameworks based on search term
  const filteredFrameworks = complianceData?.frameworks.filter(
    framework => framework.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                framework.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Compliance Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor and manage regulatory compliance across your network slices
          </Typography>
        </Box>
        <Button 
          startIcon={<RefreshIcon />} 
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress />
        </Box>
      ) : (
        <>
          {/* Compliance Score Overview */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SecurityIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Overall Compliance Score
                    </Typography>
                  </Box>
                  <Box sx={{ position: 'relative', display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
                    <Box
                      sx={{
                        position: 'relative',
                        width: 150,
                        height: 150,
                        borderRadius: '50%',
                        background: `radial-gradient(closest-side, white 79%, transparent 80% 100%),
                          conic-gradient(${complianceData.overallScore >= 90 ? '#4caf50' : 
                                          complianceData.overallScore >= 70 ? '#ff9800' : 
                                          '#f44336'} ${complianceData.overallScore}%, #eceff1 0)`,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="h3" component="div" color="text.primary">
                        {complianceData.overallScore}%
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {complianceData.overallScore >= 90 
                        ? 'Excellent compliance status' 
                        : complianceData.overallScore >= 70 
                          ? 'Good compliance with some issues to address' 
                          : 'Significant compliance issues need attention'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PolicyIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Compliance Frameworks
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    {complianceData.frameworks.map((framework) => (
                      <Grid item xs={12} sm={6} key={framework.id}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1">{framework.name}</Typography>
                            {renderStatusChip(framework.status)}
                          </Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {framework.description}
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={framework.compliance} 
                            color={framework.compliance >= 90 ? "success" : framework.compliance >= 70 ? "warning" : "error"}
                            sx={{ height: 8, borderRadius: 4, mb: 1 }}
                          />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">
                              {framework.compliance}% Compliant
                            </Typography>
                            <Typography variant="body2" color="error">
                              {framework.criticalIssues > 0 ? `${framework.criticalIssues} critical issues` : ''}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Tabs for different compliance views */}
          <Box sx={{ width: '100%', mb: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="compliance tabs">
                <Tab label="Dashboard" icon={<SecurityIcon />} iconPosition="start" />
                <Tab label="Frameworks" icon={<PolicyIcon />} iconPosition="start" />
                <Tab label="Audits" icon={<AuditIcon />} iconPosition="start" />
                <Tab label="Timeline" icon={<TimelineIcon />} iconPosition="start" />
              </Tabs>
            </Box>
            
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                {/* Recent Audits */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Recent Audits
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <List>
                        {complianceData.recentAudits.map((audit) => (
                          <ListItem key={audit.id} divider>
                            <ListItemIcon>
                              <AuditIcon color={audit.status === 'completed' ? 'success' : 'primary'} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={audit.name} 
                              secondary={`${audit.date} • ${audit.status === 'completed' ? 
                                `${audit.findings} findings (${audit.criticalFindings} critical)` : 
                                audit.status}`} 
                            />
                            {renderStatusChip(audit.status)}
                          </ListItem>
                        ))}
                      </List>
                      <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                        View All Audits
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Upcoming Deadlines */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Upcoming Deadlines
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <List>
                        {complianceData.upcomingDeadlines.map((deadline) => (
                          <ListItem key={deadline.id} divider>
                            <ListItemIcon>
                              <TimelineIcon color={deadline.status === 'overdue' ? 'error' : 'primary'} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={deadline.name} 
                              secondary={`Due: ${deadline.dueDate} • ${deadline.status === 'overdue' ? 
                                'Overdue' : `${deadline.daysLeft} days left`}`} 
                            />
                            {renderStatusChip(deadline.status)}
                          </ListItem>
                        ))}
                      </List>
                      <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                        View All Deadlines
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Placeholder for additional dashboard widgets */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Compliance Recommendations
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body1" paragraph>
                        Based on your current compliance status, here are the top recommendations:
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <WarningIcon color="warning" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Address NIST CSF critical findings" 
                            secondary="5 critical issues need immediate attention" 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <WarningIcon color="warning" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Complete security patch implementation" 
                            secondary="Overdue task with high security impact" 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <WarningIcon color="warning" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Prepare for GDPR annual review" 
                            secondary="Due in 14 days, requires documentation updates" 
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              {selectedFramework ? (
                <FrameworkDetails 
                  framework={selectedFramework} 
                  onBack={handleBackToFrameworks} 
                />
              ) : (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">
                      Compliance Frameworks
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        placeholder="Search frameworks..."
                        size="small"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Button 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        size="small"
                      >
                        Add Framework
                      </Button>
                    </Box>
                  </Box>
                  
                  <TableContainer component={Paper} variant="outlined">
                    <Table sx={{ minWidth: 650 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Framework</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Compliance</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Last Assessment</TableCell>
                          <TableCell>Critical Issues</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredFrameworks.map((framework) => (
                          <TableRow
                            key={framework.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {framework.name}
                            </TableCell>
                            <TableCell>{framework.description}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: '100%', mr: 1 }}>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={framework.compliance} 
                                    color={framework.compliance >= 90 ? "success" : framework.compliance >= 70 ? "warning" : "error"}
                                  />
                                </Box>
                                <Box sx={{ minWidth: 35 }}>
                                  <Typography variant="body2" color="text.secondary">{`${framework.compliance}%`}</Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>{renderStatusChip(framework.status)}</TableCell>
                            <TableCell>{framework.lastAssessment}</TableCell>
                            <TableCell>
                              <Typography color={framework.criticalIssues > 0 ? "error" : "success.main"}>
                                {framework.criticalIssues}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton 
                                color="primary" 
                                size="small"
                                onClick={() => handleFrameworkSelect(framework)}
                              >
                                <ViewIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6">
                Audit Management
              </Typography>
              <Typography variant="body1" paragraph>
                Audit management functionality will be implemented in the next step.
              </Typography>
            </TabPanel>
            
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6">
                Compliance Timeline
              </Typography>
              <Typography variant="body1" paragraph>
                Compliance timeline visualization will be implemented in the next step.
              </Typography>
            </TabPanel>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ComplianceManagement; 