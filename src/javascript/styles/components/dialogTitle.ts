import type { Theme } from '@mui/system';
import type { ComponentsOverrides } from '@mui/material/styles/overrides';

export const dialogTitle = (theme: Theme): ComponentsOverrides<Theme>['MuiDialogTitle'] => ({
  root: {
    backgroundColor: theme.palette.primary[theme.palette.mode],
    color: theme.palette.primary.contrastText,
  },
});
