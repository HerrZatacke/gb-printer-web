import type { Components } from '@mui/material/styles';

export const switchc = (): Components['MuiSwitch'] => ({
  defaultProps: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    color: 'tertiary',
  },
});
