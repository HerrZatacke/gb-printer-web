import { createTheme, lighten } from '@mui/material';
import type { Components, PaletteMode, Theme } from '@mui/material';
import { blend } from '@mui/system';
import { appBar } from '@/styles/components/appBar';
import { button } from '@/styles/components/button';
import { cardActionArea } from '@/styles/components/cardActionArea';
import { cardContent } from '@/styles/components/cardContent';
import { dialogTitle } from '@/styles/components/dialogTitle';
import { formControl } from '@/styles/components/formControl';
import { inputLabel } from '@/styles/components/inputLabel';
import { link } from '@/styles/components/link';
import { list } from '@/styles/components/list';
import { menuItem } from '@/styles/components/menuItem';
import { outlinedInput } from '@/styles/components/outlinedInput';
import { paper } from '@/styles/components/paper';
import { select } from '@/styles/components/select';
import { switch_ } from '@/styles/components/switch';
import { tab } from '@/styles/components/tab';
import { tabs } from '@/styles/components/tabs';
import { textField } from '@/styles/components/textField';
import { toggleButtonGroup } from '@/styles/components/toggleButtonGroup';
import { toolbar } from '@/styles/components/toolbar';

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
  MuiAppBar: appBar(theme),
  MuiButton: button(theme),
  MuiCardActionArea: cardActionArea(),
  MuiCardContent: cardContent(),
  MuiDialogTitle: dialogTitle(theme),
  MuiFormControl: formControl(),
  MuiInputLabel: inputLabel(),
  MuiLink: link(),
  MuiList: list(),
  MuiMenuItem: menuItem(theme),
  MuiOutlinedInput: outlinedInput(theme),
  MuiPaper: paper(),
  MuiSelect: select(),
  MuiSwitch: switch_(),
  MuiTab: tab(theme),
  MuiTabs: tabs(theme),
  MuiTextField: textField(),
  MuiToggleButtonGroup: toggleButtonGroup(theme),
  MuiToolbar: toolbar(theme),
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
    // cssVariables: true,
    shape: {
      borderRadius: 0,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 570, // GalleryHeader and EditRGBN switch orientation, max-width of Navigation-Drawer and ImageGroups-TreeView, Buttons on Palette Page change direction
        md: 768, // Main-Container-padding changes, All Dialogs go fullscreen
        lg: 1024, // Dialog max-width
        xl: 1264, // Layout max-width
      },
    },
    typography: {
      fontFamily: '"Trebuchet MS", Helvetica, sans-serif',
      body1: {
        fontSize: 16,
      },
      body2: {
        fontSize: 13,
      },
      h1: {
        fontSize: 30,
        fontWeight: 'bold',
      },
      h2: {
        fontSize: 24,
        fontWeight: 'bold',
      },
      h3: {
        fontSize: 20,
        fontWeight: 'bold',
      },
      h4: {
        fontSize: 18,
        fontWeight: 'bold',
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
        paper: lighten(colorPageBackground, mode === 'light' ? 0.6 : 0.02),
        // default: '#ff0000',
        // paper: '#00ff00',
      },
    },
  });

  const withPalette = createTheme(theme, {
    palette: {
      tertiary: theme.palette.augmentColor({
        color: {
          main: colorTertiary,
        },
        name: 'tertiary',
      }),
      fgtext: theme.palette.augmentColor({
        color: {
          main: colorText,
        },
        name: 'fgtext',
      }),
      bg: theme.palette.augmentColor({
        color: {
          main: colorPageBackground,
        },
        name: 'bg',
      }),
      text: {
        primary: colorText,
        secondary: colorText,
      },
    },
  });

  const colorHeadline = blend(withPalette.palette.primary.main, colorText, 0.7);

  return createTheme(withPalette, {
    typography: {
      fontFamily: '"Trebuchet MS", Helvetica, sans-serif',
      body1: {
        color: colorText,
      },
      body2: {
        color: colorText,
      },
      h1: {
        color: colorHeadline,
      },
      h2: {
        color: colorHeadline,
      },
      h3: {
        color: colorHeadline,
      },
      h4: {
        color: colorHeadline,
      },
    },
    components: themeComponents(withPalette),
  });
};
