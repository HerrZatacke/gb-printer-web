import type { Components } from '@mui/material/styles';

export const inputLabel = (): Components['MuiInputLabel'] => ({
  styleOverrides: {
    root: {
      // changed transform moves the shrink inputLabel outside of the inputfield's border
      transform: 'translate(14px, 25px) scale(1)',
      '&.MuiInputLabel-shrink': {
        transform: 'translate(2px, -12px) scale(1)',
      },
    },
  },
});
