import type { Components } from '@mui/material/styles';

export const select = (): Components['MuiSelect'] => ({
  styleOverrides: {
    select: {
      display: 'flex',

      '.MuiListItemIcon-root': {
        minWidth: 32,
        flexDirection: 'column',
        justifyContent: 'center',
      },
    },
  },
  defaultProps: {
    displayEmpty: true,
  },
});
