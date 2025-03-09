import type { Theme } from '@mui/material';
import { alpha } from '@mui/material';
import type { ComponentsOverrides } from '@mui/material/styles/overrides';

export const tab = (theme: Theme): ComponentsOverrides<Theme>['MuiTab'] => ({
  root: {
    fontSize: 16,
    textTransform: 'none',
    minHeight: 60,

    '&:hover': {
      backgroundColor: alpha(theme.palette.secondary.main, 0.3),
    },
  },
});
