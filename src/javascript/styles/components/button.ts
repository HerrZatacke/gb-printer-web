import type { Theme } from '@mui/material';
import type { ComponentsOverrides } from '@mui/material/styles/overrides';
import { getHoverColor } from '../tools/getHoverColor';

export const muiButton = (theme: Theme): ComponentsOverrides<Theme>['MuiButton'] => ({
  root: {
    fontSize: '13px',
    textTransform: 'none',
    minHeight: '40px',

    variants: [
      ...(['primary', 'secondary', 'tertiary'] as ('primary' | 'secondary' | 'tertiary')[]).map((color) => ({
        props: { color },
        style: {
          ':hover': {
            backgroundColor: getHoverColor(theme.palette, theme.palette[color]),
          },
        },
      })),
    ],
  },
});
