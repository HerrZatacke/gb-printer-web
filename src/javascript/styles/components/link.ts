import type { Theme } from '@mui/system';
import type { ComponentsOverrides } from '@mui/material/styles/overrides';

export const link = (): ComponentsOverrides<Theme>['MuiLink'] => ({
  root: {
    color: 'inherit',
  },
});
