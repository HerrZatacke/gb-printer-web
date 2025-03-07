import { useEffect, useState, useMemo } from 'react';
import type { Theme as MuiTheme } from '@mui/material';
import { darkTheme, lightTheme } from '../styles/themes';

export enum Theme {
  BRIGHT = 'theme-bright',
  DARK = 'theme-dark',
}

export interface UseTheme {
  theme: Theme,
  setTheme: (theme: Theme) => void,
  muiTheme: MuiTheme,
}

export const useTheme = (): UseTheme => {
  const [theme, setTheme] = useState<Theme>(localStorage.getItem('gbp-web-theme') as Theme || Theme.BRIGHT);

  useEffect(() => {
    localStorage.setItem('gbp-web-theme', theme);
    const classList = document.querySelector('html')?.classList;
    if (!classList) {
      return;
    }

    [Theme.BRIGHT, Theme.DARK].forEach((oldTheme) => {
      if (oldTheme === theme) {
        classList.add(theme);
      } else {
        classList.remove(oldTheme);
      }
    });

  }, [theme]);

  const muiTheme = useMemo<MuiTheme>(() => (
    theme === Theme.BRIGHT ? lightTheme : darkTheme
  ), [theme]);

  return {
    theme,
    setTheme,
    muiTheme,
  };
};
