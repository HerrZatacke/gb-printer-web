import type { Components } from '@mui/material/styles';

export const cardActionArea = (): Components['MuiCardActionArea'] => ({
  styleOverrides: {
    root: {
      height: '100%',
      '.MuiCardActionArea-focusHighlight': {
        background: 'transparent',
      },
    },
  },
});
