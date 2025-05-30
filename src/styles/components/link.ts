import type { Components } from '@mui/material/styles';

export const link = (): Components['MuiLink'] => ({
  styleOverrides: {
    root: {
      color: 'inherit',
    },
  },
});
