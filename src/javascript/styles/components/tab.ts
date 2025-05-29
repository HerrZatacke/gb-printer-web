import { alpha } from '@mui/material';
import type { Components } from '@mui/material/styles';
import type { Theme } from '@mui/system';

export const tab = (theme: Theme): Components['MuiTab'] => ({
  styleOverrides: {
    root: {
      fontSize: 16,
      textTransform: 'none',
      minHeight: 60,

      '&.Mui-selected': {
        backgroundColor: alpha(theme.palette.primary.main, 0.2),
        color: 'inherit',
      },

      '&:hover': {
        backgroundColor: alpha(theme.palette.secondary.main, 0.35),
      },
    },
  },
});
