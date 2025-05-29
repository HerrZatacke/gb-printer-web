import type { Theme as ThemedTheme } from '@mui/material';
import type { Components } from '@mui/material/styles';
import type { Theme } from '@mui/system';

export const toolbar = (theme: Theme): Components['MuiToolbar'] => ({
  styleOverrides: {
    root: {
      [theme.breakpoints.up('xs')]: {
        // Just Override stringer MUI selector
        minHeight: 'var(--navigation-height)',
      },

      justifyContent: 'end',

      '& .MuiButton-root': {
        height: 'var(--navigation-height)',
        padding: '0 20px',
        fontSize: (theme as ThemedTheme).typography.body1.fontSize,
      },

      '& .MuiButtonGroup-horizontal': {
        paddingRight: '8px',
      },

      '& .MuiSvgIcon-root': {
        fontSize: '1.8rem',
      },
    },
  },
});
