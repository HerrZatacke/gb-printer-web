import React, { useMemo } from 'react';
import type { PropsWithChildren } from 'react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/system';

function MuiCleanThemeProvider({ children }: PropsWithChildren) {
  const theme = useTheme();

  // can be removed after https://github.com/mui/mui-x/issues/14684
  const cleanTheme = useMemo<Theme>((): Theme => {
    if (!theme.components?.MuiTextField) {
      return theme;
    }

    const textFieldTheme = {
      ...theme.components.MuiTextField,
    };

    if (textFieldTheme.defaultProps?.slotProps?.htmlInput) {
      delete textFieldTheme.defaultProps.slotProps.htmlInput;
    }

    return ({
      ...theme,
      components: {
        ...theme.components,
        MuiTextField: textFieldTheme,
      },
    });
  }, [theme]);

  return (
    <ThemeProvider theme={cleanTheme}>
      {children}
    </ThemeProvider>
  );
}

export default MuiCleanThemeProvider;
