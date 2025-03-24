import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';

/**
 * LanguageSwitcher component - allows users to switch between supported languages
 * 
 * @param {Object} props Component props
 * @param {string} props.variant - 'button' or 'icon' to determine display style
 * @param {Object} props.sx - Additional styles to apply to the component
 */
const LanguageSwitcher = ({ variant = 'icon', sx = {} }) => {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  
  const currentLanguage = i18n.language || 'en';
  
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  const handleChangeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    handleCloseMenu();
  };
  
  // Language options with translation keys
  const languages = [
    { code: 'en', name: t('language.en') },
    { code: 'de', name: t('language.de') }
  ];
  
  // Return either button or icon variant
  return (
    <>
      {variant === 'button' ? (
        <Button
          onClick={handleOpenMenu}
          startIcon={<LanguageIcon />}
          sx={{ ...sx }}
          aria-label={t('settings.language')}
          aria-haspopup="true"
          aria-expanded={Boolean(anchorEl) ? 'true' : 'false'}
          aria-controls="language-menu"
        >
          {languages.find(lang => lang.code === currentLanguage)?.name || t('language.en')}
        </Button>
      ) : (
        <Tooltip title={t('settings.language')}>
          <IconButton
            onClick={handleOpenMenu}
            color="inherit"
            sx={{ ...sx }}
            aria-label={t('settings.language')}
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl) ? 'true' : 'false'}
            aria-controls="language-menu"
          >
            <LanguageIcon />
          </IconButton>
        </Tooltip>
      )}
      
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleChangeLanguage(language.code)}
            selected={currentLanguage === language.code}
            sx={{
              minWidth: 150,
              fontWeight: currentLanguage === language.code ? 'bold' : 'normal'
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 30, 
              visibility: currentLanguage === language.code ? 'visible' : 'hidden'
            }}>
              {currentLanguage === language.code && '✓'}
            </ListItemIcon>
            <ListItemText>{language.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

LanguageSwitcher.propTypes = {
  variant: PropTypes.oneOf(['button', 'icon']),
  sx: PropTypes.object
};

export default LanguageSwitcher; 