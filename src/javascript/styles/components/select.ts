import type { Theme } from '@mui/system';
import type { ComponentsOverrides } from '@mui/material/styles/overrides';

export const select = (): ComponentsOverrides<Theme>['MuiSelect'] => ({
  select: {
    display: 'flex',

    '.MuiListItemIcon-root': {
      minWidth: 32,
      flexDirection: 'column',
      justifyContent: 'center',
    },
  },
});
