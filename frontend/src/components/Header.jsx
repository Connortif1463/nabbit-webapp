import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Header = ({ onLogoClick }) => {
  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          onClick={onLogoClick}
          sx={{ 
            cursor: 'pointer',
            fontWeight: 'bold',
            color: 'primary.main'
          }}
        >
          Nabbit
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
      </Toolbar>
    </AppBar>
  );
};

export default Header;