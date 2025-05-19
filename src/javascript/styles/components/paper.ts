import type { Components } from '@mui/material/styles';

export const paper = (): Components['MuiPaper'] => ({
  styleOverrides: {
    root: {
      backgroundImage: 'none',
    },
  },
});
