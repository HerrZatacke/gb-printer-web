import type { Theme } from '@mui/system';
import type { ComponentsOverrides } from '@mui/material/styles/overrides';

export const dialogContent = (): ComponentsOverrides<Theme>['MuiDialogContent'] => ({
  root: {
    scrollbarGutter: 'stable',
    overflowY: 'scroll',
  },
});
