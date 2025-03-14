import type { Theme } from '@mui/system';
import { alpha } from '@mui/material';
import type { ComponentsOverrides } from '@mui/material/styles/overrides';

export const tab = (theme: Theme): ComponentsOverrides<Theme>['MuiTab'] => ({
  root: {
    fontSize: 16,
    textTransform: 'none',
    minHeight: 60,

    '&.Mui-selected': {
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
      color: 'inherit',
    },

    '&:hover': {
      backgroundColor: alpha(theme.palette.secondary.main, 0.35),
    },
  },
});
