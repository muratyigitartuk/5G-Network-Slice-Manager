import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@mui/material';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTranslation } from 'react-i18next';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const MonitoringDashboard = () => {
  const { t } = useTranslation();
  
  // Sample data for charts
  const timeLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
  
  const trafficData = {
    labels: timeLabels,
    datasets: [
      {
        label: t('monitoringDashboard.networkTrafficGbps'),
        data: [10, 15, 30, 25, 35, 20],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };
  
  const latencyData = {
    labels: timeLabels,
    datasets: [
      {
        label: t('monitoringDashboard.sliceTypes.embb'),
        data: [12, 18, 15, 10, 20, 15],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4
      },
      {
        label: t('monitoringDashboard.sliceTypes.urllc'),
        data: [5, 8, 7, 6, 9, 6],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4
      },
      {
        label: t('monitoringDashboard.sliceTypes.mmtc'),
        data: [25, 35, 30, 20, 40, 30],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4
      }
    ]
  };
  
  const resourceData = {
    labels: [
      t('monitoringDashboard.resources.cpu'), 
      t('monitoringDashboard.resources.memory'), 
      t('monitoringDashboard.resources.storage'), 
      t('monitoringDashboard.resources.network')
    ],
    datasets: [
      {
        label: t('monitoringDashboard.resourceUtilizationPercent'),
        data: [65, 75, 40, 55],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const sliceDistribution = {
    labels: [
      t('monitoringDashboard.sliceTypes.embb'), 
      t('monitoringDashboard.sliceTypes.urllc'), 
      t('monitoringDashboard.sliceTypes.mmtc')
    ],
    datasets: [
      {
        data: [40, 25, 35],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('monitoringDashboard.title')}
      </Typography>
      <Typography variant="body1" paragraph>
        {t('monitoringDashboard.description')}
      </Typography>
      
      <Grid container spacing={3}>
        {/* Traffic Trends */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title={t('monitoringDashboard.networkTrafficTrends')} />
            <Divider />
            <CardContent>
              <Line 
                data={trafficData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: t('monitoringDashboard.gbps')
                      }
                    }
                  }
                }}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>
        
        {/* Latency Comparison */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title={t('monitoringDashboard.latencyBySliceType')} />
            <Divider />
            <CardContent>
              <Line 
                data={latencyData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: t('monitoringDashboard.ms')
                      }
                    }
                  }
                }}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>
        
        {/* Resource Utilization */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title={t('monitoringDashboard.resourceUtilization')} />
            <Divider />
            <CardContent>
              <Bar 
                data={resourceData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: {
                        display: true,
                        text: '%'
                      }
                    }
                  }
                }}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>
        
        {/* Slice Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title={t('monitoringDashboard.sliceDistribution')} />
            <Divider />
            <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ width: '70%', height: 300 }}>
                <Doughnut 
                  data={sliceDistribution}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right'
                      }
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MonitoringDashboard; 