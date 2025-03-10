import type { Theme } from '@mui/material';
import type { ComponentsOverrides } from '@mui/material/styles/overrides';

export const inputLabel = (): ComponentsOverrides<Theme>['MuiInputLabel'] => ({
  root: {
    // changed transform moves the shrink inputLabel outside of the inputfield's border
    transform: 'translate(14px, 25px) scale(1)',
    '&.MuiInputLabel-shrink': {
      transform: 'translate(2px, -12px) scale(1)',
    },
  },
});
