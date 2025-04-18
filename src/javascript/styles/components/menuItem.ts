import type { Theme } from '@mui/system';
import { alpha } from '@mui/material';
import type { ComponentsOverrides } from '@mui/material/styles/overrides';

export const menuItem = (theme: Theme): ComponentsOverrides<Theme>['MuiMenuItem'] => ({
  root: {
    '&.Mui-selected': {
      backgroundColor: alpha(theme.palette.secondary.main, 0.8),
      color: theme.palette.secondary.contrastText,
      '&:hover,&.Mui-focusVisible': {
        backgroundColor: theme.palette.secondary.main,
      },
    },
  },
});
