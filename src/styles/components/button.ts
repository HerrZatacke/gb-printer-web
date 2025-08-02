import { alpha } from '@mui/material';
import type { Components } from '@mui/material/styles';
import type { Theme } from '@mui/system';

export const button = (theme: Theme): Components['MuiButton'] => ({
  styleOverrides: {
    root: {
      fontSize: '13px',
      textTransform: 'none',
      minHeight: '40px',

    },
  },
  variants: [
    ...(['primary', 'secondary', 'tertiary'] as ('primary' | 'secondary')[]).map((color) => ({
      props: { color },
      style: {
        '&.MuiButton-outlined': {
          // background: theme.palette[color].main,
          color: theme.palette[color].light,
          borderColor: theme.palette[color].light,
          '&:hover': {
            backgroundColor: alpha(theme.palette[color].main, 0.25),
          },
          '&.Mui-disabled': {
            backgroundColor: alpha(theme.palette.fgtext.main, 0.33),
            color: theme.palette.fgtext.main,
            borderColor: theme.palette.fgtext.main,
            opacity: 0.4,
          },
        },
        // '&:hover': {
        //   backgroundColor: alpha(theme.palette[color].main, 0.4),
        // },
      },
    })),
  ],
});
