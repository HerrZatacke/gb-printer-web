import type { Theme } from '@mui/system';
import type { ComponentsOverrides } from '@mui/material/styles/overrides';

export const dialogTitle = (theme: Theme): ComponentsOverrides<Theme>['MuiDialogTitle'] => ({
  root: {
    backgroundColor: theme.palette.primary[theme.palette.mode],
    color: theme.palette.primary.contrastText,

    // the '&&' is workaround for https://github.com/mui/material-ui/issues/27851
    '&& + .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
  },
});
