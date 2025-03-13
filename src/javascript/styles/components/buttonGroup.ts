import { alpha } from '@mui/material';
import type { Theme } from '@mui/system';
import type { ComponentsOverrides } from '@mui/material/styles/overrides';

export const muiButtonGroup = (theme: Theme): ComponentsOverrides<Theme>['MuiButtonGroup'] => ({
  firstButton: {
    borderRightColor: alpha(theme.palette.background.default, 0.33),
  },
  middleButton: {
    borderRightColor: alpha(theme.palette.background.default, 0.33),
  },
});
