import type { Theme } from '@mui/material';
import type { ComponentsOverrides } from '@mui/material/styles/overrides';
import { getHoverColor } from '../tools/getHoverColor';

export const muiButton = (theme: Theme): ComponentsOverrides<Theme>['MuiButton'] => ({
  root: {
    borderRadius: 0,
    fontSize: '13px',
    textTransform: 'none',
    minHeight: '40px',

    variants: [
      ...(['primary', 'secondary'] as ('primary' | 'secondary')[]).map((color) => ({
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
