import type { Theme } from '@mui/system';
import type { Components } from '@mui/material/styles/components';

export const appBar = (theme: Theme): Components['MuiAppBar'] => ({
  styleOverrides: {
    root: {
    },
  },
  variants: [
    ...(['primary', 'secondary'] as ('primary' | 'secondary')[]).map((color) => ({
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
} as Components['MuiAppBar']);
