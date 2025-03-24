import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardActions, 
  Skeleton, 
  Typography, 
  Box, 
  Divider,
  IconButton,
  Collapse,
  CircularProgress,
  Button,
  Tooltip
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import PropTypes from 'prop-types';

/**
 * A reusable Card component with standardized loading, error, and empty states
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.children - Card content
 * @param {boolean} props.loading - Whether the card is in loading state
 * @param {string} props.error - Error message if any
 * @param {Function} props.onRetry - Function to call when retry button is clicked
 * @param {boolean} props.isEmpty - Whether the card has no data to display
 * @param {string} props.emptyMessage - Message to display when card is empty
 * @param {React.ReactNode} props.headerAction - Additional action for the header
 * @param {React.ReactNode} props.footerActions - Actions to display in the footer
 * @param {boolean} props.collapsible - Whether the card is collapsible
 * @param {boolean} props.defaultExpanded - Whether the card is expanded by default
 * @param {Object} props.sx - Additional styles for the Card component
 */
const CardWithLoading = ({
  title,
  children,
  loading = false,
  error = null,
  onRetry = null,
  isEmpty = false,
  emptyMessage = 'No data available',
  headerAction = null,
  footerActions = null,
  collapsible = false,
  defaultExpanded = true,
  sx = {}
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Skeleton variant="rectangular" width="100%" height={50} />
          <Skeleton variant="rectangular" width="100%" height={100} />
          <Skeleton variant="rectangular" width="60%" height={30} />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <ErrorIcon color="error" sx={{ fontSize: 48, mb: 2 }} />
          <Typography color="error" gutterBottom>
            {error instanceof Error ? error.message : error}
          </Typography>
          {onRetry && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
              sx={{ mt: 2 }}
            >
              Retry
            </Button>
          )}
        </Box>
      );
    }

    if (isEmpty) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary" variant="body1">
            {emptyMessage}
          </Typography>
        </Box>
      );
    }

    return children;
  };

  const expandIcon = collapsible ? (
    <Tooltip title={expanded ? 'Collapse' : 'Expand'}>
      <IconButton
        onClick={handleExpandClick}
        size="small"
      >
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </IconButton>
    </Tooltip>
  ) : null;

  const action = (
    <>
      {loading && <CircularProgress size={24} sx={{ mr: 1 }} />}
      {headerAction}
      {expandIcon}
    </>
  );

  return (
    <Card sx={{ ...sx, overflow: 'visible' }}>
      <CardHeader 
        title={title} 
        action={action}
      />
      <Divider />
      <Collapse in={!collapsible || expanded} timeout="auto" unmountOnExit={false}>
        <CardContent sx={{ p: loading || error || isEmpty ? 0 : 2 }}>
          {renderContent()}
        </CardContent>
        {footerActions && (
          <>
            <Divider />
            <CardActions>
              {footerActions}
            </CardActions>
          </>
        )}
      </Collapse>
    </Card>
  );
};

CardWithLoading.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Error)]),
  onRetry: PropTypes.func,
  isEmpty: PropTypes.bool,
  emptyMessage: PropTypes.string,
  headerAction: PropTypes.node,
  footerActions: PropTypes.node,
  collapsible: PropTypes.bool,
  defaultExpanded: PropTypes.bool,
  sx: PropTypes.object
};

export default CardWithLoading; 