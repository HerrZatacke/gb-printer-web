import type { Components } from '@mui/material/styles';
import type { Theme } from '@mui/system';

export const tabs = (theme: Theme): Components['MuiTabs'] => ({
  styleOverrides: {
    root: {
      '&~.MuiTabPanel-root': {
        padding: 0,
        marginTop: theme.spacing(2),
      },
      '& .MuiTabScrollButton-root.Mui-disabled': {
        opacity: 0.25,
      },
    },
  },
  defaultProps: {
    scrollButtons: 'auto',
    indicatorColor: 'secondary',
    variant: 'scrollable',
  },
});
