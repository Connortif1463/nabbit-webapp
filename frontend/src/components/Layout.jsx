import React from 'react';
import { Container, Box } from '@mui/material';

const Layout = ({ children }) => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        my: 4,
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {children}
      </Box>
    </Container>
  );
};

export default Layout;