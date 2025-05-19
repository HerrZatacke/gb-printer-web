import type { Components } from '@mui/material/styles';

export const formControl = (): Components['MuiFormControl'] => ({
  styleOverrides: {
    // add padding to have space for the shrink inputLabel outside of the inputfield's border
    root: {
      paddingTop: 16,

      '.MuiStack-root &:first-of-type': {
        marginTop: 12,
      },
    },
  },
});
