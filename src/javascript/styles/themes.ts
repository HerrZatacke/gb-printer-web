import type { Theme } from '@mui/material';
import { generateTheme } from './tools/generateTheme';


const common = {
  colorInfo: '#3f769e',
  colorSuccess: '#3f9e7c',
  colorWarn: '#8b7b2c',
  colorError: '#cb0003',
};

export const darkTheme: Theme = generateTheme({
  mode: 'dark',
  colorPrimary: '#b3acbe',
  colorSecondary: '#455c63',
  colorTertiary: '#4a6959',
  colorPageBackground: '#2a292b',
  colorText: '#b2b2b2',
  ...common,
});
export const lightTheme: Theme = generateTheme({
  mode: 'light',
  colorPrimary: '#292037',
  colorSecondary: '#283539',
  colorTertiary: '#273931',
  colorPageBackground: '#d6d3dc',
  colorText: '#333333',
  ...common,
});
