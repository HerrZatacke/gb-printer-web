import { alpha } from '@mui/material';
import type { Components } from '@mui/material/styles';
import type { Theme } from '@mui/system';

export const menuItem = (theme: Theme): Components['MuiMenuItem'] => ({
  styleOverrides: {
    root: {
      '&.Mui-selected': {
        backgroundColor: alpha(theme.palette.secondary.main, 0.8),
        color: theme.palette.secondary.contrastText,
        '&:hover,&.Mui-focusVisible': {
          backgroundColor: theme.palette.secondary.main,
        },
      },
    },
  },
});
