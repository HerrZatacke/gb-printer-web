import { createTheme } from '@mui/material';
import type { Theme } from '@mui/material';
import { muiButton } from './components/button';

const dark: Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#b3acbe',
    },
    secondary: {
      main: '#455c63',
    },
  },
});

const light: Theme = createTheme({
  palette: {
    primary: {
      main: '#292037',
    },
    secondary: {
      main: '#283539',
    },
  },
});

export const lightTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: muiButton(light),
    },
  },
}, light);

export const darkTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: muiButton(dark),
    },
  },
}, dark);
