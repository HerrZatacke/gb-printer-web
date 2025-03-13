import type { Theme } from '@mui/system';
import type { ComponentsOverrides } from '@mui/material/styles/overrides';
import { getHoverColor } from '../tools/getHoverColor';

export const toggleButtonGroup = (theme: Theme): ComponentsOverrides<Theme>['MuiToggleButtonGroup'] => ({
  grouped: {
    variants: [
      ...['primary', 'secondary', 'tertiary'].map((color) => ({
        props: { color },
        style: {
          '&.Mui-selected': {
            background: theme.palette[color].main,
            color: theme.palette[color].contrastText,
            ':hover': {
              backgroundColor: getHoverColor(theme.palette, theme.palette[color]),
            },
          },
        },
      })),
    ],
  },
});
