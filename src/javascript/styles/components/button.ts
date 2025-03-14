import type { Theme } from '@mui/system';
import type { ComponentsOverrides } from '@mui/material/styles/overrides';

export const muiButton = (): ComponentsOverrides<Theme>['MuiButton'] => ({
  root: {
    fontSize: '13px',
    textTransform: 'none',
    minHeight: '40px',
  },
});
