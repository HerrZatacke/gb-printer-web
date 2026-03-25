import { alpha } from '@mui/material';
import { type Components } from '@mui/material/styles';
import { type Theme } from '@mui/system';


export const listItemButton = (theme: Theme): Components['MuiListItemButton'] => ({
  styleOverrides: {
    root: {
      '&.active': {
        background: alpha(theme.palette.secondary.light, 0.3),
        color: theme.palette.secondary.contrastText,
      },
      '&:hover': {
        background: alpha(theme.palette.primary.main, 0.3),
      },
    },
  },
});
