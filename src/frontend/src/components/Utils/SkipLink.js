import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

/**
 * Styled component for the skip link
 * The skip link is visually hidden until it receives focus
 */
const StyledSkipLink = styled.a`
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: white;
  padding: 8px;
  z-index: 100;
  transition: top 0.3s;
  
  &:focus {
    top: 0;
  }
`;

/**
 * SkipLink component for accessibility
 * Allows keyboard users to skip navigation and go directly to main content
 * 
 * @param {Object} props - Component props
 * @param {string} props.mainContentId - ID of the main content element to skip to
 * @param {string} props.label - Custom label for the skip link (optional)
 */
const SkipLink = ({ mainContentId, label }) => {
  const { t } = useTranslation();
  
  return (
    <StyledSkipLink 
      href={`#${mainContentId}`}
      aria-label={label || t('accessibility.skipToContent')}
    >
      {label || t('accessibility.skipToContent')}
    </StyledSkipLink>
  );
};

// Add PropTypes
SkipLink.propTypes = {
  /**
   * ID of the main content element to skip to
   */
  mainContentId: PropTypes.string.isRequired,
  /**
   * Custom label for the skip link
   */
  label: PropTypes.string
};

export default SkipLink; 