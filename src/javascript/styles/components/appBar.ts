import type { Theme } from '@mui/system';
import type { ComponentsOverrides } from '@mui/material/styles/overrides';

export const appBar = (theme: Theme): ComponentsOverrides<Theme>['MuiAppBar'] => ({
  root: {
    minHeight: 'var(--navigation-min-height)',

    variants: [
      ...['primary', 'secondary', 'tertiary'].map((color) => ({
        props: { color },

        style: {
          '--AppBar-background': theme.palette[color].dark,
          '--AppBar-color': theme.palette[color].contrastText,

          '& .MuiButton-root.active': {
            backgroundColor: theme.palette[color === 'primary' ? 'secondary' : 'primary'].main,
          },

          '& .MuiButton-root:hover': {
            backgroundColor: theme.palette[color].light,
            color: theme.palette[color].contrastText,
          },

          '& .MuiIconButton-root:hover': {
            backgroundColor: theme.palette[color].light,
            color: theme.palette[color].contrastText,
          },
        },
      })),
    ],
  },
});
