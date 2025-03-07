import { alpha } from '@mui/material';
import type { Theme } from '@mui/material';
import type { ComponentsOverrides } from '@mui/material/styles/overrides';

export const muiButtonGroup = (theme: Theme): ComponentsOverrides<Theme>['MuiButtonGroup'] => ({
  root: {
    borderRadius: 0,
  },
  firstButton: {
    borderRightColor: alpha(theme.palette.background.default, 0.33),
  },
  middleButton: {
    borderRightColor: alpha(theme.palette.background.default, 0.33),
  },
});
