import { createTheme, lighten } from '@mui/material';
import type { Components, Theme, PaletteMode } from '@mui/material';
import { muiButton } from '../components/button';
import { muiButtonGroup } from '../components/buttonGroup';
import { toggleButtonGroup } from '../components/toggleButtonGroup';
import { outlinedInput } from '../components/outlinedInput';
import { paper } from '../components/paper';
import { tab } from '../components/tab';
import { inputLabel } from '../components/inputLabel';
import { formControl } from '../components/formControl';
import { cardContent } from '../components/cardContent';

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
  MuiToggleButtonGroup: {
    styleOverrides: toggleButtonGroup(theme),
  },
  MuiOutlinedInput: {
    styleOverrides: outlinedInput(theme),
  },
  MuiPaper: {
    styleOverrides: paper(),
  },
  MuiTab: {
    styleOverrides: tab(theme),
  },
  MuiInputLabel: {
    styleOverrides: inputLabel(),
  },
  MuiFormControl: {
    styleOverrides: formControl(),
  },
  MuiCardContent: {
    styleOverrides: cardContent(),
  },
});

interface GenerateThemeArgs {
  mode: PaletteMode,
  colorPrimary: string,
  colorSecondary: string,
  colorTertiary: string,
  colorSuccess: string,
  colorWarn: string,
  colorError: string,
  colorPageBackground: string,
  colorText: string,
}

export const generateTheme = ({
  mode,
  colorPrimary,
  colorSecondary,
  colorTertiary,
  colorSuccess,
  colorWarn,
  colorError,
  colorPageBackground,
  colorText,
}: GenerateThemeArgs): Theme => {
  const theme: Theme = createTheme({
    shape: {
      borderRadius: 0,
    },
    typography: {
      fontFamily: '"Trebuchet MS", Helvetica, sans-serif',
      body1: {
        fontSize: 16,
      },
      body2: {
        fontSize: 13,
      },
      h2: {
        fontSize: 20,
      },
      h3: {
        fontSize: 20,
      },
    },
    palette: {
      mode,
      primary: {
        main: colorPrimary,
      },
      secondary: {
        main: colorSecondary,
      },
      success: {
        main: colorSuccess,
      },
      warning: {
        main: colorWarn,
      },
      error: {
        main: colorError,
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
      text: {
        primary: colorText,
      },
    },
  }, theme);

  return createTheme({
    typography: {
      fontFamily: '"Trebuchet MS", Helvetica, sans-serif',
      body1: {
        color: colorText,
      },
      body2: {
        color: colorText,
      },
      h2: {
        color: withPalette.palette.primary.main,
      },
      h3: {
        color: withPalette.palette.primary.main,
      },
    },
    components: themeComponents(withPalette),
  }, withPalette);
};
