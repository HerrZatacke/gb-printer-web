import { createTheme, lighten } from '@mui/material';
import type { Components, Theme, PaletteMode } from '@mui/material';
import { muiButton } from '../components/button';
import { muiButtonGroup } from '../components/buttonGroup';
import { outlinedInput } from '../components/outlinedInput';
import { paper } from '../components/paper';

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
    bg: Palette['primary'];
  }

  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
    bg?: PaletteOptions['primary'];
  }
}


const themeComponents = (theme: Theme): Components<Theme> => ({
  MuiButton: {
    styleOverrides: muiButton(theme),
  },
  MuiButtonGroup: {
    styleOverrides: muiButtonGroup(theme),
  },
  MuiOutlinedInput: {
    styleOverrides: outlinedInput(theme),
  },
  MuiPaper: {
    styleOverrides: paper(),
  },
});

export const generateTheme = (
  mode: PaletteMode,
  colorPrimary: string,
  colorSecondary: string,
  colorTertiary: string,
  colorPageBackground: string,
): Theme => {
  const theme: Theme = createTheme({
    palette: {
      mode,
      primary: {
        main: colorPrimary,
      },
      secondary: {
        main: colorSecondary,
      },
      background: {
        default: colorPageBackground,
        paper: lighten(colorPageBackground, mode === 'light' ? 0.6 : 0.1),
        // default: '#ff0000',
        // paper: '#00ff00',
      },
    },
  });

  const withPalette = createTheme({
    palette: {
      tertiary: theme.palette.augmentColor({
        color: {
          main: colorTertiary,
        },
        name: 'tertiary',
      }),
      bg: theme.palette.augmentColor({
        color: {
          main: colorPageBackground,
        },
        name: 'bg',
      }),
    },
  }, theme);

  return createTheme({
    components: themeComponents(withPalette),
  }, withPalette);
};
