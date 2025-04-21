import type { Theme } from '@mui/system';
import type { ComponentsOverrides } from '@mui/material/styles/overrides';

export const tabs = (theme: Theme): ComponentsOverrides<Theme>['MuiTabs'] => ({
  root: {
    '&~.MuiTabPanel-root': {
      padding: 0,
      marginTop: theme.spacing(2),
    },
    '& .MuiTabScrollButton-root.Mui-disabled': {
      opacity: 0.25,
    },
  },
});
