import type { Theme } from '@mui/system';
import type { ComponentsOverrides } from '@mui/material/styles/overrides';

export const list = (): ComponentsOverrides<Theme>['MuiList'] => ({
  root: {
    '.MuiListSubheader-root': {
      display: 'flex',

      '.MuiListItemIcon-root': {
        minWidth: 32,
        flexDirection: 'column',
        justifyContent: 'center',
      },
    },
  },
});
