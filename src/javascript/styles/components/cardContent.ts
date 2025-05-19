import type { Components } from '@mui/material/styles';

export const cardContent = (): Components['MuiCardContent'] => ({
  styleOverrides: {
    root: {
      padding: '24px 16px',
    },
  },
});
