'use client';

import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';
import { lightTheme } from '@/styles/themes';

function NavigationSkeleton() {
  return (
    <ThemeProvider theme={lightTheme}>
      <AppBar color="primary" enableColorOnDark position="sticky">
        <Container maxWidth="xl" disableGutters>
          <Toolbar disableGutters />
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}

export default NavigationSkeleton;
