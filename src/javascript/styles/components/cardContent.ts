import type { Theme } from '@mui/material';
import type { ComponentsOverrides } from '@mui/material/styles/overrides';

export const cardContent = (): ComponentsOverrides<Theme>['MuiCardContent'] => ({
  root: {
    padding: '24px 16px',
  },
});
