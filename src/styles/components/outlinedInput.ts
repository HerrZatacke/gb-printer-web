import type { Components } from '@mui/material/styles';
import type { Theme } from '@mui/system';

export const outlinedInput = (theme: Theme): Components['MuiOutlinedInput'] => ({
  styleOverrides: {
    root: {
      background: theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
      color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
      '.MuiInputBase-inputMultiline': {
        fontSize: '13px',
        lineHeight: '16px',
        fontFamily: 'monospace',
      },
      // hide the legend because shrink inputLabel is outside of the inputfield's border
      '.MuiOutlinedInput-notchedOutline legend span': {
        display: 'none',
      },
    },
  },
});
