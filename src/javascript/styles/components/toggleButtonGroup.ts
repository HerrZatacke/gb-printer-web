import type { Theme } from '@mui/system';
import type { ComponentsOverrides } from '@mui/material/styles/overrides';
import { alpha } from '@mui/material';

export const toggleButtonGroup = (theme: Theme): ComponentsOverrides<Theme>['MuiToggleButtonGroup'] => ({
  grouped: {
    variants: [
      ...['primary', 'secondary', 'tertiary'].map((color) => ({
        props: { color },
        style: {
          '&.Mui-selected': {
            background: theme.palette[color].main,
            color: theme.palette[color].contrastText,
            '&:hover': {
              backgroundColor: alpha(theme.palette[color].main, 0.7),
            },
          },
          '&:hover': {
            backgroundColor: alpha(theme.palette[color].main, 0.4),
          },
        },
      })),
    ],
  },
});
