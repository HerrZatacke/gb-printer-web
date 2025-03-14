import type { Theme } from '@mui/system';
import type { Theme as ThemedTheme } from '@mui/material';
import type { ComponentsOverrides } from '@mui/material/styles/overrides';

export const toolbar = (theme: Theme): ComponentsOverrides<Theme>['MuiToolbar'] => ({
  root: {
    [theme.breakpoints.up('xs')]: {
      minHeight: 'var(--navigation-min-height)',
    },

    justifyContent: 'end',

    '& .MuiButton-root': {
      minHeight: 'var(--navigation-min-height)',
      padding: '8px 18px',
      fontSize: (theme as ThemedTheme).typography.body1.fontSize,
      fontWeight: (theme as ThemedTheme).typography.body1.fontWeight,
    },

    '& .MuiIconButton-root': {
      height: 'calc(var(--navigation-min-height) * 0.8)',
      width: 'calc(var(--navigation-min-height) * 0.8)',
      padding: '10px',
    },

    '& .MuiButtonGroup-horizontal': {
      paddingRight: '6px',
    },

    '& .MuiSvgIcon-root': {
      fontSize: '1.8rem',
    },
  },
});
