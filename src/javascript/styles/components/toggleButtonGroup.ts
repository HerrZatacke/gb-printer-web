import type { Theme } from '@mui/system';
import type { Components } from '@mui/material/styles/components';
import { alpha } from '@mui/material';

export const toggleButtonGroup = (theme: Theme): Components['MuiToggleButtonGroup'] => ({
  styleOverrides: {
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
  },
  defaultProps: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    color: 'tertiary',
  },
});
