import type { Theme } from '@mui/system';
import type { ComponentsOverrides } from '@mui/material/styles/overrides';

export const muiButton = (theme: Theme): ComponentsOverrides<Theme>['MuiButton'] => ({
  root: {
    fontSize: '13px',
    textTransform: 'none',
    minHeight: '40px',

    variants: [
      ...['primary', 'secondary', 'tertiary'].map((color) => ({
        props: { color },
        style: {
          '&.MuiButton-outlined': {
            // background: theme.palette[color].main,
            color: theme.palette[color].light,
            borderColor: theme.palette[color].light,
            // '&:hover': {
            //   backgroundColor: alpha(theme.palette[color].main, 0.7),
            // },
          },
          // '&:hover': {
          //   backgroundColor: alpha(theme.palette[color].main, 0.4),
          // },
        },
      })),
    ],
  },
});
