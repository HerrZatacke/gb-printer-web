import type { Theme } from '@mui/material';
import type { ComponentsOverrides } from '@mui/material/styles/overrides';

export const outlinedInput = (theme: Theme): ComponentsOverrides<Theme>['MuiOutlinedInput'] => ({
  root: {
    background: theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
    '.MuiInputBase-inputMultiline': {
      fontSize: '13px',
      lineHeight: '16px',
      fontFamily: 'monospace',
    },
  },
});
