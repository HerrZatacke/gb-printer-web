import type { Components } from '@mui/material/styles';

export const list = (): Components['MuiList'] => ({
  styleOverrides: {
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
  },
});
