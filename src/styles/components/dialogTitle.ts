import type { Components } from '@mui/material/styles';
import type { Theme } from '@mui/system';

export const dialogTitle = (theme: Theme): Components['MuiDialogTitle'] => ({
  styleOverrides: {
    root: {
      backgroundColor: theme.palette.primary[theme.palette.mode],
      color: theme.palette.primary.contrastText,

      // the '&&' is workaround for https://github.com/mui/material-ui/issues/27851
      '&& + .MuiDialogContent-root': {
        padding: theme.spacing(2),
      },
    },
  },
});
