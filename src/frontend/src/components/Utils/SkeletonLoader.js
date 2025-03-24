import React from 'react';
import { Box, Skeleton, Card, CardContent, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

/**
 * SkeletonLoader component for displaying loading placeholders
 * Supports various types of skeleton loading patterns
 * 
 * @param {Object} props Component props
 * @param {string} props.type Type of skeleton to render ('card', 'table', 'list', 'text', 'dashboard')
 * @param {number} props.rows Number of rows to render (for table or list)
 * @param {number} props.cols Number of columns per row (for table)
 * @param {number} props.height Height to apply (for specific types)
 * @param {Object} props.sx Additional styles to apply to the container
 */
const SkeletonLoader = ({ type = 'text', rows = 3, cols = 4, height, sx = {} }) => {
  const theme = useTheme();
  
  // Render a text skeleton with multiple lines
  const renderTextSkeleton = () => (
    <Box sx={{ width: '100%', ...sx }}>
      <Skeleton animation="wave" height={28} width="60%" />
      {Array(rows).fill(0).map((_, i) => (
        <Skeleton 
          key={i} 
          animation="wave" 
          height={20} 
          width={`${100 - (i * 5)}%`} 
          sx={{ mt: 1 }} 
        />
      ))}
    </Box>
  );
  
  // Render card loading skeletons
  const renderCardSkeleton = () => (
    <Card sx={{ width: '100%', ...sx }} variant="outlined">
      <CardContent>
        <Skeleton animation="wave" height={32} width="80%" sx={{ mb: 2 }} />
        <Skeleton animation="wave" height={18} />
        <Skeleton animation="wave" height={18} width="90%" />
        <Skeleton animation="wave" height={18} width="60%" />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Skeleton animation="wave" height={36} width={80} />
        </Box>
      </CardContent>
    </Card>
  );
  
  // Render table loading skeleton
  const renderTableSkeleton = () => (
    <Box sx={{ width: '100%', ...sx }}>
      <Box sx={{ display: 'flex', mb: 1 }}>
        {Array(cols).fill(0).map((_, i) => (
          <Skeleton 
            key={i} 
            animation="wave" 
            height={48} 
            sx={{ 
              flex: 1,
              mr: i < cols - 1 ? 1 : 0,
              borderRadius: '4px'
            }} 
          />
        ))}
      </Box>
      
      {Array(rows).fill(0).map((_, rowIndex) => (
        <Box 
          key={rowIndex} 
          sx={{ 
            display: 'flex', 
            py: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          {Array(cols).fill(0).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              animation="wave" 
              height={24} 
              sx={{ 
                flex: 1,
                mr: colIndex < cols - 1 ? 1 : 0,
                opacity: 1 - (rowIndex * 0.1),
                borderRadius: '4px'
              }} 
            />
          ))}
        </Box>
      ))}
    </Box>
  );
  
  // Render list loading skeleton
  const renderListSkeleton = () => (
    <Box sx={{ width: '100%', ...sx }}>
      {Array(rows).fill(0).map((_, i) => (
        <Box 
          key={i} 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            py: 1,
            borderBottom: i < rows - 1 ? `1px solid ${theme.palette.divider}` : 'none',
          }}
        >
          <Skeleton 
            animation="wave" 
            variant="circular" 
            width={40} 
            height={40} 
            sx={{ mr: 2 }} 
          />
          <Box sx={{ flex: 1 }}>
            <Skeleton animation="wave" height={20} width="80%" />
            <Skeleton animation="wave" height={16} width="60%" />
          </Box>
          <Skeleton animation="wave" width={60} height={32} />
        </Box>
      ))}
    </Box>
  );
  
  // Render dashboard widget skeletons
  const renderDashboardSkeleton = () => (
    <Grid container spacing={2} sx={{ ...sx }}>
      {/* Stats cards */}
      <Grid item xs={12} md={12}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          {Array(4).fill(0).map((_, i) => (
            <Card key={i} sx={{ flex: '1 1 200px', minWidth: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' } }}>
              <CardContent>
                <Skeleton animation="wave" height={24} width="60%" />
                <Skeleton animation="wave" height={36} width="40%" sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Grid>
      
      {/* Main chart */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Skeleton animation="wave" height={32} width="50%" sx={{ mb: 2 }} />
            <Skeleton 
              animation="wave" 
              variant="rectangular" 
              height={240} 
              sx={{ borderRadius: 1 }} 
            />
          </CardContent>
        </Card>
      </Grid>
      
      {/* Side panel */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Skeleton animation="wave" height={32} width="70%" sx={{ mb: 2 }} />
            {Array(5).fill(0).map((_, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Skeleton animation="wave" variant="circular" width={32} height={32} sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton animation="wave" height={16} width="70%" />
                </Box>
                <Skeleton animation="wave" height={16} width={40} />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
  
  // Determine which type of skeleton to render
  switch (type) {
    case 'card':
      return renderCardSkeleton();
    case 'table':
      return renderTableSkeleton();
    case 'list':
      return renderListSkeleton();
    case 'dashboard':
      return renderDashboardSkeleton();
    case 'text':
    default:
      return renderTextSkeleton();
  }
};

export default SkeletonLoader; 