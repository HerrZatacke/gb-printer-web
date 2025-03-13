import type { Theme } from '@mui/system';
import type { ComponentsOverrides } from '@mui/material/styles/overrides';

export const formControl = (): ComponentsOverrides<Theme>['MuiFormControl'] => ({
  // add padding to have space for the shrink inputLabel outside of the inputfield's border
  root: {
    paddingTop: 16,
  },
});
