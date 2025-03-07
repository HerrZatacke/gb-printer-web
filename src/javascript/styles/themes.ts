import { createTheme } from '@mui/material';
import type { Theme } from '@mui/material';
import { muiButton } from './components/button';
import { muiButtonGroup } from './components/buttonGroup';

const dark: Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#b3acbe',
    },
    secondary: {
      main: '#455c63',
    },
    background: {
      default: '#2a292b',
      paper: '#414043',
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
    background: {
      default: '#d6d3dc',
      paper: '#c5c2ca',
    },
  },
});

export const lightTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: muiButton(light),
    },
    MuiButtonGroup: {
      styleOverrides: muiButtonGroup(light),
    },
  },
}, light);

export const darkTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: muiButton(dark),
    },
    MuiButtonGroup: {
      styleOverrides: muiButtonGroup(dark),
    },
  },
}, dark);
