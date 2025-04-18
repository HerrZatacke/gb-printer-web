import type { Theme } from '@mui/system';
import type { ComponentsOverrides } from '@mui/material/styles/overrides';

export const cardActionArea = (): ComponentsOverrides<Theme>['MuiCardActionArea'] => ({
  root: {
    height: '100%',
    '.MuiCardActionArea-focusHighlight': {
      background: 'transparent',
    },
  },
});
